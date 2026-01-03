---
title: Defining Traits
order: 1
estimatedMinutes: 25
---

# Traits: Defining Shared Behavior

Traits define functionality that types can share. They're similar to interfaces in other languages, but with important differences.

## Defining a Trait

A trait declares method signatures that types must implement:

```rust
trait Summary {
    fn summarize(&self) -> String;
}
```

This trait requires any implementing type to provide a `summarize` method.

## Implementing a Trait

```rust
trait Summary {
    fn summarize(&self) -> String;
}

struct NewsArticle {
    headline: String,
    location: String,
    author: String,
    content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

struct Tweet {
    username: String,
    content: String,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}

fn main() {
    let article = NewsArticle {
        headline: String::from("Rust Releases 2.0"),
        location: String::from("Internet"),
        author: String::from("Rustacean"),
        content: String::from("The Rust team announced..."),
    };

    let tweet = Tweet {
        username: String::from("@rust_lang"),
        content: String::from("Excited to announce Rust 2.0!"),
    };

    println!("Article: {}", article.summarize());
    println!("Tweet: {}", tweet.summarize());
}
```

## Default Implementations

Traits can provide default method implementations:

```rust
trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}

struct NewsArticle {
    headline: String,
}

// Use the default implementation
impl Summary for NewsArticle {}

struct Tweet {
    username: String,
    content: String,
}

// Override the default
impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}

fn main() {
    let article = NewsArticle { headline: String::from("Big News") };
    let tweet = Tweet {
        username: String::from("@rust"),
        content: String::from("Hello!"),
    };

    println!("Article: {}", article.summarize());  // (Read more...)
    println!("Tweet: {}", tweet.summarize());      // @rust: Hello!
}
```

## Default Methods Calling Other Methods

Default implementations can call other trait methods:

```rust
trait Summary {
    fn summarize_author(&self) -> String;

    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}

struct Tweet {
    username: String,
    content: String,
}

impl Summary for Tweet {
    // Only need to implement summarize_author
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }
    // summarize() uses the default implementation
}

fn main() {
    let tweet = Tweet {
        username: String::from("rustlang"),
        content: String::from("Hello!"),
    };

    println!("{}", tweet.summarize());  // (Read more from @rustlang...)
}
```

## Traits as Parameters

Use traits to accept any type implementing a trait:

```rust
trait Summary {
    fn summarize(&self) -> String;
}

// Using impl Trait syntax
fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}

// Equivalent: trait bound syntax
fn notify_verbose<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}

// Multiple parameters with same trait
fn notify_both(item1: &impl Summary, item2: &impl Summary) {
    println!("1: {}", item1.summarize());
    println!("2: {}", item2.summarize());
}

// Force same type with generics
fn notify_same<T: Summary>(item1: &T, item2: &T) {
    println!("1: {}", item1.summarize());
    println!("2: {}", item2.summarize());
}
```

## Returning Types That Implement Traits

```rust
trait Summary {
    fn summarize(&self) -> String;
}

struct Tweet {
    username: String,
    content: String,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}

fn returns_summarizable() -> impl Summary {
    Tweet {
        username: String::from("@rust"),
        content: String::from("Hello!"),
    }
}

fn main() {
    let item = returns_summarizable();
    println!("{}", item.summarize());
}
```

Note: `impl Trait` return type only works when returning a single concrete type.

## Common Standard Library Traits

### Display and Debug

```rust
use std::fmt;

struct Point {
    x: i32,
    y: i32,
}

// Debug for {:?} formatting
impl fmt::Debug for Point {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Point {{ x: {}, y: {} }}", self.x, self.y)
    }
}

// Display for {} formatting
impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    let p = Point { x: 1, y: 2 };
    println!("Debug: {:?}", p);     // Point { x: 1, y: 2 }
    println!("Display: {}", p);     // (1, 2)
}
```

### Clone and Copy

```rust
// Clone: explicit duplication
#[derive(Clone)]
struct Expensive {
    data: Vec<i32>,
}

// Copy: implicit bitwise copy (only for simple types)
#[derive(Copy, Clone)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let e1 = Expensive { data: vec![1, 2, 3] };
    let e2 = e1.clone();  // Explicit clone required

    let p1 = Point { x: 1, y: 2 };
    let p2 = p1;  // Implicit copy
    println!("{} {}", p1.x, p2.x);  // Both valid
}
```

### PartialEq and Eq

```rust
#[derive(PartialEq, Eq)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p1 = Point { x: 1, y: 2 };
    let p2 = Point { x: 1, y: 2 };
    let p3 = Point { x: 3, y: 4 };

    println!("p1 == p2: {}", p1 == p2);  // true
    println!("p1 == p3: {}", p1 == p3);  // false
}
```

### PartialOrd and Ord

```rust
#[derive(PartialEq, Eq, PartialOrd, Ord)]
struct Version {
    major: u32,
    minor: u32,
    patch: u32,
}

fn main() {
    let v1 = Version { major: 1, minor: 0, patch: 0 };
    let v2 = Version { major: 1, minor: 2, patch: 0 };

    println!("v1 < v2: {}", v1 < v2);  // true
}
```

### Default

```rust
#[derive(Default)]
struct Config {
    debug: bool,
    port: u16,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            debug: false,
            port: 8080,
        }
    }
}

fn main() {
    let config = Config::default();
    println!("Port: {}", config.port);  // 8080
}
```

## Orphan Rule

You can only implement a trait for a type if:
- The trait is defined in your crate, OR
- The type is defined in your crate

```rust
// This works: your type, external trait
struct MyType;
impl std::fmt::Display for MyType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "MyType")
    }
}

// This also works: your trait, external type
trait MyTrait {
    fn my_method(&self);
}
impl MyTrait for String {
    fn my_method(&self) {
        println!("{}", self);
    }
}

// NOT allowed: external trait on external type
// impl std::fmt::Display for Vec<i32> { }  // ERROR!
```

## Deriving Traits

Many traits can be automatically derived:

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Default)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point::default();
    let p2 = p;  // Copy
    println!("{:?}", p);  // Debug
    println!("Equal: {}", p == p2);  // PartialEq
}
```

## Associated Types

Traits can have associated types:

```rust
trait Container {
    type Item;

    fn get(&self, index: usize) -> Option<&Self::Item>;
    fn len(&self) -> usize;
}

struct NumberList {
    numbers: Vec<i32>,
}

impl Container for NumberList {
    type Item = i32;

    fn get(&self, index: usize) -> Option<&i32> {
        self.numbers.get(index)
    }

    fn len(&self) -> usize {
        self.numbers.len()
    }
}
```

## Key Takeaways

1. **Traits define shared behavior** - method signatures types must implement
2. **Default implementations** reduce boilerplate
3. **Use `impl Trait` or generics** to accept trait-implementing types
4. **The orphan rule** restricts where traits can be implemented
5. **`#[derive]` auto-implements** common traits
6. **Standard library traits** like Debug, Clone, and PartialEq are essential
7. **Associated types** define types associated with a trait

Traits are fundamental to Rust's type system. In the next lesson, we'll explore generics for writing flexible, reusable code.
