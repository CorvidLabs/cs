import { Glob } from "bun";
import { readFile } from "node:fs/promises";
import { join, basename, dirname } from "node:path";

export interface TestCase {
    description: string;
    assertion?: string;
    expectedOutput?: string;
}

export type ExerciseType = "code" | "comparison" | "quiz";

export interface Exercise {
    id: string;
    title: string;
    description: string;
    order?: number;
    language: string;
    type?: ExerciseType;
    starterCode?: string;
    testCases?: TestCase[];
    hints?: string[];
    questions?: unknown[];
    filePath?: string;
    courseName?: string;
    moduleName?: string;
}

export type Language =
    | "javascript"
    | "typescript"
    | "python"
    | "swift"
    | "rust"
    | "kotlin"
    | "html"
    | "css";

const CONTENT_DIR = join(import.meta.dir, "../../content/courses");

export async function loadAllExercises(): Promise<Exercise[]> {
    const glob = new Glob("**/exercises/*.json");
    const exercises: Exercise[] = [];

    for await (const path of glob.scan(CONTENT_DIR)) {
        const fullPath = join(CONTENT_DIR, path);
        const content = await readFile(fullPath, "utf-8");
        const exercise: Exercise = JSON.parse(content);

        const pathParts = path.split("/");
        exercise.filePath = fullPath;
        exercise.courseName = pathParts[0];
        exercise.moduleName = pathParts[2];

        exercises.push(exercise);
    }

    return exercises;
}

export async function loadExercisesByLanguage(
    language: Language | Language[]
): Promise<Exercise[]> {
    const exercises = await loadAllExercises();
    const languages = Array.isArray(language) ? language : [language];
    return exercises.filter((e) => languages.includes(e.language as Language));
}

export async function loadExercisesByCourse(
    courseName: string
): Promise<Exercise[]> {
    const exercises = await loadAllExercises();
    return exercises.filter((e) => e.courseName === courseName);
}

export function groupExercisesByLanguage(
    exercises: Exercise[]
): Map<string, Exercise[]> {
    const grouped = new Map<string, Exercise[]>();

    for (const exercise of exercises) {
        const lang = exercise.language;
        if (!grouped.has(lang)) {
            grouped.set(lang, []);
        }
        grouped.get(lang)!.push(exercise);
    }

    return grouped;
}

export function groupExercisesByCourse(
    exercises: Exercise[]
): Map<string, Exercise[]> {
    const grouped = new Map<string, Exercise[]>();

    for (const exercise of exercises) {
        const course = exercise.courseName ?? "unknown";
        if (!grouped.has(course)) {
            grouped.set(course, []);
        }
        grouped.get(course)!.push(exercise);
    }

    return grouped;
}

export function isCodeExercise(exercise: Exercise): boolean {
    return !exercise.type && !!exercise.starterCode;
}

export async function loadCodeExercisesByLanguage(
    language: Language | Language[]
): Promise<Exercise[]> {
    const exercises = await loadExercisesByLanguage(language);
    return exercises.filter(isCodeExercise);
}
