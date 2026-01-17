---
title: Suspend Functions
order: 2
estimatedMinutes: 12
---

# Suspend Functions

Suspend functions are the foundation of coroutines. They can pause execution without blocking threads.

## Defining Suspend Functions

```kotlin
suspend fun fetchUser(id: String): User {
    delay(1000)  // Simulate network delay
    return User(id, "Alice")
}
```

## Calling Suspend Functions

Suspend functions can only be called from:
1. Other suspend functions
2. Coroutine builders

```kotlin
suspend fun loadData() {
    val user = fetchUser("123")  // OK: called from suspend function
    println(user)
}

fun main() = runBlocking {
    loadData()  // OK: called from coroutine
}
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `func fetch() async -> User` | `suspend fun fetch(): User` |
| `await fetch()` | `fetch()` (no keyword) |
| `try await fetch()` | `fetch()` (exceptions handled normally) |

## Sequential Execution

Suspend functions run sequentially by default:

```kotlin
suspend fun loadUserData(): UserData {
    val user = fetchUser("123")        // 1 second
    val posts = fetchPosts(user.id)    // 1 second
    val friends = fetchFriends(user.id) // 1 second
    return UserData(user, posts, friends)
}
// Total: 3 seconds
```

## Parallel with async

Run suspend functions concurrently:

```kotlin
suspend fun loadUserData(): UserData = coroutineScope {
    val user = fetchUser("123")

    val postsDeferred = async { fetchPosts(user.id) }
    val friendsDeferred = async { fetchFriends(user.id) }

    UserData(user, postsDeferred.await(), friendsDeferred.await())
}
// Total: ~2 seconds (user + max(posts, friends))
```

## withContext

Switch dispatchers within a suspend function:

```kotlin
suspend fun saveToDatabase(data: Data) {
    withContext(Dispatchers.IO) {
        database.save(data)
    }
}

suspend fun updateUi(text: String) {
    withContext(Dispatchers.Main) {
        textView.text = text
    }
}
```

## coroutineScope

Create a scope for child coroutines:

```kotlin
suspend fun loadAll(): List<Data> = coroutineScope {
    val data1 = async { fetchData1() }
    val data2 = async { fetchData2() }
    listOf(data1.await(), data2.await())
}
```

If any child fails, all children are cancelled.

## supervisorScope

Like coroutineScope, but failures don't cancel siblings:

```kotlin
suspend fun loadAll(): List<Data?> = supervisorScope {
    val results = listOf(
        async { fetchData1() },
        async { fetchData2() },
        async { fetchData3() }
    )
    results.map {
        try { it.await() } catch (e: Exception) { null }
    }
}
```

## Exception Handling

```kotlin
suspend fun fetchWithRetry(id: String): User {
    repeat(3) { attempt ->
        try {
            return fetchUser(id)
        } catch (e: Exception) {
            if (attempt == 2) throw e
            delay(1000 * (attempt + 1).toLong())
        }
    }
    error("Unreachable")
}
```

## Cancellation

Suspend functions are cancellable:

```kotlin
suspend fun longRunningTask() {
    repeat(100) { i ->
        ensureActive()  // Check if cancelled
        println("Step $i")
        delay(100)      // Also checks cancellation
    }
}

fun main() = runBlocking {
    val job = launch { longRunningTask() }
    delay(500)
    job.cancel()  // Cancels the coroutine
}
```

## Common Patterns

### Timeout

```kotlin
suspend fun fetchWithTimeout(): User? {
    return withTimeoutOrNull(5000) {
        fetchUser("123")
    }
}
```

### Retry with Exponential Backoff

```kotlin
suspend fun <T> retry(
    times: Int = 3,
    initialDelay: Long = 100,
    factor: Double = 2.0,
    block: suspend () -> T
): T {
    var currentDelay = initialDelay
    repeat(times - 1) {
        try {
            return block()
        } catch (e: Exception) {
            delay(currentDelay)
            currentDelay = (currentDelay * factor).toLong()
        }
    }
    return block()
}
```

## Try It Yourself

1. Create a suspend function that simulates an API call
2. Call multiple suspend functions sequentially
3. Use `async` to run them in parallel
4. Implement a timeout using `withTimeoutOrNull`

## Key Takeaways

1. `suspend` marks functions that can pause
2. Call from other suspend functions or coroutines
3. Sequential by default, use `async` for parallel
4. `withContext` switches dispatchers
5. `coroutineScope` for structured child coroutines
6. Suspend functions support cancellation
7. Use `withTimeout` for time-limited operations
