---
title: Higher-Order Functions
order: 4
estimatedMinutes: 18
---

# Higher-Order Functions

Higher-order functions take functions as parameters or return functions as results. Swift's collection types provide powerful higher-order functions for transforming, filtering, and combining data.

## Map

Transform each element in a collection:

```swift
let numbers = [1, 2, 3, 4, 5]

// Double each number
let doubled = numbers.map { $0 * 2 }
// [2, 4, 6, 8, 10]

// Convert to strings
let strings = numbers.map { "Number: \($0)" }
// ["Number: 1", "Number: 2", ...]

// Transform with named function
public func square(_ n: Int) -> Int { n * n }
let squares = numbers.map(square)
// [1, 4, 9, 16, 25]
```

Map works on any sequence:

```swift
let names = ["alice", "bob", "charlie"]
let capitalized = names.map { $0.capitalized }
// ["Alice", "Bob", "Charlie"]

let dict = ["a": 1, "b": 2, "c": 3]
let mapped = dict.map { "\($0.key): \($0.value)" }
// ["a: 1", "b: 2", "c: 3"] (order may vary)
```

## Filter

Select elements matching a condition:

```swift
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

let evens = numbers.filter { $0 % 2 == 0 }
// [2, 4, 6, 8, 10]

let greaterThanFive = numbers.filter { $0 > 5 }
// [6, 7, 8, 9, 10]

// With dictionaries
let ages = ["Alice": 30, "Bob": 17, "Charlie": 25]
let adults = ages.filter { $0.value >= 18 }
// ["Alice": 30, "Charlie": 25]
```

## Reduce

Combine all elements into a single value:

```swift
let numbers = [1, 2, 3, 4, 5]

// Sum all numbers
let sum = numbers.reduce(0) { result, number in
    result + number
}
// 15

// Shorthand with operator
let sum2 = numbers.reduce(0, +)  // 15
let product = numbers.reduce(1, *)  // 120

// Build a string
let joined = numbers.reduce("") { result, number in
    result + String(number)
}
// "12345"

// Find maximum
let max = numbers.reduce(Int.min) { Swift.max($0, $1) }
// 5
```

### Reduce Into

More efficient for building collections:

```swift
let words = ["apple", "banana", "cherry", "apricot"]

// Group by first letter
let grouped = words.reduce(into: [Character: [String]]()) { result, word in
    let firstLetter = word.first!
    result[firstLetter, default: []].append(word)
}
// ["a": ["apple", "apricot"], "b": ["banana"], "c": ["cherry"]]

// Count character frequency
let text = "mississippi"
let frequency = text.reduce(into: [:]) { counts, char in
    counts[char, default: 0] += 1
}
// ["m": 1, "i": 4, "s": 4, "p": 2]
```

## CompactMap

Transform and remove nil values:

```swift
let strings = ["1", "2", "three", "4", "five"]

// Int() returns optional - compactMap filters out nil
let numbers = strings.compactMap { Int($0) }
// [1, 2, 4]

// Extract optional values
let optionals: [Int?] = [1, nil, 3, nil, 5]
let values = optionals.compactMap { $0 }
// [1, 3, 5]
```

## FlatMap

Flatten nested collections:

```swift
let nestedNumbers = [[1, 2, 3], [4, 5], [6, 7, 8, 9]]

let flattened = nestedNumbers.flatMap { $0 }
// [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Transform and flatten
let doubled = nestedNumbers.flatMap { $0.map { $0 * 2 } }
// [2, 4, 6, 8, 10, 12, 14, 16, 18]

// Flatten optional arrays
let maybeArrays: [[Int]?] = [[1, 2], nil, [3, 4]]
let allNumbers = maybeArrays.compactMap { $0 }.flatMap { $0 }
// [1, 2, 3, 4]
```

## ForEach

Execute side effects for each element:

```swift
let names = ["Alice", "Bob", "Charlie"]

names.forEach { name in
    print("Hello, \(name)!")
}

// Note: Cannot use break or continue in forEach
// Use for-in loop if you need early exit

// With enumerated for index
names.enumerated().forEach { index, name in
    print("\(index + 1). \(name)")
}
```

## Chaining Operations

Combine multiple operations fluently:

```swift
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Filter evens, square them, sum the result
let result = numbers
    .filter { $0 % 2 == 0 }     // [2, 4, 6, 8, 10]
    .map { $0 * $0 }             // [4, 16, 36, 64, 100]
    .reduce(0, +)                // 220

print(result)  // 220
```

