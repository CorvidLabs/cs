---
change: CHG-0001-adopt-specsync-5-0-1-and-trust-1-0-0-governance-for-cs
artifact: testing
---

# Testing

Run `specsync check --strict --force` at the committed advisory threshold, `specsync agents status`, `fledge trust doctor`, and `fledge lanes run verify`. The Trust lane first validates the exact SDD/no-spec adoption boundary and all four agents, requires Bun, Python, Rust, Java, and Kotlin, then reproduces content validation, JavaScript, Python, Rust, Kotlin, and HTML/CSS checks, TypeScript checking, and the production Angular build. It must not edit application source or course content.

Lifecycle approvals and verification use supported SpecSync commands only. After the Trust lane passes, the hosted workflow atomically records native verification and the authorized closing approval, then uploads the accepted change workspace for review. Hosted acceptance also requires the exact-head Trust job plus the existing independently named validation, Python, Rust, macOS Swift, Kotlin, HTML/CSS, build, aggregate, and CodeQL jobs on their normal runners.
