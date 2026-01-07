---
title: Exceptions Basics
order: 1
estimatedMinutes: 12
---

# Exceptions Basics

Exceptions represent error conditions that disrupt normal program flow. Kotlin uses exceptions similarly to Java but with some key differences.

## Throwing Exceptions

```kotlin
fun divide(a: Int, b: Int): Int {
    if (b == 0) {
        throw IllegalArgumentException("Cannot divide by zero")
    }
    return a / b
}
```

## Common Exceptions

| Exception | Use Case |
|-----------|----------|
| `IllegalArgumentException` | Invalid function argument |
| `IllegalStateException` | Object in wrong state |
| `NullPointerException` | Null reference |
| `IndexOutOfBoundsException` | Invalid array/list index |
| `NoSuchElementException` | Element not found |

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `throws` keyword | No throws declaration |
| `try` required at call site | No try at call site |
| `throw Error` | `throw Exception` |
| `do-catch` | `try-catch` |

Key difference: Kotlin has **unchecked exceptions** - you don't declare them.

## All Exceptions are Unchecked

Unlike Java, Kotlin doesn't distinguish between checked and unchecked:

```kotlin
// Java: must declare "throws IOException"
// Kotlin: no declaration needed
fun readFile(path: String): String {
    throw IOException("File not found")
}

// Caller doesn't need try-catch
val content = readFile("test.txt")  // May crash!
```

## Exception Hierarchy

```
Throwable
├── Error (JVM errors, don't catch)
└── Exception
    ├── RuntimeException
    │   ├── IllegalArgumentException
    │   ├── IllegalStateException
    │   └── NullPointerException
    └── IOException, etc.
```

## require and check

Kotlin provides helper functions for validation:

```kotlin
fun process(value: Int) {
    require(value > 0) { "Value must be positive: $value" }
    // Throws IllegalArgumentException if false
}

fun doWork() {
    check(isInitialized) { "Must initialize first" }
    // Throws IllegalStateException if false
}
```

## requireNotNull and checkNotNull

```kotlin
fun process(data: String?) {
    val nonNull = requireNotNull(data) { "Data cannot be null" }
    // Throws IllegalArgumentException if null
    println(nonNull.length)
}

fun checkState(config: Config?) {
    val valid = checkNotNull(config) { "Config not set" }
    // Throws IllegalStateException if null
}
```

## error Function

For unreachable code:

```kotlin
fun getStatus(code: Int): String = when (code) {
    200 -> "OK"
    404 -> "Not Found"
    500 -> "Server Error"
    else -> error("Unknown status code: $code")
}
```

## Nothing Type

Functions that never return normally:

```kotlin
fun fail(message: String): Nothing {
    throw IllegalStateException(message)
}

fun process(data: String?): String {
    return data ?: fail("Data required")
    // Compiler knows fail() never returns
}
```

## Try It Yourself

1. Create a function that throws `IllegalArgumentException`
2. Use `require` for parameter validation
3. Use `requireNotNull` with a custom message
4. Create a function returning `Nothing`

## Key Takeaways

1. Kotlin has only unchecked exceptions
2. `throw` creates and throws exceptions
3. No `throws` declaration required
4. `require()` for argument validation
5. `check()` for state validation
6. `error()` for unreachable code
7. `Nothing` type for functions that never return
