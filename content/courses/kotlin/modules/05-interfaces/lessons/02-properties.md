---
title: Properties
order: 2
estimatedMinutes: 12
---

# Properties

Properties in Kotlin are more powerful than fields. They have automatic getters/setters and can include custom logic.

## Basic Properties

```kotlin
class Person {
    var name: String = ""  // Has getter and setter
    val id: Int = 0        // Has only getter
}
```

## Custom Getters

```kotlin
class Rectangle(val width: Int, val height: Int) {
    val area: Int
        get() = width * height

    val isSquare: Boolean
        get() = width == height
}

fun main() {
    val rect = Rectangle(4, 5)
    println(rect.area)      // 20 - computed each time
    println(rect.isSquare)  // false
}
```

## Custom Setters

```kotlin
class User(name: String) {
    var name: String = name
        set(value) {
            field = value.trim().lowercase()
        }
}

fun main() {
    val user = User("  ALICE  ")
    println(user.name)  // alice
}
```

## The field Identifier

`field` refers to the backing field in getters/setters:

```kotlin
class Counter {
    var count: Int = 0
        set(value) {
            if (value >= 0) {
                field = value  // 'field' is the backing field
            }
        }
}
```

Without `field`, using `count = value` would cause infinite recursion.

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `var name: String { get { } set { } }` | `var name: String` + custom get/set |
| `willSet`, `didSet` | No direct equivalent |
| Computed property | Property with getter |
| Stored property | Property with backing field |

## Backing Properties

For when you need more control:

```kotlin
class User {
    private var _emails = mutableListOf<String>()

    val emails: List<String>
        get() = _emails  // Expose as read-only

    fun addEmail(email: String) {
        _emails.add(email)
    }
}
```

## Late-Initialized Properties

For properties initialized after construction:

```kotlin
class Service {
    lateinit var config: Config

    fun initialize(config: Config) {
        this.config = config
    }

    fun doWork() {
        if (::config.isInitialized) {
            // Use config
        }
    }
}
```

## Lazy Properties

Computed once on first access:

```kotlin
class DataLoader {
    val data: List<String> by lazy {
        println("Loading data...")
        loadFromDatabase()  // Expensive operation
    }
}

fun main() {
    val loader = DataLoader()
    println("Loader created")
    println(loader.data)  // "Loading data..." printed here
    println(loader.data)  // Uses cached value
}
```

## Compile-Time Constants

```kotlin
const val MAX_SIZE = 100  // Compile-time constant

class Config {
    companion object {
        const val VERSION = "1.0.0"
    }
}
```

## Delegated Properties

Use `by` to delegate property behavior:

```kotlin
import kotlin.properties.Delegates

class User {
    // Observable - runs callback on change
    var name: String by Delegates.observable("initial") { _, old, new ->
        println("Changed from $old to $new")
    }

    // Vetoable - can reject changes
    var age: Int by Delegates.vetoable(0) { _, _, new ->
        new >= 0  // Only accept non-negative
    }
}
```

## Extension Properties

Add properties to existing classes:

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println("Kotlin".lastChar)  // n
}
```

## Try It Yourself

1. Create a class with a computed property
2. Add a custom setter with validation
3. Use `lazy` for an expensive computation
4. Create an extension property

## Key Takeaways

1. Properties have automatic getters/setters
2. Custom getters: `get() = ...`
3. Custom setters: `set(value) { field = ... }`
4. `field` = backing field identifier
5. `lateinit` for late initialization
6. `by lazy` for lazy computation
7. `const val` for compile-time constants
8. `by Delegates` for observable/vetoable
