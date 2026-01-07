---
title: Basic Functions
order: 1
estimatedMinutes: 12
---

# Basic Functions

Functions are the building blocks of Kotlin programs. They group code into reusable units.

## Defining a Function

```kotlin
fun greet() {
    println("Hello, World!")
}

fun main() {
    greet()  // Call the function
}
```

## Anatomy of a Function

```kotlin
fun functionName(parameters): ReturnType {
    // body
    return value
}
```

- `fun` keyword declares a function
- Name follows camelCase convention
- Parameters in parentheses
- Return type after colon (optional for Unit)
- Body in curly braces

## Functions with Return Values

```kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}

fun main() {
    val result = add(5, 3)
    println(result)  // 8
}
```

## Unit Return Type

Functions that don't return anything return `Unit` (like `void` in other languages):

```kotlin
fun printMessage(message: String): Unit {
    println(message)
}

// Unit can be omitted
fun printMessage(message: String) {
    println(message)
}
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `func greet()` | `fun greet()` |
| `func add(a: Int, b: Int) -> Int` | `fun add(a: Int, b: Int): Int` |
| `-> Void` or omitted | `: Unit` or omitted |
| `return` required | `return` required |

## Multiple Parameters

```kotlin
fun introduce(name: String, age: Int, city: String) {
    println("I'm $name, $age years old, from $city")
}

fun main() {
    introduce("Kyntrin", 25, "Brazil")
}
```

## Calling Functions

```kotlin
// Simple call
greet()

// With arguments
val sum = add(5, 3)

// Storing result
val message = createGreeting("Kotlin")
println(message)
```

## Local Functions

Functions inside functions:

```kotlin
fun outer() {
    fun inner() {
        println("Inside inner")
    }

    inner()  // Call local function
}
```

Local functions can access variables from the outer function.

## Try It Yourself

1. Create a function that prints your name
2. Create a function that takes two numbers and returns their product
3. Create a function that takes a name and returns a greeting string
4. Create a function with a local function inside it

## Key Takeaways

1. `fun` keyword declares functions
2. Parameters: `name: Type`
3. Return type: `fun name(): ReturnType`
4. `Unit` = no meaningful return (can be omitted)
5. Functions can be nested (local functions)
