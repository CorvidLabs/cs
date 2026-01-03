import {
    Component,
    ChangeDetectionStrategy,
    input,
    computed,
    inject,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SyntaxHighlighterService } from '@core/services/syntax-highlighter.service';
import { ThemeService } from '@core/services/theme.service';

@Component({
    selector: 'app-code-block',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <figure class="code-block" [attr.data-language]="language()">
            @if (showLanguageLabel()) {
                <figcaption class="code-block__label">{{ language() }}</figcaption>
            }
            <div class="code-block__content" [innerHTML]="highlightedCode()"></div>
            @if (showCopyButton()) {
                <button
                    type="button"
                    class="code-block__copy"
                    (click)="copyToClipboard()"
                    [attr.aria-label]="copied() ? 'Copied!' : 'Copy code'"
                >
                    {{ copied() ? 'Copied!' : 'Copy' }}
                </button>
            }
        </figure>
    `,
    styles: `
        .code-block {
            position: relative;
            margin: var(--spacing-md) 0;
            border: 4px solid var(--color-border);
            overflow: hidden;
        }

        .code-block__label {
            padding: var(--spacing-xs) var(--spacing-md);
            background-color: var(--color-bg-tertiary);
            border-bottom: 2px solid var(--color-border);
            font-size: 0.45rem;
            text-transform: uppercase;
            color: var(--color-text-secondary);
        }

        .code-block__content {
            overflow-x: auto;

            :host ::ng-deep pre {
                margin: 0;
                padding: var(--spacing-md);
            }

            :host ::ng-deep code {
                font-family: var(--font-mono);
                font-size: 0.7rem;
                line-height: 1.6;
            }
        }

        .code-block__copy {
            position: absolute;
            top: var(--spacing-sm);
            right: var(--spacing-sm);
            padding: var(--spacing-xs) var(--spacing-sm);
            background-color: var(--color-bg);
            border: 2px solid var(--color-border);
            font-size: 0.45rem;
            text-transform: uppercase;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.1s;

            &:hover {
                background-color: var(--color-bg-tertiary);
            }

            &:active {
                transform: translate(1px, 1px);
            }
        }

        .code-block:hover .code-block__copy {
            opacity: 1;
        }
    `,
})
export class CodeBlockComponent {
    private readonly sanitizer = inject(DomSanitizer);
    private readonly highlighter = inject(SyntaxHighlighterService);
    private readonly themeService = inject(ThemeService);

    public readonly code = input.required<string>();
    public readonly language = input<string>('text');
    public readonly showLanguageLabel = input(true);
    public readonly showCopyButton = input(true);

    public readonly copied = input(false);

    public readonly highlightedCode = computed<SafeHtml>(() => {
        const html = this.highlighter.highlight(
            this.code(),
            this.language(),
            this.themeService.codeTheme()
        );
        return this.sanitizer.bypassSecurityTrustHtml(html);
    });

    public async copyToClipboard(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.code());
        } catch {
            console.error('Failed to copy to clipboard');
        }
    }
}
