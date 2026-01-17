---
title: Default and Named Arguments
order: 3
estimatedMinutes: 12
---

# Default and Named Arguments

Kotlin's default and named arguments reduce the need for function overloading and make calls more readable.

## Default Arguments

Provide default values for parameters:

```kotlin
fun greet(name: String = "World") {
    println("Hello, $name!")
}

fun main() {
    greet()           // Hello, World!
    greet("Kotlin")   // Hello, Kotlin!
}
```

## Multiple Defaults

```kotlin
fun createUser(
    name: String,
    age: Int = 0,
    email: String = "",
    isActive: Boolean = true
) {
    println("User: $name, $age, $email, active=$isActive")
}

fun main() {
    createUser("Alice")
    createUser("Bob", 25)
    createUser("Charlie", 30, "charlie@example.com")
}
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `func greet(name: String = "World")` | `fun greet(name: String = "World")` |
| Same concept | Same concept |

## Named Arguments

Specify which parameter you're setting:

```kotlin
fun createUser(
    name: String,
    age: Int = 0,
    email: String = "",
    isActive: Boolean = true
) { }

fun main() {
    // Skip middle defaults using named arguments
    createUser("Alice", isActive = false)

    // Any order with named arguments
    createUser(
        isActive = true,
        name = "Bob",
        email = "bob@example.com"
    )
}
```

## Mixing Positional and Named

```kotlin
fun format(
    value: Int,
    prefix: String = "",
    suffix: String = "",
    padLength: Int = 0
) {
    val padded = value.toString().padStart(padLength, '0')
    println("$prefix$padded$suffix")
}

fun main() {
    format(42, suffix = "!")        // 42!
    format(7, padLength = 3)        // 007
    format(100, "Value: ", " USD")  // Value: 100 USD
}
```

## Trailing Lambda Syntax

When the last parameter is a lambda, it can go outside parentheses:

```kotlin
fun doSomething(name: String, action: () -> Unit) {
    println("Starting $name")
    action()
}

fun main() {
    // Normal call
    doSomething("task", { println("Done!") })

    // Trailing lambda - more readable
    doSomething("task") {
        println("Done!")
    }
}
```

## Builder Pattern Alternative

Default arguments often replace the need for builders:

```kotlin
// Instead of a builder pattern
data class HttpRequest(
    val url: String,
    val method: String = "GET",
    val headers: Map<String, String> = emptyMap(),
    val body: String? = null,
    val timeout: Int = 30000
)

fun main() {
    val request = HttpRequest(
        url = "https://api.example.com",
        method = "POST",
        body = """{"key": "value"}"""
    )
}
```

## Overloading vs Defaults

Prefer defaults over overloading:

```kotlin
// Avoid this (Java style)
fun greet() = greet("World")
fun greet(name: String) = println("Hello, $name!")

// Prefer this (Kotlin style)
fun greet(name: String = "World") {
    println("Hello, $name!")
}
```

## Java Interop: @JvmOverloads

Generate Java-compatible overloads:

```kotlin
@JvmOverloads
fun greet(name: String = "World", times: Int = 1) {
    repeat(times) { println("Hello, $name!") }
}

// Java sees:
// greet()
// greet(String name)
// greet(String name, int times)
```

## Try It Yourself

1. Create a function with 3 parameters, 2 with defaults
2. Call it using only named arguments in reverse order
3. Create a function with a trailing lambda parameter
4. Use named arguments to skip middle parameters

## Key Takeaways

1. Default values: `param: Type = defaultValue`
2. Named arguments: `functionCall(paramName = value)`
3. Named arguments allow skipping defaults
4. Named arguments allow any order
5. Trailing lambdas go outside parentheses
6. Prefer defaults over function overloading
7. Use `@JvmOverloads` for Java interoperability
