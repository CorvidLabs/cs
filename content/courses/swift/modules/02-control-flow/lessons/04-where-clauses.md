---
title: Where Clauses
order: 4
estimatedMinutes: 14
---

# Where Clauses

The `where` clause adds conditional constraints to patterns, loops, and generics. It acts as a filter that must be satisfied for the pattern to match or the code to execute.

## Where in Switch Statements

Add conditions to switch cases:

```swift
let point = (3, -2)

switch point {
case let (x, y) where x == y:
    print("On the line x = y")
case let (x, y) where x == -y:
    print("On the line x = -y")
case let (x, _) where x > 0:
    print("In the right half-plane")
case let (_, y) where y > 0:
    print("In the upper half-plane")
case let (x, y):
    print("At point (\(x), \(y))")
}
// Prints: In the right half-plane
```

## Multiple Conditions

Combine conditions with logical operators:

```swift
let user = (name: "Alice", age: 25, isPremium: true)

switch user {
case let (name, age, isPremium) where age >= 18 && isPremium:
    print("\(name) is a premium adult user")
case let (name, age, _) where age >= 18:
    print("\(name) is a regular adult user")
case let (name, _, _):
    print("\(name) is a minor")
}
```

## Where with Enums

Add conditions when matching enum cases:

```swift
public enum Transaction {
    case deposit(amount: Double)
    case withdrawal(amount: Double)
    case transfer(amount: Double, to: String)
}

let transaction = Transaction.withdrawal(amount: 500)

switch transaction {
case .deposit(let amount) where amount > 10000:
    print("Large deposit: $\(amount) - requires review")
case .deposit(let amount):
    print("Deposit: $\(amount)")
case .withdrawal(let amount) where amount > 1000:
    print("Large withdrawal: $\(amount) - requires approval")
case .withdrawal(let amount):
    print("Withdrawal: $\(amount)")
case .transfer(let amount, let recipient) where amount > 5000:
    print("Large transfer of $\(amount) to \(recipient)")
case .transfer(let amount, let recipient):
    print("Transfer $\(amount) to \(recipient)")
}
```

## Where in For Loops

Filter elements during iteration:

```swift
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Only iterate over even numbers
for number in numbers where number % 2 == 0 {
    print(number)
}
// Prints: 2, 4, 6, 8, 10
```

This is cleaner than:

```swift
for number in numbers {
    if number % 2 == 0 {
        print(number)
    }
}
```

## Where with Optional Binding in Loops

Combine optional pattern matching with where:

```swift
let optionalScores: [Int?] = [85, nil, 92, nil, 78, 95, nil]

for case let score? in optionalScores where score >= 90 {
    print("High score: \(score)")
}
// Prints:
// High score: 92
// High score: 95
```

## Where in If Case and Guard Case

Add conditions to pattern matching in if and guard:

```swift
public enum Status {
    case loading(progress: Double)
    case loaded(data: String)
    case error(message: String)
}

let status = Status.loading(progress: 0.75)

if case .loading(let progress) = status, progress > 0.5 {
    print("More than halfway loaded: \(Int(progress * 100))%")
}

// Using where (equivalent syntax)
if case .loading(let progress) = status where progress > 0.5 {
    print("More than halfway: \(Int(progress * 100))%")
}
```

## Where in Generic Constraints

Constrain generic types based on conditions:

```swift
public func printSorted<Element>(_ array: [Element]) where Element: Comparable {
    let sorted = array.sorted()
    for element in sorted {
        print(element)
    }
}

printSorted([3, 1, 4, 1, 5, 9, 2, 6])
printSorted(["banana", "apple", "cherry"])
```

Multiple constraints:

```swift
public func processDictionary<Key, Value>(
    _ dict: [Key: Value]
) where Key: Hashable, Value: CustomStringConvertible {
    for (key, value) in dict {
        print("\(key): \(value.description)")
    }
}
```

## Where with Protocol Extensions

Add conditional conformance:

```swift
public extension Array where Element: Numeric {
    public func sum() -> Element {
        return reduce(0, +)
    }
}

let integers = [1, 2, 3, 4, 5]
print(integers.sum())  // 15

let doubles = [1.5, 2.5, 3.5]
print(doubles.sum())  // 7.5

// This won't compile - String is not Numeric
// let strings = ["a", "b", "c"]
// strings.sum()  // Error
```

## Where in Protocol Associated Types

Constrain associated types:

```swift
public protocol Container {
    associatedtype Item
    var count: Int { get }
    mutating func append(_ item: Item)
    subscript(index: Int) -> Item { get }
}

public extension Container where Item: Equatable {
    public func contains(_ item: Item) -> Bool {
        for index in 0..<count {
            if self[index] == item {
                return true
            }
        }
        return false
    }
}
```

## Complex Where Conditions

Combine multiple where clauses:

```swift
public struct Employee {
    public let name: String
    public let department: String
    public let salary: Double
    public let yearsOfService: Int
}

let employees = [
    Employee(name: "Alice", department: "Engineering", salary: 95000, yearsOfService: 5),
    Employee(name: "Bob", department: "Marketing", salary: 65000, yearsOfService: 2),
    Employee(name: "Charlie", department: "Engineering", salary: 120000, yearsOfService: 8),
    Employee(name: "Diana", department: "Sales", salary: 75000, yearsOfService: 4)
]

// Find senior engineers with high salary
for employee in employees
    where employee.department == "Engineering"
    && employee.yearsOfService >= 5
    && employee.salary > 90000 {
    print("\(employee.name) is a senior high-earning engineer")
}
```

## Where vs Filter

Where clauses are evaluated lazily during iteration, while filter creates a new collection:

```swift
let largeRange = 1...1_000_000

// Using where - lazy evaluation
for num in largeRange where num % 100_000 == 0 {
    print(num)
}

// Using filter - creates intermediate array (less efficient for large ranges)
// for num in largeRange.filter({ $0 % 100_000 == 0 }) {
//     print(num)
// }
```

## Practical Example: Command Parser

```swift
public enum CommandToken {
    case keyword(String)
    case number(Int)
    case identifier(String)
    case operator_(String)
}

let tokens: [CommandToken] = [
    .keyword("SET"),
    .identifier("counter"),
    .operator_("="),
    .number(42)
]

// Extract only numbers greater than 10
for case .number(let value) in tokens where value > 10 {
    print("Large number: \(value)")
}

// Process keywords that are at least 3 characters
for case .keyword(let word) in tokens where word.count >= 3 {
    print("Keyword: \(word)")
}
```

## Key Takeaways

1. `where` adds conditions to switch cases: `case let x where x > 0:`
2. `where` filters for loops: `for item in collection where condition`
3. `where` constrains generics: `func process<T>(_ value: T) where T: Comparable`
4. `where` enables conditional protocol extensions
5. Where clauses are evaluated lazily - more efficient than filter for large collections
6. Combine multiple conditions with `&&` and `||`
7. Use where to make pattern matching more precise without nested if statements

You've completed the Control Flow module! You now understand Swift's conditionals, switch statements, pattern matching, and where clauses.
