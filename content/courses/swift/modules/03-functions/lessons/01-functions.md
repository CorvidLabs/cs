---
title: Functions
order: 1
estimatedMinutes: 18
---

# Functions

Functions are self-contained chunks of code that perform a specific task. Swift functions are powerful and flexible, with named parameters, default values, and multiple return values.

## Defining Functions

Use the `func` keyword to define a function:

```swift
public func greet() {
    print("Hello, World!")
}

greet()  // Prints: Hello, World!
```

## Parameters

Functions can accept parameters:

```swift
public func greet(name: String) {
    print("Hello, \(name)!")
}

greet(name: "Alice")  // Prints: Hello, Alice!
```

Multiple parameters are separated by commas:

```swift
public func greet(name: String, age: Int) {
    print("Hello, \(name)! You are \(age) years old.")
}

greet(name: "Bob", age: 25)
```

## Return Values

Use `->` to specify a return type:

```swift
public func add(a: Int, b: Int) -> Int {
    return a + b
}

let sum = add(a: 5, b: 3)
print(sum)  // Prints: 8
```

For single-expression functions, the `return` keyword is optional:

```swift
public func multiply(a: Int, b: Int) -> Int {
    a * b  // Implicit return
}
```

## Argument Labels and Parameter Names

Swift distinguishes between argument labels (used at the call site) and parameter names (used inside the function):

```swift
public func greet(person name: String) {
    print("Hello, \(name)!")  // Use 'name' inside function
}

greet(person: "Charlie")  // Use 'person' when calling
```

## Omitting Argument Labels

Use `_` to omit the argument label:

```swift
public func square(_ number: Int) -> Int {
    number * number
}

let result = square(5)  // No label needed: square(5)
print(result)  // Prints: 25
```

## Default Parameter Values

Provide default values for parameters:

```swift
public func greet(name: String, greeting: String = "Hello") {
    print("\(greeting), \(name)!")
}

greet(name: "Dana")                      // Uses default: Hello, Dana!
greet(name: "Eve", greeting: "Welcome")  // Custom: Welcome, Eve!
```

## Variadic Parameters

Accept zero or more values of a specific type:

```swift
public func average(_ numbers: Double...) -> Double {
    guard !numbers.isEmpty else { return 0 }
    let total = numbers.reduce(0, +)
    return total / Double(numbers.count)
}

let avg = average(1.0, 2.0, 3.0, 4.0, 5.0)
print(avg)  // Prints: 3.0
```

## In-Out Parameters

Modify parameters inside a function using `inout`:

```swift
public func swapValues(_ a: inout Int, _ b: inout Int) {
    let temp = a
    a = b
    b = temp
}

var x = 10
var y = 20
swapValues(&x, &y)  // Use & to pass by reference
print("x: \(x), y: \(y)")  // Prints: x: 20, y: 10
```

## Multiple Return Values with Tuples

Return multiple values using tuples:

```swift
public func minMax(array: [Int]) -> (min: Int, max: Int)? {
    guard let first = array.first else { return nil }

    var minValue = first
    var maxValue = first

    for value in array {
        if value < minValue {
            minValue = value
        }
        if value > maxValue {
            maxValue = value
        }
    }

    return (min: minValue, max: maxValue)
}

if let result = minMax(array: [3, 1, 4, 1, 5, 9, 2, 6]) {
    print("Min: \(result.min), Max: \(result.max)")
}
// Prints: Min: 1, Max: 9
```

## Function Types

Functions have types based on their parameters and return value:

```swift
// Type: (Int, Int) -> Int
public func add(_ a: Int, _ b: Int) -> Int {
    a + b
}

// Type: (Int, Int) -> Int
public func subtract(_ a: Int, _ b: Int) -> Int {
    a - b
}

// Store function in a variable
var mathOperation: (Int, Int) -> Int = add
print(mathOperation(5, 3))  // Prints: 8

mathOperation = subtract
print(mathOperation(5, 3))  // Prints: 2
```

## Functions as Parameters

Pass functions as arguments:

```swift
public func applyOperation(
    _ a: Int,
    _ b: Int,
    operation: (Int, Int) -> Int
) -> Int {
    operation(a, b)
}

let result1 = applyOperation(10, 5, operation: add)
print(result1)  // Prints: 15

let result2 = applyOperation(10, 5, operation: subtract)
print(result2)  // Prints: 5
```

## Functions as Return Values

Return functions from functions:

```swift
public func makeMultiplier(factor: Int) -> (Int) -> Int {
    func multiplier(number: Int) -> Int {
        number * factor
    }
    return multiplier
}

let double = makeMultiplier(factor: 2)
let triple = makeMultiplier(factor: 3)

print(double(5))  // Prints: 10
print(triple(5))  // Prints: 15
```

## Nested Functions

Define functions inside other functions:

```swift
public func processNumbers(_ numbers: [Int]) -> (sum: Int, product: Int) {
    func calculateSum() -> Int {
        numbers.reduce(0, +)
    }

    func calculateProduct() -> Int {
        numbers.reduce(1, *)
    }

    return (sum: calculateSum(), product: calculateProduct())
}

let result = processNumbers([1, 2, 3, 4, 5])
print("Sum: \(result.sum), Product: \(result.product)")
// Prints: Sum: 15, Product: 120
```

## Early Return with Guard

Use guard for preconditions:

```swift
public func divide(_ numerator: Double, by denominator: Double) -> Double? {
    guard denominator != 0 else {
        print("Error: Cannot divide by zero")
        return nil
    }

    return numerator / denominator
}

if let result = divide(10, by: 2) {
    print("Result: \(result)")  // Prints: Result: 5.0
}
```

## Throwing Functions

Functions can throw errors (covered in detail in Error Handling module):

```swift
public enum MathError: Error {
    case divisionByZero
}

public func safeDivide(_ a: Double, by b: Double) throws -> Double {
    guard b != 0 else {
        throw MathError.divisionByZero
    }
    return a / b
}

do {
    let result = try safeDivide(10, by: 2)
    print(result)  // Prints: 5.0
} catch {
    print("Error: \(error)")
}
```

## Key Takeaways

1. Use `func` to define functions with clear parameter and return types
2. Argument labels improve readability at call sites
3. Use `_` to omit argument labels when appropriate
4. Default parameter values make functions more flexible
5. Variadic parameters accept variable number of arguments
6. Use `inout` sparingly - prefer returning new values
7. Functions are first-class citizens: store them in variables, pass them around
8. Nested functions encapsulate helper logic
9. Use guard for early returns and preconditions

In the next lesson, we'll explore closures - anonymous functions that can capture values.
