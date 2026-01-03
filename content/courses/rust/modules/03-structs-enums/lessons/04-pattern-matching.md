---
title: Pattern Matching
order: 4
estimatedMinutes: 30
---

# Pattern Matching: Rust's Power Tool

Pattern matching in Rust is incredibly powerful. The `match` expression lets you compare a value against patterns and execute code based on which pattern matches.

## Basic Match Expressions

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u32 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}

fn main() {
    let coin = Coin::Quarter;
    println!("Value: {} cents", value_in_cents(coin));
}
```

## Match is Exhaustive

The compiler ensures you handle all cases:

```rust
enum Direction {
    North,
    South,
    East,
    West,
}

fn describe(d: Direction) -> &'static str {
    match d {
        Direction::North => "up",
        Direction::South => "down",
        // Compile error! Missing East and West
    }
}
```

## The Wildcard Pattern

Use `_` to match anything:

```rust
fn describe_number(n: i32) -> &'static str {
    match n {
        0 => "zero",
        1 => "one",
        2 => "two",
        _ => "something else",  // Matches everything else
    }
}
```

## Patterns that Bind Values

Extract values from enums:

```rust
#[derive(Debug)]
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
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

## Matching Option

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

fn main() {
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);

    println!("{:?} {:?}", six, none);  // Some(6) None
}
```

## Multiple Patterns with |

```rust
fn is_vowel(c: char) -> bool {
    match c {
        'a' | 'e' | 'i' | 'o' | 'u' => true,
        'A' | 'E' | 'I' | 'O' | 'U' => true,
        _ => false,
    }
}
```

## Ranges with ..=

```rust
fn describe_number(n: i32) -> &'static str {
    match n {
        i32::MIN..=-1 => "negative",
        0 => "zero",
        1..=10 => "small positive",
        11..=100 => "medium",
        _ => "large",
    }
}

fn letter_grade(c: char) -> &'static str {
    match c {
        'a'..='c' => "near the start",
        'x'..='z' => "near the end",
        _ => "in the middle",
    }
}
```

## Destructuring Structs

```rust
struct Point {
    x: i32,
    y: i32,
}

fn describe_point(p: Point) {
    match p {
        Point { x: 0, y: 0 } => println!("Origin"),
        Point { x: 0, y } => println!("On y-axis at {}", y),
        Point { x, y: 0 } => println!("On x-axis at {}", x),
        Point { x, y } => println!("Point at ({}, {})", x, y),
    }
}
```

## Destructuring Tuples

```rust
fn describe_pair(pair: (i32, i32)) {
    match pair {
        (0, 0) => println!("Origin"),
        (0, y) => println!("Y-axis: {}", y),
        (x, 0) => println!("X-axis: {}", x),
        (x, y) if x == y => println!("Diagonal: {}", x),
        (x, y) => println!("Point: ({}, {})", x, y),
    }
}
```

## Match Guards

Add conditions with `if`:

```rust
fn describe(x: i32) {
    match x {
        n if n < 0 => println!("{} is negative", n),
        n if n == 0 => println!("zero"),
        n if n % 2 == 0 => println!("{} is positive and even", n),
        n => println!("{} is positive and odd", n),
    }
}
```

## @ Bindings

Bind a value while also testing it:

```rust
enum Message {
    Hello { id: i32 },
}

