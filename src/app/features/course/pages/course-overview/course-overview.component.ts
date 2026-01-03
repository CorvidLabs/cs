import {
    Component,
    ChangeDetectionStrategy,
    inject,
    input,
    signal,
    OnInit,
    effect,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { ProgressService } from '@core/services/progress.service';
import { Course } from '@core/models/course.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ProgressIndicatorComponent } from '@shared/components/progress-indicator/progress-indicator.component';

@Component({
    selector: 'app-course-overview',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        BreadcrumbComponent,
        LoadingSpinnerComponent,
        ProgressIndicatorComponent,
    ],
    template: `
        <div class="course-overview">
            @if (isLoading()) {
                <app-loading-spinner label="Loading course..." />
            } @else if (error()) {
                <div class="course-overview__error" role="alert">
                    <p>{{ error() }}</p>
                    <a routerLink="/">Back to Courses</a>
                </div>
            } @else if (course()) {
                <app-breadcrumb [items]="contentService.breadcrumbs()" />

                <header class="course-overview__header" [style.--course-color]="course()!.color">
                    <div class="course-overview__icon" aria-hidden="true">
                        {{ getLanguageEmoji(course()!.id) }}
                    </div>
                    <div class="course-overview__info">
                        <h1 class="course-overview__title">{{ course()!.title }}</h1>
                        <p class="course-overview__description">
                            {{ course()!.description }}
                        </p>
                        <div class="course-overview__meta">
                            <span>{{ course()!.modules.length }} modules</span>
                            <span>{{ course()!.estimatedHours }} hours</span>
                        </div>
                    </div>
                </header>

                <div class="course-overview__progress">
                    <h2 class="course-overview__section-title">Your Progress</h2>
                    <app-progress-indicator
                        [current]="completedLessons()"
                        [total]="totalLessons()"
                        label="Lessons completed"
                    />
                </div>

                <section class="course-overview__modules" aria-labelledby="modules-heading">
                    <h2 id="modules-heading" class="course-overview__section-title">
                        Modules
                    </h2>

                    <ul class="course-overview__module-list">
                        @for (moduleId of course()!.modules; track moduleId; let i = $index) {
                            <li class="course-overview__module-item">
                                <a
                                    [routerLink]="['module', moduleId]"
                                    class="course-overview__module-link"
                                >
                                    <span class="course-overview__module-number">
                                        {{ i + 1 }}
                                    </span>
                                    <span class="course-overview__module-title">
                                        {{ formatModuleTitle(moduleId) }}
                                    </span>
                                    <span class="course-overview__module-arrow" aria-hidden="true">
                                        →
                                    </span>
                                </a>
                            </li>
                        }
                    </ul>
                </section>
            }
        </div>
    `,
    styles: `
        .course-overview {
            max-width: 800px;
            margin: 0 auto;
        }

        .course-overview__error {
            text-align: center;
            padding: var(--spacing-xl);

            a {
                display: inline-block;
                margin-top: var(--spacing-md);
                color: var(--color-primary);
            }
        }

        .course-overview__header {
            display: flex;
            gap: var(--spacing-lg);
            padding: var(--spacing-xl);
            background-color: var(--color-bg-secondary);
            border-radius: var(--radius-lg);
            border-left: 4px solid var(--course-color);
            margin-bottom: var(--spacing-xl);
        }

        .course-overview__icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
            font-size: 2.5rem;
            background-color: var(--course-color);
            border-radius: var(--radius-lg);
            flex-shrink: 0;
        }

        .course-overview__info {
            flex: 1;
        }

        .course-overview__title {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: var(--spacing-sm);
        }

        .course-overview__description {
            color: var(--color-text-secondary);
            margin-bottom: var(--spacing-md);
        }

        .course-overview__meta {
            display: flex;
            gap: var(--spacing-lg);
            font-size: 0.875rem;
            color: var(--color-text-tertiary);
        }

        .course-overview__progress {
            margin-bottom: var(--spacing-xl);
            padding: var(--spacing-lg);
            background-color: var(--color-bg-secondary);
            border-radius: var(--radius-md);
        }

        .course-overview__section-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: var(--spacing-md);
        }

        .course-overview__module-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .course-overview__module-item {
            margin-bottom: var(--spacing-sm);
        }

        .course-overview__module-link {
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
        }

        .course-overview__module-number {
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

        .course-overview__module-title {
            flex: 1;
            font-weight: 500;
        }

        .course-overview__module-arrow {
            color: var(--color-text-tertiary);
        }
    `,
})
export class CourseOverviewComponent implements OnInit {
    public readonly contentService = inject(ContentService);
    private readonly progressService = inject(ProgressService);

    public readonly courseId = input.required<string>();

    public readonly course = signal<Course | null>(null);
    public readonly isLoading = signal(true);
    public readonly error = signal<string | null>(null);
    public readonly completedLessons = signal(0);
    public readonly totalLessons = signal(0);

    constructor() {
        effect(async () => {
            const id = this.courseId();
            if (id) {
                await this.loadCourse(id);
            }
        });
    }

    async ngOnInit(): Promise<void> {
        // Course loading handled by effect
    }

    private async loadCourse(courseId: string): Promise<void> {
        this.isLoading.set(true);
        this.error.set(null);

        try {
            const course = await this.contentService.loadCourse(courseId);
            this.course.set(course);
            this.totalLessons.set(course.modules.length * 4); // Estimate

            const progress = await this.progressService.loadCourseProgress(courseId);
            this.completedLessons.set(progress.completedLessons.length);
        } catch (err) {
            this.error.set(
                err instanceof Error ? err.message : 'Failed to load course'
            );
        } finally {
            this.isLoading.set(false);
        }
    }

    public getLanguageEmoji(id: string): string {
        const emojis: Record<string, string> = {
            python: '🐍',
            swift: '🦅',
            javascript: '🌐',
            rust: '⚙️',
        };
        return emojis[id] ?? '📚';
    }

    public formatModuleTitle(moduleId: string): string {
        return moduleId
            .replace(/^\d+-/, '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }
}
