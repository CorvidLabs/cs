import { Injectable, signal, computed, effect } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly theme = signal<Theme>(this.getInitialTheme());

    public readonly currentTheme = computed(() => this.theme());
    public readonly isDarkMode = computed(() => this.theme() === 'dark');
    public readonly codeTheme = computed(() =>
        this.isDarkMode() ? 'github-dark' : 'github-light'
    );

    constructor() {
        effect(() => {
            const currentTheme = this.theme();
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    public toggle(): void {
        this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
    }

    public setTheme(theme: Theme): void {
        this.theme.set(theme);
    }

    private getInitialTheme(): Theme {
        if (typeof window === 'undefined') {
            return 'light';
        }

        const saved = localStorage.getItem('theme') as Theme | null;
        if (saved === 'light' || saved === 'dark') {
            return saved;
        }

        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches;
        return prefersDark ? 'dark' : 'light';
    }
}
