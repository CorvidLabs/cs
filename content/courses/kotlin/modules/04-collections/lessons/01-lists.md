---
title: Lists
order: 1
estimatedMinutes: 15
---

# Lists

Lists are ordered collections that can contain duplicates. Kotlin has both read-only and mutable lists.

## Creating Lists

### Read-Only List

```kotlin
val fruits = listOf("apple", "banana", "cherry")
val numbers = listOf(1, 2, 3, 4, 5)
val empty = emptyList<String>()
```

### Mutable List

```kotlin
val mutableFruits = mutableListOf("apple", "banana")
mutableFruits.add("cherry")
mutableFruits.remove("banana")
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `let list = ["a", "b"]` | `val list = listOf("a", "b")` |
| `var list = ["a", "b"]` | `val list = mutableListOf("a", "b")` |
| `list.append("c")` | `list.add("c")` |
| `list[0]` | `list[0]` |
| `list.count` | `list.size` |

Note: In Kotlin, `val` vs `var` controls the variable, not the collection mutability.

## Accessing Elements

```kotlin
val fruits = listOf("apple", "banana", "cherry")

println(fruits[0])           // apple
println(fruits.first())      // apple
println(fruits.last())       // cherry
println(fruits.getOrNull(10)) // null (safe access)
println(fruits.getOrElse(10) { "default" }) // default
```

## List Properties

```kotlin
val list = listOf(1, 2, 3)

println(list.size)       // 3
println(list.isEmpty())  // false
println(list.isNotEmpty()) // true
println(list.indices)    // 0..2
println(list.lastIndex)  // 2
```

## Checking Contents

```kotlin
val fruits = listOf("apple", "banana", "cherry")

println("apple" in fruits)      // true
println(fruits.contains("mango")) // false
println(fruits.containsAll(listOf("apple", "banana"))) // true
```

## List Operations

### Index Operations

```kotlin
val list = listOf("a", "b", "c", "b")

println(list.indexOf("b"))     // 1 (first occurrence)
println(list.lastIndexOf("b")) // 3 (last occurrence)
println(list.indexOf("z"))     // -1 (not found)
```

### Sublist

```kotlin
val numbers = listOf(0, 1, 2, 3, 4, 5)

println(numbers.subList(1, 4))  // [1, 2, 3]
println(numbers.take(3))        // [0, 1, 2]
println(numbers.takeLast(2))    // [4, 5]
println(numbers.drop(2))        // [2, 3, 4, 5]
println(numbers.dropLast(2))    // [0, 1, 2, 3]
```

## Mutable List Operations

```kotlin
val list = mutableListOf("a", "b", "c")

list.add("d")           // [a, b, c, d]
list.add(0, "z")        // [z, a, b, c, d]
list.addAll(listOf("e", "f"))

list.remove("a")        // Remove first "a"
list.removeAt(0)        // Remove at index
list.removeAll { it < "c" }  // Remove matching condition

list.clear()            // Empty the list
```

## Immutable List from Mutable

```kotlin
val mutableList = mutableListOf(1, 2, 3)
val readOnlyList: List<Int> = mutableList.toList()

// Or just expose as List type
fun getItems(): List<String> = mutableListOf("a", "b", "c")
```

## Building Lists

```kotlin
// buildList for complex construction
val list = buildList {
    add("a")
    addAll(listOf("b", "c"))
    if (someCondition) {
        add("d")
    }
}
```

## List Destructuring

```kotlin
val (first, second, third) = listOf("a", "b", "c")
println("$first, $second, $third")  // a, b, c
```

## Try It Yourself

1. Create a list of your favorite foods
2. Access elements using different methods
3. Check if an item exists using `in`
4. Create a mutable list and add/remove items
5. Use `take` and `drop` to get sublists

## Key Takeaways

1. `listOf()` creates read-only lists
2. `mutableListOf()` creates mutable lists
3. Access with `[index]`, `first()`, `last()`, `getOrNull()`
4. `in` operator checks containment
5. Mutable lists have `add`, `remove`, `clear`
6. `toList()` creates immutable copy
7. Lists can be destructured
