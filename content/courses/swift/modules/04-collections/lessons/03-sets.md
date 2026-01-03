---
title: Sets
order: 3
estimatedMinutes: 14
---

# Sets

Sets are unordered collections of unique values. When order doesn't matter and you need to ensure no duplicates, Sets are the perfect choice.

## Creating Sets

```swift
// Set with type annotation
let numbers: Set<Int> = [1, 2, 3, 4, 5]

// Type inference (need Set keyword to distinguish from Array)
let colors: Set = ["red", "green", "blue"]

// Empty set
var emptySet = Set<String>()
var anotherEmpty: Set<Int> = []

// From array (removes duplicates)
let array = [1, 1, 2, 2, 3, 3]
let uniqueNumbers = Set(array)  // {1, 2, 3}
```

## Set Properties

```swift
let fruits: Set = ["apple", "banana", "cherry"]

print(fruits.count)    // 3
print(fruits.isEmpty)  // false

// Sets don't have first/last (unordered)
// But you can get an arbitrary element
if let anyFruit = fruits.first {
    print(anyFruit)  // Some fruit (order not guaranteed)
}
```

## Checking Membership

O(1) lookup - much faster than arrays:

```swift
let validCodes: Set = ["A1", "B2", "C3", "D4"]

let hasA1 = validCodes.contains("A1")  // true - O(1)
let hasZ9 = validCodes.contains("Z9")  // false - O(1)

// Compare to array: O(n)
let codesArray = ["A1", "B2", "C3", "D4"]
let hasA1Array = codesArray.contains("A1")  // true - O(n)
```

## Modifying Sets

```swift
var languages: Set = ["Swift", "Python"]

// Insert elements
languages.insert("JavaScript")  // Returns (inserted: true, memberAfterInsert: "JavaScript")
let result = languages.insert("Swift")  // Already exists: (inserted: false, ...)

// Remove elements
let removed = languages.remove("Python")  // Returns Optional("Python")
let notFound = languages.remove("Rust")   // Returns nil

// Remove arbitrary element
let any = languages.popFirst()  // Removes and returns any element

// Remove all
languages.removeAll()
```

## Iterating Over Sets

```swift
let colors: Set = ["red", "green", "blue"]

// Simple iteration (order not guaranteed)
for color in colors {
    print(color)
}

// Sorted iteration
for color in colors.sorted() {
    print(color)  // blue, green, red
}
```

## Set Operations

Sets support mathematical set operations:

### Union

All elements from both sets:

```swift
let setA: Set = [1, 2, 3, 4]
let setB: Set = [3, 4, 5, 6]

let union = setA.union(setB)  // {1, 2, 3, 4, 5, 6}

// Mutating version
var mutableA: Set = [1, 2, 3]
mutableA.formUnion([3, 4, 5])  // {1, 2, 3, 4, 5}
```

### Intersection

Elements in both sets:

```swift
let setA: Set = [1, 2, 3, 4]
let setB: Set = [3, 4, 5, 6]

let intersection = setA.intersection(setB)  // {3, 4}

// Mutating version
var mutableA: Set = [1, 2, 3, 4]
mutableA.formIntersection([3, 4, 5, 6])  // {3, 4}
```

### Subtracting

Elements in first set but not second:

```swift
let setA: Set = [1, 2, 3, 4]
let setB: Set = [3, 4, 5, 6]

let difference = setA.subtracting(setB)  // {1, 2}

// Mutating version
var mutableA: Set = [1, 2, 3, 4]
mutableA.subtract([3, 4, 5, 6])  // {1, 2}
```

### Symmetric Difference

Elements in either set but not both:

```swift
let setA: Set = [1, 2, 3, 4]
let setB: Set = [3, 4, 5, 6]

let symmetric = setA.symmetricDifference(setB)  // {1, 2, 5, 6}

// Mutating version
var mutableA: Set = [1, 2, 3, 4]
mutableA.formSymmetricDifference([3, 4, 5, 6])  // {1, 2, 5, 6}
```

