import {
    Component,
    ChangeDetectionStrategy,
    input,
    computed,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-progress-indicator',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div
            class="progress-indicator"
            [class.progress-indicator--compact]="compact()"
            role="progressbar"
            [attr.aria-valuenow]="current()"
            [attr.aria-valuemin]="0"
            [attr.aria-valuemax]="total()"
            [attr.aria-label]="ariaLabel()"
        >
            @if (!compact()) {
                <div class="progress-indicator__label">
                    <span>{{ label() }}</span>
                    <span class="progress-indicator__count">
                        {{ current() }}/{{ total() }}
                    </span>
                </div>
            }
            <div class="progress-indicator__bar">
                <div
                    class="progress-indicator__fill"
                    [style.width.%]="percentage()"
                    [class.progress-indicator__fill--complete]="isComplete()"
                ></div>
            </div>
            @if (!compact()) {
                <div class="progress-indicator__percentage">
                    {{ percentage() | number : '1.0-0' }}%
                </div>
            }
        </div>
    `,
    styles: `
        .progress-indicator {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-xs);

            &--compact {
                flex-direction: row;
                align-items: center;
            }
        }

        .progress-indicator__label {
            display: flex;
            justify-content: space-between;
            font-size: 0.5rem;
            color: var(--color-text-secondary);
            text-transform: uppercase;
        }

        .progress-indicator__count {
            color: var(--color-text);
        }

        .progress-indicator__bar {
            height: 16px;
            background-color: var(--color-bg-tertiary);
            border: 4px solid var(--color-border);
            overflow: hidden;

            .progress-indicator--compact & {
                flex: 1;
                height: 8px;
                border-width: 2px;
            }
        }

        .progress-indicator__fill {
            height: 100%;
            background-color: var(--color-primary);
            transition: width 0.2s steps(10);

            &--complete {
                background-color: var(--color-success);
            }
        }

        .progress-indicator__percentage {
            font-size: 0.5rem;
            color: var(--color-text);
            text-align: right;
        }
    `,
    imports: [DecimalPipe],
})
export class ProgressIndicatorComponent {
    public readonly current = input.required<number>();
    public readonly total = input.required<number>();
    public readonly label = input('Progress');
    public readonly compact = input(false);

    public readonly percentage = computed(() => {
        const total = this.total();
        if (total === 0) return 0;
        return (this.current() / total) * 100;
    });

    public readonly isComplete = computed(() => this.percentage() >= 100);

    public readonly ariaLabel = computed(
        () => `${this.label()}: ${this.current()} of ${this.total()} complete`
    );
}
