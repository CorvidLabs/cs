---
title: If and Guard Statements
order: 1
estimatedMinutes: 15
---

# If and Guard Statements

Swift provides two primary conditional statements: `if` for standard conditional logic, and `guard` for early exits when conditions aren't met. Understanding when to use each is key to writing clean, readable Swift code.

## Basic If Statements

The `if` statement executes code when a condition is true:

```swift
let temperature = 72

if temperature > 80 {
    print("It's hot outside!")
}
```

## If-Else Statements

Use `else` to handle the false case:

```swift
let age = 18

if age >= 18 {
    print("You can vote.")
} else {
    print("You cannot vote yet.")
}
```

## If-Else If Chains

Chain multiple conditions with `else if`:

```swift
let score = 85

if score >= 90 {
    print("Grade: A")
} else if score >= 80 {
    print("Grade: B")
} else if score >= 70 {
    print("Grade: C")
} else if score >= 60 {
    print("Grade: D")
} else {
    print("Grade: F")
}
```

## Comparison Operators

Swift supports standard comparison operators:

| Operator | Meaning                  |
|----------|--------------------------|
| `==`     | Equal to                 |
| `!=`     | Not equal to             |
| `>`      | Greater than             |
| `<`      | Less than                |
| `>=`     | Greater than or equal to |
| `<=`     | Less than or equal to    |

```swift
let a = 5
let b = 10

if a == b {
    print("Equal")
} else if a < b {
    print("a is less than b")
} else {
    print("a is greater than b")
}
```

## Logical Operators

Combine conditions with logical operators:

| Operator | Meaning     | Description                           |
|----------|-------------|---------------------------------------|
| `&&`     | Logical AND | True if both conditions are true      |
| `||`     | Logical OR  | True if either condition is true      |
| `!`      | Logical NOT | Inverts the boolean value             |

```swift
let hasTicket = true
let hasID = true
let isBanned = false

if hasTicket && hasID && !isBanned {
    print("Welcome to the event!")
}

let isWeekend = true
let isHoliday = false

if isWeekend || isHoliday {
    print("No work today!")
}
```

## If with Optionals

The `if let` syntax safely unwraps optionals:

```swift
let possibleNumber: String? = "42"

if let actualNumber = Int(possibleNumber ?? "") {
    print("The number is \(actualNumber)")
} else {
    print("Not a valid number")
}
```

Multiple optionals can be unwrapped together:

```swift
let firstName: String? = "Ada"
let lastName: String? = "Lovelace"

if let first = firstName, let last = lastName {
    print("Name: \(first) \(last)")
} else {
    print("Missing name information")
}
```

## The Guard Statement

`guard` is like an inverted `if` - it requires the condition to be true to continue. If the condition is false, the `else` block must exit the current scope:

```swift
public func processAge(_ age: Int?) {
    guard let validAge = age else {
        print("Age is required")
        return
    }

    guard validAge >= 0 else {
        print("Age cannot be negative")
        return
    }

    guard validAge < 150 else {
        print("Age seems unrealistic")
        return
    }

    // At this point, validAge is guaranteed to be valid
    print("Processing age: \(validAge)")
}
```

## Guard vs If: When to Use Each

Use `guard` when you want to:
- Exit early if conditions aren't met
- Keep the "happy path" unindented
- Ensure variables remain in scope after unwrapping

Use `if` when you want to:
- Execute different code for true/false cases
- Handle conditions that aren't requirements for continuing

### Example: The Pyramid of Doom (Avoid This)

```swift
// Nested if statements create a "pyramid of doom"
public func validateUserBad(name: String?, email: String?, age: Int?) {
    if let name = name {
        if let email = email {
            if let age = age {
                if age >= 18 {
                    print("Valid user: \(name), \(email), \(age)")
                } else {
                    print("Must be 18 or older")
                }
            } else {
                print("Age required")
            }
        } else {
            print("Email required")
        }
    } else {
        print("Name required")
    }
}
```

### Example: Clean Guard Statements (Prefer This)

```swift
public func validateUserGood(name: String?, email: String?, age: Int?) {
    guard let name = name else {
        print("Name required")
        return
    }

    guard let email = email else {
        print("Email required")
        return
    }

    guard let age = age else {
        print("Age required")
        return
    }

    guard age >= 18 else {
        print("Must be 18 or older")
        return
    }

    // Happy path - all validations passed
    print("Valid user: \(name), \(email), \(age)")
}
```

## Guard with Multiple Conditions

Guard can check multiple conditions at once:

```swift
public func processOrder(quantity: Int?, price: Double?) {
    guard
        let quantity = quantity,
        let price = price,
        quantity > 0,
        price > 0
    else {
        print("Invalid order parameters")
        return
    }

    let total = Double(quantity) * price
    print("Order total: $\(total)")
}
```

## Ternary Conditional Operator

For simple conditions, use the ternary operator:

```swift
let age = 20
let status = age >= 18 ? "adult" : "minor"
print(status)  // Prints: adult

// Equivalent to:
// let status: String
// if age >= 18 {
//     status = "adult"
// } else {
//     status = "minor"
// }
```

Don't nest ternary operators - use `if` statements for complex logic:

```swift
// Avoid: Hard to read
// let result = a > b ? (a > c ? a : c) : (b > c ? b : c)

// Prefer: Clear if-else
let result: Int
if a > b {
    result = a > c ? a : c
} else {
    result = b > c ? b : c
}
```

## Nil-Coalescing Operator

The `??` operator provides a default value for optionals:

```swift
let userInput: String? = nil
let username = userInput ?? "Anonymous"
print(username)  // Prints: Anonymous

let savedScore: Int? = 100
let score = savedScore ?? 0
print(score)  // Prints: 100
```

## Key Takeaways

1. Use `if` for conditional branching where both paths are valid
2. Use `guard` for early exits and requirements checking
3. `guard let` keeps unwrapped values in scope after the guard
4. Avoid deeply nested `if` statements - use `guard` instead
5. Use the ternary operator `? :` for simple inline conditions
6. Use `??` to provide default values for optionals
7. Combine conditions with `&&` (AND) and `||` (OR)

In the next lesson, we'll explore Swift's powerful `switch` statement.
