---
title: Protocol Extensions
order: 3
estimatedMinutes: 15
---

# Protocol Extensions and Default Implementations

Protocol extensions are one of Swift's most powerful features. They allow you to provide default implementations for protocol requirements and add new functionality to all conforming types.

## Default Implementations

Instead of requiring every conforming type to implement a method, you can provide a default:

```swift
protocol Greetable {
    var name: String { get }
    func greet()
}

extension Greetable {
    func greet() {
        print("Hello, I'm \(name)")
    }
}

struct Person: Greetable {
    let name: String
    // greet() is automatically available with default implementation
}

let person = Person(name: "Alice")
person.greet()  // "Hello, I'm Alice"
```

## Overriding Default Implementations

Conforming types can provide their own implementations:

```swift
struct Robot: Greetable {
    let name: String

    func greet() {
        print("BEEP BOOP. I AM \(name.uppercased()).")
    }
}

let robot = Robot(name: "R2D2")
robot.greet()  // "BEEP BOOP. I AM R2D2."
```

## Adding New Methods

Protocol extensions can add methods that aren't part of the protocol requirements:

```swift
protocol Describable {
    var description: String { get }
}

extension Describable {
    func printDescription() {
        print(description)
    }

    func formattedDescription(prefix: String) -> String {
        "\(prefix): \(description)"
    }
}
```

All conforming types automatically get these methods.

## Constrained Extensions

You can add methods only when certain conditions are met:

```swift
protocol Container {
    associatedtype Element
    var items: [Element] { get }
}

extension Container where Element: Equatable {
    func contains(_ element: Element) -> Bool {
        items.contains(element)
    }
}

extension Container where Element: Numeric {
    func sum() -> Element {
        items.reduce(0, +)
    }
}
```

The `contains` method is only available when `Element` conforms to `Equatable`, and `sum` only when `Element` is `Numeric`.

## Extending Standard Library Protocols

You can extend protocols from the standard library:

```swift
extension Collection where Element: Numeric {
    var total: Element {
        reduce(0, +)
    }

    var average: Double where Element: BinaryInteger {
        guard !isEmpty else { return 0 }
        return Double(total) / Double(count)
    }
}

let numbers = [1, 2, 3, 4, 5]
print(numbers.total)    // 15
print(numbers.average)  // 3.0
```

## Protocol Extension Priority

When a type provides its own implementation, it takes precedence:

```swift
protocol Printable {
    func show()
}

extension Printable {
    func show() {
        print("Default implementation")
    }
}

struct Custom: Printable {
    func show() {
        print("Custom implementation")
    }
}

let item = Custom()
item.show()  // "Custom implementation"

let printable: Printable = Custom()
printable.show()  // "Custom implementation"
```

## Static Dispatch vs Dynamic Dispatch

Methods defined in the protocol (not just extension) use dynamic dispatch:

```swift
protocol Animal {
    func speak()  // Protocol requirement
}

extension Animal {
    func speak() {
        print("...")
    }

    func identify() {  // Extension-only method
        print("I am an animal")
    }
}

struct Dog: Animal {
    func speak() {
        print("Woof!")
    }

    func identify() {
        print("I am a dog")
    }
}

let dog = Dog()
dog.speak()     // "Woof!"
dog.identify()  // "I am a dog"

let animal: Animal = Dog()
animal.speak()     // "Woof!" (dynamic dispatch - calls Dog's implementation)
animal.identify()  // "I am an animal" (static dispatch - calls extension)
```

## Computed Properties in Extensions

Add computed properties via extensions:

```swift
protocol Sized {
    var width: Double { get }
    var height: Double { get }
}

extension Sized {
    var area: Double {
        width * height
    }

    var perimeter: Double {
        2 * (width + height)
    }
}
```

## Key Takeaways

1. Protocol extensions provide default implementations
2. Conforming types can override defaults
3. Extensions can add methods beyond protocol requirements
4. Use `where` clauses for constrained extensions
5. Protocol methods use dynamic dispatch; extension-only methods use static dispatch
6. Extensions can add computed properties

Next, we'll explore protocol composition for building flexible abstractions.
