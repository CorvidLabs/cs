---
title: Throwing Functions
order: 1
estimatedMinutes: 16
---

# Throwing Functions

Swift uses a powerful error handling model based on throwing, catching, and propagating errors. Functions that can fail are marked with `throws` to signal that they may throw an error.

## Defining Error Types

Errors conform to the `Error` protocol:

```swift
public enum NetworkError: Error {
    case noConnection
    case timeout
    case invalidURL
    case serverError(code: Int)
}

public enum ValidationError: Error {
    case emptyInput
    case invalidFormat
    case tooShort(minimum: Int)
    case tooLong(maximum: Int)
}
```

## Adding Error Descriptions

Implement `LocalizedError` for user-friendly messages:

```swift
public enum FileError: Error, LocalizedError {
    case notFound(filename: String)
    case permissionDenied
    case corrupted

    public var errorDescription: String? {
        switch self {
        case .notFound(let filename):
            return "File '\(filename)' was not found"
        case .permissionDenied:
            return "Permission denied"
        case .corrupted:
            return "The file is corrupted"
        }
    }
}
```

## Throwing Functions

Mark functions that can throw with `throws`:

```swift
public func divide(_ numerator: Int, by denominator: Int) throws -> Int {
    guard denominator != 0 else {
        throw MathError.divisionByZero
    }
    return numerator / denominator
}

public enum MathError: Error {
    case divisionByZero
    case negativeSquareRoot
    case overflow
}
```

## Calling Throwing Functions

Use `try` when calling throwing functions:

```swift
// Must be in a do-catch block or another throwing function
public func performDivision() {
    do {
        let result = try divide(10, by: 2)
        print("Result: \(result)")
    } catch {
        print("Error: \(error)")
    }
}
```

## Propagating Errors

Let errors propagate by making the calling function throw:

```swift
public func calculateAverage(_ numbers: [Int]) throws -> Double {
    guard !numbers.isEmpty else {
        throw CalculationError.emptyInput
    }

    let sum = numbers.reduce(0, +)
    let count = try divide(sum, by: numbers.count)  // Propagates errors
    return Double(count)
}

public enum CalculationError: Error {
    case emptyInput
    case overflow
}
```

## try? - Converting to Optional

Use `try?` to convert the result to an optional:

```swift
let result = try? divide(10, by: 0)  // nil
let success = try? divide(10, by: 2)  // Optional(5)

// Useful with optional binding
if let value = try? divide(100, by: 5) {
    print("Got value: \(value)")
}

// With nil-coalescing
let safeResult = (try? divide(10, by: 0)) ?? 0
```

## try! - Forced Try

Use `try!` when you're certain no error will occur (avoid in production):

```swift
// Only use when failure is impossible
let definiteResult = try! divide(10, by: 2)  // 5

// Crashes if error is thrown
// let crash = try! divide(10, by: 0)  // Fatal error!
```

Warning: Never use `try!` with user input or external data.

## Throwing Initializers

Initializers can throw:

```swift
public struct Temperature {
    public let celsius: Double

    public init(celsius: Double) throws {
        guard celsius >= -273.15 else {
            throw TemperatureError.belowAbsoluteZero
        }
        self.celsius = celsius
    }

    public init(fahrenheit: Double) throws {
        let celsius = (fahrenheit - 32) * 5 / 9
        try self.init(celsius: celsius)
    }
}

public enum TemperatureError: Error {
    case belowAbsoluteZero
}

// Usage
do {
    let temp = try Temperature(celsius: 25)
    print(temp.celsius)
} catch {
    print("Invalid temperature")
}
```

## Throwing Closures

Closures can be marked as throwing:

```swift
public func withRetry<Output>(
    maxAttempts: Int,
    operation: () throws -> Output
) throws -> Output {
    var lastError: Error?

    for _ in 1...maxAttempts {
        do {
            return try operation()
        } catch {
            lastError = error
        }
    }

    throw lastError!
}

// Usage
let result = try withRetry(maxAttempts: 3) {
    try fetchData()
}
```

## Rethrows

Use `rethrows` when a function only throws if its closure parameter throws:

```swift
public func transform<Input, Output>(
    _ input: Input,
    using closure: (Input) throws -> Output
) rethrows -> Output {
    try closure(input)
}

// No try needed when closure doesn't throw
let doubled = transform(5) { $0 * 2 }

// Try needed when closure throws
let validated = try transform("test") { input throws -> String in
    guard !input.isEmpty else {
        throw ValidationError.emptyInput
    }
    return input.uppercased()
}
```

## Typed Throws (Swift 6+)

Swift 6 introduces typed throws for more precise error types:

```swift
// Typed throws - specifies exact error type
public func parseNumber(_ string: String) throws(ParseError) -> Int {
    guard let number = Int(string) else {
        throw ParseError.invalidFormat
    }
    return number
}

public enum ParseError: Error {
    case invalidFormat
    case overflow
}

// Caller knows exactly what errors to handle
do {
    let num = try parseNumber("42")
} catch {
    // error is definitely ParseError, not just any Error
    switch error {
    case .invalidFormat:
        print("Invalid format")
    case .overflow:
        print("Number too large")
    }
}
```

## Error Chaining

Create descriptive error chains:

```swift
public struct ConfigurationError: Error {
    public let underlying: Error
    public let context: String
}

public func loadConfiguration() throws -> Configuration {
    do {
        let data = try readFile("config.json")
        return try parseConfig(data)
    } catch {
        throw ConfigurationError(
            underlying: error,
            context: "Failed to load configuration"
        )
    }
}
```

## Key Takeaways

1. Errors conform to the `Error` protocol
2. Use `throws` to mark functions that can throw
3. Call throwing functions with `try`
4. `try?` converts to optional (nil on error)
5. `try!` force-unwraps (crashes on error) - avoid in production
6. Errors propagate automatically in throwing functions
7. Use `rethrows` when only throwing if a closure throws
8. Implement `LocalizedError` for user-friendly messages

In the next lesson, we'll learn about handling errors with do-catch blocks.
