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
            padding: var(--spacing-2xl) var(--spacing-md);
            text-align: center;
        }

        .hero__content {
            max-width: 800px;
            margin: 0 auto;
            padding: var(--spacing-xl);
            background-color: var(--color-bg-secondary);
            border: 4px solid var(--color-border);
            box-shadow: var(--shadow-lg);
        }

        .hero__title {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: var(--spacing-lg);
            text-transform: uppercase;

            @media (min-width: 768px) {
                font-size: 1.25rem;
            }
        }

        .hero__title-highlight {
            display: block;
            color: var(--color-success);
            margin-top: var(--spacing-sm);
        }

        .hero__description {
            font-size: 0.65rem;
            color: var(--color-text-secondary);
            line-height: 2;
            margin-bottom: var(--spacing-xl);

            @media (min-width: 768px) {
                font-size: 0.7rem;
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
            background-color: var(--color-bg);
            border: 4px solid var(--lang-color);
            font-size: 0.5rem;
            color: var(--color-text);
            text-transform: uppercase;
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
        }

        .hero__actions {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: var(--spacing-md);
        }

        .hero__btn {
            padding: var(--spacing-sm) var(--spacing-lg);
            font-size: 0.6rem;
            text-decoration: none;
            text-transform: uppercase;
            border: 4px solid var(--color-border);
            box-shadow: var(--shadow-sm);
            transition: filter 0.1s, transform 0.1s, box-shadow 0.1s;

            &:hover {
                filter: brightness(1.1);
                transform: translate(-2px, -2px);
                box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.4);
                text-decoration: none;
            }

            &:active {
                transform: translate(2px, 2px);
                box-shadow: none;
            }

            &--primary {
                background-color: var(--color-success);
                color: var(--color-bg);
            }

            &--secondary {
                background-color: var(--color-bg-tertiary);
                color: var(--color-text);
            }
        }
    `,
})
export class HeroComponent {}
