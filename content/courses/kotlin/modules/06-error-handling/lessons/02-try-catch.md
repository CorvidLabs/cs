---
title: Try-Catch-Finally
order: 2
estimatedMinutes: 12
---

# Try-Catch-Finally

Handle exceptions gracefully with try-catch blocks.

## Basic Try-Catch

```kotlin
fun parseNumber(s: String): Int {
    return try {
        s.toInt()
    } catch (e: NumberFormatException) {
        println("Invalid number: $s")
        0  // Default value
    }
}
```

## Try is an Expression

In Kotlin, `try` returns a value:

```kotlin
val number = try {
    input.toInt()
} catch (e: NumberFormatException) {
    -1
}
```

## Multiple Catch Blocks

```kotlin
fun readData(source: String): String {
    return try {
        fetchFromNetwork(source)
    } catch (e: IOException) {
        println("Network error: ${e.message}")
        ""
    } catch (e: SecurityException) {
        println("Access denied")
        ""
    } catch (e: Exception) {
        println("Unknown error: ${e.message}")
        ""
    }
}
```

Order matters: catch most specific exceptions first.

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `do { try ... } catch { }` | `try { ... } catch (e: ...) { }` |
| `try?` for optional result | No equivalent (use try-catch) |
| `try!` for forced try | No equivalent (just don't catch) |
| `catch let error as Type` | `catch (e: Type)` |

## Finally Block

Always executes, regardless of exception:

```kotlin
fun processFile(path: String) {
    val file = openFile(path)
    try {
        processContent(file)
    } finally {
        file.close()  // Always runs
    }
}
```

## Try-Catch-Finally Expression

```kotlin
val result = try {
    compute()
} catch (e: Exception) {
    handleError(e)
    defaultValue
} finally {
    cleanup()
}
// Note: finally block value is NOT returned
```

## use Function (Try-with-Resources)

For resources that need closing:

```kotlin
import java.io.File

File("data.txt").bufferedReader().use { reader ->
    println(reader.readText())
}  // Automatically closed
```

Equivalent to Java's try-with-resources.

## Rethrowing Exceptions

```kotlin
fun process(data: String) {
    try {
        doSomethingRisky(data)
    } catch (e: Exception) {
        log("Error processing: ${e.message}")
        throw e  // Rethrow
    }
}
```

## Wrapping Exceptions

```kotlin
fun loadConfig(path: String): Config {
    return try {
        parseConfigFile(path)
    } catch (e: IOException) {
        throw ConfigException("Failed to load config", e)
    }
}
```

## Common Patterns

### Safe Parsing

```kotlin
fun String.toIntOrDefault(default: Int = 0): Int {
    return try {
        this.toInt()
    } catch (e: NumberFormatException) {
        default
    }
}
```

### Logging and Rethrowing

```kotlin
fun riskyOperation() {
    try {
        doWork()
    } catch (e: Exception) {
        logger.error("Operation failed", e)
        throw e
    }
}
```

### Ignoring Exceptions (Use Sparingly)

```kotlin
fun safeClose(closeable: Closeable?) {
    try {
        closeable?.close()
    } catch (e: Exception) {
        // Intentionally ignored
    }
}
```

## Try It Yourself

1. Parse user input safely with try-catch
2. Use `finally` to ensure cleanup
3. Use `use` to auto-close a resource
4. Create a safe wrapper function

## Key Takeaways

1. `try` is an expression - returns a value
2. Multiple catch blocks for different exceptions
3. Order: specific exceptions before general
4. `finally` always runs
5. `use` for automatic resource management
6. Can rethrow or wrap exceptions
