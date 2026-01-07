---
title: Filtering and Grouping
order: 5
estimatedMinutes: 15
---

# Filtering and Grouping

Filter elements by conditions and group them by keys.

## filter

Keep elements matching a condition:

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6)
val evens = numbers.filter { it % 2 == 0 }
println(evens)  // [2, 4, 6]
```

## filterNot

Keep elements NOT matching:

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6)
val odds = numbers.filterNot { it % 2 == 0 }
println(odds)  // [1, 3, 5]
```

## filterNotNull

Remove nulls:

```kotlin
val mixed = listOf(1, null, 2, null, 3)
val nonNull = mixed.filterNotNull()
println(nonNull)  // [1, 2, 3]
```

## filterIsInstance

Filter by type:

```kotlin
val mixed: List<Any> = listOf(1, "hello", 2, "world", 3)
val strings = mixed.filterIsInstance<String>()
println(strings)  // [hello, world]
```

## partition

Split into two lists:

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6)
val (evens, odds) = numbers.partition { it % 2 == 0 }
println(evens)  // [2, 4, 6]
println(odds)   // [1, 3, 5]
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `array.filter { $0 > 2 }` | `list.filter { it > 2 }` |
| No direct equivalent | `list.partition { }` |
| No direct equivalent | `list.filterIsInstance<T>()` |

## any, all, none

Check conditions:

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

println(numbers.any { it > 3 })   // true - at least one
println(numbers.all { it > 0 })   // true - all match
println(numbers.none { it < 0 })  // true - none match
```

## find and firstOrNull

Find first matching:

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

val first = numbers.find { it > 3 }
println(first)  // 4

val last = numbers.findLast { it < 4 }
println(last)  // 3

val missing = numbers.find { it > 10 }
println(missing)  // null
```

## count

Count matching elements:

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6)
val evenCount = numbers.count { it % 2 == 0 }
println(evenCount)  // 3
```

## groupBy

Group elements by key:

```kotlin
val words = listOf("apple", "banana", "apricot", "blueberry", "avocado")
val byFirstLetter = words.groupBy { it.first() }
println(byFirstLetter)
// {a=[apple, apricot, avocado], b=[banana, blueberry]}
```

### groupBy with value transformation

```kotlin
val words = listOf("apple", "banana", "apricot")
val grouped = words.groupBy(
    keySelector = { it.first() },
    valueTransform = { it.uppercase() }
)
println(grouped)
// {a=[APPLE, APRICOT], b=[BANANA]}
```

## groupingBy and aggregate

For more control:

```kotlin
val words = listOf("apple", "banana", "apricot", "blueberry")

// Count per group
val counts = words.groupingBy { it.first() }.eachCount()
println(counts)  // {a=2, b=2}

// Fold per group
val lengths = words.groupingBy { it.first() }
    .fold(0) { acc, word -> acc + word.length }
println(lengths)  // {a=16, b=15}
```

## distinctBy

Remove duplicates by key:

```kotlin
data class Person(val name: String, val age: Int)

val people = listOf(
    Person("Alice", 25),
    Person("Bob", 30),
    Person("Alice", 35)  // Same name, different age
)

val unique = people.distinctBy { it.name }
println(unique)  // [Person(name=Alice, age=25), Person(name=Bob, age=30)]
```

## take and drop with conditions

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 1, 2)

val taken = numbers.takeWhile { it < 4 }
println(taken)  // [1, 2, 3]

val dropped = numbers.dropWhile { it < 4 }
println(dropped)  // [4, 5, 1, 2]
```

## Chaining Filter and Transform

```kotlin
data class Product(val name: String, val price: Double, val category: String)

val products = listOf(
    Product("Laptop", 999.99, "Electronics"),
    Product("Book", 19.99, "Books"),
    Product("Phone", 599.99, "Electronics")
)

val expensiveElectronics = products
    .filter { it.category == "Electronics" }
    .filter { it.price > 500 }
    .map { it.name }

println(expensiveElectronics)  // [Laptop, Phone]
```

## Try It Yourself

1. Filter a list to keep only strings longer than 3 characters
2. Use `partition` to split numbers into positive and negative
3. Use `groupBy` to group words by length
4. Use `find` to get the first even number
5. Chain `filter` and `map` to process data

## Key Takeaways

1. `filter` keeps matching elements
2. `filterNot` keeps non-matching
3. `partition` splits into two lists
4. `any`, `all`, `none` check conditions
5. `find` returns first match (or null)
6. `groupBy` creates Map<Key, List<Value>>
7. `distinctBy` removes duplicates by key
8. `takeWhile`, `dropWhile` for prefix operations
