---
title: For Loops
order: 3
estimatedMinutes: 12
---

# For Loops

Kotlin's `for` loop iterates over anything that provides an iterator. It's simpler and more powerful than C-style for loops.

## Basic For Loop

```kotlin
val fruits = listOf("apple", "banana", "cherry")

for (fruit in fruits) {
    println(fruit)
}
```

## Ranges

Iterate over a range of numbers:

```kotlin
for (i in 1..5) {
    println(i)  // 1, 2, 3, 4, 5
}
```

## Until (Exclusive End)

```kotlin
for (i in 0 until 5) {
    println(i)  // 0, 1, 2, 3, 4 (5 is excluded)
}
```

## Step

Skip values:

```kotlin
for (i in 0..10 step 2) {
    println(i)  // 0, 2, 4, 6, 8, 10
}
```

## Reverse (downTo)

Count backwards:

```kotlin
for (i in 5 downTo 1) {
    println(i)  // 5, 4, 3, 2, 1
}

for (i in 10 downTo 0 step 2) {
    println(i)  // 10, 8, 6, 4, 2, 0
}
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `for i in 1...5` | `for (i in 1..5)` |
| `for i in 0..<5` | `for (i in 0 until 5)` |
| `for i in stride(from: 0, to: 10, by: 2)` | `for (i in 0..10 step 2)` |
| `for i in (1...5).reversed()` | `for (i in 5 downTo 1)` |
| `for (index, value) in array.enumerated()` | `for ((index, value) in list.withIndex())` |

## Iterating with Index

```kotlin
val fruits = listOf("apple", "banana", "cherry")

for ((index, fruit) in fruits.withIndex()) {
    println("$index: $fruit")
}
// 0: apple
// 1: banana
// 2: cherry
```

## Iterating Over Maps

```kotlin
val ages = mapOf("Alice" to 25, "Bob" to 30)

for ((name, age) in ages) {
    println("$name is $age years old")
}
```

## Iterating Over Strings

```kotlin
for (char in "Kotlin") {
    println(char)
}
// K, o, t, l, i, n
```

## Indices Property

Access just the indices:

```kotlin
val fruits = listOf("apple", "banana", "cherry")

for (i in fruits.indices) {
    println("Index $i: ${fruits[i]}")
}
```

## lastIndex Property

```kotlin
val list = listOf(1, 2, 3, 4, 5)

for (i in 0..list.lastIndex) {
    println(list[i])
}
```

## Nested Loops

```kotlin
for (i in 1..3) {
    for (j in 1..3) {
        println("$i, $j")
    }
}
```

## Breaking and Continuing

```kotlin
for (i in 1..10) {
    if (i == 5) break  // Exit loop
    println(i)
}

for (i in 1..10) {
    if (i % 2 == 0) continue  // Skip even numbers
    println(i)
}
```

## Labels for Nested Loops

```kotlin
outer@ for (i in 1..3) {
    for (j in 1..3) {
        if (i == 2 && j == 2) break@outer  // Break outer loop
        println("$i, $j")
    }
}
```

## Try It Yourself

1. Print numbers 1 to 10
2. Print even numbers from 0 to 20 using `step`
3. Count down from 10 to 1
4. Iterate over a list with indices using `withIndex()`
5. Create a multiplication table with nested loops

## Key Takeaways

1. `for (item in collection)` - basic iteration
2. `1..5` - inclusive range (1 to 5)
3. `0 until 5` - exclusive end (0 to 4)
4. `step 2` - skip values
5. `downTo` - reverse iteration
6. `withIndex()` - get index and value
7. `break` and `continue` work as expected
8. Use labels (`outer@`) for nested loop control
