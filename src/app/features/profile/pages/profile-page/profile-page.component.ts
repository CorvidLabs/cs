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
            padding: var(--spacing-lg);
            background-color: var(--color-bg-secondary);
            border: 4px solid var(--color-border);
        }

        .profile-page__title {
            font-size: 0.85rem;
            margin-bottom: var(--spacing-sm);
            text-transform: uppercase;
        }

        .profile-page__subtitle {
            color: var(--color-text-secondary);
            font-size: 0.55rem;
            line-height: 2;
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
            border: 4px solid var(--color-border);
            text-align: center;
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
        }

        .profile-page__stat-value {
            display: block;
            font-size: 1rem;
            color: var(--color-success);
            margin-bottom: var(--spacing-xs);
        }

        .profile-page__stat-label {
            font-size: 0.45rem;
            color: var(--color-text-secondary);
            text-transform: uppercase;
        }

        .profile-page__section-title {
            font-size: 0.6rem;
            margin-bottom: var(--spacing-lg);
            text-transform: uppercase;
            padding-bottom: var(--spacing-sm);
            border-bottom: 2px solid var(--color-border);
        }

        .profile-page__empty {
            text-align: center;
            padding: var(--spacing-2xl);
            background-color: var(--color-bg-secondary);
            border: 4px solid var(--color-border);

            p {
                color: var(--color-text-secondary);
                font-size: 0.55rem;
                margin-bottom: var(--spacing-md);
            }
        }

        .profile-page__start-link {
            display: inline-block;
            padding: var(--spacing-sm) var(--spacing-lg);
            background-color: var(--color-success);
            border: 4px solid var(--color-border);
            color: var(--color-bg);
            font-size: 0.5rem;
            text-transform: uppercase;
            text-decoration: none;
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
            transition: transform 0.1s, box-shadow 0.1s;

            &:hover {
                transform: translate(-2px, -2px);
                box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
                text-decoration: none;
            }

            &:active {
                transform: translate(2px, 2px);
                box-shadow: none;
            }
        }

        .profile-page__course-list {
            display: grid;
            gap: var(--spacing-lg);
        }

        .profile-page__course-card {
            padding: var(--spacing-lg);
            background-color: var(--color-bg-secondary);
            border: 4px solid var(--color-border);
            border-left: 8px solid var(--course-color);
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
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
            border: 4px solid var(--color-border);
            flex-shrink: 0;
        }

        .profile-page__course-info {
            flex: 1;
        }

        .profile-page__course-title {
            font-size: 0.6rem;
            margin-bottom: var(--spacing-xs);
            text-transform: uppercase;
        }

        .profile-page__course-meta {
            font-size: 0.45rem;
            color: var(--color-text-secondary);
            text-transform: uppercase;
        }

        .profile-page__course-link {
            display: inline-block;
            margin-top: var(--spacing-md);
            padding: var(--spacing-sm) var(--spacing-md);
            background-color: var(--course-color);
            color: var(--color-bg);
            font-size: 0.5rem;
            text-transform: uppercase;
            text-decoration: none;
            border: 4px solid var(--color-border);
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
            transition: transform 0.1s, box-shadow 0.1s;

            &:hover {
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
