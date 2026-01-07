---
title: Grade Calculator
order: 1
difficulty: easy
estimatedMinutes: 15
---

# Exercise: Grade Calculator

Build a program that converts numerical scores to letter grades using `when` expressions.

## Requirements

1. Accept a numerical score (0-100)
2. Convert to letter grade using this scale:
   - 90-100: A
   - 80-89: B
   - 70-79: C
   - 60-69: D
   - Below 60: F
3. Handle invalid scores (negative or over 100)
4. Print both the score and grade

## Expected Output

```
Score: 85 -> Grade: B
Score: 92 -> Grade: A
Score: 45 -> Grade: F
Score: -5 -> Grade: Invalid
Score: 105 -> Grade: Invalid
```

## Starter Code

```kotlin
fun main() {
    val scores = listOf(85, 92, 45, -5, 105, 70, 60, 59)

    for (score in scores) {
        // Calculate grade using when

        // Print result
    }
}
```

## Hints

<details>
<summary>Hint 1: Using ranges in when</summary>

```kotlin
val grade = when (score) {
    in 90..100 -> "A"
    // ... more cases
}
```
</details>

<details>
<summary>Hint 2: Handling invalid scores</summary>

Check for invalid ranges:
```kotlin
when (score) {
    !in 0..100 -> "Invalid"
    in 90..100 -> "A"
    // ...
}
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
fun main() {
    val scores = listOf(85, 92, 45, -5, 105, 70, 60, 59)

    for (score in scores) {
        val grade = when (score) {
            !in 0..100 -> "Invalid"
            in 90..100 -> "A"
            in 80..89 -> "B"
            in 70..79 -> "C"
            in 60..69 -> "D"
            else -> "F"
        }
        println("Score: $score -> Grade: $grade")
    }
}
```
</details>

## Bonus Challenge

1. Add plus/minus grades (A+, A, A-, etc.)
2. Calculate GPA from a list of grades
3. Create a function that returns a detailed message for each grade
