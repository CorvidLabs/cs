---
title: When Expressions
order: 2
estimatedMinutes: 15
---

# When Expressions

`when` is Kotlin's powerful replacement for switch statements. Like `if`, it's an expression that returns a value.

## Basic When

```kotlin
val day = 3

when (day) {
    1 -> println("Monday")
    2 -> println("Tuesday")
    3 -> println("Wednesday")
    4 -> println("Thursday")
    5 -> println("Friday")
    6, 7 -> println("Weekend!")
    else -> println("Invalid day")
}
```

## When as an Expression

```kotlin
val day = 3

val dayName = when (day) {
    1 -> "Monday"
    2 -> "Tuesday"
    3 -> "Wednesday"
    4 -> "Thursday"
    5 -> "Friday"
    6, 7 -> "Weekend"
    else -> "Invalid"
}

println(dayName)  // Wednesday
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `switch day { case 1: ... }` | `when (day) { 1 -> ... }` |
| `case 1, 2:` | `1, 2 ->` |
| `default:` | `else ->` |
| Requires explicit `break` prevention | No fallthrough by default |

## Multiple Values Per Branch

```kotlin
val char = 'a'

val type = when (char) {
    'a', 'e', 'i', 'o', 'u' -> "vowel"
    in 'a'..'z' -> "consonant"
    else -> "not a letter"
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
    else -> "F"
}
```

## Type Checking

```kotlin
fun describe(obj: Any): String = when (obj) {
    is String -> "String of length ${obj.length}"
    is Int -> "Integer: $obj"
    is List<*> -> "List with ${obj.size} elements"
    else -> "Unknown type"
}
```

Note: Smart cast works here - `obj.length` is valid because we checked `is String`.

## When Without Argument

Use `when` as a cleaner if-else chain:

```kotlin
val temperature = 25

val description = when {
    temperature < 0 -> "Freezing"
    temperature < 10 -> "Cold"
    temperature < 20 -> "Cool"
    temperature < 30 -> "Warm"
    else -> "Hot"
}
```

## Blocks in When Branches

```kotlin
val result = when (value) {
    1 -> {
        println("Processing one...")
        "one"  // Last expression is returned
    }
    2 -> {
        println("Processing two...")
        "two"
    }
    else -> "other"
}
```

## Exhaustive When

When used as an expression, `when` must be exhaustive:

```kotlin
enum class Color { RED, GREEN, BLUE }

val color = Color.RED

// Must handle all cases or have else
val hex = when (color) {
    Color.RED -> "#FF0000"
    Color.GREEN -> "#00FF00"
    Color.BLUE -> "#0000FF"
    // No else needed - all enum values covered
}
```

## Capturing the Subject

Kotlin 1.3+ allows capturing the when subject:

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success -> response.body
        is Error -> throw response.exception
    }
```

## Try It Yourself

1. Create a when expression that converts numbers 1-12 to month names
2. Use ranges to categorize ages
3. Use when without an argument to check multiple conditions
4. Create an enum and use exhaustive when

## Key Takeaways

1. `when` replaces switch statements
2. No fallthrough - each branch is independent
3. Combine values with commas: `1, 2, 3 ->`
4. Use `in` for ranges: `in 1..10 ->`
5. Use `is` for type checking with smart casts
6. When without argument = cleaner if-else chain
7. Must be exhaustive when used as expression
