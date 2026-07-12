---
change: CHG-0001-adopt-specsync-5-0-1-and-trust-1-0-0-governance-for-cs
artifact: research
---

# Research

The native suite currently passes its exercise-validation matrix, TypeScript checking, and a production Angular build. Specialized language jobs require distinct hosted toolchains and remain independent. Kotlin compilation needs the existing CI pin and extended test timeout, which the unified lane reproduces. Prettier reports broad pre-existing formatting drift and is not an existing blocking check, so this migration does not introduce an unrelated repository-wide rewrite.
