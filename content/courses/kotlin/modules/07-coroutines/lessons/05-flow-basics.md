---
title: Flow Basics
order: 5
estimatedMinutes: 15
---

# Flow Basics

Flow is Kotlin's reactive stream type for asynchronous data sequences.

## What is Flow?

Flow represents a cold stream of values:

```kotlin
import kotlinx.coroutines.flow.*

fun numbers(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100)
        emit(i)  // Emit values
    }
}

fun main() = runBlocking {
    numbers().collect { value ->
        println(value)
    }
}
// 1, 2, 3 (with delays)
```

## Cold vs Hot Streams

**Cold**: Starts fresh for each collector
```kotlin
val cold = flow { emit(random()) }
cold.collect { }  // Gets new random
cold.collect { }  // Gets different random
```

**Hot**: Shared among collectors (SharedFlow, StateFlow)
```kotlin
val hot = MutableStateFlow(0)
// All collectors see same values
```

## Comparing to Swift

| Swift | Kotlin | Description |
|-------|--------|-------------|
| `AsyncSequence` | `Flow` | Async stream |
| `for await` | `collect` | Consume values |
| `Combine` Publishers | `SharedFlow` | Hot streams |
| `@Published` | `StateFlow` | Observable state |

## Creating Flows

```kotlin
// flow builder
val flow1 = flow {
    emit(1)
    emit(2)
}

// flowOf
val flow2 = flowOf(1, 2, 3)

// Collection.asFlow()
val flow3 = listOf(1, 2, 3).asFlow()

// channelFlow for concurrent emissions
val flow4 = channelFlow {
    launch { send(1) }
    launch { send(2) }
}
```

## Flow Operators

### Transform

```kotlin
flowOf(1, 2, 3)
    .map { it * 2 }        // 2, 4, 6
    .filter { it > 2 }      // 4, 6
    .take(1)               // 4
    .collect { println(it) }
```

### Intermediate Operators

```kotlin
flow
    .map { transform(it) }           // Transform each
    .filter { condition(it) }        // Keep matching
    .take(n)                         // First n items
    .drop(n)                         // Skip n items
    .distinctUntilChanged()          // Remove consecutive duplicates
    .debounce(300)                   // Wait for pause
    .sample(1000)                    // Latest every interval
```

### Terminal Operators

```kotlin
flow.collect { }           // Process each
flow.toList()             // Collect to list
flow.first()              // Get first
flow.single()             // Get single (error if not exactly one)
flow.reduce { acc, v -> } // Reduce to single value
flow.fold(init) { }       // Fold with initial
```

## Error Handling

```kotlin
flow { emit(risky()) }
    .catch { e ->
        emit(fallbackValue)  // Recover with value
        // or: throw e        // Rethrow
    }
    .collect { println(it) }
```

## Flow Context

```kotlin
flow {
    emit(heavyComputation())
}
.flowOn(Dispatchers.Default)  // Upstream runs on Default
.collect { updateUi(it) }      // Collection runs on caller
```

## StateFlow

Observable state holder:

```kotlin
class ViewModel {
    private val _count = MutableStateFlow(0)
    val count: StateFlow<Int> = _count.asStateFlow()

    fun increment() {
        _count.value++
    }
}

// Collecting
viewModel.count.collect { value ->
    println("Count: $value")
}
```

## SharedFlow

Broadcast to multiple collectors:

```kotlin
class EventBus {
    private val _events = MutableSharedFlow<Event>()
    val events = _events.asSharedFlow()

    suspend fun emit(event: Event) {
        _events.emit(event)
    }
}
```

## Combining Flows

```kotlin
val flow1 = flowOf(1, 2)
val flow2 = flowOf("a", "b")

// zip: pairs elements
flow1.zip(flow2) { n, s -> "$n$s" }
    .collect { }  // "1a", "2b"

// combine: latest from each
flow1.combine(flow2) { n, s -> "$n$s" }
    .collect { }  // Latest combination
```

## flatMap Variants

```kotlin
// flatMapConcat: sequential
flowOf(1, 2).flatMapConcat { flowOf(it, it) }
// 1, 1, 2, 2

// flatMapMerge: concurrent
flowOf(1, 2).flatMapMerge { flowOf(it, it) }
// Order not guaranteed

// flatMapLatest: cancels previous
flowOf(1, 2).flatMapLatest { flowOf(it, it) }
// May skip intermediate values
```

## Try It Yourself

1. Create a simple flow and collect it
2. Apply map, filter, and take operators
3. Create a StateFlow for a counter
4. Combine two flows using zip

## Key Takeaways

1. Flow is a cold async stream
2. `flow { emit() }` creates flows
3. Operators transform flows (map, filter, etc.)
4. `collect` is a terminal operator
5. `catch` handles errors
6. `flowOn` changes upstream context
7. StateFlow for observable state
8. SharedFlow for events/broadcasts
