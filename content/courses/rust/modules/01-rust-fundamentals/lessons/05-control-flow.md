---
title: Control Flow
order: 5
estimatedMinutes: 25
---

# Control Flow

Control flow constructs let you determine which code runs based on conditions and how many times code should repeat. Rust offers several powerful tools for controlling program flow.

## if Expressions

The basic `if` expression checks a condition:

```rust
fn main() {
    let number = 7;

    if number < 5 {
        println!("Number is less than 5");
    } else {
        println!("Number is 5 or greater");
    }
}
```

Unlike many languages, Rust's condition **must** be a boolean - no implicit conversions:

```rust
fn main() {
    let number = 3;

    // if number { }  // ERROR: expected `bool`, found integer

    if number != 0 {  // Explicit comparison required
        println!("Number is not zero");
    }
}
```

## else if Chains

Handle multiple conditions with `else if`:

```rust
fn main() {
    let number = 6;

    if number % 4 == 0 {
        println!("Divisible by 4");
    } else if number % 3 == 0 {
        println!("Divisible by 3");
    } else if number % 2 == 0 {
        println!("Divisible by 2");
    } else {
        println!("Not divisible by 4, 3, or 2");
    }
}
```

## if as an Expression

Since `if` is an expression, it returns a value:

```rust
fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };

    println!("Number is: {number}");  // Prints: 5

    // Both branches must return the same type
    let x = if true { 1 } else { 2 };  // Both i32
    // let y = if true { 1 } else { "two" };  // ERROR: mismatched types
}
```

## Loops

Rust has three loop types: `loop`, `while`, and `for`.

### Infinite loop with loop

The `loop` keyword creates an infinite loop:

```rust
fn main() {
    let mut counter = 0;

    loop {
        counter += 1;
        println!("Counter: {counter}");

        if counter == 5 {
            break;  // Exit the loop
        }
    }
}
```

### Returning Values from loop

Use `break` with a value to return from a loop:

```rust
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;  // Returns 20
        }
    };

    println!("Result: {result}");
}
```

### Loop Labels

Label loops to `break` or `continue` specific outer loops:

```rust
fn main() {
    let mut count = 0;

    'outer: loop {
        println!("count = {count}");
        let mut remaining = 10;

        loop {
            println!("  remaining = {remaining}");

            if remaining == 9 {
                break;  // Breaks inner loop only
            }
            if count == 2 {
                break 'outer;  // Breaks the outer loop
            }
            remaining -= 1;
        }
        count += 1;
    }

    println!("Final count: {count}");
}
```

### Conditional while Loop

The `while` loop runs while a condition is true:

```rust
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{number}!");
        number -= 1;
    }

    println!("LIFTOFF!");
}
```

### Iterating with for

The `for` loop is the most common for iterating over collections:

```rust
fn main() {
    let numbers = [10, 20, 30, 40, 50];

    for number in numbers {
        println!("Value: {number}");
    }
}
```

### Ranges

Use ranges for numeric sequences:

```rust
fn main() {
    // 1 to 4 (exclusive end)
    for i in 1..5 {
        println!("{i}");  // Prints 1, 2, 3, 4
    }

    // 1 to 5 (inclusive end)
    for i in 1..=5 {
        println!("{i}");  // Prints 1, 2, 3, 4, 5
    }

    // Countdown with reverse
    for i in (1..4).rev() {
        println!("{i}!");  // Prints 3!, 2!, 1!
    }
    println!("LIFTOFF!");
}
```

## match Expressions

The `match` expression is Rust's powerful pattern matching tool:

```rust
fn main() {
    let number = 3;

    match number {
        1 => println!("One"),
        2 => println!("Two"),
        3 => println!("Three"),
        _ => println!("Something else"),  // _ matches anything
    }
}
```

### match with Multiple Patterns

```rust
fn main() {
    let number = 4;

    match number {
        1 | 2 => println!("One or two"),        // Or pattern
        3..=5 => println!("Three through five"), // Range pattern
        _ => println!("Something else"),
    }
}
```

### match as an Expression

Like `if`, `match` returns a value:

```rust
fn main() {
    let dice_roll = 4;

    let result = match dice_roll {
        1 => "You rolled a one!",
        6 => "You rolled a six!",
        _ => "You rolled something else",
    };

    println!("{result}");
}
```

### Exhaustive Matching

Rust requires `match` to handle all possible cases:

```rust
fn main() {
    let value: bool = true;

    // Must handle both true and false
    match value {
        true => println!("It's true"),
        false => println!("It's false"),
    }

    // For types with many values, use _ as a catch-all
    let number: u8 = 42;
    match number {
        0 => println!("Zero"),
        1 => println!("One"),
        _ => println!("Something else"),  // Covers 2-255
    }
}
```

## continue Statement

Skip to the next iteration with `continue`:

```rust
fn main() {
    for i in 1..10 {
        if i % 2 == 0 {
            continue;  // Skip even numbers
        }
        println!("{i}");  // Only prints odd numbers
    }
}
```

## Combining Control Flow

Real programs combine these constructs:

```rust
fn fizzbuzz(n: u32) -> String {
    match (n % 3 == 0, n % 5 == 0) {
        (true, true) => String::from("FizzBuzz"),
        (true, false) => String::from("Fizz"),
        (false, true) => String::from("Buzz"),
        (false, false) => n.to_string(),
    }
}

fn main() {
    for i in 1..=15 {
        println!("{}", fizzbuzz(i));
    }
}
```

## Key Takeaways

1. `if` conditions must be boolean - no implicit type conversions
2. `if`, `loop`, and `match` are expressions that return values
3. Use `loop` for infinite loops, `while` for conditional loops, `for` for iteration
4. Ranges: `1..5` excludes end, `1..=5` includes end
5. `match` must exhaustively cover all cases
6. Use `break` and `continue` to control loop execution
7. Loop labels (`'label:`) allow breaking from nested loops

You've now covered Rust fundamentals! Practice these concepts with the exercises, then move on to learn about Rust's unique ownership system.
