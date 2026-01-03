import {
    Component,
    ChangeDetectionStrategy,
    input,
    output,
    inject,
    signal,
    OnInit,
    effect,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { Course } from '@core/models/course.model';

@Component({
    selector: 'app-mobile-nav',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive],
    template: `
        @if (isOpen()) {
            <div
                class="mobile-nav__backdrop"
                (click)="close.emit()"
                aria-hidden="true"
            ></div>
        }

        <nav
            id="mobile-nav"
            class="mobile-nav"
            [class.mobile-nav--open]="isOpen()"
            [attr.aria-hidden]="!isOpen()"
            aria-label="Mobile navigation"
        >
            <div class="mobile-nav__header">
                <span class="mobile-nav__title">Menu</span>
                <button
                    type="button"
                    class="mobile-nav__close"
                    (click)="close.emit()"
                    aria-label="Close navigation menu"
                >
                    ✕
                </button>
            </div>

            <div class="mobile-nav__content">
                <div class="mobile-nav__section">
                    <h2 class="mobile-nav__section-title">Courses</h2>
                    <ul class="mobile-nav__list">
                        @for (course of courses(); track course.id) {
                            <li>
                                <a
                                    [routerLink]="['/course', course.id]"
                                    routerLinkActive="mobile-nav__link--active"
                                    class="mobile-nav__link"
                                    (click)="close.emit()"
                                >
                                    <span
                                        class="mobile-nav__icon"
                                        [style.background-color]="course.color"
                                    ></span>
                                    {{ course.title }}
                                </a>
                            </li>
                        }
                    </ul>
                </div>

                <div class="mobile-nav__section">
                    <h2 class="mobile-nav__section-title">Quick Links</h2>
                    <ul class="mobile-nav__list">
                        <li>
                            <a
                                routerLink="/"
                                routerLinkActive="mobile-nav__link--active"
                                [routerLinkActiveOptions]="{ exact: true }"
                                class="mobile-nav__link"
                                (click)="close.emit()"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                routerLink="/profile"
                                routerLinkActive="mobile-nav__link--active"
                                class="mobile-nav__link"
                                (click)="close.emit()"
                            >
                                My Progress
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `,
    styles: `
        .mobile-nav__backdrop {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 199;

            @media (min-width: 1024px) {
                display: none;
            }
        }

        .mobile-nav {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 280px;
            max-width: 85vw;
            background-color: var(--color-bg);
            transform: translateX(-100%);
            transition: transform 0.3s ease-out;
            z-index: 200;
            display: flex;
            flex-direction: column;

            &--open {
                transform: translateX(0);
            }

            @media (min-width: 1024px) {
                display: none;
            }
        }

        .mobile-nav__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--color-border);
        }

        .mobile-nav__title {
            font-size: 1.125rem;
            font-weight: 600;
        }

        .mobile-nav__close {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            font-size: 1.25rem;
            color: var(--color-text);
            border-radius: var(--radius-md);

            &:hover {
                background-color: var(--color-bg-secondary);
            }
        }

        .mobile-nav__content {
            flex: 1;
            overflow-y: auto;
            padding: var(--spacing-md);
        }

        .mobile-nav__section {
            margin-bottom: var(--spacing-xl);
        }

        .mobile-nav__section-title {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-text-tertiary);
            margin-bottom: var(--spacing-sm);
            padding: 0 var(--spacing-sm);
        }

        .mobile-nav__list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .mobile-nav__link {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-md);
            color: var(--color-text);
            text-decoration: none;
            border-radius: var(--radius-md);
            font-size: 1rem;

            &:hover {
                background-color: var(--color-bg-secondary);
            }

            &--active {
                background-color: var(--color-primary-light);
                color: var(--color-primary);
                font-weight: 500;
            }
        }

        .mobile-nav__icon {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
        }
    `,
})
export class MobileNavComponent implements OnInit {
    private readonly contentService = inject(ContentService);

    public readonly isOpen = input(false);
    public readonly close = output<void>();

    public readonly courses = signal<Course[]>([]);

    constructor() {
        effect(() => {
            if (this.isOpen()) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    async ngOnInit(): Promise<void> {
        try {
            const courses = await this.contentService.loadCourses();
            this.courses.set(courses);
        } catch {
            // Courses will load from the API when available
        }
    }
}
