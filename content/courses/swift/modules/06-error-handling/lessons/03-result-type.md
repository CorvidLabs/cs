---
title: Result Type
order: 3
estimatedMinutes: 16
---

# Result Type

The `Result` type represents either a successful value or an error. It's useful for returning outcomes from operations that can fail, especially in asynchronous contexts.

## Result Definition

Result is a generic enum with two cases:

```swift
public enum Result<Success, Failure: Error> {
    case success(Success)
    case failure(Failure)
}
```

## Creating Results

```swift
public enum NetworkError: Error {
    case noData
    case invalidResponse
    case serverError(Int)
}

// Success case
let successResult: Result<String, NetworkError> = .success("Data loaded")

// Failure case
let failureResult: Result<String, NetworkError> = .failure(.noData)
```

## Returning Results

Use Result as a return type:

```swift
public func fetchUser(id: Int) -> Result<User, NetworkError> {
    guard id > 0 else {
        return .failure(.invalidResponse)
    }

    // Simulate success
    let user = User(id: id, name: "Alice")
    return .success(user)
}

public struct User {
    public let id: Int
    public let name: String
}
```

## Handling Results with Switch

```swift
let result = fetchUser(id: 123)

switch result {
case .success(let user):
    print("Got user: \(user.name)")
case .failure(let error):
    print("Failed: \(error)")
}
```

## Getting Values with get()

The `get()` method throws on failure:

```swift
let result = fetchUser(id: 123)

do {
    let user = try result.get()
    print("User: \(user.name)")
} catch {
    print("Error: \(error)")
}
```

## Result Initializer from Throwing

Create Result from a throwing expression:

```swift
public func parseJSON(_ data: Data) throws -> [String: Any] {
    // Throwing function
    throw ParseError.invalid
}

public enum ParseError: Error {
    case invalid
}

// Convert throwing call to Result
let result = Result { try parseJSON(Data()) }

switch result {
case .success(let json):
    print("Parsed: \(json)")
case .failure(let error):
    print("Parse error: \(error)")
}
```

## Mapping Results

Transform the success value:

```swift
let numberResult: Result<Int, Error> = .success(5)

// Map transforms the success value
let doubledResult = numberResult.map { $0 * 2 }
// Result<Int, Error>.success(10)

// mapError transforms the failure value
let mappedError = failureResult.mapError { _ in
    CustomError.converted
}
```

## FlatMap for Chaining

Chain operations that return Results:

```swift
public func fetchUserID() -> Result<Int, NetworkError> {
    .success(123)
}

public func fetchUserDetails(id: Int) -> Result<User, NetworkError> {
    .success(User(id: id, name: "Alice"))
}

let result = fetchUserID()
    .flatMap { id in
        fetchUserDetails(id: id)
    }

switch result {
case .success(let user):
    print("User: \(user.name)")
case .failure(let error):
    print("Error: \(error)")
}
```

## Combining Results

Combine multiple results:

```swift
public func validateUsername(_ username: String) -> Result<String, ValidationError> {
    guard !username.isEmpty else {
        return .failure(.empty)
    }
    return .success(username)
}

public func validateEmail(_ email: String) -> Result<String, ValidationError> {
    guard email.contains("@") else {
        return .failure(.invalidFormat)
    }
    return .success(email)
}

public enum ValidationError: Error {
    case empty
    case invalidFormat
}

// Combine results
public func validateUser(username: String, email: String)
    -> Result<(username: String, email: String), ValidationError> {
    switch (validateUsername(username), validateEmail(email)) {
    case (.success(let name), .success(let mail)):
        return .success((username: name, email: mail))
    case (.failure(let error), _), (_, .failure(let error)):
        return .failure(error)
    }
}
```

## Result with Async Callbacks

Result is common in completion handlers:

```swift
public typealias Handler<Output> = (Result<Output, Error>) -> Void

public func fetchData(completion: @escaping Handler<Data>) {
    // Simulate async operation
    DispatchQueue.global().async {
        let success = Bool.random()

        if success {
            completion(.success(Data()))
        } else {
            completion(.failure(NetworkError.noData))
        }
    }
}

// Usage
fetchData { result in
    switch result {
    case .success(let data):
        print("Got \(data.count) bytes")
    case .failure(let error):
        print("Error: \(error)")
    }
}
```

## Converting Result to Optional

```swift
let result: Result<Int, Error> = .success(42)

// Get success value or nil
let value = try? result.get()  // Optional(42)

// Failure returns nil
let failResult: Result<Int, Error> = .failure(SomeError())
let failValue = try? failResult.get()  // nil
```

## Publisher-Style Operators

Build Result pipelines:

```swift
extension Result {
    public func onSuccess(_ handler: (Success) -> Void) -> Self {
        if case .success(let value) = self {
            handler(value)
        }
        return self
    }

    public func onFailure(_ handler: (Failure) -> Void) -> Self {
        if case .failure(let error) = self {
            handler(error)
        }
        return self
    }
}

// Usage
fetchUser(id: 123)
    .onSuccess { user in
        print("Loaded: \(user.name)")
    }
    .onFailure { error in
        print("Failed: \(error)")
    }
```

## Result vs throws

| Aspect | Result | throws |
|--------|--------|--------|
| Synchronous | Both work | Preferred |
| Asynchronous (callbacks) | Preferred | Not possible |
| async/await | Use throws | Preferred |
| Storing outcome | Preferred | Convert with Result {} |
| Error is part of type | Yes | No (Any Error) |

## Practical Example: Network Layer

```swift
public struct APIClient {
    public func fetch<Output: Decodable>(
        _ endpoint: String,
        as type: Output.Type
    ) -> Result<Output, APIError> {
        // Simulate network request
        guard let url = URL(string: endpoint) else {
            return .failure(.invalidURL)
        }

        guard let data = try? Data(contentsOf: url) else {
            return .failure(.noData)
        }

        do {
            let decoded = try JSONDecoder().decode(type, from: data)
            return .success(decoded)
        } catch {
            return .failure(.decodingFailed)
        }
    }
}

public enum APIError: Error {
    case invalidURL
    case noData
    case decodingFailed
}
```

## Key Takeaways

1. `Result<Success, Failure>` represents success or failure
2. Use `.success(value)` and `.failure(error)` cases
3. `get()` throws on failure for do-catch handling
4. `Result { try expression }` captures throwing expressions
5. `map` transforms success values
6. `flatMap` chains Result-returning operations
7. Prefer `Result` for async callbacks
8. Prefer `throws` with async/await

In the next lesson, we'll explore optional chaining for safe value access.
