---
title: Classes Basics
order: 1
estimatedMinutes: 15
---

# Classes Basics

Classes are blueprints for creating objects. Kotlin makes class definitions concise and powerful.

## Basic Class

```kotlin
class Person {
    var name: String = ""
    var age: Int = 0
}

fun main() {
    val person = Person()
    person.name = "Alice"
    person.age = 25
    println("${person.name} is ${person.age}")
}
```

## Primary Constructor

Define properties directly in the class header:

```kotlin
class Person(var name: String, var age: Int)

fun main() {
    val person = Person("Alice", 25)
    println("${person.name} is ${person.age}")
}
```

## val vs var in Constructors

```kotlin
class Person(
    val name: String,  // Read-only property
    var age: Int       // Mutable property
)

fun main() {
    val person = Person("Alice", 25)
    // person.name = "Bob"  // Error: val cannot be reassigned
    person.age = 26  // OK
}
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `class Person { }` | `class Person { }` |
| `var name: String` | `var name: String` |
| `init(name: String)` | Primary constructor |
| `let person = Person()` | `val person = Person()` |

## Init Blocks

Run code during initialization:

```kotlin
class Person(val name: String, var age: Int) {
    init {
        println("Creating person: $name")
        require(age >= 0) { "Age must be positive" }
    }
}
```

## Multiple Init Blocks

They run in order:

```kotlin
class Person(val name: String) {
    init {
        println("First init block")
    }

    val nameLength = name.length

    init {
        println("Second init block, length: $nameLength")
    }
}
```

## Secondary Constructors

Additional constructors with `constructor`:

```kotlin
class Person(val name: String, var age: Int) {
    // Secondary constructor
    constructor(name: String) : this(name, 0) {
        println("Created with default age")
    }
}

fun main() {
    val p1 = Person("Alice", 25)
    val p2 = Person("Bob")  // Uses secondary constructor
}
```

## Default Parameter Values

Often better than secondary constructors:

```kotlin
class Person(
    val name: String,
    var age: Int = 0,
    val email: String = ""
)

fun main() {
    val p1 = Person("Alice")
    val p2 = Person("Bob", 30)
    val p3 = Person("Charlie", email = "charlie@example.com")
}
```

## Methods

```kotlin
class Person(val name: String, var age: Int) {
    fun introduce() {
        println("Hi, I'm $name and I'm $age years old")
    }

    fun haveBirthday() {
        age++
        println("Happy birthday! Now I'm $age")
    }
}
```

## Visibility Modifiers

```kotlin
class Person(val name: String) {
    public var publicField = "visible everywhere"    // Default
    internal var internalField = "visible in module"
    protected var protectedField = "visible in subclasses"
    private var privateField = "visible only in class"

    private fun privateMethod() { }
}
```

## The this Keyword

```kotlin
class Person(val name: String) {
    fun printInfo() {
        println("Name: ${this.name}")  // 'this' is optional
    }

    fun createCopy(): Person {
        return Person(this.name)
    }
}
```

## Try It Yourself

1. Create a `Car` class with brand, model, and year
2. Add a method to display car info
3. Use default parameter values
4. Add an init block with validation

## Key Takeaways

1. Primary constructor in class header
2. `val` = read-only, `var` = mutable properties
3. `init` blocks run during construction
4. Secondary constructors call primary with `this()`
5. Default values often replace secondary constructors
6. Visibility: public (default), private, protected, internal
