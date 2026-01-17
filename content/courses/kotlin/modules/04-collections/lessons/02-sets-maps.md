---
title: Sets and Maps
order: 2
estimatedMinutes: 15
---

# Sets and Maps

Sets contain unique elements. Maps store key-value pairs. Both have read-only and mutable variants.

## Sets

### Creating Sets

```kotlin
val fruits = setOf("apple", "banana", "cherry")
val numbers = setOf(1, 2, 3, 3, 3)  // {1, 2, 3} - duplicates removed

val mutableSet = mutableSetOf("a", "b")
mutableSet.add("c")
```

### Set Operations

```kotlin
val set1 = setOf(1, 2, 3)
val set2 = setOf(2, 3, 4)

println(set1 union set2)     // [1, 2, 3, 4]
println(set1 intersect set2) // [2, 3]
println(set1 subtract set2)  // [1]
```

### Set Properties

```kotlin
val fruits = setOf("apple", "banana", "cherry")

println("apple" in fruits)   // true
println(fruits.size)         // 3
println(fruits.isEmpty())    // false
```

## Maps

### Creating Maps

```kotlin
val ages = mapOf(
    "Alice" to 25,
    "Bob" to 30,
    "Charlie" to 35
)

val mutableAges = mutableMapOf("Alice" to 25)
mutableAges["Bob"] = 30
```

### The `to` Function

`to` creates a `Pair`:

```kotlin
val pair = "key" to "value"  // Pair("key", "value")
```

### Accessing Values

```kotlin
val ages = mapOf("Alice" to 25, "Bob" to 30)

println(ages["Alice"])              // 25
println(ages["Unknown"])            // null
println(ages.getOrDefault("Unknown", 0))  // 0
println(ages.getOrElse("Unknown") { -1 }) // -1
```

### Map Properties

```kotlin
val ages = mapOf("Alice" to 25, "Bob" to 30)

println(ages.keys)     // [Alice, Bob]
println(ages.values)   // [25, 30]
println(ages.entries)  // [Alice=25, Bob=30]
println(ages.size)     // 2
```

### Checking Contents

```kotlin
val ages = mapOf("Alice" to 25, "Bob" to 30)

println("Alice" in ages)          // true
println(ages.containsKey("Alice")) // true
println(ages.containsValue(25))    // true
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `Set(["a", "b"])` | `setOf("a", "b")` |
| `["a": 1, "b": 2]` | `mapOf("a" to 1, "b" to 2)` |
| `dict["key"]` | `map["key"]` |
| `dict["key"] = value` | `map["key"] = value` (mutable) |
| `dict.keys` | `map.keys` |

## Mutable Map Operations

```kotlin
val map = mutableMapOf("a" to 1, "b" to 2)

map["c"] = 3                  // Add/update
map.put("d", 4)               // Same as above
map.putAll(mapOf("e" to 5))   // Add multiple

map.remove("a")               // Remove by key
map.clear()                   // Remove all
```

### getOrPut

Add if missing:

```kotlin
val cache = mutableMapOf<String, Int>()

val value = cache.getOrPut("key") {
    println("Computing...")
    42  // Only computed if key doesn't exist
}
```

## Iterating

### Over Sets

```kotlin
val fruits = setOf("apple", "banana", "cherry")

for (fruit in fruits) {
    println(fruit)
}
```

### Over Maps

```kotlin
val ages = mapOf("Alice" to 25, "Bob" to 30)

// Destructuring
for ((name, age) in ages) {
    println("$name is $age years old")
}

// Just keys
for (name in ages.keys) {
    println(name)
}

// Just values
for (age in ages.values) {
    println(age)
}
```

## LinkedHashMap and LinkedHashSet

Preserve insertion order:

```kotlin
val orderedMap = linkedMapOf("c" to 3, "a" to 1, "b" to 2)
println(orderedMap.keys)  // [c, a, b] - insertion order

val orderedSet = linkedSetOf("c", "a", "b")
println(orderedSet)  // [c, a, b]
```

## Try It Yourself

1. Create a set and try adding duplicates
2. Perform union and intersection on two sets
3. Create a map of country codes to country names
4. Iterate over a map using destructuring
5. Use `getOrPut` to implement simple caching

## Key Takeaways

1. Sets: unique elements, no duplicates
2. `setOf()`, `mutableSetOf()` for sets
3. Set operations: `union`, `intersect`, `subtract`
4. Maps: key-value pairs
5. `mapOf()`, `mutableMapOf()` for maps
6. `to` creates pairs for map entries
7. Access with `map[key]`, safer with `getOrDefault`
8. Destructure with `for ((key, value) in map)`
