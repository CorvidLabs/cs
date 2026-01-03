---
title: Type Inference
order: 3
estimatedMinutes: 10
---

# Type Inference

Swift is a **strongly typed** language, meaning every value has a specific type. However, you don't always have to write the type explicitly - Swift can often figure it out.

## What is Type Inference?

When you assign a value, Swift automatically determines its type:

```swift
let message = "Hello"     // Swift infers this is a String
let count = 42            // Swift infers this is an Int
let price = 19.99         // Swift infers this is a Double
let isActive = true       // Swift infers this is a Bool
```

Swift examines the value on the right side and assigns the appropriate type.

## Explicit Type Annotations

You can explicitly specify a type using a colon after the name:

```swift
let message: String = "Hello"
let count: Int = 42
let price: Double = 19.99
let isActive: Bool = true
```

This is called a **type annotation**.

## When to Use Type Annotations

Type annotations are useful in several situations:

### 1. When There's No Initial Value

```swift
var username: String  // Declare now, assign later
// ... some code ...
username = "alice"
```

### 2. When You Want a Specific Type

```swift
// Without annotation: Swift infers Int
let number = 42

// With annotation: explicitly a Double
let preciseNumber: Double = 42  // 42.0
```

### 3. For Clarity in Complex Code

```swift
let timeout: TimeInterval = 30  // TimeInterval is a type alias for Double
```

## Type Safety

Swift prevents you from mixing incompatible types:

```swift
var score: Int = 100
// score = "high"  // Error: Cannot assign String to Int

var name: String = "Swift"
// name = 42  // Error: Cannot assign Int to String
```

This catches errors at compile time, before your code runs.

## Checking Types

You can see a value's type in Xcode by Option-clicking on it, or by deliberately creating an error:

```swift
let mystery = 3.14159
// let test: Int = mystery  // Error reveals: "Cannot convert Double to Int"
```

## Type Conversion

To convert between types, use the type's initializer:

```swift
let intValue = 42
let doubleValue = Double(intValue)  // 42.0

let pi = 3.14159
let rounded = Int(pi)  // 3 (truncates, doesn't round)

let number = 123
let text = String(number)  // "123"
```

Note: Conversions can fail or lose precision:

```swift
let bigNumber: Double = 9999999999999999.5
let asInt = Int(bigNumber)  // May lose precision
```

## Multiple Variables, Same Type

When declaring multiple values of the same type:

```swift
// Type inference for each
let x = 0
let y = 0

// Or with type annotation
let a, b, c: Int
a = 1
b = 2
c = 3
```

## Key Takeaways

1. Swift infers types automatically from assigned values
2. Use type annotations when you need a specific type or have no initial value
3. Swift is type-safe - you cannot mix incompatible types
4. Use type initializers like `Double()`, `Int()`, `String()` to convert between types
5. Prefer letting Swift infer types when the type is obvious

In the next lesson, we'll explore Swift's basic types in detail.
