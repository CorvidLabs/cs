---
title: The Result Type
order: 4
estimatedMinutes: 15
---

# The Result Type

Swift's `Result` type provides an alternative to throwing functions, especially useful for asynchronous operations and functional programming patterns.

## Understanding Result

`Result` is an enum with two cases:

```swift
enum Result<Success, Failure: Error> {
    case success(Success)
    case failure(Failure)
}
```

It either contains a successful value or an error - never both, never neither.

## Creating Result Values

Create success and failure results:

```swift
enum ValidationError: Error {
    case invalidEmail
    case weakPassword
}

func validate(email: String) -> Result<String, ValidationError> {
    if email.contains("@") {
        return .success(email)
    } else {
        return .failure(.invalidEmail)
    }
}
```

## Handling Result with switch

Pattern match on the result:

```swift
let result = validate(email: "user@example.com")

switch result {
case .success(let email):
    print("Valid email: \(email)")
case .failure(let error):
    print("Invalid: \(error)")
}
```

## Using get() to Extract Values

Convert `Result` back to throwing:

```swift
do {
    let email = try result.get()
    print("Email: \(email)")
} catch {
    print("Error: \(error)")
}
```

## Creating Result from Throwing Code

Wrap throwing code in a Result:

```swift
let fileResult = Result {
    try String(contentsOfFile: "/path/to/file")
}
```

This captures either the success value or the thrown error.

## Transforming Success with map

Transform the success value without unwrapping:

```swift
let emailResult: Result<String, ValidationError> = .success("USER@EXAMPLE.COM")

let lowercased = emailResult.map { email in
    email.lowercased()
}
// Result<String, ValidationError>.success("user@example.com")
```

If the result is a failure, `map` passes it through unchanged.

## Chaining with flatMap

Chain operations that return Results:

```swift
func validate(email: String) -> Result<String, ValidationError> {
    email.contains("@") ? .success(email) : .failure(.invalidEmail)
}

func checkDomain(_ email: String) -> Result<String, ValidationError> {
    email.hasSuffix(".com") ? .success(email) : .failure(.invalidEmail)
}

let finalResult = validate(email: "user@example.com")
    .flatMap { checkDomain($0) }
```

`flatMap` unwraps the success, calls your function, and flattens the result.

## Transforming Errors with mapError

Change the error type:

```swift
enum AppError: Error {
    case validation(String)
    case network(String)
}

let result: Result<String, ValidationError> = .failure(.invalidEmail)

let appResult: Result<String, AppError> = result.mapError { error in
    .validation("Email validation failed: \(error)")
}
```

## Result in Async Code

Result works well with completion handlers (for legacy code):

```swift
func fetchUser(id: String, completion: @escaping (Result<User, NetworkError>) -> Void) {
    URLSession.shared.dataTask(with: url) { data, response, error in
        if let error = error {
            completion(.failure(.networkFailed(error)))
            return
        }

        guard let data = data else {
            completion(.failure(.noData))
            return
        }

        do {
            let user = try JSONDecoder().decode(User.self, from: data)
            completion(.success(user))
        } catch {
            completion(.failure(.decodingFailed))
        }
    }.resume()
}
```

## Converting Between Result and async/throws

Convert completion-based APIs to async:

```swift
func fetchUserAsync(id: String) async throws -> User {
    try await withCheckedThrowingContinuation { continuation in
        fetchUser(id: id) { result in
            continuation.resume(with: result)
        }
    }
}
```

## Result vs Throwing Functions

When to use each:

| Use `throws` when | Use `Result` when |
|-------------------|-------------------|
| Synchronous operations | Storing errors for later handling |
| Simple error propagation | Need to transform errors with `map` |
| Familiar imperative style | Functional programming patterns |
| Modern async/await code | Legacy completion handler APIs |

## Combining Multiple Results

Handle multiple results together:

```swift
func combine<A, B, E: Error>(
    _ r1: Result<A, E>,
    _ r2: Result<B, E>
) -> Result<(A, B), E> {
    switch (r1, r2) {
    case (.success(let a), .success(let b)):
        return .success((a, b))
    case (.failure(let e), _), (_, .failure(let e)):
        return .failure(e)
    }
}
```

## Key Takeaways

1. `Result` explicitly represents success or failure
2. Use `switch` or `get()` to extract values
3. `map` transforms success values
4. `flatMap` chains Result-returning operations
5. `mapError` transforms error types
6. Choose between `Result` and `throws` based on your use case

You've now mastered Swift's error handling! These patterns help you write robust code that gracefully handles failures.
