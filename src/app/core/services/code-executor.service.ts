import { Injectable, signal } from '@angular/core';
import { ExecutionState, ExecutionResult, TestResult } from '../models/progress.model';
import { TestCase, Language } from '../models/course.model';

const TEST_TIMEOUT_MS = 3000;  // 3 seconds max per test
const MAX_TESTS = 20;  // Maximum tests to run

interface PyodideInterface {
    runPython: (code: string) => unknown;
    runPythonAsync: (code: string) => Promise<unknown>;
}

function withTimeout<T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(errorMsg)), ms)
        ),
    ]);
}

interface ServerExecutionResponse {
    output: string;
    success: boolean;
    error?: string;
    testResults?: TestResult[];
}

@Injectable({ providedIn: 'root' })
export class CodeExecutorService {
    private readonly executionStates = signal<Map<string, ExecutionState>>(
        new Map()
    );
    private pyodide: PyodideInterface | null = null;
    private pyodideLoading = false;

    public getExecutionState(blockId: string): ExecutionState {
        return (
            this.executionStates().get(blockId) ?? {
                status: 'idle',
                output: '',
                error: null,
            }
        );
    }

    public async executeJavaScript(
        code: string,
        blockId: string
    ): Promise<ExecutionResult> {
        this.updateState(blockId, { status: 'running', output: '', error: null });

        try {
            const result = await this.runInSandbox(code);
            this.updateState(blockId, {
                status: 'complete',
                output: result,
                error: null,
            });
            return { success: true, output: result };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            this.updateState(blockId, {
                status: 'error',
                output: '',
                error: errorMessage,
            });
            return { success: false, output: '', error: errorMessage };
        }
    }

    public async executePython(
        code: string,
        blockId: string
    ): Promise<ExecutionResult> {
        this.updateState(blockId, { status: 'running', output: '', error: null });

        try {
            await this.ensurePyodideLoaded();

            if (!this.pyodide) {
                throw new Error('Pyodide not available');
            }

            const wrappedCode = `
import sys
from io import StringIO

_stdout = sys.stdout
sys.stdout = _output = StringIO()

try:
${code
                .split('\n')
                .map((line) => '    ' + line)
                .join('\n')}
finally:
    _result = _output.getvalue()
    sys.stdout = _stdout

_result
`;

            const result = await this.pyodide.runPythonAsync(wrappedCode);
            const output = String(result ?? '');

            this.updateState(blockId, {
                status: 'complete',
                output,
                error: null,
            });

            return { success: true, output };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            this.updateState(blockId, {
                status: 'error',
                output: '',
                error: errorMessage,
            });
            return { success: false, output: '', error: errorMessage };
        }
    }

    public async executeTypeScript(
        code: string,
        blockId: string
    ): Promise<ExecutionResult> {
        this.updateState(blockId, { status: 'running', output: '', error: null });

        try {
            const result = await this.executeOnServer('typescript', code);
            this.updateState(blockId, {
                status: result.success ? 'complete' : 'error',
                output: result.output,
                error: result.error ?? null,
            });
            return { success: result.success, output: result.output, error: result.error };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.updateState(blockId, { status: 'error', output: '', error: errorMessage });
            return { success: false, output: '', error: errorMessage };
        }
    }

    public async executeSwift(
        code: string,
        blockId: string
    ): Promise<ExecutionResult> {
        this.updateState(blockId, { status: 'running', output: '', error: null });

        try {
            const result = await this.executeOnServer('swift', code);
            this.updateState(blockId, {
                status: result.success ? 'complete' : 'error',
                output: result.output,
                error: result.error ?? null,
            });
            return { success: result.success, output: result.output, error: result.error };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.updateState(blockId, { status: 'error', output: '', error: errorMessage });
            return { success: false, output: '', error: errorMessage };
        }
    }

    public async executeRust(
        code: string,
        blockId: string
    ): Promise<ExecutionResult> {
        this.updateState(blockId, { status: 'running', output: '', error: null });

        try {
            const result = await this.executeOnServer('rust', code);
            this.updateState(blockId, {
                status: result.success ? 'complete' : 'error',
                output: result.output,
                error: result.error ?? null,
            });
            return { success: result.success, output: result.output, error: result.error };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.updateState(blockId, { status: 'error', output: '', error: errorMessage });
            return { success: false, output: '', error: errorMessage };
        }
    }

