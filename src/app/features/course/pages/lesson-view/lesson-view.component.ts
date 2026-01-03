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
import { Lesson } from '@core/models/course.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { MarkdownRendererComponent } from '@shared/components/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-lesson-view',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        BreadcrumbComponent,
        LoadingSpinnerComponent,
        MarkdownRendererComponent,
    ],
    template: `
        <div class="lesson-view">
            @if (isLoading()) {
                <app-loading-spinner label="Loading lesson..." />
            } @else if (error()) {
                <div class="lesson-view__error" role="alert">
                    <p>{{ error() }}</p>
                    <a [routerLink]="['/course', courseId(), 'module', moduleId()]">
                        Back to Module
                    </a>
                </div>
            } @else if (lesson()) {
                <app-breadcrumb [items]="contentService.breadcrumbs()" />

                <article class="lesson-view__content">
                    <header class="lesson-view__header">
                        <div class="lesson-view__meta">
                            <span class="lesson-view__time">
                                {{ lesson()!.estimatedMinutes }} min read
                            </span>
                            @if (isComplete()) {
                                <span class="lesson-view__completed">✓ Completed</span>
                            }
                        </div>
                        <h1 class="lesson-view__title">{{ lesson()!.title }}</h1>
                    </header>

                    <app-markdown-renderer [content]="lesson()!.content" />

                    <footer class="lesson-view__footer">
                        @if (!isComplete()) {
                            <button
                                type="button"
                                class="lesson-view__complete-btn"
                                (click)="markComplete()"
                            >
                                Mark as Complete
                            </button>
                        }

                        <nav class="lesson-view__nav" aria-label="Lesson navigation">
                            <a
                                [routerLink]="['/course', courseId(), 'module', moduleId()]"
                                class="lesson-view__nav-link"
                            >
                                ← Back to Module
                            </a>
                        </nav>
                    </footer>
                </article>
            }
        </div>
    `,
    styles: `
        .lesson-view {
            max-width: 800px;
            margin: 0 auto;
        }

        .lesson-view__error {
            text-align: center;
            padding: var(--spacing-xl);
            background-color: var(--color-bg-secondary);
            border: 4px solid var(--color-error);

            p {
                font-size: 0.55rem;
                text-transform: uppercase;
                margin-bottom: var(--spacing-md);
            }

            a {
                display: inline-block;
                padding: var(--spacing-sm) var(--spacing-md);
                background-color: var(--color-bg-tertiary);
                border: 4px solid var(--color-border);
                color: var(--color-primary);
                font-size: 0.5rem;
                text-transform: uppercase;
                text-decoration: none;

                &:active {
                    transform: translate(2px, 2px);
                }
            }
        }

        .lesson-view__content {
            background-color: var(--color-bg);
        }

        .lesson-view__header {
            margin-bottom: var(--spacing-xl);
            padding: var(--spacing-lg);
            background-color: var(--color-bg-secondary);
            border: 4px solid var(--color-border);
        }

        .lesson-view__meta {
            display: flex;
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-sm);
        }

        .lesson-view__time {
            font-size: 0.45rem;
            color: var(--color-text-tertiary);
            text-transform: uppercase;
            padding: var(--spacing-xs) var(--spacing-sm);
            background-color: var(--color-bg-tertiary);
            border: 2px solid var(--color-border);
        }

        .lesson-view__completed {
            font-size: 0.45rem;
            color: var(--color-success);
            text-transform: uppercase;
            padding: var(--spacing-xs) var(--spacing-sm);
            background-color: rgba(146, 204, 65, 0.1);
            border: 2px solid var(--color-success);
        }

        .lesson-view__title {
            font-size: 0.7rem;
            line-height: 1.6;
            margin: 0;
            text-transform: uppercase;
        }

        .lesson-view__footer {
            margin-top: var(--spacing-2xl);
            padding-top: var(--spacing-lg);
            border-top: 4px solid var(--color-border);
        }

        .lesson-view__complete-btn {
            display: block;
            width: 100%;
            padding: var(--spacing-md);
            background-color: var(--color-success);
            color: var(--color-bg);
            font-size: 0.55rem;
            text-transform: uppercase;
            border: 4px solid var(--color-border);
            margin-bottom: var(--spacing-lg);
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
            transition: transform 0.1s, box-shadow 0.1s;

            &:hover {
                transform: translate(-2px, -2px);
                box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
            }

            &:active {
                transform: translate(2px, 2px);
                box-shadow: none;
            }
        }

        .lesson-view__nav {
            display: flex;
            justify-content: space-between;
        }

        .lesson-view__nav-link {
            color: var(--color-text-secondary);
            text-decoration: none;
            font-size: 0.5rem;
            text-transform: uppercase;
            padding: var(--spacing-sm) var(--spacing-md);
            border: 2px solid transparent;
            transition: border-color 0.1s;

            &:hover {
                color: var(--color-primary);
                border-color: var(--color-border);
                text-decoration: none;
            }
        }
    `,
})
export class LessonViewComponent {
    public readonly contentService = inject(ContentService);
    private readonly progressService = inject(ProgressService);

    public readonly courseId = input.required<string>();
    public readonly moduleId = input.required<string>();
    public readonly lessonId = input.required<string>();

    public readonly lesson = signal<Lesson | null>(null);
    public readonly isLoading = signal(true);
    public readonly error = signal<string | null>(null);
    public readonly isComplete = signal(false);

    constructor() {
        effect(async () => {
            const courseId = this.courseId();
            const moduleId = this.moduleId();
            const lessonId = this.lessonId();
            if (courseId && moduleId && lessonId) {
                await this.loadLesson(courseId, moduleId, lessonId);
            }
        });
    }

    private async loadLesson(
        courseId: string,
        moduleId: string,
        lessonId: string
    ): Promise<void> {
        this.isLoading.set(true);
        this.error.set(null);

        try {
            await this.contentService.loadCourse(courseId);
            await this.contentService.loadModule(courseId, moduleId);
            const lesson = await this.contentService.loadLesson(
                courseId,
                moduleId,
                lessonId
            );
            this.lesson.set(lesson);

            const key = `${courseId}:${moduleId}:${lessonId}`;
            this.isComplete.set(this.progressService.completedLessons().has(key));
        } catch (err) {
            this.error.set(
                err instanceof Error ? err.message : 'Failed to load lesson'
            );
        } finally {
            this.isLoading.set(false);
        }
    }

    public async markComplete(): Promise<void> {
        await this.progressService.markLessonComplete(
            this.courseId(),
            this.moduleId(),
            this.lessonId()
        );
        this.isComplete.set(true);
    }
}
