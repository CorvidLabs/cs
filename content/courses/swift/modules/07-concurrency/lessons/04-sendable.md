---
title: Sendable and Data Race Safety
order: 4
estimatedMinutes: 15
---

# Sendable and Data Race Safety

The `Sendable` protocol marks types that can safely be passed across concurrency boundaries. Swift uses it to prevent data races at compile time.

## What is Sendable?

`Sendable` indicates that a type's values can be safely shared between tasks:

```swift
// Automatically Sendable - immutable value type
struct Point: Sendable {
    let x: Double
    let y: Double
}
```

## Implicitly Sendable Types

These types are automatically `Sendable`:
- Value types with only `Sendable` properties
- Actors
- Immutable classes (final class with only let properties)
- Standard library types like `Int`, `String`, `Array`, `Dictionary`

```swift
// Implicitly Sendable
struct UserData {
    let id: String
    let name: String
    let scores: [Int]
}
```

## Explicitly Marking Sendable

Mark types explicitly when needed:

```swift
struct Configuration: Sendable {
    var timeout: Double
    var retryCount: Int
}
```

## Non-Sendable Types

Types with mutable shared state are not `Sendable`:

```swift
// NOT Sendable - mutable reference type
class Counter {
    var count = 0
}
```

Using non-Sendable types across concurrency boundaries causes compiler errors.

## Making Classes Sendable

For classes, use `final` and ensure thread-safe access:

```swift
final class ImmutableUser: Sendable {
    let id: String
    let name: String

    init(id: String, name: String) {
        self.id = id
        self.name = name
    }
}
```

## @unchecked Sendable

For types you manually ensure are thread-safe:

```swift
final class ThreadSafeCache: @unchecked Sendable {
    private let lock = NSLock()
    private var storage: [String: Data] = [:]

    func get(_ key: String) -> Data? {
        lock.lock()
        defer { lock.unlock() }
        return storage[key]
    }

    func set(_ key: String, data: Data) {
        lock.lock()
        defer { lock.unlock() }
        storage[key] = data
    }
}
```

Use `@unchecked Sendable` carefully - you're telling the compiler to trust you.

## Sendable Closures

Closures passed across concurrency boundaries must be `@Sendable`:

```swift
func processInBackground(_ work: @escaping @Sendable () -> Void) {
    Task.detached {
        work()
    }
}
```

## @Sendable Closure Restrictions

`@Sendable` closures:
- Cannot capture mutable variables
- Can only capture `Sendable` values
- Cannot capture `self` of non-Sendable classes

```swift
var count = 0

// ERROR - captures mutable variable
Task {
    count += 1
}

// OK - captures immutable value
let currentCount = count
Task {
    print(currentCount)
}
```

## Actors are Sendable

Actors are always `Sendable` because their isolation protects their state:

```swift
actor DataManager: Sendable {  // Implicit conformance
    private var data: [String: Any] = [:]

    func store(_ key: String, value: Any) {
        data[key] = value
    }
}
```

## Sendable in Generics

Constrain generic types to `Sendable`:

```swift
struct Container<Value: Sendable>: Sendable {
    let value: Value
}

func transfer<T: Sendable>(_ value: T) async {
    await process(value)
}
```

## Strict Concurrency Checking

Enable strict checking in your Package.swift:

```swift
swiftSettings: [
    .enableExperimentalFeature("StrictConcurrency")
]
```

Or in Xcode build settings: "Strict Concurrency Checking" = "Complete"

## Common Sendable Patterns

### Sendable Wrapper for Non-Sendable Types

```swift
struct SendableBox<Value>: @unchecked Sendable {
    private let lock = NSLock()
    private var _value: Value

    var value: Value {
        lock.lock()
        defer { lock.unlock() }
        return _value
    }

    init(_ value: Value) {
        self._value = value
    }
}
```

### Sending Closures with Captured State

```swift
actor Processor {
    func process(_ items: [Item], transform: @Sendable (Item) -> Item) async -> [Item] {
        items.map(transform)
    }
}
```

## Debugging Sendable Issues

When you see "cannot be sent" errors:

1. Check if the type conforms to `Sendable`
2. Check if captured variables are mutable
3. Consider using actors instead of classes
4. Use `@unchecked Sendable` only as last resort

```swift
// Error: Capture of 'object' with non-sendable type
class MyClass { }
let object = MyClass()

Task {
    print(object)  // Error
}

// Fix: Make it an actor or use Sendable
actor MyActor { }
let actor = MyActor()

Task {
    print(actor)  // OK
}
```

## Key Takeaways

1. `Sendable` marks types safe for concurrent access
2. Value types with `Sendable` properties are implicitly `Sendable`
3. Actors are always `Sendable`
4. Use `@Sendable` for closures crossing concurrency boundaries
5. `@unchecked Sendable` bypasses compiler checks - use carefully
6. Enable strict concurrency checking to catch issues early

You've now mastered Swift's concurrency model! These patterns help you write safe, efficient concurrent code.
