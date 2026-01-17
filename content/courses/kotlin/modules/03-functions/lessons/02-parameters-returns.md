---
title: Parameters and Returns
order: 2
estimatedMinutes: 12
---

# Parameters and Returns

Deep dive into how Kotlin handles function parameters and return values.

## Parameter Basics

Parameters are immutable inside the function:

```kotlin
fun greet(name: String) {
    // name = "Other"  // Error! Parameters are val
    println("Hello, $name")
}
```

## Vararg Parameters

Accept variable number of arguments:

```kotlin
fun printAll(vararg messages: String) {
    for (message in messages) {
        println(message)
    }
}

fun main() {
    printAll("Hello", "World", "Kotlin")
}
```

### Spread Operator

Pass an array to vararg using `*`:

```kotlin
val words = arrayOf("Hello", "World")
printAll(*words)
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `func sum(_ numbers: Int...)` | `fun sum(vararg numbers: Int)` |
| No spread operator needed | `*array` to spread |

## Multiple Return Values

Kotlin doesn't have tuples like Swift, but you can use:

### Pair

```kotlin
fun getMinMax(numbers: List<Int>): Pair<Int, Int> {
    return Pair(numbers.minOrNull() ?: 0, numbers.maxOrNull() ?: 0)
}

fun main() {
    val (min, max) = getMinMax(listOf(3, 1, 4, 1, 5))
    println("Min: $min, Max: $max")
}
```

### Triple

```kotlin
fun getStats(numbers: List<Int>): Triple<Int, Int, Double> {
    val min = numbers.minOrNull() ?: 0
    val max = numbers.maxOrNull() ?: 0
    val avg = numbers.average()
    return Triple(min, max, avg)
}

val (min, max, avg) = getStats(listOf(1, 2, 3, 4, 5))
```

### Data Classes (Better for Complex Returns)

```kotlin
data class Stats(val min: Int, val max: Int, val average: Double)

fun getStats(numbers: List<Int>): Stats {
    return Stats(
        min = numbers.minOrNull() ?: 0,
        max = numbers.maxOrNull() ?: 0,
        average = numbers.average()
    )
}
```

## Nothing Return Type

For functions that never return:

```kotlin
fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
}

fun processData(data: String?) {
    val validData = data ?: fail("Data required")
    // Compiler knows we won't reach here if data is null
    println(validData.length)
}
```

## Nullable Return Types

```kotlin
fun findUser(id: Int): User? {
    return users.find { it.id == id }
}

fun main() {
    val user = findUser(123)
    // Must handle null
    println(user?.name ?: "Not found")
}
```

## Generic Return Types

```kotlin
fun <T> firstOrNull(list: List<T>): T? {
    return if (list.isEmpty()) null else list[0]
}

val first = firstOrNull(listOf(1, 2, 3))  // Int?
val firstStr = firstOrNull(listOf("a", "b"))  // String?
```

## infix Functions

For more readable two-argument functions:

```kotlin
infix fun Int.times(str: String) = str.repeat(this)

fun main() {
    println(3 times "Hello ")  // Hello Hello Hello
}
```

## Try It Yourself

1. Create a function with vararg that calculates the sum
2. Return a Pair containing the length and uppercase version of a string
3. Create a nullable return function that finds an item
4. Create an infix function for a readable operation

## Key Takeaways

1. Parameters are immutable (`val`)
2. `vararg` for variable arguments, `*` to spread arrays
3. Use `Pair` or `Triple` for multiple returns
4. Prefer data classes for complex return values
5. `Nothing` for functions that never return
6. `?` suffix for nullable returns
7. `infix` for readable two-argument calls
