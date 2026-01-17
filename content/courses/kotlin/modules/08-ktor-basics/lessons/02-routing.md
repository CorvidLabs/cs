---
title: Routing
order: 2
estimatedMinutes: 12
---

# Routing

Define how your application handles different HTTP requests.

## Basic Routes

```kotlin
routing {
    get("/") {
        call.respondText("Home")
    }

    post("/users") {
        call.respondText("Create user")
    }

    put("/users/{id}") {
        call.respondText("Update user")
    }

    delete("/users/{id}") {
        call.respondText("Delete user")
    }
}
```

## Route Parameters

```kotlin
get("/users/{id}") {
    val id = call.parameters["id"]
    call.respondText("User ID: $id")
}

// Optional parameters
get("/items/{id?}") {
    val id = call.parameters["id"] ?: "default"
    call.respondText("Item: $id")
}
```

## Query Parameters

```kotlin
// GET /search?q=kotlin&limit=10
get("/search") {
    val query = call.request.queryParameters["q"]
    val limit = call.request.queryParameters["limit"]?.toIntOrNull() ?: 10
    call.respondText("Search: $query, limit: $limit")
}
```

## Comparing to Swift (Vapor)

| Vapor | Ktor |
|-------|------|
| `app.get("users", ":id")` | `get("/users/{id}")` |
| `req.parameters.get("id")` | `call.parameters["id"]` |
| `req.query["q"]` | `call.request.queryParameters["q"]` |
| `app.grouped("api")` | `route("/api")` |

## Route Grouping

```kotlin
routing {
    route("/api") {
        route("/v1") {
            get("/users") { /* GET /api/v1/users */ }
            get("/posts") { /* GET /api/v1/posts */ }
        }

        route("/v2") {
            get("/users") { /* GET /api/v2/users */ }
        }
    }
}
```

## Organizing Routes

### Separate Files

```kotlin
// UserRoutes.kt
fun Route.userRoutes() {
    route("/users") {
        get { call.respondText("List users") }
        get("/{id}") { call.respondText("Get user") }
        post { call.respondText("Create user") }
    }
}

// Application.kt
fun Application.configureRouting() {
    routing {
        userRoutes()
        postRoutes()
    }
}
```

## HTTP Methods

```kotlin
routing {
    get("/resource") { }      // Retrieve
    post("/resource") { }     // Create
    put("/resource/{id}") { } // Replace
    patch("/resource/{id}") { } // Partial update
    delete("/resource/{id}") { } // Delete
    head("/resource") { }     // Headers only
    options("/resource") { }  // Allowed methods
}
```

## Wildcard Routes

```kotlin
// Match any path
get("/{...}") {
    val path = call.parameters.getAll("...")
    call.respondText("Path: $path")
}

// Tailcard
get("/files/{path...}") {
    val path = call.parameters.getAll("path")?.joinToString("/")
    call.respondText("File path: $path")
}
```

## Route Priority

More specific routes match first:

```kotlin
routing {
    get("/users/me") {
        // Matches /users/me specifically
    }
    get("/users/{id}") {
        // Matches /users/123, /users/abc, etc.
    }
}
```

## Typed Routes (Resources)

```kotlin
@Resource("/users")
class Users {
    @Resource("{id}")
    class Id(val parent: Users = Users(), val id: Long)
}

routing {
    get<Users> {
        call.respondText("List all users")
    }
    get<Users.Id> { user ->
        call.respondText("User ${user.id}")
    }
}
```

## Try It Yourself

1. Create routes for CRUD operations on a resource
2. Use path parameters to get an ID
3. Handle query parameters for search
4. Organize routes into separate functions

## Key Takeaways

1. `get()`, `post()`, `put()`, `delete()` for HTTP methods
2. `{param}` for path parameters
3. `queryParameters["key"]` for query strings
4. `route("/path")` for grouping
5. Extract routes to functions for organization
6. More specific routes have priority
7. Wildcard with `{...}` or `{param...}`
