---
title: User System
order: 2
difficulty: medium
estimatedMinutes: 25
---

# Exercise: User System

Build a user management system using data classes and interfaces.

## Requirements

1. Create a `User` data class with id, name, email
2. Create different user types using inheritance
3. Implement a `Permissioned` interface for role-based access
4. Build a simple user repository

## Starter Code

```kotlin
// Define your classes here

fun main() {
    val repository = UserRepository()

    val admin = Admin(1, "Alice", "alice@example.com")
    val moderator = Moderator(2, "Bob", "bob@example.com", listOf("posts", "comments"))
    val guest = Guest(3, "Charlie", "charlie@example.com")

    repository.add(admin)
    repository.add(moderator)
    repository.add(guest)

    println("All users:")
    repository.findAll().forEach { println("  ${it.name} - ${it.role}") }

    println("\nPermissions check:")
    println("  Alice can delete: ${admin.hasPermission("delete")}")
    println("  Bob can moderate posts: ${moderator.hasPermission("posts")}")
    println("  Charlie can delete: ${guest.hasPermission("delete")}")

    println("\nCopy with changes:")
    val updatedAdmin = admin.copy(email = "alice.admin@example.com")
    println("  Updated: $updatedAdmin")
}
```

## Expected Output

```
All users:
  Alice - Admin
  Bob - Moderator
  Charlie - Guest

Permissions check:
  Alice can delete: true
  Bob can moderate posts: true
  Charlie can delete: false

Copy with changes:
  Updated: Admin(id=1, name=Alice, email=alice.admin@example.com)
```

## Hints

<details>
<summary>Hint 1: Sealed class for user types</summary>

```kotlin
sealed class User(
    open val id: Int,
    open val name: String,
    open val email: String
) {
    abstract val role: String
}
```
</details>

<details>
<summary>Hint 2: Interface for permissions</summary>

```kotlin
interface Permissioned {
    fun hasPermission(permission: String): Boolean
}
```
</details>

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
interface Permissioned {
    fun hasPermission(permission: String): Boolean
}

sealed class User(
    open val id: Int,
    open val name: String,
    open val email: String
) : Permissioned {
    abstract val role: String
}

data class Admin(
    override val id: Int,
    override val name: String,
    override val email: String
) : User(id, name, email) {
    override val role = "Admin"

    override fun hasPermission(permission: String) = true  // Admin has all permissions
}

data class Moderator(
    override val id: Int,
    override val name: String,
    override val email: String,
    val moderatedSections: List<String>
) : User(id, name, email) {
    override val role = "Moderator"

    override fun hasPermission(permission: String) =
        permission in moderatedSections
}

data class Guest(
    override val id: Int,
    override val name: String,
    override val email: String
) : User(id, name, email) {
    override val role = "Guest"

    override fun hasPermission(permission: String) = false
}

class UserRepository {
    private val users = mutableListOf<User>()

    fun add(user: User) {
        users.add(user)
    }

    fun findAll(): List<User> = users.toList()

    fun findById(id: Int): User? = users.find { it.id == id }

    fun findByRole(role: String): List<User> =
        users.filter { it.role == role }
}

fun main() {
    val repository = UserRepository()

    val admin = Admin(1, "Alice", "alice@example.com")
    val moderator = Moderator(2, "Bob", "bob@example.com", listOf("posts", "comments"))
    val guest = Guest(3, "Charlie", "charlie@example.com")

    repository.add(admin)
    repository.add(moderator)
    repository.add(guest)

    println("All users:")
    repository.findAll().forEach { println("  ${it.name} - ${it.role}") }

    println("\nPermissions check:")
    println("  Alice can delete: ${admin.hasPermission("delete")}")
    println("  Bob can moderate posts: ${moderator.hasPermission("posts")}")
    println("  Charlie can delete: ${guest.hasPermission("delete")}")

    println("\nCopy with changes:")
    val updatedAdmin = admin.copy(email = "alice.admin@example.com")
    println("  Updated: $updatedAdmin")
}
```
</details>

## Bonus Challenge

1. Add a `Member` user type with limited permissions
2. Implement user validation (valid email format)
3. Add timestamps (createdAt, lastLoginAt)
