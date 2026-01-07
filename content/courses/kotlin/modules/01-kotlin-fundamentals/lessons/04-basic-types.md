---
title: Basic Types
order: 4
estimatedMinutes: 15
---

# Basic Types in Kotlin

Kotlin has a set of built-in types for representing numbers, characters, booleans, and text. Unlike Java, there's no distinction between primitive and wrapper types in your code.

## Numbers

### Integers

| Type | Size | Range |
|------|------|-------|
| Byte | 8 bits | -128 to 127 |
| Short | 16 bits | -32768 to 32767 |
| Int | 32 bits | -2^31 to 2^31-1 |
| Long | 64 bits | -2^63 to 2^63-1 |

```kotlin
val byte: Byte = 127
val short: Short = 32767
val int: Int = 2147483647
val long: Long = 9223372036854775807L
```

### Floating-Point

| Type | Size | Precision |
|------|------|-----------|
| Float | 32 bits | ~6-7 decimal digits |
| Double | 64 bits | ~15-16 decimal digits |

```kotlin
val float: Float = 3.14f
val double: Double = 3.14159265358979
```

### Number Literals

```kotlin
val decimal = 1000000
val withUnderscores = 1_000_000  // Same as above, more readable
val hex = 0xFF                   // Hexadecimal
val binary = 0b1010              // Binary
```

## Booleans

Only two values: `true` and `false`

```kotlin
val isKotlinFun = true
val isJavaRequired = false

// Boolean operations
val result = isKotlinFun && !isJavaRequired  // true
```

## Characters

Single characters use single quotes:

```kotlin
val letter: Char = 'A'
val digit: Char = '1'
val escape: Char = '\n'  // Newline
```

Note: Unlike some languages, Char is NOT a number in Kotlin:

```kotlin
val char: Char = 'A'
// val number: Int = char  // Error!
val number: Int = char.code  // Correct: gets ASCII value (65)
```

## Strings

Text enclosed in double quotes:

```kotlin
val greeting = "Hello, Kotlin!"
val multiline = """
    This is a
    multiline string
    with preserved formatting
""".trimIndent()
```

### String Operations

```kotlin
val name = "Kotlin"

println(name.length)           // 6
println(name.uppercase())      // KOTLIN
println(name.lowercase())      // kotlin
println(name[0])               // K (first character)
println(name.first())          // K
println(name.last())           // n
```

### String Templates (Recap)

```kotlin
val language = "Kotlin"
val year = 2011
println("$language was created in $year")
println("Length: ${language.length}")
```

## Arrays

Fixed-size collections:

```kotlin
val numbers = arrayOf(1, 2, 3, 4, 5)
val strings = arrayOf("a", "b", "c")

println(numbers[0])  // 1
numbers[0] = 10      // Arrays are mutable

// Specialized arrays for primitives (better performance)
val intArray = intArrayOf(1, 2, 3)
val doubleArray = doubleArrayOf(1.0, 2.0, 3.0)
```

## Comparing to Swift

| Concept | Swift | Kotlin |
|---------|-------|--------|
| Integer | `Int` | `Int` |
| Long | `Int64` | `Long` |
| Float | `Float` | `Float` (needs `f` suffix) |
| Double | `Double` | `Double` |
| Boolean | `Bool` | `Boolean` |
| Character | `Character` | `Char` |
| String | `String` | `String` |
| Array | `[Int]` or `Array<Int>` | `Array<Int>` or `IntArray` |
| Multiline | `"""..."""` | `"""..."""` |

## Type Conversions

Kotlin doesn't implicitly convert between number types:

```kotlin
val int: Int = 42
// val long: Long = int  // Error!
val long: Long = int.toLong()  // Correct

// Conversion methods
val i = 42
i.toByte()
i.toShort()
i.toLong()
i.toFloat()
i.toDouble()
i.toChar()
```

## The Any Type

`Any` is the root of Kotlin's type hierarchy (like `Any` in Swift):

```kotlin
val anything: Any = "Hello"
val alsoAnything: Any = 42
```

## Try It Yourself

1. Create variables of each basic type
2. Use underscores in a large number for readability
3. Create a multiline string with `"""`
4. Convert an Int to a Long using `.toLong()`
5. Access characters in a string using index notation

## Key Takeaways

1. Kotlin has `Byte`, `Short`, `Int`, `Long` for integers
2. `Float` needs `f` suffix, `Double` is the default
3. `Char` uses single quotes, `String` uses double quotes
4. No implicit number conversions - use `.toX()` methods
5. Use `_` in number literals for readability
6. Triple quotes `"""` for multiline strings
