---
title: Do-Catch Blocks
order: 2
estimatedMinutes: 15
---

# Do-Catch Blocks

The do-catch statement handles errors thrown by throwing functions. It provides structured error handling with pattern matching for specific error cases.

## Basic Do-Catch

```swift
public enum FileError: Error {
    case notFound
    case permissionDenied
    case corrupted
}

public func readFile(_ path: String) throws -> String {
    throw FileError.notFound
}

do {
    let content = try readFile("data.txt")
    print(content)
} catch {
    print("Error: \(error)")
}
```

## Catching Specific Errors

Use pattern matching to handle specific error cases:

```swift
do {
    let content = try readFile("data.txt")
    print(content)
} catch FileError.notFound {
    print("File not found")
} catch FileError.permissionDenied {
    print("Permission denied")
} catch FileError.corrupted {
    print("File is corrupted")
} catch {
    print("Unexpected error: \(error)")
}
```

## Catching Errors with Associated Values

Extract associated values from errors:

```swift
public enum NetworkError: Error {
    case httpError(statusCode: Int)
    case timeout(seconds: Int)
    case invalidURL(url: String)
}

public func fetch(url: String) throws -> Data {
    throw NetworkError.httpError(statusCode: 404)
}

do {
    let data = try fetch(url: "https://api.example.com")
    print(data)
} catch NetworkError.httpError(let statusCode) where statusCode >= 500 {
    print("Server error: \(statusCode)")
} catch NetworkError.httpError(let statusCode) where statusCode >= 400 {
    print("Client error: \(statusCode)")
} catch NetworkError.timeout(let seconds) {
    print("Request timed out after \(seconds) seconds")
} catch NetworkError.invalidURL(let url) {
    print("Invalid URL: \(url)")
} catch {
    print("Unknown error: \(error)")
}
```

## Catching Multiple Error Types

Handle errors from different sources:

```swift
public enum ParseError: Error {
    case invalidJSON
    case missingField(String)
}

public func parseData(_ data: Data) throws -> [String: Any] {
    throw ParseError.invalidJSON
}

do {
    let data = try fetch(url: "https://api.example.com")
    let json = try parseData(data)
    print(json)
} catch let networkError as NetworkError {
    print("Network failed: \(networkError)")
} catch let parseError as ParseError {
    print("Parse failed: \(parseError)")
} catch {
    print("Unknown error: \(error)")
}
```

## Grouping Related Catches

Catch multiple patterns in one block:

```swift
do {
    let result = try riskyOperation()
} catch FileError.notFound, FileError.permissionDenied {
    print("File access issue")
} catch {
    print("Other error: \(error)")
}
```

## Local Error Handling

Handle errors locally and continue:

```swift
public func processFiles(_ paths: [String]) {
    for path in paths {
        do {
            let content = try readFile(path)
            print("Processed: \(path)")
        } catch {
            print("Skipping \(path): \(error)")
            // Continue with next file
        }
    }
}
```

## Defer with Error Handling

`defer` runs regardless of whether an error is thrown:

```swift
public func processFile(_ path: String) throws {
    print("Opening file")

    defer {
        print("Closing file")  // Always runs
    }

    let content = try readFile(path)  // Might throw
    print("Processing content")  // Only runs if no error
}

// If error is thrown:
// Output: Opening file
//         Closing file
// Then error propagates

// If no error:
// Output: Opening file
//         Processing content
//         Closing file
```

## Cleanup with Multiple Defers

Defers run in reverse order:

```swift
public func complexOperation() throws {
    print("Starting")

    defer { print("Cleanup 1") }

    try step1()

    defer { print("Cleanup 2") }

    try step2()

    defer { print("Cleanup 3") }

    try step3()
}

// If step2 throws:
// Output: Starting
//         Cleanup 2
//         Cleanup 1
// Then error propagates
```

## Converting Errors

Transform errors into different types:

```swift
public enum AppError: Error {
    case configuration(String)
    case network(String)
    case data(String)
}

public func loadData() throws -> Data {
    do {
        let config = try loadConfig()
        let data = try fetchFromNetwork(config)
        return data
    } catch let error as FileError {
        throw AppError.configuration("Config failed: \(error)")
    } catch let error as NetworkError {
        throw AppError.network("Network failed: \(error)")
    } catch {
        throw AppError.data("Unknown data error")
    }
}
```

## Exhaustive Error Handling

Ensure all errors are handled:

```swift
public enum LoginError: Error {
    case invalidCredentials
    case accountLocked
    case networkFailure
}

public func login(user: String, password: String) throws {
    throw LoginError.invalidCredentials
}

// Exhaustive handling
do {
    try login(user: "alice", password: "secret")
    print("Login successful")
} catch LoginError.invalidCredentials {
    print("Invalid username or password")
} catch LoginError.accountLocked {
    print("Account is locked")
} catch LoginError.networkFailure {
    print("Network connection failed")
} catch {
    // Still needed for future cases
    print("Unexpected error: \(error)")
}
```

## Nested Do-Catch

Handle errors at different levels:

```swift
public func outerOperation() {
    do {
        do {
            try innerOperation()
        } catch FileError.notFound {
            print("File not found - using default")
            // Recover and continue
        }
        // Continues after recovery
        try anotherOperation()
    } catch {
        print("Outer operation failed: \(error)")
    }
}
```

## Error Recovery

Attempt recovery before propagating:

```swift
public func fetchWithFallback() throws -> Data {
    do {
        return try fetch(url: "https://primary.example.com")
    } catch NetworkError.timeout {
        print("Primary server timed out, trying backup...")
        return try fetch(url: "https://backup.example.com")
    }
    // Other errors propagate automatically
}
```

## Best Practices

```swift
// 1. Be specific about what you catch
do {
    try operation()
} catch SpecificError.specificCase {
    // Handle this case
} catch {
    // Catch-all for unexpected errors
}

// 2. Don't swallow errors silently
do {
    try operation()
} catch {
    // BAD: Empty catch - errors disappear
}

// 3. Log unexpected errors
do {
    try operation()
} catch {
    print("Unexpected error: \(error)")
    throw error  // Re-throw after logging
}

// 4. Use defer for cleanup
do {
    let resource = try acquireResource()
    defer { releaseResource(resource) }
    try useResource(resource)
} catch {
    // Resource is still released
}
```

## Key Takeaways

1. Use do-catch to handle throwing function errors
2. Pattern match to catch specific error cases
3. Extract associated values with `let` bindings
4. Use `where` clauses for conditional catches
5. `defer` ensures cleanup code runs regardless of errors
6. Multiple defers execute in reverse order
7. Always include a catch-all for unexpected errors
8. Use nested do-catch for granular error handling

In the next lesson, we'll explore the Result type for representing success or failure.
