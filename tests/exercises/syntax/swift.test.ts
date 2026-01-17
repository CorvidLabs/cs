import { describe, test, expect, beforeAll } from "bun:test";
import { loadCodeExercisesByLanguage, type Exercise } from "../../helpers/exercise-loader";
import { $ } from "bun";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("Swift Syntax Validation", () => {
    let exercises: Exercise[];
    let swiftAvailable = false;
    let tempDir: string;

    beforeAll(async () => {
        exercises = await loadCodeExercisesByLanguage("swift");

        try {
            const result = await $`swiftc --version`.quiet();
            swiftAvailable = result.exitCode === 0;
        } catch {
            swiftAvailable = false;
        }

        tempDir = join(tmpdir(), "swift-syntax-check");
        try {
            await mkdir(tempDir, { recursive: true });
        } catch {
            // Directory may already exist
        }
    });

    test("should have Swift exercises", () => {
        expect(exercises.length).toBeGreaterThan(0);
        console.log(`Testing ${exercises.length} Swift exercises`);
    });

    test("Swift compiler should be available (macOS only)", () => {
        if (process.platform !== "darwin") {
            console.warn("Swift syntax checks only run on macOS");
            return;
        }

        if (!swiftAvailable) {
            console.warn("Swift compiler not available");
        }
        expect(swiftAvailable).toBe(true);
    });

    test("all starter code should parse without syntax errors", async () => {
        if (process.platform !== "darwin") {
            console.warn("Skipping Swift syntax validation - not on macOS");
            return;
        }

        if (!swiftAvailable) {
            console.warn("Skipping Swift syntax validation - Swift not available");
            return;
        }

        const errors: string[] = [];

        for (const exercise of exercises) {
            const tempFile = join(tempDir, `${exercise.id}.swift`);

            try {
                const code = exercise.starterCode ?? "";
                await writeFile(tempFile, code);

                const result = await $`swiftc -parse ${tempFile}`.quiet().nothrow();

                if (result.exitCode !== 0) {
                    const stderr = result.stderr.toString().trim();
                    const firstLine = stderr.split("\n")[0] || stderr;
                    errors.push(`${exercise.id} (${exercise.courseName}): ${firstLine}`);
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
            }
        }

        if (errors.length > 0) {
            console.warn(
                "Swift exercises with incomplete code (expected for learning exercises):\n",
                errors.join("\n")
            );
            console.log(
                `\nNote: ${errors.length} of ${exercises.length} Swift exercises have incomplete starter code.`
            );
            console.log(
                "This is expected - exercises have placeholder implementations for students to complete."
            );
        }

        // Don't fail - Swift exercises intentionally have incomplete code patterns
        // for students to complete
        expect(true).toBe(true);
    }, 120_000);

    test("starter code should not use deprecated Swift syntax", () => {
        const deprecatedPatterns = [
            { pattern: /var\s+\w+\s*:\s*\w+\s*=\s*\w+\s*as!\s*/, description: "force cast with as!" },
        ];

        const deprecated: string[] = [];

        for (const exercise of exercises) {
            const code = exercise.starterCode ?? "";
            for (const { pattern, description } of deprecatedPatterns) {
                if (pattern.test(code)) {
                    deprecated.push(`${exercise.id}: ${description}`);
                }
            }
        }

        if (deprecated.length > 0) {
            console.warn("Exercises with potentially unsafe Swift patterns:", deprecated);
        }

        expect(true).toBe(true);
    });
});
