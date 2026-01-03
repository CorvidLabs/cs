---
title: Protocols
order: 1
estimatedMinutes: 18
---

# Protocols

Protocols define a blueprint of methods, properties, and other requirements for a type to conform to. They're the foundation of Swift's protocol-oriented programming.

## Defining Protocols

Use the `protocol` keyword:

```swift
public protocol Vehicle {
    var numberOfWheels: Int { get }
    var maxSpeed: Double { get }

    func start()
    func stop()
}
```

## Property Requirements

Protocols specify whether properties are gettable or gettable and settable:

```swift
public protocol Named {
    var name: String { get }  // Read-only
}

public protocol Configurable {
    var isEnabled: Bool { get set }  // Read-write
}
```

A conforming type can provide more access than required:

```swift
public struct User: Named {
    public var name: String  // var satisfies { get }
}
```

## Method Requirements

```swift
public protocol Drawable {
    func draw()
    func draw(at point: CGPoint)
}

public protocol Resizable {
    mutating func resize(to size: CGSize)  // mutating for value types
}
```

## Conforming to Protocols

```swift
public struct Car: Vehicle {
    public var numberOfWheels: Int { 4 }
    public var maxSpeed: Double { 200.0 }

    public func start() {
        print("Engine starting...")
    }

    public func stop() {
        print("Engine stopping...")
    }
}

public struct Bicycle: Vehicle {
    public var numberOfWheels: Int { 2 }
    public var maxSpeed: Double { 30.0 }

    public func start() {
        print("Start pedaling!")
    }

    public func stop() {
        print("Apply brakes!")
    }
}
```

## Multiple Protocol Conformance

Types can conform to multiple protocols:

```swift
public protocol Identifiable {
    var id: String { get }
}

public protocol Timestamped {
    var createdAt: Date { get }
}

public struct Document: Identifiable, Timestamped {
    public let id: String
    public let createdAt: Date
    public let content: String
}
```

## Protocol Inheritance

Protocols can inherit from other protocols:

```swift
public protocol Printable {
    func printDescription()
}

public protocol DetailedPrintable: Printable {
    func printDetailedDescription()
}

public struct Report: DetailedPrintable {
    public let title: String

    public func printDescription() {
        print(title)
    }

    public func printDetailedDescription() {
        print("Report: \(title)")
    }
}
```

## Class-Only Protocols

Restrict protocols to class types with `AnyObject`:

```swift
public protocol Delegate: AnyObject {
    func didComplete()
}

public class Manager {
    public weak var delegate: Delegate?  // Can use weak because it's class-only
}
```

## Protocol Composition

Combine multiple protocols with `&`:

```swift
public protocol Named {
    var name: String { get }
}

public protocol Aged {
    var age: Int { get }
}

public func wish(happyBirthday person: Named & Aged) {
    print("Happy birthday, \(person.name)! You're \(person.age)!")
}

public struct Person: Named, Aged {
    public let name: String
    public let age: Int
}

let user = Person(name: "Alice", age: 30)
wish(happyBirthday: user)  // Happy birthday, Alice! You're 30!
```

## Protocol as Types

Protocols can be used as types:

```swift
public protocol Animal {
    var sound: String { get }
    func makeSound()
}

public struct Dog: Animal {
    public var sound: String { "Woof!" }
    public func makeSound() { print(sound) }
}

public struct Cat: Animal {
    public var sound: String { "Meow!" }
    public func makeSound() { print(sound) }
}

// Protocol as type
let pets: [Animal] = [Dog(), Cat(), Dog()]
for pet in pets {
    pet.makeSound()
}
```

## Checking Protocol Conformance

Use `is` and `as` for protocol type checking:

```swift
public protocol Flyable {
    func fly()
}

public struct Bird: Animal, Flyable {
    public var sound: String { "Chirp!" }
    public func makeSound() { print(sound) }
    public func fly() { print("Flying high!") }
}

let creatures: [Animal] = [Dog(), Bird(), Cat()]

for creature in creatures {
    if let flyable = creature as? Flyable {
        flyable.fly()
    }

    if creature is Flyable {
        print("This one can fly!")
    }
}
```

## Optional Protocol Requirements

Use `@objc` for optional requirements (Objective-C compatibility):

```swift
@objc public protocol DataSourceDelegate {
    func numberOfItems() -> Int
    @objc optional func titleForItem(at index: Int) -> String
}
```

For pure Swift, use default implementations instead:

```swift
public protocol DataSource {
    func numberOfItems() -> Int
    func titleForItem(at index: Int) -> String
}

public extension DataSource {
    func titleForItem(at index: Int) -> String {
        return "Item \(index)"  // Default implementation
    }
}
```

## Initializer Requirements

```swift
public protocol Initializable {
    init()
    init(value: Int)
}

public class BaseClass: Initializable {
    public required init() {}
    public required init(value: Int) {}
}

public final class FinalClass: Initializable {
    public init() {}
    public init(value: Int) {}
}
```

## Common Standard Library Protocols

```swift
// Equatable - enables == comparison
public struct Point: Equatable {
    public let x: Int
    public let y: Int
}
let p1 = Point(x: 1, y: 2)
let p2 = Point(x: 1, y: 2)
print(p1 == p2)  // true

// Comparable - enables <, >, <=, >= comparison
public struct Score: Comparable {
    public let value: Int

    public static func < (lhs: Score, rhs: Score) -> Bool {
        lhs.value < rhs.value
    }
}

// Hashable - enables use in Sets and as Dictionary keys
public struct ID: Hashable {
    public let value: String
}

// Codable - enables encoding/decoding
public struct Config: Codable {
    public let name: String
    public let enabled: Bool
}

// CustomStringConvertible - custom description
public struct Item: CustomStringConvertible {
    public let name: String

    public var description: String {
        "Item: \(name)"
    }
}
```

## Key Takeaways

1. Protocols define requirements for types to conform to
2. Properties can be `{ get }` or `{ get set }`
3. Use `mutating` for methods that modify value types
4. Types can conform to multiple protocols
5. Protocols can inherit from other protocols
6. Use `AnyObject` for class-only protocols
7. Combine protocols with `&` for protocol composition
8. Protocols can be used as types for polymorphism
9. Prefer default implementations over `@objc optional`

In the next lesson, we'll learn about extensions to add functionality to existing types.