    public async executeKotlin(
        code: string,
        blockId: string
    ): Promise<ExecutionResult> {
        this.updateState(blockId, { status: 'running', output: '', error: null });

        try {
            const result = await this.executeOnServer('kotlin', code);
            this.updateState(blockId, {
                status: result.success ? 'complete' : 'error',
                output: result.output,
                error: result.error ?? null,
            });
            return { success: result.success, output: result.output, error: result.error };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.updateState(blockId, { status: 'error', output: '', error: errorMessage });
            return { success: false, output: '', error: errorMessage };
        }
    }

    public renderHtmlCss(html: string, css: string = ''): string {
        const fullHtml = css
            ? `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}</body></html>`
            : html.includes('<!DOCTYPE') ? html : `<!DOCTYPE html><html><body>${html}</body></html>`;
        return `data:text/html;charset=utf-8,${encodeURIComponent(fullHtml)}`;
    }

    public async executeHtml(
        code: string,
        blockId: string
    ): Promise<ExecutionResult> {
        this.updateState(blockId, { status: 'running', output: '', error: null });

        try {
            const previewUrl = this.renderHtmlCss(code);
            this.updateState(blockId, {
                status: 'complete',
                output: previewUrl,
                error: null,
            });
            return { success: true, output: previewUrl };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.updateState(blockId, { status: 'error', output: '', error: errorMessage });
            return { success: false, output: '', error: errorMessage };
        }
    }

    public async execute(
        code: string,
        language: Language,
        blockId: string
    ): Promise<ExecutionResult> {
        switch (language) {
            case 'python':
                return this.executePython(code, blockId);
            case 'javascript':
                return this.executeJavaScript(code, blockId);
            case 'typescript':
                return this.executeTypeScript(code, blockId);
            case 'swift':
                return this.executeSwift(code, blockId);
            case 'rust':
                return this.executeRust(code, blockId);
            case 'kotlin':
                return this.executeKotlin(code, blockId);
            case 'html':
            case 'css':
                return this.executeHtml(code, blockId);
            default:
                return { success: false, output: '', error: `Unsupported language: ${language}` };
        }
    }

