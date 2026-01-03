import {
    Component,
    ChangeDetectionStrategy,
    inject,
    signal,
    OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { ProgressService } from '@core/services/progress.service';
import { Course } from '@core/models/course.model';
import { ProgressIndicatorComponent } from '@shared/components/progress-indicator/progress-indicator.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

interface CourseProgressData {
    course: Course;
    completedLessons: number;
    completedExercises: number;
    totalLessons: number;
    totalExercises: number;
}

@Component({
    selector: 'app-profile-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, ProgressIndicatorComponent, LoadingSpinnerComponent],
    template: `
        <div class="profile-page">
            <header class="profile-page__header">
                <h1 class="profile-page__title">My Progress</h1>
                <p class="profile-page__subtitle">
                    Track your learning journey across all courses.
                </p>
            </header>

            <section class="profile-page__stats">
                <div class="profile-page__stat">
                    <span class="profile-page__stat-value">
                        {{ progressService.completedLessonsCount() }}
                    </span>
                    <span class="profile-page__stat-label">Lessons Completed</span>
                </div>
                <div class="profile-page__stat">
                    <span class="profile-page__stat-value">
                        {{ progressService.completedExercisesCount() }}
                    </span>
                    <span class="profile-page__stat-label">Exercises Completed</span>
                </div>
                <div class="profile-page__stat">
                    <span class="profile-page__stat-value">
                        {{ courseProgress().length }}
                    </span>
                    <span class="profile-page__stat-label">Courses Started</span>
                </div>
            </section>

            @if (isLoading()) {
                <app-loading-spinner label="Loading progress..." />
            } @else {
                <section
                    class="profile-page__courses"
                    aria-labelledby="courses-heading"
                >
                    <h2 id="courses-heading" class="profile-page__section-title">
                        Course Progress
                    </h2>

                    @if (courseProgress().length === 0) {
                        <div class="profile-page__empty">
                            <p>You haven't started any courses yet.</p>
                            <a routerLink="/" class="profile-page__start-link">
                                Browse Courses →
                            </a>
                        </div>
                    } @else {
                        <div class="profile-page__course-list">
                            @for (progress of courseProgress(); track progress.course.id) {
                                <article
                                    class="profile-page__course-card"
                                    [style.--course-color]="progress.course.color"
                                >
                                    <div class="profile-page__course-header">
                                        <div
                                            class="profile-page__course-icon"
                                            [style.background-color]="progress.course.color"
                                        >
                                            {{ getLanguageEmoji(progress.course.id) }}
                                        </div>
                                        <div class="profile-page__course-info">
                                            <h3 class="profile-page__course-title">
                                                {{ progress.course.title }}
                                            </h3>
                                            <span class="profile-page__course-meta">
                                                {{ progress.completedLessons }} lessons •
                                                {{ progress.completedExercises }} exercises
                                            </span>
                                        </div>
                                    </div>

                                    <app-progress-indicator
                                        [current]="progress.completedLessons + progress.completedExercises"
                                        [total]="progress.totalLessons + progress.totalExercises"
                                        label="Overall progress"
                                    />

                                    <a
                                        [routerLink]="['/course', progress.course.id]"
                                        class="profile-page__course-link"
                                    >
                                        Continue Learning →
                                    </a>
                                </article>
                            }
                        </div>
                    }
                </section>
            }
        </div>
    `,
    styles: `
        .profile-page {
            max-width: 900px;
            margin: 0 auto;
        }

        .profile-page__header {
            margin-bottom: var(--spacing-xl);
        }

        .profile-page__title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: var(--spacing-sm);
        }

        .profile-page__subtitle {
            color: var(--color-text-secondary);
        }

        .profile-page__stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-2xl);
        }

        .profile-page__stat {
            padding: var(--spacing-lg);
            background-color: var(--color-bg-secondary);
            border-radius: var(--radius-lg);
            text-align: center;
        }

        .profile-page__stat-value {
            display: block;
            font-size: 2rem;
            font-weight: 700;
            color: var(--color-primary);
            margin-bottom: var(--spacing-xs);
        }

        .profile-page__stat-label {
            font-size: 0.875rem;
            color: var(--color-text-secondary);
        }

        .profile-page__section-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: var(--spacing-lg);
        }

        .profile-page__empty {
            text-align: center;
            padding: var(--spacing-2xl);
            background-color: var(--color-bg-secondary);
            border-radius: var(--radius-lg);

            p {
                color: var(--color-text-secondary);
                margin-bottom: var(--spacing-md);
            }
        }

        .profile-page__start-link {
            color: var(--color-primary);
            font-weight: 500;
        }

        .profile-page__course-list {
            display: grid;
            gap: var(--spacing-lg);
        }

        .profile-page__course-card {
            padding: var(--spacing-lg);
            background-color: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-left: 4px solid var(--course-color);
            border-radius: var(--radius-lg);
        }

        .profile-page__course-header {
            display: flex;
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-lg);
        }

        .profile-page__course-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            font-size: 1.5rem;
            border-radius: var(--radius-md);
            flex-shrink: 0;
        }

        .profile-page__course-info {
            flex: 1;
        }

        .profile-page__course-title {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: var(--spacing-xs);
        }

        .profile-page__course-meta {
            font-size: 0.875rem;
            color: var(--color-text-secondary);
        }

        .profile-page__course-link {
            display: block;
            margin-top: var(--spacing-md);
            color: var(--color-primary);
            font-weight: 500;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    `,
})
export class ProfilePageComponent implements OnInit {
    private readonly contentService = inject(ContentService);
    public readonly progressService = inject(ProgressService);

    public readonly courseProgress = signal<CourseProgressData[]>([]);
    public readonly isLoading = signal(true);

    async ngOnInit(): Promise<void> {
        await this.loadProgress();
    }

    private async loadProgress(): Promise<void> {
        this.isLoading.set(true);

        try {
            const courses = await this.contentService.loadCourses();
            const progressData: CourseProgressData[] = [];

            for (const course of courses) {
                const progress = await this.progressService.loadCourseProgress(
                    course.id
                );

                if (
                    progress.completedLessons.length > 0 ||
                    progress.completedExercises.length > 0
                ) {
                    progressData.push({
                        course,
                        completedLessons: progress.completedLessons.length,
                        completedExercises: progress.completedExercises.length,
                        totalLessons: course.modules.length * 4,
                        totalExercises: course.modules.length * 8,
                    });
                }
            }

            this.courseProgress.set(progressData);
        } catch {
            // Handle error silently
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
}
