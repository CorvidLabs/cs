import { Routes } from '@angular/router';

export const courseRoutes: Routes = [
    {
        path: ':courseId',
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/course-overview/course-overview.component').then(
                        (c) => c.CourseOverviewComponent
                    ),
            },
            {
                path: 'module/:moduleId',
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./pages/module-view/module-view.component').then(
                                (c) => c.ModuleViewComponent
                            ),
                    },
                    {
                        path: 'lesson/:lessonId',
                        loadComponent: () =>
                            import('./pages/lesson-view/lesson-view.component').then(
                                (c) => c.LessonViewComponent
                            ),
                    },
                    {
                        path: 'exercise/:exerciseId',
                        loadComponent: () =>
                            import('./pages/exercise-view/exercise-view.component').then(
                                (c) => c.ExerciseViewComponent
                            ),
                    },
                ],
            },
        ],
    },
];
