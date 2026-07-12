---
change: CHG-0001-adopt-specsync-5-0-1-and-trust-1-0-0-governance-for-cs
artifact: testing
---

# Testing

Run `specsync check --strict --force` at the committed advisory threshold, `specsync agents status`, `fledge trust doctor`, and `fledge lanes run verify`. The native lane must reproduce the JavaScript, Python, Rust, Swift, Kotlin, HTML/CSS, and content validation commands, then pass TypeScript checking and the production Angular build. Hosted CI must retain its independently named language jobs.
