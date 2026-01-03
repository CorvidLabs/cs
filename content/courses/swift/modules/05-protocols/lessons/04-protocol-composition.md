---
title: Protocol Composition
order: 4
estimatedMinutes: 15
---

# Protocol Composition

Protocol composition allows you to combine multiple protocols into a single requirement. This enables flexible, precise type constraints without creating new protocols.

## Basic Composition

Use `&` to require conformance to multiple protocols:

```swift
protocol Named {
    var name: String { get }
}

protocol Aged {
    var age: Int { get }
}

func celebrate(celebrant: Named & Aged) {
    print("Happy birthday \(celebrant.name)! You're now \(celebrant.age)!")
}
```

The parameter must conform to both `Named` and `Aged`.

## Composing with Classes

You can include a class type in composition:

```swift
class Person {
    var name: String

    init(name: String) {
        self.name = name
    }
}

protocol Employable {
    var jobTitle: String { get }
}

func introduce(employee: Person & Employable) {
    print("\(employee.name) works as \(employee.jobTitle)")
}
```

This requires both inheritance from `Person` and conformance to `Employable`.

## Type Aliases for Composition

Create type aliases for commonly used compositions:

```swift
protocol Identifiable {
    var id: String { get }
}

protocol Timestamped {
    var createdAt: Date { get }
    var updatedAt: Date { get }
}

protocol Auditable {
    var createdBy: String { get }
}

typealias TrackableEntity = Identifiable & Timestamped & Auditable
```

Now you can use `TrackableEntity` instead of repeating the composition:

```swift
func log(entity: TrackableEntity) {
    print("[\(entity.id)] Created by \(entity.createdBy) at \(entity.createdAt)")
}
```

## Generic Constraints with Composition

Use composition in generic constraints:

```swift
protocol Cacheable {
    var cacheKey: String { get }
}

protocol Expirable {
    var expirationDate: Date { get }
}

struct Cache<Item: Cacheable & Expirable> {
    private var storage: [String: Item] = [:]

    mutating func store(_ item: Item) {
        storage[item.cacheKey] = item
    }

    func retrieve(key: String) -> Item? {
        guard let item = storage[key] else { return nil }
        guard item.expirationDate > Date() else { return nil }
        return item
    }
}
```

## Composition in Collections

Store items that conform to multiple protocols:

```swift
protocol Drawable {
    func draw()
}

protocol Animatable {
    func animate(duration: Double)
}

var interactiveElements: [Drawable & Animatable] = []
```

## Building Flexible APIs

Protocol composition helps build APIs that require exactly what they need:

```swift
protocol Readable {
    func read() -> Data
}

protocol Writable {
    func write(_ data: Data)
}

protocol Deletable {
    func delete()
}

// Different functions require different capabilities
func backup(source: Readable) {
    let data = source.read()
    // Store backup
}

func synchronize(target: Readable & Writable) {
    let data = target.read()
    // Modify data
    target.write(data)
}

func cleanUp(resource: Readable & Deletable) {
    // Archive then delete
    backup(source: resource)
    resource.delete()
}
```

## Real-World Example: SwiftUI-Style Design

Swift's protocol composition enables SwiftUI's design patterns:

```swift
protocol View {
    associatedtype Body: View
    var body: Body { get }
}

protocol Identifiable {
    associatedtype ID: Hashable
    var id: ID { get }
}

// List requires items that are both identifiable and views
struct ListView<Item: Identifiable & View> {
    let items: [Item]
}
```

## Sendable Composition

In concurrent code, compose with `Sendable`:

```swift
protocol DataProvider {
    func fetchData() async throws -> Data
}

actor NetworkManager {
    func load(from provider: DataProvider & Sendable) async throws -> Data {
        try await provider.fetchData()
    }
}
```

## Extension on Composed Types

You can extend composed types:

```swift
extension Readable where Self: Writable {
    func transform(_ modification: (Data) -> Data) {
        let data = read()
        let modified = modification(data)
        write(modified)
    }
}
```

## Key Takeaways

1. Use `&` to combine protocols into composition
2. Class types can be included in composition
3. Create type aliases for reusable compositions
4. Use composition in generic constraints
5. Build precise APIs that require exactly what they need
6. Compose with `Sendable` for concurrent safety

You've now mastered Swift's protocol-oriented programming! These patterns are foundational to building flexible, reusable code in Swift.
