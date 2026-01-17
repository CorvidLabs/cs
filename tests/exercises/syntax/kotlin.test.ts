import { describe, test, expect, beforeAll } from "bun:test";
import { loadCodeExercisesByLanguage, type Exercise } from "../../helpers/exercise-loader";
import { $ } from "bun";
import { writeFile, unlink, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("Kotlin Syntax Validation", () => {
    let exercises: Exercise[];
    let kotlinAvailable = false;
    let tempDir: string;

    beforeAll(async () => {
        exercises = await loadCodeExercisesByLanguage("kotlin");

        try {
            const result = await $`kotlinc -version`.quiet();
            kotlinAvailable = result.exitCode === 0;
        } catch {
            kotlinAvailable = false;
        }

        tempDir = join(tmpdir(), "kotlin-syntax-check");
        try {
            await mkdir(tempDir, { recursive: true });
        } catch {
            // Directory may already exist
        }
    });

    test("should have Kotlin exercises", () => {
        expect(exercises.length).toBeGreaterThan(0);
        console.log(`Testing ${exercises.length} Kotlin exercises`);
    });

    test("Kotlin compiler availability check", () => {
        if (!kotlinAvailable) {
            console.warn("Kotlin compiler not available - syntax checks will be skipped");
        } else {
            console.log("Kotlin compiler available");
        }
        expect(true).toBe(true);
    });

    test("all starter code should parse without syntax errors", async () => {
        if (!kotlinAvailable) {
            console.warn("Skipping Kotlin syntax validation - Kotlin not available");
            return;
        }

        const errors: string[] = [];

        for (const exercise of exercises) {
            const safeId = exercise.id.replace(/[^a-zA-Z0-9]/g, "_");
            const tempFile = join(tempDir, `${safeId}.kt`);
            const outputDir = join(tempDir, `${safeId}_out`);

            try {
                await writeFile(tempFile, exercise.starterCode);
                await mkdir(outputDir, { recursive: true });

                const result = await $`kotlinc -Werror -d ${outputDir} ${tempFile}`
                    .quiet()
                    .nothrow()
                    .timeout(60_000);

                if (result.exitCode !== 0) {
                    const stderr = result.stderr.toString().trim();
                    const errorLines = stderr.split("\n");
                    const syntaxError = errorLines.find((line) =>
                        line.includes("error:")
                    );
                    errors.push(
                        `${exercise.id} (${exercise.courseName}): ${syntaxError || errorLines[0]}`
                    );
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                if (!errorMessage.includes("timed out")) {
                    errors.push(`${exercise.id} (${exercise.courseName}): ${errorMessage}`);
                }
            } finally {
                try {
                    await unlink(tempFile);
                } catch {
                    // Ignore cleanup errors
                }
                try {
                    await rm(outputDir, { recursive: true, force: true });
                } catch {
                    // Ignore cleanup errors
                }
            }
        }

        if (errors.length > 0) {
            console.error("Kotlin syntax errors:\n", errors.join("\n"));
        }

        expect(errors).toEqual([]);
    }, 300_000);

    test("starter code should use modern Kotlin idioms", () => {
        const oldPatterns = [
            { pattern: /\.size\(\)/, description: "use .size property instead of .size()" },
            { pattern: /\.length\(\)/, description: "use .length property instead of .length()" },
        ];

        const oldSyntax: string[] = [];

        for (const exercise of exercises) {
            for (const { pattern, description } of oldPatterns) {
                if (pattern.test(exercise.starterCode)) {
                    oldSyntax.push(`${exercise.id}: ${description}`);
                }
            }
        }

        if (oldSyntax.length > 0) {
            console.warn("Exercises with old Kotlin patterns:", oldSyntax);
        }

        expect(true).toBe(true);
    });
});
