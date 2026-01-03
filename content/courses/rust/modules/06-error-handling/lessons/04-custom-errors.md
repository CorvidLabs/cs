---
title: Custom Error Types
order: 4
estimatedMinutes: 25
---

# Custom Error Types

While Rust's standard library provides many error types, you'll often need custom errors for your applications. Well-designed error types make your code more maintainable and your APIs more user-friendly.

## The Error Trait

Rust's `std::error::Error` trait defines what an error should provide:

```rust
pub trait Error: Debug + Display {
    fn source(&self) -> Option<&(dyn Error + 'static)> { None }
}
```

An error must:
- Implement `Debug` (for developers)
- Implement `Display` (for users)
- Optionally provide a source error (for error chains)

## Creating a Simple Error Enum

The most common approach is an enum with variants for each error case:

```rust
use std::fmt;

#[derive(Debug)]
enum ValidationError {
    TooShort { min: usize, actual: usize },
    TooLong { max: usize, actual: usize },
    InvalidCharacter(char),
    Empty,
}

impl fmt::Display for ValidationError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ValidationError::TooShort { min, actual } => {
                write!(f, "Input too short: minimum {} chars, got {}", min, actual)
            }
            ValidationError::TooLong { max, actual } => {
                write!(f, "Input too long: maximum {} chars, got {}", max, actual)
            }
            ValidationError::InvalidCharacter(c) => {
                write!(f, "Invalid character: '{}'", c)
            }
            ValidationError::Empty => {
                write!(f, "Input cannot be empty")
            }
        }
    }
}

impl std::error::Error for ValidationError {}
```

## Using Your Error Type

```rust
fn validate_username(username: &str) -> Result<(), ValidationError> {
    if username.is_empty() {
        return Err(ValidationError::Empty);
    }

    if username.len() < 3 {
        return Err(ValidationError::TooShort {
            min: 3,
            actual: username.len(),
        });
    }

    if username.len() > 20 {
        return Err(ValidationError::TooLong {
            max: 20,
            actual: username.len(),
        });
    }

    for c in username.chars() {
        if !c.is_alphanumeric() && c != '_' {
            return Err(ValidationError::InvalidCharacter(c));
        }
    }

    Ok(())
}

fn main() {
    match validate_username("ab") {
        Ok(()) => println!("Username is valid"),
        Err(e) => println!("Validation failed: {}", e),
    }
}
```

## Error Wrapping

Often your errors wrap other errors. Use the `source()` method:

```rust
use std::{fmt, io, num::ParseIntError};

#[derive(Debug)]
enum ConfigError {
    Io(io::Error),
    Parse(ParseIntError),
    MissingField(String),
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ConfigError::Io(e) => write!(f, "IO error: {}", e),
            ConfigError::Parse(e) => write!(f, "Parse error: {}", e),
            ConfigError::MissingField(field) => write!(f, "Missing field: {}", field),
        }
    }
}

impl std::error::Error for ConfigError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            ConfigError::Io(e) => Some(e),
            ConfigError::Parse(e) => Some(e),
            ConfigError::MissingField(_) => None,
        }
    }
}
```

## Implementing From for Error Conversion

Enable automatic conversion with `?`:

```rust
impl From<io::Error> for ConfigError {
    fn from(err: io::Error) -> ConfigError {
        ConfigError::Io(err)
    }
}

impl From<ParseIntError> for ConfigError {
    fn from(err: ParseIntError) -> ConfigError {
        ConfigError::Parse(err)
    }
}

fn read_port() -> Result<u16, ConfigError> {
    let content = std::fs::read_to_string("config.txt")?;  // io::Error -> ConfigError
    let port: u16 = content.trim().parse()?;               // ParseIntError -> ConfigError
    Ok(port)
}
```

## The thiserror Crate

The `thiserror` crate reduces boilerplate significantly:

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum DataError {
    #[error("IO error occurred")]
    Io(#[from] std::io::Error),

    #[error("Failed to parse: {0}")]
    Parse(#[from] std::num::ParseIntError),

    #[error("Invalid data: {message}")]
    Invalid { message: String },

    #[error("Field '{0}' not found")]
    MissingField(String),
}
```

This derives `Display`, `Error`, and `From` implementations automatically.

## Error Handling Strategies

### For Libraries

- Define specific error types
- Don't use `anyhow` (it erases type information)
- Document when functions can fail
- Implement `Error` and `From` traits

```rust
/// Errors that can occur during parsing.
#[derive(Debug)]
pub enum ParseError {
    InvalidSyntax { line: usize, message: String },
    UnexpectedToken(String),
    EndOfInput,
}
```

### For Applications

- Consider `anyhow` for convenience
- Add context to errors
- Handle errors at appropriate levels

```rust
use anyhow::{Context, Result};

fn main() -> Result<()> {
    let config = load_config()
        .context("Failed to load configuration")?;

    run_server(&config)
        .context("Server encountered an error")?;

    Ok(())
}
```

## Error Context Pattern

Add context without losing the original error:

```rust
use std::fs;
use std::io;

fn read_config(path: &str) -> Result<String, ConfigError> {
    fs::read_to_string(path)
        .map_err(|e| ConfigError::ReadFailed {
            path: path.to_string(),
            source: e,
        })
}

#[derive(Debug)]
enum ConfigError {
    ReadFailed { path: String, source: io::Error },
}
```

## Key Takeaways

1. Implement `Debug`, `Display`, and `Error` for custom errors
2. Use enums to represent different error cases
3. Implement `From` to enable `?` operator conversion
4. Use `source()` to chain errors
5. Consider `thiserror` to reduce boilerplate
6. Libraries should have specific error types; applications can use `anyhow`
7. Add context to errors to aid debugging

You now have a complete understanding of Rust's error handling system!
