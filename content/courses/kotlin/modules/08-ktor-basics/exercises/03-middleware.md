---
title: Middleware & Plugins
order: 3
difficulty: medium
estimatedMinutes: 25
---

# Exercise: Middleware & Plugins

Add logging, authentication, and error handling to your API.

## Requirements

1. Log all requests with method, path, and response time
2. Add basic API key authentication
3. Handle errors gracefully with JSON responses
4. Add CORS support

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
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

@Serializable
data class ErrorResponse(val error: String, val code: Int)

// Custom logging plugin
val RequestLogging = createApplicationPlugin("RequestLogging") {
    onCall { call ->
        call.attributes.put(startTimeKey, System.currentTimeMillis())
    }
    onCallRespond { call, _ ->
        val startTime = call.attributes.getOrNull(startTimeKey) ?: return@onCallRespond
        val duration = System.currentTimeMillis() - startTime
        println("${call.request.httpMethod.value} ${call.request.path()} - ${duration}ms")
    }
}

private val startTimeKey = io.ktor.util.AttributeKey<Long>("startTime")

// API Key check
fun Route.authenticated(apiKey: String, build: Route.() -> Unit) {
    intercept(ApplicationCallPipeline.Call) {
        val key = call.request.headers["X-API-Key"]
        if (key != apiKey) {
            call.respond(HttpStatusCode.Unauthorized, ErrorResponse("Invalid API key", 401))
            finish()
        }
    }
    build()
}

fun main() {
    val validApiKey = "secret-key-123"

    embeddedServer(Netty, port = 8080) {
        install(ContentNegotiation) { json() }

        install(RequestLogging)

        install(CORS) {
            anyHost()
            allowHeader(HttpHeaders.ContentType)
            allowHeader("X-API-Key")
        }

        install(StatusPages) {
            exception<Throwable> { call, cause ->
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ErrorResponse(cause.message ?: "Unknown error", 500)
                )
            }
        }

        routing {
            get("/health") {
                call.respondText("OK")
            }

            route("/api") {
                authenticated(validApiKey) {
                    get("/secret") {
                        call.respondText("You have access!")
                    }

                    get("/data") {
                        call.respond(mapOf("message" to "Protected data"))
                    }
                }
            }
        }
    }.start(wait = true)
}
```
</details>

## Testing

```bash
# Health check (no auth)
curl http://localhost:8080/health

# Without API key (should fail)
curl http://localhost:8080/api/secret

# With API key
curl -H "X-API-Key: secret-key-123" http://localhost:8080/api/secret
```
