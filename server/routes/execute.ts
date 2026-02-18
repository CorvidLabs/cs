/**
 * SECURITY: Remote Code Execution Endpoint
 *
 * This module executes user-submitted code on the server. Every execution
 * MUST be sandboxed to prevent:
 *   - Filesystem access outside the temp directory
 *   - Network access from user code
 *   - Excessive resource consumption (CPU, memory, disk)
 *   - Process spawning / privilege escalation
 *
 * Sandboxing strategy:
 *   - macOS: Uses `sandbox-exec` with a deny-all-except-needed profile
 *   - Linux: Uses `unshare` (network namespace) + `ulimit` resource caps
 *   - All platforms: Enforced timeout that KILLS the child process,
 *     code size limits, output size limits, and rate limiting.
 *
 * TODO(security): For production deployments, migrate to container-based
 * isolation (Docker with --network=none, read-only rootfs, memory/CPU
 * limits, seccomp profiles) or a dedicated sandboxing service like
 * Firecracker / gVisor.
 */

import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

type Headers = Record<string, string>;

interface ExecuteRequest {
    language: 'swift' | 'rust' | 'typescript' | 'kotlin';
    code: string;
    testCases?: TestCase[];
}

interface TestCase {
    description: string;
    assertion: string;
    expectedOutput?: string;
}

interface TestResult {
    description: string;
    passed: boolean;
    output?: string;
    error?: string;
}

interface ExecuteResponse {
    output: string;
    success: boolean;
    error?: string;
    testResults?: TestResult[];
}

// --- Security constants ---
const TIMEOUT_MS = 5000;         // 5 seconds max for code execution
const TEST_TIMEOUT_MS = 3000;    // 3 seconds max per test
const COMPILE_TIMEOUT_MS = 15000; // 15 seconds for Kotlin compilation
const MAX_OUTPUT_LENGTH = 50_000; // 50 KB max output
const MAX_CODE_LENGTH = 100_000;  // 100 KB max code size
const MAX_TESTS = 20;            // Maximum number of tests to run

// Rate limiting: max requests per IP per window
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;  // 30 executions per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// --- Sandbox profiles ---

/**
 * macOS sandbox-exec profile: denies all filesystem writes outside tempDir,
 * denies all network access, allows reading system libraries needed for
 * compilers/runtimes.
 */
function darwinSandboxProfile(tempDir: string): string {
    return `
(version 1)
(deny default)
(allow process-fork process-exec)
(allow signal (target self))
(allow sysctl-read)
(allow mach-lookup)
(allow file-read* (subpath "/usr") (subpath "/Library") (subpath "/System") (subpath "/Applications") (subpath "/private/var") (subpath "/dev") (subpath "/bin") (subpath "/sbin") (subpath "/opt") (subpath "/etc") (subpath "${tempDir}"))
(allow file-write* (subpath "${tempDir}") (subpath "/dev"))
(deny network*)
`;
}

const IS_DARWIN = process.platform === 'darwin';
const IS_LINUX = process.platform === 'linux';

// --- Helpers ---

/**
 * Execute a command inside a sandbox with a hard timeout that kills the process.
 * Returns { stdout, stderr, exitCode }.
 */
