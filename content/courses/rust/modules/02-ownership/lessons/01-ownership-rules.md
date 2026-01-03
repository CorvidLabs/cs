---
title: Ownership Rules
order: 1
estimatedMinutes: 25
---

# Understanding Ownership

Ownership is Rust's most distinctive feature and has deep implications for the rest of the language. It enables Rust to make memory safety guarantees without needing a garbage collector.

## What is Ownership?

In most languages, you either have a garbage collector that constantly looks for unused memory, or the programmer must explicitly allocate and free memory. Rust takes a third approach: memory is managed through a system of ownership with rules that the compiler checks at compile time.

## The Three Ownership Rules

These rules are fundamental to everything in Rust:

```rust
// Rule 1: Each value in Rust has an owner
let s = String::from("hello");  // s is the owner of this String

// Rule 2: There can only be one owner at a time
let s2 = s;  // Ownership moves to s2, s is no longer valid

// Rule 3: When the owner goes out of scope, the value is dropped
{
    let s3 = String::from("world");
    // s3 is valid here
}  // s3 goes out of scope and is dropped - memory is freed
```

## Stack vs Heap: Why Ownership Matters

To understand ownership, we need to understand where data lives in memory.

### Stack Data (Copy Semantics)

Simple types with known, fixed sizes live on the stack:

```rust
fn main() {
    let x = 5;      // x is stored on the stack
    let y = x;      // y gets a COPY of x's value

    println!("x = {}, y = {}", x, y);  // Both are valid!
}
```

Output:
```
x = 5, y = 5
```

Stack data is cheap to copy, so Rust copies it automatically.

### Heap Data (Move Semantics)

Complex types like `String` store data on the heap:

```rust
fn main() {
    let s1 = String::from("hello");

    // What does s1 look like in memory?
    // Stack:                    Heap:
    // +--------+               +---+---+---+---+---+
    // | ptr    | -----------> | h | e | l | l | o |
    // | len: 5 |               +---+---+---+---+---+
    // | cap: 5 |
    // +--------+

    let s2 = s1;  // s1's data MOVES to s2

    // println!("{}", s1);  // ERROR! s1 is no longer valid
    println!("{}", s2);     // OK, s2 owns the data
}
```

## Understanding Move Semantics

When we assign `s1` to `s2`, Rust doesn't copy the heap data. Instead, it moves the ownership:

```rust
fn main() {
    let s1 = String::from("hello");

    // Before move:
    // s1 -> [ptr|len|cap] -> "hello" (on heap)

    let s2 = s1;

    // After move:
    // s1 -> (invalid)
    // s2 -> [ptr|len|cap] -> "hello" (on heap)

    // This prevents double-free: only s2 will free the memory
}
```

## The Compiler Protects You

Try to use a moved value and the compiler stops you:

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;

    println!("{}", s1);  // Compile error!
}
```

Error:
```
error[E0382]: borrow of moved value: `s1`
 --> src/main.rs:5:20
  |
2 |     let s1 = String::from("hello");
  |         -- move occurs because `s1` has type `String`
3 |     let s2 = s1;
  |              -- value moved here
4 |
5 |     println!("{}", s1);
  |                    ^^ value borrowed here after move
```

This error message is incredibly helpful - it tells you exactly what happened and where.

## Clone: Explicit Deep Copy

If you actually want to copy heap data, use `clone()`:

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();  // Deep copy of the heap data

    println!("s1 = {}, s2 = {}", s1, s2);  // Both valid!
}
```

Output:
```
s1 = hello, s2 = hello
```

The `clone()` method makes your intentions explicit - you're asking for a potentially expensive operation.

## Copy Trait: Stack-Only Data

Some types implement the `Copy` trait, meaning they're copied automatically:

```rust
fn main() {
    // All these types implement Copy:
    let a: i32 = 5;
    let b = a;  // Copy, not move

    let c: f64 = 3.14;
    let d = c;  // Copy

    let e: bool = true;
    let f = e;  // Copy

    let g: char = 'A';
    let h = g;  // Copy

    // Tuples of Copy types are also Copy:
    let point = (10, 20);
    let point2 = point;  // Copy

    // All original variables still valid!
    println!("{} {} {} {} {} {:?}", a, c, e, g, point, (b, d, f, h, point2));
}
```

Types that implement `Copy`:
- All integer types (`i32`, `u64`, etc.)
- Floating point types (`f32`, `f64`)
- Booleans (`bool`)
- Characters (`char`)
- Tuples containing only `Copy` types
- Fixed-size arrays of `Copy` types

## Ownership and Functions

Passing a value to a function transfers ownership just like assignment:

```rust
fn main() {
    let s = String::from("hello");

    takes_ownership(s);     // s's value moves into the function

    // println!("{}", s);   // ERROR! s is no longer valid

    let x = 5;

    makes_copy(x);          // x is Copy, so it's still valid

    println!("x is still {}", x);  // OK!
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
}  // some_string goes out of scope and `drop` is called

fn makes_copy(some_integer: i32) {
    println!("{}", some_integer);
}  // some_integer goes out of scope, nothing special happens
```

## Return Values Transfer Ownership

Functions can transfer ownership back via return values:

```rust
fn main() {
    let s1 = gives_ownership();         // Function gives ownership to s1

    let s2 = String::from("hello");

    let s3 = takes_and_gives_back(s2);  // s2 moves in, result moves to s3

    println!("s1: {}, s3: {}", s1, s3);
    // s2 is no longer valid
}

fn gives_ownership() -> String {
    let some_string = String::from("yours");
    some_string  // Returned and moves out to calling function
}

fn takes_and_gives_back(a_string: String) -> String {
    a_string  // Returned and moves out
}
```

## The Ownership Dance Problem

This pattern of passing and returning ownership is tedious:

```rust
fn main() {
    let s1 = String::from("hello");

    let (s2, len) = calculate_length(s1);

    println!("The length of '{}' is {}.", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();
    (s, length)  // Have to return s to give ownership back!
}
```

This is where **borrowing** comes in - we'll cover that in the next lesson.

## Visualizing Ownership

```
Ownership Flow:

    let s1 = String::from("hi")
         │
         ▼
    ┌─────────┐
    │   s1    │ ──────► "hi" on heap
    └─────────┘

    let s2 = s1  (MOVE)
         │
         ▼
    ┌─────────┐
    │ s1 (X)  │  invalidated
    └─────────┘

    ┌─────────┐
    │   s2    │ ──────► "hi" on heap
    └─────────┘

    } // s2 goes out of scope

    ┌─────────┐
    │   s2    │ ──X───► "hi" freed!
    └─────────┘
```

## Key Takeaways

1. **Every value has exactly one owner** - no shared ownership (yet)
2. **Ownership can be transferred (moved)** - the original variable becomes invalid
3. **When the owner goes out of scope, memory is freed** - automatic cleanup
4. **Simple types are copied, complex types are moved** - the `Copy` trait matters
5. **The compiler enforces these rules** - memory bugs are caught at compile time
6. **Clone for explicit deep copies** - when you really need a copy

Understanding ownership is crucial. It's Rust's foundation for memory safety without garbage collection. In the next lesson, we'll learn about borrowing - a way to use values without taking ownership.
