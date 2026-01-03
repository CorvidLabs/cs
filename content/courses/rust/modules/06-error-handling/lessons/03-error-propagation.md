---
title: Error Propagation
order: 3
estimatedMinutes: 20
---

# Error Propagation

When a function calls something that might fail, you often want to pass that error up to the caller rather than handling it locally. Rust makes this elegant with the `?` operator.

## The Problem: Nested Error Handling

Without error propagation, code becomes deeply nested:

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let file = File::open("username.txt");

    let mut file = match file {
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

This pattern - return early on error, continue on success - is extremely common.

## The `?` Operator

The `?` operator does exactly this pattern automatically:

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

When `?` is applied to a `Result`:
- If `Ok(value)`, it unwraps and returns `value`
- If `Err(e)`, it returns early with `Err(e)`

## Chaining with `?`

You can chain multiple `?` operations:

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username = String::new();
    File::open("username.txt")?.read_to_string(&mut username)?;
    Ok(username)
}
```

Or even simpler:

```rust
use std::fs;
use std::io;

fn read_username_from_file() -> Result<String, io::Error> {
    fs::read_to_string("username.txt")
}
```

## Error Conversion with `?`

The `?` operator can convert error types using the `From` trait:

```rust
use std::fs::File;
use std::io::{self, Read};
use std::num::ParseIntError;

#[derive(Debug)]
enum ConfigError {
    IoError(io::Error),
    ParseError(ParseIntError),
}

impl From<io::Error> for ConfigError {
    fn from(err: io::Error) -> ConfigError {
        ConfigError::IoError(err)
    }
}

impl From<ParseIntError> for ConfigError {
    fn from(err: ParseIntError) -> ConfigError {
        ConfigError::ParseError(err)
    }
}

fn read_config() -> Result<i32, ConfigError> {
    let content = std::fs::read_to_string("config.txt")?;  // io::Error -> ConfigError
    let value: i32 = content.trim().parse()?;              // ParseIntError -> ConfigError
    Ok(value)
}
```

The `?` operator automatically calls `.into()` on errors, converting them to the function's return type.

## Using `?` with Option

The `?` operator also works with `Option`:

```rust
fn get_first_char(text: &str) -> Option<char> {
    let first = text.chars().next()?;  // Returns None if empty
    Some(first)
}

fn get_middle_char(text: &str) -> Option<char> {
    let len = text.len();
    if len == 0 {
        return None;
    }
    text.chars().nth(len / 2)
}
```

## `?` in main()

The `main` function can return `Result`:

```rust
use std::fs::File;
use std::io::{self, Read};

fn main() -> Result<(), io::Error> {
    let mut file = File::open("hello.txt")?;
    let mut content = String::new();
    file.read_to_string(&mut content)?;
    println!("Content: {}", content);
    Ok(())
}
```

If an error occurs, it's printed to stderr with a non-zero exit code.

## When to Propagate vs Handle

Propagate when:
- The current function cannot meaningfully handle the error
- The caller needs to decide how to handle it
- You're writing library code

Handle locally when:
- You can recover or provide a default
- The error is expected and has a clear resolution
- You're at the application's top level

```rust
// Propagate: Let caller decide
fn parse_config(path: &str) -> Result<Config, ConfigError> {
    let content = fs::read_to_string(path)?;
    parse_content(&content)
}

// Handle locally: We have a reasonable default
fn get_port() -> u16 {
    std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8080)
}
```

## The `anyhow` Pattern (Preview)

For applications (not libraries), many use `anyhow` for simplified error handling:

```rust
// With anyhow crate
use anyhow::Result;

fn main() -> Result<()> {
    let config = read_config()?;
    let data = fetch_data(&config)?;
    process(data)?;
    Ok(())
}
```

## Key Takeaways

1. `?` propagates errors to the caller, returning early on `Err`
2. It works with both `Result` and `Option`
3. Error types are automatically converted via the `From` trait
4. Chain multiple `?` operations for clean, readable code
5. `main()` can return `Result` for automatic error printing
6. Propagate when you can't handle; handle when you have a good solution

Next, we'll learn how to create custom error types for your own applications.
