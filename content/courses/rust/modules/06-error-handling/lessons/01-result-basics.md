---
title: Result Basics
order: 1
estimatedMinutes: 25
---

# Result: The Foundation of Error Handling

Rust doesn't have exceptions. Instead, it uses the `Result` type to handle operations that can fail. This makes error handling explicit and type-safe.

## The Result Type

`Result` is an enum with two variants:

```rust
enum Result<T, E> {
    Ok(T),   // Success with value of type T
    Err(E),  // Failure with error of type E
}
```

## Basic Usage

```rust
use std::fs::File;
use std::io::Error;

fn main() {
    let result: Result<File, Error> = File::open("hello.txt");

    match result {
        Ok(file) => println!("File opened: {:?}", file),
        Err(error) => println!("Failed: {}", error),
    }
}
```

## Creating Results

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("cannot divide by zero"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    println!("{:?}", divide(10.0, 2.0));  // Ok(5.0)
    println!("{:?}", divide(10.0, 0.0));  // Err("cannot divide by zero")
}
```

## Checking Result State

```rust
fn main() {
    let good: Result<i32, &str> = Ok(42);
    let bad: Result<i32, &str> = Err("oops");

    println!("good.is_ok(): {}", good.is_ok());     // true
    println!("good.is_err(): {}", good.is_err());   // false
    println!("bad.is_ok(): {}", bad.is_ok());       // false
    println!("bad.is_err(): {}", bad.is_err());     // true
}
```

## Extracting Values

### unwrap and expect

```rust
fn main() {
    let good: Result<i32, &str> = Ok(42);
    let bad: Result<i32, &str> = Err("oops");

    // unwrap: panics on Err
    let value = good.unwrap();
    println!("Unwrapped: {}", value);

    // expect: panics with custom message
    let value = good.expect("should have a value");
    println!("Expected: {}", value);

    // These would panic:
    // bad.unwrap();  // panics: "called `Result::unwrap()` on an `Err` value: oops"
    // bad.expect("custom message");  // panics: "custom message: oops"
}
```

### unwrap_or and unwrap_or_else

```rust
fn main() {
    let bad: Result<i32, &str> = Err("oops");

    // Provide a default value
    let value = bad.unwrap_or(0);
    println!("With default: {}", value);  // 0

    // Compute default lazily
    let value = bad.unwrap_or_else(|error| {
        println!("Error occurred: {}", error);
        -1
    });
    println!("Computed default: {}", value);  // -1

    // Use Default trait
    let value: i32 = bad.unwrap_or_default();
    println!("Default: {}", value);  // 0
}
```

## Transforming Results

### map: Transform Ok values

```rust
fn main() {
    let result: Result<i32, &str> = Ok(5);

    // Transform the Ok value
    let doubled: Result<i32, &str> = result.map(|x| x * 2);
    println!("{:?}", doubled);  // Ok(10)

    // Error passes through unchanged
    let error: Result<i32, &str> = Err("oops");
    let still_error = error.map(|x| x * 2);
    println!("{:?}", still_error);  // Err("oops")
}
```

### map_err: Transform Err values

```rust
fn main() {
    let result: Result<i32, i32> = Err(404);

    // Transform the error
    let with_message = result.map_err(|code| format!("Error code: {}", code));
    println!("{:?}", with_message);  // Err("Error code: 404")

    // Ok passes through unchanged
    let ok: Result<i32, i32> = Ok(42);
    let still_ok = ok.map_err(|code| format!("Error code: {}", code));
    println!("{:?}", still_ok);  // Ok(42)
}
```

### and_then: Chain Operations

```rust
fn parse_number(s: &str) -> Result<i32, String> {
    s.parse::<i32>().map_err(|_| format!("'{}' is not a number", s))
}

fn double(n: i32) -> Result<i32, String> {
    if n > 1000 {
        Err(String::from("number too large"))
    } else {
        Ok(n * 2)
    }
}

