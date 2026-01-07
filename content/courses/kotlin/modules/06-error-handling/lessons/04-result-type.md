---
title: Result Type
order: 4
estimatedMinutes: 12
---

# Result Type

Kotlin's `Result` type wraps success or failure without throwing exceptions.

## Creating Results

```kotlin
val success: Result<Int> = Result.success(42)
val failure: Result<Int> = Result.failure(Exception("Something went wrong"))
```

## Using runCatching

Wrap exception-throwing code:

```kotlin
val result = runCatching {
    "42".toInt()
}

println(result.isSuccess)  // true
println(result.getOrNull())  // 42
```

## Handling Results

```kotlin
val result = runCatching {
    fetchUserData()
}

// getOrNull - returns null on failure
val data = result.getOrNull()

// getOrDefault - default value on failure
val data = result.getOrDefault("default")

// getOrElse - compute on failure
val data = result.getOrElse { error ->
    log(error)
    "fallback"
}

// getOrThrow - throw on failure
val data = result.getOrThrow()
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `Result<Success, Failure>` | `Result<T>` |
| `.success(value)` | `Result.success(value)` |
| `.failure(error)` | `Result.failure(exception)` |
| `switch result { }` | `result.fold { } { }` |

Swift's Result has typed errors; Kotlin's uses Throwable.

## fold - Handle Both Cases

```kotlin
val message = result.fold(
    onSuccess = { value -> "Got: $value" },
    onFailure = { error -> "Error: ${error.message}" }
)
```

## map and mapCatching

Transform success values:

```kotlin
val result = runCatching { "42" }

val doubled = result.map { it.toInt() * 2 }
// Result<Int> with value 84

// mapCatching: catches exceptions in transform
val parsed = result.mapCatching { it.toInt() }
```

## recover and recoverCatching

Transform failures:

```kotlin
val result = runCatching { fetchFromNetwork() }
    .recover { fetchFromCache() }  // Try cache on failure
```

## onSuccess and onFailure

Side effects without changing Result:

```kotlin
runCatching { processData() }
    .onSuccess { println("Processed: $it") }
    .onFailure { println("Failed: ${it.message}") }
```

## Chaining Operations

```kotlin
val finalResult = runCatching { fetchRawData() }
    .mapCatching { parseJson(it) }
    .mapCatching { validateData(it) }
    .recoverCatching { loadDefaultData() }
    .onFailure { log.error("All attempts failed", it) }
```

## Result in Functions

```kotlin
fun divide(a: Int, b: Int): Result<Int> = runCatching {
    require(b != 0) { "Cannot divide by zero" }
    a / b
}

fun main() {
    divide(10, 2).onSuccess { println("Result: $it") }
    divide(10, 0).onFailure { println("Error: ${it.message}") }
}
```

## Result vs Exceptions

### Use Result When:
- Errors are expected and common
- Caller should handle errors
- Chaining operations is useful
- You want explicit error handling

### Use Exceptions When:
- Errors are unexpected/exceptional
- Error should propagate up
- Simple error handling needed
- Interacting with Java code

## Practical Example

```kotlin
class UserService {
    fun getUser(id: String): Result<User> = runCatching {
        val response = api.fetchUser(id)
        parseUser(response)
    }
}

fun main() {
    userService.getUser("123")
        .mapCatching { enrichUser(it) }
        .fold(
            onSuccess = { displayUser(it) },
            onFailure = { showError(it.message ?: "Unknown error") }
        )
}
```

## Try It Yourself

1. Wrap a risky operation with `runCatching`
2. Chain `map` and `recover` operations
3. Use `fold` to handle both cases
4. Create a function returning `Result<T>`

## Key Takeaways

1. `Result<T>` wraps success or failure
2. `runCatching { }` creates Result from code
3. `getOrNull()`, `getOrDefault()`, `getOrElse()`
4. `fold()` handles both cases
5. `map()` transforms success
6. `recover()` handles failure
7. `onSuccess()`, `onFailure()` for side effects
8. Chain operations for pipelines
