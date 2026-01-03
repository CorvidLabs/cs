---
title: Escaping Closures
order: 4
estimatedMinutes: 15
---

# Escaping Closures

A closure is said to "escape" a function when it's stored for later execution after the function returns. Understanding escaping closures is essential for working with asynchronous code.

## What Is an Escaping Closure?

A closure escapes when:
- It's stored in a property
- It's passed to another function that stores it
- It executes after the function returns (async callbacks)

```swift
public class CallbackManager {
    private var callbacks: [() -> Void] = []

    public init() {}

    // This closure escapes - it's stored for later
    public func addCallback(_ callback: @escaping () -> Void) {
        callbacks.append(callback)
    }

    public func executeAll() {
        for callback in callbacks {
            callback()
        }
    }
}
```

## The @escaping Attribute

Mark closures that escape with `@escaping`:

```swift
public func fetchData(completion: @escaping (String) -> Void) {
    // Simulate async operation
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
        completion("Data loaded")  // Called after fetchData returns
    }
}
```

Without `@escaping`:

```swift
// This closure doesn't escape - it's called synchronously
public func processItems(_ items: [Int], transform: (Int) -> Int) -> [Int] {
    items.map(transform)  // transform is called immediately
}
```

## Why @escaping Matters

Swift uses `@escaping` to:
1. **Enforce memory safety** - The compiler knows to manage the closure's lifetime
2. **Require explicit `self`** - You must write `self.` in escaping closures
3. **Enable optimizations** - Non-escaping closures can be optimized more aggressively

## Self Requirements in Escaping Closures

In escaping closures, you must reference `self` explicitly:

```swift
public class DataLoader {
    public var data: String = ""

    public init() {}

    public func load() {
        // Must use 'self' in escaping closures
        fetchData { [weak self] result in
            self?.data = result  // Explicit self
        }
    }

    private func fetchData(completion: @escaping (String) -> Void) {
        completion("Loaded data")
    }
}
```

In non-escaping closures, `self` is implicit:

```swift
public class Calculator {
    public var multiplier: Int = 2

    public init() {}

    public func doubled(_ numbers: [Int]) -> [Int] {
        // No need for 'self' - closure doesn't escape
        numbers.map { $0 * multiplier }
    }
}
```

## Common Escaping Closure Patterns

### Pattern 1: Completion Handlers

```swift
public typealias DataHandler = (Result<String, Error>) -> Void

public func fetchUser(
    id: String,
    completion: @escaping DataHandler
) {
    // Simulate network request
    DispatchQueue.global().async {
        // Simulate work
        let result: Result<String, Error> = .success("User \(id)")

        DispatchQueue.main.async {
            completion(result)
        }
    }
}

// Usage
fetchUser(id: "123") { result in
    switch result {
    case .success(let user):
        print("Got user: \(user)")
    case .failure(let error):
        print("Error: \(error)")
    }
}
```

### Pattern 2: Stored Callbacks

```swift
public class EventEmitter {
    private var listeners: [String: [(Any) -> Void]] = [:]

    public init() {}

    public func on(_ event: String, handler: @escaping (Any) -> Void) {
        if listeners[event] == nil {
            listeners[event] = []
        }
        listeners[event]?.append(handler)
    }

    public func emit(_ event: String, data: Any) {
        listeners[event]?.forEach { handler in
            handler(data)
        }
    }
}

let emitter = EventEmitter()
emitter.on("dataLoaded") { data in
    print("Received: \(data)")
}
emitter.emit("dataLoaded", data: "Sample data")
```

### Pattern 3: Lazy Initialization

```swift
public class Configuration {
    private var valueProvider: (() -> String)?
    private var cachedValue: String?

    public init() {}

    public func setProvider(_ provider: @escaping () -> String) {
        self.valueProvider = provider
    }

    public var value: String {
        if let cached = cachedValue {
            return cached
        }
        let computed = valueProvider?() ?? "default"
        cachedValue = computed
        return computed
    }
}
```

## @escaping with Optional Closures

Optional closures are implicitly escaping:

```swift
public class Timer {
    // Optional closures don't need @escaping
    public var onTick: (() -> Void)?
    public var onComplete: (() -> Void)?

    public init() {}

    public func start() {
        // These closures are stored, so they escape
        onTick?()
    }
}
```

## Non-Escaping by Default

Swift 3+ makes closures non-escaping by default for performance:

```swift
// Non-escaping (default) - can be optimized
public func process(_ items: [Int], using closure: (Int) -> Int) -> [Int] {
    items.map(closure)
}

// The closure is called and discarded before the function returns
let doubled = process([1, 2, 3]) { $0 * 2 }
```

## @escaping and Sendable

In concurrent contexts, escaping closures often need to be `@Sendable`:

```swift
public func performAsync(_ work: @escaping @Sendable () -> Void) {
    Task {
        work()
    }
}

public class Counter: @unchecked Sendable {
    private var count = 0

    public init() {}

    public func increment() {
        performAsync { [weak self] in
            self?.count += 1
        }
    }
}
```

## Converting Between Escaping and Non-Escaping

Use `withoutActuallyEscaping` when you need to pass a non-escaping closure to a function that requires escaping:

```swift
public func processWithEscaping(
    items: [Int],
    transform: (Int) -> Int
) -> [Int] {
    // transform is non-escaping, but internalProcess requires escaping
    withoutActuallyEscaping(transform) { escapingTransform in
        internalProcess(items: items, transform: escapingTransform)
    }
}

private func internalProcess(
    items: [Int],
    transform: @escaping (Int) -> Int
) -> [Int] {
    items.map(transform)
}
```

Warning: Only use this when you're certain the closure won't actually escape.

## Best Practices

### 1. Prefer Non-Escaping When Possible

```swift
// Better - non-escaping allows more optimization
public func transform(_ value: Int, using closure: (Int) -> Int) -> Int {
    closure(value)
}
```

### 2. Always Use Weak Self in Escaping Closures

```swift
public class ViewController {
    public var data: String = ""

    public func load() {
        fetchData { [weak self] result in
            guard let self = self else { return }
            self.data = result
        }
    }

    private func fetchData(completion: @escaping (String) -> Void) {
        completion("Data")
    }
}
```

### 3. Document Escaping Behavior

```swift
/// Fetches data asynchronously.
/// - Parameter completion: Called on the main queue when data is available.
///   This closure escapes and may be called after a delay.
public func fetchData(completion: @escaping (String) -> Void) {
    // Implementation
}
```

## Key Takeaways

1. Escaping closures outlive the function that receives them
2. Mark escaping closures with `@escaping`
3. Escaping closures require explicit `self` references
4. Always use `[weak self]` or `[unowned self]` to prevent retain cycles
5. Optional closures are implicitly escaping
6. Non-escaping closures (default) are more efficient
7. Use `@Sendable` with `@escaping` in concurrent contexts

You've completed the Functions and Closures module! You now understand how to write flexible, reusable code with Swift's powerful function and closure features.
