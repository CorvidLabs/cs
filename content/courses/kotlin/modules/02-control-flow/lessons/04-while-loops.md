---
title: While Loops
order: 4
estimatedMinutes: 10
---

# While Loops

Kotlin has two types of while loops: `while` and `do-while`. These work similarly to other languages.

## While Loop

Checks condition before each iteration:

```kotlin
var count = 0

while (count < 5) {
    println(count)
    count++
}
// 0, 1, 2, 3, 4
```

## Do-While Loop

Executes at least once, then checks condition:

```kotlin
var count = 0

do {
    println(count)
    count++
} while (count < 5)
// 0, 1, 2, 3, 4
```

## Key Difference

```kotlin
// While: might never execute
var x = 10
while (x < 5) {
    println(x)  // Never prints
    x++
}

// Do-while: always executes at least once
var y = 10
do {
    println(y)  // Prints: 10
    y++
} while (y < 5)
```

## Comparing to Swift

The syntax is nearly identical:

| Swift | Kotlin |
|-------|--------|
| `while count < 5 { }` | `while (count < 5) { }` |
| `repeat { } while count < 5` | `do { } while (count < 5)` |

Note: Swift uses `repeat-while`, Kotlin uses `do-while`.

## Infinite Loops

```kotlin
while (true) {
    val input = readLine()
    if (input == "quit") break
    println("You entered: $input")
}
```

## Reading Until Condition

```kotlin
var sum = 0
var number: Int

do {
    print("Enter a number (0 to stop): ")
    number = readLine()?.toIntOrNull() ?: 0
    sum += number
} while (number != 0)

println("Sum: $sum")
```

## While with Complex Conditions

```kotlin
var attempts = 0
var success = false

while (attempts < 3 && !success) {
    println("Attempt ${attempts + 1}")
    // Try something
    success = trySomething()
    attempts++
}
```

## While vs For

Use **for** when:
- Iterating over a collection
- You know the number of iterations
- Working with ranges

Use **while** when:
- Condition-based looping
- Unknown number of iterations
- Reading input until a condition

```kotlin
// For: known iterations
for (i in 1..10) { }

// While: unknown iterations
while (hasMoreData()) {
    processData()
}
```

## Break and Continue

```kotlin
var i = 0
while (i < 10) {
    i++
    if (i == 3) continue  // Skip 3
    if (i == 7) break     // Stop at 7
    println(i)
}
// 1, 2, 4, 5, 6
```

## Common Patterns

### Retry Pattern

```kotlin
var attempts = 0
var result: Result? = null

while (result == null && attempts < maxRetries) {
    result = tryOperation()
    attempts++
}
```

### Search Pattern

```kotlin
var index = 0
while (index < list.size) {
    if (list[index] == target) {
        println("Found at $index")
        break
    }
    index++
}
```

## Try It Yourself

1. Use while to print numbers 1-10
2. Use do-while to simulate a menu (print options, read choice, exit on "quit")
3. Implement a simple guessing game with a while loop
4. Count how many times you need to divide a number by 2 until it's less than 1

## Key Takeaways

1. `while` checks condition first, may never execute
2. `do-while` executes at least once, then checks
3. Use `break` to exit early
4. Use `continue` to skip to next iteration
5. Prefer `for` when iterating collections or known ranges
6. Use `while` for condition-based or unknown iterations
