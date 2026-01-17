---
title: Calculator Functions
order: 1
difficulty: easy
estimatedMinutes: 15
---

# Exercise: Calculator Functions

Build a set of calculator functions using different Kotlin function features.

## Requirements

1. Create basic math functions (add, subtract, multiply, divide)
2. Use single-expression syntax
3. Handle division by zero
4. Create a higher-order function that applies any operation

## Starter Code

```kotlin
fun main() {
    // Test your functions here
    println(add(5, 3))       // 8
    println(subtract(10, 4)) // 6
    println(multiply(3, 4))  // 12
    println(divide(10, 2))   // 5.0
    println(divide(10, 0))   // Handle this!

    // Higher-order function
    println(calculate(10, 5, ::add))       // 15
    println(calculate(10, 5) { a, b -> a - b })  // 5
}

// Define your functions here
```

## Hints

<details>
<summary>Hint 1: Single-expression functions</summary>

```kotlin
fun add(a: Int, b: Int) = a + b
```
</details>

<details>
<summary>Hint 2: Handling division by zero</summary>

```kotlin
fun divide(a: Int, b: Int): Double? = if (b != 0) a.toDouble() / b else null
```
</details>

<details>
<summary>Hint 3: Higher-order function</summary>

```kotlin
fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
fun add(a: Int, b: Int) = a + b
fun subtract(a: Int, b: Int) = a - b
fun multiply(a: Int, b: Int) = a * b

fun divide(a: Int, b: Int): Double? = if (b != 0) a.toDouble() / b else null

fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int) = operation(a, b)

fun main() {
    println(add(5, 3))       // 8
    println(subtract(10, 4)) // 6
    println(multiply(3, 4))  // 12
    println(divide(10, 2))   // 5.0
    println(divide(10, 0))   // null

    println(calculate(10, 5, ::add))              // 15
    println(calculate(10, 5) { a, b -> a - b })   // 5
    println(calculate(10, 5) { a, b -> a * b })   // 50
}
```
</details>

## Bonus Challenge

1. Add a `power` function using `kotlin.math.pow`
2. Create a function that takes vararg numbers and an operation
3. Add a `modulo` function for remainder
