---
title: The Result Type
order: 2
estimatedMinutes: 20
---

# The Result Type

For recoverable errors, Rust uses the `Result` type. This forces you to handle potential failures explicitly, leading to more robust code.

## Result Basics

`Result` is an enum with two variants:

```rust
enum Result<T, E> {
    Ok(T),   // Success, contains the value
    Err(E),  // Failure, contains the error
}
```

Example usage:

```rust
use std::fs::File;

fn main() {
    let file = File::open("hello.txt");

    let file = match file {
        Ok(f) => f,
        Err(e) => panic!("Problem opening file: {:?}", e),
    };
}
```

## Creating Results

Return `Ok` or `Err` from your functions:

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Cannot divide by zero"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    match divide(10.0, 2.0) {
        Ok(result) => println!("Result: {}", result),
        Err(msg) => println!("Error: {}", msg),
    }
}
```

## Handling Results with Match

Pattern matching gives you full control:

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let file = match File::open("hello.txt") {
        Ok(f) => f,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => {
                match File::create("hello.txt") {
                    Ok(fc) => fc,
                    Err(e) => panic!("Problem creating file: {:?}", e),
                }
            }
            other_error => panic!("Problem opening file: {:?}", other_error),
        },
    };
}
```

## Shortcuts: unwrap and expect

For quick prototyping or when you're certain an operation succeeds:

```rust
// Panics with generic message if Err
let file = File::open("hello.txt").unwrap();

// Panics with your message if Err
let file = File::open("hello.txt").expect("Failed to open hello.txt");
```

**Warning**: Avoid these in production code unless you're truly certain the operation cannot fail.

## Methods on Result

### `is_ok()` and `is_err()`

```rust
let result: Result<i32, &str> = Ok(42);
println!("{}", result.is_ok());  // true
println!("{}", result.is_err()); // false
```

### `ok()` and `err()`

Convert Result to Option:

```rust
let ok_result: Result<i32, &str> = Ok(42);
let err_result: Result<i32, &str> = Err("error");

assert_eq!(ok_result.ok(), Some(42));   // Discards error
assert_eq!(err_result.err(), Some("error")); // Discards value
```

### `map()` and `map_err()`

Transform the success or error value:

```rust
let result: Result<i32, &str> = Ok(5);

// Transform the Ok value
let doubled = result.map(|x| x * 2);  // Ok(10)

// Transform the Err value
let result: Result<i32, &str> = Err("error");
let better_error = result.map_err(|e| format!("Error: {}", e));
```

### `and_then()` for Chaining

Chain operations that return Results:

```rust
fn parse_number(s: &str) -> Result<i32, String> {
    s.parse().map_err(|_| format!("'{}' is not a number", s))
}

fn double(n: i32) -> Result<i32, String> {
    if n > 1000 {
        Err(String::from("Number too large"))
    } else {
        Ok(n * 2)
    }
}

fn main() {
    let result = parse_number("42")
        .and_then(double);  // Ok(84)

    let result = parse_number("abc")
        .and_then(double);  // Err("'abc' is not a number")

    let result = parse_number("2000")
        .and_then(double);  // Err("Number too large")
}
```

### `unwrap_or()` and `unwrap_or_else()`

Provide defaults for errors:

```rust
let result: Result<i32, &str> = Err("error");

// Return default value
let value = result.unwrap_or(0);  // 0

// Compute default lazily
let result: Result<i32, &str> = Err("error");
let value = result.unwrap_or_else(|e| {
    println!("Error occurred: {}", e);
    -1
});
```

### `unwrap_or_default()`

Use the type's default value:

```rust
let result: Result<String, &str> = Err("error");
let value = result.unwrap_or_default();  // "" (empty string)
```

## Combining Results

### Using `?` in a function returning Result

We'll cover this in depth next lesson, but here's a preview:

```rust
fn read_config() -> Result<String, std::io::Error> {
    let content = std::fs::read_to_string("config.txt")?;
    Ok(content)
}
```

### Collecting Results

Convert `Vec<Result<T, E>>` to `Result<Vec<T>, E>`:

```rust
let strings = vec!["1", "2", "3"];
let numbers: Result<Vec<i32>, _> = strings
    .iter()
    .map(|s| s.parse::<i32>())
    .collect();

println!("{:?}", numbers);  // Ok([1, 2, 3])
```

## Key Takeaways

1. `Result<T, E>` represents success (`Ok(T)`) or failure (`Err(E)`)
2. Use `match` for full control over both variants
3. `unwrap()` and `expect()` are shortcuts that panic on error
4. `map()`, `and_then()`, and other combinators enable functional error handling
5. `unwrap_or()` and `unwrap_or_default()` provide fallback values

Next, we'll learn about propagating errors elegantly with the `?` operator.
