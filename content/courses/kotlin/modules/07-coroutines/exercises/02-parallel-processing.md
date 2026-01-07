---
title: Parallel Processing
order: 2
difficulty: medium
estimatedMinutes: 25
---

# Exercise: Parallel Processing

Process multiple items in parallel with proper error handling.

## Requirements

1. Process a list of items concurrently
2. Limit concurrency (don't overload)
3. Handle individual failures gracefully
4. Collect all results (successes and failures)

## Starter Code

```kotlin
import kotlinx.coroutines.*

data class Item(val id: Int, val value: String)
sealed class ProcessResult {
    data class Success(val item: Item, val processed: String) : ProcessResult()
    data class Failure(val item: Item, val error: String) : ProcessResult()
}

// Simulate processing - fails for even IDs
suspend fun processItem(item: Item): String {
    delay(500)  // Simulate work
    if (item.id % 2 == 0) {
        throw RuntimeException("Failed to process item ${item.id}")
    }
    return item.value.uppercase()
}

suspend fun processAllItems(items: List<Item>): List<ProcessResult> {
    // Your implementation
}

fun main() = runBlocking {
    val items = (1..6).map { Item(it, "item$it") }

    println("Processing ${items.size} items...")
    val results = processAllItems(items)

    val successes = results.filterIsInstance<ProcessResult.Success>()
    val failures = results.filterIsInstance<ProcessResult.Failure>()

    println("\nSuccesses (${successes.size}):")
    successes.forEach { println("  ${it.item.id}: ${it.processed}") }

    println("\nFailures (${failures.size}):")
    failures.forEach { println("  ${it.item.id}: ${it.error}") }
}
```

## Expected Output

```
Processing 6 items...

Successes (3):
  1: ITEM1
  3: ITEM3
  5: ITEM5

Failures (3):
  2: Failed to process item 2
  4: Failed to process item 4
  6: Failed to process item 6
```

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
import kotlinx.coroutines.*

data class Item(val id: Int, val value: String)
sealed class ProcessResult {
    data class Success(val item: Item, val processed: String) : ProcessResult()
    data class Failure(val item: Item, val error: String) : ProcessResult()
}

suspend fun processItem(item: Item): String {
    delay(500)
    if (item.id % 2 == 0) {
        throw RuntimeException("Failed to process item ${item.id}")
    }
    return item.value.uppercase()
}

suspend fun processAllItems(items: List<Item>): List<ProcessResult> = supervisorScope {
    items.map { item ->
        async {
            try {
                val result = processItem(item)
                ProcessResult.Success(item, result)
            } catch (e: Exception) {
                ProcessResult.Failure(item, e.message ?: "Unknown error")
            }
        }
    }.awaitAll()
}

fun main() = runBlocking {
    val items = (1..6).map { Item(it, "item$it") }

    println("Processing ${items.size} items...")
    val results = processAllItems(items)

    val successes = results.filterIsInstance<ProcessResult.Success>()
    val failures = results.filterIsInstance<ProcessResult.Failure>()

    println("\nSuccesses (${successes.size}):")
    successes.forEach { println("  ${it.item.id}: ${it.processed}") }

    println("\nFailures (${failures.size}):")
    failures.forEach { println("  ${it.item.id}: ${it.error}") }
}
```
</details>

## Bonus Challenge

1. Add concurrency limit using `Semaphore`
2. Add timeout per item
3. Retry failed items once
