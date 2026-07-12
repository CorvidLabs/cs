---
change: CHG-0001-adopt-specsync-5-0-1-and-trust-1-0-0-governance-for-cs
artifact: design
---

# Design

Adopt the SpecSync 5.0.1 change workspace with an explicit no-spec-change rationale and install all four supported agent integrations. Add a Fledge lane that composes the existing type check, full Bun test suite, and production build. Trust 1.0.0 runs that lane with blocking risk, progressive provenance, advisory contract coverage, and Atlas disabled. Existing specialized CI remains unchanged.
