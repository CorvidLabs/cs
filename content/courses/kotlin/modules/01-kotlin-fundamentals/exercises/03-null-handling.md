---
title: Null Handling
order: 3
difficulty: medium
estimatedMinutes: 20
---

# Exercise: Null Handling

Practice Kotlin's null safety features by handling optional user data.

## Requirements

1. Create nullable variables for optional user fields
2. Use safe calls (`?.`) to access properties
3. Use Elvis operator (`?:`) to provide defaults
4. Use `let` to execute code when values exist

## Scenario

You're processing user profiles where some fields may be missing:
- `username` - always present
- `email` - optional
- `nickname` - optional
- `bio` - optional

## Expected Output

```
Username: kyntrin
Email: No email provided
Display name: kyntrin
Bio length: No bio

---

Username: leif
Email: leif@example.com
Display name: 0xLeif
Bio length: 42 characters
```

## Starter Code

```kotlin
fun main() {
    // User 1: Minimal profile
    val username1 = "kyntrin"
    val email1: String? = null
    val nickname1: String? = null
    val bio1: String? = null

    // User 2: Complete profile
    val username2 = "leif"
    val email2: String? = "leif@example.com"
    val nickname2: String? = "0xLeif"
    val bio2: String? = "Swift developer building cool open source tools"

    // Print user 1 info using null safety operators

    // Print user 2 info using null safety operators
}
```

## Hints

<details>
<summary>Hint 1: Elvis for defaults</summary>

```kotlin
val displayEmail = email1 ?: "No email provided"
```
</details>

<details>
<summary>Hint 2: Choosing between values</summary>

Display name should be nickname if present, otherwise username:
```kotlin
val displayName = nickname1 ?: username1
```
</details>

<details>
<summary>Hint 3: Using let for safe operations</summary>

```kotlin
bio1?.let {
    println("Bio length: ${it.length} characters")
} ?: println("Bio length: No bio")
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
fun main() {
    // User 1: Minimal profile
    val username1 = "kyntrin"
    val email1: String? = null
    val nickname1: String? = null
    val bio1: String? = null

    println("Username: $username1")
    println("Email: ${email1 ?: "No email provided"}")
    println("Display name: ${nickname1 ?: username1}")
    bio1?.let {
        println("Bio length: ${it.length} characters")
    } ?: println("Bio length: No bio")

    println()
    println("---")
    println()

    // User 2: Complete profile
    val username2 = "leif"
    val email2: String? = "leif@example.com"
    val nickname2: String? = "0xLeif"
    val bio2: String? = "Swift developer building cool open source tools"

    println("Username: $username2")
    println("Email: ${email2 ?: "No email provided"}")
    println("Display name: ${nickname2 ?: username2}")
    bio2?.let {
        println("Bio length: ${it.length} characters")
    } ?: println("Bio length: No bio")
}
```
</details>

## Bonus Challenge

1. Create a function that takes nullable parameters and returns formatted output
2. Chain multiple safe calls (e.g., `user?.profile?.avatar?.url`)
3. Use `takeIf` to conditionally use values: `email?.takeIf { it.contains("@") }`
