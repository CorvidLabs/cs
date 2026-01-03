---
title: Constants and Variables
order: 2
estimatedMinutes: 12
---

# Constants and Variables

In Swift, you store values using either constants or variables. The choice between them is one of Swift's key safety features.

## Constants with let

Use `let` to create a constant - a value that never changes:

```swift
let maximumScore = 100
let welcomeMessage = "Hello"
let pi = 3.14159
```

Once set, constants cannot be modified:

```swift
let age = 25
// age = 26  // Error: Cannot assign to value: 'age' is a 'let' constant
```

## Variables with var

Use `var` to create a variable - a value that can change:

```swift
var score = 0
score = 10
score = 25
print(score)  // Prints: 25
```

Variables can be reassigned any number of times:

```swift
var counter = 1
counter = counter + 1  // counter is now 2
counter += 1           // counter is now 3 (shorthand)
```

## When to Use let vs var

**Prefer `let` by default.** Only use `var` when you need to change the value.

```swift
// Good: These values won't change
let username = "alice"
let maxAttempts = 3
let apiEndpoint = "https://api.example.com"

// Good: These values will change
var currentAttempts = 0
var isLoggedIn = false
var temperature = 72.5
```

Swift will warn you if you use `var` for something that never changes.

## Naming Conventions

Swift uses **camelCase** for constants and variables:

```swift
// Good - camelCase
let firstName = "John"
let numberOfItems = 5
var isUserLoggedIn = false

// Avoid - other styles
// let first_name = "John"    // snake_case
// let FirstName = "John"     // PascalCase (reserved for types)
```

Names should be descriptive and meaningful:

```swift
// Good - clear and descriptive
let maximumPasswordLength = 20
var currentUserScore = 0

// Avoid - unclear abbreviations
// let maxPwdLen = 20
// var curUsrScr = 0
```

## Multiple Declarations

You can declare multiple constants or variables on one line:

```swift
let x = 0, y = 0, z = 0
var red = 0.0, green = 0.0, blue = 0.0
```

However, separate lines are often clearer:

```swift
let width = 100
let height = 50
let depth = 25
```

## Printing Values

Use string interpolation to include constants and variables in output:

```swift
let playerName = "Alex"
var playerScore = 42

print("Player: \(playerName)")
print("Score: \(playerScore)")
print("\(playerName) scored \(playerScore) points!")
```

Output:
```
Player: Alex
Score: 42
Alex scored 42 points!
```

## Key Takeaways

1. Use `let` for constants (values that never change)
2. Use `var` for variables (values that can change)
3. Prefer `let` whenever possible - it's safer
4. Use camelCase for naming
5. Choose descriptive, meaningful names
6. Use `\(value)` to include values in strings

In the next lesson, we'll explore how Swift automatically determines the type of your values.
