import {
    Component,
    ChangeDetectionStrategy,
    inject,
    signal,
    OnInit,
} from '@angular/core';
import { ContentService } from '@core/services/content.service';
import { Course } from '@core/models/course.model';
import { HeroComponent } from '../../components/hero/hero.component';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-home-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeroComponent, CourseCardComponent, LoadingSpinnerComponent],
    template: `
        <div class="home-page">
            <app-hero />

            <section class="home-page__courses" aria-labelledby="courses-heading">
                <h2 id="courses-heading" class="home-page__section-title">
                    Choose Your Learning Path
                </h2>
                <p class="home-page__section-description">
                    Each track teaches core CS concepts while specializing in the
                    language's unique strengths.
                </p>

                @if (isLoading()) {
                    <app-loading-spinner label="Loading courses..." />
                } @else if (error()) {
                    <div class="home-page__error" role="alert">
                        <p>{{ error() }}</p>
                        <button type="button" (click)="loadCourses()">Try Again</button>
                    </div>
                } @else {
                    <div class="home-page__grid">
                        @for (course of courses(); track course.id) {
                            <app-course-card [course]="course" />
                        }
                    </div>
                }
            </section>

            <section class="home-page__features" aria-labelledby="features-heading">
                <h2 id="features-heading" class="home-page__section-title">
                    Why Learn With Us?
                </h2>

                <div class="home-page__features-grid">
                    <div class="home-page__feature">
                        <div class="home-page__feature-icon">📚</div>
                        <h3 class="home-page__feature-title">Full CS Curriculum</h3>
                        <p class="home-page__feature-description">
                            From variables to distributed systems, learn the complete
                            computer science fundamentals.
                        </p>
                    </div>

                    <div class="home-page__feature">
                        <div class="home-page__feature-icon">🎯</div>
                        <h3 class="home-page__feature-title">Project-Based</h3>
                        <p class="home-page__feature-description">
                            Build real projects that demonstrate mastery and build your
                            portfolio.
                        </p>
                    </div>

                    <div class="home-page__feature">
                        <div class="home-page__feature-icon">💻</div>
                        <h3 class="home-page__feature-title">Interactive Code</h3>
                        <p class="home-page__feature-description">
                            Run code directly in your browser with instant feedback and
                            automated testing.
                        </p>
                    </div>

                    <div class="home-page__feature">
                        <div class="home-page__feature-icon">📈</div>
                        <h3 class="home-page__feature-title">Track Progress</h3>
                        <p class="home-page__feature-description">
                            Monitor your learning journey with detailed progress tracking
                            across all courses.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    `,
    styles: `
        .home-page {
            max-width: var(--max-content-width);
            margin: 0 auto;
        }

        .home-page__courses,
        .home-page__features {
            margin-top: var(--spacing-2xl);
        }

        .home-page__section-title {
            font-size: 1.75rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: var(--spacing-sm);
        }

        .home-page__section-description {
            text-align: center;
            color: var(--color-text-secondary);
            max-width: 600px;
            margin: 0 auto var(--spacing-xl);
        }

        .home-page__grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: var(--spacing-lg);
        }

        .home-page__error {
            text-align: center;
            padding: var(--spacing-xl);
            background-color: var(--color-error-light);
            border-radius: var(--radius-md);

            button {
                margin-top: var(--spacing-md);
                padding: var(--spacing-sm) var(--spacing-lg);
                background-color: var(--color-primary);
                color: white;
                border-radius: var(--radius-md);
                font-weight: 500;

                &:hover {
                    background-color: var(--color-primary-hover);
                }
            }
        }

        .home-page__features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: var(--spacing-lg);
        }

        .home-page__feature {
            padding: var(--spacing-lg);
            background-color: var(--color-bg-secondary);
            border-radius: var(--radius-lg);
            text-align: center;
        }

        .home-page__feature-icon {
            font-size: 2.5rem;
            margin-bottom: var(--spacing-md);
        }

        .home-page__feature-title {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: var(--spacing-sm);
        }

        .home-page__feature-description {
            font-size: 0.875rem;
            color: var(--color-text-secondary);
            line-height: 1.6;
            margin: 0;
        }
    `,
})
export class HomePageComponent implements OnInit {
    private readonly contentService = inject(ContentService);

    public readonly courses = signal<Course[]>([]);
    public readonly isLoading = signal(true);
    public readonly error = signal<string | null>(null);

    async ngOnInit(): Promise<void> {
        await this.loadCourses();
    }

    async loadCourses(): Promise<void> {
        this.isLoading.set(true);
        this.error.set(null);

        try {
            const courses = await this.contentService.loadCourses();
            this.courses.set(courses);
        } catch (err) {
            this.error.set(
                err instanceof Error ? err.message : 'Failed to load courses'
            );
        } finally {
            this.isLoading.set(false);
        }
    }
}
