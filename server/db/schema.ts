import { Database } from 'bun:sqlite';

export function initializeDatabase(): Database {
    const db = new Database('cs.sqlite', { create: true });

    db.run(`
        CREATE TABLE IF NOT EXISTS user_progress (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            course_id TEXT NOT NULL,
            module_id TEXT,
            lesson_id TEXT,
            exercise_id TEXT,
            completed INTEGER NOT NULL DEFAULT 0,
            completed_at TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, course_id, lesson_id),
            UNIQUE(user_id, course_id, exercise_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS exercise_submissions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            course_id TEXT NOT NULL,
            exercise_id TEXT NOT NULL,
            code TEXT NOT NULL,
            passed INTEGER NOT NULL DEFAULT 0,
            test_results TEXT,
            submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_progress_user
        ON user_progress(user_id)
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_progress_course
        ON user_progress(user_id, course_id)
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_submissions_user
        ON exercise_submissions(user_id, course_id)
    `);

    return db;
}

export interface UserProgress {
    id: string;
    user_id: string;
    course_id: string;
    module_id: string | null;
    lesson_id: string | null;
    exercise_id: string | null;
    completed: number;
    completed_at: string | null;
    created_at: string;
}

export interface ExerciseSubmission {
    id: string;
    user_id: string;
    course_id: string;
    exercise_id: string;
    code: string;
    passed: number;
    test_results: string | null;
    submitted_at: string;
}
