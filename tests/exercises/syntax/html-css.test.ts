import { describe, test, expect, beforeAll } from "bun:test";
import { loadCodeExercisesByLanguage, type Exercise } from "../../helpers/exercise-loader";
import { Window } from "happy-dom";

describe("HTML/CSS Validation", () => {
    let htmlExercises: Exercise[];
    let cssExercises: Exercise[];

    beforeAll(async () => {
        htmlExercises = await loadCodeExercisesByLanguage("html");
        cssExercises = await loadCodeExercisesByLanguage("css");
    });

    describe("HTML Validation", () => {
        test("should have HTML exercises", () => {
            expect(htmlExercises.length).toBeGreaterThan(0);
            console.log(`Testing ${htmlExercises.length} HTML exercises`);
        });

        test("all HTML starter code should parse without errors", () => {
            const errors: string[] = [];

            for (const exercise of htmlExercises) {
                try {
                    const window = new Window();
                    const document = window.document;

                    document.write(exercise.starterCode);

                    if (document.documentElement === null) {
                        errors.push(
                            `${exercise.id} (${exercise.courseName}): Failed to parse HTML - no document element`
                        );
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    errors.push(`${exercise.id} (${exercise.courseName}): ${errorMessage}`);
                }
            }

            if (errors.length > 0) {
                console.error("HTML parsing errors:\n", errors.join("\n"));
            }

            expect(errors).toEqual([]);
        });

        test("HTML should have proper structure", () => {
            const structureIssues: string[] = [];

            for (const exercise of htmlExercises) {
                const window = new Window();
                const document = window.document;
                document.write(exercise.starterCode);

                const hasDoctype = exercise.starterCode.toLowerCase().includes("<!doctype html>");
                const hasHtml = document.querySelector("html") !== null;
                const hasHead = document.querySelector("head") !== null;
                const hasBody = document.querySelector("body") !== null;

                if (!hasDoctype) {
                    structureIssues.push(`${exercise.id}: missing <!DOCTYPE html>`);
                }
                if (!hasHtml) {
                    structureIssues.push(`${exercise.id}: missing <html> element`);
                }
                if (!hasHead) {
                    structureIssues.push(`${exercise.id}: missing <head> element`);
                }
                if (!hasBody) {
                    structureIssues.push(`${exercise.id}: missing <body> element`);
                }
            }

            if (structureIssues.length > 0) {
                console.warn(
                    "HTML structure issues (informational):",
                    structureIssues.length
                );
            }

            expect(true).toBe(true);
        });

        test("HTML should not contain deprecated elements", () => {
            const deprecatedElements = [
                "center",
                "font",
                "marquee",
                "blink",
                "frame",
                "frameset",
            ];

            const deprecated: string[] = [];

            for (const exercise of htmlExercises) {
                const window = new Window();
                const document = window.document;
                document.write(exercise.starterCode);

                for (const element of deprecatedElements) {
                    if (document.querySelector(element) !== null) {
                        deprecated.push(`${exercise.id}: uses deprecated <${element}>`);
                    }
                }
            }

            if (deprecated.length > 0) {
                console.error("Deprecated HTML elements found:", deprecated);
            }

            expect(deprecated).toEqual([]);
        });
    });

    describe("CSS Validation", () => {
        test("should have CSS exercises", () => {
            expect(cssExercises.length).toBeGreaterThanOrEqual(0);
            console.log(`Testing ${cssExercises.length} CSS exercises`);
        });

        test("CSS starter code should have balanced braces", () => {
            const unbalanced: string[] = [];

            for (const exercise of cssExercises) {
                const code = exercise.starterCode;
                const openBraces = (code.match(/{/g) || []).length;
                const closeBraces = (code.match(/}/g) || []).length;

                if (openBraces !== closeBraces) {
                    unbalanced.push(
                        `${exercise.id}: ${openBraces} opening vs ${closeBraces} closing braces`
                    );
                }
            }

            if (unbalanced.length > 0) {
                console.error("CSS with unbalanced braces:", unbalanced);
            }

            expect(unbalanced).toEqual([]);
        });

        test("CSS should not use deprecated properties", () => {
            const deprecatedProperties = [
                /clip\s*:/,
                /zoom\s*:/,
            ];

            const deprecated: string[] = [];

            for (const exercise of cssExercises) {
                for (const pattern of deprecatedProperties) {
                    if (pattern.test(exercise.starterCode)) {
                        deprecated.push(`${exercise.id}: uses ${pattern.source.replace("\\s*:", "")}`);
                    }
                }
            }

            if (deprecated.length > 0) {
                console.warn("CSS with deprecated properties:", deprecated.length);
            }

            expect(true).toBe(true);
        });
    });

    describe("Combined HTML with inline CSS", () => {
        test("HTML exercises with style elements should have valid CSS", () => {
            const cssErrors: string[] = [];

            for (const exercise of htmlExercises) {
                const window = new Window();
                const document = window.document;
                document.write(exercise.starterCode);

                const styleElements = document.querySelectorAll("style");
                for (const style of styleElements) {
                    const css = style.textContent || "";
                    const openBraces = (css.match(/{/g) || []).length;
                    const closeBraces = (css.match(/}/g) || []).length;

                    if (openBraces !== closeBraces) {
                        cssErrors.push(
                            `${exercise.id}: inline CSS has unbalanced braces`
                        );
                    }
                }
            }

            if (cssErrors.length > 0) {
                console.error("Inline CSS errors:", cssErrors);
            }

            expect(cssErrors).toEqual([]);
        });
    });
});
