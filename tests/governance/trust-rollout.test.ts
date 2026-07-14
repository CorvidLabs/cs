import { describe, expect, test } from "bun:test";

const expectedMeaningfulPaths = [
    "src/",
    "server/",
    "content/",
    "tests/",
    "README.md",
    "AGENTS.md",
    ".editorconfig",
    "proxy.conf.json",
    "package.json",
    "angular.json",
    "bun.lock",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.spec.json",
    "fledge.toml",
    ".trust.toml",
    ".augur.toml",
    ".attest.json",
    ".github/",
    ".specsync/sdd.json",
    ".specsync/config.toml",
    ".specsync/registry.toml",
    ".specsync/adoption-report.json",
    ".specsync/version",
    ".claude/",
    ".cursor/",
    ".codex/",
    ".gemini/",
];

describe("Trust rollout governance", () => {
    test("tracks exact repository surfaces and an explicit no-spec-change adoption", async () => {
        const policy = await Bun.file(".specsync/sdd.json").json();
        expect(policy.meaningful_paths).toEqual(expectedMeaningfulPaths);
        expect(policy.verification_commands).toEqual(["fledge lanes run verify"]);

        const change = await Bun.file(
            ".specsync/changes/CHG-0001-adopt-specsync-5-0-1-and-trust-1-0-0-governance-for-cs/state.json",
        ).json();
        expect(change.no_spec_change).toBe(true);
        expect(change.affected_specs).toEqual([]);
        expect(change.no_spec_change_rationale).toContain(
            "without changing application behavior or course content",
        );
    });

    test("keeps every supported agent integration installed", async () => {
        const skillPaths = [
            ".claude/skills/spec-sync/SKILL.md",
            ".cursor/skills/spec-sync/SKILL.md",
            ".codex/skills/spec-sync/SKILL.md",
            ".gemini/skills/spec-sync/SKILL.md",
        ];

        for (const skillPath of skillPaths) {
            expect(await Bun.file(skillPath).exists()).toBe(true);
        }
    });
});
