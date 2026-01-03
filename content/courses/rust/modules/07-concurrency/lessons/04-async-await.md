---
title: Introduction to Async/Await
order: 4
estimatedMinutes: 25
---

# Introduction to Async/Await

Async programming lets you write concurrent code that can handle many tasks efficiently without dedicating a thread to each one. This is especially useful for I/O-bound operations like network requests.

## The Problem with Threads

Threads are expensive:
- Each thread uses significant memory (stack space)
- Context switching has overhead
- Not practical for thousands of concurrent connections

Async allows many tasks to share fewer threads.

## Async Functions

Declare an async function with `async fn`:

```rust
async fn fetch_data() -> String {
    // Simulate async work
    String::from("data")
}
```

Async functions return a `Future` - a value representing work that will complete later.

## The Future Trait

A `Future` is something that will produce a value:

```rust
pub trait Future {
    type Output;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}

pub enum Poll<T> {
    Ready(T),
    Pending,
}
```

You rarely implement `Future` directly - `async fn` handles this.

## Await

Use `.await` to wait for a future to complete:

```rust
async fn process() {
    let data = fetch_data().await;  // Wait for fetch_data to complete
    println!("Got: {}", data);
}
```

`.await` yields control, allowing other tasks to run while waiting.

## Async Runtimes

Futures don't run themselves - you need a runtime. Popular options:

- **Tokio**: Full-featured, production-grade
- **async-std**: std-like API
- **smol**: Minimal and simple

Example with Tokio:

```rust
// In Cargo.toml: tokio = { version = "1", features = ["full"] }

use tokio::time::{sleep, Duration};

async fn say_hello() {
    println!("Hello");
    sleep(Duration::from_secs(1)).await;
    println!("World");
}

#[tokio::main]
async fn main() {
    say_hello().await;
}
```

## Concurrent Execution

Run futures concurrently with `join!`:

```rust
use tokio::time::{sleep, Duration};

async fn task_one() -> u32 {
    sleep(Duration::from_secs(1)).await;
    1
}

async fn task_two() -> u32 {
    sleep(Duration::from_secs(1)).await;
    2
}

#[tokio::main]
async fn main() {
    // Run both tasks concurrently
    let (a, b) = tokio::join!(task_one(), task_two());
    println!("Results: {}, {}", a, b);
    // Takes ~1 second, not 2
}
```

## Spawning Tasks

Create independent tasks with `spawn`:

```rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    let handle = tokio::spawn(async {
        sleep(Duration::from_millis(100)).await;
        42
    });

    // Do other work...

    let result = handle.await.unwrap();
    println!("Task returned: {}", result);
}
```

## Select: Racing Futures

Use `select!` to wait for the first of multiple futures:

```rust
use tokio::time::{sleep, Duration};

async fn slow_operation() -> &'static str {
    sleep(Duration::from_secs(10)).await;
    "completed"
}

#[tokio::main]
async fn main() {
    tokio::select! {
        result = slow_operation() => {
            println!("Operation completed: {}", result);
        }
        _ = sleep(Duration::from_secs(1)) => {
            println!("Timeout!");
        }
    }
}
```

## Async Traits

Async methods in traits require special handling. Use the `async_trait` crate:

```rust
use async_trait::async_trait;

#[async_trait]
trait DataStore {
    async fn get(&self, key: &str) -> Option<String>;
    async fn set(&self, key: &str, value: String);
}

struct MemoryStore;

#[async_trait]
impl DataStore for MemoryStore {
    async fn get(&self, _key: &str) -> Option<String> {
        Some(String::from("value"))
    }

    async fn set(&self, _key: &str, _value: String) {
        // Store the value
    }
}
```

## Error Handling in Async

Combine async with Result:

```rust
use std::io;

async fn read_file(path: &str) -> io::Result<String> {
    tokio::fs::read_to_string(path).await
}

#[tokio::main]
async fn main() -> io::Result<()> {
    let content = read_file("hello.txt").await?;
    println!("Content: {}", content);
    Ok(())
}
```

## Common Patterns

### Timeout wrapper

```rust
use tokio::time::{timeout, Duration};

async fn with_timeout<F, T>(future: F) -> Option<T>
where
    F: std::future::Future<Output = T>,
{
    timeout(Duration::from_secs(5), future).await.ok()
}
```

### Retry logic

```rust
async fn fetch_with_retry(url: &str, max_attempts: u32) -> Result<String, String> {
    for attempt in 1..=max_attempts {
        match fetch(url).await {
            Ok(data) => return Ok(data),
            Err(e) if attempt < max_attempts => {
                println!("Attempt {} failed: {}", attempt, e);
                tokio::time::sleep(Duration::from_secs(1)).await;
            }
            Err(e) => return Err(e),
        }
    }
    Err("Max attempts reached".into())
}

async fn fetch(_url: &str) -> Result<String, String> {
    // Simulated fetch
    Ok(String::from("data"))
}
```

## Sync vs Async

| Synchronous | Asynchronous |
|-------------|--------------|
| Simple, linear flow | Requires runtime |
| One task per thread | Many tasks per thread |
| Good for CPU-bound | Good for I/O-bound |
| Blocking operations | Non-blocking operations |

## Key Takeaways

1. `async fn` returns a `Future` that must be awaited
2. `.await` yields control, allowing other tasks to run
3. You need a runtime (like Tokio) to execute async code
4. `join!` runs futures concurrently; `select!` races them
5. `spawn` creates independent tasks
6. Async is best for I/O-bound workloads with many concurrent operations

You now have a foundation in Rust's concurrency primitives!
