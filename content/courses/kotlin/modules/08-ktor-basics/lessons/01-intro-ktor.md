---
title: Introduction to Ktor
order: 1
estimatedMinutes: 12
---

# Introduction to Ktor

Ktor is a Kotlin-first framework for building asynchronous web applications.

## What is Ktor?

- Built by JetBrains
- 100% Kotlin
- Coroutines-based (non-blocking)
- Lightweight and modular
- Works on JVM, Native, and JavaScript

## Your First Ktor App

```kotlin
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") {
                call.respondText("Hello, World!")
            }
        }
    }.start(wait = true)
}
```

Run and visit `http://localhost:8080`

## Comparing to Swift (Vapor)

| Vapor (Swift) | Ktor (Kotlin) |
|---------------|---------------|
| `app.get("hello")` | `get("/hello")` |
| `req.content` | `call.receive()` |
| `return "text"` | `call.respondText("text")` |
| Middleware | Plugins |
| Fluent ORM | Exposed / Ktorm |

## Project Setup

### build.gradle.kts

```kotlin
plugins {
    kotlin("jvm") version "1.9.21"
    id("io.ktor.plugin") version "2.3.7"
    kotlin("plugin.serialization") version "1.9.21"
}

dependencies {
    implementation("io.ktor:ktor-server-core")
    implementation("io.ktor:ktor-server-netty")
    implementation("io.ktor:ktor-server-content-negotiation")
    implementation("io.ktor:ktor-serialization-kotlinx-json")
    implementation("ch.qos.logback:logback-classic:1.4.11")
}
```

## Application Structure

```kotlin
fun main() {
    embeddedServer(Netty, port = 8080, module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    configureRouting()
    configureSerialization()
}
```

## Engines

Ktor supports multiple engines:

```kotlin
// Netty (production-ready, full-featured)
embeddedServer(Netty, port = 8080) { }

// CIO (Coroutine-based I/O, pure Kotlin)
embeddedServer(CIO, port = 8080) { }

// Jetty (mature, enterprise)
embeddedServer(Jetty, port = 8080) { }
```

## Plugins (Features)

Ktor is modular - add only what you need:

```kotlin
fun Application.module() {
    install(ContentNegotiation) {
        json()
    }

    install(CORS) {
        anyHost()
    }

    install(Compression) {
        gzip()
    }
}
```

## Configuration

### application.conf (HOCON)

```hocon
ktor {
    deployment {
        port = 8080
        host = "0.0.0.0"
    }
    application {
        modules = [ com.example.ApplicationKt.module ]
    }
}
```

### Environment Variables

```kotlin
val port = System.getenv("PORT")?.toInt() ?: 8080
embeddedServer(Netty, port = port) { }
```

## Running the Server

```bash
# With Gradle
./gradlew run

# Or build and run JAR
./gradlew buildFatJar
java -jar build/libs/app.jar
```

## Try It Yourself

1. Create a new Ktor project
2. Add a basic route that returns "Hello, Ktor!"
3. Run the server and test with a browser
4. Add a second route at `/api/status`

## Key Takeaways

1. Ktor is Kotlin-first, coroutines-based
2. `embeddedServer` starts the application
3. `routing { }` defines endpoints
4. `call.respondText()` sends responses
5. Plugins add functionality (JSON, CORS, etc.)
6. Multiple engines available (Netty, CIO, Jetty)
7. Configuration via HOCON or environment
