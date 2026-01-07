---
title: Inheritance
order: 4
estimatedMinutes: 15
---

# Inheritance

Kotlin classes are final by default. Use `open` to allow inheritance.

## Open Classes

```kotlin
open class Animal(val name: String) {
    open fun makeSound() {
        println("Some sound")
    }
}

class Dog(name: String) : Animal(name) {
    override fun makeSound() {
        println("Woof!")
    }
}
```

## Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| Classes open by default | Classes final by default |
| `final` to prevent override | Default behavior |
| `class Dog: Animal` | `class Dog : Animal()` |
| `override func` | `override fun` |

## The open Keyword

Must explicitly allow inheritance:

```kotlin
open class Parent {
    open fun canOverride() { }    // Can be overridden
    fun cannotOverride() { }       // Cannot be overridden
}

class Child : Parent() {
    override fun canOverride() { }
    // override fun cannotOverride() { }  // Error!
}
```

## Preventing Further Override

Use `final` on overridden members:

```kotlin
open class Parent {
    open fun method() { }
}

open class Child : Parent() {
    final override fun method() { }  // No further override
}

class GrandChild : Child() {
    // override fun method() { }  // Error: final in Child
}
```

## Abstract Classes

Cannot be instantiated, may have abstract members:

```kotlin
abstract class Shape {
    abstract val area: Double
    abstract fun draw()

    fun describe() {
        println("This shape has area $area")
    }
}

class Circle(val radius: Double) : Shape() {
    override val area: Double
        get() = Math.PI * radius * radius

    override fun draw() {
        println("Drawing circle with radius $radius")
    }
}
```

## Calling Super

```kotlin
open class Parent {
    open fun greet() {
        println("Hello from Parent")
    }
}

class Child : Parent() {
    override fun greet() {
        super.greet()  // Call parent's implementation
        println("Hello from Child")
    }
}
```

## Constructor Chaining

```kotlin
open class Person(val name: String) {
    init { println("Person: $name") }
}

class Employee(
    name: String,
    val company: String
) : Person(name) {
    init { println("Employee at $company") }
}

// Output when creating Employee("Alice", "Acme"):
// Person: Alice
// Employee at Acme
```

## Secondary Constructors in Inheritance

```kotlin
open class Parent(val value: Int)

class Child : Parent {
    constructor(value: Int) : super(value)
    constructor() : super(0)
}
```

## Protected Members

Visible in subclasses:

```kotlin
open class Parent {
    protected val secret = "hidden"
    protected fun helper() { }
}

class Child : Parent() {
    fun reveal() {
        println(secret)  // Accessible
        helper()         // Accessible
    }
}

fun main() {
    val child = Child()
    // println(child.secret)  // Error: protected
}
```

## Sealed Classes

Restricted class hierarchies:

```kotlin
sealed class Result {
    data class Success(val data: String) : Result()
    data class Error(val message: String) : Result()
    object Loading : Result()
}

fun handle(result: Result) = when (result) {
    is Result.Success -> println(result.data)
    is Result.Error -> println("Error: ${result.message}")
    Result.Loading -> println("Loading...")
    // No else needed - all cases covered
}
```

## Composition over Inheritance

Often better to compose than inherit:

```kotlin
// Instead of inheritance
class Engine {
    fun start() = println("Engine starting")
}

class Car(private val engine: Engine) {
    fun start() = engine.start()
}
```

## Try It Yourself

1. Create an `open` class and extend it
2. Override a method and call `super`
3. Create an abstract class with abstract and concrete methods
4. Create a sealed class hierarchy for a state machine

## Key Takeaways

1. Classes are `final` by default - use `open` to allow inheritance
2. Methods are `final` by default - use `open` to allow override
3. `override` keyword required for overriding
4. `abstract` for classes/members that must be implemented
5. `super` calls parent implementation
6. `protected` for subclass-only visibility
7. `sealed` for restricted hierarchies
8. Consider composition over inheritance
