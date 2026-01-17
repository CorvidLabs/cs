---
title: CRUD API
order: 2
difficulty: medium
estimatedMinutes: 30
---

# Exercise: CRUD API

Build a complete CRUD API for managing tasks.

## Requirements

1. Create Task model with id, title, completed
2. Implement all CRUD operations
3. Store tasks in memory
4. Return appropriate status codes

## API Endpoints

```
GET    /tasks        - List all tasks
POST   /tasks        - Create task
GET    /tasks/{id}   - Get task by ID
PUT    /tasks/{id}   - Update task
DELETE /tasks/{id}   - Delete task
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
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Serializable
data class Task(val id: Int, val title: String, val completed: Boolean = false)

@Serializable
data class CreateTask(val title: String)

@Serializable
data class UpdateTask(val title: String? = null, val completed: Boolean? = null)

class TaskRepository {
    private val tasks = mutableMapOf<Int, Task>()
    private var nextId = 1

    fun all() = tasks.values.toList()
    fun get(id: Int) = tasks[id]
    fun create(title: String) = Task(nextId++, title).also { tasks[it.id] = it }
    fun update(id: Int, title: String?, completed: Boolean?): Task? {
        val task = tasks[id] ?: return null
        val updated = task.copy(
            title = title ?: task.title,
            completed = completed ?: task.completed
        )
        tasks[id] = updated
        return updated
    }
    fun delete(id: Int) = tasks.remove(id) != null
}

fun main() {
    val repo = TaskRepository()

    embeddedServer(Netty, port = 8080) {
        install(ContentNegotiation) {
            json(Json { prettyPrint = true })
        }

        routing {
            route("/tasks") {
                get { call.respond(repo.all()) }

                post {
                    val req = call.receive<CreateTask>()
                    val task = repo.create(req.title)
                    call.respond(HttpStatusCode.Created, task)
                }

                get("/{id}") {
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: return@get call.respond(HttpStatusCode.BadRequest)
                    val task = repo.get(id)
                        ?: return@get call.respond(HttpStatusCode.NotFound)
                    call.respond(task)
                }

                put("/{id}") {
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: return@put call.respond(HttpStatusCode.BadRequest)
                    val req = call.receive<UpdateTask>()
                    val task = repo.update(id, req.title, req.completed)
                        ?: return@put call.respond(HttpStatusCode.NotFound)
                    call.respond(task)
                }

                delete("/{id}") {
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: return@delete call.respond(HttpStatusCode.BadRequest)
                    if (repo.delete(id)) {
                        call.respond(HttpStatusCode.NoContent)
                    } else {
                        call.respond(HttpStatusCode.NotFound)
                    }
                }
            }
        }
    }.start(wait = true)
}
```
</details>
