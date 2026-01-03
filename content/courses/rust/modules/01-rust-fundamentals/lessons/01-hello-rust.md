---
title: Hello, Rust!
order: 1
estimatedMinutes: 15
---

# Your First Rust Program

Welcome to Rust! Let's write your first program and understand the basics of how Rust code is structured.

## The Classic Hello World

Every Rust program starts with a `main` function:

```rust
fn main() {
    println!("Hello, World!");
}
```

When you run this code, you'll see:

```
Hello, World!
```

## Breaking It Down

Let's understand each part:

- `fn` declares a function
- `main` is a special function name - it's where every Rust program begins execution
- `()` indicates the function takes no parameters
- `{}` contains the function body
- `println!` is a **macro** (note the `!`) that prints text to the console
- `"Hello, World!"` is a string literal
- `;` ends the statement

## Why println! Has an Exclamation Mark

In Rust, `!` indicates a macro, not a regular function. Macros are expanded at compile time and can accept variable numbers of arguments. The `println!` macro handles formatting and output for you.

```rust
fn main() {
    println!("Hello, {}!", "Rustacean");
    println!("The answer is: {}", 42);
}
```

Output:
```
Hello, Rustacean!
The answer is: 42
```

The `{}` placeholders are replaced with the values that follow.

## Formatted Output

Rust's formatting is powerful and type-safe:

```rust
fn main() {
    let name = "Alice";
    let age = 30;

    // Basic formatting
    println!("{} is {} years old", name, age);

    // Named placeholders
    println!("{name} is {age} years old");

    // Debug formatting with {:?}
    println!("Debug: {:?}", (1, 2, 3));
}
```

## Comments

Rust supports several comment styles:

```rust
fn main() {
    // This is a single-line comment

    /* This is a
       multi-line comment */

    /// This is a documentation comment (for the item that follows)

    println!("Comments are ignored by the compiler");
}
```

## Compilation: A Key Difference

Unlike interpreted languages, Rust is **compiled**. Before running, the Rust compiler (`rustc`) transforms your code into an executable:

```bash
$ rustc main.rs      # Compile
$ ./main             # Run
Hello, World!
```

The compiler catches many errors before your program ever runs. This is one of Rust's superpowers - if it compiles, many classes of bugs are already eliminated.

## Using Cargo

In practice, you'll use Cargo, Rust's build tool and package manager:

```bash
$ cargo new hello_rust   # Create a new project
$ cd hello_rust
$ cargo run              # Build and run
```

Cargo handles compilation, dependencies, and more. We'll use it throughout this course.

## Key Takeaways

1. Every Rust program needs a `main` function as its entry point
2. `println!` is a macro (indicated by `!`) for printing to the console
3. Use `{}` for placeholder formatting in print statements
4. Rust is a compiled language - the compiler catches errors before runtime
5. Comments use `//` for single-line and `/* */` for multi-line
6. Cargo is the standard tool for building and managing Rust projects

You've written your first Rust program! In the next lesson, we'll explore variables and Rust's unique approach to mutability.
