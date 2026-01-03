import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '@core/models/course.model';

@Component({
    selector: 'app-course-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
    template: `
        <article
            class="course-card"
            [style.--course-color]="course().color"
        >
            <div class="course-card__header">
                <div
                    class="course-card__icon"
                    [style.background-color]="course().color"
                    aria-hidden="true"
                >
                    {{ getLanguageEmoji(course().id) }}
                </div>
                <span class="course-card__hours">
                    {{ course().estimatedHours }}h
                </span>
            </div>

            <h3 class="course-card__title">{{ course().title }}</h3>
            <p class="course-card__description">{{ course().description }}</p>

            <div class="course-card__meta">
                <span class="course-card__modules">
                    {{ course().modules.length }} modules
                </span>
            </div>

            <a
                [routerLink]="['/course', course().id]"
                class="course-card__link"
                [attr.aria-label]="'Start ' + course().title + ' course'"
            >
                Start Course
                <span aria-hidden="true">→</span>
            </a>
        </article>
    `,
    styles: `
        .course-card {
            display: flex;
            flex-direction: column;
            padding: var(--spacing-lg);
            background-color: var(--color-bg);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            transition: border-color 0.2s, box-shadow 0.2s;

            &:hover {
                border-color: var(--course-color);
                box-shadow: var(--shadow-md);
            }
        }

        .course-card__header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: var(--spacing-md);
        }

        .course-card__icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            font-size: 1.5rem;
            border-radius: var(--radius-md);
        }

        .course-card__hours {
            padding: var(--spacing-xs) var(--spacing-sm);
            background-color: var(--color-bg-secondary);
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--color-text-secondary);
        }

        .course-card__title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: var(--spacing-sm);
        }

        .course-card__description {
            flex: 1;
            font-size: 0.875rem;
            color: var(--color-text-secondary);
            line-height: 1.6;
            margin-bottom: var(--spacing-md);
        }

        .course-card__meta {
            margin-bottom: var(--spacing-md);
        }

        .course-card__modules {
            font-size: 0.75rem;
            color: var(--color-text-tertiary);
        }

        .course-card__link {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-xs);
            padding: var(--spacing-sm) var(--spacing-md);
            background-color: var(--course-color);
            color: white;
            font-weight: 500;
            text-decoration: none;
            border-radius: var(--radius-md);
            transition: opacity 0.2s;

            &:hover {
                opacity: 0.9;
            }
        }
    `,
})
export class CourseCardComponent {
    public readonly course = input.required<Course>();

    public getLanguageEmoji(id: string): string {
        const emojis: Record<string, string> = {
            python: '🐍',
            swift: '🦅',
            javascript: '🌐',
            rust: '⚙️',
        };
        return emojis[id] ?? '📚';
    }
}
