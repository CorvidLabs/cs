---
title: Error Handling Patterns
order: 4
estimatedMinutes: 30
---

# Error Handling Patterns

Beyond the basics, there are established patterns for handling errors effectively in real-world Rust applications.

## Pattern 1: Fallible Constructors

Use `Result` for constructors that can fail:

```rust
struct EmailAddress {
    address: String,
}

impl EmailAddress {
    fn new(address: &str) -> Result<EmailAddress, ValidationError> {
        if !address.contains('@') {
            return Err(ValidationError::new("email", "must contain @"));
        }
        if address.len() < 5 {
            return Err(ValidationError::new("email", "too short"));
        }
        Ok(EmailAddress {
            address: address.to_string(),
        })
    }
}

fn main() {
    match EmailAddress::new("user@example.com") {
        Ok(email) => println!("Valid email: {}", email.address),
        Err(e) => println!("Invalid: {}", e),
    }
}
```

## Pattern 2: Builder with Validation

Collect all errors before failing:

```rust
#[derive(Debug)]
struct User {
    name: String,
    email: String,
    age: u8,
}

#[derive(Debug, Default)]
struct UserBuilder {
    name: Option<String>,
    email: Option<String>,
    age: Option<u8>,
    errors: Vec<String>,
}

impl UserBuilder {
    fn new() -> Self {
        Self::default()
    }

    fn name(mut self, name: &str) -> Self {
        if name.is_empty() {
            self.errors.push("name cannot be empty".to_string());
        } else {
            self.name = Some(name.to_string());
        }
        self
    }

    fn email(mut self, email: &str) -> Self {
        if !email.contains('@') {
            self.errors.push("email must contain @".to_string());
        } else {
            self.email = Some(email.to_string());
        }
        self
    }

    fn age(mut self, age: u8) -> Self {
        if age < 18 {
            self.errors.push("must be 18 or older".to_string());
        } else {
            self.age = Some(age);
        }
        self
    }

    fn build(self) -> Result<User, Vec<String>> {
        if !self.errors.is_empty() {
            return Err(self.errors);
        }

        Ok(User {
            name: self.name.ok_or_else(|| vec!["name required".to_string()])?,
            email: self.email.ok_or_else(|| vec!["email required".to_string()])?,
            age: self.age.ok_or_else(|| vec!["age required".to_string()])?,
        })
    }
}

fn main() {
    let result = UserBuilder::new()
        .name("")
        .email("invalid")
        .age(15)
        .build();

    match result {
        Ok(user) => println!("User: {:?}", user),
        Err(errors) => {
            println!("Validation errors:");
            for e in errors {
                println!("  - {}", e);
            }
        }
    }
}
```

## Pattern 3: Error Context

Add context when propagating errors:

```rust
use std::io;
use std::path::Path;

#[derive(Debug)]
struct ContextError {
    context: String,
    source: io::Error,
}

impl std::fmt::Display for ContextError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.context, self.source)
    }
}

impl std::error::Error for ContextError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        Some(&self.source)
    }
}

trait ResultExt<T> {
    fn with_context<S: Into<String>>(self, context: S) -> Result<T, ContextError>;
}

impl<T> ResultExt<T> for Result<T, io::Error> {
    fn with_context<S: Into<String>>(self, context: S) -> Result<T, ContextError> {
        self.map_err(|source| ContextError {
            context: context.into(),
            source,
        })
    }
}

fn read_config(path: &Path) -> Result<String, ContextError> {
    std::fs::read_to_string(path)
        .with_context(format!("failed to read config from {:?}", path))
}
```

## Pattern 4: Retry on Transient Errors

```rust
use std::time::Duration;
use std::thread;

fn retry<T, E, F>(mut operation: F, max_attempts: u32, delay: Duration) -> Result<T, E>
where
    F: FnMut() -> Result<T, E>,
    E: std::fmt::Display,
{
    let mut attempts = 0;

    loop {
        match operation() {
            Ok(value) => return Ok(value),
            Err(e) => {
                attempts += 1;
                if attempts >= max_attempts {
                    return Err(e);
                }
                println!("Attempt {} failed: {}. Retrying...", attempts, e);
                thread::sleep(delay);
            }
        }
    }
}

fn flaky_operation() -> Result<String, String> {
    static mut COUNTER: u32 = 0;
    unsafe {
        COUNTER += 1;
        if COUNTER < 3 {
            Err(format!("Temporary failure #{}", COUNTER))
        } else {
            Ok("Success!".to_string())
        }
    }
}

fn main() {
    let result = retry(flaky_operation, 5, Duration::from_millis(100));
    println!("Result: {:?}", result);
}
```

## Pattern 5: Default on Error

```rust
fn get_port() -> u16 {
    std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8080)  // Default port
}

fn get_config_value(key: &str, default: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| default.to_string())
}

fn main() {
    let port = get_port();
    let host = get_config_value("HOST", "localhost");
    println!("Server at {}:{}", host, port);
}
```

## Pattern 6: Collect All Errors

When processing multiple items:

