import { Database } from 'bun:sqlite';
import type { UserProgress } from '../db/schema';

type Headers = Record<string, string>;

export async function progressRoutes(
    req: Request,
    url: URL,
    db: Database,
    corsHeaders: Headers
): Promise<Response> {
    const path = url.pathname.replace('/api/progress', '');
    const userId = url.searchParams.get('userId') ?? 'anonymous';

    if (req.method === 'GET') {
        if (path === '' || path === '/') {
            return getUserProgress(db, userId, corsHeaders);
        }

        const courseMatch = path.match(/^\/([^/]+)$/);
        if (courseMatch) {
            return getCourseProgress(db, userId, courseMatch[1], corsHeaders);
        }
    }

    if (req.method === 'POST') {
        const completionMatch = path.match(/^\/complete$/);
        if (completionMatch) {
            return markComplete(db, req, userId, corsHeaders);
        }

        const submissionMatch = path.match(/^\/submit$/);
        if (submissionMatch) {
            return submitExercise(db, req, userId, corsHeaders);
        }
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

function getUserProgress(
    db: Database,
    userId: string,
    headers: Headers
): Response {
    const stmt = db.prepare(`
        SELECT course_id,
               COUNT(CASE WHEN lesson_id IS NOT NULL AND completed = 1 THEN 1 END) as completed_lessons,
               COUNT(CASE WHEN exercise_id IS NOT NULL AND completed = 1 THEN 1 END) as completed_exercises
        FROM user_progress
        WHERE user_id = ?
        GROUP BY course_id
    `);

    const progress = stmt.all(userId);

    return new Response(JSON.stringify(progress), {
        headers: { ...headers, 'Content-Type': 'application/json' },
    });
}

function getCourseProgress(
    db: Database,
    userId: string,
    courseId: string,
    headers: Headers
): Response {
    const stmt = db.prepare(`
        SELECT * FROM user_progress
        WHERE user_id = ? AND course_id = ? AND completed = 1
    `);

    const progress = stmt.all(userId, courseId) as UserProgress[];

    const completedLessons = progress
        .filter((p) => p.lesson_id)
        .map((p) => p.lesson_id);

    const completedExercises = progress
        .filter((p) => p.exercise_id)
        .map((p) => p.exercise_id);

    return new Response(
        JSON.stringify({
            courseId,
            completedLessons,
            completedExercises,
        }),
        {
            headers: { ...headers, 'Content-Type': 'application/json' },
        }
    );
}

async function markComplete(
    db: Database,
    req: Request,
    userId: string,
    headers: Headers
): Promise<Response> {
    const body = await req.json();
    const { courseId, moduleId, lessonId, exerciseId } = body as {
        courseId: string;
        moduleId?: string;
        lessonId?: string;
        exerciseId?: string;
    };

    if (!courseId || (!lessonId && !exerciseId)) {
        return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            {
                status: 400,
                headers: { ...headers, 'Content-Type': 'application/json' },
            }
        );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
        INSERT OR REPLACE INTO user_progress
        (id, user_id, course_id, module_id, lesson_id, exercise_id, completed, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    `);

    stmt.run(id, userId, courseId, moduleId ?? null, lessonId ?? null, exerciseId ?? null, now);

    return new Response(JSON.stringify({ success: true, id }), {
        headers: { ...headers, 'Content-Type': 'application/json' },
    });
}

async function submitExercise(
    db: Database,
    req: Request,
    userId: string,
    headers: Headers
): Promise<Response> {
    const body = await req.json();
    const { courseId, exerciseId, code, passed, testResults } = body as {
        courseId: string;
        exerciseId: string;
        code: string;
        passed: boolean;
        testResults?: string;
    };

    if (!courseId || !exerciseId || !code) {
        return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            {
                status: 400,
                headers: { ...headers, 'Content-Type': 'application/json' },
            }
        );
    }

    const id = crypto.randomUUID();

    const stmt = db.prepare(`
        INSERT INTO exercise_submissions
        (id, user_id, course_id, exercise_id, code, passed, test_results)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        id,
        userId,
        courseId,
        exerciseId,
        code,
        passed ? 1 : 0,
        testResults ?? null
    );

    if (passed) {
        const progressId = crypto.randomUUID();
        const now = new Date().toISOString();

        const progressStmt = db.prepare(`
            INSERT OR REPLACE INTO user_progress
            (id, user_id, course_id, exercise_id, completed, completed_at)
            VALUES (?, ?, ?, ?, 1, ?)
        `);

        progressStmt.run(progressId, userId, courseId, exerciseId, now);
    }

    return new Response(JSON.stringify({ success: true, id }), {
        headers: { ...headers, 'Content-Type': 'application/json' },
    });
}
