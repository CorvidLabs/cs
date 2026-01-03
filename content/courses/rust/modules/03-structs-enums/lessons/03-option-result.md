---
title: Option and Result
order: 3
estimatedMinutes: 30
---

# Option and Result: Handling Absence and Errors

Rust doesn't have null. Instead, it uses two powerful enums: `Option` for values that might be absent, and `Result` for operations that might fail.

## The Problem with Null

In many languages, null causes runtime crashes:

```javascript
// JavaScript - crashes at runtime
let user = getUser(id);
console.log(user.name);  // TypeError if user is null
```

Rust solves this at compile time with `Option`.

## Option: Maybe a Value

The `Option` enum is defined in the standard library:

```rust
enum Option<T> {
    Some(T),
    None,
}
```

It's so common that `Option`, `Some`, and `None` are in the prelude - no import needed.

```rust
fn main() {
    let some_number: Option<i32> = Some(5);
    let no_number: Option<i32> = None;

    println!("{:?}", some_number);  // Some(5)
    println!("{:?}", no_number);    // None
}
```

## Why Option is Better Than Null

You can't use an `Option<T>` where a `T` is expected:

```rust
fn main() {
    let x: i32 = 5;
    let y: Option<i32> = Some(5);

    // let sum = x + y;  // ERROR! Can't add i32 and Option<i32>

    // You must handle the None case
    let sum = match y {
        Some(val) => x + val,
        None => x,
    };

    println!("Sum: {}", sum);
}
```

The compiler forces you to handle the absence case.

## Common Option Methods

```rust
fn main() {
    let some_val: Option<i32> = Some(42);
    let no_val: Option<i32> = None;

    // is_some() and is_none()
    println!("some_val is some: {}", some_val.is_some());  // true
    println!("no_val is none: {}", no_val.is_none());      // true

    // unwrap() - panics if None (use carefully!)
    println!("Unwrapped: {}", some_val.unwrap());  // 42
    // no_val.unwrap();  // Would panic!

    // unwrap_or() - provide a default
    println!("With default: {}", no_val.unwrap_or(0));  // 0

    // unwrap_or_else() - compute default lazily
    println!("Computed: {}", no_val.unwrap_or_else(|| 100));  // 100

    // expect() - panic with custom message
    println!("Expected: {}", some_val.expect("should have a value"));

    // map() - transform the inner value
    let doubled: Option<i32> = some_val.map(|x| x * 2);
    println!("Doubled: {:?}", doubled);  // Some(84)

    // and_then() - chain operations that return Option
    let result = some_val.and_then(|x| Some(x.to_string()));
    println!("Stringified: {:?}", result);  // Some("42")
}
```

## Option in Practice

```rust
fn find_user(id: u32) -> Option<String> {
    match id {
        1 => Some(String::from("Alice")),
        2 => Some(String::from("Bob")),
        _ => None,
    }
}

fn main() {
    // Pattern matching
    match find_user(1) {
        Some(name) => println!("Found user: {}", name),
        None => println!("User not found"),
    }

    // if let for single variant
    if let Some(name) = find_user(2) {
        println!("Found: {}", name);
    }

    // Method chaining
    let greeting = find_user(1)
        .map(|name| format!("Hello, {}!", name))
        .unwrap_or(String::from("Hello, guest!"));

    println!("{}", greeting);
}
```

## Result: Success or Failure

For operations that can fail, use `Result`:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

```rust
use std::fs::File;
use std::io::Error;

fn main() {
    let file_result: Result<File, Error> = File::open("hello.txt");

    match file_result {
        Ok(file) => println!("File opened: {:?}", file),
        Err(error) => println!("Failed to open: {}", error),
    }
}
```

## Common Result Methods

```rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("division by zero"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    let good = divide(10, 2);
    let bad = divide(10, 0);

    // is_ok() and is_err()
    println!("good is ok: {}", good.is_ok());   // true
    println!("bad is err: {}", bad.is_err());   // true

    // unwrap() and expect() - panic on Err
    println!("Good result: {}", good.unwrap());  // 5

    // unwrap_or() - provide default on Err
    println!("Bad with default: {}", bad.unwrap_or(-1));  // -1

    // map() - transform Ok value
    let doubled = divide(10, 2).map(|x| x * 2);
    println!("Doubled: {:?}", doubled);  // Ok(10)

    // map_err() - transform Err value
    let new_err = divide(10, 0).map_err(|e| format!("Error: {}", e));
    println!("New error: {:?}", new_err);

    // and_then() - chain operations
    let result = divide(20, 2).and_then(|x| divide(x, 2));
    println!("Chained: {:?}", result);  // Ok(5)
}
```

