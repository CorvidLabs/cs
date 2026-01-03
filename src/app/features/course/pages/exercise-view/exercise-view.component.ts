import {
    Component,
    ChangeDetectionStrategy,
    inject,
    input,
    signal,
    effect,
    viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { ProgressService } from '@core/services/progress.service';
import { CodeExecutorService } from '@core/services/code-executor.service';
import { Exercise } from '@core/models/course.model';
import { TestResult } from '@core/models/progress.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { CodeEditorComponent } from '@shared/components/code-editor/code-editor.component';
import { MarkdownRendererComponent } from '@shared/components/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-exercise-view',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        BreadcrumbComponent,
        LoadingSpinnerComponent,
        CodeEditorComponent,
        MarkdownRendererComponent,
    ],
    template: `
        <div class="exercise-view">
            @if (isLoading()) {
                <app-loading-spinner label="Loading exercise..." />
            } @else if (error()) {
                <div class="exercise-view__error" role="alert">
                    <p>{{ error() }}</p>
                    <a [routerLink]="['/course', courseId(), 'module', moduleId()]">
                        Back to Module
                    </a>
                </div>
            } @else if (exercise()) {
                <app-breadcrumb [items]="contentService.breadcrumbs()" />

                <div class="exercise-view__layout">
                    <section class="exercise-view__instructions">
                        <header class="exercise-view__header">
                            <h1 class="exercise-view__title">{{ exercise()!.title }}</h1>
                            @if (isComplete()) {
                                <span class="exercise-view__completed">✓ Completed</span>
                            }
                        </header>

                        <app-markdown-renderer [content]="exercise()!.description" />

                        @if (exercise()!.hints.length > 0) {
                            <div class="exercise-view__hints">
                                <button
                                    type="button"
                                    class="exercise-view__hints-toggle"
                                    (click)="showHints.set(!showHints())"
                                    [attr.aria-expanded]="showHints()"
                                >
                                    {{ showHints() ? 'Hide Hints' : 'Show Hints' }}
                                </button>
                                @if (showHints()) {
                                    <ul class="exercise-view__hints-list">
                                        @for (hint of exercise()!.hints; track $index) {
                                            <li>{{ hint }}</li>
                                        }
                                    </ul>
                                }
                            </div>
                        }
                    </section>

                    <section class="exercise-view__workspace">
                        <app-code-editor
                            #editor
                            [initialCode]="exercise()!.starterCode"
                            [language]="getEditorLanguage()"
                            (codeChange)="onCodeChange($event)"
                        />

                        <div class="exercise-view__actions">
                            <button
                                type="button"
                                class="exercise-view__run-btn"
                                (click)="runTests()"
                                [disabled]="isRunning()"
                            >
                                @if (isRunning()) {
                                    Running Tests...
                                } @else {
                                    Run Tests
                                }
                            </button>
                        </div>

                        @if (testResults().length > 0) {
                            <div
                                class="exercise-view__results"
                                [class.exercise-view__results--success]="allTestsPassed()"
                                [class.exercise-view__results--failure]="!allTestsPassed()"
                                role="status"
                                aria-live="polite"
                            >
                                <h3 class="exercise-view__results-title">
                                    {{ allTestsPassed() ? 'All Tests Passed!' : 'Some Tests Failed' }}
                                </h3>
                                <ul class="exercise-view__results-list">
                                    @for (result of testResults(); track result.description) {
                                        <li
                                            class="exercise-view__result"
                                            [class.exercise-view__result--passed]="result.passed"
                                            [class.exercise-view__result--failed]="!result.passed"
                                        >
                                            <span class="exercise-view__result-icon">
                                                {{ result.passed ? '✓' : '✗' }}
                                            </span>
                                            <span>{{ result.description }}</span>
                                            @if (result.error) {
                                                <code class="exercise-view__result-error">
                                                    {{ result.error }}
                                                </code>
                                            }
                                        </li>
                                    }
                                </ul>
                            </div>
                        }
                    </section>
                </div>

                <nav class="exercise-view__nav" aria-label="Exercise navigation">
                    <a
                        [routerLink]="['/course', courseId(), 'module', moduleId()]"
                        class="exercise-view__nav-link"
                    >
                        ← Back to Module
                    </a>
                </nav>
            }
        </div>
    `,
    styles: `
        .exercise-view {
            max-width: 1200px;
            margin: 0 auto;
        }

        .exercise-view__error {
            text-align: center;
            padding: var(--spacing-xl);

            a {
                display: inline-block;
                margin-top: var(--spacing-md);
                color: var(--color-primary);
            }
        }

        .exercise-view__layout {
            display: grid;
            gap: var(--spacing-xl);

            @media (min-width: 1024px) {
                grid-template-columns: 1fr 1fr;
            }
        }

        .exercise-view__header {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-lg);
        }

        .exercise-view__title {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0;
        }

        .exercise-view__completed {
            font-size: 0.875rem;
            color: var(--color-success);
            font-weight: 500;
        }

        .exercise-view__hints {
            margin-top: var(--spacing-lg);
            padding: var(--spacing-md);
            background-color: var(--color-bg-secondary);
            border-radius: var(--radius-md);
        }

        .exercise-view__hints-toggle {
            color: var(--color-primary);
            font-weight: 500;
        }

        .exercise-view__hints-list {
            margin-top: var(--spacing-md);
            padding-left: var(--spacing-lg);
            color: var(--color-text-secondary);
        }

        .exercise-view__workspace {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
        }

        .exercise-view__actions {
            display: flex;
            gap: var(--spacing-sm);
        }

        .exercise-view__run-btn {
            flex: 1;
            padding: var(--spacing-md);
            background-color: var(--color-primary);
            color: white;
            font-weight: 600;
            border-radius: var(--radius-md);
            transition: background-color 0.2s;

            &:hover:not(:disabled) {
                background-color: var(--color-primary-hover);
            }

            &:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
        }

        .exercise-view__results {
            padding: var(--spacing-md);
            border-radius: var(--radius-md);

            &--success {
                background-color: var(--color-success-light);
                border: 1px solid var(--color-success);
            }

            &--failure {
                background-color: var(--color-error-light);
                border: 1px solid var(--color-error);
            }
        }

        .exercise-view__results-title {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: var(--spacing-sm);
        }

        .exercise-view__results-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .exercise-view__result {
            display: flex;
            align-items: flex-start;
            gap: var(--spacing-sm);
            padding: var(--spacing-xs) 0;

            &--passed {
                color: var(--color-success);
            }

            &--failed {
                color: var(--color-error);
            }
        }

        .exercise-view__result-icon {
            font-weight: 600;
        }

        .exercise-view__result-error {
            display: block;
            margin-top: var(--spacing-xs);
            font-size: 0.75rem;
            color: var(--color-error);
        }

        .exercise-view__nav {
            margin-top: var(--spacing-xl);
            padding-top: var(--spacing-lg);
            border-top: 1px solid var(--color-border);
        }

        .exercise-view__nav-link {
            color: var(--color-text-secondary);
            text-decoration: none;
            font-size: 0.875rem;

            &:hover {
                color: var(--color-primary);
            }
        }
    `,
})
export class ExerciseViewComponent {
    public readonly contentService = inject(ContentService);
    private readonly progressService = inject(ProgressService);
    private readonly codeExecutor = inject(CodeExecutorService);

