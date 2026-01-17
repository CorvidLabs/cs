---
title: Transformations
order: 4
estimatedMinutes: 15
---

# Collection Transformations

Kotlin provides powerful functions to transform collections without mutation.

## map

Transform each element:

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)
val doubled = numbers.map { it * 2 }
println(doubled)  // [2, 4, 6, 8, 10]

val names = listOf("alice", "bob")
val upper = names.map { it.uppercase() }
println(upper)  // [ALICE, BOB]
```

## mapIndexed

Transform with index:

```kotlin
val letters = listOf("a", "b", "c")
val indexed = letters.mapIndexed { index, value -> "$index: $value" }
println(indexed)  // [0: a, 1: b, 2: c]
```

## mapNotNull

Transform and filter nulls:

```kotlin
val strings = listOf("1", "2", "three", "4")
val numbers = strings.mapNotNull { it.toIntOrNull() }
println(numbers)  // [1, 2, 4]
```

## flatMap

Transform and flatten:

```kotlin
val sentences = listOf("Hello world", "Kotlin is great")
val words = sentences.flatMap { it.split(" ") }
println(words)  // [Hello, world, Kotlin, is, great]
```

## flatten

Flatten nested collections:

```kotlin
val nested = listOf(listOf(1, 2), listOf(3, 4), listOf(5))
val flat = nested.flatten()
println(flat)  // [1, 2, 3, 4, 5]
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `array.map { $0 * 2 }` | `list.map { it * 2 }` |
| `array.compactMap { ... }` | `list.mapNotNull { ... }` |
| `array.flatMap { ... }` | `list.flatMap { ... }` |
| `array.joined()` | `list.flatten()` |

## zip

Combine two collections:

```kotlin
val names = listOf("Alice", "Bob", "Charlie")
val ages = listOf(25, 30, 35)

val pairs = names.zip(ages)
println(pairs)  // [(Alice, 25), (Bob, 30), (Charlie, 35)]

// With transformation
val people = names.zip(ages) { name, age -> "$name is $age" }
println(people)  // [Alice is 25, Bob is 30, Charlie is 35]
```

## unzip

Split pairs:

```kotlin
val pairs = listOf("a" to 1, "b" to 2, "c" to 3)
val (letters, numbers) = pairs.unzip()
println(letters)  // [a, b, c]
println(numbers)  // [1, 2, 3]
```

## associate

Create maps from lists:

```kotlin
val names = listOf("Alice", "Bob", "Charlie")

// Key to value
val nameLengths = names.associateWith { it.length }
println(nameLengths)  // {Alice=5, Bob=3, Charlie=7}

// Value to key
val lengthNames = names.associateBy { it.length }
println(lengthNames)  // {5=Alice, 3=Bob, 7=Charlie}

// Custom pair
val custom = names.associate { it to it.uppercase() }
println(custom)  // {Alice=ALICE, Bob=BOB, Charlie=CHARLIE}
```

## chunked

Split into chunks:

```kotlin
val numbers = (1..10).toList()

val chunks = numbers.chunked(3)
println(chunks)  // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]

// With transformation
val sums = numbers.chunked(3) { it.sum() }
println(sums)  // [6, 15, 24, 10]
```

## windowed

Sliding window:

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

val windows = numbers.windowed(3)
println(windows)  // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]

// With step
val stepped = numbers.windowed(2, step = 2)
println(stepped)  // [[1, 2], [3, 4]]
```

## Chaining Transformations

```kotlin
val result = listOf("  alice  ", "  BOB  ", "  Charlie  ")
    .map { it.trim() }
    .map { it.lowercase() }
    .filter { it.length > 3 }
    .sorted()

println(result)  // [alice, charlie]
```

## Try It Yourself

1. Use `map` to square all numbers in a list
2. Use `flatMap` to split sentences into words
3. Use `zip` to combine two lists
4. Use `associate` to create a map from a list
5. Chain multiple transformations together

## Key Takeaways

1. `map` transforms each element
2. `mapNotNull` transforms and filters nulls
3. `flatMap` transforms and flattens
4. `zip` combines two collections
5. `associate` creates maps
6. `chunked` splits into fixed-size groups
7. `windowed` creates sliding windows
8. Chain operations for powerful pipelines
