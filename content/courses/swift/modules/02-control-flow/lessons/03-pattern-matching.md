---
title: Pattern Matching
order: 3
estimatedMinutes: 18
---

# Pattern Matching

Pattern matching is one of Swift's most powerful features. It allows you to check values against patterns, extract data, and make complex comparisons concise and readable.

## What is Pattern Matching?

Pattern matching compares a value against a pattern and optionally binds matched values to variables. You've already seen basic patterns in switch statements - now let's explore the full power of Swift's pattern matching.

## Types of Patterns

Swift supports several pattern types:

| Pattern Type       | Description                          | Example                      |
|--------------------|--------------------------------------|------------------------------|
| Wildcard           | Matches any value                    | `_`                          |
| Identifier         | Binds to a variable                  | `let x`                      |
| Value-binding      | Extracts values                      | `case let (x, y)`            |
| Tuple              | Matches tuple structure              | `(0, 0)`                     |
| Enum case          | Matches enum cases                   | `.success(let data)`         |
| Optional           | Matches optional values              | `let x?`                     |
| Type-casting       | Checks and casts types               | `is String`, `as String`     |
| Expression         | Uses ~= operator                     | `0..<10`                     |

## Wildcard Pattern

The underscore `_` matches anything and discards the value:

```swift
let coordinates = (10, 20, 30)

switch coordinates {
case (_, 0, 0):
    print("On x-axis")
case (0, _, 0):
    print("On y-axis")
case (0, 0, _):
    print("On z-axis")
case (_, _, _):
    print("Somewhere in 3D space")
}
```

## Value-Binding Pattern

Bind matched values to constants or variables:

```swift
let response = (200, "OK", ["user": "alice"])

switch response {
case (200, let message, let data):
    print("Success: \(message), data: \(data)")
case (let code, let message, _) where code >= 400:
    print("Error \(code): \(message)")
case (let code, let message, _):
    print("Response \(code): \(message)")
}
```

Use `var` to make bindings mutable:

```swift
let point = (3, 4)

switch point {
case var (x, y):
    x += 1
    y += 1
    print("Moved to (\(x), \(y))")
}
```

## Tuple Pattern

Match tuple structure and values:

```swift
let httpStatus = (code: 404, message: "Not Found")

switch httpStatus {
case (200, _):
    print("OK")
case (201, _):
    print("Created")
case (400..<500, let message):
    print("Client error: \(message)")
case (500..<600, let message):
    print("Server error: \(message)")
default:
    print("Unknown status")
}
```

## Optional Pattern

Match optional values elegantly:

```swift
let numbers: [Int?] = [1, nil, 3, nil, 5]

for case let number? in numbers {
    print(number)  // Prints 1, 3, 5 (skips nil values)
}
```

This is equivalent to:

```swift
for number in numbers {
    if let number = number {
        print(number)
    }
}
```

## Enum Case Pattern

Match enum cases and extract associated values:

```swift
public enum Result<Success, Failure> {
    case success(Success)
    case failure(Failure)
}

let result: Result<String, Error> = .success("Data loaded")

switch result {
case .success(let data):
    print("Got data: \(data)")
case .failure(let error):
    print("Failed: \(error)")
}
```

## Type-Casting Patterns

Check types with `is` and cast with `as`:

```swift
let values: [Any] = [1, "hello", 3.14, true, [1, 2, 3]]

for value in values {
    switch value {
    case is Int:
        print("Integer")
    case let string as String:
        print("String: \(string)")
    case let double as Double:
        print("Double: \(double)")
    case is Bool:
        print("Boolean")
    case let array as [Int]:
        print("Int array with \(array.count) elements")
    default:
        print("Unknown type")
    }
}
```

## Expression Pattern and the ~= Operator

The expression pattern uses the `~=` operator for matching. Swift provides default implementations for ranges and equality:

```swift
let age = 25

switch age {
case 0..<13:
    print("Child")
case 13..<20:
    print("Teenager")
case 20..<65:
    print("Adult")
default:
    print("Senior")
}
```

You can define custom `~=` operators:

```swift
public func ~= (pattern: String, value: Int) -> Bool {
    return pattern == String(value)
}

let number = 42

switch number {
case "42":
    print("The answer!")
default:
    print("Some other number")
}
```

## Pattern Matching in If Statements

Use pattern matching in `if case`:

```swift
public enum Media {
    case book(title: String, author: String)
    case movie(title: String, director: String)
    case music(title: String, artist: String)
}

let item = Media.book(title: "1984", author: "George Orwell")

if case .book(let title, let author) = item {
    print("Book: \(title) by \(author)")
}

// With where clause
if case .book(let title, _) = item, title.count > 5 {
    print("Long book title: \(title)")
}
```

## Pattern Matching in For Loops

Use `case` in for loops to filter:

```swift
public enum Task {
    case pending(String)
    case completed(String)
    case cancelled(String)
}

let tasks: [Task] = [
    .pending("Write code"),
    .completed("Review PR"),
    .pending("Deploy app"),
    .cancelled("Meeting"),
    .completed("Send email")
]

// Only iterate over completed tasks
for case .completed(let name) in tasks {
    print("Done: \(name)")
}
// Prints:
// Done: Review PR
// Done: Send email
```

## Pattern Matching with Optionals in Loops

```swift
let scores: [String: Int?] = [
    "Alice": 95,
    "Bob": nil,
    "Charlie": 88,
    "David": nil
]

// Only process non-nil scores
for (name, score) in scores {
    if case let actualScore? = score {
        print("\(name): \(actualScore)")
    }
}
```

## Combining Patterns

Combine multiple patterns with commas:

```swift
let coordinate = (x: 5, y: 0, z: 0)

switch coordinate {
case (0, 0, 0):
    print("Origin")
case (let x, 0, 0), (0, let x, 0), (0, 0, let x):
    print("On an axis at \(x)")
case let (x, y, z):
    print("Point at (\(x), \(y), \(z))")
}
```

## Pattern Matching in Guard

```swift
public func processResponse(_ response: Result<String, Error>) {
    guard case .success(let data) = response else {
        print("Failed to get data")
        return
    }

    print("Processing: \(data)")
}
```

## Practical Example: Parsing Commands

```swift
public enum Command {
    case move(direction: String, distance: Int)
    case rotate(degrees: Int)
    case scale(factor: Double)
    case reset
}

public func executeCommand(_ command: Command) {
    switch command {
    case .move(let direction, let distance) where distance > 0:
        print("Moving \(direction) by \(distance) units")
    case .move(_, let distance) where distance <= 0:
        print("Invalid move distance: \(distance)")
    case .rotate(let degrees) where degrees % 90 == 0:
        print("Rotating by \(degrees) degrees (right angle)")
    case .rotate(let degrees):
        print("Rotating by \(degrees) degrees")
    case .scale(let factor) where factor > 0:
        print("Scaling by factor \(factor)")
    case .scale(_):
        print("Invalid scale factor")
    case .reset:
        print("Resetting to default state")
    }
}
```

## Key Takeaways

1. Pattern matching works in switch, if case, guard case, and for case
2. Use `_` to ignore values, `let x` to bind values
3. Optional patterns `let x?` match and unwrap optionals
4. Type-casting patterns use `is` and `as` for type checks
5. Expression patterns use `~=` operator (customizable)
6. Combine patterns with commas for compound matching
7. Patterns make code more expressive and safer

In the next lesson, we'll explore `where` clauses for adding conditions to patterns.
