import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div
            class="loading-spinner"
            [class.loading-spinner--small]="size() === 'small'"
            [class.loading-spinner--large]="size() === 'large'"
            role="status"
            [attr.aria-label]="label()"
        >
            <div class="loading-spinner__circle"></div>
            @if (showLabel()) {
                <span class="loading-spinner__text">{{ label() }}</span>
            }
        </div>
    `,
    styles: `
        .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-md);
            padding: var(--spacing-xl);
        }

        .loading-spinner__circle {
            width: 32px;
            height: 32px;
            border: 4px solid var(--color-bg-tertiary);
            border-top-color: var(--color-success);
            border-right-color: var(--color-success);
            animation: spin 0.6s steps(8) infinite;

            .loading-spinner--small & {
                width: 20px;
                height: 20px;
            }

            .loading-spinner--large & {
                width: 48px;
                height: 48px;
            }
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .loading-spinner__text {
            color: var(--color-text-secondary);
            font-size: 0.5rem;
            text-transform: uppercase;
            animation: blink 1s steps(2) infinite;
        }

        @keyframes blink {
            50% {
                opacity: 0.5;
            }
        }
    `,
})
export class LoadingSpinnerComponent {
    public readonly size = input<'small' | 'medium' | 'large'>('medium');
    public readonly label = input('Loading...');
    public readonly showLabel = input(true);
}