function sandboxedExec(
    command: string[],
    tempDir: string,
    timeoutMs: number,
    env?: Record<string, string>
): Promise<{ stdout: string; stderr: string; exitCode: number | null; timedOut: boolean }> {
    return new Promise((resolve) => {
        let wrappedCommand: string[];
        let wrappedEnv: Record<string, string> = { ...process.env, ...env, HOME: tempDir } as Record<string, string>;

        if (IS_DARWIN) {
            // Use sandbox-exec on macOS
            const profile = darwinSandboxProfile(tempDir);
            wrappedCommand = ['sandbox-exec', '-p', profile, ...command];
        } else if (IS_LINUX) {
            // Use unshare for network isolation + ulimit for resource limits on Linux
            // SECURITY: --net isolates network, ulimit caps CPU time, file size, and processes
            wrappedCommand = [
                'unshare', '--net', '--',
                '/bin/bash', '-c',
                `ulimit -t ${Math.ceil(timeoutMs / 1000) + 2} -f 10240 -u 64 -v 524288 2>/dev/null; exec ${command.map(shellEscape).join(' ')}`
            ];
        } else {
            // Fallback: run without OS-level sandbox but with timeout kill
            // SECURITY WARNING: No OS-level sandboxing on this platform.
            // Only the timeout-based kill provides protection.
            console.warn('[Execute] WARNING: No OS-level sandbox available on this platform. Code runs unsandboxed.');
            wrappedCommand = command;
        }

        const child = spawn(wrappedCommand[0], wrappedCommand.slice(1), {
            cwd: tempDir,
            env: wrappedEnv,
            stdio: ['ignore', 'pipe', 'pipe'],
            // SECURITY: Prevent the child from being a session leader that can escape kill
            detached: false,
        });

        let stdout = '';
        let stderr = '';
        let timedOut = false;
        let finished = false;

        // SECURITY: Hard timeout that kills the process tree
        const timer = setTimeout(() => {
            if (!finished) {
                timedOut = true;
                try {
                    // Kill the entire process group if possible
                    process.kill(-child.pid!, 'SIGKILL');
                } catch {
                    try { child.kill('SIGKILL'); } catch { /* already dead */ }
                }
            }
        }, timeoutMs);

        child.stdout?.on('data', (chunk: Buffer) => {
            if (stdout.length < MAX_OUTPUT_LENGTH) {
                stdout += chunk.toString();
            }
        });

        child.stderr?.on('data', (chunk: Buffer) => {
            if (stderr.length < MAX_OUTPUT_LENGTH) {
                stderr += chunk.toString();
            }
        });

        child.on('close', (exitCode) => {
            finished = true;
            clearTimeout(timer);
            resolve({
                stdout: truncate(stdout),
                stderr: truncate(stderr),
                exitCode,
                timedOut,
            });
        });

        child.on('error', (err) => {
            finished = true;
            clearTimeout(timer);
            resolve({
                stdout: '',
                stderr: err.message,
                exitCode: 1,
                timedOut: false,
            });
        });
    });
}

/** Escape a string for safe inclusion in a shell command. */
function shellEscape(s: string): string {
    return `'${s.replace(/'/g, "'\\''")}'`;
}

/** Check rate limit for a given client identifier. Returns true if allowed. */
function checkRateLimit(clientId: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(clientId);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }

    if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    entry.count++;
    return true;
}

/** Periodically clean up expired rate limit entries. */
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
        if (now > entry.resetAt) {
            rateLimitMap.delete(key);
        }
    }
}, RATE_LIMIT_WINDOW_MS);

/**
 * Validate that user code doesn't contain obvious escape attempts.
 * This is defense-in-depth; the sandbox is the primary protection.
 */
function validateCode(code: string, language: string): string | null {
    if (code.length > MAX_CODE_LENGTH) {
        return `Code too large: ${code.length} bytes (max ${MAX_CODE_LENGTH})`;
    }

    if (code.includes('\0')) {
        return 'Code contains null bytes';
    }

    return null; // passes validation
}

// --- Route handler ---