```swift
struct Person {
    let name: String
    let age: Int
    let city: String
}

let people = [
    Person(name: "Alice", age: 30, city: "NYC"),
    Person(name: "Bob", age: 17, city: "LA"),
    Person(name: "Charlie", age: 25, city: "NYC"),
    Person(name: "Diana", age: 22, city: "NYC")
]

// Adults from NYC, sorted by age
let nycAdults = people
    .filter { $0.age >= 18 && $0.city == "NYC" }
    .sorted { $0.age < $1.age }
    .map { $0.name }
// ["Diana", "Charlie", "Alice"]
```

## Lazy Evaluation

Delay computation until needed:

```swift
let hugeRange = 1...1_000_000

// Without lazy: creates intermediate arrays
let eagerResult = hugeRange
    .filter { $0 % 2 == 0 }
    .map { $0 * 2 }
    .prefix(5)
// Creates full arrays at each step

// With lazy: processes on-demand
let lazyResult = hugeRange.lazy
    .filter { $0 % 2 == 0 }
    .map { $0 * 2 }
    .prefix(5)

// Only evaluates when iterated
for num in lazyResult {
    print(num)  // 4, 8, 12, 16, 20
}
```

## Contains and AllSatisfy

Check conditions across collections:

```swift
let numbers = [2, 4, 6, 8, 10]

// Check if any element matches
let hasEven = numbers.contains { $0 % 2 == 0 }  // true
let hasOdd = numbers.contains { $0 % 2 != 0 }   // false

// Check if all elements match
let allEven = numbers.allSatisfy { $0 % 2 == 0 }  // true
let allPositive = numbers.allSatisfy { $0 > 0 }   // true
```

## First, Last, Min, Max

Find specific elements:

```swift
let numbers = [5, 2, 8, 1, 9, 3]

// Find first/last matching
let firstEven = numbers.first { $0 % 2 == 0 }  // Optional(2)
let lastEven = numbers.last { $0 % 2 == 0 }    // Optional(8)

// Find min/max
let minimum = numbers.min()  // Optional(1)
let maximum = numbers.max()  // Optional(9)

// Custom comparison
struct Player {
    let name: String
    let score: Int
}

let players = [
    Player(name: "Alice", score: 100),
    Player(name: "Bob", score: 85),
    Player(name: "Charlie", score: 120)
]

let topPlayer = players.max { $0.score < $1.score }
// Player(name: "Charlie", score: 120)
```

## Split and Joined

Work with string collections:

```swift
let sentence = "Hello World from Swift"

// Split string
let words = sentence.split(separator: " ")
// ["Hello", "World", "from", "Swift"]

// Join array into string
let fruits = ["apple", "banana", "cherry"]
let joined = fruits.joined(separator: ", ")
// "apple, banana, cherry"

// Split with condition
let numbers = [1, 2, 0, 3, 4, 0, 5]
let groups = numbers.split { $0 == 0 }
// [[1, 2], [3, 4], [5]]
```

## Practical Examples

### Data Processing Pipeline

```swift
struct Sale {
    let product: String
    let amount: Double
    let category: String
}

let sales = [
    Sale(product: "Widget", amount: 29.99, category: "Electronics"),
    Sale(product: "Gadget", amount: 49.99, category: "Electronics"),
    Sale(product: "Book", amount: 14.99, category: "Media"),
    Sale(product: "Album", amount: 9.99, category: "Media")
]

// Total electronics sales
let electronicsSales = sales
    .filter { $0.category == "Electronics" }
    .map { $0.amount }
    .reduce(0, +)
// 79.98

// Sales by category
let byCategory = Dictionary(grouping: sales) { $0.category }
    .mapValues { $0.reduce(0) { $0 + $1.amount } }
// ["Electronics": 79.98, "Media": 24.98]
```

## Key Takeaways

1. `map` - Transform each element
2. `filter` - Keep elements matching condition
3. `reduce` - Combine into single value
4. `compactMap` - Transform and remove nils
5. `flatMap` - Flatten nested collections
6. Chain operations for readable data pipelines
7. Use `lazy` for large collections to defer computation
8. `allSatisfy` and `contains` for condition checking
9. `first`, `last`, `min`, `max` for finding elements

You've completed the Collections module! You now have the tools to work with Swift's powerful collection types and transform data efficiently.
