---
title: Sealed Classes for Errors
order: 5
estimatedMinutes: 12
---

# Sealed Classes for Errors

Sealed classes provide type-safe, exhaustive error handling without exceptions.

## Basic Pattern

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
}

fun fetchUser(id: String): Result<User> {
    return if (userExists(id)) {
        Result.Success(loadUser(id))
    } else {
        Result.Error("User not found: $id")
    }
}

fun main() {
    when (val result = fetchUser("123")) {
        is Result.Success -> println("User: ${result.data}")
        is Result.Error -> println("Error: ${result.message}")
    }
}
```

## With Multiple Error Types

```kotlin
sealed class ApiResult<out T> {
    data class Success<T>(val data: T) : ApiResult<T>()

    sealed class Failure : ApiResult<Nothing>() {
        data class NetworkError(val cause: Exception) : Failure()
        data class HttpError(val code: Int, val message: String) : Failure()
        data class ParseError(val raw: String) : Failure()
        object Unauthorized : Failure()
    }
}
```

## Exhaustive Handling

```kotlin
fun handleResult(result: ApiResult<User>) {
    when (result) {
        is ApiResult.Success -> displayUser(result.data)
        is ApiResult.Failure.NetworkError -> showRetryDialog()
        is ApiResult.Failure.HttpError -> showHttpError(result.code)
        is ApiResult.Failure.ParseError -> logParseError(result.raw)
        ApiResult.Failure.Unauthorized -> redirectToLogin()
    }
    // No else needed - compiler ensures all cases handled
}
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `enum Result { case success, failure }` | `sealed class Result` |
| Associated values | Data class properties |
| Switch exhaustiveness | When exhaustiveness |

## Loading State Pattern

```kotlin
sealed class UiState<out T> {
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String) : UiState<Nothing>()
}

class UserViewModel {
    var state: UiState<User> = UiState.Loading
        private set

    fun loadUser(id: String) {
        state = UiState.Loading

        state = try {
            val user = userRepository.get(id)
            UiState.Success(user)
        } catch (e: Exception) {
            UiState.Error(e.message ?: "Unknown error")
        }
    }
}
```

## Either Pattern

Generic success/error container:

```kotlin
sealed class Either<out L, out R> {
    data class Left<L>(val value: L) : Either<L, Nothing>()
    data class Right<R>(val value: R) : Either<Nothing, R>()
}

// Left = error, Right = success (by convention)
typealias ApiResponse<T> = Either<ApiError, T>

fun fetchData(): ApiResponse<Data> {
    return if (successful) {
        Either.Right(data)
    } else {
        Either.Left(ApiError.NotFound)
    }
}
```

## Extension Functions for Sealed Results

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
}

fun <T, R> Result<T>.map(transform: (T) -> R): Result<R> = when (this) {
    is Result.Success -> Result.Success(transform(data))
    is Result.Error -> this
}

fun <T> Result<T>.getOrNull(): T? = when (this) {
    is Result.Success -> data
    is Result.Error -> null
}

fun <T> Result<T>.getOrDefault(default: T): T = when (this) {
    is Result.Success -> data
    is Result.Error -> default
}
```

## Domain Error Example

```kotlin
sealed class OrderError {
    object ProductNotFound : OrderError()
    data class InsufficientStock(val available: Int, val requested: Int) : OrderError()
    data class PaymentFailed(val reason: String) : OrderError()
    object UserNotAuthenticated : OrderError()
}

sealed class OrderResult {
    data class Success(val order: Order) : OrderResult()
    data class Failed(val error: OrderError) : OrderResult()
}

fun handleOrderError(error: OrderError): String = when (error) {
    is OrderError.ProductNotFound -> "Product not available"
    is OrderError.InsufficientStock ->
        "Only ${error.available} items available (requested ${error.requested})"
    is OrderError.PaymentFailed -> "Payment failed: ${error.reason}"
    is OrderError.UserNotAuthenticated -> "Please log in to continue"
}
```

## Try It Yourself

1. Create a sealed class for authentication states
2. Implement the UI state pattern for a list view
3. Create extension functions for your sealed result
4. Model a form validation result with multiple errors

## Key Takeaways

1. Sealed classes define closed type hierarchies
2. `when` ensures exhaustive handling
3. Cleaner than exceptions for expected errors
4. Can model complex state machines
5. Add extension functions for common operations
6. Great for UI state management
7. Type-safe alternative to Result<T>
