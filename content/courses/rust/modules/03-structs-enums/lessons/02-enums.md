---
title: Enums and Variants
order: 2
estimatedMinutes: 25
---

# Enums: Types with Variants

Enums (enumerations) let you define a type by listing its possible variants. Each variant can optionally hold data, making enums incredibly powerful for modeling state.

## Defining an Enum

```rust
enum IpAddrKind {
    V4,
    V6,
}

fn main() {
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;

    route(four);
    route(six);
}

fn route(ip_kind: IpAddrKind) {
    // Handle the IP address kind
    println!("Routing...");
}
```

Both `V4` and `V6` are variants of `IpAddrKind` - they're the same type.

## Enums with Data

Variants can hold data of any type:

```rust
enum IpAddr {
    V4(u8, u8, u8, u8),     // Four u8 values
    V6(String),              // One String
}

fn main() {
    let home = IpAddr::V4(127, 0, 0, 1);
    let loopback = IpAddr::V6(String::from("::1"));

    print_ip(home);
    print_ip(loopback);
}

fn print_ip(ip: IpAddr) {
    match ip {
        IpAddr::V4(a, b, c, d) => println!("{}.{}.{}.{}", a, b, c, d),
        IpAddr::V6(addr) => println!("{}", addr),
    }
}
```

## Variants with Different Data Types

Each variant can have different types and amounts of data:

```rust
enum Message {
    Quit,                       // No data
    Move { x: i32, y: i32 },   // Named fields (struct-like)
    Write(String),              // Single String
    ChangeColor(i32, i32, i32), // Three i32 values (tuple-like)
}

fn main() {
    let m1 = Message::Quit;
    let m2 = Message::Move { x: 10, y: 20 };
    let m3 = Message::Write(String::from("hello"));
    let m4 = Message::ChangeColor(255, 0, 0);

    process(m1);
    process(m2);
    process(m3);
    process(m4);
}

fn process(msg: Message) {
    match msg {
        Message::Quit => println!("Quitting"),
        Message::Move { x, y } => println!("Moving to ({}, {})", x, y),
        Message::Write(text) => println!("Writing: {}", text),
        Message::ChangeColor(r, g, b) => println!("Color: rgb({},{},{})", r, g, b),
    }
}
```

## Methods on Enums

Enums can have methods just like structs:

```rust
impl Message {
    fn call(&self) {
        match self {
            Message::Quit => println!("Quit message"),
            Message::Move { x, y } => println!("Move to {}, {}", x, y),
            Message::Write(s) => println!("Write: {}", s),
            Message::ChangeColor(r, g, b) => println!("Color: {}/{}/{}", r, g, b),
        }
    }
}

fn main() {
    let msg = Message::Write(String::from("hello"));
    msg.call();
}
```

## Enum Memory Layout

All variants of an enum use the same amount of memory (the size of the largest variant plus a discriminant):

```
enum Message {
    Quit,                        // 0 bytes data
    Move { x: i32, y: i32 },    // 8 bytes data
    Write(String),               // 24 bytes data (String)
    ChangeColor(i32, i32, i32), // 12 bytes data
}

Memory layout (simplified):
+-------------+------------------------+
| discriminant|       data             |
| (tag)       | (size of largest)      |
+-------------+------------------------+
|   1 byte    |      24 bytes          |  = 25 bytes (+ padding)
+-------------+------------------------+

For Message::Quit:
+---+------------------------+
| 0 |       unused           |
+---+------------------------+

For Message::Write(String):
+---+--------+------+--------+
| 2 |  ptr   | len  |  cap   |
+---+--------+------+--------+
```

## C-style Enums

Enums without data can have explicit values:

```rust
enum HttpStatus {
    Ok = 200,
    NotFound = 404,
    InternalServerError = 500,
}

fn main() {
    println!("OK status: {}", HttpStatus::Ok as i32);
    println!("Not Found: {}", HttpStatus::NotFound as i32);
}
```

## Enums vs Structs

When to use each:

```rust
// Use struct when all data is always present
struct Point {
    x: f64,
    y: f64,
}

// Use enum when data varies by variant
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Triangle { base: f64, height: f64 },
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle { radius } => std::f64::consts::PI * radius * radius,
            Shape::Rectangle { width, height } => width * height,
            Shape::Triangle { base, height } => 0.5 * base * height,
        }
    }
}
```

## State Machines with Enums

Enums excel at modeling state:

```rust
enum ConnectionState {
    Disconnected,
    Connecting { attempt: u32 },
    Connected { session_id: String },
    Error { message: String },
}

struct Connection {
    state: ConnectionState,
}

impl Connection {
    fn new() -> Connection {
        Connection {
            state: ConnectionState::Disconnected,
        }
    }

    fn connect(&mut self) {
        self.state = ConnectionState::Connecting { attempt: 1 };
    }

    fn on_connected(&mut self, session_id: String) {
        self.state = ConnectionState::Connected { session_id };
    }

    fn status(&self) -> String {
        match &self.state {
            ConnectionState::Disconnected => String::from("Disconnected"),
            ConnectionState::Connecting { attempt } =>
                format!("Connecting (attempt {})", attempt),
            ConnectionState::Connected { session_id } =>
                format!("Connected: {}", session_id),
            ConnectionState::Error { message } =>
                format!("Error: {}", message),
        }
    }
}
```

## Generic Enums

Enums can be generic:

```rust
enum Container<T> {
    Empty,
    Single(T),
    Multiple(Vec<T>),
}

fn main() {
    let empty: Container<i32> = Container::Empty;
    let single = Container::Single(42);
    let multiple = Container::Multiple(vec![1, 2, 3]);

    match single {
        Container::Empty => println!("Empty"),
        Container::Single(val) => println!("Single: {}", val),
        Container::Multiple(vals) => println!("Multiple: {:?}", vals),
    }
}
```

## Recursive Enums with Box

For recursive data structures, use `Box` to avoid infinite size:

```rust
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));

    print_list(&list);
}

fn print_list(list: &List) {
    match list {
        Cons(val, next) => {
            print!("{} -> ", val);
            print_list(next);
        }
        Nil => println!("Nil"),
    }
}
```

Why `Box`?

```
Without Box (infinite size!):
List = Cons(i32, List) = Cons(i32, Cons(i32, List)) = ...

With Box (fixed size):
List = Cons(i32, Box<List>)
           ↓
    +------+-------+
    | i32  | *ptr  | ──► next List on heap
    +------+-------+
```

## Deriving Traits for Enums

```rust
#[derive(Debug, Clone, PartialEq)]
enum Direction {
    North,
    South,
    East,
    West,
}

fn main() {
    let d1 = Direction::North;
    let d2 = d1.clone();

    println!("Debug: {:?}", d1);
    println!("Equal: {}", d1 == d2);
}
```

## Key Takeaways

1. **Enums define types with variants** - each variant is the same type
2. **Variants can hold data** of different types and amounts
3. **Enums are sized to the largest variant** plus a discriminant
4. **Methods work on enums** just like structs
5. **Use enums for state machines** - they make invalid states unrepresentable
6. **Use `Box` for recursive enums** to break infinite size loops
7. **C-style enums** can have explicit integer values

Enums are one of Rust's most powerful features. In the next lesson, we'll explore two essential enums from the standard library: `Option` and `Result`.
