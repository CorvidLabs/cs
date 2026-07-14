---
id: CHG-0001-adopt-specsync-5-0-1-and-trust-1-0-0-governance-for-cs
state: accepted
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
