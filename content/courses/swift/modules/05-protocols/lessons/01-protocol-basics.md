---
title: Protocol Basics
order: 1
estimatedMinutes: 15
---

# Understanding Protocols

Protocols are a fundamental part of Swift programming. They define a blueprint of methods, properties, and other requirements that suit a particular task or piece of functionality.

## What is a Protocol?

A protocol defines a contract that types can adopt. When a type conforms to a protocol, it promises to implement all the requirements that protocol specifies:

```swift
protocol Identifiable {
    var id: String { get }
}
```

This protocol requires any conforming type to have a readable `id` property of type `String`.

## Property Requirements

Protocols can require properties with specific access levels:

```swift
protocol Named {
    var name: String { get }        // Read-only required
    var nickname: String { get set } // Read-write required
}
```

- `{ get }` means the property must be readable (can be a constant or variable)
- `{ get set }` means the property must be readable AND writable (must be a variable)

## Method Requirements

Protocols can require methods without providing implementations:

```swift
protocol Drawable {
    func draw()
    func draw(at point: Point)
}
```

Conforming types must implement all required methods.

## Mutating Method Requirements

For value types (structs and enums) that need to modify `self`, use `mutating`:

```swift
protocol Togglable {
    mutating func toggle()
}

struct Switch: Togglable {
    var isOn = false

    mutating func toggle() {
        isOn.toggle()
    }
}
```

Classes don't need the `mutating` keyword when implementing these methods.

## Initializer Requirements

Protocols can require specific initializers:

```swift
protocol Configurable {
    init(configuration: [String: Any])
}
```

When a class conforms to a protocol with an initializer requirement, it must be marked `required`:

```swift
class Service: Configurable {
    required init(configuration: [String: Any]) {
        // Implementation
    }
}
```

## Associated Types

Protocols can have associated types, making them generic:

```swift
protocol Container {
    associatedtype Item
    mutating func append(_ item: Item)
    var count: Int { get }
}
```

The conforming type decides what `Item` actually is:

```swift
struct IntStack: Container {
    typealias Item = Int  // Optional - Swift can infer this

    private var items: [Int] = []

    mutating func append(_ item: Int) {
        items.append(item)
    }

    var count: Int {
        items.count
    }
}
```

## Protocol Inheritance

Protocols can inherit from other protocols:

```swift
protocol Identifiable {
    var id: String { get }
}

protocol Nameable {
    var name: String { get }
}

protocol User: Identifiable, Nameable {
    var email: String { get }
}
```

Any type conforming to `User` must satisfy all three requirements.

## Key Takeaways

1. Protocols define a contract of requirements
2. Properties use `{ get }` or `{ get set }` to specify access
3. Methods define signatures without implementations
4. Use `mutating` for methods that modify value types
5. Associated types make protocols generic
6. Protocols can inherit from other protocols

Next, we'll learn how types conform to protocols and implement their requirements.
