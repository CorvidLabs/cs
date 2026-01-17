---
title: String Utilities
order: 2
difficulty: medium
estimatedMinutes: 20
---

# Exercise: String Utilities

Create a collection of useful string utility functions.

## Requirements

1. Create functions for common string operations
2. Use extension functions where appropriate
3. Use default and named arguments
4. Handle edge cases (empty strings, null)

## Functions to Implement

```kotlin
// 1. Truncate string with ellipsis
truncate("Hello World", maxLength = 5) // "Hello..."

// 2. Capitalize each word
capitalizeWords("hello world") // "Hello World"

// 3. Count words
wordCount("Hello beautiful world") // 3

// 4. Mask string (for passwords, credit cards)
mask("1234567890", visibleChars = 4) // "******7890"

// 5. Is palindrome?
isPalindrome("racecar") // true
```

## Starter Code

```kotlin
fun main() {
    // Test your functions
    println(truncate("Hello World", 5))
    println(capitalizeWords("hello world"))
    println(wordCount("Hello beautiful world"))
    println(mask("1234567890", visibleChars = 4))
    println(isPalindrome("racecar"))
}

// Implement your functions here
```

## Hints

<details>
<summary>Hint 1: Truncate</summary>

```kotlin
fun truncate(text: String, maxLength: Int, suffix: String = "..."): String {
    return if (text.length <= maxLength) text
    else text.take(maxLength) + suffix
}
```
</details>

<details>
<summary>Hint 2: Capitalize words</summary>

```kotlin
fun capitalizeWords(text: String) = text
    .split(" ")
    .joinToString(" ") { it.replaceFirstChar { c -> c.uppercase() } }
```
</details>

<details>
<summary>Hint 3: Palindrome</summary>

```kotlin
fun isPalindrome(text: String): Boolean {
    val cleaned = text.lowercase().filter { it.isLetterOrDigit() }
    return cleaned == cleaned.reversed()
}
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
fun truncate(text: String, maxLength: Int, suffix: String = "..."): String {
    return if (text.length <= maxLength) text
    else text.take(maxLength) + suffix
}

fun capitalizeWords(text: String) = text
    .split(" ")
    .filter { it.isNotEmpty() }
    .joinToString(" ") { word ->
        word.replaceFirstChar { it.uppercase() }
    }

fun wordCount(text: String) = text
    .split(Regex("\\s+"))
    .filter { it.isNotEmpty() }
    .size

fun mask(text: String, visibleChars: Int = 4, maskChar: Char = '*'): String {
    if (text.length <= visibleChars) return text
    val masked = maskChar.toString().repeat(text.length - visibleChars)
    return masked + text.takeLast(visibleChars)
}

fun isPalindrome(text: String): Boolean {
    val cleaned = text.lowercase().filter { it.isLetterOrDigit() }
    return cleaned == cleaned.reversed()
}

fun main() {
    println(truncate("Hello World", 5))           // Hello...
    println(capitalizeWords("hello world"))       // Hello World
    println(wordCount("Hello beautiful world"))   // 3
    println(mask("1234567890", visibleChars = 4)) // ******7890
    println(isPalindrome("racecar"))              // true
    println(isPalindrome("A man a plan a canal Panama")) // true
}
```
</details>

## Bonus Challenge

1. Convert functions to extension functions on String
2. Add `reverse` that handles Unicode properly
3. Add `slug` that creates URL-friendly strings: "Hello World!" → "hello-world"
