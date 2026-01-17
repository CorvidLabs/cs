---
title: Hello, Kotlin!
order: 1
estimatedMinutes: 10
---

# Your First Kotlin Program

Welcome to Kotlin! Created by JetBrains in 2011 and officially supported by Google for Android since 2017, Kotlin is a modern language that runs on the JVM. Let's write your first program.

## The main() Function

Every Kotlin program starts with a `main` function:

```kotlin
fun main() {
    println("Hello, World!")
}
```

When you run this code, you'll see:

```
Hello, World!
```

## What's Happening?

- `fun` declares a **function**
- `main` is the entry point - where your program starts
- `println()` prints text followed by a new line
- `"Hello, World!"` is a **String** - text enclosed in double quotes

## Comparing to Swift

If you know Swift, here's how they compare:

| Swift | Kotlin |
|-------|--------|
| `print("Hello")` | `println("Hello")` |
| No explicit main needed | `fun main()` required |
| `func` keyword | `fun` keyword |

## Running Kotlin

You can run Kotlin several ways:

1. **Online**: [play.kotlinlang.org](https://play.kotlinlang.org)
2. **IntelliJ IDEA**: Create a Kotlin project
3. **Command line**: `kotlinc hello.kt -include-runtime -d hello.jar && java -jar hello.jar`

## print() vs println()

`println()` adds a newline, `print()` doesn't:

```kotlin
fun main() {
    print("Hello, ")
    print("World!")
    println()  // Just adds a newline
    println("New line here")
}
```

Output:
```
Hello, World!
New line here
```

## Comments

Comments explain your code and are ignored when running:

```kotlin
// This is a single-line comment

println("This line runs!")  // Comments can go at the end too

/*
 This is a multi-line comment.
 It can span several lines.
 */
```

## String Templates

Kotlin uses string templates to include values inside strings:

```kotlin
fun main() {
    val name = "Kotlin"
    println("Hello, $name!")
}
```

Output:
```
Hello, Kotlin!
```

For expressions, use curly braces:

```kotlin
fun main() {
    val a = 10
    val b = 20
    println("Sum: ${a + b}")
}
```

Output:
```
Sum: 30
```

### Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `"Hello, \(name)!"` | `"Hello, $name!"` |
| `"Sum: \(a + b)"` | `"Sum: ${a + b}"` |

## Try It Yourself

Type these out (don't copy-paste!):

1. Print your name using string templates
2. Create a multi-line comment explaining what your code does
3. Print the result of multiplying two numbers using `${}`

## Key Takeaways

1. `fun main()` is the entry point of every Kotlin program
2. `println()` displays output with a newline
3. Strings use double quotes only
4. Use `$variable` or `${expression}` for string templates
5. Comments use `//` for single-line or `/* */` for multi-line

You've written your first Kotlin program! In the next lesson, we'll learn about `val` and `var`.
