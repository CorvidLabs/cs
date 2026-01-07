---
title: File Processing
order: 2
difficulty: medium
estimatedMinutes: 20
---

# Exercise: File Processing with Error Handling

Process files safely using try-catch and Result.

## Requirements

1. Parse a CSV-like string of user data
2. Handle parsing errors gracefully
3. Use Result type for individual row parsing
4. Collect successful parses and log failures

## Starter Code

```kotlin
data class User(val id: Int, val name: String, val email: String)

val csvData = """
    1,Alice,alice@example.com
    2,Bob,bob@example.com
    invalid,Charlie,charlie@example.com
    4,,missing-name@example.com
    5,Eve,eve@example.com
""".trimIndent()

fun parseRow(row: String): Result<User> {
    // Your implementation
}

fun parseAllUsers(csv: String): Pair<List<User>, List<String>> {
    // Returns (successful users, error messages)
}

fun main() {
    val (users, errors) = parseAllUsers(csvData)

    println("Successfully parsed ${users.size} users:")
    users.forEach { println("  $it") }

    println("\nErrors (${errors.size}):")
    errors.forEach { println("  $it") }
}
```

## Expected Output

```
Successfully parsed 3 users:
  User(id=1, name=Alice, email=alice@example.com)
  User(id=2, name=Bob, email=bob@example.com)
  User(id=5, name=Eve, email=eve@example.com)

Errors (2):
  Row 3: Invalid ID format 'invalid'
  Row 4: Name cannot be empty
```

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
data class User(val id: Int, val name: String, val email: String)

val csvData = """
    1,Alice,alice@example.com
    2,Bob,bob@example.com
    invalid,Charlie,charlie@example.com
    4,,missing-name@example.com
    5,Eve,eve@example.com
""".trimIndent()

fun parseRow(row: String): Result<User> = runCatching {
    val parts = row.split(",")
    require(parts.size == 3) { "Expected 3 columns, got ${parts.size}" }

    val id = parts[0].trim().toIntOrNull()
        ?: throw IllegalArgumentException("Invalid ID format '${parts[0].trim()}'")

    val name = parts[1].trim()
    require(name.isNotEmpty()) { "Name cannot be empty" }

    val email = parts[2].trim()
    require(email.contains("@")) { "Invalid email format" }

    User(id, name, email)
}

fun parseAllUsers(csv: String): Pair<List<User>, List<String>> {
    val users = mutableListOf<User>()
    val errors = mutableListOf<String>()

    csv.lines().forEachIndexed { index, line ->
        if (line.isBlank()) return@forEachIndexed

        parseRow(line).fold(
            onSuccess = { users.add(it) },
            onFailure = { errors.add("Row ${index + 1}: ${it.message}") }
        )
    }

    return Pair(users, errors)
}

fun main() {
    val (users, errors) = parseAllUsers(csvData)

    println("Successfully parsed ${users.size} users:")
    users.forEach { println("  $it") }

    println("\nErrors (${errors.size}):")
    errors.forEach { println("  $it") }
}
```
</details>
