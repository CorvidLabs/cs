---
title: Temperature Converter
order: 1
difficulty: easy
estimatedMinutes: 15
---

# Exercise: Temperature Converter

Build a program that converts temperatures between Celsius and Fahrenheit.

## Requirements

1. Create a variable to hold a temperature in Celsius
2. Convert it to Fahrenheit using the formula: `F = C * 9/5 + 32`
3. Print both temperatures with labels
4. Use string templates for the output

## Formula Reference

- Celsius to Fahrenheit: `F = C * 9/5 + 32`
- Fahrenheit to Celsius: `C = (F - 32) * 5/9`

## Expected Output

```
25.0°C = 77.0°F
```

## Starter Code

```kotlin
fun main() {
    // Create a val for the Celsius temperature

    // Calculate Fahrenheit

    // Print the result using string templates
}
```

## Hints

<details>
<summary>Hint 1: Variable declaration</summary>

Use `val` since the temperature won't change:
```kotlin
val celsius = 25.0
```
</details>

<details>
<summary>Hint 2: The formula</summary>

```kotlin
val fahrenheit = celsius * 9 / 5 + 32
```
</details>

<details>
<summary>Hint 3: String templates</summary>

```kotlin
println("$celsius°C = $fahrenheit°F")
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
fun main() {
    val celsius = 25.0
    val fahrenheit = celsius * 9 / 5 + 32
    println("$celsius°C = $fahrenheit°F")
}
```
</details>

## Bonus Challenge

1. Convert from Fahrenheit to Celsius as well
2. Try with different temperatures
3. Format the output to show only 1 decimal place using `String.format("%.1f", value)`
