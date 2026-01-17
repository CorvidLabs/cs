---
title: Requests and Responses
order: 3
estimatedMinutes: 12
---

# Requests and Responses

Handle incoming requests and send appropriate responses.

## Reading Request Data

### Headers

```kotlin
get("/info") {
    val userAgent = call.request.headers["User-Agent"]
    val auth = call.request.headers["Authorization"]
    call.respondText("User-Agent: $userAgent")
}
```

### Body (Text)

```kotlin
post("/echo") {
    val body = call.receiveText()
    call.respondText("Received: $body")
}
```

### Body (JSON)

```kotlin
@Serializable
data class CreateUser(val name: String, val email: String)

post("/users") {
    val user = call.receive<CreateUser>()
    call.respondText("Created: ${user.name}")
}
```

## Sending Responses

### Text

```kotlin
call.respondText("Hello, World!")
call.respondText("Error", status = HttpStatusCode.BadRequest)
```

### JSON

```kotlin
@Serializable
data class User(val id: Int, val name: String)

get("/user") {
    call.respond(User(1, "Alice"))
}
```

### Status Codes

```kotlin
get("/status") {
    call.respond(HttpStatusCode.NoContent)
}

post("/users") {
    // Create user...
    call.respond(HttpStatusCode.Created, newUser)
}

get("/notfound") {
    call.respond(HttpStatusCode.NotFound, "User not found")
}
```

## Comparing to Swift (Vapor)

| Vapor | Ktor |
|-------|------|
| `req.headers["X-Custom"]` | `call.request.headers["X-Custom"]` |
| `try req.content.decode()` | `call.receive<Type>()` |
| `return user` | `call.respond(user)` |
| `.ok` | `HttpStatusCode.OK` |

## Response Headers

```kotlin
get("/download") {
    call.response.headers.append("Content-Disposition", "attachment")
    call.response.headers.append("X-Custom", "value")
    call.respondText("File content")
}
```

## Redirects

```kotlin
get("/old-path") {
    call.respondRedirect("/new-path")
}

get("/external") {
    call.respondRedirect("https://example.com", permanent = true)
}
```

## File Responses

```kotlin
get("/download/{name}") {
    val name = call.parameters["name"]!!
    val file = File("uploads/$name")
    call.respondFile(file)
}

// Serve static files
routing {
    staticResources("/static", "static")
}
```

## Error Handling

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        call.respond(HttpStatusCode.InternalServerError, cause.message ?: "Error")
    }

    exception<NotFoundException> { call, _ ->
        call.respond(HttpStatusCode.NotFound, "Not found")
    }

    status(HttpStatusCode.NotFound) { call, _ ->
        call.respondText("Page not found", status = HttpStatusCode.NotFound)
    }
}
```

## Request Validation

```kotlin
post("/users") {
    val user = call.receive<CreateUser>()

    if (user.name.isBlank()) {
        call.respond(HttpStatusCode.BadRequest, "Name required")
        return@post
    }

    if (!user.email.contains("@")) {
        call.respond(HttpStatusCode.BadRequest, "Invalid email")
        return@post
    }

    // Process valid user...
    call.respond(HttpStatusCode.Created, user)
}
```

## Cookies

```kotlin
get("/set-cookie") {
    call.response.cookies.append("session", "abc123", maxAge = 3600)
    call.respondText("Cookie set")
}

get("/read-cookie") {
    val session = call.request.cookies["session"]
    call.respondText("Session: $session")
}
```

## Try It Yourself

1. Create a POST endpoint that receives JSON
2. Return different status codes based on conditions
3. Set custom response headers
4. Implement basic validation

## Key Takeaways

1. `call.receive<T>()` for typed request bodies
2. `call.respond()` for responses
3. `HttpStatusCode` for status codes
4. Headers via `call.request.headers` and `call.response.headers`
5. `StatusPages` plugin for error handling
6. `call.respondRedirect()` for redirects
7. `call.respondFile()` for file downloads
