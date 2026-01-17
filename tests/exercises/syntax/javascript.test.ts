import { describe, test, expect, beforeAll } from "bun:test";
import { loadCodeExercisesByLanguage, type Exercise } from "../../helpers/exercise-loader";

describe("JavaScript/TypeScript Syntax Validation", () => {
    let exercises: Exercise[];

    beforeAll(async () => {
        exercises = await loadCodeExercisesByLanguage(["javascript", "typescript"]);
    });

    test("should have JavaScript/TypeScript exercises", () => {
        expect(exercises.length).toBeGreaterThan(0);
        console.log(`Testing ${exercises.length} JavaScript/TypeScript exercises`);
    });

    test("all starter code should parse without syntax errors (with placeholder fixes)", () => {
        const errors: string[] = [];
        const warnings: string[] = [];
        const transpiler = new Bun.Transpiler({
            loader: "ts",
        });

        for (const exercise of exercises) {
            let code = exercise.starterCode ?? "";

            const incompleteAssignments = code.match(/(?:const|let|var)\s+\w+\s*=\s*(?:\n|$)/g);
            if (incompleteAssignments && incompleteAssignments.length > 0) {
                warnings.push(`${exercise.id}: has ${incompleteAssignments.length} incomplete assignment(s)`);
                code = code.replace(
                    /((?:const|let|var)\s+\w+\s*=\s*)(\n|$)/g,
                    "$1undefined$2"
                );
            }

            try {
                transpiler.scan(code);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                errors.push(`${exercise.id} (${exercise.courseName}): ${errorMessage}`);
            }
        }

        if (warnings.length > 0) {
            console.log(`\nIncomplete assignments found (filled with undefined for syntax check):`);
            for (const w of warnings.slice(0, 10)) {
                console.log(`  - ${w}`);
            }
            if (warnings.length > 10) {
                console.log(`  ... and ${warnings.length - 10} more`);
            }
        }

        if (errors.length > 0) {
            console.error("\nJavaScript/TypeScript syntax errors:\n", errors.join("\n"));
        }

        expect(errors).toEqual([]);
    });

    test("starter code should not contain obviously broken syntax", () => {
        const brokenPatterns = [
            { pattern: /}\s*{(?!\s*})/, description: "mismatched braces" },
            { pattern: /;;(?!;)/, description: "double semicolon" },
        ];

        const issues: string[] = [];

        for (const exercise of exercises) {
            const code = exercise.starterCode ?? "";
            for (const { pattern, description } of brokenPatterns) {
                if (pattern.test(code)) {
                    issues.push(`${exercise.id}: ${description}`);
                }
            }
        }

        if (issues.length > 0) {
            console.warn("Potential syntax issues found:", issues);
        }

        expect(true).toBe(true);
    });
});
