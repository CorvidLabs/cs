---
title: API Response Handling
order: 3
difficulty: medium
estimatedMinutes: 25
---

# Exercise: API Response Handling

Model and handle API responses using sealed classes.

## Requirements

1. Create a sealed class hierarchy for API responses
2. Handle success, various error types, and loading state
3. Implement a mock API client
4. Display appropriate UI messages

## Starter Code

```kotlin
// Define your sealed class hierarchy for API responses

data class User(val id: Int, val name: String)

class MockApiClient {
    fun fetchUser(id: Int): ApiResponse<User> {
        // Simulate different responses based on ID
    }
}

fun displayResult(response: ApiResponse<User>) {
    // Handle all response types
}

fun main() {
    val client = MockApiClient()

    println("Fetching user 1:")
    displayResult(client.fetchUser(1))

    println("\nFetching user 404:")
    displayResult(client.fetchUser(404))

    println("\nFetching user 500:")
    displayResult(client.fetchUser(500))

    println("\nFetching user 401:")
    displayResult(client.fetchUser(401))
}
```

## Expected Output

```
Fetching user 1:
✓ Success: User(id=1, name=Alice)

Fetching user 404:
✗ Not Found: User with ID 404 does not exist

Fetching user 500:
✗ Server Error: Internal server error. Please try again later.

Fetching user 401:
✗ Unauthorized: Please log in to access this resource
```

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
sealed class ApiResponse<out T> {
    data class Success<T>(val data: T) : ApiResponse<T>()
    object Loading : ApiResponse<Nothing>()

    sealed class Error : ApiResponse<Nothing>() {
        data class NotFound(val message: String) : Error()
        data class ServerError(val message: String) : Error()
        object Unauthorized : Error()
        data class NetworkError(val cause: Exception) : Error()
    }
}

data class User(val id: Int, val name: String)

class MockApiClient {
    fun fetchUser(id: Int): ApiResponse<User> = when (id) {
        1 -> ApiResponse.Success(User(1, "Alice"))
        2 -> ApiResponse.Success(User(2, "Bob"))
        404 -> ApiResponse.Error.NotFound("User with ID $id does not exist")
        500 -> ApiResponse.Error.ServerError("Internal server error. Please try again later.")
        401 -> ApiResponse.Error.Unauthorized
        else -> ApiResponse.Error.NetworkError(Exception("Connection timeout"))
    }
}

fun displayResult(response: ApiResponse<User>) {
    when (response) {
        is ApiResponse.Success ->
            println("✓ Success: ${response.data}")

        is ApiResponse.Loading ->
            println("⏳ Loading...")

        is ApiResponse.Error.NotFound ->
            println("✗ Not Found: ${response.message}")

        is ApiResponse.Error.ServerError ->
            println("✗ Server Error: ${response.message}")

        is ApiResponse.Error.Unauthorized ->
            println("✗ Unauthorized: Please log in to access this resource")

        is ApiResponse.Error.NetworkError ->
            println("✗ Network Error: ${response.cause.message}")
    }
}

fun main() {
    val client = MockApiClient()

    println("Fetching user 1:")
    displayResult(client.fetchUser(1))

    println("\nFetching user 404:")
    displayResult(client.fetchUser(404))

    println("\nFetching user 500:")
    displayResult(client.fetchUser(500))

    println("\nFetching user 401:")
    displayResult(client.fetchUser(401))

    println("\nFetching user 999:")
    displayResult(client.fetchUser(999))
}
```
</details>
