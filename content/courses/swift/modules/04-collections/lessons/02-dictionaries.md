---
title: Dictionaries
order: 2
estimatedMinutes: 16
---

# Dictionaries

Dictionaries store associations between keys and values. Each value is associated with a unique key, which acts as an identifier for that value.

## Creating Dictionaries

```swift
// Type annotation
let ages: [String: Int] = ["Alice": 30, "Bob": 25, "Charlie": 35]

// Type inference
let scores = ["Math": 95, "English": 88, "Science": 92]

// Empty dictionary with type annotation
var emptyDict: [String: Int] = [:]

// Empty dictionary with initializer
var anotherEmpty = [String: Int]()

// Dictionary from tuples
let pairs = [("a", 1), ("b", 2), ("c", 3)]
let fromPairs = Dictionary(uniqueKeysWithValues: pairs)
```

## Accessing Values

Dictionary subscript always returns an optional:

```swift
let capitals = [
    "France": "Paris",
    "Japan": "Tokyo",
    "USA": "Washington D.C."
]

// Optional access
let franceCapital = capitals["France"]  // Optional("Paris")
let unknownCapital = capitals["Unknown"]  // nil

// Safe unwrapping
if let capital = capitals["France"] {
    print("The capital of France is \(capital)")
}

// Default value
let capital = capitals["Germany"] ?? "Unknown"
// Or using the subscript with default:
let capital2 = capitals["Germany", default: "Unknown"]
```

## Dictionary Properties

```swift
let ages = ["Alice": 30, "Bob": 25, "Charlie": 35]

print(ages.count)    // 3
print(ages.isEmpty)  // false
print(ages.keys)     // Dictionary.Keys (["Alice", "Bob", "Charlie"])
print(ages.values)   // Dictionary.Values ([30, 25, 35])

// Convert to arrays
let namesArray = Array(ages.keys)
let agesArray = Array(ages.values)
```

## Modifying Dictionaries

```swift
var inventory = ["Apples": 10, "Oranges": 5]

// Add or update using subscript
inventory["Bananas"] = 15  // Add new key
inventory["Apples"] = 12   // Update existing key

// Update with old value return
let oldValue = inventory.updateValue(20, forKey: "Oranges")
// oldValue = Optional(5), inventory["Oranges"] = 20

// Remove a key-value pair
inventory["Bananas"] = nil  // Remove by setting to nil
let removed = inventory.removeValue(forKey: "Apples")
// removed = Optional(12)

// Remove all
inventory.removeAll()
```

## Iterating Over Dictionaries

```swift
let scores = ["Alice": 95, "Bob": 87, "Charlie": 92]

// Iterate over key-value pairs
for (name, score) in scores {
    print("\(name): \(score)")
}

// Iterate over keys only
for name in scores.keys {
    print(name)
}

// Iterate over values only
for score in scores.values {
    print(score)
}

// Sorted iteration (dictionaries are unordered)
for (name, score) in scores.sorted(by: { $0.key < $1.key }) {
    print("\(name): \(score)")
}
```

## Searching Dictionaries

```swift
let ages = ["Alice": 30, "Bob": 25, "Charlie": 35]

// Check if key exists
let hasAlice = ages.keys.contains("Alice")  // true

// Find first matching pair
let seniorCitizen = ages.first { $0.value >= 35 }
// Optional(("Charlie", 35))

// Filter dictionary
let under30 = ages.filter { $0.value < 30 }
// ["Bob": 25]

// Check all values match condition
let allAdults = ages.values.allSatisfy { $0 >= 18 }  // true
```

## Transforming Dictionaries

### MapValues

Transform values while keeping keys:

```swift
let prices = ["Widget": 9.99, "Gadget": 19.99, "Gizmo": 14.99]

let discounted = prices.mapValues { $0 * 0.9 }
// ["Widget": 8.991, "Gadget": 17.991, "Gizmo": 13.491]
```

### CompactMapValues

Remove nil values after transformation:

```swift
let data = ["a": "1", "b": "two", "c": "3"]

let numbers = data.compactMapValues { Int($0) }
// ["a": 1, "c": 3]
```

### Reduce Into Dictionary

Build a dictionary from a sequence:

```swift
let words = ["apple", "banana", "cherry", "apricot"]

let grouped = Dictionary(grouping: words) { $0.first! }
// ["a": ["apple", "apricot"], "b": ["banana"], "c": ["cherry"]]

// Count occurrences
let letters = "mississippi"
let counts = letters.reduce(into: [:]) { counts, letter in
    counts[letter, default: 0] += 1
}
// ["m": 1, "i": 4, "s": 4, "p": 2]
```

## Merging Dictionaries

```swift
var dict1 = ["a": 1, "b": 2]
let dict2 = ["b": 3, "c": 4]

// Merge, keeping dict1 values for conflicts
dict1.merge(dict2) { current, _ in current }
// ["a": 1, "b": 2, "c": 4]

// Merge, using dict2 values for conflicts
var dict3 = ["a": 1, "b": 2]
dict3.merge(dict2) { _, new in new }
// ["a": 1, "b": 3, "c": 4]

// Create new merged dictionary (non-mutating)
let merged = dict1.merging(dict2) { $1 }
```

## Nested Dictionaries

```swift
var users: [String: [String: Any]] = [
    "alice": ["age": 30, "city": "NYC"],
    "bob": ["age": 25, "city": "LA"]
]

// Access nested values
if let aliceAge = users["alice"]?["age"] as? Int {
    print("Alice is \(aliceAge)")
}

// Modify nested values
users["alice"]?["age"] = 31

// Add new nested dictionary
users["charlie"] = ["age": 35, "city": "Chicago"]
```

## Dictionary with Custom Key Types

Keys must be `Hashable`:

```swift
public struct Coordinate: Hashable {
    public let x: Int
    public let y: Int
}

var grid: [Coordinate: String] = [:]
grid[Coordinate(x: 0, y: 0)] = "Origin"
grid[Coordinate(x: 1, y: 0)] = "Right"

if let value = grid[Coordinate(x: 0, y: 0)] {
    print(value)  // "Origin"
}
```

## Dictionary vs Array

| Aspect | Dictionary | Array |
|--------|------------|-------|
| Access | By key: O(1) | By index: O(1) |
| Search | By key: O(1) | Linear: O(n) |
| Order | Unordered | Ordered |
| Keys | Must be unique | Indices are sequential |
| Use case | Quick lookup | Ordered collection |

## Common Patterns

### Grouping Elements

```swift
struct Person {
    let name: String
    let department: String
}

let employees = [
    Person(name: "Alice", department: "Engineering"),
    Person(name: "Bob", department: "Marketing"),
    Person(name: "Charlie", department: "Engineering")
]

let byDepartment = Dictionary(grouping: employees) { $0.department }
// ["Engineering": [Person(...), Person(...)], "Marketing": [Person(...)]]
```

### Default Value Pattern

```swift
var wordCount: [String: Int] = [:]
let words = ["apple", "banana", "apple", "cherry", "banana", "apple"]

for word in words {
    wordCount[word, default: 0] += 1
}
// ["apple": 3, "banana": 2, "cherry": 1]
```

## Key Takeaways

1. Dictionaries store key-value pairs: `[Key: Value]`
2. Keys must be `Hashable` and unique
3. Subscript access returns an optional
4. Use `[key, default: value]` to provide fallback values
5. Dictionaries are unordered - use `sorted()` for ordered iteration
6. `mapValues` and `compactMapValues` for transformations
7. `merge` to combine dictionaries
8. `Dictionary(grouping:by:)` for grouping elements

In the next lesson, we'll explore Sets for unique value collections.
