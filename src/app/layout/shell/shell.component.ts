import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';

@Component({
    selector: 'app-shell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterOutlet,
        HeaderComponent,
        SidebarComponent,
        FooterComponent,
        MobileNavComponent,
    ],
    template: `
        <div class="shell">
            <app-header
                [isMobileNavOpen]="mobileNavOpen()"
                (toggleMobileNav)="toggleMobileNav()"
            />

            <div class="shell__body">
                <app-sidebar class="shell__sidebar" />

                <main id="main-content" class="shell__main">
                    <router-outlet />
                </main>
            </div>

            <app-footer />

            <app-mobile-nav
                [isOpen]="mobileNavOpen()"
                (close)="closeMobileNav()"
            />
        </div>
    `,
    styles: `
        .shell {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .shell__body {
            display: flex;
            flex: 1;
            margin-top: var(--header-height);
        }

        .shell__sidebar {
            display: none;

            @media (min-width: 1024px) {
                display: block;
                position: fixed;
                top: var(--header-height);
                left: 0;
                bottom: 0;
                width: var(--sidebar-width);
                overflow-y: auto;
            }
        }

        .shell__main {
            flex: 1;
            padding: var(--spacing-lg);
            max-width: 100%;

            @media (min-width: 1024px) {
                margin-left: var(--sidebar-width);
                padding: var(--spacing-xl);
            }
        }
    `,
})
export class ShellComponent {
    public readonly mobileNavOpen = signal(false);

    public toggleMobileNav(): void {
        this.mobileNavOpen.update((v) => !v);
    }

    public closeMobileNav(): void {
        this.mobileNavOpen.set(false);
    }
}