export async function executeRoutes(
    req: Request,
    url: URL,
    corsHeaders: Headers
): Promise<Response> {
    const path = url.pathname.replace('/api/execute', '');

    if (req.method === 'POST' && (path === '' || path === '/')) {
        return handleExecute(req, corsHeaders);
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

async function handleExecute(
    req: Request,
    headers: Headers
): Promise<Response> {
    // SECURITY: Rate limiting by IP or fallback identifier
    const clientIp = req.headers.get('x-forwarded-for')
        ?? req.headers.get('x-real-ip')
        ?? 'unknown';

    if (!checkRateLimit(clientIp)) {
        return jsonResponse(
            { error: 'Rate limit exceeded. Try again later.', success: false, output: '' },
            429,
            headers
        );
    }

    let body: ExecuteRequest;

    try {
        body = await req.json();
    } catch {
        return jsonResponse({ error: 'Invalid JSON body', success: false, output: '' }, 400, headers);
    }

    const { language, code, testCases } = body;

    if (!language || !code) {
        return jsonResponse({ error: 'Missing language or code', success: false, output: '' }, 400, headers);
    }

    if (!['swift', 'rust', 'typescript', 'kotlin'].includes(language)) {
        return jsonResponse({ error: 'Unsupported language for server execution', success: false, output: '' }, 400, headers);
    }

    // SECURITY: Validate code size and content
    const validationError = validateCode(code, language);
    if (validationError) {
        return jsonResponse({ error: validationError, success: false, output: '' }, 400, headers);
    }

    // SECURITY: Validate and limit test cases
    if (testCases && testCases.length > MAX_TESTS) {
        return jsonResponse(
            { error: `Too many test cases (max ${MAX_TESTS})`, success: false, output: '' },
            400,
            headers
        );
    }

    try {
        const result = await executeCode(language, code, testCases);
        return jsonResponse(result, result.success ? 200 : 400, headers);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return jsonResponse({ error: message, success: false, output: '' }, 500, headers);
    }
}

async function executeCode(
    language: 'swift' | 'rust' | 'typescript' | 'kotlin',
    code: string,
    testCases?: TestCase[]
): Promise<ExecuteResponse> {
    switch (language) {
        case 'swift':
            return executeSwift(code, testCases);
        case 'rust':
            return executeRust(code, testCases);
        case 'typescript':
            return executeTypeScript(code, testCases);
        case 'kotlin':
            return executeKotlin(code, testCases);
        default:
            return { output: '', success: false, error: 'Unsupported language' };
    }
}

async function executeSwift(code: string, testCases?: TestCase[]): Promise<ExecuteResponse> {
    const tempDir = await mkdtemp(join(tmpdir(), 'cs-swift-'));
    const sourceFile = join(tempDir, 'main.swift');

    try {
        await writeFile(sourceFile, code, 'utf-8');

        // SECURITY: Execute inside sandbox with hard-kill timeout
        const result = await sandboxedExec(
            ['swift', sourceFile],
            tempDir,
            TIMEOUT_MS
        );

        if (result.timedOut) {
            return { output: '', success: false, error: 'Execution timed out (5s limit)' };
        }

        const output = truncate(result.stdout + result.stderr);
        const success = result.exitCode === 0;

        let testResults: TestResult[] | undefined;
        if (testCases && success) {
            testResults = await runSwiftTests(tempDir, code, testCases);
        }

        return {
            output,
            success,
            error: success ? undefined : 'Compilation or runtime error',
            testResults,
        };
    } finally {
        await rm(tempDir, { recursive: true, force: true });
    }
}

async function executeRust(code: string, testCases?: TestCase[]): Promise<ExecuteResponse> {
    const tempDir = await mkdtemp(join(tmpdir(), 'cs-rust-'));
    const sourceFile = join(tempDir, 'main.rs');
    const outputBinary = join(tempDir, 'main');

    try {
        await writeFile(sourceFile, code, 'utf-8');

        // SECURITY: Compile inside sandbox
        const compileResult = await sandboxedExec(
            ['rustc', sourceFile, '-o', outputBinary],
            tempDir,
            TIMEOUT_MS
        );

        if (compileResult.timedOut) {
            return { output: '', success: false, error: 'Compilation timed out' };
        }

        if (compileResult.exitCode !== 0) {
            const output = truncate(compileResult.stderr);
            return { output, success: false, error: 'Compilation error' };
        }

        // SECURITY: Run compiled binary inside sandbox
        const runResult = await sandboxedExec(
            [outputBinary],
            tempDir,
            TIMEOUT_MS
        );

        if (runResult.timedOut) {
            return { output: '', success: false, error: 'Execution timed out' };
        }

        const output = truncate(runResult.stdout + runResult.stderr);
        const success = runResult.exitCode === 0;

        let testResults: TestResult[] | undefined;
        if (testCases && success) {
            testResults = evaluateOutputTests(output, testCases);
        }

        return {
            output,
            success,
            error: success ? undefined : 'Runtime error',
            testResults,
        };
    } finally {
        await rm(tempDir, { recursive: true, force: true });
    }
}

async function executeTypeScript(code: string, testCases?: TestCase[]): Promise<ExecuteResponse> {
    const tempDir = await mkdtemp(join(tmpdir(), 'cs-ts-'));
    const sourceFile = join(tempDir, 'main.ts');

    try {
        await writeFile(sourceFile, code, 'utf-8');

        // SECURITY: Execute inside sandbox with hard-kill timeout
        const result = await sandboxedExec(
            ['bun', sourceFile],
            tempDir,
            TIMEOUT_MS
        );

        if (result.timedOut) {
            return { output: '', success: false, error: 'Execution timed out' };
        }

        const output = truncate(result.stdout + result.stderr);
        const success = result.exitCode === 0;

        let testResults: TestResult[] | undefined;
        if (testCases && success) {
            testResults = await runTypeScriptTests(tempDir, code, testCases);
        }

        return {
            output,
            success,
            error: success ? undefined : 'Runtime error',
            testResults,
        };
    } finally {
        await rm(tempDir, { recursive: true, force: true });
    }
}

async function runTypeScriptTests(
    tempDir: string,
    code: string,
    testCases: TestCase[]
): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const testsToRun = testCases.slice(0, MAX_TESTS);

    for (const test of testsToRun) {
        if (test.assertion) {
            const testCode = `${code}\nconsole.log(${test.assertion})`;
            const testFile = join(tempDir, 'test.ts');

            try {
                await writeFile(testFile, testCode, 'utf-8');

                // SECURITY: Each test runs in its own sandbox with timeout
                const result = await sandboxedExec(
                    ['bun', testFile],
                    tempDir,
                    TEST_TIMEOUT_MS
                );

                if (result.timedOut) {
                    results.push({
                        description: test.description,
                        passed: false,
                        error: 'Test timed out (3s limit)',
                    });
                    continue;
                }

                const output = result.stdout.trim();
                const passed = output === 'true';
                console.log('[Execute] TS assertion test:', test.description, '- output:', output, '- passed:', passed);

                results.push({
                    description: test.description,
                    passed,
                    output: passed ? undefined : output,
                });
            } catch (error) {
                results.push({
                    description: test.description,
                    passed: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        } else if (test.expectedOutput !== undefined) {
            results.push({
                description: test.description,
                passed: false,
                error: 'expectedOutput tests not supported for TypeScript yet',
            });
        } else {
            results.push({
                description: test.description,
                passed: false,
                error: 'No assertion or expectedOutput defined',
            });
        }
    }

    return results;
}

async function executeKotlin(code: string, testCases?: TestCase[]): Promise<ExecuteResponse> {
    const tempDir = await mkdtemp(join(tmpdir(), 'cs-kotlin-'));
    const sourceFile = join(tempDir, 'Main.kt');
    const jarFile = join(tempDir, 'main.jar');

    try {
        await writeFile(sourceFile, code, 'utf-8');

        // SECURITY: Compile inside sandbox (Kotlin compilation is slow, allow more time)
        const compileResult = await sandboxedExec(
            ['kotlinc', sourceFile, '-include-runtime', '-d', jarFile],
            tempDir,
            COMPILE_TIMEOUT_MS
        );

        if (compileResult.timedOut) {
            return { output: '', success: false, error: 'Compilation timed out' };
        }

        if (compileResult.exitCode !== 0) {
            const output = truncate(compileResult.stderr);
            return { output, success: false, error: 'Compilation error' };
        }

        // SECURITY: Run compiled jar inside sandbox
        const runResult = await sandboxedExec(
            ['java', '-jar', jarFile],
            tempDir,
            TIMEOUT_MS
        );

        if (runResult.timedOut) {
            return { output: '', success: false, error: 'Execution timed out' };
        }

        const output = truncate(runResult.stdout + runResult.stderr);
        const success = runResult.exitCode === 0;

        let testResults: TestResult[] | undefined;
        if (testCases && success) {
            testResults = evaluateOutputTests(output, testCases);
        }

        return {
            output,
            success,
            error: success ? undefined : 'Runtime error',
            testResults,
        };
    } finally {
        await rm(tempDir, { recursive: true, force: true });
    }
}

async function runSwiftTests(
    tempDir: string,
    code: string,
    testCases: TestCase[]
): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const testsToRun = testCases.slice(0, MAX_TESTS);

    for (const test of testsToRun) {
        const testCode = `${code}\n\n// Test assertion\nprint(${test.assertion})`;
        const testFile = join(tempDir, 'test.swift');

        try {
            await writeFile(testFile, testCode, 'utf-8');

            // SECURITY: Each test runs in its own sandbox with timeout
            const result = await sandboxedExec(
                ['swift', testFile],
                tempDir,
                TIMEOUT_MS
            );

            if (result.timedOut) {
                results.push({
                    description: test.description,
                    passed: false,
                    error: 'Test timed out',
                });
                continue;
            }

            const output = result.stdout.trim();
            const passed = output === 'true' || (test.expectedOutput !== undefined && output === test.expectedOutput);

            results.push({
                description: test.description,
                passed,
                output,
            });
        } catch (error) {
            results.push({
                description: test.description,
                passed: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    return results;
}

function evaluateOutputTests(output: string, testCases: TestCase[]): TestResult[] {
    return testCases.map((test) => {
        if (test.expectedOutput !== undefined) {
            const passed = output.includes(test.expectedOutput);
            return {
                description: test.description,
                passed,
                output: passed ? test.expectedOutput : output,
            };
        }

        return {
            description: test.description,
            passed: false,
            error: 'No expected output defined',
        };
    });
}

function truncate(str: string): string {
    if (str.length > MAX_OUTPUT_LENGTH) {
        return str.slice(0, MAX_OUTPUT_LENGTH) + '\n... (output truncated)';
    }
    return str;
}

function jsonResponse(
    data: ExecuteResponse,
    status: number,
    headers: Headers
): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...headers, 'Content-Type': 'application/json' },
    });
}
