import {
    Component,
    ChangeDetectionStrategy,
    inject,
    input,
    signal,
    effect,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { ProgressService } from '@core/services/progress.service';
import { Module } from '@core/models/course.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-module-view',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, BreadcrumbComponent, LoadingSpinnerComponent],
    template: `
        <div class="module-view">
            @if (isLoading()) {
                <app-loading-spinner label="Loading module..." />
            } @else if (error()) {
                <div class="module-view__error" role="alert">
                    <p>{{ error() }}</p>
                    <a [routerLink]="['/course', courseId()]">Back to Course</a>
                </div>
            } @else if (module()) {
                <app-breadcrumb [items]="contentService.breadcrumbs()" />

                <header class="module-view__header">
                    <h1 class="module-view__title">{{ module()!.title }}</h1>
                    <p class="module-view__description">{{ module()!.description }}</p>
                </header>

                @if (module()!.lessons.length > 0) {
                    <section class="module-view__section" aria-labelledby="lessons-heading">
                        <h2 id="lessons-heading" class="module-view__section-title">
                            Lessons
                        </h2>
                        <ul class="module-view__list">
                            @for (lessonId of module()!.lessons; track lessonId; let i = $index) {
                                <li class="module-view__item">
                                    <a
                                        [routerLink]="['lesson', lessonId]"
                                        class="module-view__link"
                                        [class.module-view__link--completed]="isLessonComplete(lessonId)"
                                    >
                                        <span class="module-view__item-status" aria-hidden="true">
                                            @if (isLessonComplete(lessonId)) {
                                                ✓
                                            } @else {
                                                {{ i + 1 }}
                                            }
                                        </span>
                                        <span class="module-view__item-title">
                                            {{ formatTitle(lessonId) }}
                                        </span>
                                        <span class="module-view__item-type">Lesson</span>
                                    </a>
                                </li>
                            }
                        </ul>
                    </section>
                }

                @if (module()!.exercises.length > 0) {
                    <section class="module-view__section" aria-labelledby="exercises-heading">
                        <h2 id="exercises-heading" class="module-view__section-title">
                            Exercises
                        </h2>
                        <ul class="module-view__list">
                            @for (exerciseId of module()!.exercises; track exerciseId; let i = $index) {
                                <li class="module-view__item">
                                    <a
                                        [routerLink]="['exercise', exerciseId]"
                                        class="module-view__link module-view__link--exercise"
                                        [class.module-view__link--completed]="isExerciseComplete(exerciseId)"
                                    >
                                        <span class="module-view__item-status" aria-hidden="true">
                                            @if (isExerciseComplete(exerciseId)) {
                                                ✓
                                            } @else {
                                                {{ i + 1 }}
                                            }
                                        </span>
                                        <span class="module-view__item-title">
                                            {{ formatTitle(exerciseId) }}
                                        </span>
                                        <span class="module-view__item-type">Exercise</span>
                                    </a>
                                </li>
                            }
                        </ul>
                    </section>
                }
            }
        </div>
    `,
    styles: `
        .module-view {
            max-width: 800px;
            margin: 0 auto;
        }

        .module-view__error {
            text-align: center;
            padding: var(--spacing-xl);

            a {
                display: inline-block;
                margin-top: var(--spacing-md);
                color: var(--color-primary);
            }
        }

        .module-view__header {
            margin-bottom: var(--spacing-xl);
        }

        .module-view__title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: var(--spacing-sm);
        }

        .module-view__description {
            color: var(--color-text-secondary);
            font-size: 1.125rem;
        }

        .module-view__section {
            margin-bottom: var(--spacing-xl);
        }

        .module-view__section-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: var(--spacing-md);
        }

        .module-view__list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .module-view__item {
            margin-bottom: var(--spacing-sm);
        }

        .module-view__link {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            padding: var(--spacing-md) var(--spacing-lg);
            background-color: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            text-decoration: none;
            color: var(--color-text);
            transition: border-color 0.2s, background-color 0.2s;

            &:hover {
                border-color: var(--color-primary);
                background-color: var(--color-bg);
            }

            &--exercise {
                border-left: 4px solid var(--color-warning);
            }

            &--completed {
                background-color: var(--color-success-light);
                border-color: var(--color-success);

                .module-view__item-status {
                    background-color: var(--color-success);
                    color: white;
                }
            }
        }

        .module-view__item-status {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background-color: var(--color-bg-tertiary);
            border-radius: 50%;
            font-size: 0.875rem;
            font-weight: 600;
            flex-shrink: 0;
        }

        .module-view__item-title {
            flex: 1;
            font-weight: 500;
        }

        .module-view__item-type {
            font-size: 0.75rem;
            color: var(--color-text-tertiary);
            text-transform: uppercase;
        }
    `,
})
export class ModuleViewComponent {
    public readonly contentService = inject(ContentService);
    private readonly progressService = inject(ProgressService);

    public readonly courseId = input.required<string>();
    public readonly moduleId = input.required<string>();

    public readonly module = signal<Module | null>(null);
    public readonly isLoading = signal(true);
    public readonly error = signal<string | null>(null);

    constructor() {
        effect(async () => {
            const courseId = this.courseId();
            const moduleId = this.moduleId();
            if (courseId && moduleId) {
                await this.loadModule(courseId, moduleId);
            }
        });
    }

    private async loadModule(courseId: string, moduleId: string): Promise<void> {
        this.isLoading.set(true);
        this.error.set(null);

        try {
            await this.contentService.loadCourse(courseId);
            const module = await this.contentService.loadModule(courseId, moduleId);
            this.module.set(module);
        } catch (err) {
            this.error.set(
                err instanceof Error ? err.message : 'Failed to load module'
            );
        } finally {
            this.isLoading.set(false);
        }
    }

    public isLessonComplete(lessonId: string): boolean {
        const key = `${this.courseId()}:${this.moduleId()}:${lessonId}`;
        return this.progressService.completedLessons().has(key);
    }

    public isExerciseComplete(exerciseId: string): boolean {
        const key = `${this.courseId()}:${this.moduleId()}:${exerciseId}`;
        return this.progressService.completedExercises().has(key);
    }

    public formatTitle(id: string): string {
        return id
            .replace(/^\d+-/, '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }
}
