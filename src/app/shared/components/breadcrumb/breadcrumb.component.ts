import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Breadcrumb } from '@core/models/course.model';

@Component({
    selector: 'app-breadcrumb',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
    template: `
        <nav class="breadcrumb" aria-label="Breadcrumb">
            <ol class="breadcrumb__list">
                <li class="breadcrumb__item">
                    <a routerLink="/" class="breadcrumb__link">Home</a>
                </li>
                @for (crumb of items(); track crumb.label; let last = $last) {
                    <li class="breadcrumb__item">
                        <span class="breadcrumb__separator" aria-hidden="true">/</span>
                        @if (crumb.route && !last) {
                            <a [routerLink]="crumb.route" class="breadcrumb__link">
                                {{ crumb.label }}
                            </a>
                        } @else {
                            <span class="breadcrumb__current" [attr.aria-current]="last ? 'page' : null">
                                {{ crumb.label }}
                            </span>
                        }
                    </li>
                }
            </ol>
        </nav>
    `,
    styles: `
        .breadcrumb {
            margin-bottom: var(--spacing-md);
        }

        .breadcrumb__list {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: var(--spacing-xs);
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .breadcrumb__item {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
        }

        .breadcrumb__separator {
            color: var(--color-text-tertiary);
        }

        .breadcrumb__link {
            color: var(--color-text-secondary);
            text-decoration: none;
            font-size: 0.875rem;

            &:hover {
                color: var(--color-primary);
                text-decoration: underline;
            }
        }

        .breadcrumb__current {
            color: var(--color-text);
            font-size: 0.875rem;
            font-weight: 500;
        }
    `,
})
export class BreadcrumbComponent {
    public readonly items = input.required<Breadcrumb[]>();
}
