---
title: Closures
order: 2
estimatedMinutes: 20
---

# Closures

Closures are self-contained blocks of code that can be passed around and used in your code. They're similar to functions but can capture and store references to variables from their surrounding context.

## Closure Syntax

The full closure syntax:

```swift
{ (parameters) -> ReturnType in
    // code
}
```

## Basic Closure Example

```swift
let greet = { (name: String) -> String in
    return "Hello, \(name)!"
}

let message = greet("Alice")
print(message)  // Prints: Hello, Alice!
```

## Closures as Function Parameters

Closures are commonly passed to functions:

```swift
let numbers = [5, 2, 8, 1, 9, 3]

// Using a closure with sorted()
let sortedNumbers = numbers.sorted(by: { (a: Int, b: Int) -> Bool in
    return a < b
})
print(sortedNumbers)  // Prints: [1, 2, 3, 5, 8, 9]
```

## Inferring Type from Context

When the closure's type can be inferred, you can omit it:

```swift
let numbers = [5, 2, 8, 1, 9, 3]

// Type inference: Swift knows we need (Int, Int) -> Bool
let sortedNumbers = numbers.sorted(by: { a, b in
    return a < b
})
```

## Implicit Returns

Single-expression closures can omit `return`:

```swift
let numbers = [5, 2, 8, 1, 9, 3]

let sortedNumbers = numbers.sorted(by: { a, b in a < b })
```

## Shorthand Argument Names

Use `$0`, `$1`, `$2`, etc. for positional arguments:

```swift
let numbers = [5, 2, 8, 1, 9, 3]

let sortedNumbers = numbers.sorted(by: { $0 < $1 })
```

## Operator Methods

When an operator matches the closure signature:

```swift
let numbers = [5, 2, 8, 1, 9, 3]

let sortedNumbers = numbers.sorted(by: <)
print(sortedNumbers)  // Prints: [1, 2, 3, 5, 8, 9]
```

## Trailing Closure Syntax

When a closure is the last argument, you can write it after the parentheses:

```swift
let numbers = [5, 2, 8, 1, 9, 3]

// Trailing closure syntax
let sortedNumbers = numbers.sorted { $0 < $1 }

// Multiple trailing closures
public func fetchData(
    onSuccess: (String) -> Void,
    onFailure: (Error) -> Void
) {
    // Implementation
}

fetchData { data in
    print("Success: \(data)")
} onFailure: { error in
    print("Error: \(error)")
}
```

## Map, Filter, and Reduce

Closures shine with collection operations:

### Map - Transform Elements

```swift
let numbers = [1, 2, 3, 4, 5]

let doubled = numbers.map { $0 * 2 }
print(doubled)  // Prints: [2, 4, 6, 8, 10]

let strings = numbers.map { "Number: \($0)" }
print(strings)  // Prints: ["Number: 1", "Number: 2", ...]
```

### Filter - Select Elements

```swift
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

let evens = numbers.filter { $0 % 2 == 0 }
print(evens)  // Prints: [2, 4, 6, 8, 10]

let greaterThanFive = numbers.filter { $0 > 5 }
print(greaterThanFive)  // Prints: [6, 7, 8, 9, 10]
```

### Reduce - Combine Elements

```swift
let numbers = [1, 2, 3, 4, 5]

let sum = numbers.reduce(0) { $0 + $1 }
print(sum)  // Prints: 15

// Even shorter with operator
let product = numbers.reduce(1, *)
print(product)  // Prints: 120
```

### Chaining Operations

```swift
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

let result = numbers
    .filter { $0 % 2 == 0 }     // Keep evens: [2, 4, 6, 8, 10]
    .map { $0 * $0 }             // Square them: [4, 16, 36, 64, 100]
    .reduce(0, +)                // Sum them: 220

print(result)  // Prints: 220
```

## CompactMap - Transform and Filter Nil

```swift
let strings = ["1", "2", "three", "4", "five"]

// compactMap unwraps optionals and filters out nil
let numbers = strings.compactMap { Int($0) }
print(numbers)  // Prints: [1, 2, 4]
```

## FlatMap - Flatten Nested Collections

```swift
let nestedArrays = [[1, 2, 3], [4, 5], [6, 7, 8, 9]]

let flattened = nestedArrays.flatMap { $0 }
print(flattened)  // Prints: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## ForEach - Iterate with Side Effects

```swift
let names = ["Alice", "Bob", "Charlie"]

names.forEach { name in
    print("Hello, \(name)!")
}
// Prints:
// Hello, Alice!
// Hello, Bob!
// Hello, Charlie!
```

Note: Unlike `for-in`, you can't use `break` or `continue` in `forEach`.

## Closures Capture Values

Closures capture and store references to variables:

```swift
public func makeCounter() -> () -> Int {
    var count = 0

    let counter: () -> Int = {
        count += 1
        return count
    }

    return counter
}

let counter = makeCounter()
print(counter())  // Prints: 1
print(counter())  // Prints: 2
print(counter())  // Prints: 3

// Each counter is independent
let anotherCounter = makeCounter()
print(anotherCounter())  // Prints: 1
```

## Storing Closures

Closures can be stored in properties:

```swift
public struct Button {
    public let title: String
    public var onTap: (() -> Void)?

    public init(title: String, onTap: (() -> Void)? = nil) {
        self.title = title
        self.onTap = onTap
    }
}

var button = Button(title: "Submit")
button.onTap = {
    print("Button tapped!")
}

button.onTap?()  // Prints: Button tapped!
```

## Closures Are Reference Types

Closures are reference types - assigning to another variable shares the same closure:

```swift
let incrementer = makeCounter()
let alsoIncrementer = incrementer

print(incrementer())      // Prints: 1
print(alsoIncrementer())  // Prints: 2
print(incrementer())      // Prints: 3
```

## Autoclosures

The `@autoclosure` attribute wraps an expression in a closure:

```swift
public func log(
    _ message: @autoclosure () -> String,
    level: String = "INFO"
) {
    print("[\(level)] \(message())")
}

// Call without braces - expression is auto-wrapped
log("Application started")
log("Error occurred", level: "ERROR")

// Useful for expensive operations - only evaluated if needed
public func assert(_ condition: @autoclosure () -> Bool, _ message: String) {
    #if DEBUG
    if !condition() {
        print("Assertion failed: \(message)")
    }
    #endif
}
```

## Key Takeaways

1. Closures are anonymous functions: `{ (params) -> Return in code }`
2. Swift infers closure types from context
3. Use shorthand: `$0`, `$1` for positional parameters
4. Trailing closure syntax improves readability
5. `map`, `filter`, `reduce` are powerful with closures
6. `compactMap` filters nil values, `flatMap` flattens collections
7. Closures capture values from their surrounding scope
8. Closures are reference types - they share state when copied
9. `@autoclosure` delays evaluation until needed

In the next lesson, we'll learn about capture lists and avoiding memory issues.
