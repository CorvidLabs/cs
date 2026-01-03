---
title: Handling Errors
order: 3
estimatedMinutes: 15
---

# Handling Errors

When you call a throwing function, you must handle the potential error. Swift provides several ways to do this.

## The do-catch Statement

The most explicit way to handle errors:

```swift
do {
    let result = try divide(10, by: 0)
    print("Result: \(result)")
} catch {
    print("Error: \(error)")
}
```

The `try` keyword marks calls that might throw.

## Catching Specific Errors

Match specific error cases:

```swift
enum FileError: Error {
    case notFound(filename: String)
    case permissionDenied
    case corrupted
}

do {
    let contents = try readFile("data.txt")
    print(contents)
} catch FileError.notFound(let filename) {
    print("Could not find file: \(filename)")
} catch FileError.permissionDenied {
    print("Access denied - check file permissions")
} catch FileError.corrupted {
    print("File is corrupted - try restoring from backup")
} catch {
    print("Unexpected error: \(error)")
}
```

The final `catch` without a pattern catches anything not matched above.

## Pattern Matching in catch

Use `where` clauses for more specific matching:

```swift
enum NetworkError: Error {
    case serverError(statusCode: Int)
    case timeout
}

do {
    let data = try fetchData()
} catch NetworkError.serverError(let code) where code == 404 {
    print("Resource not found")
} catch NetworkError.serverError(let code) where code >= 500 {
    print("Server error: \(code)")
} catch NetworkError.timeout {
    print("Request timed out")
} catch {
    print("Network error: \(error)")
}
```

## Converting Errors to Optionals with try?

When you don't need error details, convert to optional:

```swift
let result = try? divide(10, by: 2)  // Optional(5.0)
let failed = try? divide(10, by: 0)  // nil
```

The error is silently discarded, returning `nil` on failure.

## Combining try? with nil-coalescing

Provide default values for failures:

```swift
let config = try? loadConfiguration() ?? Config.default
let username = (try? fetchUsername()) ?? "Guest"
```

## Disabling Error Propagation with try!

When you're certain a call won't fail:

```swift
let path = Bundle.main.path(forResource: "data", ofType: "json")!
let data = try! Data(contentsOf: URL(fileURLWithPath: path))
```

**Warning**: `try!` crashes if an error is thrown. Use sparingly and only when failure is truly impossible.

## Multiple try Statements

A single `do` block can contain multiple `try` calls:

```swift
do {
    let user = try validateUser(input)
    let token = try authenticate(user)
    let profile = try fetchProfile(token)
    display(profile)
} catch {
    showError(error)
}
```

If any `try` throws, execution jumps to `catch`.

## Error Handling with defer

`defer` runs cleanup code regardless of whether an error occurs:

```swift
func processFile(_ path: String) throws {
    let file = try openFile(path)
    defer {
        closeFile(file)  // Always runs
    }

    let data = try readContents(file)
    try processData(data)
}
```

## Async Error Handling

Handle errors from async functions the same way:

```swift
do {
    let data = try await fetchData(from: url)
    let decoded = try JSONDecoder().decode(User.self, from: data)
    print("User: \(decoded.name)")
} catch let error as DecodingError {
    print("Failed to decode: \(error)")
} catch {
    print("Network error: \(error)")
}
```

## Catching Multiple Error Types

Use comma-separated patterns:

```swift
do {
    try performOperation()
} catch NetworkError.timeout, NetworkError.noConnection {
    print("Connection problem - check your network")
} catch {
    print("Other error: \(error)")
}
```

## Error Handling Strategy Guidelines

Choose your approach based on context:

| Scenario | Approach |
|----------|----------|
| Need to handle different errors differently | `do-catch` with specific patterns |
| Don't care why it failed | `try?` |
| Have a sensible default | `try?` with `??` |
| Failure is programmer error | `try!` (rare) |
| Need to propagate the error | Just use `try` in a `throws` function |

## Key Takeaways

1. Use `do-catch` for explicit error handling
2. Pattern match specific errors in `catch` clauses
3. `try?` converts errors to optionals (returns `nil` on failure)
4. `try!` crashes on error - use only when failure is impossible
5. `defer` ensures cleanup runs regardless of errors
6. Always have a final catch-all `catch` for unexpected errors

Next, we'll explore the `Result` type for functional error handling.
