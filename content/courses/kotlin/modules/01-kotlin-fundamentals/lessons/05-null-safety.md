---
title: Null Safety
order: 5
estimatedMinutes: 20
---

# Null Safety

Null safety is one of Kotlin's most important features. It eliminates the dreaded NullPointerException by making nullability explicit in the type system.

## The Problem with Null

In many languages, any reference can be null, leading to crashes:

```java
// Java example of the problem
String name = null;
int length = name.length();  // NullPointerException at runtime!
```

Kotlin prevents this at compile time.

## Nullable vs Non-Nullable Types

By default, types cannot hold null:

```kotlin
var name: String = "Kotlin"
name = null  // Error: Null cannot be a value of a non-null type String
```

Add `?` to make a type nullable:

```kotlin
var name: String? = "Kotlin"
name = null  // This is fine
```

## Comparing to Swift

The concepts are nearly identical:

| Concept | Swift | Kotlin |
|---------|-------|--------|
| Non-optional | `var name: String` | `var name: String` |
| Optional | `var name: String?` | `var name: String?` |
| Nil/null | `nil` | `null` |

## Safe Call Operator (?.)

Access properties or methods safely:

```kotlin
val name: String? = null
println(name?.length)  // Prints: null (no crash!)

val name2: String? = "Kotlin"
println(name2?.length)  // Prints: 6
```

Chain safe calls:

```kotlin
val city: String? = user?.address?.city
```

## Elvis Operator (?:)

Provide a default when null:

```kotlin
val name: String? = null
val displayName = name ?: "Unknown"
println(displayName)  // Prints: Unknown
```

### Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `name ?? "Unknown"` | `name ?: "Unknown"` |

Same concept, slightly different syntax.

## Safe Calls + Elvis

Combine them for powerful null handling:

```kotlin
val length = name?.length ?: 0
```

This means: "Get the length if name isn't null, otherwise use 0."

## Not-Null Assertion (!!)

Force unwrap a nullable (use sparingly!):

```kotlin
val name: String? = "Kotlin"
val length = name!!.length  // 6
```

**Warning**: This throws `NullPointerException` if the value is null:

```kotlin
val name: String? = null
val length = name!!.length  // Throws NullPointerException!
```

### When to Use !!

Almost never. If you find yourself using `!!`, consider:
- Can you use `?.` and `?:` instead?
- Can you redesign to avoid nullability?
- Is there a bug in your logic?

## Let for Null Checks

Execute code only if not null:

```kotlin
val name: String? = "Kotlin"

name?.let {
    println("Name is $it")
    println("Length is ${it.length}")
}
```

### Comparing to Swift

| Swift | Kotlin |
|-------|--------|
| `if let name = name { ... }` | `name?.let { ... }` |
| `guard let name = name else { return }` | `name ?: return` |

## Smart Casts with Null Checks

After checking for null, Kotlin knows the value is non-null:

```kotlin
val name: String? = "Kotlin"

if (name != null) {
    // Smart cast: name is String here (not String?)
    println(name.length)  // No ?. needed
}
```

## Late Initialization

When you can't initialize immediately but know it won't be null:

```kotlin
class MyClass {
    lateinit var name: String

    fun setup() {
        name = "Initialized"
    }

    fun printName() {
        if (::name.isInitialized) {
            println(name)
        }
    }
}
```

## Platform Types

When calling Java code, Kotlin doesn't know if values can be null. These are "platform types" shown as `Type!`:

```kotlin
// Java method: String getName()
val name = javaObject.getName()  // Type is String!
// You decide how to handle it
val safeName: String = name ?: "Unknown"
```

## Common Patterns

### Pattern 1: Default Value

```kotlin
fun greet(name: String?) {
    val displayName = name ?: "Guest"
    println("Hello, $displayName!")
}
```

### Pattern 2: Early Return

```kotlin
fun process(data: String?): Int {
    val text = data ?: return 0
    return text.length
}
```

### Pattern 3: Throw if Null

```kotlin
fun requireData(data: String?): String {
    return data ?: throw IllegalArgumentException("Data required")
}

// Or use the built-in function:
fun requireData2(data: String?): String {
    return requireNotNull(data) { "Data required" }
}
```

## Try It Yourself

1. Create a nullable String and try to access its length directly (see the error)
2. Use safe call `?.` to access the length
3. Use Elvis `?:` to provide a default value
4. Use `let` to execute code only if the value exists
5. Write an if-check and see the smart cast in action

## Key Takeaways

1. `Type` = non-nullable, `Type?` = nullable
2. `?.` = safe call (returns null if null)
3. `?:` = Elvis operator (default if null)
4. `!!` = not-null assertion (avoid when possible)
5. `?.let { }` = execute code if not null
6. Smart casts work after null checks
7. Null safety is checked at compile time, not runtime
