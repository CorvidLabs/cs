---
title: Interfaces
order: 3
estimatedMinutes: 15
---

# Interfaces

Interfaces define contracts that classes must implement. Unlike abstract classes, a class can implement multiple interfaces.

## Basic Interface

```kotlin
interface Drawable {
    fun draw()
}

class Circle : Drawable {
    override fun draw() {
        println("Drawing a circle")
    }
}
```

## Interface Properties

```kotlin
interface Named {
    val name: String  // Abstract property
}

class Person(override val name: String) : Named

class Animal : Named {
    override val name: String
        get() = "Generic Animal"
}
```

## Default Implementations

```kotlin
interface Greeter {
    val greeting: String
        get() = "Hello"  // Default implementation

    fun greet(name: String) {
        println("$greeting, $name!")
    }
}

class FriendlyGreeter : Greeter {
    override val greeting = "Hey there"
    // greet() inherited with default implementation
}
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `protocol` | `interface` |
| `protocol Drawable { func draw() }` | `interface Drawable { fun draw() }` |
| Extension for default impl | Default impl in interface |
| `class Foo: Protocol` | `class Foo : Interface` |

## Multiple Interfaces

```kotlin
interface Flyable {
    fun fly()
}

interface Swimmable {
    fun swim()
}

class Duck : Flyable, Swimmable {
    override fun fly() = println("Flying!")
    override fun swim() = println("Swimming!")
}
```

## Interface Inheritance

```kotlin
interface Animal {
    fun eat()
}

interface Pet : Animal {
    val name: String
    fun play()
}

class Dog(override val name: String) : Pet {
    override fun eat() = println("$name is eating")
    override fun play() = println("$name is playing")
}
```

## Resolving Conflicts

When interfaces have conflicting defaults:

```kotlin
interface A {
    fun greet() = println("Hello from A")
}

interface B {
    fun greet() = println("Hello from B")
}

class C : A, B {
    override fun greet() {
        super<A>.greet()  // Call A's implementation
        super<B>.greet()  // Call B's implementation
        println("Hello from C")
    }
}
```

## Functional Interfaces (SAM)

Single Abstract Method interfaces:

```kotlin
fun interface Processor {
    fun process(input: String): String
}

fun main() {
    // Can use lambda
    val upperProcessor = Processor { it.uppercase() }
    println(upperProcessor.process("hello"))  // HELLO
}
```

## Interface vs Abstract Class

| Interface | Abstract Class |
|-----------|----------------|
| No state (no backing fields) | Can have state |
| Multiple inheritance | Single inheritance |
| Can't have constructors | Can have constructors |
| Default implementations | Abstract and concrete methods |

## Type Checking

```kotlin
interface Printable {
    fun print()
}

fun process(item: Any) {
    if (item is Printable) {
        item.print()  // Smart cast
    }
}
```

## Common Patterns

### Strategy Pattern

```kotlin
interface SortStrategy {
    fun <T : Comparable<T>> sort(list: MutableList<T>)
}

class BubbleSort : SortStrategy {
    override fun <T : Comparable<T>> sort(list: MutableList<T>) {
        // Bubble sort implementation
    }
}

class Sorter(private val strategy: SortStrategy) {
    fun <T : Comparable<T>> sort(list: MutableList<T>) {
        strategy.sort(list)
    }
}
```

## Try It Yourself

1. Create an interface `Shape` with `area()` method
2. Implement it in `Rectangle` and `Circle` classes
3. Add a default method to the interface
4. Create a functional interface and use it with a lambda

## Key Takeaways

1. `interface` defines contracts
2. Classes implement with `: InterfaceName`
3. Use `override` for interface members
4. Interfaces can have default implementations
5. Multiple interfaces allowed
6. Use `super<Interface>` to resolve conflicts
7. `fun interface` for SAM interfaces
8. Interfaces can't have state (backing fields)
