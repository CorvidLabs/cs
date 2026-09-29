---
id: CHG-0001-adopt-specsync-5-0-1-and-trust-1-0-0-governance-for-cs
state: archived
type: migration
base_commit: a6a576e5b2c0dc09d1f298059cbf2bb9751121ca
---

# Adopt SpecSync 5.0.1 and Trust 1.0.0 governance for CS

## Intent

Adopt SpecSync 5.0.1 and Trust 1.0.0 governance for CS

## Affected Canonical Specs

- None

## Acceptance Criteria

- The no-spec-change rationale remains limited to governance and CI orchestration; application, server, course, and exercise behavior remain unchanged.
- Repository-specific SDD meaningful paths cover every real product, content, test, build, workflow, policy, lifecycle, and agent-integration surface without nonexistent ecosystem entries.
- Claude, Cursor, Codex, and Gemini integrations are installed, and strict forced SpecSync validation passes at the committed advisory threshold.
- The Fledge lane blocks on each Linux-required compiler or runtime, then passes governance validation, content validation, Linux-compatible language checks, TypeScript checking, and the production Angular build.
- Trust doctor and full Trust verification pass; the preserved macOS Swift and specialized hosted jobs remain independently required.

## No-spec Rationale

This migration adds governance configuration, deterministic governance validation, and CI orchestration without changing application behavior or course content; future meaningful application, server, course, or exercise changes must add or update accurate canonical specifications.

## Migration Note

Migrated by hand to SpecSync 6 per Leif's decision (2026-09-28); the 6.0.0 tool refused to archive this legacy record (`` exact-only delivery input `.github/workflows/trust.yml` changed after acceptance and requires an audited reopen; run `specsync change reopen CHG-0001-adopt-specsync-5-0-1-and-trust-1-0-0-governance-for-cs` to re-verify the accepted change, or supersede it from a later change under a module granted the path by `owns` in `.specsync/config.toml` ``).

- Workflow v1 (SpecSync 5) record, accepted on 2026-07-14 by the closing approval already stored in `approvals.json`. SpecSync 6.0.0 reports its accepted evidence as stale, for the reason quoted above.
- Moved by hand from `.specsync/changes/CHG-0001-adopt-specsync-5-0-1-and-trust-1-0-0-governance-for-cs/` into the layout `specsync change archive` writes: `accepted-state.json` is the unchanged accepted `state.json`, `state.json` is marked `archived`, and this file's front matter says `archived`.
- `approvals.json`, `verification.json` and every other artifact are the original SpecSync 5 evidence, unchanged. `verification.json` verifies commit `c5fb3b928701c45d66794103386d4a279f102e27`, not the tree this record was archived from.
- There is no `verification-attempts.json`: SpecSync 5 did not write one for this record, and this migration does not invent attempt history.
- This migration added no verification evidence, test result, attempt history, or approval. It is a manual migration, not a fresh re-verification.
- Closing it through the tool takes `specsync change reopen`, `specsync change verify`, then `specsync change accept`, which writes a new closing approval. Per Leif's decision it was archived by hand instead, so no reopen or new approval is recorded.
