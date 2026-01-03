---
title: Hello, Swift!
order: 1
estimatedMinutes: 10
---

# Your First Swift Program

Welcome to Swift! Created by Apple in 2014, Swift is a powerful, modern language designed for safety and performance. Let's write your first program.

## The print() Function

Swift's `print()` function displays output to the console:

```swift
print("Hello, World!")
```

When you run this code, you'll see:

```
Hello, World!
```

## What's Happening?

- `print` is a **function** that outputs text to the console
- The parentheses `()` contain what we want to print
- `"Hello, World!"` is a **String** - text enclosed in double quotes
- Swift executes this line and displays the text

## Strings in Swift

Swift uses double quotes for strings. Unlike some languages, single quotes are not valid for strings:

```swift
print("This is a valid string")
// print('This is NOT valid') - would cause an error
```

## Multiple print() Statements

Each `print()` outputs on a new line:

```swift
print("First line")
print("Second line")
print("Third line")
```

Output:
```
First line
Second line
Third line
```

## Comments

Comments explain your code and are ignored when running:

```swift
// This is a single-line comment

print("This line runs!")  // Comments can go at the end too

/*
 This is a multi-line comment.
 It can span several lines.
 */
```

## String Interpolation

Swift has a powerful feature called string interpolation that lets you include values inside strings:

```swift
let name = "Swift"
print("Hello, \(name)!")
```

Output:
```
Hello, Swift!
```

The `\(...)` syntax inserts the value directly into the string.

## Try It Yourself

Experiment with the following:
- Print your name using string interpolation
- Create a multi-line comment explaining what your code does
- Print multiple lines with different messages

## Key Takeaways

1. `print()` displays output to the console
2. Strings use double quotes only (not single quotes)
3. Comments use `//` for single-line or `/* */` for multi-line
4. Use `\(value)` for string interpolation
5. Each `print()` creates a new line

You've written your first Swift program! In the next lesson, we'll learn about constants and variables.
