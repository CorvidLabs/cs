import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
    template: `
        <footer class="footer">
            <div class="footer__container">
                <div class="footer__brand">
                    <span class="footer__logo">CS</span>
                    <span class="footer__tagline">
                        Learn Computer Science with Swift, Python, JavaScript, and Rust
                    </span>
                </div>

                <nav class="footer__nav" aria-label="Footer navigation">
                    <div class="footer__nav-section">
                        <h3 class="footer__nav-title">Courses</h3>
                        <ul class="footer__nav-list">
                            <li>
                                <a routerLink="/course/python" class="footer__link">Python</a>
                            </li>
                            <li>
                                <a routerLink="/course/swift" class="footer__link">Swift</a>
                            </li>
                            <li>
                                <a routerLink="/course/javascript" class="footer__link">JavaScript</a>
                            </li>
                            <li>
                                <a routerLink="/course/rust" class="footer__link">Rust</a>
                            </li>
                        </ul>
                    </div>

                    <div class="footer__nav-section">
                        <h3 class="footer__nav-title">Resources</h3>
                        <ul class="footer__nav-list">
                            <li>
                                <a routerLink="/profile" class="footer__link">My Progress</a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div class="footer__bottom">
                    <p class="footer__copyright">
                        &copy; {{ currentYear }} CorvidLabs. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    `,
    styles: `
        .footer {
            background-color: var(--color-bg-secondary);
            border-top: 1px solid var(--color-border);
            padding: var(--spacing-xl) var(--spacing-md);
            margin-top: auto;

            @media (min-width: 1024px) {
                margin-left: var(--sidebar-width);
            }
        }

        .footer__container {
            max-width: var(--max-content-width);
            margin: 0 auto;
        }

        .footer__brand {
            margin-bottom: var(--spacing-xl);
        }

        .footer__logo {
            display: block;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--color-primary);
            margin-bottom: var(--spacing-xs);
        }

        .footer__tagline {
            font-size: 0.875rem;
            color: var(--color-text-secondary);
        }

        .footer__nav {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: var(--spacing-xl);
            margin-bottom: var(--spacing-xl);
        }

        .footer__nav-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--color-text);
            margin-bottom: var(--spacing-md);
        }

        .footer__nav-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .footer__nav-list li {
            margin-bottom: var(--spacing-sm);
        }

        .footer__link {
            font-size: 0.875rem;
            color: var(--color-text-secondary);
            text-decoration: none;

            &:hover {
                color: var(--color-primary);
            }
        }

        .footer__bottom {
            padding-top: var(--spacing-lg);
            border-top: 1px solid var(--color-border);
        }

        .footer__copyright {
            font-size: 0.75rem;
            color: var(--color-text-tertiary);
            margin: 0;
        }
    `,
})
export class FooterComponent {
    public readonly currentYear = new Date().getFullYear();
}
