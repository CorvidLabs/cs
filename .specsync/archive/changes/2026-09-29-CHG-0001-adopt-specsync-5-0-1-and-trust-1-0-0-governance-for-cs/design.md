---
change: CHG-0001-adopt-specsync-5-0-1-and-trust-1-0-0-governance-for-cs
artifact: design
---

# Design

Adopt the SpecSync 5.0.1 workspace with an explicit governance-only no-spec-change rationale and all four supported agent integrations. Exact meaningful paths cover the application, server, course content, tests, documentation, build inputs, workflows, policies, lifecycle, and installed agents.

A deterministic Bun governance test prevents generic paths, missing integrations, or loss of the explicit adoption boundary. The Linux Trust lane requires Bun, Python, Rust, Java, and Kotlin before composing the existing Linux-compatible content and language checks, TypeScript check, and production build. Pull requests explicitly check out the immutable head SHA so verification evidence names an ancestor of its later evidence commit. After Trust succeeds, the workflow atomically records supported SpecSync verification and the authorized closing approval, then uploads the accepted change workspace; accepted changes skip the lifecycle rerun. The existing macOS Swift job remains independent because the Swift syntax suite intentionally skips on non-macOS hosts. Trust 1.0.0 uses blocking risk, progressive provenance, advisory contract coverage, and disabled Trust-managed Atlas publication. Existing specialized CI remains unchanged.
