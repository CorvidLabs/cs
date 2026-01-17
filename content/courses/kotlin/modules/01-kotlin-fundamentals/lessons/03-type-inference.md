---
title: Type Inference
order: 3
estimatedMinutes: 10
---

# Type Inference

Kotlin is statically typed, meaning every variable has a type known at compile time. However, you don't always have to write the type explicitly - Kotlin can infer it.

## How Inference Works

The compiler looks at the value and determines the type:

```kotlin
val message = "Hello"     // Inferred as String
val count = 42            // Inferred as Int
val price = 19.99         // Inferred as Double
val isActive = true       // Inferred as Boolean
```

## When to Use Explicit Types

### 1. When the type isn't obvious

```kotlin
// Unclear what type this returns
val result = calculateSomething()

// Better: explicit type shows intent
val result: Double = calculateSomething()
```

### 2. When you want a different type than inferred

```kotlin
val number = 42       // Inferred as Int
val number: Long = 42 // Explicit Long
val number: Double = 42.0 // Explicit Double
```

### 3. When declaring without initializing

```kotlin
val name: String  // Must declare type
name = "Kotlin"   // Assign later
```

## Number Type Inference

Kotlin infers specific number types:

```kotlin
val int = 42            // Int
val long = 42L          // Long (note the L suffix)
val double = 42.0       // Double
val float = 42.0f       // Float (note the f suffix)
```

## Comparing to Swift

Both languages handle inference similarly:

| Scenario | Swift | Kotlin |
|----------|-------|--------|
| Integer | `let x = 42` → Int | `val x = 42` → Int |
| Decimal | `let x = 42.0` → Double | `val x = 42.0` → Double |
| Explicit | `let x: Float = 42.0` | `val x: Float = 42.0f` |

Key difference: Kotlin requires `f` suffix for Float literals.

## The Nothing Type

Kotlin has a special `Nothing` type for functions that never return:

```kotlin
fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
}
```

## Type Checking with is

Check types at runtime with `is`:

```kotlin
val value: Any = "Hello"

if (value is String) {
    // Smart cast: value is automatically String here
    println(value.length)
}
```

## Smart Casts

After a type check, Kotlin automatically casts:

```kotlin
fun printLength(obj: Any) {
    if (obj is String) {
        // No explicit cast needed!
        println(obj.length)
    }
}
```

### Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `if let str = obj as? String` | `if (obj is String)` |
| `str.count` (inside if-let) | `obj.length` (smart cast) |

## Try It Yourself

1. Create variables and let Kotlin infer their types
2. Create a Long using the `L` suffix
3. Use `is` to check if a variable is a String
4. Try creating a variable without initialization (you'll need an explicit type)

## Key Takeaways

1. Kotlin infers types from values
2. Use explicit types when clarity helps
3. Number literals: `L` for Long, `f` for Float
4. `is` checks types at runtime
5. Smart casts eliminate manual casting after type checks
