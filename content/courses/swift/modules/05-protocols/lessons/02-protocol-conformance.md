---
title: Protocol Conformance
order: 2
estimatedMinutes: 15
---

# Conforming to Protocols

Now that you understand what protocols define, let's learn how types adopt and implement them.

## Basic Conformance

To conform to a protocol, add it after a colon following the type name:

```swift
protocol Greetable {
    var greeting: String { get }
    func greet()
}

struct Person: Greetable {
    let name: String

    var greeting: String {
        "Hello, I'm \(name)"
    }

    func greet() {
        print(greeting)
    }
}
```

## Conformance with Extensions

You can add protocol conformance in an extension, which is great for organizing code:

```swift
struct Employee {
    let id: String
    let name: String
    let department: String
}

extension Employee: Greetable {
    var greeting: String {
        "\(name) from \(department)"
    }

    func greet() {
        print("Hi! \(greeting)")
    }
}
```

This separates the core type definition from protocol implementations.

## Extending Existing Types

You can make existing types conform to new protocols:

```swift
protocol Describable {
    var description: String { get }
}

extension Int: Describable {
    var description: String {
        "The number \(self)"
    }
}

let number = 42
print(number.description)  // "The number 42"
```

## Multiple Protocol Conformance

Types can conform to multiple protocols:

```swift
protocol Identifiable {
    var id: String { get }
}

protocol Timestamped {
    var createdAt: Date { get }
}

struct Document: Identifiable, Timestamped {
    let id: String
    let title: String
    let createdAt: Date
}
```

## Class Inheritance with Protocols

When a class has a superclass, list it first, then protocols:

```swift
class Vehicle {
    var speed: Double = 0
}

protocol Describable {
    var description: String { get }
}

class Car: Vehicle, Describable {
    let make: String
    let model: String

    init(make: String, model: String) {
        self.make = make
        self.model = model
    }

    var description: String {
        "\(make) \(model) traveling at \(speed) mph"
    }
}
```

## Protocol Types

You can use protocols as types:

```swift
func introduce(_ entity: Greetable) {
    entity.greet()
}

let person = Person(name: "Alice")
introduce(person)  // Works because Person conforms to Greetable
```

## Arrays of Protocol Types

Store different types that share a protocol:

```swift
struct Robot: Greetable {
    let model: String

    var greeting: String {
        "Beep boop, I am \(model)"
    }

    func greet() {
        print(greeting)
    }
}

let greeters: [Greetable] = [
    Person(name: "Alice"),
    Robot(model: "R2D2")
]

for greeter in greeters {
    greeter.greet()
}
```

## Checking Protocol Conformance

Use `is` and `as` for runtime checks:

```swift
func process(_ item: Any) {
    if let greetable = item as? Greetable {
        greetable.greet()
    } else {
        print("Item cannot greet")
    }
}
```

## Self Requirements

Some protocols have a `Self` requirement, meaning they can only be used with concrete types:

```swift
protocol Copyable {
    func copy() -> Self
}

final class Document: Copyable {
    let content: String

    init(content: String) {
        self.content = content
    }

    func copy() -> Document {
        Document(content: content)
    }
}
```

## Key Takeaways

1. Add protocol names after a colon to conform
2. Extensions can add conformance separately from type definition
3. Existing types can adopt new protocols via extensions
4. Types can conform to multiple protocols
5. Protocols can be used as types for flexible APIs
6. Use `is` and `as?` for runtime protocol checks

Next, we'll explore protocol extensions and default implementations.
