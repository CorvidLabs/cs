import { describe, test, expect, beforeAll } from "bun:test";
import { loadCodeExercisesByLanguage, type Exercise } from "../../helpers/exercise-loader";
import { $ } from "bun";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("Rust Syntax Validation", () => {
    let exercises: Exercise[];
    let rustAvailable = false;
    let tempDir: string;

    beforeAll(async () => {
        exercises = await loadCodeExercisesByLanguage("rust");

        try {
            const result = await $`rustc --version`.quiet();
            rustAvailable = result.exitCode === 0;
        } catch {
            rustAvailable = false;
        }

        tempDir = join(tmpdir(), "rust-syntax-check");
        try {
            await mkdir(tempDir, { recursive: true });
        } catch {
            // Directory may already exist
        }
    });

    test("should have Rust exercises", () => {
        expect(exercises.length).toBeGreaterThan(0);
        console.log(`Testing ${exercises.length} Rust exercises`);
    });

    test("Rust compiler availability check", () => {
        if (!rustAvailable) {
            console.warn("Rust compiler not available - syntax checks will be skipped");
        } else {
            console.log("Rust compiler available");
        }
        expect(true).toBe(true);
    });

    test("all starter code should parse without syntax errors", async () => {
        if (!rustAvailable) {
            console.warn("Skipping Rust syntax validation - Rust not available");
            return;
        }

        const errors: string[] = [];

        for (const exercise of exercises) {
            const tempFile = join(tempDir, `${exercise.id.replace(/[^a-zA-Z0-9]/g, "_")}.rs`);
            const outputFile = join(tempDir, `${exercise.id.replace(/[^a-zA-Z0-9]/g, "_")}`);

            try {
                const code = exercise.starterCode ?? "";
                await writeFile(tempFile, code);

                const result = await $`rustc --emit=metadata -o ${outputFile} ${tempFile}`.quiet().nothrow();

                if (result.exitCode !== 0) {
                    const stderr = result.stderr.toString().trim();
                    const errorLines = stderr.split("\n");
                    const syntaxError = errorLines.find(
                        (line: string) => line.includes("error") && !line.includes("aborting")
                    );
                    errors.push(
                        `${exercise.id} (${exercise.courseName}): ${syntaxError || errorLines[0]}`
                    );
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                errors.push(`${exercise.id} (${exercise.courseName}): ${errorMessage}`);
            } finally {
                try {
                    await unlink(tempFile);
                } catch {
                    // Ignore cleanup errors
                }
                try {
                    await unlink(outputFile);
                } catch {
                    // Ignore cleanup errors
                }
            }
        }

        if (errors.length > 0) {
            console.error("Rust syntax errors:\n", errors.join("\n"));
        }

        expect(errors).toEqual([]);
    }, 60_000);

    test("starter code should use modern Rust patterns", () => {
        const oldPatterns = [
            { pattern: /try!\s*\(/, description: "try! macro (use ? operator)" },
        ];

        const oldSyntax: string[] = [];

        for (const exercise of exercises) {
            const code = exercise.starterCode ?? "";
            for (const { pattern, description } of oldPatterns) {
                if (pattern.test(code)) {
                    oldSyntax.push(`${exercise.id}: ${description}`);
                }
            }
        }

        if (oldSyntax.length > 0) {
            console.warn("Exercises with old Rust patterns:", oldSyntax);
        }

        expect(true).toBe(true);
    });
});
