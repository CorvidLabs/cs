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
            background-color: var(--color-bg-secondary);
            border-bottom: 4px solid var(--color-border);
            z-index: 100;
            box-shadow: 0 4px 0 var(--color-border);
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
            width: 44px;
            height: 44px;
            font-size: 1rem;
            color: var(--color-text);
            background-color: var(--color-bg-tertiary);
            border: 4px solid var(--color-border);
            transition: filter 0.1s, transform 0.1s;

            &:hover {
                filter: brightness(1.2);
                box-shadow: 0 0 0 2px var(--color-primary);
            }

            &:active {
                transform: translate(2px, 2px);
            }

            @media (min-width: 1024px) {
                display: none;
            }
        }

        .header__logo {
            display: flex;
            align-items: baseline;
            gap: var(--spacing-sm);
            text-decoration: none;

            &:hover {
                text-decoration: none;
            }
        }

        .header__logo-text {
            font-size: 1rem;
            color: var(--color-primary);
            text-shadow: 2px 2px 0 var(--color-border);
        }

        .header__logo-subtitle {
            font-size: 0.5rem;
            color: var(--color-text-secondary);
            text-transform: uppercase;

            @media (max-width: 480px) {
                display: none;
            }
        }

        .header__nav {
            display: none;

            @media (min-width: 768px) {
                display: flex;
                gap: var(--spacing-sm);
            }
        }

        .header__nav-link {
            color: var(--color-text-secondary);
            text-decoration: none;
            padding: var(--spacing-sm) var(--spacing-md);
            font-size: 0.6rem;
            text-transform: uppercase;
            border: 2px solid transparent;
            transition: color 0.1s, border-color 0.1s;

            &:hover {
                color: var(--color-text);
                border-color: var(--color-primary);
                text-decoration: none;
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
            width: 44px;
            height: 44px;
            font-size: 1.25rem;
            background-color: var(--color-bg-tertiary);
            border: 4px solid var(--color-border);
            transition: filter 0.1s, transform 0.1s;

            &:hover {
                filter: brightness(1.2);
                box-shadow: 0 0 0 2px var(--color-primary);
            }

            &:active {
                transform: translate(2px, 2px);
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
