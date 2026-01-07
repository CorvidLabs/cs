---
title: List Operations
order: 1
difficulty: easy
estimatedMinutes: 15
---

# Exercise: List Operations

Practice basic list operations and transformations.

## Requirements

Given a list of integers, implement functions to:
1. Find all even numbers
2. Square all numbers
3. Get the sum
4. Find the maximum
5. Get unique values sorted in descending order

## Starter Code

```kotlin
fun main() {
    val numbers = listOf(3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5)

    // 1. Find all even numbers
    val evens = // your code

    // 2. Square all numbers
    val squares = // your code

    // 3. Get the sum
    val sum = // your code

    // 4. Find the maximum
    val max = // your code

    // 5. Unique values sorted descending
    val uniqueDesc = // your code

    println("Evens: $evens")         // [4, 2, 6]
    println("Squares: $squares")     // [9, 1, 16, 1, 25, 81, 4, 36, 25, 9, 25]
    println("Sum: $sum")             // 44
    println("Max: $max")             // 9
    println("Unique desc: $uniqueDesc") // [9, 6, 5, 4, 3, 2, 1]
}
```

## Hints

<details>
<summary>Hint 1: Filter evens</summary>

```kotlin
val evens = numbers.filter { it % 2 == 0 }
```
</details>

<details>
<summary>Hint 2: Square with map</summary>

```kotlin
val squares = numbers.map { it * it }
```
</details>

<details>
<summary>Hint 3: Unique descending</summary>

```kotlin
val uniqueDesc = numbers.toSet().sortedDescending()
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
fun main() {
    val numbers = listOf(3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5)

    val evens = numbers.filter { it % 2 == 0 }
    val squares = numbers.map { it * it }
    val sum = numbers.sum()
    val max = numbers.maxOrNull()
    val uniqueDesc = numbers.toSet().sortedDescending()

    println("Evens: $evens")
    println("Squares: $squares")
    println("Sum: $sum")
    println("Max: $max")
    println("Unique desc: $uniqueDesc")
}
```
</details>

## Bonus Challenge

1. Find the average of all numbers
2. Find numbers that appear more than once
3. Get the product of all numbers using `reduce`
