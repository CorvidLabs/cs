---
title: Protocol-Oriented Programming
order: 3
estimatedMinutes: 18
---

# Protocol-Oriented Programming

Protocol-oriented programming (POP) is a paradigm that emphasizes protocols and protocol extensions over class inheritance. It's a core design principle in Swift.

## Why Protocol-Oriented?

Traditional object-oriented programming has limitations:
- Single inheritance restricts code reuse
- Deep hierarchies become hard to maintain
- Subclasses inherit methods they don't need

Protocol-oriented programming solves these:
- Types can conform to multiple protocols
- Behavior is shared through composition
- Default implementations via extensions

## Starting with Protocols

Instead of a class hierarchy, start with protocols:

```swift
// Class-based approach (avoid)
public class Animal {
    public func eat() {}
}
public class Dog: Animal {
    public func bark() {}
}

// Protocol-oriented approach (prefer)
public protocol Eatable {
    func eat()
}

public protocol Barkable {
    func bark()
}

public struct Dog: Eatable, Barkable {
    public func eat() {
        print("Dog eating")
    }

    public func bark() {
        print("Woof!")
    }
}
```

## Protocol Extensions for Shared Behavior

Provide default implementations:

```swift
public protocol Describable {
    var name: String { get }
}

extension Describable {
    public func describe() -> String {
        "This is \(name)"
    }

    public func printDescription() {
        print(describe())
    }
}

public struct Product: Describable {
    public let name: String
    // Gets describe() and printDescription() for free
}

let product = Product(name: "Widget")
product.printDescription()  // This is Widget
```

## Composing Behaviors

Build complex types by combining protocols:

```swift
public protocol Identifiable {
    var id: String { get }
}

public protocol Timestamped {
    var createdAt: Date { get }
    var updatedAt: Date { get set }
}

public protocol Versioned {
    var version: Int { get set }
    mutating func incrementVersion()
}

extension Versioned {
    public mutating func incrementVersion() {
        version += 1
    }
}

public struct Document: Identifiable, Timestamped, Versioned {
    public let id: String
    public let createdAt: Date
    public var updatedAt: Date
    public var version: Int

    public let content: String
}
```

## Protocol Inheritance Hierarchies

Build protocol hierarchies for related functionality:

```swift
public protocol Drawable {
    func draw()
}

public protocol Shape: Drawable {
    var area: Double { get }
    var perimeter: Double { get }
}

public protocol RegularPolygon: Shape {
    var numberOfSides: Int { get }
    var sideLength: Double { get }
}

extension RegularPolygon {
    public var perimeter: Double {
        Double(numberOfSides) * sideLength
    }
}

public struct Square: RegularPolygon {
    public let sideLength: Double
    public let numberOfSides = 4

    public var area: Double {
        sideLength * sideLength
    }

    public func draw() {
        print("Drawing square with side \(sideLength)")
    }
}
```

## Protocol Dispatch

Understanding method dispatch is important:

```swift
public protocol Greeting {
    func greet() -> String
}

extension Greeting {
    public func greet() -> String {
        "Hello"
    }

    public func formalGreet() -> String {
        "Good day"
    }
}

public struct EnglishGreeter: Greeting {
    public func greet() -> String {
        "Hi there!"
    }

    public func formalGreet() -> String {
        "How do you do?"
    }
}

let greeter = EnglishGreeter()
print(greeter.greet())        // Hi there! (overridden)
print(greeter.formalGreet())  // How do you do? (overridden)

let protocol_greeter: Greeting = EnglishGreeter()
print(protocol_greeter.greet())        // Hi there! (dynamic dispatch)
print(protocol_greeter.formalGreet())  // Good day (static dispatch - uses extension!)
```

Only methods declared in the protocol definition get dynamic dispatch.

## Self Requirements

Use `Self` to refer to the conforming type:

```swift
public protocol Copyable {
    func copy() -> Self
}

public struct Document: Copyable {
    public var content: String

    public func copy() -> Document {
        Document(content: content)
    }
}
```

## Protocol Witnesses

The pattern for dependency injection:

```swift
public protocol NetworkClient {
    func fetch(url: URL) async throws -> Data
}

public struct URLSessionClient: NetworkClient {
    public func fetch(url: URL) async throws -> Data {
        let (data, _) = try await URLSession.shared.data(from: url)
        return data
    }
}

public struct MockClient: NetworkClient {
    public let mockData: Data

    public func fetch(url: URL) async throws -> Data {
        mockData
    }
}

public class DataService {
    private let client: NetworkClient

    public init(client: NetworkClient) {
        self.client = client
    }

    public func loadData(from url: URL) async throws -> Data {
        try await client.fetch(url: url)
    }
}

// Production
let prodService = DataService(client: URLSessionClient())

// Testing
let testService = DataService(client: MockClient(mockData: Data()))
```

## Type Erasure

When you need to store protocols with associated types:

```swift
public protocol Container {
    associatedtype Item
    var items: [Item] { get }
    mutating func add(_ item: Item)
}

// Type-erased wrapper
public struct AnyContainer<Item>: Container {
    private var _items: () -> [Item]
    private var _add: (Item) -> Void

    public init<C: Container>(_ container: C) where C.Item == Item {
        var container = container
        _items = { container.items }
        _add = { container.add($0) }
    }

    public var items: [Item] { _items() }
    public mutating func add(_ item: Item) { _add(item) }
}
```

## Existential Types with `any`

Swift 5.6+ uses `any` for existential types:

```swift
public protocol Animal {
    var name: String { get }
    func speak() -> String
}

// Existential type - can hold any Animal
public var pets: [any Animal] = []

public func addPet(_ pet: any Animal) {
    pets.append(pet)
}
```

## Primary Associated Types

Swift 5.7+ allows specifying associated types:

```swift
public protocol Collection<Element> {
    associatedtype Element
    // ...
}

// Can now specify Element type
public func processStrings(_ collection: any Collection<String>) {
    // Work with String elements
}
```

## Real-World Example: Validation

```swift
public protocol Validator {
    associatedtype Input
    func validate(_ input: Input) -> Bool
    var errorMessage: String { get }
}

public struct EmailValidator: Validator {
    public let errorMessage = "Invalid email format"

    public func validate(_ input: String) -> Bool {
        input.contains("@") && input.contains(".")
    }
}

public struct LengthValidator: Validator {
    public let minLength: Int
    public let maxLength: Int

    public var errorMessage: String {
        "Length must be between \(minLength) and \(maxLength)"
    }

    public func validate(_ input: String) -> Bool {
        input.count >= minLength && input.count <= maxLength
    }
}

public struct CompositeValidator<Input>: Validator {
    private let validators: [(Input) -> Bool]
    public let errorMessage: String

    public init<V: Validator>(validators: [V]) where V.Input == Input {
        self.validators = validators.map { v in { v.validate($0) } }
        self.errorMessage = validators.map { $0.errorMessage }.joined(separator: "; ")
    }

    public func validate(_ input: Input) -> Bool {
        validators.allSatisfy { $0(input) }
    }
}
```

## Key Takeaways

1. Start with protocols, not classes
2. Use protocol extensions for shared default behavior
3. Compose types from multiple focused protocols
4. Only protocol-declared methods get dynamic dispatch
5. Use `Self` for methods that return the conforming type
6. Protocol witnesses enable dependency injection
7. Use `any` for existential types (Swift 5.6+)
8. POP encourages composition over inheritance

In the next lesson, we'll explore associated types for even more powerful abstractions.
