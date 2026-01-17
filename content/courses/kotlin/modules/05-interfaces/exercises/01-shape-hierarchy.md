---
title: Shape Hierarchy
order: 1
difficulty: medium
estimatedMinutes: 20
---

# Exercise: Shape Hierarchy

Create a class hierarchy for geometric shapes.

## Requirements

1. Create an interface `Shape` with `area` and `perimeter` properties
2. Implement `Circle`, `Rectangle`, and `Triangle`
3. Add a `describe()` method with default implementation
4. Create a function to find the largest shape

## Starter Code

```kotlin
import kotlin.math.sqrt
import kotlin.math.PI

// Define your interface and classes here

fun main() {
    val shapes = listOf(
        Circle(5.0),
        Rectangle(4.0, 6.0),
        Triangle(3.0, 4.0, 5.0)
    )

    for (shape in shapes) {
        println(shape.describe())
        println("  Area: ${shape.area}")
        println("  Perimeter: ${shape.perimeter}")
        println()
    }

    val largest = findLargest(shapes)
    println("Largest: ${largest.describe()}")
}

fun findLargest(shapes: List<Shape>): Shape {
    // Your code here
}
```

## Expected Output

```
Circle with radius 5.0
  Area: 78.54
  Perimeter: 31.42

Rectangle 4.0 x 6.0
  Area: 24.0
  Perimeter: 20.0

Triangle with sides 3.0, 4.0, 5.0
  Area: 6.0
  Perimeter: 12.0

Largest: Circle with radius 5.0
```

## Hints

<details>
<summary>Hint 1: Interface definition</summary>

```kotlin
interface Shape {
    val area: Double
    val perimeter: Double
    fun describe(): String
}
```
</details>

<details>
<summary>Hint 2: Triangle area (Heron's formula)</summary>

```kotlin
val s = perimeter / 2
val area = sqrt(s * (s - a) * (s - b) * (s - c))
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
import kotlin.math.sqrt
import kotlin.math.PI

interface Shape {
    val area: Double
    val perimeter: Double
    fun describe(): String
}

class Circle(val radius: Double) : Shape {
    override val area: Double
        get() = PI * radius * radius

    override val perimeter: Double
        get() = 2 * PI * radius

    override fun describe() = "Circle with radius $radius"
}

class Rectangle(val width: Double, val height: Double) : Shape {
    override val area: Double
        get() = width * height

    override val perimeter: Double
        get() = 2 * (width + height)

    override fun describe() = "Rectangle $width x $height"
}

class Triangle(val a: Double, val b: Double, val c: Double) : Shape {
    override val perimeter: Double
        get() = a + b + c

    override val area: Double
        get() {
            val s = perimeter / 2
            return sqrt(s * (s - a) * (s - b) * (s - c))
        }

    override fun describe() = "Triangle with sides $a, $b, $c"
}

fun findLargest(shapes: List<Shape>): Shape {
    return shapes.maxByOrNull { it.area }!!
}

fun main() {
    val shapes = listOf(
        Circle(5.0),
        Rectangle(4.0, 6.0),
        Triangle(3.0, 4.0, 5.0)
    )

    for (shape in shapes) {
        println(shape.describe())
        println("  Area: ${"%.2f".format(shape.area)}")
        println("  Perimeter: ${"%.2f".format(shape.perimeter)}")
        println()
    }

    val largest = findLargest(shapes)
    println("Largest: ${largest.describe()}")
}
```
</details>

## Bonus Challenge

1. Add a `Square` class that extends `Rectangle`
2. Add a `Drawable` interface with a `draw()` method
3. Make shapes comparable by area