    private readonly editor = viewChild<CodeEditorComponent>('editor');

    public readonly courseId = input.required<string>();
    public readonly moduleId = input.required<string>();
    public readonly exerciseId = input.required<string>();

    public readonly exercise = signal<Exercise | null>(null);
    public readonly isLoading = signal(true);
    public readonly error = signal<string | null>(null);
    public readonly isComplete = signal(false);
    public readonly isRunning = signal(false);
    public readonly showHints = signal(false);
    public readonly testResults = signal<TestResult[]>([]);
    public readonly currentCode = signal('');

    constructor() {
        effect(async () => {
            const courseId = this.courseId();
            const moduleId = this.moduleId();
            const exerciseId = this.exerciseId();
            if (courseId && moduleId && exerciseId) {
                await this.loadExercise(courseId, moduleId, exerciseId);
            }
        });
    }

    private async loadExercise(
        courseId: string,
        moduleId: string,
        exerciseId: string
    ): Promise<void> {
        this.isLoading.set(true);
        this.error.set(null);

        try {
            await this.contentService.loadCourse(courseId);
            await this.contentService.loadModule(courseId, moduleId);
            const exercise = await this.contentService.loadExercise(
                courseId,
                moduleId,
                exerciseId
            );
            this.exercise.set(exercise);
            this.currentCode.set(exercise.starterCode);

            const key = `${courseId}:${moduleId}:${exerciseId}`;
            this.isComplete.set(this.progressService.completedExercises().has(key));
        } catch (err) {
            this.error.set(
                err instanceof Error ? err.message : 'Failed to load exercise'
            );
        } finally {
            this.isLoading.set(false);
        }
    }

    public onCodeChange(code: string): void {
        this.currentCode.set(code);
    }

    public getEditorLanguage(): string {
        const lang = this.exercise()?.language;
        if (lang === 'javascript') return 'javascript';
        if (lang === 'python') return 'python';
        if (lang === 'swift') return 'swift';
        if (lang === 'rust') return 'rust';
        return 'javascript';
    }

    public async runTests(): Promise<void> {
        const exercise = this.exercise();
        if (!exercise) return;

        this.isRunning.set(true);
        this.testResults.set([]);

        try {
            const language = exercise.language === 'python' ? 'python' : 'javascript';
            const results = await this.codeExecutor.runTests(
                this.currentCode(),
                exercise.testCases,
                language
            );

            this.testResults.set(results);

            if (results.every((r) => r.passed)) {
                await this.progressService.markExerciseComplete(
                    this.courseId(),
                    this.moduleId(),
                    this.exerciseId()
                );
                this.isComplete.set(true);
            }
        } finally {
            this.isRunning.set(false);
        }
    }

    public allTestsPassed(): boolean {
        const results = this.testResults();
        return results.length > 0 && results.every((r) => r.passed);
    }
}
