import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/profile-page/profile-page.component').then(
                (c) => c.ProfilePageComponent
            ),
        title: 'My Progress - CS Courses',
    },
];