    public async runTests(
        code: string,
        testCases: TestCase[],
        language: Language
    ): Promise<TestResult[]> {
        const testsToRun = testCases.slice(0, MAX_TESTS);

        if (language === 'swift' || language === 'rust' || language === 'typescript' || language === 'kotlin') {
            try {
                const result = await withTimeout(
                    this.executeOnServer(language, code, testsToRun),
                    30000,
                    'Server execution timed out'
                );
                return result.testResults ?? testsToRun.map(tc => ({
                    description: tc.description,
                    passed: false,
                    error: 'No test results returned',
                }));
            } catch (error) {
                return testsToRun.map(tc => ({
                    description: tc.description,
                    passed: false,
                    error: error instanceof Error ? error.message : 'Server error',
                }));
            }
        }

        const results: TestResult[] = [];

        for (const testCase of testsToRun) {
            try {
                let passed = false;

                // Generate assertion from input/expected format if needed
                let assertion = testCase.assertion;
                if (!assertion && testCase.input !== undefined && testCase.expected !== undefined) {
                    assertion = this.generateAssertion(code, testCase.input, testCase.expected, language);
                }

                if (language === 'javascript') {
                    if (!assertion) {
                        results.push({ description: testCase.description, passed: false, error: 'No assertion defined' });
                        continue;
                    }
                    const fullCode = `${code}\n${assertion}`;
                    const result = await withTimeout(
                        this.runInSandbox(fullCode),
                        TEST_TIMEOUT_MS,
                        'Test timed out (3s limit)'
                    );
                    passed = result === 'true' || result === testCase.expectedOutput;
                } else if (language === 'python') {
                    if (!assertion) {
                        results.push({ description: testCase.description, passed: false, error: 'No assertion defined' });
                        continue;
                    }
                    await this.ensurePyodideLoaded();
                    if (this.pyodide) {
                        const wrappedCode = this.wrapPythonWithTimeout(code, assertion);
                        try {
                            const result = await this.pyodide.runPythonAsync(wrappedCode);
                            passed = result === true || String(result) === testCase.expectedOutput;
                        } catch (pyError) {
                            const errorMsg = String(pyError);
                            if (errorMsg.includes('ExecutionLimitExceeded')) {
                                results.push({ description: testCase.description, passed: false, error: 'Code took too long (possible infinite loop)' });
                                continue;
                            }
                            throw pyError;
                        }
                    } else {
                        results.push({ description: testCase.description, passed: false, error: 'Pyodide not loaded' });
                        continue;
                    }
                } else if (language === 'html' || language === 'css') {
                    passed = testCase.expectedOutput
                        ? code.includes(testCase.expectedOutput)
                        : true;
                }

                results.push({
                    description: testCase.description,
                    passed,
                });
            } catch (error) {
                results.push({
                    description: testCase.description,
                    passed: false,
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        }

        return results;
    }

    private async ensurePyodideLoaded(): Promise<void> {
        if (this.pyodide) return;
        if (this.pyodideLoading) {
            while (this.pyodideLoading) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            return;
        }

        this.pyodideLoading = true;

        try {
            const pyodideUrl = 'https://cdn.jsdelivr.net/pyodide/v0.26.0/full/';

            // Load Pyodide script from CDN if not already loaded
            if (!(window as unknown as { loadPyodide?: unknown }).loadPyodide) {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = `${pyodideUrl}pyodide.js`;
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed to load Pyodide'));
                    document.head.appendChild(script);
                });
            }

            const loadPyodide = (window as unknown as { loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface> }).loadPyodide;
            this.pyodide = await loadPyodide({ indexURL: pyodideUrl });
        } finally {
            this.pyodideLoading = false;
        }
    }

    private runInSandbox(code: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.sandbox.add('allow-scripts');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            const iframeWindow = iframe.contentWindow;
            if (!iframeWindow) {
                document.body.removeChild(iframe);
                reject(new Error('Failed to create sandbox'));
                return;
            }

            const output: string[] = [];

            try {
                const win = iframeWindow as unknown as {
                    console: Console;
                    eval: (code: string) => unknown;
                };

                const originalConsole = win.console;
                win.console = {
                    ...originalConsole,
                    log: (...args: unknown[]) =>
                        output.push(args.map(String).join(' ')),
                    error: (...args: unknown[]) =>
                        output.push(`Error: ${args.map(String).join(' ')}`),
                    warn: (...args: unknown[]) =>
                        output.push(`Warning: ${args.map(String).join(' ')}`),
                    info: (...args: unknown[]) =>
                        output.push(args.map(String).join(' ')),
                } as Console;

                const result = win.eval(code);

                if (result !== undefined && output.length === 0) {
                    output.push(String(result));
                }

                resolve(output.join('\n'));
            } catch (error) {
                reject(error);
            } finally {
                document.body.removeChild(iframe);
            }
        });
    }

    private generateAssertion(
        code: string,
        input: Record<string, unknown>,
        expected: unknown,
        language: Language
    ): string | undefined {
        // Extract function name from code
        let funcName: string | undefined;

        if (language === 'python') {
            const match = code.match(/^def\s+(\w+)\s*\(/m);
            funcName = match?.[1];
        } else if (language === 'javascript' || language === 'typescript') {
            const match = code.match(/^(?:function\s+(\w+)|const\s+(\w+)\s*=|let\s+(\w+)\s*=)/m);
            funcName = match?.[1] ?? match?.[2] ?? match?.[3];
        }

        if (!funcName) {
            return undefined;
        }

        // Build argument list from input
        const args = Object.values(input)
            .map(v => JSON.stringify(v))
            .join(', ');

        // Build expected value
        const expectedStr = JSON.stringify(expected);

        // Generate assertion based on language
        if (language === 'python') {
            return `${funcName}(${args}) == ${expectedStr}`;
        } else {
            return `JSON.stringify(${funcName}(${args})) === '${expectedStr.replace(/'/g, "\\'")}'`;
        }
    }

    private wrapPythonWithTimeout(code: string, assertion: string): string {
        // Wrap Python code with an execution counter to prevent infinite loops
        // Uses sys.settrace to count operations and raise after limit
        const maxOps = 1000000; // 1 million operations max
        return `
import sys

class ExecutionLimitExceeded(Exception):
    pass

_op_count = 0
_max_ops = ${maxOps}

def _trace_calls(frame, event, arg):
    global _op_count
    _op_count += 1
    if _op_count > _max_ops:
        raise ExecutionLimitExceeded("Execution limit exceeded")
    return _trace_calls

sys.settrace(_trace_calls)

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
    _result = ${assertion}
finally:
    sys.settrace(None)

_result
`;
    }

    private async executeOnServer(
        language: 'swift' | 'rust' | 'typescript' | 'kotlin',
        code: string,
        testCases?: TestCase[]
    ): Promise<ServerExecutionResponse> {
        const response = await fetch('/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, code, testCases }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        return response.json();
    }

    private updateState(blockId: string, state: ExecutionState): void {
        this.executionStates.update((map) => {
            const newMap = new Map(map);
            newMap.set(blockId, state);
            return newMap;
        });
    }
}
