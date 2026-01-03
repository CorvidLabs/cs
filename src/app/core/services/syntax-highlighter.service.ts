import { Injectable, signal, computed } from '@angular/core';

interface Highlighter {
    codeToHtml: (
        code: string,
        options: { lang: string; theme: string }
    ) => string;
}

@Injectable({ providedIn: 'root' })
export class SyntaxHighlighterService {
    private highlighter: Highlighter | null = null;
    private readonly ready = signal(false);

    public readonly isReady = computed(() => this.ready());

    public async initialize(): Promise<void> {
        try {
            const { createHighlighter } = await import('shiki');

            this.highlighter = await createHighlighter({
                themes: ['github-light', 'github-dark'],
                langs: [
                    'swift',
                    'python',
                    'javascript',
                    'typescript',
                    'html',
                    'css',
                    'rust',
                    'json',
                    'bash',
                    'markdown',
                ],
            });

            this.ready.set(true);
        } catch (error) {
            console.error('Failed to initialize syntax highlighter:', error);
        }
    }

    public highlight(
        code: string,
        lang: string,
        theme: 'github-light' | 'github-dark' = 'github-light'
    ): string {
        if (!this.highlighter) {
            return this.escapeHtml(code);
        }

        try {
            return this.highlighter.codeToHtml(code, { lang, theme });
        } catch {
            return this.escapeHtml(code);
        }
    }

    public highlightInline(code: string, lang: string): string {
        const html = this.highlight(code, lang);
        return html
            .replace(/<pre[^>]*>/, '')
            .replace(/<\/pre>/, '')
            .replace(/<code[^>]*>/, '<code>')
            .replace(/<\/code>/, '</code>');
    }

    private escapeHtml(text: string): string {
        return `<pre><code>${text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')}</code></pre>`;
    }
}
