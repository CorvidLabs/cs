---
title: Associated Types
order: 4
estimatedMinutes: 16
---

# Associated Types

Associated types allow protocols to define placeholder types that conforming types must specify. They make protocols more flexible and enable powerful generic abstractions.

## Basic Associated Types

Define associated types with `associatedtype`:

```swift
public protocol Container {
    associatedtype Item

    var count: Int { get }
    mutating func append(_ item: Item)
    subscript(index: Int) -> Item { get }
}

public struct IntStack: Container {
    // Item is inferred as Int
    private var items: [Int] = []

    public var count: Int { items.count }

    public mutating func append(_ item: Int) {
        items.append(item)
    }

    public subscript(index: Int) -> Int {
        items[index]
    }
}
```

## Explicit Type Alias

Explicitly specify the associated type:

```swift
public struct StringContainer: Container {
    public typealias Item = String

    private var items: [String] = []

    public var count: Int { items.count }

    public mutating func append(_ item: String) {
        items.append(item)
    }

    public subscript(index: Int) -> String {
        items[index]
    }
}
```

## Generic Types with Associated Types

```swift
public struct Stack<Element>: Container {
    public typealias Item = Element

    private var items: [Element] = []

    public var count: Int { items.count }

    public mutating func append(_ item: Element) {
        items.append(item)
    }

    public subscript(index: Int) -> Element {
        items[index]
    }

    public mutating func push(_ item: Element) {
        append(item)
    }

    public mutating func pop() -> Element? {
        items.isEmpty ? nil : items.removeLast()
    }
}

var intStack = Stack<Int>()
intStack.push(1)
intStack.push(2)
print(intStack.pop())  // Optional(2)
```

## Constraining Associated Types

Add constraints to associated types:

```swift
public protocol Repository {
    associatedtype Entity: Identifiable

    func fetch(id: Entity.ID) -> Entity?
    func save(_ entity: Entity)
    func delete(id: Entity.ID)
}

public struct User: Identifiable {
    public let id: UUID
    public var name: String
}

public struct UserRepository: Repository {
    private var storage: [UUID: User] = [:]

    public func fetch(id: UUID) -> User? {
        storage[id]
    }

    public mutating func save(_ entity: User) {
        storage[entity.id] = entity
    }

    public mutating func delete(id: UUID) {
        storage.removeValue(forKey: id)
    }
}
```

## Multiple Associated Types

Protocols can have multiple associated types:

```swift
public protocol KeyValueStore {
    associatedtype Key: Hashable
    associatedtype Value

    func get(_ key: Key) -> Value?
    mutating func set(_ key: Key, value: Value)
    mutating func remove(_ key: Key)
}

public struct InMemoryStore<StorageKey: Hashable, StorageValue>: KeyValueStore {
    public typealias Key = StorageKey
    public typealias Value = StorageValue

    private var storage: [StorageKey: StorageValue] = [:]

    public func get(_ key: StorageKey) -> StorageValue? {
        storage[key]
    }

    public mutating func set(_ key: StorageKey, value: StorageValue) {
        storage[key] = value
    }

    public mutating func remove(_ key: StorageKey) {
        storage.removeValue(forKey: key)
    }
}
```

## Associated Types with Where Clauses

Add constraints using where:

```swift
public protocol Sequence {
    associatedtype Iterator: IteratorProtocol
    associatedtype Element where Element == Iterator.Element

    func makeIterator() -> Iterator
}
```

## Using Protocols with Associated Types

Protocols with associated types can't be used directly as types:

```swift
public protocol Container {
    associatedtype Item
    var count: Int { get }
}

// Error: Protocol 'Container' can only be used as a generic constraint
// let container: Container = IntStack()

// Use generics instead:
public func printCount<C: Container>(_ container: C) {
    print("Contains \(container.count) items")
}

// Or use 'any' (existential type - Swift 5.6+)
public func printCountAny(_ container: any Container) {
    print("Contains \(container.count) items")
}
```

## Generic Where Clauses

Constrain associated types in functions:

```swift
public protocol Container {
    associatedtype Item
    var count: Int { get }
    subscript(index: Int) -> Item { get }
}

public func allItemsMatch<C1: Container, C2: Container>(
    _ c1: C1,
    _ c2: C2
) -> Bool where C1.Item == C2.Item, C1.Item: Equatable {
    guard c1.count == c2.count else { return false }

    for i in 0..<c1.count {
        if c1[i] != c2[i] {
            return false
        }
    }
    return true
}
```

## Self-Referencing Associated Types

Associated types can reference the protocol itself:

```swift
public protocol Node {
    associatedtype Child: Node
    var children: [Child] { get }
}

public struct TreeNode: Node {
    public var children: [TreeNode]
}
```

## Protocol Inheritance with Associated Types

```swift
public protocol Collection {
    associatedtype Element
    var isEmpty: Bool { get }
}

public protocol SortableCollection: Collection where Element: Comparable {
    func sorted() -> [Element]
}

extension SortableCollection {
    public func sorted() -> [Element] {
        // Default implementation using Element: Comparable
        []
    }
}
```

## Primary Associated Types (Swift 5.7+)

Declare primary associated types for easier use:

```swift
public protocol Container<Element> {
    associatedtype Element
    var count: Int { get }
    mutating func append(_ item: Element)
}

// Can now specify the associated type directly
public func processStrings(_ container: any Container<String>) {
    print("String container with \(container.count) items")
}

// Generic constraints are also cleaner
public func processItems<C: Container<Int>>(_ container: C) {
    // Work with Int containers
}
```

## Practical Example: Event System

```swift
public protocol Event {
    associatedtype Payload
    var timestamp: Date { get }
    var payload: Payload { get }
}

public protocol EventHandler {
    associatedtype EventType: Event
    func handle(_ event: EventType)
}

public struct UserCreatedEvent: Event {
    public struct Payload {
        public let userId: String
        public let email: String
    }

    public let timestamp = Date()
    public let payload: Payload
}

public struct UserCreatedHandler: EventHandler {
    public func handle(_ event: UserCreatedEvent) {
        print("User created: \(event.payload.userId)")
    }
}

public struct EventBus {
    private var handlers: [String: [(Any) -> Void]] = [:]

    public mutating func register<Handler: EventHandler>(
        _ handler: Handler
    ) {
        let key = String(describing: Handler.EventType.self)
        handlers[key, default: []].append { event in
            if let typedEvent = event as? Handler.EventType {
                handler.handle(typedEvent)
            }
        }
    }

    public func dispatch<E: Event>(_ event: E) {
        let key = String(describing: E.self)
        handlers[key]?.forEach { $0(event) }
    }
}
```

## Key Takeaways

1. Associated types are placeholder types in protocols
2. Conforming types specify concrete types for associated types
3. Swift often infers associated types from method signatures
4. Use `where` clauses to add constraints
5. Protocols with associated types require generics or `any`
6. Primary associated types (Swift 5.7+) simplify syntax
7. Associated types enable powerful, type-safe abstractions
8. Multiple protocols can have relationships through their associated types

You've completed the Protocols and Extensions module! You now understand Swift's protocol-oriented programming paradigm.
