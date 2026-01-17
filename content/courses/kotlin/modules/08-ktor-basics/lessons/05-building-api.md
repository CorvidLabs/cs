---
title: Building a REST API
order: 5
estimatedMinutes: 15
---

# Building a REST API

Put it all together to build a complete REST API.

## API Structure

```
/api/v1
├── /users
│   ├── GET    - List all users
│   ├── POST   - Create user
│   └── /{id}
│       ├── GET    - Get user
│       ├── PUT    - Update user
│       └── DELETE - Delete user
└── /posts
    └── ...
```

## Data Models

```kotlin
@Serializable
data class User(
    val id: Int,
    val name: String,
    val email: String
)

@Serializable
data class CreateUserRequest(val name: String, val email: String)

@Serializable
data class UpdateUserRequest(val name: String?, val email: String?)

@Serializable
data class ApiError(val error: String)
```

## In-Memory Repository

```kotlin
class UserRepository {
    private val users = mutableMapOf<Int, User>()
    private var nextId = 1

    fun findAll(): List<User> = users.values.toList()

    fun findById(id: Int): User? = users[id]

    fun create(name: String, email: String): User {
        val user = User(nextId++, name, email)
        users[user.id] = user
        return user
    }

    fun update(id: Int, name: String?, email: String?): User? {
        val existing = users[id] ?: return null
        val updated = existing.copy(
            name = name ?: existing.name,
            email = email ?: existing.email
        )
        users[id] = updated
        return updated
    }

    fun delete(id: Int): Boolean = users.remove(id) != null
}
```

## Route Implementation

```kotlin
fun Route.userRoutes(repository: UserRepository) {
    route("/users") {
        // GET /users
        get {
            call.respond(repository.findAll())
        }

        // GET /users/{id}
        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, ApiError("Invalid ID"))
                return@get
            }

            val user = repository.findById(id)
            if (user == null) {
                call.respond(HttpStatusCode.NotFound, ApiError("User not found"))
                return@get
            }

            call.respond(user)
        }

        // POST /users
        post {
            val request = call.receive<CreateUserRequest>()

            if (request.name.isBlank()) {
                call.respond(HttpStatusCode.BadRequest, ApiError("Name required"))
                return@post
            }

            val user = repository.create(request.name, request.email)
            call.respond(HttpStatusCode.Created, user)
        }

        // PUT /users/{id}
        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, ApiError("Invalid ID"))
                return@put
            }

            val request = call.receive<UpdateUserRequest>()
            val user = repository.update(id, request.name, request.email)

            if (user == null) {
                call.respond(HttpStatusCode.NotFound, ApiError("User not found"))
                return@put
            }

            call.respond(user)
        }

        // DELETE /users/{id}
        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, ApiError("Invalid ID"))
                return@delete
            }

            if (repository.delete(id)) {
                call.respond(HttpStatusCode.NoContent)
            } else {
                call.respond(HttpStatusCode.NotFound, ApiError("User not found"))
            }
        }
    }
}
```

## Application Setup

```kotlin
fun main() {
    embeddedServer(Netty, port = 8080) {
        install(ContentNegotiation) {
            json(Json { prettyPrint = true })
        }

        install(StatusPages) {
            exception<SerializationException> { call, _ ->
                call.respond(HttpStatusCode.BadRequest, ApiError("Invalid JSON"))
            }
            exception<Throwable> { call, cause ->
                call.respond(HttpStatusCode.InternalServerError, ApiError(cause.message ?: "Error"))
            }
        }

        val userRepository = UserRepository()

        routing {
            route("/api/v1") {
                userRoutes(userRepository)
            }
        }
    }.start(wait = true)
}
```

## Testing Your API

```bash
# Create user
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'

# List users
curl http://localhost:8080/api/v1/users

# Get user
curl http://localhost:8080/api/v1/users/1

# Update user
curl -X PUT http://localhost:8080/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Updated"}'

# Delete user
curl -X DELETE http://localhost:8080/api/v1/users/1
```

## Adding Pagination

```kotlin
@Serializable
data class PaginatedResponse<T>(
    val data: List<T>,
    val page: Int,
    val limit: Int,
    val total: Int
)

get {
    val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
    val limit = call.request.queryParameters["limit"]?.toIntOrNull() ?: 10

    val all = repository.findAll()
    val paginated = all.drop((page - 1) * limit).take(limit)

    call.respond(PaginatedResponse(paginated, page, limit, all.size))
}
```

## Try It Yourself

1. Build the complete CRUD API
2. Add input validation
3. Implement pagination
4. Add filtering by query parameters

## Key Takeaways

1. Structure routes by resource
2. Use repository pattern for data access
3. Validate input before processing
4. Return appropriate status codes
5. Handle errors with StatusPages
6. Version your API (`/api/v1`)
7. Document with examples
