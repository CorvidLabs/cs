import { describe, test, expect, beforeAll } from "bun:test";
import { loadCodeExercisesByLanguage, type Exercise } from "../../helpers/exercise-loader";
import { $ } from "bun";

describe("Python Syntax Validation", () => {
    let exercises: Exercise[];
    let pythonAvailable = false;

    beforeAll(async () => {
        exercises = await loadCodeExercisesByLanguage("python");

        try {
            const result = await $`python3 --version`.quiet();
            pythonAvailable = result.exitCode === 0;
        } catch {
            pythonAvailable = false;
        }
    });

    test("should have Python exercises", () => {
        expect(exercises.length).toBeGreaterThan(0);
        console.log(`Testing ${exercises.length} Python exercises`);
    });

    test("Python should be available", () => {
        if (!pythonAvailable) {
            console.warn("Python 3 not available, skipping syntax checks");
        }
        expect(pythonAvailable).toBe(true);
    });

    test("all starter code should parse without syntax errors", async () => {
        if (!pythonAvailable) {
            console.warn("Skipping Python syntax validation - Python not available");
            return;
        }

        const errors: string[] = [];
        const warnings: string[] = [];

        for (const exercise of exercises) {
            try {
                let code = exercise.starterCode ?? "";

                const incompleteAssignments = code.match(/^(\w+\s*=\s*)$/gm);
                if (incompleteAssignments && incompleteAssignments.length > 0) {
                    warnings.push(`${exercise.id}: has ${incompleteAssignments.length} incomplete assignment(s)`);
                    code = code.replace(/^(\w+\s*=)\s*$/gm, "$1 None");
                }

                const result = await $`python3 -c ${`import ast; ast.parse(${JSON.stringify(code)})`}`.quiet().nothrow();

                if (result.exitCode !== 0) {
                    const stderr = result.stderr.toString().trim();
                    const lastLine = stderr.split("\n").pop() || stderr;
                    errors.push(`${exercise.id} (${exercise.courseName}): ${lastLine}`);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                errors.push(`${exercise.id} (${exercise.courseName}): ${errorMessage}`);
            }
        }

        if (warnings.length > 0) {
            console.log(`\nIncomplete assignments found (filled with None for syntax check):`);
            for (const w of warnings.slice(0, 10)) {
                console.log(`  - ${w}`);
            }
            if (warnings.length > 10) {
                console.log(`  ... and ${warnings.length - 10} more`);
            }
        }

        if (errors.length > 0) {
            console.error("\nPython syntax errors:\n", errors.join("\n"));
        }

        expect(errors).toEqual([]);
    });

    test("starter code should not use deprecated Python 2 syntax", () => {
        const python2Patterns = [
            { pattern: /print\s+[^(]/, description: "print statement without parentheses" },
            { pattern: /raw_input\s*\(/, description: "raw_input() (use input())" },
            { pattern: /xrange\s*\(/, description: "xrange() (use range())" },
        ];

        const deprecated: string[] = [];

        for (const exercise of exercises) {
            const code = exercise.starterCode ?? "";
            for (const { pattern, description } of python2Patterns) {
                if (pattern.test(code)) {
                    deprecated.push(`${exercise.id}: ${description}`);
                }
            }
        }

        if (deprecated.length > 0) {
            console.error("Exercises with Python 2 syntax:", deprecated);
        }

        expect(deprecated).toEqual([]);
    });
});
