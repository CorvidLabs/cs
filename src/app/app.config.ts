import {
    ApplicationConfig,
    provideZoneChangeDetection,
    APP_INITIALIZER,
    inject,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { SyntaxHighlighterService } from './core/services/syntax-highlighter.service';

function initializeSyntaxHighlighter(): () => Promise<void> {
    const highlighter = inject(SyntaxHighlighterService);
    return () => highlighter.initialize();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withFetch()),
        {
            provide: APP_INITIALIZER,
            useFactory: initializeSyntaxHighlighter,
            multi: true,
        },
    ],
};
