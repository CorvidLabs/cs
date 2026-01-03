---
title: Custom Error Types
order: 3
estimatedMinutes: 30
---

# Custom Error Types

For production code, you'll want to define custom error types that provide clear, actionable information about what went wrong.

## Why Custom Errors?

Generic errors like `String` or `Box<dyn Error>` lose information:

```rust
// Bad: Loses error context
fn load_config(path: &str) -> Result<Config, String> {
    let content = std::fs::read_to_string(path)
        .map_err(|e| e.to_string())?;  // Just a string now
    parse_config(&content)
        .map_err(|e| e.to_string())?;  // Lost the original error type
}

// Good: Preserves error information
fn load_config(path: &str) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;  // Converts to ConfigError
    parse_config(&content)?;
    Ok(config)
}
```

## Basic Error Enum

```rust
use std::fmt;

#[derive(Debug)]
enum MathError {
    DivisionByZero,
    NegativeSquareRoot,
    Overflow,
}

impl fmt::Display for MathError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            MathError::DivisionByZero => write!(f, "division by zero"),
            MathError::NegativeSquareRoot => write!(f, "square root of negative number"),
            MathError::Overflow => write!(f, "arithmetic overflow"),
        }
    }
}

impl std::error::Error for MathError {}

fn divide(a: f64, b: f64) -> Result<f64, MathError> {
    if b == 0.0 {
        Err(MathError::DivisionByZero)
    } else {
        Ok(a / b)
    }
}

fn main() {
    match divide(10.0, 0.0) {
        Ok(result) => println!("Result: {}", result),
        Err(e) => println!("Error: {}", e),
    }
}
```

## Errors with Data

Include context in your errors:

```rust
use std::fmt;

#[derive(Debug)]
enum FileError {
    NotFound { path: String },
    PermissionDenied { path: String },
    InvalidFormat { path: String, details: String },
}

impl fmt::Display for FileError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            FileError::NotFound { path } =>
                write!(f, "file not found: {}", path),
            FileError::PermissionDenied { path } =>
                write!(f, "permission denied: {}", path),
            FileError::InvalidFormat { path, details } =>
                write!(f, "invalid format in {}: {}", path, details),
        }
    }
}

impl std::error::Error for FileError {}
```

## Wrapping Other Errors

Use `#[from]` pattern to wrap underlying errors:

```rust
use std::fmt;
use std::io;
use std::num::ParseIntError;

#[derive(Debug)]
enum AppError {
    Io(io::Error),
    Parse(ParseIntError),
    Config { message: String },
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::Io(e) => write!(f, "IO error: {}", e),
            AppError::Parse(e) => write!(f, "Parse error: {}", e),
            AppError::Config { message } => write!(f, "Config error: {}", message),
        }
    }
}

impl std::error::Error for AppError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            AppError::Io(e) => Some(e),
            AppError::Parse(e) => Some(e),
            AppError::Config { .. } => None,
        }
    }
}

impl From<io::Error> for AppError {
    fn from(error: io::Error) -> Self {
        AppError::Io(error)
    }
}

impl From<ParseIntError> for AppError {
    fn from(error: ParseIntError) -> Self {
        AppError::Parse(error)
    }
}

fn read_number(path: &str) -> Result<i32, AppError> {
    let content = std::fs::read_to_string(path)?;  // io::Error -> AppError
    let number: i32 = content.trim().parse()?;      // ParseIntError -> AppError
    Ok(number)
}
```

## The Error Trait

The `std::error::Error` trait provides:

```rust
pub trait Error: Debug + Display {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        None
    }
}
```

Implementing `source()` allows error chaining:

```rust
fn print_error_chain(error: &dyn std::error::Error) {
    println!("Error: {}", error);
    let mut source = error.source();
    while let Some(e) = source {
        println!("Caused by: {}", e);
        source = e.source();
    }
}
```

## Error Struct Pattern

For simpler cases, use a struct:

```rust
use std::fmt;

#[derive(Debug)]
struct ValidationError {
    field: String,
    message: String,
}

impl ValidationError {
    fn new(field: &str, message: &str) -> Self {
        ValidationError {
            field: field.to_string(),
            message: message.to_string(),
        }
    }
}

impl fmt::Display for ValidationError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "validation error for '{}': {}", self.field, self.message)
    }
}

impl std::error::Error for ValidationError {}

fn validate_email(email: &str) -> Result<(), ValidationError> {
    if !email.contains('@') {
        return Err(ValidationError::new("email", "must contain @"));
    }
    Ok(())
}
```

## Multiple Error Types with Box<dyn Error>

For quick prototyping or when mixing many error types:

```rust
use std::error::Error;

fn do_something() -> Result<(), Box<dyn Error>> {
    let file = std::fs::read_to_string("config.txt")?;
    let number: i32 = file.trim().parse()?;
    println!("Number: {}", number);
    Ok(())
}

fn main() {
    if let Err(e) = do_something() {
        println!("Error: {}", e);
    }
}
```

## Creating Errors Inline

For quick errors without defining a type:

```rust
use std::io::{Error, ErrorKind};

fn check_positive(n: i32) -> Result<i32, Error> {
    if n < 0 {
        Err(Error::new(ErrorKind::InvalidInput, "number must be positive"))
    } else {
        Ok(n)
    }
}
```

## Error Handling Best Practices

### 1. Be specific

```rust
// Bad: Generic string error
fn parse_config(s: &str) -> Result<Config, String> { ... }

// Good: Specific error type
fn parse_config(s: &str) -> Result<Config, ConfigError> { ... }
```

### 2. Include context

```rust
// Bad: No context
return Err(ParseError::InvalidSyntax);

// Good: Include context
return Err(ParseError::InvalidSyntax {
    line: 42,
    column: 10,
    found: "foo",
    expected: "bar",
});
```

### 3. Implement Display meaningfully

```rust
impl fmt::Display for ParseError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ParseError::InvalidSyntax { line, column, found, expected } =>
                write!(f, "syntax error at {}:{}: expected '{}', found '{}'",
                    line, column, expected, found),
        }
    }
}
```

### 4. Preserve error sources

```rust
impl std::error::Error for AppError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            AppError::Io(e) => Some(e),
            AppError::Parse(e) => Some(e),
            _ => None,
        }
    }
}
```

## Common Error Patterns

### Pattern: Error with backtrace (requires nightly or external crate)

```rust
// With anyhow crate
use anyhow::{Context, Result};

fn load_config() -> Result<Config> {
    let path = "config.toml";
    let content = std::fs::read_to_string(path)
        .with_context(|| format!("failed to read {}", path))?;

    toml::from_str(&content)
        .with_context(|| format!("failed to parse {}", path))
}
```

### Pattern: Recoverable vs Fatal errors

```rust
#[derive(Debug)]
enum ProcessError {
    // Recoverable: can retry or use default
    Timeout { duration_ms: u64 },
    ResourceBusy,

    // Fatal: cannot recover
    InvalidConfiguration { message: String },
    CorruptedData,
}

impl ProcessError {
    fn is_recoverable(&self) -> bool {
        matches!(self, ProcessError::Timeout { .. } | ProcessError::ResourceBusy)
    }
}
```

## Key Takeaways

1. **Define custom error types** for clear, actionable errors
2. **Use enums for variant errors**, structs for uniform errors
3. **Implement Display** for human-readable messages
4. **Implement Error::source** for error chaining
5. **Implement From** for ? operator conversion
6. **Include context** in error variants
7. **Use Box<dyn Error>** for prototyping, custom types for production

In the next lesson, we'll explore common error handling patterns and strategies.
