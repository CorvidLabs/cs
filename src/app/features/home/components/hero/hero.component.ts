import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-hero',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
    template: `
        <section class="hero" aria-labelledby="hero-heading">
            <div class="hero__content">
                <h1 id="hero-heading" class="hero__title">
                    Learn Computer Science
                    <span class="hero__title-highlight">Through Code</span>
                </h1>
                <p class="hero__description">
                    Master programming fundamentals with four powerful languages.
                    From data science with Python to systems programming with Rust.
                </p>
                <div class="hero__languages">
                    <span class="hero__language" style="--lang-color: var(--color-python)">
                        Python
                    </span>
                    <span class="hero__language" style="--lang-color: var(--color-swift)">
                        Swift
                    </span>
                    <span class="hero__language" style="--lang-color: #f7df1e">
                        JavaScript
                    </span>
                    <span class="hero__language" style="--lang-color: var(--color-rust)">
                        Rust
                    </span>
                </div>
                <div class="hero__actions">
                    <a routerLink="/course/python" class="hero__btn hero__btn--primary">
                        Start Learning
                    </a>
                    <a routerLink="/profile" class="hero__btn hero__btn--secondary">
                        View Progress
                    </a>
                </div>
            </div>
        </section>
    `,
    styles: `
        .hero {
            padding: var(--spacing-2xl) 0;
            text-align: center;
        }

        .hero__content {
            max-width: 700px;
            margin: 0 auto;
        }

        .hero__title {
            font-size: 2.5rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: var(--spacing-md);

            @media (min-width: 768px) {
                font-size: 3.5rem;
            }
        }

        .hero__title-highlight {
            display: block;
            background: linear-gradient(
                135deg,
                var(--color-swift) 0%,
                var(--color-python) 50%,
                var(--color-rust) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero__description {
            font-size: 1.125rem;
            color: var(--color-text-secondary);
            line-height: 1.7;
            margin-bottom: var(--spacing-xl);

            @media (min-width: 768px) {
                font-size: 1.25rem;
            }
        }

        .hero__languages {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: var(--spacing-sm);
            margin-bottom: var(--spacing-xl);
        }

        .hero__language {
            padding: var(--spacing-xs) var(--spacing-md);
            background-color: var(--color-bg-secondary);
            border: 2px solid var(--lang-color);
            border-radius: var(--radius-xl);
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--color-text);
        }

        .hero__actions {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: var(--spacing-md);
        }

        .hero__btn {
            padding: var(--spacing-md) var(--spacing-xl);
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            border-radius: var(--radius-lg);
            transition: transform 0.2s, box-shadow 0.2s;

            &:hover {
                transform: translateY(-2px);
            }

            &--primary {
                background-color: var(--color-primary);
                color: white;
                box-shadow: var(--shadow-md);

                &:hover {
                    box-shadow: var(--shadow-lg);
                }
            }

            &--secondary {
                background-color: var(--color-bg-secondary);
                color: var(--color-text);
                border: 1px solid var(--color-border);

                &:hover {
                    background-color: var(--color-bg-tertiary);
                }
            }
        }
    `,
})
export class HeroComponent {}
