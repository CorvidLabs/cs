export interface ProgressState {
    completedLessons: Set<string>;
    completedExercises: Set<string>;
    currentCourseId: string | null;
    currentModuleId: string | null;
    currentLessonId: string | null;
}

export interface CourseProgress {
    courseId: string;
    completedLessons: string[];
    completedExercises: string[];
    totalLessons: number;
    totalExercises: number;
}

export interface ExecutionState {
    status: 'idle' | 'running' | 'complete' | 'error';
    output: string;
    error: string | null;
}

export interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
}

export interface TestResult {
    description: string;
    passed: boolean;
    error?: string;
}
