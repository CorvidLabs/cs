---
title: Number Patterns
order: 3
difficulty: medium
estimatedMinutes: 20
---

# Exercise: Number Patterns

Practice loops and control flow by printing various number patterns.

## Part 1: Triangle

Print a right triangle:

```
*
**
***
****
*****
```

## Part 2: Inverted Triangle

```
*****
****
***
**
*
```

## Part 3: Number Pyramid

```
    1
   121
  12321
 1234321
123454321
```

## Starter Code

```kotlin
fun main() {
    val height = 5

    println("Triangle:")
    // Your code here

    println("\nInverted Triangle:")
    // Your code here

    println("\nNumber Pyramid:")
    // Your code here
}
```

## Hints

<details>
<summary>Hint 1: Triangle pattern</summary>

```kotlin
for (row in 1..height) {
    repeat(row) { print("*") }
    println()
}
```
</details>

<details>
<summary>Hint 2: Inverted uses downTo</summary>

```kotlin
for (row in height downTo 1) {
    // ...
}
```
</details>

<details>
<summary>Hint 3: Pyramid needs spaces</summary>

For a pyramid of height 5:
- Row 1: 4 spaces, then "1"
- Row 2: 3 spaces, then "121"
- Row 3: 2 spaces, then "12321"
- etc.

The spaces = height - row
</details>

<details>
<summary>Hint 4: Number pyramid pattern</summary>

For each row, you count up to the row number, then back down:
- Row 3: 1, 2, 3, 2, 1
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
fun main() {
    val height = 5

    println("Triangle:")
    for (row in 1..height) {
        repeat(row) { print("*") }
        println()
    }

    println("\nInverted Triangle:")
    for (row in height downTo 1) {
        repeat(row) { print("*") }
        println()
    }

    println("\nNumber Pyramid:")
    for (row in 1..height) {
        // Print leading spaces
        repeat(height - row) { print(" ") }

        // Print ascending numbers
        for (num in 1..row) {
            print(num)
        }

        // Print descending numbers
        for (num in (row - 1) downTo 1) {
            print(num)
        }

        println()
    }
}
```
</details>

## Bonus Challenge

1. Create a diamond pattern:
```
    *
   ***
  *****
 *******
*********
 *******
  *****
   ***
    *
```

2. Create a hollow square:
```
*****
*   *
*   *
*   *
*****
```

3. Create Pascal's Triangle:
```
    1
   1 1
  1 2 1
 1 3 3 1
1 4 6 4 1
```
