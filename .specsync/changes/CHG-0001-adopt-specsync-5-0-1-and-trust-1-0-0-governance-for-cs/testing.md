---
change: CHG-0001-adopt-specsync-5-0-1-and-trust-1-0-0-governance-for-cs
artifact: testing
---

# Testing

Run `specsync check --strict --force` at the committed advisory threshold, `specsync agents status`, `fledge trust doctor`, and `fledge lanes run verify`. The native lane must pass TypeScript checking, all 38 exercise tests, and the production Angular build. Hosted CI must continue validating its JavaScript, Python, Rust, Swift, Kotlin, and HTML/CSS jobs.
