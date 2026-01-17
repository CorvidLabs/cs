import { describe, test, expect, beforeAll } from "bun:test";
import {
    loadAllExercises,
    groupExercisesByCourse,
    type Exercise,
} from "../helpers/exercise-loader";

describe("Exercise JSON Validation", () => {
    let exercises: Exercise[];

    beforeAll(async () => {
        exercises = await loadAllExercises();
    });

    test("should have loaded exercises", () => {
        expect(exercises.length).toBeGreaterThan(0);
        console.log(`Loaded ${exercises.length} exercises`);
    });

    test("all exercises should have required base fields", () => {
        const errors: string[] = [];

        for (const exercise of exercises) {
            if (!exercise.id || exercise.id.trim() === "") {
                errors.push(`${exercise.filePath}: missing or empty id`);
            }
            if (!exercise.title || exercise.title.trim() === "") {
                errors.push(`${exercise.id}: missing or empty title`);
            }
            if (!exercise.description || exercise.description.trim() === "") {
                errors.push(`${exercise.id}: missing or empty description`);
            }
            if (!exercise.language || exercise.language.trim() === "") {
                errors.push(`${exercise.id}: missing or empty language`);
            }
        }

        if (errors.length > 0) {
            console.error("Base field validation errors:\n", errors.join("\n"));
        }

        expect(errors).toEqual([]);
    });

    test("exercise IDs should be unique within each course", () => {
        const grouped = groupExercisesByCourse(exercises);
        const duplicates: string[] = [];

        for (const [course, courseExercises] of grouped) {
            const ids = new Set<string>();
            for (const exercise of courseExercises) {
                if (ids.has(exercise.id)) {
                    duplicates.push(`${course}/${exercise.id}`);
                }
                ids.add(exercise.id);
            }
        }

        if (duplicates.length > 0) {
            console.error("Duplicate exercise IDs:", duplicates);
        }

        expect(duplicates).toEqual([]);
    });

    test("exercises should have valid language values", () => {
        const validLanguages = [
            "javascript",
            "typescript",
            "python",
            "swift",
            "rust",
            "kotlin",
            "html",
            "css",
        ];

        const invalidLanguages = exercises.filter(
            (e) => !validLanguages.includes(e.language)
        );

        if (invalidLanguages.length > 0) {
            console.error(
                "Exercises with invalid languages:",
                invalidLanguages.map((e) => `${e.id}: ${e.language}`)
            );
        }

        expect(invalidLanguages).toEqual([]);
    });

    test("standard exercises should have starterCode and testCases", () => {
        const standardExercises = exercises.filter((e) => {
            return !e.type && !e.questions && !e.problems;
        });

        const invalid: string[] = [];

        for (const exercise of standardExercises) {
            if (!exercise.starterCode) {
                invalid.push(`${exercise.id}: missing starterCode`);
            }
            if (!exercise.testCases || exercise.testCases.length === 0) {
                invalid.push(`${exercise.id}: missing testCases`);
            }
        }

        if (invalid.length > 0) {
            console.error("Invalid standard exercises:", invalid);
        }

        expect(invalid).toEqual([]);
    });

    test("coding exercises should have starterCode or problems", () => {
        const codingExercises = exercises.filter((e) => e.type === "coding");

        const invalid: string[] = [];

        for (const exercise of codingExercises) {
            const hasStarterCode = exercise.starterCode && typeof exercise.starterCode === "string";
            const hasProblems = Array.isArray(exercise.problems) && exercise.problems.length > 0;

            if (!hasStarterCode && !hasProblems) {
                invalid.push(`${exercise.id}: missing both starterCode and problems`);
            }
        }

        if (invalid.length > 0) {
            console.error("Invalid coding exercises:", invalid);
        }

        expect(invalid).toEqual([]);
    });

    test("comparison exercises should have questions", () => {
        const comparisonExercises = exercises.filter((e) => e.type === "comparison");

        const invalid: string[] = [];

        for (const exercise of comparisonExercises) {
            const questions = exercise.questions;
            if (!questions || !Array.isArray(questions) || questions.length === 0) {
                invalid.push(`${exercise.id}: missing questions`);
            }
        }

        if (invalid.length > 0) {
            console.error("Invalid comparison exercises:", invalid);
        }

        expect(invalid).toEqual([]);
    });

    test("quiz/multiple-choice exercises should have questions", () => {
        const quizExercises = exercises.filter((e) => {
            const type = e.type;
            return type === "quiz" || type === "multiple-choice";
        });

        const invalid: string[] = [];

        for (const exercise of quizExercises) {
            const questions = exercise.questions;
            if (!questions || !Array.isArray(questions) || questions.length === 0) {
                invalid.push(`${exercise.id}: missing questions`);
            }
        }

        if (invalid.length > 0) {
            console.error("Invalid quiz exercises:", invalid);
        }

        expect(invalid).toEqual([]);
    });

    test("exercises with testCases should have descriptions", () => {
        const exercisesWithTestCases = exercises.filter((e) => e.testCases && e.testCases.length > 0);

        const invalid: string[] = [];

        for (const exercise of exercisesWithTestCases) {
            if (!exercise.testCases) continue;
            for (let i = 0; i < exercise.testCases.length; i++) {
                const tc = exercise.testCases[i];
                if (!tc.description || tc.description.trim() === "") {
                    invalid.push(`${exercise.id} test case ${i + 1}: missing description`);
                }
            }
        }

        if (invalid.length > 0) {
            console.error("Test cases without descriptions:", invalid);
        }

        expect(invalid).toEqual([]);
    });

    test("should count exercises by type", () => {
        const typeCount = new Map<string, number>();

        for (const exercise of exercises) {
            const type = (exercise.type as string) || "standard";
            typeCount.set(type, (typeCount.get(type) || 0) + 1);
        }

        console.log("\nExercise type distribution:");
        for (const [type, count] of typeCount.entries()) {
            console.log(`  ${type}: ${count}`);
        }

        expect(true).toBe(true);
    });

    test("should count exercises by language", () => {
        const languageCount = new Map<string, number>();

        for (const exercise of exercises) {
            const lang = exercise.language;
            languageCount.set(lang, (languageCount.get(lang) || 0) + 1);
        }

        console.log("\nExercise language distribution:");
        for (const [lang, count] of languageCount.entries()) {
            console.log(`  ${lang}: ${count}`);
        }

        expect(true).toBe(true);
    });
});
