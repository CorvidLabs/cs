---
title: Async/Await Fundamentals
order: 1
estimatedMinutes: 15
---

# Async/Await in Swift

Swift's concurrency model makes asynchronous code as easy to write as synchronous code. Let's explore async/await, the foundation of Swift concurrency.

## What is Asynchronous Code?

Asynchronous operations take time to complete - network requests, file I/O, database queries. Rather than blocking the thread while waiting, async code suspends and lets other work proceed.

## Async Functions

Mark functions with `async` to indicate they can suspend:

```swift
func fetchUserName() async -> String {
    // This function can suspend while fetching
    return "Alice"
}
```

## Calling Async Functions with await

Call async functions using `await`:

```swift
func greetUser() async {
    let name = await fetchUserName()
    print("Hello, \(name)!")
}
```

The `await` keyword marks where your code might suspend.

## Async Functions That Throw

Combine `async` with `throws`:

```swift
func fetchData(from url: URL) async throws -> Data {
    let (data, response) = try await URLSession.shared.data(from: url)

    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw NetworkError.invalidResponse
    }

    return data
}
```

Note: Always write `async throws`, not `throws async`.

## Sequential vs Concurrent Execution

Sequential execution - each await completes before the next starts:

```swift
func fetchAllSequentially() async throws {
    let user = try await fetchUser()
    let posts = try await fetchPosts()      // Waits for fetchUser
    let comments = try await fetchComments() // Waits for fetchPosts
}
```

## Concurrent Execution with async let

Run operations in parallel:

```swift
func fetchAllConcurrently() async throws {
    async let user = fetchUser()
    async let posts = fetchPosts()
    async let comments = fetchComments()

    // All three requests run concurrently
    let results = try await (user, posts, comments)
}
```

`async let` starts the operation immediately; `await` waits for completion.

## Real-World Example: Image Loading

```swift
func loadImage(from urlString: String) async throws -> UIImage {
    guard let url = URL(string: urlString) else {
        throw ImageError.invalidURL
    }

    let (data, _) = try await URLSession.shared.data(from: url)

    guard let image = UIImage(data: data) else {
        throw ImageError.decodingFailed
    }

    return image
}

// Usage
func displayProfile() async {
    do {
        let image = try await loadImage(from: "https://example.com/photo.jpg")
        // Update UI with image
    } catch {
        // Show error state
    }
}
```

## Async Properties

Properties can also be async:

```swift
struct WeatherService {
    var currentTemperature: Double {
        get async throws {
            let data = try await fetchWeatherData()
            return data.temperature
        }
    }
}
```

## Async Sequences

Iterate over values that arrive over time:

```swift
func processLines(from url: URL) async throws {
    for try await line in url.lines {
        print("Received: \(line)")
    }
}
```

Each iteration awaits the next value.

## Suspension Points

Every `await` is a potential suspension point where:
- Your function pauses execution
- The thread is freed for other work
- State might change before you resume

```swift
func updateUser() async throws {
    let user = await fetchUser()
    // ^^^ Suspension point - other code may run here
    let updatedUser = modify(user)
    try await saveUser(updatedUser)
    // ^^^ Another suspension point
}
```

Be aware that shared state might change between suspension points.

## Main Actor for UI Work

UI updates must happen on the main thread. Use `@MainActor`:

```swift
@MainActor
func updateUI(with data: Data) {
    label.text = String(data: data, encoding: .utf8)
}

func fetchAndDisplay() async throws {
    let data = try await fetchData()
    await updateUI(with: data)  // Switches to main actor
}
```

## Key Takeaways

1. Mark functions with `async` if they can suspend
2. Use `await` to call async functions
3. Combine with `throws` as `async throws`
4. Use `async let` for concurrent operations
5. Every `await` is a suspension point
6. Use `@MainActor` for UI updates

Next, we'll explore Tasks for managing concurrent work.
