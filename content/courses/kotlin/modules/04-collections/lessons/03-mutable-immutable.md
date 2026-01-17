---
title: Mutable vs Immutable
order: 3
estimatedMinutes: 12
---

# Mutable vs Immutable Collections

Understanding the difference between mutable and immutable collections is crucial for writing safe, predictable Kotlin code.

## The Two Hierarchies

Kotlin has two collection interfaces:

```
Collection (read-only)
├── List
├── Set
└── Map

MutableCollection
├── MutableList
├── MutableSet
└── MutableMap
```

## Read-Only vs Mutable

### Read-Only

```kotlin
val list: List<String> = listOf("a", "b", "c")
// list.add("d")  // Error: no add method
```

### Mutable

```kotlin
val list: MutableList<String> = mutableListOf("a", "b", "c")
list.add("d")  // OK
```

## val vs Mutability

`val` and `var` control the *variable*, not the collection:

```kotlin
// Can't reassign, but CAN modify contents
val mutableList = mutableListOf(1, 2, 3)
mutableList.add(4)        // OK
// mutableList = mutableListOf()  // Error: val cannot be reassigned

// Can reassign, but CAN'T modify contents
var immutableList = listOf(1, 2, 3)
// immutableList.add(4)   // Error: no add method
immutableList = listOf(4, 5, 6)  // OK: reassigning
```

## Best Practice: Use Read-Only by Default

```kotlin
// Prefer this
val fruits = listOf("apple", "banana")

// Only when you need mutation
val mutableFruits = mutableListOf("apple", "banana")
```

## Comparing to Swift

| Swift | Kotlin | Meaning |
|-------|--------|---------|
| `let arr = [1,2,3]` | `val list = listOf(1,2,3)` | Immutable reference, immutable content |
| `var arr = [1,2,3]` | `val list = mutableListOf(1,2,3)` | Contents can change |
| N/A | `var list = listOf(1,2,3)` | Reference can change, content can't |

Swift conflates `let`/`var` with mutability. Kotlin separates them.

## Read-Only is NOT Immutable

Important distinction:

```kotlin
val mutableList = mutableListOf(1, 2, 3)
val readOnlyView: List<Int> = mutableList  // Read-only reference

println(readOnlyView)  // [1, 2, 3]

mutableList.add(4)     // Modify through mutable reference

println(readOnlyView)  // [1, 2, 3, 4] - it changed!
```

The read-only interface doesn't prevent modification through other references.

## Creating True Copies

```kotlin
val original = mutableListOf(1, 2, 3)
val copy = original.toList()  // New list, truly independent

original.add(4)
println(copy)  // [1, 2, 3] - unchanged
```

## Function Parameters

Accept read-only types for safety:

```kotlin
// Good: accepts any List
fun processItems(items: List<String>) {
    for (item in items) {
        println(item)
    }
}

// Can pass either
val immutable = listOf("a", "b")
val mutable = mutableListOf("c", "d")

processItems(immutable)  // OK
processItems(mutable)    // OK - MutableList is a List
```

## Defensive Copying

When storing a mutable collection passed from outside:

```kotlin
class Container(items: List<String>) {
    // Make a copy to prevent external modification
    private val _items = items.toMutableList()

    // Expose as read-only
    val items: List<String> get() = _items
}
```

## Converting Between Types

```kotlin
val mutable = mutableListOf(1, 2, 3)
val immutable = mutable.toList()       // Read-only copy

val immutable2 = listOf(1, 2, 3)
val mutable2 = immutable2.toMutableList()  // Mutable copy
```

## Collection Builders

Build mutable, return immutable:

```kotlin
fun createList(): List<Int> = buildList {
    add(1)
    add(2)
    if (someCondition) add(3)
}  // Returns read-only List
```

## Try It Yourself

1. Create a val mutableList and modify it
2. Create a read-only view of a mutable list and observe changes
3. Create a true copy using `toList()`
4. Write a function that takes a read-only List parameter

## Key Takeaways

1. `List`, `Set`, `Map` = read-only interfaces
2. `MutableList`, `MutableSet`, `MutableMap` = mutable
3. `val`/`var` controls the variable, not mutability
4. Read-only is NOT immutable - just no mutation methods
5. Use `toList()`, `toMutableList()` for copies
6. Prefer read-only types in function parameters
7. Use collection builders for safe construction
