import { $ } from 'bun';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

type Headers = Record<string, string>;

interface ExecuteRequest {
    language: 'swift' | 'rust' | 'typescript';
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

const TIMEOUT_MS = 10000;
const MAX_OUTPUT_LENGTH = 50000;

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

    if (!['swift', 'rust', 'typescript'].includes(language)) {
        return jsonResponse({ error: 'Unsupported language for server execution', success: false, output: '' }, 400, headers);
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
    language: 'swift' | 'rust' | 'typescript',
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
        default:
            return { output: '', success: false, error: 'Unsupported language' };
    }
}

async function executeSwift(code: string, testCases?: TestCase[]): Promise<ExecuteResponse> {
    const tempDir = await mkdtemp(join(tmpdir(), 'swift-'));
    const sourceFile = join(tempDir, 'main.swift');

    try {
        await writeFile(sourceFile, code, 'utf-8');

        const result = await Promise.race([
            $`swift ${sourceFile}`.quiet().nothrow(),
            timeout(TIMEOUT_MS),
        ]);

        if (result === 'timeout') {
            return { output: '', success: false, error: 'Execution timed out' };
        }

        const output = truncate(result.stdout.toString() + result.stderr.toString());
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
    const tempDir = await mkdtemp(join(tmpdir(), 'rust-'));
    const sourceFile = join(tempDir, 'main.rs');
    const outputBinary = join(tempDir, 'main');

    try {
        await writeFile(sourceFile, code, 'utf-8');

        const compileResult = await Promise.race([
            $`rustc ${sourceFile} -o ${outputBinary}`.quiet().nothrow(),
            timeout(TIMEOUT_MS),
        ]);

        if (compileResult === 'timeout') {
            return { output: '', success: false, error: 'Compilation timed out' };
        }

        if (compileResult.exitCode !== 0) {
            const output = truncate(compileResult.stderr.toString());
            return { output, success: false, error: 'Compilation error' };
        }

        const runResult = await Promise.race([
            $`${outputBinary}`.quiet().nothrow(),
            timeout(TIMEOUT_MS),
        ]);

        if (runResult === 'timeout') {
            return { output: '', success: false, error: 'Execution timed out' };
        }

        const output = truncate(runResult.stdout.toString() + runResult.stderr.toString());
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
    const tempDir = await mkdtemp(join(tmpdir(), 'ts-'));
    const sourceFile = join(tempDir, 'main.ts');

    try {
        await writeFile(sourceFile, code, 'utf-8');

        const result = await Promise.race([
            $`bun ${sourceFile}`.quiet().nothrow(),
            timeout(TIMEOUT_MS),
        ]);

        if (result === 'timeout') {
            return { output: '', success: false, error: 'Execution timed out' };
        }

        const output = truncate(result.stdout.toString() + result.stderr.toString());
        const success = result.exitCode === 0;

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

    for (const test of testCases) {
        const testCode = `${code}\n\n// Test assertion\nprint(${test.assertion})`;
        const testFile = join(tempDir, 'test.swift');

        try {
            await writeFile(testFile, testCode, 'utf-8');

            const result = await Promise.race([
                $`swift ${testFile}`.quiet().nothrow(),
                timeout(TIMEOUT_MS),
            ]);

            if (result === 'timeout') {
                results.push({
                    description: test.description,
                    passed: false,
                    error: 'Test timed out',
                });
                continue;
            }

            const output = result.stdout.toString().trim();
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

function timeout(ms: number): Promise<'timeout'> {
    return new Promise((resolve) => setTimeout(() => resolve('timeout'), ms));
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
