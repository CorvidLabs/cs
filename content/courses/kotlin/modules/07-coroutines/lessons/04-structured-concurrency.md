---
title: Structured Concurrency
order: 4
estimatedMinutes: 12
---

# Structured Concurrency

Structured concurrency ensures coroutines don't leak and exceptions propagate properly.

## What is Structured Concurrency?

Rules:
1. Every coroutine has a parent scope
2. Parent waits for all children
3. Cancellation propagates to children
4. Failures propagate to parent

```kotlin
suspend fun loadData() = coroutineScope {
    launch { loadPart1() }  // Child 1
    launch { loadPart2() }  // Child 2
    // Function waits for both to complete
}
```

## Parent-Child Relationship

```kotlin
fun main() = runBlocking {  // Parent scope
    launch {  // Child 1
        launch {  // Grandchild
            delay(1000)
            println("Grandchild done")
        }
        println("Child 1 done")
    }
    launch {  // Child 2
        delay(500)
        println("Child 2 done")
    }
    println("Parent waiting...")
}
// All complete before runBlocking returns
```

## Cancellation Propagation

```kotlin
fun main() = runBlocking {
    val parent = launch {
        val child1 = launch {
            repeat(100) {
                delay(100)
                println("Child 1: $it")
            }
        }

        val child2 = launch {
            repeat(100) {
                delay(100)
                println("Child 2: $it")
            }
        }
    }

    delay(500)
    parent.cancel()  // Cancels child1 and child2 too
    parent.join()
    println("All cancelled")
}
```

## Exception Propagation

```kotlin
fun main() = runBlocking {
    try {
        coroutineScope {
            launch {
                delay(100)
                throw RuntimeException("Child failed")
            }
            launch {
                delay(1000)
                println("This won't print")
            }
        }
    } catch (e: Exception) {
        println("Caught: ${e.message}")
    }
}
// One child's failure cancels siblings
```

## SupervisorScope

Prevents sibling cancellation:

```kotlin
suspend fun loadAll() = supervisorScope {
    launch {
        throw RuntimeException("Task 1 failed")
    }
    launch {
        delay(100)
        println("Task 2 completed")  // Still runs!
    }
}
```

## Comparing to Swift

| Concept | Swift | Kotlin |
|---------|-------|--------|
| Structured concurrency | Task groups | coroutineScope |
| Child management | Automatic | Automatic |
| Cancellation | Propagates | Propagates |
| Error handling | throws in group | Exceptions propagate |

## coroutineScope vs supervisorScope

| Aspect | coroutineScope | supervisorScope |
|--------|----------------|-----------------|
| Child failure | Cancels all siblings | Siblings continue |
| Use case | All-or-nothing | Independent tasks |
| Exception | Propagates immediately | Handle per-child |

## Proper Scope Creation

```kotlin
class Repository(private val scope: CoroutineScope) {
    fun refresh() {
        scope.launch {
            // Respects parent scope lifecycle
        }
    }
}

// In Android ViewModel
class MyViewModel : ViewModel() {
    private val repository = Repository(viewModelScope)
}
```

## Global Scope (Avoid!)

```kotlin
// DON'T DO THIS - leaks coroutines
GlobalScope.launch {
    doWork()
}

// DO THIS - use structured scope
suspend fun doWork() = coroutineScope {
    launch { /* ... */ }
}
```

## Job Hierarchy

```kotlin
fun main() = runBlocking {
    val parentJob = coroutineContext[Job]
    println("Parent: $parentJob")

    launch {
        val childJob = coroutineContext[Job]
        println("Child: $childJob")
        println("Is child of parent: ${childJob?.parent == parentJob}")
    }
}
```

## Scope Functions

```kotlin
// Wait for all children
coroutineScope {
    launch { task1() }
    launch { task2() }
}  // Returns when both complete

// Supervisor - children independent
supervisorScope {
    launch { task1() }
    launch { task2() }
}  // task2 continues even if task1 fails

// Switch context
withContext(Dispatchers.IO) {
    readFile()
}  // Returns result
```

## Try It Yourself

1. Create a coroutineScope with multiple children
2. Cancel a parent and observe children cancellation
3. Use supervisorScope to handle independent failures
4. Create a proper CoroutineScope in a class

## Key Takeaways

1. All coroutines have a parent scope
2. Parent waits for all children
3. Cancellation flows down to children
4. Exceptions flow up to parent
5. `coroutineScope` cancels all on failure
6. `supervisorScope` allows independent failures
7. Avoid GlobalScope - use structured scopes
8. Proper scoping prevents leaks
