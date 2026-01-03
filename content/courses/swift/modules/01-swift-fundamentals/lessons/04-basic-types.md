---
title: Basic Types
order: 4
estimatedMinutes: 15
---

# Basic Types

Swift provides several fundamental types for working with numbers, text, and logical values. Understanding these types is essential for writing Swift code.

## Integers (Int)

Integers are whole numbers without decimal points:

```swift
let age = 25
let temperature = -10
let population = 8_000_000  // Underscores improve readability
```

Swift's `Int` type matches your platform's native word size (64-bit on modern systems).

### Integer Operations

```swift
let sum = 10 + 5       // 15
let difference = 10 - 5 // 5
let product = 10 * 5    // 50
let quotient = 10 / 3   // 3 (integer division truncates)
let remainder = 10 % 3  // 1 (modulo operator)
```

## Floating-Point Numbers (Double)

Use `Double` for numbers with decimal points:

```swift
let pi = 3.14159
let gravity = 9.81
let percentage = 0.75
```

Swift also has `Float` (32-bit), but `Double` (64-bit) is preferred for its precision:

```swift
let preciseValue: Double = 3.141592653589793
let lessPreise: Float = 3.1415927  // Less decimal precision
```

### Floating-Point Operations

```swift
let result = 10.0 / 3.0   // 3.3333...
let power = 2.0 * 2.0     // 4.0
```

## Strings (String)

Strings are sequences of characters:

```swift
let greeting = "Hello, World!"
let empty = ""
let multiline = """
    This is a
    multiline string
    in Swift.
    """
```

### String Operations

```swift
let firstName = "John"
let lastName = "Doe"

// Concatenation
let fullName = firstName + " " + lastName  // "John Doe"

// Interpolation (preferred)
let message = "Hello, \(firstName) \(lastName)!"

// Properties and methods
let length = greeting.count        // 13
let upper = greeting.uppercased()  // "HELLO, WORLD!"
let lower = greeting.lowercased()  // "hello, world!"
let hasHello = greeting.contains("Hello")  // true
```

### String Comparisons

```swift
let a = "apple"
let b = "Apple"

print(a == b)   // false (case-sensitive)
print(a.lowercased() == b.lowercased())  // true
```

## Booleans (Bool)

Booleans represent true or false:

```swift
let isLoggedIn = true
let hasPermission = false
```

### Boolean Operations

```swift
let a = true
let b = false

let and = a && b   // false (both must be true)
let or = a || b    // true (at least one true)
let not = !a       // false (inverts the value)
```

### Comparisons Return Booleans

```swift
let age = 25
let isAdult = age >= 18      // true
let isTeenager = age < 20    // false
let isExactly25 = age == 25  // true
let isNot25 = age != 25      // false
```

## Type Relationships

Mixing types requires explicit conversion:

```swift
let intValue = 10
let doubleValue = 3.5

// Error: Cannot add Int and Double directly
// let result = intValue + doubleValue

// Solution: Convert to the same type
let result = Double(intValue) + doubleValue  // 13.5
```

## Numeric Literals

Swift supports different number formats:

```swift
let decimal = 17
let binary = 0b10001      // 17 in binary
let octal = 0o21          // 17 in octal
let hexadecimal = 0x11    // 17 in hexadecimal

let million = 1_000_000   // Underscores for readability
let creditCard = 1234_5678_9012_3456
```

## Type Aliases

Create alternative names for existing types:

```swift
typealias AudioSample = UInt16
typealias Velocity = Double

let sample: AudioSample = 44100
let speed: Velocity = 299_792_458
```

## Summary Table

| Type | Description | Example |
|------|-------------|---------|
| `Int` | Whole numbers | `42`, `-17`, `1_000` |
| `Double` | Decimal numbers | `3.14`, `-0.5`, `1.0e8` |
| `String` | Text | `"Hello"`, `""`, `"Swift"` |
| `Bool` | True/False | `true`, `false` |

## Key Takeaways

1. `Int` for whole numbers, `Double` for decimals
2. Prefer `Double` over `Float` for precision
3. Strings use double quotes and support interpolation with `\()`
4. `Bool` has only two values: `true` and `false`
5. Swift requires explicit type conversion between numeric types
6. Use underscores to improve number readability

In the next lesson, we'll learn about optionals - Swift's powerful way of handling missing values.
