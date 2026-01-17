---
title: FizzBuzz
order: 2
difficulty: easy
estimatedMinutes: 15
---

# Exercise: FizzBuzz

The classic programming challenge! Print numbers 1-100, but:
- For multiples of 3, print "Fizz"
- For multiples of 5, print "Buzz"
- For multiples of both 3 and 5, print "FizzBuzz"

## Requirements

1. Iterate from 1 to 100
2. Use `when` expression to determine output
3. Check for FizzBuzz first (multiples of both)

## Expected Output

```
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
16
...
```

## Starter Code

```kotlin
fun main() {
    for (i in 1..100) {
        // Determine what to print using when

        // Print the result
    }
}
```

## Hints

<details>
<summary>Hint 1: Modulo operator</summary>

Use `%` to check divisibility:
```kotlin
if (n % 3 == 0) // n is divisible by 3
```
</details>

<details>
<summary>Hint 2: when without argument</summary>

```kotlin
val result = when {
    i % 15 == 0 -> "FizzBuzz"  // Check this first!
    i % 3 == 0 -> "Fizz"
    // ...
}
```
</details>

<details>
<summary>Hint 3: Why check 15?</summary>

15 is the least common multiple of 3 and 5.
`i % 15 == 0` is equivalent to `i % 3 == 0 && i % 5 == 0`
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
fun main() {
    for (i in 1..100) {
        val output = when {
            i % 15 == 0 -> "FizzBuzz"
            i % 3 == 0 -> "Fizz"
            i % 5 == 0 -> "Buzz"
            else -> i.toString()
        }
        println(output)
    }
}
```

Alternative with string building:

```kotlin
fun main() {
    for (i in 1..100) {
        var result = ""
        if (i % 3 == 0) result += "Fizz"
        if (i % 5 == 0) result += "Buzz"
        println(result.ifEmpty { i.toString() })
    }
}
```
</details>

## Bonus Challenge

1. Make it configurable: FizzBuzz for any two numbers, not just 3 and 5
2. Add a third rule: multiples of 7 print "Bazz"
3. Create a function that returns the FizzBuzz sequence as a List<String>
