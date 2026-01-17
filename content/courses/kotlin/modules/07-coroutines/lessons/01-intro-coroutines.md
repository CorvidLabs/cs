---
title: Introduction to Coroutines
order: 1
estimatedMinutes: 15
---

# Introduction to Coroutines

Coroutines are Kotlin's solution for asynchronous programming. They allow you to write async code that looks sequential.

## What Are Coroutines?

Coroutines are:
- Lightweight threads
- Suspendable computations
- Non-blocking by design
- Structured and cancellable

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello,")
}
// Output:
// Hello,
// World! (after 1 second)
```

## Why Coroutines?

### The Problem with Callbacks

```kotlin
// Callback hell
fetchUser(userId) { user ->
    fetchPosts(user.id) { posts ->
        fetchComments(posts[0].id) { comments ->
            displayData(user, posts, comments)
        }
    }
}
```

### The Coroutine Solution

```kotlin
// Clean sequential code
suspend fun loadData(userId: String) {
    val user = fetchUser(userId)
    val posts = fetchPosts(user.id)
    val comments = fetchComments(posts[0].id)
    displayData(user, posts, comments)
}
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `async/await` | `suspend` functions |
| `Task { }` | `launch { }` |
| `await` at call site | No keyword at call site |
| `async let` for parallel | `async { }` for parallel |
| Actor isolation | Dispatchers + Mutex |

## Key Concepts

### Suspend Functions

Functions that can pause and resume:

```kotlin
suspend fun fetchData(): String {
    delay(1000)  // Suspends, doesn't block
    return "Data"
}
```

### Coroutine Builders

Start coroutines:

```kotlin
// launch: fire and forget
launch { doSomething() }

// async: returns a result
val deferred = async { computeSomething() }
val result = deferred.await()

// runBlocking: bridges regular and suspend world
runBlocking { suspendFunction() }
```

### Dispatchers

Control which thread runs the code:

```kotlin
launch(Dispatchers.IO) {
    // For I/O operations
}

launch(Dispatchers.Default) {
    // For CPU-intensive work
}

launch(Dispatchers.Main) {
    // For UI updates (Android)
}
```

## Your First Coroutine

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    println("Starting on ${Thread.currentThread().name}")

    launch {
        delay(200)
        println("Task 1 on ${Thread.currentThread().name}")
    }

    launch {
        delay(100)
        println("Task 2 on ${Thread.currentThread().name}")
    }

    println("Coroutines launched")
}
```

Output:
```
Starting on main
Coroutines launched
Task 2 on main
Task 1 on main
```

## delay vs Thread.sleep

```kotlin
// delay: suspends coroutine, thread is free
delay(1000)

// Thread.sleep: blocks the thread
Thread.sleep(1000)  // Don't use in coroutines!
```

## Setup

Add to your `build.gradle.kts`:

```kotlin
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
}
```

## Try It Yourself

1. Create a simple coroutine with `runBlocking` and `launch`
2. Use `delay` to pause execution
3. Launch multiple coroutines and observe the order
4. Print the thread name in different coroutines

## Key Takeaways

1. Coroutines are lightweight, suspendable computations
2. `suspend` functions can pause and resume
3. `launch` starts a coroutine (fire-and-forget)
4. `async` starts a coroutine that returns a result
5. `runBlocking` bridges blocking and non-blocking worlds
6. `delay` suspends without blocking
7. Dispatchers control thread execution
