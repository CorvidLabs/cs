---
title: String Formatter
order: 2
difficulty: easy
estimatedMinutes: 15
---

# Exercise: String Formatter

Build a program that formats and displays user information using string templates and operations.

## Requirements

1. Create variables for: first name, last name, age, and city
2. Create a formatted full name (uppercase last name)
3. Print a formatted introduction using string templates
4. Calculate and print birth year (approximate)

## Expected Output

```
Name: Kyntrin LASTNAME
Age: 25
City: Your City
Birth Year: 2001
Introduction: Hello! I'm Kyntrin LASTNAME, 25 years old, from Your City.
```

## Starter Code

```kotlin
fun main() {
    // Create your variables here
    val firstName = "Kyntrin"

    // Create formatted full name (uppercase last name)

    // Calculate birth year (current year - age)

    // Print all the information
}
```

## Hints

<details>
<summary>Hint 1: Uppercase a string</summary>

```kotlin
val upperName = lastName.uppercase()
```
</details>

<details>
<summary>Hint 2: String concatenation in templates</summary>

```kotlin
val fullName = "$firstName ${lastName.uppercase()}"
```
</details>

<details>
<summary>Hint 3: Current year</summary>

For simplicity, you can hardcode it:
```kotlin
val currentYear = 2026
val birthYear = currentYear - age
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
fun main() {
    val firstName = "Kyntrin"
    val lastName = "Dev"
    val age = 25
    val city = "Your City"

    val fullName = "$firstName ${lastName.uppercase()}"
    val currentYear = 2026
    val birthYear = currentYear - age

    println("Name: $fullName")
    println("Age: $age")
    println("City: $city")
    println("Birth Year: $birthYear")
    println("Introduction: Hello! I'm $fullName, $age years old, from $city.")
}
```
</details>

## Bonus Challenge

1. Add more fields (email, occupation)
2. Create initials from the names (e.g., "K.D.")
3. Reverse the first name using `.reversed()`
