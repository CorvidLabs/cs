import {
    Component,
    ChangeDetectionStrategy,
    input,
    output,
    signal,
    computed,
    inject,
    ElementRef,
    viewChild,
    effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SyntaxHighlighterService } from '@core/services/syntax-highlighter.service';
import { ThemeService } from '@core/services/theme.service';

@Component({
    selector: 'app-code-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule],
    template: `
        <div class="code-editor" [class.code-editor--focused]="isFocused()">
            <div class="code-editor__header">
                <span class="code-editor__language">{{ language() }}</span>
                @if (showReset()) {
                    <button
                        type="button"
                        class="code-editor__reset"
                        (click)="resetCode()"
                        aria-label="Reset code to original"
                    >
                        Reset
                    </button>
                }
            </div>
            <div class="code-editor__container">
                <div class="code-editor__lines" aria-hidden="true">
                    @for (line of lineNumbers(); track $index) {
                        <span class="code-editor__line-number">{{ line }}</span>
                    }
                </div>
                <div class="code-editor__input-wrapper">
                    <textarea
                        #textarea
                        class="code-editor__textarea"
                        [value]="currentCode()"
                        (input)="onInput($event)"
                        (focus)="isFocused.set(true)"
                        (blur)="isFocused.set(false)"
                        (keydown)="onKeyDown($event)"
                        spellcheck="false"
                        autocomplete="off"
                        autocorrect="off"
                        autocapitalize="off"
                        [attr.aria-label]="'Code editor for ' + language()"
                    ></textarea>
                    <div
                        class="code-editor__highlight"
                        [innerHTML]="highlightedCode()"
                        aria-hidden="true"
                    ></div>
                </div>
            </div>
        </div>
    `,
    styles: `
        .code-editor {
            border: 4px solid var(--color-border);
            overflow: hidden;
            background-color: var(--color-bg-secondary);

            &--focused {
                border-color: var(--color-success);
            }
        }

        .code-editor__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-xs) var(--spacing-md);
            background-color: var(--color-bg-tertiary);
            border-bottom: 4px solid var(--color-border);
        }

        .code-editor__language {
            font-size: 0.45rem;
            text-transform: uppercase;
            color: var(--color-text-secondary);
        }

        .code-editor__reset {
            padding: var(--spacing-xs) var(--spacing-sm);
            font-size: 0.45rem;
            text-transform: uppercase;
            color: var(--color-text-secondary);
            background-color: var(--color-bg);
            border: 2px solid var(--color-border);
            cursor: pointer;

            &:hover {
                background-color: var(--color-bg-tertiary);
                color: var(--color-text);
            }

            &:active {
                transform: translate(1px, 1px);
            }
        }

        .code-editor__container {
            display: flex;
            min-height: 200px;
            max-height: 500px;
            overflow: auto;
        }

        .code-editor__lines {
            display: flex;
            flex-direction: column;
            padding: var(--spacing-md) var(--spacing-sm);
            background-color: var(--color-bg-tertiary);
            border-right: 2px solid var(--color-border);
            user-select: none;
        }

        .code-editor__line-number {
            font-family: var(--font-mono);
            font-size: 0.7rem;
            line-height: 1.6;
            color: var(--color-text-tertiary);
            text-align: right;
            min-width: 2em;
        }

        .code-editor__input-wrapper {
            position: relative;
            flex: 1;
            min-width: 0;
        }

        .code-editor__textarea,
        .code-editor__highlight {
            font-family: var(--font-mono);
            font-size: 0.7rem;
            line-height: 1.6;
            padding: var(--spacing-md);
            white-space: pre;
            word-wrap: normal;
            overflow-wrap: normal;
        }

        .code-editor__textarea {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            color: transparent;
            background: transparent;
            caret-color: var(--color-success);
            border: none;
            resize: none;
            outline: none;
            z-index: 1;
        }

        .code-editor__highlight {
            min-height: 100%;
            pointer-events: none;

            :host ::ng-deep pre {
                margin: 0;
                padding: 0;
                background: transparent;
            }

            :host ::ng-deep code {
                font-family: inherit;
                font-size: inherit;
                line-height: inherit;
            }
        }
    `,
})
export class CodeEditorComponent {
    private readonly sanitizer = inject(DomSanitizer);
    private readonly highlighter = inject(SyntaxHighlighterService);
    private readonly themeService = inject(ThemeService);

    private readonly textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

    public readonly initialCode = input.required<string>();
    public readonly language = input<string>('javascript');
    public readonly showReset = input(true);

    public readonly codeChange = output<string>();

    public readonly currentCode = signal('');
    public readonly isFocused = signal(false);

    public readonly lineNumbers = computed(() => {
        const lines = this.currentCode().split('\n').length;
        return Array.from({ length: lines }, (_, i) => i + 1);
    });

    public readonly highlightedCode = computed<SafeHtml>(() => {
        const html = this.highlighter.highlight(
            this.currentCode(),
            this.language(),
            this.themeService.codeTheme()
        );
        return this.sanitizer.bypassSecurityTrustHtml(html);
    });

    constructor() {
        effect(
            () => {
                if (this.currentCode() === '') {
                    this.currentCode.set(this.initialCode());
                }
            },
            { allowSignalWrites: true }
        );
    }

    public onInput(event: Event): void {
        const target = event.target as HTMLTextAreaElement;
        this.currentCode.set(target.value);
        this.codeChange.emit(target.value);
    }

    public onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Tab') {
            event.preventDefault();
            const target = event.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const spaces = '    ';

            const newValue =
                target.value.substring(0, start) +
                spaces +
                target.value.substring(end);

            this.currentCode.set(newValue);
            this.codeChange.emit(newValue);

            requestAnimationFrame(() => {
                target.selectionStart = target.selectionEnd = start + spaces.length;
            });
        }
    }

    public resetCode(): void {
        this.currentCode.set(this.initialCode());
        this.codeChange.emit(this.initialCode());
    }

    public getCode(): string {
        return this.currentCode();
    }
}
