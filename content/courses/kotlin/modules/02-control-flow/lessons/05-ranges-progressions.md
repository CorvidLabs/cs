---
title: Ranges and Progressions
order: 5
estimatedMinutes: 12
---

# Ranges and Progressions

Ranges are a fundamental Kotlin feature used for iteration, checking containment, and more. They're type-safe and expressive.

## Creating Ranges

### Closed Range (..)

Includes both endpoints:

```kotlin
val numbers = 1..5  // 1, 2, 3, 4, 5
val letters = 'a'..'e'  // a, b, c, d, e
```

### Half-Open Range (until)

Excludes the end:

```kotlin
val indices = 0 until 5  // 0, 1, 2, 3, 4
```

### Downward Range (downTo)

```kotlin
val countdown = 5 downTo 1  // 5, 4, 3, 2, 1
```

## Comparing to Swift

| Swift | Kotlin | Type |
|-------|--------|------|
| `1...5` | `1..5` | Closed range |
| `0..<5` | `0 until 5` | Half-open |
| `(1...5).reversed()` | `5 downTo 1` | Reversed |

## Checking Containment

Use `in` to check if a value is in a range:

```kotlin
val age = 25

if (age in 18..65) {
    println("Working age")
}

if (age !in 0..17) {
    println("Not a minor")
}
```

## Ranges in When

```kotlin
val score = 85

val grade = when (score) {
    in 90..100 -> "A"
    in 80..89 -> "B"
    in 70..79 -> "C"
    in 60..69 -> "D"
    in 0..59 -> "F"
    else -> "Invalid"
}
```

## Progressions

Ranges with a step are called progressions:

```kotlin
val evens = 0..10 step 2  // 0, 2, 4, 6, 8, 10
val odds = 1..10 step 2   // 1, 3, 5, 7, 9

for (i in 0..20 step 5) {
    println(i)  // 0, 5, 10, 15, 20
}
```

## Combining Operators

```kotlin
// Count down by 2
for (i in 10 downTo 0 step 2) {
    println(i)  // 10, 8, 6, 4, 2, 0
}
```

## Character Ranges

```kotlin
val lowercase = 'a'..'z'
val uppercase = 'A'..'Z'
val digits = '0'..'9'

val char = 'k'
if (char in lowercase) {
    println("$char is a lowercase letter")
}
```

## Range Functions

### first, last, step

```kotlin
val range = 1..10 step 2
println(range.first)  // 1
println(range.last)   // 9 (not 10, because of step)
println(range.step)   // 2
```

### isEmpty()

```kotlin
val empty = 10..1  // Empty! (can't go up from 10 to 1)
println(empty.isEmpty())  // true

val notEmpty = 10 downTo 1  // Not empty
println(notEmpty.isEmpty())  // false
```

### reversed()

```kotlin
val range = 1..5
for (i in range.reversed()) {
    println(i)  // 5, 4, 3, 2, 1
}
```

## Range Types

Kotlin has specific range types:

```kotlin
val intRange: IntRange = 1..10
val longRange: LongRange = 1L..10L
val charRange: CharRange = 'a'..'z'
```

## Ranges with Comparable

Any Comparable can create a range:

```kotlin
val dateRange = LocalDate.of(2024, 1, 1)..LocalDate.of(2024, 12, 31)

val today = LocalDate.now()
if (today in dateRange) {
    println("Today is in 2024")
}
```

## Common Patterns

### Validating Input

```kotlin
fun isValidAge(age: Int) = age in 0..150

fun isValidGrade(grade: Char) = grade in 'A'..'F'
```

### Array/List Bounds

```kotlin
val list = listOf("a", "b", "c", "d")

fun safeGet(index: Int): String? {
    return if (index in list.indices) list[index] else null
}
```

### Percentage Range

```kotlin
fun isValidPercentage(value: Double) = value in 0.0..100.0
```

## Try It Yourself

1. Create ranges for: lowercase letters, single digits, teen ages
2. Check if a character is alphanumeric using ranges
3. Print a countdown from 100 to 0, counting by 10s
4. Use a range in a when expression to categorize temperatures

## Key Takeaways

1. `..` creates closed ranges (inclusive)
2. `until` creates half-open ranges (exclusive end)
3. `downTo` creates descending ranges
4. `step` creates progressions with custom increments
5. `in` checks containment
6. Ranges work with any Comparable type
7. `IntRange`, `LongRange`, `CharRange` are specific types
8. Empty ranges: `10..1` is empty (use `downTo` instead)
