import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./layout/shell/shell.component').then(
                (c) => c.ShellComponent
            ),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./features/home/pages/home-page/home-page.component').then(
                        (c) => c.HomePageComponent
                    ),
                title: 'CS Courses - CorvidLabs',
            },
            {
                path: 'course',
                loadChildren: () =>
                    import('./features/course/course.routes').then(
                        (m) => m.courseRoutes
                    ),
            },
            {
                path: 'profile',
                loadChildren: () =>
                    import('./features/profile/profile.routes').then(
                        (m) => m.profileRoutes
                    ),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    },
];
