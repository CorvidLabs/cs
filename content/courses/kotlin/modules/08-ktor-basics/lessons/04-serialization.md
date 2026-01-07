---
title: Serialization
order: 4
estimatedMinutes: 12
---

# Serialization

Convert Kotlin objects to/from JSON automatically.

## Setup

```kotlin
// build.gradle.kts
plugins {
    kotlin("plugin.serialization") version "1.9.21"
}

dependencies {
    implementation("io.ktor:ktor-server-content-negotiation")
    implementation("io.ktor:ktor-serialization-kotlinx-json")
}
```

## Configure Content Negotiation

```kotlin
fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
            ignoreUnknownKeys = true
        })
    }
}
```

## Define Serializable Classes

```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: Int,
    val name: String,
    val email: String
)

@Serializable
data class CreateUserRequest(
    val name: String,
    val email: String
)

@Serializable
data class ErrorResponse(
    val error: String,
    val code: Int
)
```

## Receive JSON

```kotlin
post("/users") {
    val request = call.receive<CreateUserRequest>()
    val user = User(
        id = generateId(),
        name = request.name,
        email = request.email
    )
    call.respond(HttpStatusCode.Created, user)
}
```

## Respond with JSON

```kotlin
get("/users") {
    val users = listOf(
        User(1, "Alice", "alice@example.com"),
        User(2, "Bob", "bob@example.com")
    )
    call.respond(users)
}

get("/users/{id}") {
    val id = call.parameters["id"]?.toIntOrNull()
    val user = findUser(id)

    if (user != null) {
        call.respond(user)
    } else {
        call.respond(
            HttpStatusCode.NotFound,
            ErrorResponse("User not found", 404)
        )
    }
}
```

## Comparing to Swift (Vapor)

| Vapor | Ktor |
|-------|------|
| `Content` protocol | `@Serializable` |
| Auto Content conformance | `kotlinx.serialization` |
| `req.content.decode()` | `call.receive<T>()` |

## Custom Serializers

```kotlin
@Serializable
data class Event(
    val name: String,
    @Serializable(with = DateSerializer::class)
    val date: LocalDate
)

object DateSerializer : KSerializer<LocalDate> {
    override val descriptor = PrimitiveSerialDescriptor("LocalDate", PrimitiveKind.STRING)

    override fun serialize(encoder: Encoder, value: LocalDate) {
        encoder.encodeString(value.toString())
    }

    override fun deserialize(decoder: Decoder): LocalDate {
        return LocalDate.parse(decoder.decodeString())
    }
}
```

## Optional and Default Values

```kotlin
@Serializable
data class UserSettings(
    val theme: String = "light",
    val notifications: Boolean = true,
    val language: String? = null
)

// Both valid:
// { }
// { "theme": "dark" }
// { "theme": "dark", "language": "en" }
```

## Nested Objects

```kotlin
@Serializable
data class Post(
    val id: Int,
    val title: String,
    val author: User,
    val tags: List<String>
)

@Serializable
data class ApiResponse<T>(
    val data: T,
    val meta: Meta
)

@Serializable
data class Meta(
    val page: Int,
    val total: Int
)
```

## Handling Errors

```kotlin
install(StatusPages) {
    exception<SerializationException> { call, cause ->
        call.respond(
            HttpStatusCode.BadRequest,
            ErrorResponse("Invalid JSON: ${cause.message}", 400)
        )
    }
}
```

## Try It Yourself

1. Create a serializable data class
2. Build a POST endpoint that receives JSON
3. Return a list of objects as JSON
4. Add default values to request objects

## Key Takeaways

1. `@Serializable` marks data classes
2. `ContentNegotiation` plugin enables JSON
3. `call.receive<T>()` deserializes requests
4. `call.respond(obj)` serializes responses
5. Configure `Json { }` for options
6. Handle `SerializationException` for invalid JSON
7. Use default values for optional fields