fn main() {
    // Chain operations that each return Result
    let result = parse_number("42").and_then(double);
    println!("{:?}", result);  // Ok(84)

    let result = parse_number("abc").and_then(double);
    println!("{:?}", result);  // Err("'abc' is not a number")

    let result = parse_number("2000").and_then(double);
    println!("{:?}", result);  // Err("number too large")
}
```

## Combining Results

### and / or

```rust
fn main() {
    let x: Result<i32, &str> = Ok(2);
    let y: Result<i32, &str> = Err("late error");

    // and: returns second if first is Ok
    println!("{:?}", x.and(y));  // Err("late error")

    let x: Result<i32, &str> = Err("early error");
    let y: Result<i32, &str> = Ok(2);

    // or: returns first if Ok, otherwise second
    println!("{:?}", x.or(y));   // Ok(2)
}
```

## Pattern Matching on Result

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let file_result = File::open("hello.txt");

    let file = match file_result {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => {
                match File::create("hello.txt") {
                    Ok(fc) => fc,
                    Err(e) => panic!("Cannot create file: {:?}", e),
                }
            }
            other_error => {
                panic!("Cannot open file: {:?}", other_error);
            }
        },
    };

    println!("File: {:?}", file);
}
```

## Using if let with Result

```rust
fn main() {
    let result: Result<i32, &str> = Ok(42);

    if let Ok(value) = result {
        println!("Got value: {}", value);
    }

    let error: Result<i32, &str> = Err("oops");

    if let Err(e) = error {
        println!("Error: {}", e);
    }
}
```

## Result in Function Signatures

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_file_contents(path: &str) -> Result<String, io::Error> {
    let mut file = match File::open(path) {
        Ok(f) => f,
        Err(e) => return Err(e),
    };

    let mut contents = String::new();
    match file.read_to_string(&mut contents) {
        Ok(_) => Ok(contents),
        Err(e) => Err(e),
    }
}

fn main() {
    match read_file_contents("example.txt") {
        Ok(contents) => println!("File contents:\n{}", contents),
        Err(error) => println!("Error reading file: {}", error),
    }
}
```

## Converting Option to Result

```rust
fn main() {
    let option: Option<i32> = Some(42);

    // Convert Option to Result
    let result: Result<i32, &str> = option.ok_or("no value");
    println!("{:?}", result);  // Ok(42)

    let none: Option<i32> = None;
    let result: Result<i32, &str> = none.ok_or("no value");
    println!("{:?}", result);  // Err("no value")

    // Lazy error creation
    let none: Option<i32> = None;
    let result = none.ok_or_else(|| {
        format!("Missing value at {}", "some_location")
    });
    println!("{:?}", result);
}
```

## Best Practices

### Return Result from functions that can fail

```rust
// Good: Returns Result
fn parse_config(s: &str) -> Result<Config, ConfigError> {
    // ...
}

// Bad: Panics on error
fn parse_config_bad(s: &str) -> Config {
    s.parse().unwrap()  // Panics!
}
```

### Avoid unwrap in library code

```rust
// Good: Propagate the error
fn load_data(path: &str) -> Result<Data, Error> {
    let contents = std::fs::read_to_string(path)?;
    parse_data(&contents)
}

// Bad: Panics on file not found
fn load_data_bad(path: &str) -> Data {
    let contents = std::fs::read_to_string(path).unwrap();
    parse_data(&contents).unwrap()
}
```

## Key Takeaways

1. **Result has two variants**: `Ok(T)` for success, `Err(E)` for failure
2. **Use match or if let** to handle both cases
3. **map transforms Ok values**, map_err transforms Err values
4. **and_then chains** operations that return Result
5. **unwrap_or provides defaults** for error cases
6. **Avoid unwrap in library code** - return Result instead
7. **Result makes errors explicit** in function signatures

In the next lesson, we'll learn the `?` operator for elegant error propagation.
