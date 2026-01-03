import {
    Component,
    ChangeDetectionStrategy,
    inject,
    signal,
    OnInit,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { ProgressService } from '@core/services/progress.service';
import { Course } from '@core/models/course.model';

@Component({
    selector: 'app-sidebar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive],
    template: `
        <aside class="sidebar">
            <nav class="sidebar__nav" aria-label="Course navigation">
                <div class="sidebar__section">
                    <h2 class="sidebar__section-title">Courses</h2>
                    <ul class="sidebar__list">
                        @for (course of courses(); track course.id) {
                            <li class="sidebar__item">
                                <a
                                    [routerLink]="['/course', course.id]"
                                    routerLinkActive="sidebar__link--active"
                                    class="sidebar__link"
                                    [style.--course-color]="course.color"
                                >
                                    <span
                                        class="sidebar__icon"
                                        [style.background-color]="course.color"
                                    ></span>
                                    <span class="sidebar__link-text">{{ course.title }}</span>
                                </a>
                            </li>
                        }
                    </ul>
                </div>

                <div class="sidebar__section">
                    <h2 class="sidebar__section-title">Quick Links</h2>
                    <ul class="sidebar__list">
                        <li class="sidebar__item">
                            <a
                                routerLink="/profile"
                                routerLinkActive="sidebar__link--active"
                                class="sidebar__link"
                            >
                                <span class="sidebar__icon sidebar__icon--profile"></span>
                                <span class="sidebar__link-text">My Progress</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <div class="sidebar__footer">
                <div class="sidebar__progress">
                    <span class="sidebar__progress-label">Overall Progress</span>
                    <span class="sidebar__progress-value">
                        {{ progressService.completedLessonsCount() }} lessons completed
                    </span>
                </div>
            </div>
        </aside>
    `,
    styles: `
        .sidebar {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: var(--spacing-lg);
            background-color: var(--color-bg-secondary);
            border-right: 1px solid var(--color-border);
        }

        .sidebar__nav {
            flex: 1;
            overflow-y: auto;
        }

        .sidebar__section {
            margin-bottom: var(--spacing-xl);
        }

        .sidebar__section-title {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-text-tertiary);
            margin-bottom: var(--spacing-sm);
            padding: 0 var(--spacing-sm);
        }

        .sidebar__list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .sidebar__item {
            margin-bottom: 2px;
        }

        .sidebar__link {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-sm) var(--spacing-md);
            color: var(--color-text-secondary);
            text-decoration: none;
            border-radius: var(--radius-md);
            transition: background-color 0.2s, color 0.2s;

            &:hover {
                background-color: var(--color-bg-tertiary);
                color: var(--color-text);
            }

            &--active {
                background-color: var(--color-primary-light);
                color: var(--color-primary);
                font-weight: 500;
            }
        }

        .sidebar__icon {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;

            &--profile {
                background-color: var(--color-text-tertiary);
            }
        }

        .sidebar__link-text {
            font-size: 0.875rem;
        }

        .sidebar__footer {
            padding-top: var(--spacing-md);
            border-top: 1px solid var(--color-border);
        }

        .sidebar__progress {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-xs);
        }

        .sidebar__progress-label {
            font-size: 0.75rem;
            color: var(--color-text-tertiary);
            text-transform: uppercase;
        }

        .sidebar__progress-value {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--color-text);
        }
    `,
})
export class SidebarComponent implements OnInit {
    private readonly contentService = inject(ContentService);
    public readonly progressService = inject(ProgressService);

    public readonly courses = signal<Course[]>([]);

    async ngOnInit(): Promise<void> {
        try {
            const courses = await this.contentService.loadCourses();
            this.courses.set(courses);
        } catch {
            // Courses will load from the API when available
        }
    }
}
