---
title: Trait Bounds and Generics
order: 2
estimatedMinutes: 25
---

# Trait Bounds and Generics

Generics let you write code that works with multiple types. Trait bounds constrain those types to ones that have specific capabilities. Together, they're the foundation of Rust's zero-cost abstractions.

## Generic Functions

A generic function works with any type:

```rust
fn first<T>(items: &[T]) -> Option<&T> {
    items.first()
}
```

The `<T>` declares a type parameter. This function works with slices of any type.

## Adding Trait Bounds

Often you need to constrain what types are acceptable. Trait bounds specify requirements:

```rust
use std::fmt::Display;

fn print_item<T: Display>(item: T) {
    println!("{}", item);
}
```

This says: "`T` must implement `Display`". Only types that can be displayed are accepted.

## Multiple Bounds

Use `+` to require multiple traits:

```rust
use std::fmt::{Debug, Display};

fn print_debug_and_display<T: Debug + Display>(item: T) {
    println!("Display: {}", item);
    println!("Debug: {:?}", item);
}
```

## The `where` Clause

For complex bounds, use a `where` clause for readability:

```rust
fn process<T, U>(t: T, u: U) -> String
where
    T: Display + Clone,
    U: Debug + Default,
{
    format!("{} - {:?}", t.clone(), u)
}
```

This is equivalent to putting bounds inline but much clearer.

## Trait Bounds in Structs

Generic structs can also have trait bounds:

```rust
use std::fmt::Display;

struct Wrapper<T: Display> {
    value: T,
}

impl<T: Display> Wrapper<T> {
    fn show(&self) {
        println!("Value: {}", self.value);
    }
}
```

## Conditional Method Implementation

You can implement methods only when certain bounds are met:

```rust
struct Pair<T> {
    first: T,
    second: T,
}

impl<T> Pair<T> {
    fn new(first: T, second: T) -> Self {
        Pair { first, second }
    }
}

// This method only exists when T implements Ord
impl<T: Ord> Pair<T> {
    fn max(&self) -> &T {
        if self.first >= self.second {
            &self.first
        } else {
            &self.second
        }
    }
}
```

## `impl Trait` Syntax

Rust offers a shorthand for simple trait bounds:

```rust
// These are equivalent:
fn print_item<T: Display>(item: T) { /* ... */ }
fn print_item(item: impl Display) { /* ... */ }
```

`impl Trait` can also be used in return position:

```rust
fn make_iterator() -> impl Iterator<Item = i32> {
    vec![1, 2, 3].into_iter()
}
```

This says "returns some type that implements Iterator" without exposing the concrete type.

## Blanket Implementations

You can implement a trait for all types that satisfy certain bounds:

```rust
trait Describable {
    fn describe(&self) -> String;
}

// Implement for ALL types that implement Display
impl<T: Display> Describable for T {
    fn describe(&self) -> String {
        format!("I am: {}", self)
    }
}

fn main() {
    let num = 42;
    let text = "hello";

    println!("{}", num.describe());   // I am: 42
    println!("{}", text.describe());  // I am: hello
}
```

## Static vs Dynamic Dispatch

With generics and trait bounds, Rust uses **static dispatch**. The compiler generates specialized code for each concrete type used:

```rust
fn print_twice<T: Display>(item: T) {
    println!("{}", item);
    println!("{}", item);
}

fn main() {
    print_twice(42);      // Generates code for i32
    print_twice("hello"); // Generates code for &str
}
```

This is zero-cost abstraction - no runtime overhead, but potentially larger binary size.

## Common Patterns

### Generic Containers

```rust
struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }

    fn push(&mut self, item: T) {
        self.items.push(item);
    }

    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }
}
```

### Bounded Generic Functions

```rust
fn largest<T: PartialOrd>(list: &[T]) -> Option<&T> {
    let mut largest = list.first()?;
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    Some(largest)
}
```

## Key Takeaways

1. Generics let you write flexible, reusable code
2. Trait bounds constrain generic types to those with required capabilities
3. Use `where` clauses for complex bounds
4. `impl Trait` provides convenient syntax for simple cases
5. Blanket implementations can add traits to many types at once
6. Static dispatch means zero runtime cost for generics

Next, we'll explore the common traits from Rust's standard library that you'll use frequently.
