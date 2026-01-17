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

        .exercise-view__layout {
            display: grid;
            gap: var(--spacing-xl);

            @media (min-width: 1024px) {
                grid-template-columns: 1fr 1fr;
            }
        }

        .exercise-view__instructions {
            padding: var(--spacing-lg);
            background-color: var(--color-bg-secondary);
            border: 4px solid var(--color-border);
        }

        .exercise-view__header {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-lg);
            padding-bottom: var(--spacing-md);
            border-bottom: 2px solid var(--color-border);
        }

        .exercise-view__title {
            font-size: 0.65rem;
            margin: 0;
            text-transform: uppercase;
        }

        .exercise-view__completed {
            font-size: 0.45rem;
            color: var(--color-success);
            text-transform: uppercase;
            padding: var(--spacing-xs) var(--spacing-sm);
            background-color: rgba(146, 204, 65, 0.1);
            border: 2px solid var(--color-success);
        }

        .exercise-view__hints {
            margin-top: var(--spacing-lg);
            padding: var(--spacing-md);
            background-color: var(--color-bg-tertiary);
            border: 2px solid var(--color-border);
        }

        .exercise-view__hints-toggle {
            color: var(--color-warning);
            font-size: 0.5rem;
            text-transform: uppercase;
            padding: var(--spacing-xs) var(--spacing-sm);
            border: 2px solid var(--color-warning);
            background-color: transparent;

            &:hover {
                background-color: rgba(247, 213, 29, 0.1);
            }
        }

        .exercise-view__hints-list {
            margin-top: var(--spacing-md);
            padding-left: var(--spacing-lg);
            color: var(--color-text-secondary);
            font-size: 0.5rem;
            line-height: 2;

            li {
                margin-bottom: var(--spacing-sm);
            }
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
            background-color: var(--color-success);
            color: var(--color-bg);
            font-size: 0.55rem;
            text-transform: uppercase;
            border: 4px solid var(--color-border);
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
            transition: transform 0.1s, box-shadow 0.1s;

            &:hover:not(:disabled) {
                transform: translate(-2px, -2px);
                box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
            }

            &:active:not(:disabled) {
                transform: translate(2px, 2px);
                box-shadow: none;
            }

            &:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
        }

        .exercise-view__results {
            padding: var(--spacing-md);
            border: 4px solid var(--color-border);

            &--success {
                background-color: rgba(146, 204, 65, 0.1);
                border-color: var(--color-success);
            }

            &--failure {
                background-color: rgba(231, 110, 85, 0.1);
                border-color: var(--color-error);
            }
        }

        .exercise-view__results-title {
            font-size: 0.55rem;
            margin-bottom: var(--spacing-sm);
            text-transform: uppercase;
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
            font-size: 0.5rem;

            &--passed {
                color: var(--color-success);
            }

            &--failed {
                color: var(--color-error);
            }
        }

        .exercise-view__result-icon {
            font-size: 0.6rem;
        }

        .exercise-view__result-error {
            display: block;
            margin-top: var(--spacing-xs);
            font-size: 0.45rem;
            font-family: var(--font-mono);
            color: var(--color-error);
            padding: var(--spacing-xs);
            background-color: var(--color-bg-tertiary);
            border: 2px solid var(--color-border);
        }

        .exercise-view__nav {
            margin-top: var(--spacing-xl);
            padding-top: var(--spacing-lg);
            border-top: 4px solid var(--color-border);
        }

        .exercise-view__nav-link {
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
        if (lang === 'kotlin') return 'kotlin';
        return 'javascript';
    }

    public async runTests(): Promise<void> {
        const exercise = this.exercise();
        if (!exercise) return;

        this.isRunning.set(true);
        this.testResults.set([]);

        try {
            const results = await this.codeExecutor.runTests(
                this.currentCode(),
                exercise.testCases,
                exercise.language
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
