---
title: Extensions
order: 2
estimatedMinutes: 16
---

# Extensions

Extensions add new functionality to existing types, including types you don't own. They're a powerful way to organize code and add capabilities without subclassing.

## Basic Extension Syntax

```swift
extension String {
    public var wordCount: Int {
        self.split(separator: " ").count
    }
}

let sentence = "Hello Swift World"
print(sentence.wordCount)  // 3
```

## Adding Computed Properties

Extensions can add computed properties but not stored properties:

```swift
extension Double {
    public var km: Double { self * 1000.0 }
    public var m: Double { self }
    public var cm: Double { self / 100.0 }
    public var mm: Double { self / 1000.0 }
}

let distance = 5.km
print(distance)  // 5000.0

let marathon = 42.195.km
print(marathon)  // 42195.0
```

## Adding Methods

```swift
extension Int {
    public func times(_ action: () -> Void) {
        for _ in 0..<self {
            action()
        }
    }

    public func squared() -> Int {
        self * self
    }

    public var isEven: Bool {
        self % 2 == 0
    }
}

3.times {
    print("Hello!")
}
// Prints Hello! three times

print(5.squared())  // 25
print(4.isEven)     // true
```

## Mutating Methods

Extensions can add mutating methods to value types:

```swift
extension Int {
    public mutating func square() {
        self = self * self
    }
}

var number = 5
number.square()
print(number)  // 25
```

## Adding Initializers

Extensions can add convenience initializers:

```swift
extension CGRect {
    public init(center: CGPoint, size: CGSize) {
        let origin = CGPoint(
            x: center.x - size.width / 2,
            y: center.y - size.height / 2
        )
        self.init(origin: origin, size: size)
    }
}

let rect = CGRect(
    center: CGPoint(x: 50, y: 50),
    size: CGSize(width: 20, height: 20)
)
// rect.origin is (40, 40)
```

## Extending Protocols

Add default implementations to protocols:

```swift
public protocol Greetable {
    var name: String { get }
    func greet() -> String
}

extension Greetable {
    public func greet() -> String {
        "Hello, \(name)!"
    }
}

public struct Person: Greetable {
    public let name: String
    // Uses default greet() implementation
}

let person = Person(name: "Alice")
print(person.greet())  // Hello, Alice!
```

## Protocol Conformance via Extensions

Add protocol conformance in extensions:

```swift
public struct Temperature {
    public var celsius: Double
}

extension Temperature: CustomStringConvertible {
    public var description: String {
        "\(celsius)°C"
    }
}

extension Temperature: Equatable {
    public static func == (lhs: Temperature, rhs: Temperature) -> Bool {
        lhs.celsius == rhs.celsius
    }
}

let temp = Temperature(celsius: 25)
print(temp)  // 25°C
```

## Conditional Conformance

Add conformance only when conditions are met:

```swift
extension Array: Summable where Element: Numeric {
    public func sum() -> Element {
        reduce(0, +)
    }
}

public protocol Summable {
    associatedtype Value: Numeric
    func sum() -> Value
}

let numbers = [1, 2, 3, 4, 5]
print(numbers.sum())  // 15

// strings.sum() would not compile - String is not Numeric
```

More examples:

```swift
// Array is Equatable when its elements are Equatable
extension Array: Equatable where Element: Equatable {}

// Optional is Comparable when its wrapped value is Comparable
extension Optional: Comparable where Wrapped: Comparable {
    public static func < (lhs: Optional, rhs: Optional) -> Bool {
        switch (lhs, rhs) {
        case let (l?, r?): return l < r
        case (nil, _?): return true
        default: return false
        }
    }
}
```

## Extending Generic Types

```swift
extension Array {
    public var second: Element? {
        guard count > 1 else { return nil }
        return self[1]
    }

    public func shuffled() -> [Element] {
        var result = self
        result.shuffle()
        return result
    }
}

let fruits = ["apple", "banana", "cherry"]
print(fruits.second ?? "none")  // banana
```

## Where Clauses in Extensions

```swift
extension Array where Element: Comparable {
    public func isSorted() -> Bool {
        guard count > 1 else { return true }
        for i in 1..<count {
            if self[i] < self[i-1] {
                return false
            }
        }
        return true
    }
}

print([1, 2, 3].isSorted())  // true
print([3, 1, 2].isSorted())  // false
```

## Nested Types in Extensions

```swift
extension Int {
    public enum Kind {
        case negative, zero, positive
    }

    public var kind: Kind {
        switch self {
        case ..<0: return .negative
        case 0: return .zero
        default: return .positive
        }
    }
}

print(5.kind)   // positive
print((-3).kind) // negative
print(0.kind)   // zero
```

## Organizing Code with Extensions

Use extensions to group related functionality:

```swift
public struct User {
    public let id: String
    public var name: String
    public var email: String
}

// MARK: - Validation
extension User {
    public var isValid: Bool {
        !name.isEmpty && email.contains("@")
    }

    public func validate() throws {
        guard !name.isEmpty else {
            throw ValidationError.emptyName
        }
        guard email.contains("@") else {
            throw ValidationError.invalidEmail
        }
    }
}

// MARK: - Display
extension User: CustomStringConvertible {
    public var description: String {
        "\(name) <\(email)>"
    }
}

// MARK: - Codable
extension User: Codable {}
```

## Extensions on Foundation Types

```swift
extension String {
    public var isBlank: Bool {
        trimmingCharacters(in: .whitespaces).isEmpty
    }

    public func truncated(to length: Int) -> String {
        if count <= length { return self }
        return String(prefix(length)) + "..."
    }
}

extension Date {
    public var isToday: Bool {
        Calendar.current.isDateInToday(self)
    }

    public var startOfDay: Date {
        Calendar.current.startOfDay(for: self)
    }
}

extension Array {
    public func chunked(into size: Int) -> [[Element]] {
        stride(from: 0, to: count, by: size).map {
            Array(self[$0..<Swift.min($0 + size, count)])
        }
    }
}

let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers.chunked(into: 3))  // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
```

## Key Takeaways

1. Extensions add functionality to existing types
2. Can add computed properties, methods, and initializers
3. Cannot add stored properties
4. Use `mutating` for methods that modify value types
5. Add protocol conformance through extensions
6. Use `where` clauses for conditional extensions
7. Organize code by grouping related functionality in extensions
8. Extensions work on types you don't own (Foundation, etc.)

In the next lesson, we'll explore protocol-oriented programming patterns.
