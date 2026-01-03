import {
    Component,
    ChangeDetectionStrategy,
    input,
    computed,
    inject,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Marked, Renderer } from 'marked';
import { SyntaxHighlighterService } from '@core/services/syntax-highlighter.service';
import { ThemeService } from '@core/services/theme.service';

@Component({
    selector: 'app-markdown-renderer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <article class="markdown-content" [innerHTML]="renderedHtml()"></article>
    `,
    styles: `
        .markdown-content {
            :host ::ng-deep {
                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                    margin-top: var(--spacing-xl);
                    margin-bottom: var(--spacing-md);
                    text-transform: uppercase;

                    &:first-child {
                        margin-top: 0;
                    }
                }

                h1 {
                    font-size: 0.75rem;
                    border-bottom: 4px solid var(--color-border);
                    padding-bottom: var(--spacing-sm);
                }

                h2 {
                    font-size: 0.65rem;
                }

                h3 {
                    font-size: 0.6rem;
                }

                p {
                    margin-bottom: var(--spacing-md);
                    font-size: 0.55rem;
                    line-height: 2;
                }

                ul,
                ol {
                    margin-bottom: var(--spacing-md);
                    padding-left: var(--spacing-xl);
                    font-size: 0.55rem;
                    line-height: 2;
                }

                li {
                    margin-bottom: var(--spacing-xs);
                }

                blockquote {
                    margin: var(--spacing-md) 0;
                    padding: var(--spacing-md);
                    background-color: var(--color-bg-secondary);
                    border: 4px solid var(--color-border);
                    border-left: 8px solid var(--color-primary);

                    p:last-child {
                        margin-bottom: 0;
                    }
                }

                pre {
                    margin: var(--spacing-md) 0;
                    border: 4px solid var(--color-border);
                    overflow-x: auto;
                }

                code:not(pre code) {
                    padding: 2px 6px;
                    background-color: var(--color-bg-tertiary);
                    border: 2px solid var(--color-border);
                    font-size: 0.9em;
                }

                table {
                    width: 100%;
                    margin: var(--spacing-md) 0;
                    border-collapse: collapse;
                    font-size: 0.5rem;
                }

                th,
                td {
                    padding: var(--spacing-sm) var(--spacing-md);
                    border: 2px solid var(--color-border);
                    text-align: left;
                }

                th {
                    background-color: var(--color-bg-secondary);
                    text-transform: uppercase;
                }

                tr:nth-child(even) {
                    background-color: var(--color-bg-secondary);
                }

                hr {
                    margin: var(--spacing-xl) 0;
                    border: none;
                    border-top: 4px solid var(--color-border);
                }

                img {
                    max-width: 100%;
                    height: auto;
                    border: 4px solid var(--color-border);
                }

                a {
                    color: var(--color-primary);
                    text-decoration: none;

                    &:hover {
                        color: var(--color-success);
                        text-decoration: none;
                    }
                }

                .callout {
                    margin: var(--spacing-md) 0;
                    padding: var(--spacing-md);
                    border: 4px solid var(--color-border);
                    border-left-width: 8px;

                    &.callout--info {
                        background-color: rgba(249, 233, 200, 0.1);
                        border-left-color: var(--color-primary);
                    }

                    &.callout--warning {
                        background-color: rgba(247, 213, 29, 0.1);
                        border-left-color: var(--color-warning);
                    }

                    &.callout--tip {
                        background-color: rgba(146, 204, 65, 0.1);
                        border-left-color: var(--color-success);
                    }
                }
            }
        }
    `,
})
export class MarkdownRendererComponent {
    private readonly sanitizer = inject(DomSanitizer);
    private readonly highlighter = inject(SyntaxHighlighterService);
    private readonly themeService = inject(ThemeService);

    public readonly content = input.required<string>();

    public readonly renderedHtml = computed<SafeHtml>(() => {
        const html = this.parseMarkdown(this.content());
        return this.sanitizer.bypassSecurityTrustHtml(html);
    });

    private parseMarkdown(markdown: string): string {
        const renderer = new Renderer();
        const theme = this.themeService.codeTheme();
        const highlighter = this.highlighter;

        renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
            const language = lang ?? 'text';
            return highlighter.highlight(text, language, theme);
        };

        renderer.heading = function ({
            text,
            depth,
        }: {
            text: string;
            depth: number;
        }) {
            const id = text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            return `<h${depth} id="${id}">${text}</h${depth}>`;
        };

        const marked = new Marked({ renderer });
        return marked.parse(markdown) as string;
    }
}
