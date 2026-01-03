import {
    Component,
    ChangeDetectionStrategy,
    input,
    output,
    signal,
    computed,
    inject,
} from '@angular/core';
import { CodeExecutorService } from '@core/services/code-executor.service';
import { ExecutionResult } from '@core/models/progress.model';

@Component({
    selector: 'app-code-runner',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="code-runner">
            <div class="code-runner__controls">
                <button
                    type="button"
                    class="code-runner__run-btn"
                    (click)="run()"
                    [disabled]="isRunning()"
                    [attr.aria-busy]="isRunning()"
                >
                    @if (isRunning()) {
                        <span class="code-runner__spinner" aria-hidden="true"></span>
                        Running...
                    } @else {
                        <span aria-hidden="true">▶</span>
                        Run
                    }
                </button>
                @if (hasOutput()) {
                    <button
                        type="button"
                        class="code-runner__clear-btn"
                        (click)="clearOutput()"
                        aria-label="Clear output"
                    >
                        Clear
                    </button>
                }
            </div>

            @if (hasOutput() || hasError()) {
                <div
                    class="code-runner__output"
                    [class.code-runner__output--error]="hasError()"
                    role="log"
                    aria-live="polite"
                    aria-label="Code output"
                >
                    <div class="code-runner__output-label">
                        {{ hasError() ? 'Error' : 'Output' }}
                    </div>
                    <pre class="code-runner__output-content">{{ displayOutput() }}</pre>
                </div>
            }
        </div>
    `,
    styles: `
        .code-runner {
            margin-top: var(--spacing-sm);
        }

        .code-runner__controls {
            display: flex;
            gap: var(--spacing-sm);
            margin-bottom: var(--spacing-sm);
        }

        .code-runner__run-btn {
            display: inline-flex;
            align-items: center;
            gap: var(--spacing-xs);
            padding: var(--spacing-sm) var(--spacing-md);
            background-color: var(--color-success);
            color: white;
            border-radius: var(--radius-md);
            font-weight: 500;
            transition: background-color 0.2s;

            &:hover:not(:disabled) {
                background-color: #1a7c36;
            }

            &:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
        }

        .code-runner__spinner {
            width: 14px;
            height: 14px;
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .code-runner__clear-btn {
            padding: var(--spacing-sm) var(--spacing-md);
            background-color: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            color: var(--color-text-secondary);

            &:hover {
                background-color: var(--color-bg-tertiary);
            }
        }

        .code-runner__output {
            background-color: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            overflow: hidden;

            &--error {
                border-color: var(--color-error);
                background-color: var(--color-error-light);
            }
        }

        .code-runner__output-label {
            padding: var(--spacing-xs) var(--spacing-md);
            background-color: var(--color-bg-tertiary);
            border-bottom: 1px solid var(--color-border);
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            color: var(--color-text-secondary);

            .code-runner__output--error & {
                background-color: var(--color-error);
                color: white;
            }
        }

        .code-runner__output-content {
            margin: 0;
            padding: var(--spacing-md);
            font-family: var(--font-mono);
            font-size: 0.875rem;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
        }
    `,
})
export class CodeRunnerComponent {
    private readonly executor = inject(CodeExecutorService);

    public readonly code = input.required<string>();
    public readonly language = input<'javascript' | 'python'>('javascript');
    public readonly blockId = input<string>('default');

    public readonly executed = output<ExecutionResult>();

    private readonly executionOutput = signal('');
    private readonly executionError = signal<string | null>(null);
    public readonly isRunning = signal(false);

    public readonly hasOutput = computed(() => this.executionOutput().length > 0);
    public readonly hasError = computed(() => this.executionError() !== null);
    public readonly displayOutput = computed(() =>
        this.executionError() ?? this.executionOutput()
    );

    public async run(): Promise<void> {
        this.isRunning.set(true);
        this.executionOutput.set('');
        this.executionError.set(null);

        try {
            let result: ExecutionResult;

            if (this.language() === 'python') {
                result = await this.executor.executePython(
                    this.code(),
                    this.blockId()
                );
            } else {
                result = await this.executor.executeJavaScript(
                    this.code(),
                    this.blockId()
                );
            }

            if (result.success) {
                this.executionOutput.set(result.output);
            } else {
                this.executionError.set(result.error ?? 'Unknown error');
            }

            this.executed.emit(result);
        } finally {
            this.isRunning.set(false);
        }
    }

    public clearOutput(): void {
        this.executionOutput.set('');
        this.executionError.set(null);
    }
}
