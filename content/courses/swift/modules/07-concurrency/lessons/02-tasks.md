---
title: Tasks and Task Groups
order: 2
estimatedMinutes: 15
---

# Tasks and Task Groups

Tasks are the unit of concurrent work in Swift. They let you run async code from synchronous contexts and manage parallel operations.

## Creating Tasks

Use `Task` to run async code from a synchronous context:

```swift
func buttonTapped() {
    Task {
        let data = try await fetchData()
        await displayData(data)
    }
}
```

The `Task` initializer takes an async closure and runs it immediately.

## Task with Return Values

Tasks can return values:

```swift
let task = Task {
    try await fetchUser(id: "123")
}

// Later, get the result
let user = try await task.value
```

## Task Cancellation

Tasks can be cancelled:

```swift
let task = Task {
    for i in 1...100 {
        // Check if cancelled
        try Task.checkCancellation()

        // Or check without throwing
        if Task.isCancelled {
            return
        }

        await processItem(i)
    }
}

// Cancel the task
task.cancel()
```

## Cooperative Cancellation

Cancellation is cooperative - your code must check for it:

```swift
func downloadFiles(_ urls: [URL]) async throws -> [Data] {
    var results: [Data] = []

    for url in urls {
        // Respond to cancellation
        try Task.checkCancellation()

        let data = try await download(url)
        results.append(data)
    }

    return results
}
```

## Task Priority

Set priority when creating tasks:

```swift
Task(priority: .high) {
    await processUrgentWork()
}

Task(priority: .background) {
    await processBackgroundWork()
}
```

Priority levels: `.high`, `.medium`, `.low`, `.background`, `.utility`, `.userInitiated`

## Detached Tasks

Detached tasks don't inherit context from the parent:

```swift
Task.detached(priority: .background) {
    // Runs independently
    await performBackgroundCleanup()
}
```

Use detached tasks when you explicitly don't want to inherit priority or actor context.

## Task Groups

Run multiple tasks and collect results:

```swift
func fetchAllUsers(ids: [String]) async throws -> [User] {
    try await withThrowingTaskGroup(of: User.self) { group in
        for id in ids {
            group.addTask {
                try await fetchUser(id: id)
            }
        }

        var users: [User] = []
        for try await user in group {
            users.append(user)
        }
        return users
    }
}
```

## Task Group Cancellation

When one task fails in a throwing group, others are cancelled:

```swift
try await withThrowingTaskGroup(of: Data.self) { group in
    for url in urls {
        group.addTask {
            try await download(url)  // If this throws...
        }
    }

    // ...other tasks are automatically cancelled
    for try await data in group {
        process(data)
    }
}
```

## Non-Throwing Task Groups

Use `withTaskGroup` for operations that don't throw:

```swift
await withTaskGroup(of: Int.self) { group in
    for i in 1...10 {
        group.addTask {
            await compute(i)
        }
    }

    var total = 0
    for await result in group {
        total += result
    }
    print("Total: \(total)")
}
```

## Limiting Concurrency

Control how many tasks run simultaneously:

```swift
func processWithLimit(items: [Item], maxConcurrent: Int) async {
    await withTaskGroup(of: Void.self) { group in
        var iterator = items.makeIterator()

        // Start initial batch
        for _ in 0..<maxConcurrent {
            if let item = iterator.next() {
                group.addTask { await process(item) }
            }
        }

        // As each completes, add the next
        for await _ in group {
            if let item = iterator.next() {
                group.addTask { await process(item) }
            }
        }
    }
}
```

## Task Local Values

Store values accessible within a task hierarchy:

```swift
enum RequestContext {
    @TaskLocal static var requestID: String?
}

func processRequest() async {
    await RequestContext.$requestID.withValue("req-123") {
        await handleRequest()  // Can access requestID
    }
}

func handleRequest() async {
    if let id = RequestContext.requestID {
        print("Processing request: \(id)")
    }
}
```

## async let vs Task Groups

Use `async let` for a fixed number of operations:

```swift
async let a = fetchA()
async let b = fetchB()
let results = await (a, b)
```

Use task groups for dynamic collections:

```swift
await withTaskGroup(of: Result.self) { group in
    for item in items {
        group.addTask { await process(item) }
    }
    // ...
}
```

## Key Takeaways

1. Use `Task { }` to run async code from sync contexts
2. Tasks support cancellation - check with `Task.checkCancellation()`
3. Set priority with `Task(priority:)`
4. Use `withThrowingTaskGroup` for parallel operations
5. Task groups automatically cancel on failure
6. Use `async let` for fixed operations, task groups for dynamic ones

Next, we'll explore actors for safe mutable state.
