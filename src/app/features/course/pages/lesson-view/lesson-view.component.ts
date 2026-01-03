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

            a {
                display: inline-block;
                margin-top: var(--spacing-md);
                color: var(--color-primary);
            }
        }

        .lesson-view__content {
            background-color: var(--color-bg);
        }

        .lesson-view__header {
            margin-bottom: var(--spacing-xl);
            padding-bottom: var(--spacing-lg);
            border-bottom: 1px solid var(--color-border);
        }

        .lesson-view__meta {
            display: flex;
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-sm);
        }

        .lesson-view__time {
            font-size: 0.875rem;
            color: var(--color-text-tertiary);
        }

        .lesson-view__completed {
            font-size: 0.875rem;
            color: var(--color-success);
            font-weight: 500;
        }

        .lesson-view__title {
            font-size: 2rem;
            font-weight: 700;
            line-height: 1.2;
            margin: 0;
        }

        .lesson-view__footer {
            margin-top: var(--spacing-2xl);
            padding-top: var(--spacing-lg);
            border-top: 1px solid var(--color-border);
        }

        .lesson-view__complete-btn {
            display: block;
            width: 100%;
            padding: var(--spacing-md);
            background-color: var(--color-success);
            color: white;
            font-size: 1rem;
            font-weight: 600;
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-lg);
            transition: background-color 0.2s;

            &:hover {
                background-color: #1a7c36;
            }
        }

        .lesson-view__nav {
            display: flex;
            justify-content: space-between;
        }

        .lesson-view__nav-link {
            color: var(--color-text-secondary);
            text-decoration: none;
            font-size: 0.875rem;

            &:hover {
                color: var(--color-primary);
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