## Set Comparisons

```swift
let setA: Set = [1, 2, 3]
let setB: Set = [1, 2, 3, 4, 5]
let setC: Set = [1, 2, 3]
let setD: Set = [6, 7, 8]

// Equality
let equal = setA == setC  // true

// Subset/Superset
let isSubset = setA.isSubset(of: setB)      // true
let isSuperset = setB.isSuperset(of: setA)  // true
let isStrictSubset = setA.isStrictSubset(of: setB)  // true (not equal)

// Disjoint (no common elements)
let areDisjoint = setA.isDisjoint(with: setD)  // true
```

## Converting Between Collections

```swift
// Array to Set (removes duplicates)
let array = [1, 2, 2, 3, 3, 3]
let set = Set(array)  // {1, 2, 3}

// Set to Array
let backToArray = Array(set)  // [1, 2, 3] (order not guaranteed)
let sortedArray = set.sorted()  // [1, 2, 3] (sorted)

// Remove duplicates from array while preserving order
let orderedUnique = array.reduce(into: [Int]()) { result, element in
    if !result.contains(element) {
        result.append(element)
    }
}
// [1, 2, 3]
```

## Sets with Custom Types

Types must be `Hashable`:

```swift
public struct Point: Hashable {
    public let x: Int
    public let y: Int
}

var visitedPoints: Set<Point> = []
visitedPoints.insert(Point(x: 0, y: 0))
visitedPoints.insert(Point(x: 1, y: 1))
visitedPoints.insert(Point(x: 0, y: 0))  // Duplicate, not added

print(visitedPoints.count)  // 2
```

## Practical Use Cases

### Finding Duplicates

```swift
let items = ["apple", "banana", "apple", "cherry", "banana"]

var seen = Set<String>()
var duplicates = Set<String>()

for item in items {
    if seen.contains(item) {
        duplicates.insert(item)
    } else {
        seen.insert(item)
    }
}
print(duplicates)  // {"apple", "banana"}
```

### Tags and Categories

```swift
struct Article {
    let title: String
    let tags: Set<String>
}

let articles = [
    Article(title: "Swift Basics", tags: ["swift", "programming"]),
    Article(title: "iOS Development", tags: ["ios", "swift"]),
    Article(title: "Server-Side Swift", tags: ["swift", "server", "vapor"])
]

// Find articles with "swift" tag
let swiftArticles = articles.filter { $0.tags.contains("swift") }

// Find common tags across articles
let commonTags = articles.reduce(articles[0].tags) { result, article in
    result.intersection(article.tags)
}
print(commonTags)  // {"swift"}
```

### Permission Checking

```swift
struct User {
    let permissions: Set<String>
}

let admin = User(permissions: ["read", "write", "delete", "admin"])
let editor = User(permissions: ["read", "write"])

let requiredPermissions: Set = ["read", "write"]

let adminCanEdit = requiredPermissions.isSubset(of: admin.permissions)  // true
let editorCanEdit = requiredPermissions.isSubset(of: editor.permissions)  // true
```

## Performance Comparison

| Operation | Array | Set |
|-----------|-------|-----|
| Access by index | O(1) | N/A |
| Contains | O(n) | O(1) |
| Insert | O(1) amortized | O(1) |
| Remove | O(n) | O(1) |
| Ordered | Yes | No |

## Key Takeaways

1. Sets store unique values with O(1) lookup
2. Use `Set<Type>` syntax (elements must be `Hashable`)
3. Sets are unordered - use `sorted()` for ordered iteration
4. Set operations: `union`, `intersection`, `subtracting`, `symmetricDifference`
5. Comparison methods: `isSubset`, `isSuperset`, `isDisjoint`
6. Converting array to set removes duplicates
7. Use sets when uniqueness and fast lookup matter more than order

In the next lesson, we'll explore higher-order functions for powerful collection transformations.
