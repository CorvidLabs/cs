---
title: Arrays
order: 1
estimatedMinutes: 18
---

# Arrays

Arrays are ordered collections that store multiple values of the same type. They're one of Swift's most commonly used collection types.

## Creating Arrays

Several ways to create arrays:

```swift
// Type annotation
let numbers: [Int] = [1, 2, 3, 4, 5]

// Type inference
let colors = ["red", "green", "blue"]  // [String]

// Empty array with type annotation
var emptyInts: [Int] = []

// Empty array with initializer
var emptyStrings = [String]()

// Array with repeated values
let zeros = Array(repeating: 0, count: 5)  // [0, 0, 0, 0, 0]

// Array from range
let range = Array(1...5)  // [1, 2, 3, 4, 5]
```

## Accessing Elements

Use subscript syntax to access elements by index:

```swift
let fruits = ["apple", "banana", "cherry", "date"]

let first = fruits[0]   // "apple"
let second = fruits[1]  // "banana"

// Safe access with indices check
if fruits.indices.contains(10) {
    print(fruits[10])
} else {
    print("Index out of bounds")
}
```

## Array Properties

```swift
let numbers = [1, 2, 3, 4, 5]

print(numbers.count)      // 5
print(numbers.isEmpty)    // false
print(numbers.first)      // Optional(1)
print(numbers.last)       // Optional(5)
print(numbers.startIndex) // 0
print(numbers.endIndex)   // 5 (one past last valid index)
```

## Modifying Arrays

Arrays must be `var` to be modified:

```swift
var shoppingList = ["eggs", "milk"]

// Append elements
shoppingList.append("bread")
shoppingList += ["butter", "cheese"]

// Insert at index
shoppingList.insert("water", at: 0)

// Remove elements
let removed = shoppingList.remove(at: 0)  // Returns "water"
shoppingList.removeLast()
shoppingList.removeFirst()
shoppingList.removeAll()  // Empty the array

// Replace elements
var numbers = [1, 2, 3, 4, 5]
numbers[0] = 10           // [10, 2, 3, 4, 5]
numbers[1...3] = [20, 30] // [10, 20, 30, 5]
```

## Iterating Over Arrays

```swift
let colors = ["red", "green", "blue"]

// Simple iteration
for color in colors {
    print(color)
}

// With index
for (index, color) in colors.enumerated() {
    print("\(index): \(color)")
}

// Reverse iteration
for color in colors.reversed() {
    print(color)
}

// Using indices
for i in colors.indices {
    print("\(i): \(colors[i])")
}
```

## Searching Arrays

```swift
let numbers = [1, 2, 3, 4, 5, 3, 2, 1]

// Check containment
let hasThree = numbers.contains(3)  // true

// Find first occurrence
let firstThree = numbers.firstIndex(of: 3)  // Optional(2)
let lastThree = numbers.lastIndex(of: 3)    // Optional(5)

// Find with predicate
let firstEven = numbers.first { $0 % 2 == 0 }  // Optional(2)
let firstEvenIndex = numbers.firstIndex { $0 % 2 == 0 }  // Optional(1)

// Check all/any match condition
let allPositive = numbers.allSatisfy { $0 > 0 }  // true
let hasNegative = numbers.contains { $0 < 0 }    // false
```

## Sorting Arrays

```swift
var numbers = [3, 1, 4, 1, 5, 9, 2, 6]

// Sort in place
numbers.sort()  // [1, 1, 2, 3, 4, 5, 6, 9]

// Return sorted copy (original unchanged)
let sorted = numbers.sorted()

// Descending order
numbers.sort(by: >)  // [9, 6, 5, 4, 3, 2, 1, 1]
let descending = numbers.sorted(by: >)

// Custom sorting
struct Person {
    let name: String
    let age: Int
}

var people = [
    Person(name: "Alice", age: 30),
    Person(name: "Bob", age: 25),
    Person(name: "Charlie", age: 35)
]

people.sort { $0.age < $1.age }  // Sort by age
```

## Reversing and Shuffling

```swift
var numbers = [1, 2, 3, 4, 5]

// Reverse in place
numbers.reverse()  // [5, 4, 3, 2, 1]

// Return reversed copy
let reversed = numbers.reversed()  // ReversedCollection
let reversedArray = Array(numbers.reversed())

// Shuffle
numbers.shuffle()  // Random order
let shuffled = numbers.shuffled()  // Random order copy
```

## Slicing Arrays

```swift
let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// Get a slice (returns ArraySlice, not Array)
let slice = numbers[2...5]  // [2, 3, 4, 5]

// Convert slice to array
let sliceArray = Array(numbers[2...5])

// Prefix and suffix
let firstThree = numbers.prefix(3)    // [0, 1, 2]
let lastThree = numbers.suffix(3)     // [7, 8, 9]
let dropFirst = numbers.dropFirst(2)  // [2, 3, 4, 5, 6, 7, 8, 9]
let dropLast = numbers.dropLast(2)    // [0, 1, 2, 3, 4, 5, 6, 7]
```

## Combining Arrays

```swift
let array1 = [1, 2, 3]
let array2 = [4, 5, 6]

// Concatenate
let combined = array1 + array2  // [1, 2, 3, 4, 5, 6]

// Append contents
var mutable = array1
mutable.append(contentsOf: array2)

// Zip two arrays
let names = ["Alice", "Bob", "Charlie"]
let scores = [85, 92, 78]

let pairs = zip(names, scores)
for (name, score) in pairs {
    print("\(name): \(score)")
}
```

## Multidimensional Arrays

```swift
// 2D array (array of arrays)
var matrix: [[Int]] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

// Access elements
let element = matrix[1][2]  // 6

// Modify elements
matrix[0][0] = 10

// Iterate
for row in matrix {
    for element in row {
        print(element, terminator: " ")
    }
    print()
}
```

## Array Type Methods

```swift
// Create array from sequence
let fromSequence = Array("Hello")  // ["H", "e", "l", "l", "o"]

// Repeat initializer
let repeated = Array(repeating: "x", count: 3)  // ["x", "x", "x"]

// Create from another collection
let set: Set = [1, 2, 3]
let arrayFromSet = Array(set)
```

## Copy-on-Write Behavior

Swift arrays use copy-on-write optimization:

```swift
var original = [1, 2, 3]
var copy = original  // No actual copy yet (same underlying storage)

copy[0] = 10  // Now a copy is made
print(original)  // [1, 2, 3] - unchanged
print(copy)      // [10, 2, 3]
```

## Key Takeaways

1. Arrays are ordered, typed collections: `[Int]`, `[String]`
2. Access elements by index: `array[0]`
3. Use `append`, `insert`, `remove` to modify
4. `first` and `last` return optionals for safety
5. `sort()` modifies in place, `sorted()` returns a new array
6. Use `prefix`, `suffix`, `dropFirst`, `dropLast` for slicing
7. Arrays use copy-on-write for efficiency
8. Use `enumerated()` to iterate with indices

In the next lesson, we'll explore dictionaries for key-value storage.
