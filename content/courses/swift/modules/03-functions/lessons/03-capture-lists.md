---
title: Capture Lists
order: 3
estimatedMinutes: 16
---

# Capture Lists

When closures capture values from their surrounding scope, they can create strong reference cycles that lead to memory leaks. Capture lists give you control over how values are captured.

## How Closures Capture Values

By default, closures capture references to variables, not copies:

```swift
var value = 10

let closure = {
    print(value)  // Captures reference to 'value'
}

value = 20
closure()  // Prints: 20 (not 10!)
```

The closure sees the current value at execution time, not capture time.

## Capture Lists Syntax

Capture lists define how values are captured:

```swift
{ [captureList] (parameters) -> ReturnType in
    // code
}
```

## Capturing by Value

Use capture lists to capture the current value:

```swift
var value = 10

let closure = { [value] in
    print(value)  // Captures value by copy
}

value = 20
closure()  // Prints: 10 (the value at capture time)
```

## The Strong Reference Cycle Problem

Classes and closures can create reference cycles:

```swift
public class NetworkManager {
    public var onComplete: (() -> Void)?
    public var name: String = "Manager"

    public init() {}

    public func startRequest() {
        // This creates a strong reference cycle!
        onComplete = {
            print("Request completed by \(self.name)")
            // self -> onComplete -> closure -> self
        }
    }

    deinit {
        print("NetworkManager deallocated")
    }
}

var manager: NetworkManager? = NetworkManager()
manager?.startRequest()
manager = nil  // Manager is NOT deallocated - memory leak!
```

## Weak References

Use `weak` to break reference cycles:

```swift
public class NetworkManager {
    public var onComplete: (() -> Void)?
    public var name: String = "Manager"

    public init() {}

    public func startRequest() {
        // Capture self as weak to break the cycle
        onComplete = { [weak self] in
            guard let self = self else {
                print("Manager was deallocated")
                return
            }
            print("Request completed by \(self.name)")
        }
    }

    deinit {
        print("NetworkManager deallocated")
    }
}

var manager: NetworkManager? = NetworkManager()
manager?.startRequest()
manager = nil  // Prints: NetworkManager deallocated
```

## Unowned References

Use `unowned` when you're certain the captured reference will never be nil:

```swift
public class Customer {
    public let name: String
    public var card: CreditCard?

    public init(name: String) {
        self.name = name
    }

    deinit {
        print("\(name) is being deallocated")
    }
}

public class CreditCard {
    public let number: String
    public unowned let customer: Customer

    public init(number: String, customer: Customer) {
        self.number = number
        self.customer = customer
    }

    public var description: String {
        // Safe to use unowned here - card can't exist without customer
        "Card \(number) belongs to \(customer.name)"
    }

    deinit {
        print("Card \(number) is being deallocated")
    }
}
```

In closures:

```swift
public class HTMLElement {
    public let name: String
    public let text: String?

    public lazy var asHTML: () -> String = { [unowned self] in
        if let text = self.text {
            return "<\(self.name)>\(text)</\(self.name)>"
        } else {
            return "<\(self.name) />"
        }
    }

    public init(name: String, text: String? = nil) {
        self.name = name
        self.text = text
    }

    deinit {
        print("\(name) is being deallocated")
    }
}
```

## Weak vs Unowned

| Aspect | weak | unowned |
|--------|------|---------|
| Type | Optional (`T?`) | Non-optional (`T`) |
| When nil | Becomes nil | Crashes if accessed |
| Use when | Reference might become nil | Reference will never be nil |
| Overhead | Slight (nil checking) | None |

### When to Use Weak

Use `weak` when the captured object might be deallocated while the closure exists:

```swift
public class ViewController {
    public var name: String = "Main"

    public func loadData() {
        // Use weak - the view controller might be dismissed
        fetchData { [weak self] result in
            guard let self = self else { return }
            self.updateUI(with: result)
        }
    }

    private func updateUI(with result: String) {
        print("Updating \(name) with \(result)")
    }

    private func fetchData(completion: @escaping (String) -> Void) {
        // Simulated async operation
        completion("Data loaded")
    }
}
```

### When to Use Unowned

Use `unowned` when the captured object will always outlive the closure:

```swift
public class Animation {
    public var duration: Double = 1.0
    public var onComplete: (() -> Void)?

    public func start() {
        // Safe to use unowned - animation owns the closure
        // and will exist for its entire duration
        performAnimation { [unowned self] in
            self.onComplete?()
        }
    }

    private func performAnimation(completion: @escaping () -> Void) {
        // Animation logic
        completion()
    }
}
```

## Multiple Captures

Capture multiple values in a single capture list:

```swift
public class DataManager {
    public var data: [String] = []
    public var logger: Logger?

    public func process() {
        // Capture self weakly, logger strongly
        performWork { [weak self, logger] result in
            self?.data.append(result)
            logger?.log(result)
        }
    }

    private func performWork(completion: @escaping (String) -> Void) {
        completion("Result")
    }
}

public class Logger {
    public func log(_ message: String) {
        print("Log: \(message)")
    }
}
```

## Capturing Value Types

Value types are copied, so capture lists aren't always necessary:

```swift
var counter = 0

let increment = {
    counter += 1  // Captures reference to counter
}

// To capture the current value:
let currentValue = counter
let capture = { [currentValue] in
    print(currentValue)  // Always prints the captured value
}
```

## Common Patterns

### Pattern 1: Guard Let Self

```swift
public class ViewController {
    public func loadData() {
        fetchData { [weak self] result in
            guard let self = self else { return }
            // Now use self safely
            self.handleResult(result)
        }
    }

    private func handleResult(_ result: String) {
        print(result)
    }

    private func fetchData(completion: @escaping (String) -> Void) {
        completion("Data")
    }
}
```

### Pattern 2: Optional Chaining

```swift
public class ViewController {
    public var label: String = ""

    public func loadData() {
        fetchData { [weak self] result in
            // Simpler for single operations
            self?.label = result
        }
    }

    private func fetchData(completion: @escaping (String) -> Void) {
        completion("Data")
    }
}
```

### Pattern 3: Unowned When Ownership Is Clear

```swift
public class Button {
    public var action: (() -> Void)?

    public init(action: (() -> Void)? = nil) {
        self.action = action
    }
}

public class Form {
    public let submitButton: Button

    public init() {
        self.submitButton = Button()
        // Form owns the button, so we can use unowned
        submitButton.action = { [unowned self] in
            self.submit()
        }
    }

    private func submit() {
        print("Form submitted")
    }
}
```

## Debugging Memory Issues

Use Xcode's Memory Graph Debugger or Instruments to find retain cycles. Look for objects that aren't deallocated when expected.

## Key Takeaways

1. Closures capture references by default, not copies
2. Use `[value]` to capture current value instead of reference
3. Use `[weak self]` when self might be deallocated during closure execution
4. Use `[unowned self]` when you're certain self will outlive the closure
5. Always use `guard let self` or optional chaining with weak references
6. Multiple captures: `[weak self, strong logger]`
7. Watch for retain cycles in callbacks and completion handlers

In the next lesson, we'll learn about escaping closures and their special requirements.
