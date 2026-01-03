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

                    &:first-child {
                        margin-top: 0;
                    }
                }

                h1 {
                    font-size: 2rem;
                    border-bottom: 1px solid var(--color-border);
                    padding-bottom: var(--spacing-sm);
                }

                h2 {
                    font-size: 1.5rem;
                }

                h3 {
                    font-size: 1.25rem;
                }

                p {
                    margin-bottom: var(--spacing-md);
                    line-height: 1.7;
                }

                ul,
                ol {
                    margin-bottom: var(--spacing-md);
                    padding-left: var(--spacing-xl);
                }

                li {
                    margin-bottom: var(--spacing-xs);
                }

                blockquote {
                    margin: var(--spacing-md) 0;
                    padding: var(--spacing-md);
                    background-color: var(--color-bg-secondary);
                    border-left: 4px solid var(--color-primary);
                    border-radius: var(--radius-sm);

                    p:last-child {
                        margin-bottom: 0;
                    }
                }

                pre {
                    margin: var(--spacing-md) 0;
                    border-radius: var(--radius-md);
                    overflow-x: auto;
                }

                code:not(pre code) {
                    padding: 2px 6px;
                    background-color: var(--color-bg-secondary);
                    border-radius: var(--radius-sm);
                    font-size: 0.9em;
                }

                table {
                    width: 100%;
                    margin: var(--spacing-md) 0;
                    border-collapse: collapse;
                }

                th,
                td {
                    padding: var(--spacing-sm) var(--spacing-md);
                    border: 1px solid var(--color-border);
                    text-align: left;
                }

                th {
                    background-color: var(--color-bg-secondary);
                    font-weight: 600;
                }

                tr:nth-child(even) {
                    background-color: var(--color-bg-secondary);
                }

                hr {
                    margin: var(--spacing-xl) 0;
                    border: none;
                    border-top: 1px solid var(--color-border);
                }

                img {
                    max-width: 100%;
                    height: auto;
                    border-radius: var(--radius-md);
                }

                a {
                    color: var(--color-primary);
                    text-decoration: none;

                    &:hover {
                        text-decoration: underline;
                    }
                }

                .callout {
                    margin: var(--spacing-md) 0;
                    padding: var(--spacing-md);
                    border-radius: var(--radius-md);
                    border-left: 4px solid;

                    &.callout--info {
                        background-color: var(--color-primary-light);
                        border-color: var(--color-primary);
                    }

                    &.callout--warning {
                        background-color: var(--color-warning-light);
                        border-color: var(--color-warning);
                    }

                    &.callout--tip {
                        background-color: var(--color-success-light);
                        border-color: var(--color-success);
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
