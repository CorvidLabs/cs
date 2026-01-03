import {
    Component,
    ChangeDetectionStrategy,
    input,
    output,
    inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';

@Component({
    selector: 'app-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
    template: `
        <header class="header">
            <div class="header__container">
                <div class="header__left">
                    <button
                        type="button"
                        class="header__menu-btn"
                        (click)="toggleMobileNav.emit()"
                        [attr.aria-expanded]="isMobileNavOpen()"
                        aria-controls="mobile-nav"
                        aria-label="Toggle navigation menu"
                    >
                        <span class="header__menu-icon" aria-hidden="true">
                            @if (isMobileNavOpen()) {
                                ✕
                            } @else {
                                ☰
                            }
                        </span>
                    </button>

                    <a routerLink="/" class="header__logo">
                        <span class="header__logo-text">CS</span>
                        <span class="header__logo-subtitle">CorvidLabs</span>
                    </a>
                </div>

                <nav class="header__nav" aria-label="Main navigation">
                    <a routerLink="/" class="header__nav-link">Courses</a>
                    <a routerLink="/profile" class="header__nav-link">Progress</a>
                </nav>

                <div class="header__right">
                    <button
                        type="button"
                        class="header__theme-btn"
                        (click)="toggleTheme()"
                        [attr.aria-label]="themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
                    >
                        @if (themeService.isDarkMode()) {
                            <span aria-hidden="true">☀️</span>
                        } @else {
                            <span aria-hidden="true">🌙</span>
                        }
                    </button>
                </div>
            </div>
        </header>
    `,
    styles: `
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: var(--header-height);
            background-color: var(--color-bg);
            border-bottom: 1px solid var(--color-border);
            z-index: 100;
        }

        .header__container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            max-width: var(--max-content-width);
            margin: 0 auto;
            padding: 0 var(--spacing-md);

            @media (min-width: 1024px) {
                padding: 0 var(--spacing-xl);
            }
        }

        .header__left {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
        }

        .header__menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            font-size: 1.25rem;
            color: var(--color-text);
            border-radius: var(--radius-md);

            &:hover {
                background-color: var(--color-bg-secondary);
            }

            @media (min-width: 1024px) {
                display: none;
            }
        }

        .header__logo {
            display: flex;
            align-items: baseline;
            gap: var(--spacing-xs);
            text-decoration: none;
        }

        .header__logo-text {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--color-primary);
        }

        .header__logo-subtitle {
            font-size: 0.875rem;
            color: var(--color-text-secondary);

            @media (max-width: 480px) {
                display: none;
            }
        }

        .header__nav {
            display: none;

            @media (min-width: 768px) {
                display: flex;
                gap: var(--spacing-lg);
            }
        }

        .header__nav-link {
            color: var(--color-text-secondary);
            font-weight: 500;
            text-decoration: none;
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: var(--radius-md);
            transition: color 0.2s, background-color 0.2s;

            &:hover {
                color: var(--color-text);
                background-color: var(--color-bg-secondary);
            }
        }

        .header__right {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }

        .header__theme-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            font-size: 1.25rem;
            border-radius: var(--radius-md);

            &:hover {
                background-color: var(--color-bg-secondary);
            }
        }
    `,
})
export class HeaderComponent {
    public readonly themeService = inject(ThemeService);

    public readonly isMobileNavOpen = input(false);
    public readonly toggleMobileNav = output<void>();

    public toggleTheme(): void {
        this.themeService.toggle();
    }
}
