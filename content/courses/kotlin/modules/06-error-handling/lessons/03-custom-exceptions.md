---
title: Custom Exceptions
order: 3
estimatedMinutes: 10
---

# Custom Exceptions

Create your own exception types for domain-specific errors.

## Basic Custom Exception

```kotlin
class ValidationException(message: String) : Exception(message)

fun validateEmail(email: String) {
    if (!email.contains("@")) {
        throw ValidationException("Invalid email format: $email")
    }
}
```

## With Additional Properties

```kotlin
class ApiException(
    message: String,
    val statusCode: Int,
    val endpoint: String
) : Exception(message)

fun handleApiError(e: ApiException) {
    println("API Error ${e.statusCode} at ${e.endpoint}: ${e.message}")
}
```

## With Cause

```kotlin
class DatabaseException(
    message: String,
    cause: Throwable? = null
) : Exception(message, cause)

fun queryDatabase(sql: String): List<Row> {
    return try {
        executeQuery(sql)
    } catch (e: SQLException) {
        throw DatabaseException("Query failed: $sql", e)
    }
}
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `struct MyError: Error` | `class MyException : Exception()` |
| Enum-based errors common | Class-based exceptions |
| `LocalizedError` protocol | Override `message` |

## Exception Hierarchies

```kotlin
sealed class AppException(message: String) : Exception(message)

class NetworkException(message: String) : AppException(message)
class AuthException(message: String) : AppException(message)
class DataException(message: String) : AppException(message)

fun handleError(e: AppException) = when (e) {
    is NetworkException -> "Check your connection"
    is AuthException -> "Please log in again"
    is DataException -> "Invalid data"
}
```

## RuntimeException vs Exception

```kotlin
// RuntimeException: programming errors
class ConfigurationError(message: String) : RuntimeException(message)

// Exception: recoverable errors
class FileNotFoundException(path: String) : Exception("File not found: $path")
```

## Best Practices

### 1. Meaningful Names

```kotlin
// Good
class InsufficientFundsException(val balance: Double, val required: Double)
    : Exception("Insufficient funds: have $balance, need $required")

// Bad
class MyException(message: String) : Exception(message)
```

### 2. Include Context

```kotlin
class OrderProcessingException(
    val orderId: String,
    val step: String,
    message: String,
    cause: Throwable? = null
) : Exception("Order $orderId failed at $step: $message", cause)
```

### 3. Keep Hierarchy Simple

```kotlin
// Simple and clear
sealed class PaymentException(message: String) : Exception(message) {
    class CardDeclined(val reason: String) : PaymentException("Card declined: $reason")
    class InsufficientFunds(val amount: Double) : PaymentException("Insufficient funds: $amount")
    class NetworkError(cause: Throwable) : PaymentException("Payment network error")
}
```

## Companion Object for Factory

```kotlin
class ApiException private constructor(
    message: String,
    val code: Int
) : Exception(message) {

    companion object {
        fun notFound(resource: String) =
            ApiException("$resource not found", 404)

        fun unauthorized() =
            ApiException("Unauthorized", 401)

        fun serverError(details: String) =
            ApiException("Server error: $details", 500)
    }
}

// Usage
throw ApiException.notFound("User")
```

## Try It Yourself

1. Create a `ValidationException` with a list of errors
2. Create an exception hierarchy for a payment system
3. Add context properties to an exception
4. Create factory methods for common error cases

## Key Takeaways

1. Extend `Exception` or `RuntimeException`
2. Include helpful properties (code, context)
3. Preserve cause with second constructor parameter
4. Use meaningful names
5. Consider sealed classes for exhaustive handling
6. Use companion objects for factory methods
