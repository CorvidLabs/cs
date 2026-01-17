---
title: Single-Expression Functions
order: 4
estimatedMinutes: 10
---

# Single-Expression Functions

When a function body is a single expression, Kotlin offers a concise syntax.

## Basic Syntax

Instead of braces and return:

```kotlin
// Traditional
fun double(x: Int): Int {
    return x * 2
}

// Single-expression
fun double(x: Int): Int = x * 2

// With type inference
fun double(x: Int) = x * 2
```

## Why Use Them?

- More concise
- Less boilerplate
- Return type can be inferred
- Clearly shows the function's purpose

## Common Use Cases

### Simple Calculations

```kotlin
fun add(a: Int, b: Int) = a + b
fun multiply(a: Int, b: Int) = a * b
fun isEven(n: Int) = n % 2 == 0
```

### String Operations

```kotlin
fun greet(name: String) = "Hello, $name!"
fun shout(message: String) = message.uppercase()
fun initials(name: String) = name.split(" ").map { it.first() }.joinToString("")
```

### Delegation

```kotlin
class UserService(private val repository: UserRepository) {
    fun findById(id: Int) = repository.findById(id)
    fun findAll() = repository.findAll()
    fun save(user: User) = repository.save(user)
}
```

## Comparing to Swift

Swift doesn't have this shorthand - you always need braces:

```swift
// Swift
func double(_ x: Int) -> Int { x * 2 }  // Implicit return

// Kotlin
fun double(x: Int) = x * 2  // Expression syntax
```

## When Expressions in Single-Expression Functions

```kotlin
fun describe(n: Int) = when {
    n < 0 -> "negative"
    n == 0 -> "zero"
    else -> "positive"
}

fun dayType(day: Int) = when (day) {
    1, 2, 3, 4, 5 -> "weekday"
    else -> "weekend"
}
```

## If Expressions

```kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
fun abs(n: Int) = if (n < 0) -n else n
fun sign(n: Int) = if (n > 0) 1 else if (n < 0) -1 else 0
```

## Chained Operations

```kotlin
fun processName(name: String) = name
    .trim()
    .lowercase()
    .replaceFirstChar { it.uppercase() }

fun averageOfPositive(numbers: List<Int>) = numbers
    .filter { it > 0 }
    .average()
```

## With Generics

```kotlin
fun <T> List<T>.secondOrNull() = if (size >= 2) this[1] else null
fun <T : Comparable<T>> max(a: T, b: T) = if (a > b) a else b
```

## When to Use Regular Functions

Use braces when:
- Multiple statements needed
- Side effects before return
- Complex logic with early returns

```kotlin
// Better with braces
fun processData(data: String): Result {
    val validated = validate(data)
    if (!validated.isValid) {
        return Result.Error(validated.message)
    }
    val transformed = transform(validated.data)
    return Result.Success(transformed)
}
```

## Extension Functions

Single-expression works great for extensions:

```kotlin
fun String.addExclamation() = "$this!"
fun Int.isPositive() = this > 0
fun List<Int>.hasNegatives() = any { it < 0 }
```

## Try It Yourself

1. Convert a multi-line function to single-expression
2. Create a single-expression function with a when expression
3. Create an extension function using single-expression syntax
4. Chain multiple operations in a single-expression function

## Key Takeaways

1. `fun name(params) = expression` for single expressions
2. Return type can be inferred
3. No `return` keyword needed
4. Works with when, if, and chained calls
5. Use braces for complex multi-statement functions
6. Great for simple utilities and extensions
