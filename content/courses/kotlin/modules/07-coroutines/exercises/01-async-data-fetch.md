---
title: Async Data Fetch
order: 1
difficulty: medium
estimatedMinutes: 20
---

# Exercise: Async Data Fetch

Practice coroutines by fetching data asynchronously.

## Requirements

1. Simulate API calls with delays
2. Fetch user data sequentially
3. Then optimize with parallel fetching
4. Compare execution times

## Starter Code

```kotlin
import kotlinx.coroutines.*
import kotlin.system.measureTimeMillis

data class User(val id: String, val name: String)
data class Posts(val userId: String, val count: Int)
data class Profile(val user: User, val posts: Posts)

// Simulate API calls
suspend fun fetchUser(id: String): User {
    delay(1000)  // 1 second
    return User(id, "User $id")
}

suspend fun fetchPosts(userId: String): Posts {
    delay(1000)  // 1 second
    return Posts(userId, 42)
}

// Implement these functions
suspend fun loadProfileSequential(userId: String): Profile {
    // Your code here - fetch sequentially
}

suspend fun loadProfileParallel(userId: String): Profile {
    // Your code here - fetch in parallel
}

fun main() = runBlocking {
    val sequentialTime = measureTimeMillis {
        val profile = loadProfileSequential("123")
        println("Sequential: $profile")
    }
    println("Sequential took: ${sequentialTime}ms\n")

    val parallelTime = measureTimeMillis {
        val profile = loadProfileParallel("123")
        println("Parallel: $profile")
    }
    println("Parallel took: ${parallelTime}ms")
}
```

## Expected Output

```
Sequential: Profile(user=User(id=123, name=User 123), posts=Posts(userId=123, count=42))
Sequential took: ~2000ms

Parallel: Profile(user=User(id=123, name=User 123), posts=Posts(userId=123, count=42))
Parallel took: ~1000ms
```

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
import kotlinx.coroutines.*
import kotlin.system.measureTimeMillis

data class User(val id: String, val name: String)
data class Posts(val userId: String, val count: Int)
data class Profile(val user: User, val posts: Posts)

suspend fun fetchUser(id: String): User {
    delay(1000)
    return User(id, "User $id")
}

suspend fun fetchPosts(userId: String): Posts {
    delay(1000)
    return Posts(userId, 42)
}

suspend fun loadProfileSequential(userId: String): Profile {
    val user = fetchUser(userId)
    val posts = fetchPosts(userId)
    return Profile(user, posts)
}

suspend fun loadProfileParallel(userId: String): Profile = coroutineScope {
    val userDeferred = async { fetchUser(userId) }
    val postsDeferred = async { fetchPosts(userId) }
    Profile(userDeferred.await(), postsDeferred.await())
}

fun main() = runBlocking {
    val sequentialTime = measureTimeMillis {
        val profile = loadProfileSequential("123")
        println("Sequential: $profile")
    }
    println("Sequential took: ${sequentialTime}ms\n")

    val parallelTime = measureTimeMillis {
        val profile = loadProfileParallel("123")
        println("Parallel: $profile")
    }
    println("Parallel took: ${parallelTime}ms")
}
```
</details>
