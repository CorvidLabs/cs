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
            width: 40px;
            height: 40px;
            border: 3px solid var(--color-bg-tertiary);
            border-top-color: var(--color-primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;

            .loading-spinner--small & {
                width: 24px;
                height: 24px;
                border-width: 2px;
            }

            .loading-spinner--large & {
                width: 56px;
                height: 56px;
                border-width: 4px;
            }
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .loading-spinner__text {
            color: var(--color-text-secondary);
            font-size: 0.875rem;
        }
    `,
})
export class LoadingSpinnerComponent {
    public readonly size = input<'small' | 'medium' | 'large'>('medium');
    public readonly label = input('Loading...');
    public readonly showLabel = input(true);
}
