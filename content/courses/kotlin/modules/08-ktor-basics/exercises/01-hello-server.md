---
title: Hello Server
order: 1
difficulty: easy
estimatedMinutes: 15
---

# Exercise: Hello Server

Create your first Ktor server with multiple routes.

## Requirements

1. Create a server on port 8080
2. Add routes for: `/`, `/hello/{name}`, `/api/status`
3. Return appropriate responses for each

## Expected Behavior

```
GET /              → "Welcome to Ktor!"
GET /hello/Alice   → "Hello, Alice!"
GET /api/status    → {"status": "ok", "version": "1.0"}
```

## Starter Code

```kotlin
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    embeddedServer(Netty, port = 8080) {
        // Your routing here
    }.start(wait = true)
}
```

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

@Serializable
data class StatusResponse(val status: String, val version: String)

fun main() {
    embeddedServer(Netty, port = 8080) {
        install(ContentNegotiation) {
            json()
        }

        routing {
            get("/") {
                call.respondText("Welcome to Ktor!")
            }

            get("/hello/{name}") {
                val name = call.parameters["name"] ?: "World"
                call.respondText("Hello, $name!")
            }

            get("/api/status") {
                call.respond(StatusResponse("ok", "1.0"))
            }
        }
    }.start(wait = true)
}
```
</details>