## The ? Operator

The `?` operator is shorthand for propagating errors:

```rust
use std::fs::File;
use std::io::{self, Read};

// Without ? operator
fn read_file_verbose(path: &str) -> Result<String, io::Error> {
    let file = match File::open(path) {
        Ok(f) => f,
        Err(e) => return Err(e),
    };

    let mut contents = String::new();
    match file.read_to_string(&mut contents) {
        Ok(_) => Ok(contents),
        Err(e) => Err(e),
    }
}

// With ? operator - much cleaner!
fn read_file(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?;  // Returns early if Err
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}
```

The `?` operator:
1. If `Ok(value)`, unwraps and continues
2. If `Err(e)`, returns immediately with the error

## ? with Option

The `?` operator also works with `Option`:

```rust
fn get_initial(name: Option<&str>) -> Option<char> {
    let name = name?;  // Returns None if name is None
    name.chars().next()
}

fn main() {
    println!("{:?}", get_initial(Some("Alice")));  // Some('A')
    println!("{:?}", get_initial(None));           // None
}
```

## Converting Between Option and Result

```rust
fn main() {
    // Option to Result with ok_or()
    let opt: Option<i32> = Some(42);
    let res: Result<i32, &str> = opt.ok_or("no value");
    println!("{:?}", res);  // Ok(42)

    let opt: Option<i32> = None;
    let res: Result<i32, &str> = opt.ok_or("no value");
    println!("{:?}", res);  // Err("no value")

    // Result to Option with ok()
    let res: Result<i32, &str> = Ok(42);
    let opt: Option<i32> = res.ok();
    println!("{:?}", opt);  // Some(42)

    let res: Result<i32, &str> = Err("error");
    let opt: Option<i32> = res.ok();
    println!("{:?}", opt);  // None
}
```

## Combinators for Cleaner Code

```rust
fn get_user_email(user_id: u32) -> Option<String> {
    // Simulated database lookups
    get_user(user_id)
        .and_then(|user| get_email(&user))
        .map(|email| email.to_lowercase())
}

fn get_user(_id: u32) -> Option<User> {
    Some(User { name: String::from("Alice") })
}

fn get_email(user: &User) -> Option<String> {
    Some(format!("{}@example.com", user.name))
}

struct User {
    name: String,
}
```

## Pattern: Early Return with ?

```rust
fn process_data(data: Option<String>) -> Result<usize, String> {
    // Convert Option to Result, then use ?
    let data = data.ok_or("no data provided")?;

    if data.is_empty() {
        return Err(String::from("data is empty"));
    }

    Ok(data.len())
}

fn main() {
    println!("{:?}", process_data(Some(String::from("hello"))));  // Ok(5)
    println!("{:?}", process_data(None));  // Err("no data provided")
    println!("{:?}", process_data(Some(String::new())));  // Err("data is empty")
}
```

## Best Practices

### Don't Panic in Library Code

```rust
// Bad - panics on None
fn get_config_bad(key: &str) -> String {
    get_env_var(key).unwrap()  // Panics!
}

// Good - returns Result
fn get_config(key: &str) -> Result<String, ConfigError> {
    get_env_var(key).ok_or(ConfigError::MissingKey(key.to_string()))
}
```

### Use unwrap() Only When You're Certain

```rust
// OK - we just constructed it, we know it's Some
let items = vec![1, 2, 3];
let first = items.first().unwrap();  // Safe, we know it's not empty

// Better - use expect with explanation
let first = items.first().expect("items is non-empty");
```

## Key Takeaways

1. **Option replaces null** - forces handling of absent values
2. **Result handles errors** - success or failure, explicitly
3. **Use ? for propagation** - cleaner than match chains
4. **map() transforms inner values** - without unwrapping
5. **and_then() chains operations** - for dependent computations
6. **unwrap_or() provides defaults** - for fallback values
7. **Avoid unwrap() in libraries** - return Result instead

In the next lesson, we'll master pattern matching - the key to working effectively with Option, Result, and all enums.
