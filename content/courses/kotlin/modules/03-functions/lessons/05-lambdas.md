---
title: Lambda Expressions
order: 5
estimatedMinutes: 18
---

# Lambda Expressions

Lambdas are anonymous functions that can be passed as values. They're fundamental to Kotlin's functional programming style.

## Basic Lambda Syntax

```kotlin
val greet = { println("Hello!") }
greet()  // Hello!

val add = { a: Int, b: Int -> a + b }
println(add(2, 3))  // 5
```

## Lambda Structure

```kotlin
{ parameters -> body }
```

- Curly braces contain the lambda
- Parameters before the arrow
- Body (expression) after the arrow
- Last expression is the return value

## Type Declarations

```kotlin
// Explicit type
val add: (Int, Int) -> Int = { a, b -> a + b }

// Inferred from lambda
val subtract = { a: Int, b: Int -> a - b }

// Inferred from context
val numbers = listOf(1, 2, 3)
numbers.map { it * 2 }  // it is inferred as Int
```

## The `it` Keyword

For single-parameter lambdas, use `it`:

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

// Explicit parameter
numbers.filter { n -> n > 2 }

// Using it
numbers.filter { it > 2 }
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `{ (a: Int, b: Int) -> Int in a + b }` | `{ a: Int, b: Int -> a + b }` |
| `$0`, `$1` for shorthand | `it` for single param |
| Trailing closure syntax | Trailing lambda syntax |
| `{ $0 > 2 }` | `{ it > 2 }` |

## Lambdas with Collections

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

// Transform
val doubled = numbers.map { it * 2 }  // [2, 4, 6, 8, 10]

// Filter
val evens = numbers.filter { it % 2 == 0 }  // [2, 4]

// Reduce
val sum = numbers.reduce { acc, n -> acc + n }  // 15
```

## Higher-Order Functions

Functions that take or return functions:

```kotlin
fun operateOnNumbers(
    a: Int,
    b: Int,
    operation: (Int, Int) -> Int
): Int {
    return operation(a, b)
}

fun main() {
    val sum = operateOnNumbers(5, 3) { a, b -> a + b }
    val product = operateOnNumbers(5, 3) { a, b -> a * b }
    println("Sum: $sum, Product: $product")  // Sum: 8, Product: 15
}
```

## Returning Lambdas

```kotlin
fun createMultiplier(factor: Int): (Int) -> Int {
    return { number -> number * factor }
}

fun main() {
    val double = createMultiplier(2)
    val triple = createMultiplier(3)

    println(double(5))  // 10
    println(triple(5))  // 15
}
```

## Closures

Lambdas can capture variables from their scope:

```kotlin
fun counter(): () -> Int {
    var count = 0
    return { ++count }
}

fun main() {
    val next = counter()
    println(next())  // 1
    println(next())  // 2
    println(next())  // 3
}
```

## Multi-Line Lambdas

```kotlin
val processData = { data: String ->
    val cleaned = data.trim()
    val upper = cleaned.uppercase()
    val result = "Processed: $upper"
    result  // Last expression is returned
}
```

## Underscore for Unused Parameters

```kotlin
val map = mapOf("a" to 1, "b" to 2)

map.forEach { (key, _) ->
    println("Key: $key")  // Don't need value
}
```

## Lambda with Receiver

```kotlin
fun buildString(action: StringBuilder.() -> Unit): String {
    val sb = StringBuilder()
    sb.action()
    return sb.toString()
}

fun main() {
    val result = buildString {
        append("Hello, ")
        append("World!")
    }
    println(result)  // Hello, World!
}
```

## Anonymous Functions

Alternative to lambdas when you need explicit return type:

```kotlin
val sum = fun(a: Int, b: Int): Int {
    return a + b
}

// Useful when return type can't be inferred
val processor = fun(data: String): Result {
    return if (data.isEmpty()) Result.Error else Result.Success
}
```

## Try It Yourself

1. Create a lambda that squares a number
2. Use `filter` and `map` together on a list
3. Create a higher-order function that takes a lambda
4. Create a function that returns a lambda
5. Use a lambda with receiver to build a string

## Key Takeaways

1. Lambdas: `{ params -> body }`
2. `it` for single-parameter lambdas
3. Type: `(ParamTypes) -> ReturnType`
4. Trailing lambda goes outside parentheses
5. Lambdas can capture variables (closures)
6. Last expression is the return value
7. Use `_` for unused parameters
8. Lambda with receiver: `Type.() -> Unit`
