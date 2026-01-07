---
title: Coroutine Builders
order: 3
estimatedMinutes: 15
---

# Coroutine Builders

Coroutine builders create and start coroutines. Each has specific use cases.

## launch

Fire-and-forget coroutine, returns a Job:

```kotlin
fun main() = runBlocking {
    val job = launch {
        delay(1000)
        println("Task completed")
    }

    println("Waiting...")
    job.join()  // Wait for completion
    println("Done")
}
```

## async

Returns a Deferred with a result:

```kotlin
fun main() = runBlocking {
    val deferred = async {
        delay(1000)
        42  // Return value
    }

    println("Computing...")
    val result = deferred.await()  // Get result
    println("Result: $result")
}
```

## runBlocking

Bridges blocking and coroutine worlds:

```kotlin
fun main() = runBlocking {
    // Inside here, we can call suspend functions
    val data = fetchData()
    println(data)
}
```

**Warning**: Blocks the current thread. Don't use inside coroutines.

## Comparing to Swift

| Swift | Kotlin | Use Case |
|-------|--------|----------|
| `Task { }` | `launch { }` | Fire-and-forget |
| `async let x = ...` | `async { }` | Parallel with result |
| N/A | `runBlocking { }` | Bridge to coroutines |

## Dispatchers

Control where coroutines run:

```kotlin
launch(Dispatchers.Default) {
    // CPU-intensive work
    // Uses shared thread pool
}

launch(Dispatchers.IO) {
    // I/O operations (network, disk)
    // Uses larger thread pool
}

launch(Dispatchers.Main) {
    // UI updates (Android/Desktop)
}

launch(Dispatchers.Unconfined) {
    // Starts in caller thread
    // Resumes in whatever thread
}
```

## CoroutineScope

All coroutines run within a scope:

```kotlin
class UserRepository {
    private val scope = CoroutineScope(Dispatchers.IO)

    fun loadUser(id: String) {
        scope.launch {
            val user = fetchUser(id)
            // Process user
        }
    }

    fun cancel() {
        scope.cancel()  // Cancel all coroutines
    }
}
```

## Job Control

```kotlin
fun main() = runBlocking {
    val job = launch {
        repeat(1000) { i ->
            println("Working $i...")
            delay(100)
        }
    }

    delay(500)
    println("Cancelling...")
    job.cancel()
    job.join()  // Wait for cancellation
    // Or: job.cancelAndJoin()
    println("Cancelled")
}
```

## Multiple async Operations

```kotlin
suspend fun loadDashboard(): Dashboard = coroutineScope {
    val user = async { fetchUser() }
    val posts = async { fetchPosts() }
    val notifications = async { fetchNotifications() }

    Dashboard(
        user.await(),
        posts.await(),
        notifications.await()
    )
}
```

## Lazy async

Start only when needed:

```kotlin
val deferred = async(start = CoroutineStart.LAZY) {
    expensiveComputation()
}

// Computation starts here:
val result = deferred.await()
```

## Exception Handling in Builders

### launch exceptions

```kotlin
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught: $exception")
}

val job = GlobalScope.launch(handler) {
    throw RuntimeException("Oops")
}
```

### async exceptions

```kotlin
val deferred = async {
    throw RuntimeException("Oops")
}

try {
    deferred.await()  // Exception thrown here
} catch (e: Exception) {
    println("Caught: $e")
}
```

## SupervisorJob

Children can fail independently:

```kotlin
val supervisor = SupervisorJob()
val scope = CoroutineScope(Dispatchers.Default + supervisor)

scope.launch {
    throw RuntimeException("Child 1 failed")
}

scope.launch {
    delay(1000)
    println("Child 2 completed")  // Still runs
}
```

## Common Patterns

### Timeout

```kotlin
val result = withTimeout(5000) {
    fetchData()
}

// Or return null on timeout
val result = withTimeoutOrNull(5000) {
    fetchData()
}
```

### Race

First to complete wins:

```kotlin
suspend fun fetchFastest(): Data = coroutineScope {
    select {
        async { fetchFromServer1() }.onAwait { it }
        async { fetchFromServer2() }.onAwait { it }
    }
}
```

## Try It Yourself

1. Use `launch` for a background task
2. Use `async` to compute values in parallel
3. Create a CoroutineScope and cancel it
4. Handle exceptions in both launch and async

## Key Takeaways

1. `launch` for fire-and-forget tasks
2. `async` for tasks returning values
3. `runBlocking` bridges blocking code
4. Dispatchers control thread execution
5. CoroutineScope manages coroutine lifecycle
6. Jobs can be cancelled
7. SupervisorJob for independent child failures
