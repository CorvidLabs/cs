---
title: Variables and Mutability
order: 2
estimatedMinutes: 20
---

# Variables and Mutability

Rust takes a unique approach to variables: they're **immutable by default**. This design choice helps prevent bugs and makes code easier to reason about.

## Declaring Variables with let

Use `let` to create a variable:

```rust
fn main() {
    let x = 5;
    println!("The value of x is: {x}");
}
```

## Immutability by Default

Variables in Rust cannot be changed after assignment unless explicitly marked as mutable:

```rust
fn main() {
    let x = 5;
    x = 6;  // ERROR: cannot assign twice to immutable variable
}
```

The compiler will reject this code with a helpful error message:

```
error[E0384]: cannot assign twice to immutable variable `x`
```

## Making Variables Mutable

When you need a value to change, use `mut`:

```rust
fn main() {
    let mut x = 5;
    println!("x is: {x}");

    x = 6;  // This works now!
    println!("x is now: {x}");
}
```

Output:
```
x is: 5
x is now: 6
```

## Why Immutability by Default?

This design provides several benefits:

1. **Safety**: The compiler catches accidental modifications
2. **Clarity**: Reading code, you know which values can change
3. **Concurrency**: Immutable data is inherently thread-safe
4. **Optimization**: The compiler can make assumptions about immutable values

When you see `mut`, it signals that this value will change - a useful hint when reading code.

## Constants

For values that should never change, use `const`:

```rust
const MAX_POINTS: u32 = 100_000;

fn main() {
    println!("Maximum points: {MAX_POINTS}");
}
```

Constants differ from immutable variables:

- Must have a type annotation
- Can be declared in any scope, including global
- Must be set to a constant expression (computed at compile time)
- Convention: use SCREAMING_SNAKE_CASE

## Shadowing

Rust allows you to declare a new variable with the same name, **shadowing** the previous one:

```rust
fn main() {
    let x = 5;
    let x = x + 1;  // Shadows the previous x
    let x = x * 2;  // Shadows again

    println!("x is: {x}");  // Prints: x is: 12
}
```

Shadowing is different from `mut`:

```rust
fn main() {
    // Shadowing lets you change the type
    let spaces = "   ";        // String slice
    let spaces = spaces.len(); // Now it's a number (usize)

    // mut does NOT allow changing types
    let mut text = "hello";
    // text = text.len();  // ERROR: expected `&str`, found `usize`
}
```

## Shadowing in Nested Scopes

Shadowing can occur in inner scopes, with the original value restored afterward:

```rust
fn main() {
    let x = 5;

    {
        let x = 99;  // Shadows x within this block
        println!("Inner x: {x}");  // Prints: 99
    }

    println!("Outer x: {x}");  // Prints: 5 (original x is back)
}
```

## Type Annotations

Rust usually infers types, but you can be explicit:

```rust
fn main() {
    let x: i32 = 5;      // Explicitly an i32
    let y = 10;          // Inferred as i32
    let z: f64 = 3.14;   // Explicitly a f64
}
```

Type annotations become necessary in ambiguous situations:

```rust
fn main() {
    // The compiler needs help here - what type of number?
    let guess: u32 = "42".parse().expect("Not a number!");
}
```

## Practical Guidelines

Choose your approach based on intent:

| Scenario | Use |
|----------|-----|
| Value never changes | `let` (immutable) |
| Value updates in place | `let mut` |
| Compile-time constant | `const` |
| Transform value or change type | Shadowing |

## Key Takeaways

1. Variables are immutable by default - use `mut` when you need to modify them
2. Immutability prevents bugs and enables compiler optimizations
3. `const` is for compile-time constants that never change
4. Shadowing creates a new variable with the same name, allowing type changes
5. The compiler enforces these rules, catching errors before your code runs

Next, we'll explore the data types available in Rust and how the type system keeps your code safe.
