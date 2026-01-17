---
title: If Expressions
order: 1
estimatedMinutes: 12
---

# If Expressions

In Kotlin, `if` is an expression, not just a statement. This means it returns a value, making your code more concise.

## Basic If Statement

The traditional way:

```kotlin
val temperature = 25

if (temperature > 30) {
    println("It's hot!")
} else if (temperature > 20) {
    println("It's nice!")
} else {
    println("It's cold!")
}
```

## If as an Expression

Since `if` returns a value, you can assign it directly:

```kotlin
val temperature = 25

val message = if (temperature > 30) {
    "It's hot!"
} else if (temperature > 20) {
    "It's nice!"
} else {
    "It's cold!"
}

println(message)  // It's nice!
```

## One-Line If Expression

For simple cases:

```kotlin
val max = if (a > b) a else b
```

This replaces the ternary operator (`? :`) found in other languages.

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `let max = a > b ? a : b` | `val max = if (a > b) a else b` |
| Ternary operator | If expression |

Kotlin chose not to include the ternary operator because `if` expressions serve the same purpose more readably.

## Blocks Return Last Expression

When using blocks, the last expression is the returned value:

```kotlin
val result = if (score >= 90) {
    println("Excellent!")
    "A"  // This is returned
} else if (score >= 80) {
    println("Good job!")
    "B"  // This is returned
} else {
    println("Keep trying!")
    "C"  // This is returned
}
```

## If Expression Must Be Exhaustive

When using `if` as an expression, you must have an `else`:

```kotlin
// Error: 'if' must have both main and 'else' branches if used as an expression
val result = if (x > 0) "positive"

// Correct
val result = if (x > 0) "positive" else "not positive"
```

## Comparison Operators

| Operator | Meaning |
|----------|---------|
| `==` | Equal |
| `!=` | Not equal |
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater than or equal |
| `<=` | Less than or equal |

## Logical Operators

| Operator | Meaning |
|----------|---------|
| `&&` | And |
| `\|\|` | Or |
| `!` | Not |

```kotlin
val age = 25
val hasLicense = true

if (age >= 18 && hasLicense) {
    println("Can drive")
}
```

## Null Checks with If

```kotlin
val name: String? = "Kotlin"

if (name != null) {
    // Smart cast: name is String here
    println(name.length)
}
```

## Try It Yourself

1. Create an if expression that returns "even" or "odd" based on a number
2. Use a multi-branch if to categorize ages (child, teen, adult, senior)
3. Combine conditions with `&&` and `||`

## Key Takeaways

1. `if` is an expression in Kotlin - it returns a value
2. No ternary operator - use `if`/`else` expressions instead
3. Last expression in a block is the return value
4. Must have `else` when using `if` as an expression
5. Smart casts work after null checks in `if`
