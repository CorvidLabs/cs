---
title: Val and Var
order: 2
estimatedMinutes: 12
---

# Constants and Variables

Kotlin distinguishes between values that can change and values that cannot. This distinction helps prevent bugs and makes your code easier to understand.

## val: Read-Only Variables

Use `val` for values that won't change:

```kotlin
val name = "Kotlin"
val year = 2011

// This would cause an error:
// name = "Java"  // Error: Val cannot be reassigned
```

Think of `val` as "value" - once set, it stays that way.

## var: Mutable Variables

Use `var` for values that need to change:

```kotlin
var score = 0
score = 10  // This is fine
score = score + 5  // Now score is 15
```

## Comparing to Swift

The concepts are identical:

| Swift | Kotlin | Meaning |
|-------|--------|---------|
| `let name = "Swift"` | `val name = "Kotlin"` | Immutable |
| `var count = 0` | `var count = 0` | Mutable |

## Best Practice: Prefer val

Always start with `val`. Only use `var` when you actually need to reassign:

```kotlin
// Good: Using val when value doesn't change
val username = "kyntrin"
val maxRetries = 3

// Necessary: Using var when value must change
var attempts = 0
attempts = attempts + 1
```

## Type Declaration

Kotlin infers types, but you can be explicit:

```kotlin
// Inferred types
val message = "Hello"  // String
val count = 42         // Int

// Explicit types
val message: String = "Hello"
val count: Int = 42
```

## Delayed Initialization

Sometimes you can't initialize immediately. Use `lateinit` for `var`:

```kotlin
lateinit var config: String

fun setup() {
    config = "loaded"
}
```

Note: `lateinit` only works with `var` and non-primitive types.

## Compile-Time Constants

For truly constant values known at compile time:

```kotlin
const val PI = 3.14159
const val APP_NAME = "MyApp"
```

`const` must be:
- At the top level or in an `object`
- Only primitive types or String
- No custom getter

## Common Mistakes

### Mistake 1: Using var when val works

```kotlin
// Bad
var name = "Kotlin"  // Never reassigned

// Good
val name = "Kotlin"
```

### Mistake 2: Forgetting val is reference immutability

```kotlin
val numbers = mutableListOf(1, 2, 3)
numbers.add(4)  // This works! The list content can change
// numbers = mutableListOf(5, 6)  // This fails - can't reassign
```

## Try It Yourself

Type these out:

1. Create a `val` for your name and a `var` for your age
2. Try to reassign the `val` and see the error
3. Increment your age using `var`
4. Create an explicit type declaration

## Key Takeaways

1. `val` = read-only (like Swift's `let`)
2. `var` = mutable (like Swift's `var`)
3. Prefer `val` over `var` when possible
4. Type inference works, but explicit types add clarity
5. `const val` for compile-time constants
