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
            background-color: var(--color-bg-secondary);
            border: 4px solid var(--color-border);
            box-shadow: var(--shadow-md);
            transition: transform 0.1s, box-shadow 0.1s;

            &:hover {
                transform: translate(-2px, -2px);
                box-shadow: 10px 10px 0 #000000b3;
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
            border: 4px solid var(--color-border);
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
        }

        .course-card__hours {
            padding: var(--spacing-xs) var(--spacing-sm);
            background-color: var(--color-bg-tertiary);
            border: 2px solid var(--color-border);
            font-size: 0.5rem;
            color: var(--color-text-secondary);
            text-transform: uppercase;
        }

        .course-card__title {
            font-size: 0.75rem;
            margin-bottom: var(--spacing-sm);
            text-transform: uppercase;
        }

        .course-card__description {
            flex: 1;
            font-size: 0.6rem;
            color: var(--color-text-secondary);
            line-height: 2;
            margin-bottom: var(--spacing-md);
        }

        .course-card__meta {
            margin-bottom: var(--spacing-md);
        }

        .course-card__modules {
            font-size: 0.5rem;
            color: var(--color-text-tertiary);
            text-transform: uppercase;
        }

        .course-card__link {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-sm) var(--spacing-md);
            background-color: var(--course-color);
            color: var(--color-bg);
            font-size: 0.55rem;
            text-decoration: none;
            text-transform: uppercase;
            border: 4px solid var(--color-border);
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
            transition: filter 0.1s, transform 0.1s, box-shadow 0.1s;

            &:hover {
                filter: brightness(1.1);
                transform: translate(-1px, -1px);
                box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.4);
                text-decoration: none;
            }

            &:active {
                transform: translate(2px, 2px);
                box-shadow: none;
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
