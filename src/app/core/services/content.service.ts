import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Course, Module, Lesson, Exercise, Breadcrumb } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
    private readonly http = inject(HttpClient);
    private readonly apiBase = '/api/content';

    private readonly coursesCache = signal<Course[]>([]);
    private readonly currentCourse = signal<Course | null>(null);
    private readonly currentModule = signal<Module | null>(null);
    private readonly currentLesson = signal<Lesson | null>(null);
    private readonly currentExercise = signal<Exercise | null>(null);

    public readonly isLoading = signal(false);
    public readonly error = signal<string | null>(null);

    public readonly courses = computed(() => this.coursesCache());
    public readonly course = computed(() => this.currentCourse());
    public readonly module = computed(() => this.currentModule());
    public readonly lesson = computed(() => this.currentLesson());
    public readonly exercise = computed(() => this.currentExercise());

    public readonly breadcrumbs = computed<Breadcrumb[]>(() => {
        const crumbs: Breadcrumb[] = [];
        const course = this.currentCourse();
        const module = this.currentModule();
        const lesson = this.currentLesson();
        const exercise = this.currentExercise();

        if (course) {
            crumbs.push({
                label: course.title,
                route: `/course/${course.id}`,
            });
        }

        if (module) {
            crumbs.push({
                label: module.title,
                route: `/course/${course?.id}/module/${module.id}`,
            });
        }

        if (lesson) {
            crumbs.push({
                label: lesson.title,
                route: null,
            });
        }

        if (exercise) {
            crumbs.push({
                label: exercise.title,
                route: null,
            });
        }

        return crumbs;
    });

    public async loadCourses(): Promise<Course[]> {
        if (this.coursesCache().length > 0) {
            return this.coursesCache();
        }

        this.isLoading.set(true);
        this.error.set(null);

        try {
            const courses = await firstValueFrom(
                this.http.get<Course[]>(`${this.apiBase}/courses`)
            );
            this.coursesCache.set(courses);
            return courses;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to load courses';
            this.error.set(message);
            throw err;
        } finally {
            this.isLoading.set(false);
        }
    }

    public async loadCourse(courseId: string): Promise<Course> {
        this.isLoading.set(true);
        this.error.set(null);

        try {
            const course = await firstValueFrom(
                this.http.get<Course>(`${this.apiBase}/courses/${courseId}`)
            );
            this.currentCourse.set(course);
            return course;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to load course';
            this.error.set(message);
            throw err;
        } finally {
            this.isLoading.set(false);
        }
    }

    public async loadModule(courseId: string, moduleId: string): Promise<Module> {
        this.isLoading.set(true);
        this.error.set(null);

        try {
            const module = await firstValueFrom(
                this.http.get<Module>(
                    `${this.apiBase}/courses/${courseId}/modules/${moduleId}`
                )
            );
            this.currentModule.set(module);
            return module;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to load module';
            this.error.set(message);
            throw err;
        } finally {
            this.isLoading.set(false);
        }
    }

    public async loadLesson(
        courseId: string,
        moduleId: string,
        lessonId: string
    ): Promise<Lesson> {
        this.isLoading.set(true);
        this.error.set(null);

        try {
            const lesson = await firstValueFrom(
                this.http.get<Lesson>(
                    `${this.apiBase}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
                )
            );
            this.currentLesson.set(lesson);
            return lesson;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to load lesson';
            this.error.set(message);
            throw err;
        } finally {
            this.isLoading.set(false);
        }
    }

    public async loadExercise(
        courseId: string,
        moduleId: string,
        exerciseId: string
    ): Promise<Exercise> {
        this.isLoading.set(true);
        this.error.set(null);

        try {
            const exercise = await firstValueFrom(
                this.http.get<Exercise>(
                    `${this.apiBase}/courses/${courseId}/modules/${moduleId}/exercises/${exerciseId}`
                )
            );
            this.currentExercise.set(exercise);
            return exercise;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to load exercise';
            this.error.set(message);
            throw err;
        } finally {
            this.isLoading.set(false);
        }
    }

    public clearCurrent(): void {
        this.currentCourse.set(null);
        this.currentModule.set(null);
        this.currentLesson.set(null);
        this.currentExercise.set(null);
    }
}
