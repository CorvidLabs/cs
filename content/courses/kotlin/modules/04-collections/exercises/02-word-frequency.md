---
title: Word Frequency
order: 2
difficulty: medium
estimatedMinutes: 20
---

# Exercise: Word Frequency

Analyze text by counting word frequencies.

## Requirements

1. Split text into words (handle punctuation)
2. Count frequency of each word (case-insensitive)
3. Find the most common word
4. Find words that appear only once
5. Sort words by frequency

## Starter Code

```kotlin
fun main() {
    val text = """
        Kotlin is a modern programming language.
        Kotlin is concise and expressive.
        Programming in Kotlin is fun!
        Is Kotlin the best language? Kotlin might be!
    """.trimIndent()

    // 1. Split into words (lowercase, remove punctuation)
    val words = // your code

    // 2. Count frequency
    val frequency = // your code

    // 3. Most common word
    val mostCommon = // your code

    // 4. Words appearing once
    val unique = // your code

    // 5. Words sorted by frequency (descending)
    val sorted = // your code

    println("Word count: ${words.size}")
    println("Unique words: ${frequency.size}")
    println("Frequency: $frequency")
    println("Most common: $mostCommon")
    println("Appear once: $unique")
    println("By frequency: $sorted")
}
```

## Expected Output

```
Word count: 24
Unique words: 14
Frequency: {kotlin=5, is=4, a=1, modern=1, programming=2, language=2, ...}
Most common: (kotlin, 5)
Appear once: [a, modern, concise, and, expressive, in, fun, the, best, might, be]
By frequency: [(kotlin, 5), (is, 4), (programming, 2), ...]
```

## Hints

<details>
<summary>Hint 1: Cleaning words</summary>

```kotlin
val words = text
    .lowercase()
    .split(Regex("[\\s,.!?]+"))
    .filter { it.isNotEmpty() }
```
</details>

<details>
<summary>Hint 2: Counting frequency</summary>

```kotlin
val frequency = words.groupingBy { it }.eachCount()
// or
val frequency = words.groupBy { it }.mapValues { it.value.size }
```
</details>

<details>
<summary>Hint 3: Most common</summary>

```kotlin
val mostCommon = frequency.maxByOrNull { it.value }
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
fun main() {
    val text = """
        Kotlin is a modern programming language.
        Kotlin is concise and expressive.
        Programming in Kotlin is fun!
        Is Kotlin the best language? Kotlin might be!
    """.trimIndent()

    val words = text
        .lowercase()
        .split(Regex("[\\s,.!?]+"))
        .filter { it.isNotEmpty() }

    val frequency = words.groupingBy { it }.eachCount()

    val mostCommon = frequency.maxByOrNull { it.value }

    val unique = frequency.filter { it.value == 1 }.keys.toList()

    val sorted = frequency.entries
        .sortedByDescending { it.value }
        .map { it.key to it.value }

    println("Word count: ${words.size}")
    println("Unique words: ${frequency.size}")
    println("Frequency: $frequency")
    println("Most common: $mostCommon")
    println("Appear once: $unique")
    println("By frequency: $sorted")
}
```
</details>

## Bonus Challenge

1. Find the top 3 most common words
2. Calculate average word length
3. Find the longest word
4. Create a word cloud representation (word repeated by frequency)
