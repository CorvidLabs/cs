---
title: Data Classes
order: 5
estimatedMinutes: 12
---

# Data Classes

Data classes are designed to hold data. Kotlin generates useful methods automatically.

## Basic Data Class

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val user = User("Alice", 25)
    println(user)  // User(name=Alice, age=25)
}
```

## Generated Methods

Data classes automatically get:

1. `toString()` - readable representation
2. `equals()` / `hashCode()` - structural equality
3. `copy()` - create modified copies
4. `componentN()` - destructuring

```kotlin
data class Point(val x: Int, val y: Int)

fun main() {
    val p1 = Point(1, 2)
    val p2 = Point(1, 2)

    println(p1.toString())      // Point(x=1, y=2)
    println(p1 == p2)           // true (structural equality)
    println(p1.hashCode())      // Same as p2.hashCode()

    val p3 = p1.copy(x = 10)    // Point(x=10, y=2)
    val (x, y) = p1             // Destructuring
}
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `struct` (value type) | `data class` |
| Memberwise init | Primary constructor |
| `Equatable` protocol | Auto-generated `equals` |
| Manual `copy` | Auto-generated `copy` |

Key difference: Kotlin data classes are still reference types.

## The copy() Function

Create modified copies:

```kotlin
data class User(
    val name: String,
    val age: Int,
    val email: String = ""
)

fun main() {
    val user = User("Alice", 25, "alice@example.com")

    val older = user.copy(age = 26)
    val renamed = user.copy(name = "Alicia")
    val updated = user.copy(name = "Alicia", age = 26)

    println(older)   // User(name=Alice, age=26, email=alice@example.com)
}
```

## Destructuring

```kotlin
data class Person(val name: String, val age: Int, val city: String)

fun main() {
    val person = Person("Alice", 25, "NYC")

    val (name, age, city) = person
    println("$name, $age, from $city")

    // Skip with underscore
    val (n, _, c) = person
}
```

## Requirements for Data Classes

1. Primary constructor must have at least one parameter
2. Parameters must be `val` or `var`
3. Cannot be abstract, open, sealed, or inner

```kotlin
// Valid
data class Valid(val x: Int)

// Invalid
// data class Invalid  // No parameters
// abstract data class Abstract(val x: Int)  // Can't be abstract
```

## Properties Outside Constructor

Only constructor properties are included in generated methods:

```kotlin
data class User(val name: String) {
    var loginCount: Int = 0  // NOT in equals/hashCode/copy
}

fun main() {
    val u1 = User("Alice")
    u1.loginCount = 5

    val u2 = User("Alice")
    u2.loginCount = 10

    println(u1 == u2)  // true! loginCount not compared
}
```

## Data Class with Body

```kotlin
data class User(val name: String, val email: String) {
    val isValidEmail: Boolean
        get() = email.contains("@")

    fun greet() = "Hello, $name!"
}
```

## Inheritance with Data Classes

Data classes can implement interfaces:

```kotlin
interface Printable {
    fun print()
}

data class Document(val title: String, val content: String) : Printable {
    override fun print() {
        println("=== $title ===")
        println(content)
    }
}
```

## When to Use Data Classes

Good for:
- DTOs (Data Transfer Objects)
- API responses/requests
- Domain models
- Any class primarily holding data

Not ideal for:
- Classes with complex behavior
- Classes that need inheritance
- Mutable state with side effects

## Common Patterns

### Immutable Updates

```kotlin
data class State(val count: Int, val name: String)

fun main() {
    var state = State(0, "initial")

    state = state.copy(count = state.count + 1)
    state = state.copy(name = "updated")
}
```

### With Default Values

```kotlin
data class Config(
    val host: String = "localhost",
    val port: Int = 8080,
    val debug: Boolean = false
)

val default = Config()
val production = Config(host = "api.example.com", port = 443)
```

## Try It Yourself

1. Create a data class for a `Book` (title, author, year)
2. Use `copy()` to create variations
3. Destructure the data class
4. Compare two instances with same values

## Key Takeaways

1. `data class` generates useful methods
2. `toString()`, `equals()`, `hashCode()`, `copy()`, `componentN()`
3. Only primary constructor properties in generated methods
4. Use `copy()` for immutable updates
5. Supports destructuring
6. Can implement interfaces but not extend classes
7. Great for DTOs and domain models
