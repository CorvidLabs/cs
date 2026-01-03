---
title: Defining Error Types
order: 1
estimatedMinutes: 12
---

# Defining Error Types in Swift

Swift provides a robust error handling model that helps you write safe, predictable code. Let's start by learning how to define your own error types.

## The Error Protocol

In Swift, errors are represented by types that conform to the `Error` protocol:

```swift
protocol Error { }
```

The protocol is empty - it's a marker that tells Swift this type represents an error condition.

## Creating Custom Errors with Enums

Enums are the most common way to define errors because they can enumerate all possible failure cases:

```swift
enum NetworkError: Error {
    case noConnection
    case timeout
    case invalidURL
    case serverError(statusCode: Int)
}
```

Each case represents a specific error condition. You can include associated values for additional context.

## Error with Associated Values

Associated values provide details about what went wrong:

```swift
enum ValidationError: Error {
    case tooShort(minimum: Int)
    case tooLong(maximum: Int)
    case invalidCharacter(Character)
    case emptyInput
}
```

This allows error handlers to know exactly what the problem was:

```swift
// Later, when handling:
// case .tooShort(let min):
//     print("Input must be at least \(min) characters")
```

## LocalizedError Protocol

For user-facing error messages, conform to `LocalizedError`:

```swift
enum FileError: Error, LocalizedError {
    case notFound(filename: String)
    case permissionDenied
    case corrupted

    var errorDescription: String? {
        switch self {
        case .notFound(let filename):
            return "The file '\(filename)' could not be found."
        case .permissionDenied:
            return "You don't have permission to access this file."
        case .corrupted:
            return "The file appears to be corrupted."
        }
    }
}
```

The `errorDescription` property provides a human-readable message.

## Additional LocalizedError Properties

`LocalizedError` has more optional properties:

```swift
enum PaymentError: Error, LocalizedError {
    case insufficientFunds(required: Double, available: Double)
    case cardDeclined
    case expired

    var errorDescription: String? {
        switch self {
        case .insufficientFunds(let required, let available):
            return "Insufficient funds: need $\(required), have $\(available)"
        case .cardDeclined:
            return "Your card was declined."
        case .expired:
            return "Your card has expired."
        }
    }

    var failureReason: String? {
        switch self {
        case .insufficientFunds:
            return "Account balance too low"
        case .cardDeclined:
            return "Bank rejected transaction"
        case .expired:
            return "Card expiration date passed"
        }
    }

    var recoverySuggestion: String? {
        switch self {
        case .insufficientFunds:
            return "Add funds to your account or use a different payment method."
        case .cardDeclined:
            return "Contact your bank or try a different card."
        case .expired:
            return "Update your card information."
        }
    }
}
```

## Struct-Based Errors

For complex errors with multiple properties, use structs:

```swift
struct APIError: Error, LocalizedError {
    let statusCode: Int
    let message: String
    let endpoint: String
    let timestamp: Date

    var errorDescription: String? {
        "API Error \(statusCode) at \(endpoint): \(message)"
    }
}
```

## Sendable Errors for Concurrency

When errors cross concurrency boundaries, they should be `Sendable`:

```swift
enum DatabaseError: Error, Sendable {
    case connectionFailed
    case queryFailed(String)
    case recordNotFound(id: String)
}
```

Enums with `Sendable` associated values automatically conform to `Sendable`.

## Organizing Related Errors

Group related errors in nested types:

```swift
enum AppError: Error {
    case network(NetworkError)
    case validation(ValidationError)
    case storage(StorageError)

    enum NetworkError: Error {
        case noConnection
        case timeout
    }

    enum ValidationError: Error {
        case invalidEmail
        case weakPassword
    }

    enum StorageError: Error {
        case diskFull
        case writeProtected
    }
}
```

## Key Takeaways

1. Conform to `Error` protocol to create error types
2. Enums with cases are ideal for defining error conditions
3. Use associated values for error context
4. Conform to `LocalizedError` for user-friendly messages
5. Mark errors as `Sendable` for concurrent code
6. Group related errors with nested types

Next, we'll learn how to throw these errors from functions.