fn main() {
    let msg = Message::Hello { id: 5 };

    match msg {
        Message::Hello { id: id_variable @ 3..=7 } => {
            println!("Found id in range: {}", id_variable)
        }
        Message::Hello { id: 10..=12 } => {
            println!("Found id in another range")
        }
        Message::Hello { id } => {
            println!("Found some other id: {}", id)
        }
    }
}
```

## if let: Single Pattern Match

When you only care about one pattern:

```rust
fn main() {
    let some_value = Some(3);

    // Instead of this:
    match some_value {
        Some(3) => println!("three!"),
        _ => (),
    }

    // Write this:
    if let Some(3) = some_value {
        println!("three!");
    }

    // With else:
    if let Some(x) = some_value {
        println!("Got: {}", x);
    } else {
        println!("Got nothing");
    }
}
```

## while let: Loop Until Pattern Fails

```rust
fn main() {
    let mut stack = vec![1, 2, 3];

    while let Some(top) = stack.pop() {
        println!("{}", top);
    }
    // Prints: 3, 2, 1
}
```

## let Patterns

Destructuring in let statements:

```rust
fn main() {
    // Tuple destructuring
    let (x, y, z) = (1, 2, 3);
    println!("{} {} {}", x, y, z);

    // Struct destructuring
    struct Point { x: i32, y: i32 }
    let Point { x: a, y: b } = Point { x: 10, y: 20 };
    println!("{} {}", a, b);

    // Shorthand when variable names match
    let Point { x, y } = Point { x: 10, y: 20 };
    println!("{} {}", x, y);
}
```

## Function Parameter Patterns

```rust
fn print_coordinates(&(x, y): &(i32, i32)) {
    println!("Location: ({}, {})", x, y);
}

fn main() {
    let point = (3, 5);
    print_coordinates(&point);
}
```

## Ignoring Values

```rust
fn main() {
    // Ignore entire values with _
    let _ = compute_something();  // Ignore result

    // Ignore parts of a tuple
    let (first, _, third) = (1, 2, 3);

    // Ignore remaining parts with ..
    let (head, ..) = (1, 2, 3, 4, 5);
    let (.., tail) = (1, 2, 3, 4, 5);
    let (head2, .., tail2) = (1, 2, 3, 4, 5);

    println!("head: {}, tail: {}", head, tail);        // 1, 5
    println!("head2: {}, tail2: {}", head2, tail2);    // 1, 5
}

fn compute_something() -> i32 { 42 }
```

## Nested Patterns

```rust
enum Color {
    Rgb(i32, i32, i32),
    Hsv(i32, i32, i32),
}

enum Message {
    Quit,
    ChangeColor(Color),
}

fn process(msg: Message) {
    match msg {
        Message::ChangeColor(Color::Rgb(r, g, b)) => {
            println!("RGB: {}, {}, {}", r, g, b)
        }
        Message::ChangeColor(Color::Hsv(h, s, v)) => {
            println!("HSV: {}, {}, {}", h, s, v)
        }
        Message::Quit => println!("Quit"),
    }
}
```

## Pattern Matching with References

```rust
fn main() {
    let robot_name = Some(String::from("Bors"));

    // Match on reference to avoid moving
    match &robot_name {
        Some(name) => println!("Found a name: {}", name),
        None => (),
    }

    // robot_name is still valid
    println!("robot_name is still: {:?}", robot_name);
}
```

## Refutability: Fallible vs Infallible Patterns

```rust
fn main() {
    // Irrefutable pattern - always matches (used with let, for, function params)
    let x = 5;
    let (a, b) = (1, 2);

    // Refutable pattern - might not match (used with if let, while let, match arms)
    let some_value: Option<i32> = Some(5);
    if let Some(x) = some_value {
        println!("{}", x);
    }

    // This won't compile - let requires irrefutable pattern:
    // let Some(x) = some_value;  // ERROR!
}
```

## Match Expressions Return Values

```rust
fn main() {
    let x = 5;

    let description = match x {
        1 => "one",
        2 => "two",
        3 => "three",
        _ => "something else",
    };

    println!("{}", description);
}
```

## Key Takeaways

1. **match is exhaustive** - must handle all cases
2. **Use _ for catchall** - matches anything
3. **Patterns can bind values** - extract data from enums/structs
4. **Match guards add conditions** - with `if` clauses
5. **@ bindings** capture while testing
6. **if let for single patterns** - cleaner than full match
7. **while let for pattern loops** - iterate until pattern fails
8. **Destructuring works everywhere** - let, function params, loops
9. **Use .. to ignore multiple values** - in tuples and structs

Pattern matching is central to idiomatic Rust. Master it to write expressive, safe, and concise code. You've completed the structs and enums module! Next, we'll explore Rust's powerful collection types.
