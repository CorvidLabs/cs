---
title: Plugin Architecture
order: 3
difficulty: hard
estimatedMinutes: 30
---

# Exercise: Plugin Architecture

Design a plugin system using interfaces.

## Requirements

1. Create a `Plugin` interface with lifecycle methods
2. Create a `PluginManager` to load and manage plugins
3. Implement sample plugins (Logger, Analytics, Cache)
4. Support plugin dependencies and priorities

## Starter Code

```kotlin
// Define your interface and classes here

fun main() {
    val manager = PluginManager()

    manager.register(LoggerPlugin())
    manager.register(AnalyticsPlugin())
    manager.register(CachePlugin())

    println("=== Starting Application ===")
    manager.startAll()

    println("\n=== Application Running ===")
    manager.executeAll("User logged in")

    println("\n=== Stopping Application ===")
    manager.stopAll()

    println("\n=== Plugin Status ===")
    manager.status()
}
```

## Expected Output

```
=== Starting Application ===
[Logger] Initializing...
[Analytics] Connecting to server...
[Cache] Warming up cache...

=== Application Running ===
[Logger] Event: User logged in
[Analytics] Tracking: User logged in
[Cache] Caching: User logged in

=== Stopping Application ===
[Cache] Flushing cache...
[Analytics] Disconnecting...
[Logger] Closing log files...

=== Plugin Status ===
  LoggerPlugin: STOPPED (priority: 1)
  AnalyticsPlugin: STOPPED (priority: 2)
  CachePlugin: STOPPED (priority: 3)
```

## Hints

<details>
<summary>Hint 1: Plugin interface</summary>

```kotlin
interface Plugin {
    val name: String
    val priority: Int
    fun start()
    fun stop()
    fun execute(event: String)
}
```
</details>

<details>
<summary>Hint 2: Plugin state</summary>

```kotlin
enum class PluginState { STOPPED, RUNNING }

abstract class BasePlugin : Plugin {
    var state: PluginState = PluginState.STOPPED
        protected set
}
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
enum class PluginState { STOPPED, RUNNING }

interface Plugin {
    val name: String
    val priority: Int
    val state: PluginState
    fun start()
    fun stop()
    fun execute(event: String)
}

abstract class BasePlugin(
    override val name: String,
    override val priority: Int = 5
) : Plugin {
    override var state: PluginState = PluginState.STOPPED
        protected set

    override fun start() {
        state = PluginState.RUNNING
    }

    override fun stop() {
        state = PluginState.STOPPED
    }
}

class LoggerPlugin : BasePlugin("LoggerPlugin", priority = 1) {
    override fun start() {
        println("[Logger] Initializing...")
        super.start()
    }

    override fun stop() {
        println("[Logger] Closing log files...")
        super.stop()
    }

    override fun execute(event: String) {
        println("[Logger] Event: $event")
    }
}

class AnalyticsPlugin : BasePlugin("AnalyticsPlugin", priority = 2) {
    override fun start() {
        println("[Analytics] Connecting to server...")
        super.start()
    }

    override fun stop() {
        println("[Analytics] Disconnecting...")
        super.stop()
    }

    override fun execute(event: String) {
        println("[Analytics] Tracking: $event")
    }
}

class CachePlugin : BasePlugin("CachePlugin", priority = 3) {
    override fun start() {
        println("[Cache] Warming up cache...")
        super.start()
    }

    override fun stop() {
        println("[Cache] Flushing cache...")
        super.stop()
    }

    override fun execute(event: String) {
        println("[Cache] Caching: $event")
    }
}

class PluginManager {
    private val plugins = mutableListOf<Plugin>()

    fun register(plugin: Plugin) {
        plugins.add(plugin)
        plugins.sortBy { it.priority }
    }

    fun startAll() {
        plugins.forEach { it.start() }
    }

    fun stopAll() {
        plugins.reversed().forEach { it.stop() }
    }

    fun executeAll(event: String) {
        plugins.filter { it.state == PluginState.RUNNING }
            .forEach { it.execute(event) }
    }

    fun status() {
        plugins.forEach {
            println("  ${it.name}: ${it.state} (priority: ${it.priority})")
        }
    }
}

fun main() {
    val manager = PluginManager()

    manager.register(LoggerPlugin())
    manager.register(AnalyticsPlugin())
    manager.register(CachePlugin())

    println("=== Starting Application ===")
    manager.startAll()

    println("\n=== Application Running ===")
    manager.executeAll("User logged in")

    println("\n=== Stopping Application ===")
    manager.stopAll()

    println("\n=== Plugin Status ===")
    manager.status()
}
```
</details>

## Bonus Challenge

1. Add plugin dependencies (e.g., Analytics depends on Logger)
2. Support async plugin initialization
3. Add configuration per plugin
4. Implement plugin enable/disable
