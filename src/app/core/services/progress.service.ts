import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ProgressState, CourseProgress } from '../models/progress.model';

@Injectable({ providedIn: 'root' })
export class ProgressService {
    private readonly http = inject(HttpClient);
    private readonly apiBase = '/api/progress';
    private readonly userId = this.getOrCreateUserId();

    private readonly state = signal<ProgressState>({
        completedLessons: new Set<string>(),
        completedExercises: new Set<string>(),
        currentCourseId: null,
        currentModuleId: null,
        currentLessonId: null,
    });

    public readonly completedLessons = computed(() =>
        this.state().completedLessons
    );

    public readonly completedExercises = computed(() =>
        this.state().completedExercises
    );

    public readonly completedLessonsCount = computed(
        () => this.state().completedLessons.size
    );

    public readonly completedExercisesCount = computed(
        () => this.state().completedExercises.size
    );

    constructor() {
        effect(() => {
            const currentState = this.state();
            this.persistToLocalStorage(currentState);
        });

        this.loadFromLocalStorage();
    }

    public isLessonComplete(lessonId: string): boolean {
        return this.state().completedLessons.has(lessonId);
    }

    public isExerciseComplete(exerciseId: string): boolean {
        return this.state().completedExercises.has(exerciseId);
    }

    public async markLessonComplete(
        courseId: string,
        moduleId: string,
        lessonId: string
    ): Promise<void> {
        const key = `${courseId}:${moduleId}:${lessonId}`;

        this.state.update((s) => ({
            ...s,
            completedLessons: new Set([...s.completedLessons, key]),
        }));

        try {
            await firstValueFrom(
                this.http.post(`${this.apiBase}/complete?userId=${this.userId}`, {
                    courseId,
                    moduleId,
                    lessonId,
                })
            );
        } catch (error) {
            console.error('Failed to sync lesson completion:', error);
        }
    }

    public async markExerciseComplete(
        courseId: string,
        moduleId: string,
        exerciseId: string
    ): Promise<void> {
        const key = `${courseId}:${moduleId}:${exerciseId}`;

        this.state.update((s) => ({
            ...s,
            completedExercises: new Set([...s.completedExercises, key]),
        }));

        try {
            await firstValueFrom(
                this.http.post(`${this.apiBase}/complete?userId=${this.userId}`, {
                    courseId,
                    moduleId,
                    exerciseId,
                })
            );
        } catch (error) {
            console.error('Failed to sync exercise completion:', error);
        }
    }

    public async loadCourseProgress(courseId: string): Promise<CourseProgress> {
        try {
            const progress = await firstValueFrom(
                this.http.get<{
                    courseId: string;
                    completedLessons: string[];
                    completedExercises: string[];
                }>(`${this.apiBase}/${courseId}?userId=${this.userId}`)
            );

            const lessonKeys = progress.completedLessons.map(
                (l) => `${courseId}:${l}`
            );
            const exerciseKeys = progress.completedExercises.map(
                (e) => `${courseId}:${e}`
            );

            this.state.update((s) => ({
                ...s,
                completedLessons: new Set([
                    ...s.completedLessons,
                    ...lessonKeys,
                ]),
                completedExercises: new Set([
                    ...s.completedExercises,
                    ...exerciseKeys,
                ]),
            }));

            return {
                courseId,
                completedLessons: progress.completedLessons,
                completedExercises: progress.completedExercises,
                totalLessons: 0,
                totalExercises: 0,
            };
        } catch (error) {
            console.error('Failed to load course progress:', error);
            return {
                courseId,
                completedLessons: [],
                completedExercises: [],
                totalLessons: 0,
                totalExercises: 0,
            };
        }
    }

    public setCurrentLocation(
        courseId: string | null,
        moduleId: string | null = null,
        lessonId: string | null = null
    ): void {
        this.state.update((s) => ({
            ...s,
            currentCourseId: courseId,
            currentModuleId: moduleId,
            currentLessonId: lessonId,
        }));
    }

    private getOrCreateUserId(): string {
        if (typeof window === 'undefined') {
            return 'anonymous';
        }

        let userId = localStorage.getItem('cs_user_id');
        if (!userId) {
            userId = crypto.randomUUID();
            localStorage.setItem('cs_user_id', userId);
        }
        return userId;
    }

    private persistToLocalStorage(state: ProgressState): void {
        if (typeof window === 'undefined') return;

        localStorage.setItem(
            'cs_completed_lessons',
            JSON.stringify([...state.completedLessons])
        );
        localStorage.setItem(
            'cs_completed_exercises',
            JSON.stringify([...state.completedExercises])
        );
    }

    private loadFromLocalStorage(): void {
        if (typeof window === 'undefined') return;

        try {
            const lessonsJson = localStorage.getItem('cs_completed_lessons');
            const exercisesJson = localStorage.getItem('cs_completed_exercises');

            const lessons = lessonsJson ? JSON.parse(lessonsJson) : [];
            const exercises = exercisesJson ? JSON.parse(exercisesJson) : [];

            this.state.update((s) => ({
                ...s,
                completedLessons: new Set(lessons),
                completedExercises: new Set(exercises),
            }));
        } catch {
            // Invalid JSON, start fresh
        }
    }
}