```rust
#[derive(Debug)]
struct ItemError {
    index: usize,
    message: String,
}

fn process_items(items: &[&str]) -> Result<Vec<i32>, Vec<ItemError>> {
    let mut results = Vec::new();
    let mut errors = Vec::new();

    for (index, item) in items.iter().enumerate() {
        match item.parse::<i32>() {
            Ok(n) => results.push(n),
            Err(_) => errors.push(ItemError {
                index,
                message: format!("'{}' is not a valid number", item),
            }),
        }
    }

    if errors.is_empty() {
        Ok(results)
    } else {
        Err(errors)
    }
}

fn main() {
    let items = vec!["1", "two", "3", "four", "5"];

    match process_items(&items) {
        Ok(numbers) => println!("Parsed: {:?}", numbers),
        Err(errors) => {
            println!("Errors:");
            for e in errors {
                println!("  [{}]: {}", e.index, e.message);
            }
        }
    }
}
```

## Pattern 7: Error Recovery Strategies

```rust
enum RecoveryAction {
    Retry,
    UseDefault,
    Skip,
    Abort,
}

fn determine_recovery(error: &AppError) -> RecoveryAction {
    match error {
        AppError::Timeout => RecoveryAction::Retry,
        AppError::NotFound => RecoveryAction::UseDefault,
        AppError::InvalidData => RecoveryAction::Skip,
        AppError::Fatal(_) => RecoveryAction::Abort,
    }
}

fn process_with_recovery(items: Vec<Item>) -> Result<Vec<Output>, AppError> {
    let mut results = Vec::new();

    for item in items {
        match process_item(&item) {
            Ok(output) => results.push(output),
            Err(e) => match determine_recovery(&e) {
                RecoveryAction::Retry => {
                    // Retry logic
                    results.push(process_item(&item)?);
                }
                RecoveryAction::UseDefault => {
                    results.push(Output::default());
                }
                RecoveryAction::Skip => {
                    continue;
                }
                RecoveryAction::Abort => {
                    return Err(e);
                }
            },
        }
    }

    Ok(results)
}
```

## Pattern 8: Typed Error Layers

Separate errors by layer:

```rust
// Database layer errors
#[derive(Debug)]
enum DbError {
    ConnectionFailed(String),
    QueryFailed(String),
    NotFound,
}

// Service layer errors
#[derive(Debug)]
enum ServiceError {
    Database(DbError),
    Validation(String),
    NotAuthorized,
}

// API layer errors
#[derive(Debug)]
enum ApiError {
    Service(ServiceError),
    BadRequest(String),
    InternalError,
}

impl From<DbError> for ServiceError {
    fn from(e: DbError) -> Self {
        ServiceError::Database(e)
    }
}

impl From<ServiceError> for ApiError {
    fn from(e: ServiceError) -> Self {
        ApiError::Service(e)
    }
}

// Usage: errors propagate up the layers
fn api_handler() -> Result<Response, ApiError> {
    let user = service_get_user()?;  // ServiceError -> ApiError
    Ok(Response::ok(user))
}

fn service_get_user() -> Result<User, ServiceError> {
    let user = db_find_user()?;  // DbError -> ServiceError
    Ok(user)
}
```

## Pattern 9: Early Return for Preconditions

```rust
fn process_order(order: &Order) -> Result<Receipt, OrderError> {
    // Check preconditions early
    if order.items.is_empty() {
        return Err(OrderError::EmptyOrder);
    }

    if order.total() <= 0.0 {
        return Err(OrderError::InvalidTotal(order.total()));
    }

    if !order.customer.is_valid() {
        return Err(OrderError::InvalidCustomer);
    }

    // Main processing logic
    let receipt = create_receipt(order)?;
    send_confirmation(&order.customer, &receipt)?;

    Ok(receipt)
}
```

## Pattern 10: Graceful Degradation

```rust
struct Config {
    primary_db: String,
    fallback_db: String,
    cache_enabled: bool,
}

fn get_data(key: &str, config: &Config) -> Data {
    // Try cache first
    if config.cache_enabled {
        if let Ok(data) = cache_get(key) {
            return data;
        }
    }

    // Try primary database
    match db_query(&config.primary_db, key) {
        Ok(data) => {
            // Update cache on success
            let _ = cache_set(key, &data);
            return data;
        }
        Err(e) => {
            log::warn!("Primary DB failed: {}", e);
        }
    }

    // Fall back to secondary database
    match db_query(&config.fallback_db, key) {
        Ok(data) => data,
        Err(e) => {
            log::error!("Fallback DB also failed: {}", e);
            Data::default()  // Return default as last resort
        }
    }
}
```

## Key Takeaways

1. **Use fallible constructors** for types that can fail to construct
2. **Collect all errors** when validating multiple fields
3. **Add context** when propagating errors up the stack
4. **Implement retry logic** for transient errors
5. **Provide sensible defaults** when errors are recoverable
6. **Layer your errors** by application layer
7. **Check preconditions early** for clear error paths
8. **Plan for graceful degradation** in critical paths

You've completed the error handling module! These patterns will help you write robust, maintainable Rust code. Next, we'll explore concurrency - one of Rust's most powerful features.
