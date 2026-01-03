---
title: Defining Structs
order: 1
estimatedMinutes: 25
---

# Structs: Custom Data Types

Structs let you create custom data types that group related data together. They're similar to classes in other languages, but without inheritance.

## Defining a Struct

Use the `struct` keyword to define a new type:

```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

fn main() {
    // Create an instance
    let user1 = User {
        email: String::from("alice@example.com"),
        username: String::from("alice"),
        active: true,
        sign_in_count: 1,
    };

    println!("User: {}", user1.username);
}
```

## Accessing Fields

Use dot notation to access struct fields:

```rust
fn main() {
    let user1 = User {
        email: String::from("alice@example.com"),
        username: String::from("alice"),
        active: true,
        sign_in_count: 1,
    };

    println!("Email: {}", user1.email);
    println!("Active: {}", user1.active);
    println!("Sign-ins: {}", user1.sign_in_count);
}
```

## Mutable Structs

The entire struct must be mutable to change any field:

```rust
fn main() {
    let mut user1 = User {
        email: String::from("alice@example.com"),
        username: String::from("alice"),
        active: true,
        sign_in_count: 1,
    };

    user1.email = String::from("newemail@example.com");
    user1.sign_in_count += 1;

    println!("Updated email: {}", user1.email);
}
```

Note: Rust doesn't allow marking individual fields as mutable.

## Field Init Shorthand

When variables match field names, use shorthand:

```rust
fn build_user(email: String, username: String) -> User {
    User {
        email,      // Same as email: email
        username,   // Same as username: username
        active: true,
        sign_in_count: 1,
    }
}
```

## Struct Update Syntax

Create a new struct using values from another:

```rust
fn main() {
    let user1 = User {
        email: String::from("alice@example.com"),
        username: String::from("alice"),
        active: true,
        sign_in_count: 1,
    };

    // Create user2 with some fields from user1
    let user2 = User {
        email: String::from("bob@example.com"),
        ..user1  // Remaining fields come from user1
    };

    // Note: user1.username was moved to user2!
    // user1.email and user1.active are still valid (Copy types + separate value)
    println!("User2: {}", user2.username);
}
```

**Warning**: The `..` syntax moves fields that don't implement `Copy`.

## Tuple Structs

Structs without named fields:

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);

    // Access by index
    println!("Red component: {}", black.0);
    println!("X coordinate: {}", origin.0);

    // These are different types, even though they have the same structure
    // let invalid: Color = origin;  // ERROR!
}
```

Tuple structs are useful when you want type safety but don't need field names.

## Unit-Like Structs

Structs with no fields:

```rust
struct AlwaysEqual;

fn main() {
    let _subject = AlwaysEqual;

    // Useful for traits without data
    // We'll see more uses when we cover traits
}
```

## Ownership in Structs

Structs can own data or hold references (with lifetimes):

```rust
// Struct that owns its data
struct OwnedUser {
    username: String,  // Owns the String
    email: String,
}

// Struct with references (needs lifetime)
struct BorrowedUser<'a> {
    username: &'a str,  // Borrows the data
    email: &'a str,
}

fn main() {
    let owned = OwnedUser {
        username: String::from("alice"),
        email: String::from("alice@example.com"),
    };

    let name = String::from("bob");
    let mail = String::from("bob@example.com");

    let borrowed = BorrowedUser {
        username: &name,
        email: &mail,
    };

    println!("{} {}", owned.username, borrowed.username);
}
```

## Adding Methods with impl

Define methods in an `impl` block:

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // Method: takes &self as first parameter
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn perimeter(&self) -> u32 {
        2 * (self.width + self.height)
    }

    // Method that mutates
    fn double_size(&mut self) {
        self.width *= 2;
        self.height *= 2;
    }

    // Method that consumes self
    fn into_square(self) -> Rectangle {
        let side = (self.width + self.height) / 2;
        Rectangle { width: side, height: side }
    }
}

fn main() {
    let mut rect = Rectangle { width: 30, height: 50 };

    println!("Area: {} square pixels", rect.area());
    println!("Perimeter: {} pixels", rect.perimeter());

    rect.double_size();
    println!("Doubled area: {}", rect.area());

    let square = rect.into_square();
    // rect is no longer valid here
    println!("Square area: {}", square.area());
}
```

## Method Receivers

Different `self` types give different capabilities:

```rust
impl Rectangle {
    fn area(&self) -> u32 {           // Borrows immutably
        self.width * self.height
    }

    fn set_width(&mut self, w: u32) { // Borrows mutably
        self.width = w;
    }

    fn consume(self) -> String {       // Takes ownership
        format!("{}x{}", self.width, self.height)
    }
}
```

| Receiver | Can read | Can modify | Consumes |
|----------|----------|------------|----------|
| `&self` | Yes | No | No |
| `&mut self` | Yes | Yes | No |
| `self` | Yes | Yes | Yes |

## Associated Functions

Functions in `impl` without `self` are associated functions (like static methods):

```rust
impl Rectangle {
    // Associated function (no self)
    fn new(width: u32, height: u32) -> Rectangle {
        Rectangle { width, height }
    }

    fn square(size: u32) -> Rectangle {
        Rectangle { width: size, height: size }
    }
}

fn main() {
    // Called with :: syntax
    let rect = Rectangle::new(30, 50);
    let square = Rectangle::square(10);

    println!("Rect: {}x{}", rect.width, rect.height);
    println!("Square: {}x{}", square.width, square.height);
}
```

## Multiple impl Blocks

You can have multiple `impl` blocks for the same struct:

```rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}
```

This is useful for organizing code and for conditional implementations.

## Deriving Common Traits

Use `#[derive]` for common functionality:

```rust
#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p1 = Point { x: 1, y: 2 };
    let p2 = p1.clone();

    println!("Debug: {:?}", p1);
    println!("Equal: {}", p1 == p2);
}
```

Common derivable traits:
- `Debug` - enables `{:?}` formatting
- `Clone` - enables `.clone()`
- `Copy` - enables copy semantics (for simple types)
- `PartialEq` - enables `==` and `!=`
- `Eq` - full equality (when PartialEq is total)
- `Hash` - enables use in HashMaps
- `Default` - enables `Default::default()`

## Struct Memory Layout

```
Stack Layout of Rectangle { width: 30, height: 50 }:

    +--------+--------+
    | width  | height |
    | (u32)  | (u32)  |
    +--------+--------+
    |   30   |   50   |
    +--------+--------+
    4 bytes  4 bytes  = 8 bytes total

Stack Layout of User (with String fields):

    Stack:                           Heap:
    +-----------+                   +-------------+
    | username  |                   |   "alice"   |
    | ptr|len|  | ─────────────────►+-------------+
    | cap       |
    +-----------+                   +-------------------+
    | email     |                   | "alice@example.com"|
    | ptr|len|  | ─────────────────►+-------------------+
    | cap       |
    +-----------+
    | count(u64)|
    +-----------+
    |active(u8) |
    +-----------+
```

## Key Takeaways

1. **Structs group related data** under a single type name
2. **Use field init shorthand** when variable names match field names
3. **Struct update syntax (`..other`)** copies remaining fields
4. **Methods are defined in `impl` blocks** with `self` as first parameter
5. **Associated functions** don't take `self` and use `::` syntax
6. **Use `#[derive]`** for common trait implementations
7. **Choose owned data or references** based on your ownership needs

Structs are fundamental to Rust programming. In the next lesson, we'll explore enums - another powerful way to define custom types.
