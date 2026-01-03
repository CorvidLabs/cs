---
title: The ? Operator
order: 2
estimatedMinutes: 25
---

# The ? Operator: Elegant Error Propagation

The `?` operator is Rust's ergonomic way to propagate errors. It eliminates boilerplate while keeping error handling explicit.

## The Problem: Verbose Error Handling

Without `?`, propagating errors is verbose:

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let file_result = File::open("username.txt");

    let mut file = match file_result {
        Ok(f) => f,
        Err(e) => return Err(e),
    };

    let mut username = String::new();

    match file.read_to_string(&mut username) {
        Ok(_) => Ok(username),
        Err(e) => Err(e),
    }
}
```

## The Solution: The ? Operator

The `?` operator does exactly what the match expressions do:

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut file = File::open("username.txt")?;
    let mut username = String::new();
    file.read_to_string(&mut username)?;
    Ok(username)
}
```

Much cleaner! The `?` operator:
1. Returns the `Ok` value if successful
2. Returns early with the `Err` value if failed

## How ? Works

```rust
// This:
let file = File::open("file.txt")?;

// Is equivalent to:
let file = match File::open("file.txt") {
    Ok(f) => f,
    Err(e) => return Err(e.into()),  // Note: converts error type
};
```

## Chaining with ?

You can chain methods with `?`:

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username = String::new();
    File::open("username.txt")?.read_to_string(&mut username)?;
    Ok(username)
}

// Even shorter with fs::read_to_string:
fn read_username_shortest() -> Result<String, io::Error> {
    std::fs::read_to_string("username.txt")
}
```

## ? with Different Error Types

The `?` operator can convert between error types via the `From` trait:

```rust
use std::fs::File;
use std::io::{self, Read};
use std::num::ParseIntError;

#[derive(Debug)]
enum MyError {
    Io(io::Error),
    Parse(ParseIntError),
}

impl From<io::Error> for MyError {
    fn from(error: io::Error) -> Self {
        MyError::Io(error)
    }
}

impl From<ParseIntError> for MyError {
    fn from(error: ParseIntError) -> Self {
        MyError::Parse(error)
    }
}

fn read_and_parse() -> Result<i32, MyError> {
    let contents = std::fs::read_to_string("number.txt")?;  // io::Error -> MyError
    let number: i32 = contents.trim().parse()?;              // ParseIntError -> MyError
    Ok(number)
}
```

## ? with Option

The `?` operator also works with `Option`:

```rust
fn get_first_char(s: &str) -> Option<char> {
    s.lines().next()?.chars().next()
}

fn main() {
    println!("{:?}", get_first_char("hello\nworld"));  // Some('h')
    println!("{:?}", get_first_char(""));              // None
}
```

## Mixing Option and Result

You can convert between them:

```rust
fn find_and_parse(data: &str, key: &str) -> Result<i32, String> {
    // Option -> Result with ok_or
    let line = data
        .lines()
        .find(|line| line.starts_with(key))
        .ok_or(format!("Key '{}' not found", key))?;

    let value = line
        .split('=')
        .nth(1)
        .ok_or("Invalid format")?;

    value
        .trim()
        .parse()
        .map_err(|_| format!("Cannot parse '{}'", value))
}

fn main() {
    let data = "name=Alice\nage=30";

    println!("{:?}", find_and_parse(data, "age"));   // Ok(30)
    println!("{:?}", find_and_parse(data, "email")); // Err("Key 'email' not found")
}
```

## ? in main()

You can use `?` in main by returning Result:

```rust
use std::fs::File;
use std::io::{self, Read};

fn main() -> Result<(), io::Error> {
    let mut file = File::open("hello.txt")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    println!("Contents: {}", contents);
    Ok(())
}
```

The error will be printed if main returns `Err`.

## Multiple Error Types in main

```rust
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let contents = std::fs::read_to_string("number.txt")?;
    let number: i32 = contents.trim().parse()?;
    println!("Number: {}", number);
    Ok(())
}
```

`Box<dyn Error>` accepts any error type that implements the `Error` trait.

## Common Patterns with ?

### Pattern: Early return on error

```rust
fn process_file(path: &str) -> Result<(), io::Error> {
    let contents = std::fs::read_to_string(path)?;

    if contents.is_empty() {
        // Early return with our own error
        return Err(io::Error::new(io::ErrorKind::InvalidData, "file is empty"));
    }

    // Continue processing...
    Ok(())
}
```

### Pattern: Collect results

```rust
fn parse_all(strings: &[&str]) -> Result<Vec<i32>, std::num::ParseIntError> {
    strings
        .iter()
        .map(|s| s.parse::<i32>())
        .collect()  // Collects into Result<Vec<i32>, _>
}

fn main() {
    let valid = vec!["1", "2", "3"];
    println!("{:?}", parse_all(&valid));  // Ok([1, 2, 3])

    let invalid = vec!["1", "two", "3"];
    println!("{:?}", parse_all(&invalid));  // Err(ParseIntError...)
}
```

### Pattern: Try block (nightly)

```rust
// On nightly Rust, you can use try blocks:
#![feature(try_blocks)]

fn main() {
    let result: Result<i32, &str> = try {
        let x = some_function()?;
        let y = another_function()?;
        x + y
    };
}
```

## ? with Custom Types

Your types can work with `?` by implementing `Try` (unstable) or using `From`:

```rust
#[derive(Debug)]
struct AppError {
    message: String,
}

impl From<std::io::Error> for AppError {
    fn from(error: std::io::Error) -> Self {
        AppError {
            message: format!("IO error: {}", error),
        }
    }
}

impl From<std::num::ParseIntError> for AppError {
    fn from(error: std::num::ParseIntError) -> Self {
        AppError {
            message: format!("Parse error: {}", error),
        }
    }
}

fn load_config() -> Result<i32, AppError> {
    let content = std::fs::read_to_string("config.txt")?;  // Converts io::Error
    let value: i32 = content.trim().parse()?;               // Converts ParseIntError
    Ok(value)
}
```

## When Not to Use ?

Sometimes explicit matching is better:

```rust
use std::fs::File;
use std::io::ErrorKind;

fn open_or_create(path: &str) -> Result<File, std::io::Error> {
    // Here we want to handle NotFound specially
    match File::open(path) {
        Ok(file) => Ok(file),
        Err(error) if error.kind() == ErrorKind::NotFound => {
            File::create(path)
        }
        Err(error) => Err(error),
    }
}
```

## Comparison: match vs ?

```rust
// With match - explicit but verbose
fn with_match() -> Result<String, io::Error> {
    let mut file = match File::open("file.txt") {
        Ok(f) => f,
        Err(e) => return Err(e),
    };
    let mut s = String::new();
    match file.read_to_string(&mut s) {
        Ok(_) => Ok(s),
        Err(e) => Err(e),
    }
}

// With ? - concise and clear
fn with_question() -> Result<String, io::Error> {
    let mut file = File::open("file.txt")?;
    let mut s = String::new();
    file.read_to_string(&mut s)?;
    Ok(s)
}
```

## Key Takeaways

1. **? propagates errors** by returning early on Err
2. **? unwraps Ok values** so you can continue working
3. **? converts error types** via the From trait
4. **? works with both Result and Option**
5. **Use ? for linear error propagation** - match for branching
6. **main can return Result** to use ? at the top level
7. **Box<dyn Error>** accepts any error type in return position

In the next lesson, we'll learn to create custom error types for better error handling.
