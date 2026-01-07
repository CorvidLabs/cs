---
title: Higher-Order Functions
order: 3
difficulty: medium
estimatedMinutes: 25
---

# Exercise: Higher-Order Functions

Master lambdas and higher-order functions by implementing custom collection operations.

## Requirements

Implement these functions WITHOUT using built-in collection methods:

1. `myMap` - Transform each element
2. `myFilter` - Keep elements matching a condition
3. `myReduce` - Combine elements into one value
4. `myFind` - Find first matching element
5. `myAny` - Check if any element matches

## Starter Code

```kotlin
fun main() {
    val numbers = listOf(1, 2, 3, 4, 5)

    // Transform
    val doubled = myMap(numbers) { it * 2 }
    println(doubled) // [2, 4, 6, 8, 10]

    // Filter
    val evens = myFilter(numbers) { it % 2 == 0 }
    println(evens) // [2, 4]

    // Reduce
    val sum = myReduce(numbers, 0) { acc, n -> acc + n }
    println(sum) // 15

    // Find
    val firstEven = myFind(numbers) { it % 2 == 0 }
    println(firstEven) // 2

    // Any
    val hasNegative = myAny(numbers) { it < 0 }
    println(hasNegative) // false
}

// Implement your functions here
```

## Hints

<details>
<summary>Hint 1: myMap signature</summary>

```kotlin
fun <T, R> myMap(list: List<T>, transform: (T) -> R): List<R>
```
</details>

<details>
<summary>Hint 2: myMap implementation</summary>

```kotlin
fun <T, R> myMap(list: List<T>, transform: (T) -> R): List<R> {
    val result = mutableListOf<R>()
    for (item in list) {
        result.add(transform(item))
    }
    return result
}
```
</details>

<details>
<summary>Hint 3: myReduce signature</summary>

```kotlin
fun <T, R> myReduce(list: List<T>, initial: R, operation: (R, T) -> R): R
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
fun <T, R> myMap(list: List<T>, transform: (T) -> R): List<R> {
    val result = mutableListOf<R>()
    for (item in list) {
        result.add(transform(item))
    }
    return result
}

fun <T> myFilter(list: List<T>, predicate: (T) -> Boolean): List<T> {
    val result = mutableListOf<T>()
    for (item in list) {
        if (predicate(item)) {
            result.add(item)
        }
    }
    return result
}

fun <T, R> myReduce(list: List<T>, initial: R, operation: (R, T) -> R): R {
    var accumulator = initial
    for (item in list) {
        accumulator = operation(accumulator, item)
    }
    return accumulator
}

fun <T> myFind(list: List<T>, predicate: (T) -> Boolean): T? {
    for (item in list) {
        if (predicate(item)) {
            return item
        }
    }
    return null
}

fun <T> myAny(list: List<T>, predicate: (T) -> Boolean): Boolean {
    for (item in list) {
        if (predicate(item)) {
            return true
        }
    }
    return false
}

fun main() {
    val numbers = listOf(1, 2, 3, 4, 5)

    val doubled = myMap(numbers) { it * 2 }
    println(doubled) // [2, 4, 6, 8, 10]

    val evens = myFilter(numbers) { it % 2 == 0 }
    println(evens) // [2, 4]

    val sum = myReduce(numbers, 0) { acc, n -> acc + n }
    println(sum) // 15

    val firstEven = myFind(numbers) { it % 2 == 0 }
    println(firstEven) // 2

    val hasNegative = myAny(numbers) { it < 0 }
    println(hasNegative) // false
}
```
</details>

## Bonus Challenge

1. Implement `myAll` - check if ALL elements match
2. Implement `myFlatMap` - map and flatten results
3. Implement `myGroupBy` - group elements by key
4. Make these extension functions on List<T>
