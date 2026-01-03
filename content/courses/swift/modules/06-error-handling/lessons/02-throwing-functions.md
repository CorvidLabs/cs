---
title: Throwing Functions
order: 2
estimatedMinutes: 15
---

# Throwing Functions

Functions that can fail should communicate that failure clearly. Swift's `throws` keyword marks functions that can throw errors.

## Declaring Throwing Functions

Add `throws` before the return arrow:

```swift
enum DivisionError: Error {
    case divisionByZero
}

func divide(_ a: Double, by b: Double) throws -> Double {
    guard b != 0 else {
        throw DivisionError.divisionByZero
    }
    return a / b
}
```

## The throw Statement

Use `throw` to signal an error:

```swift
enum ValidationError: Error {
    case tooShort(minimum: Int)
    case invalidFormat
}

func validateUsername(_ username: String) throws {
    guard username.count >= 3 else {
        throw ValidationError.tooShort(minimum: 3)
    }

    guard username.allSatisfy({ $0.isLetter || $0.isNumber }) else {
        throw ValidationError.invalidFormat
    }
}
```

Once `throw` executes, the function immediately exits.

## Throwing Initializers

Initializers can also throw:

```swift
struct Email {
    let address: String

    init(_ address: String) throws {
        guard address.contains("@") else {
            throw ValidationError.invalidFormat
        }
        guard address.count >= 5 else {
            throw ValidationError.tooShort(minimum: 5)
        }
        self.address = address
    }
}
```

## Throwing Closures

Closures can be marked as throwing:

```swift
func process(items: [String], using transform: (String) throws -> String) throws -> [String] {
    var results: [String] = []
    for item in items {
        let result = try transform(item)
        results.append(result)
    }
    return results
}
```

## Propagating Errors

When you call a throwing function without handling the error, your function must also be `throws`:

```swift
func createUser(username: String, email: String) throws -> User {
    try validateUsername(username)  // Propagates any error
    let validEmail = try Email(email)  // Propagates any error
    return User(username: username, email: validEmail)
}
```

## Rethrowing Functions

Functions that only throw if their closure argument throws use `rethrows`:

```swift
func retry<T>(times: Int, task: () throws -> T) rethrows -> T {
    var lastError: Error?

    for _ in 0..<times {
        do {
            return try task()
        } catch {
            lastError = error
        }
    }

    throw lastError!
}
```

`rethrows` means:
- If the closure doesn't throw, you can call `retry` without `try`
- If the closure throws, you need `try`

## Throwing vs Optional Return

Consider when to throw vs return optional:

```swift
// Throw when the error matters
func loadConfiguration(from path: String) throws -> Config {
    guard FileManager.default.fileExists(atPath: path) else {
        throw FileError.notFound(path: path)
    }
    // Load and return config
}

// Return optional when absence is normal
func findUser(byId id: String) -> User? {
    users.first { $0.id == id }
}
```

Use throwing when:
- The caller needs to know *why* something failed
- Failure is exceptional, not routine
- Different errors require different handling

## Async Throwing Functions

Async functions can also throw:

```swift
func fetchData(from url: URL) async throws -> Data {
    let (data, response) = try await URLSession.shared.data(from: url)

    guard let httpResponse = response as? HTTPURLResponse else {
        throw NetworkError.invalidResponse
    }

    guard httpResponse.statusCode == 200 else {
        throw NetworkError.serverError(statusCode: httpResponse.statusCode)
    }

    return data
}
```

Note: `async throws` order matters - it's always `async throws`, not `throws async`.

## Typed Throws (Swift 6)

Swift 6 introduces typed throws for internal APIs:

```swift
func parse(_ input: String) throws(ParseError) -> AST {
    guard !input.isEmpty else {
        throw .emptyInput
    }
    // Parse logic
}
```

This explicitly states only `ParseError` can be thrown.

## Key Takeaways

1. Mark functions with `throws` when they can fail
2. Use `throw` to signal an error and exit immediately
3. Initializers and closures can also throw
4. Errors propagate up through `throws` functions
5. Use `rethrows` for functions that only throw if their closure throws
6. `async throws` is the correct order for async throwing functions

Next, we'll learn how to handle thrown errors.
