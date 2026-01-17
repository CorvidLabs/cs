---
title: Data Processing
order: 3
difficulty: medium
estimatedMinutes: 25
---

# Exercise: Data Processing

Process a dataset of products using collection operations.

## Requirements

Given a list of products:
1. Find all products under $50
2. Group products by category
3. Calculate average price per category
4. Find the most expensive product in each category
5. Get total inventory value

## Starter Code

```kotlin
data class Product(
    val id: Int,
    val name: String,
    val category: String,
    val price: Double,
    val stock: Int
)

fun main() {
    val products = listOf(
        Product(1, "Laptop", "Electronics", 999.99, 10),
        Product(2, "Mouse", "Electronics", 29.99, 50),
        Product(3, "Keyboard", "Electronics", 79.99, 30),
        Product(4, "Desk", "Furniture", 199.99, 15),
        Product(5, "Chair", "Furniture", 149.99, 20),
        Product(6, "Notebook", "Office", 4.99, 100),
        Product(7, "Pen", "Office", 1.99, 200),
        Product(8, "Monitor", "Electronics", 299.99, 25)
    )

    // 1. Products under $50

    // 2. Group by category

    // 3. Average price per category

    // 4. Most expensive per category

    // 5. Total inventory value (price * stock for all)
}
```

## Expected Output

```
Products under $50: [Mouse, Notebook, Pen]

By category:
  Electronics: [Laptop, Mouse, Keyboard, Monitor]
  Furniture: [Desk, Chair]
  Office: [Notebook, Pen]

Average price per category:
  Electronics: $352.49
  Furniture: $174.99
  Office: $3.49

Most expensive per category:
  Electronics: Laptop ($999.99)
  Furniture: Desk ($199.99)
  Office: Notebook ($4.99)

Total inventory value: $26,146.05
```

## Hints

<details>
<summary>Hint 1: Filter cheap products</summary>

```kotlin
val cheap = products
    .filter { it.price < 50 }
    .map { it.name }
```
</details>

<details>
<summary>Hint 2: Average per category</summary>

```kotlin
val avgByCategory = products
    .groupBy { it.category }
    .mapValues { (_, items) -> items.map { it.price }.average() }
```
</details>

<details>
<summary>Hint 3: Most expensive per category</summary>

```kotlin
val maxByCategory = products
    .groupBy { it.category }
    .mapValues { (_, items) -> items.maxByOrNull { it.price } }
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
data class Product(
    val id: Int,
    val name: String,
    val category: String,
    val price: Double,
    val stock: Int
)

fun main() {
    val products = listOf(
        Product(1, "Laptop", "Electronics", 999.99, 10),
        Product(2, "Mouse", "Electronics", 29.99, 50),
        Product(3, "Keyboard", "Electronics", 79.99, 30),
        Product(4, "Desk", "Furniture", 199.99, 15),
        Product(5, "Chair", "Furniture", 149.99, 20),
        Product(6, "Notebook", "Office", 4.99, 100),
        Product(7, "Pen", "Office", 1.99, 200),
        Product(8, "Monitor", "Electronics", 299.99, 25)
    )

    // 1. Products under $50
    val cheap = products.filter { it.price < 50 }.map { it.name }
    println("Products under \$50: $cheap")

    // 2. Group by category
    val byCategory = products.groupBy { it.category }
    println("\nBy category:")
    byCategory.forEach { (cat, items) ->
        println("  $cat: ${items.map { it.name }}")
    }

    // 3. Average price per category
    val avgByCategory = products
        .groupBy { it.category }
        .mapValues { (_, items) -> items.map { it.price }.average() }

    println("\nAverage price per category:")
    avgByCategory.forEach { (cat, avg) ->
        println("  $cat: \$${String.format("%.2f", avg)}")
    }

    // 4. Most expensive per category
    val maxByCategory = products
        .groupBy { it.category }
        .mapValues { (_, items) -> items.maxByOrNull { it.price }!! }

    println("\nMost expensive per category:")
    maxByCategory.forEach { (cat, product) ->
        println("  $cat: ${product.name} (\$${product.price})")
    }

    // 5. Total inventory value
    val totalValue = products.sumOf { it.price * it.stock }
    println("\nTotal inventory value: \$${String.format("%,.2f", totalValue)}")
}
```
</details>

## Bonus Challenge

1. Find products with low stock (< 20)
2. Calculate total value per category
3. Find categories with more than 2 products
4. Sort products by value (price * stock) descending
