---
title: Introduction to Traits
order: 1
estimatedMinutes: 20
---

# Introduction to Traits

Traits are Rust's way of defining shared behavior across types. If you're familiar with interfaces in other languages, traits serve a similar purpose but with additional power and flexibility.

## What is a Trait?

A trait defines a set of methods that types can implement. Think of it as a contract: any type that implements a trait promises to provide the methods defined by that trait.

```rust
trait Greet {
    fn greet(&self) -> String;
}
```

This declares a trait named `Greet` with one method, `greet`, that returns a `String`.

## Implementing a Trait

To implement a trait for a type, use the `impl Trait for Type` syntax:

```rust
struct Person {
    name: String,
}

impl Greet for Person {
    fn greet(&self) -> String {
        format!("Hello, my name is {}!", self.name)
    }
}

struct Robot {
    id: u32,
}

impl Greet for Robot {
    fn greet(&self) -> String {
        format!("BEEP BOOP. I AM UNIT {}.", self.id)
    }
}
```

Now both `Person` and `Robot` can be greeted, each in their own way:

```rust
fn main() {
    let person = Person { name: String::from("Alice") };
    let robot = Robot { id: 42 };

    println!("{}", person.greet());  // Hello, my name is Alice!
    println!("{}", robot.greet());   // BEEP BOOP. I AM UNIT 42.
}
```

## Default Implementations

Traits can provide default method implementations that types can use or override:

```rust
trait Greet {
    fn greet(&self) -> String {
        String::from("Hello!")
    }

    fn formal_greet(&self) -> String {
        format!("Greetings. {}", self.greet())
    }
}

struct Stranger;

impl Greet for Stranger {
    // Uses default greet(), overrides nothing
}

struct Friend {
    name: String,
}

impl Greet for Friend {
    fn greet(&self) -> String {
        format!("Hey {}!", self.name)
    }
    // formal_greet() uses the overridden greet()
}
```

## Multiple Traits

Types can implement multiple traits:

```rust
trait Speak {
    fn speak(&self) -> String;
}

trait Walk {
    fn walk(&self) -> String;
}

struct Dog {
    name: String,
}

impl Speak for Dog {
    fn speak(&self) -> String {
        format!("{} says: Woof!", self.name)
    }
}

impl Walk for Dog {
    fn walk(&self) -> String {
        format!("{} is walking happily", self.name)
    }
}
```

## The Orphan Rule

Rust has an important restriction: you can only implement a trait for a type if either the trait or the type is defined in your crate. This is called the **orphan rule**.

```rust
// This works - your trait, external type
trait MyTrait {
    fn my_method(&self);
}

impl MyTrait for String {
    fn my_method(&self) {
        println!("Called on: {}", self);
    }
}

// This also works - external trait, your type
use std::fmt::Display;

struct MyType(i32);

impl Display for MyType {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "MyType({})", self.0)
    }
}

// This would NOT work - both external
// impl Display for String { } // Error!
```

## Associated Functions in Traits

Traits can also define associated functions (functions without `self`):

```rust
trait Factory {
    fn create() -> Self;
}

struct Widget {
    id: u32,
}

impl Factory for Widget {
    fn create() -> Self {
        Widget { id: 0 }
    }
}

fn main() {
    let w = Widget::create();
}
```

## Key Takeaways

1. Traits define shared behavior that types can implement
2. Use `impl Trait for Type` to implement a trait
3. Traits can have default implementations
4. Types can implement multiple traits
5. The orphan rule prevents implementing external traits on external types
6. Traits can define associated functions as well as methods

In the next lesson, we'll explore how to use traits with generics through trait bounds.
