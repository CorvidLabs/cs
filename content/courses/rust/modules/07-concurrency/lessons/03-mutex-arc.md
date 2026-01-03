---
title: Mutex and Arc
order: 3
estimatedMinutes: 30
---

# Mutex and Arc: Shared State Concurrency

While channels transfer ownership, sometimes you need shared mutable state. Rust provides `Mutex` for mutual exclusion and `Arc` for thread-safe reference counting.

## Mutex Basics

`Mutex` provides exclusive access to data:

```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);

    {
        // lock() returns a MutexGuard
        let mut num = m.lock().unwrap();
        *num = 6;
        // MutexGuard is dropped here, releasing the lock
    }

    println!("m = {:?}", m);
}
```

## How Mutex Works

```rust
use std::sync::Mutex;

fn main() {
    let counter = Mutex::new(0);

    // lock() blocks until lock is acquired
    let mut guard = counter.lock().unwrap();

    // Access the data through the guard
    *guard += 1;
    println!("Counter: {}", *guard);

    // Lock is released when guard goes out of scope
    drop(guard);

    // Now we can lock again
    let guard2 = counter.lock().unwrap();
    println!("Counter: {}", *guard2);
}
```

## The Problem with Threads

`Mutex<T>` alone doesn't work with threads:

```rust
use std::sync::Mutex;
use std::thread;

fn main() {
    let counter = Mutex::new(0);

    let handle = thread::spawn(move || {
        let mut num = counter.lock().unwrap();
        *num += 1;
    });

    // counter has been moved!
    // let mut num = counter.lock().unwrap();  // ERROR!

    handle.join().unwrap();
}
```

## Arc: Atomic Reference Counting

`Arc` (Atomic Reference Counted) allows multiple ownership across threads:

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // Arc<Mutex<T>> for thread-safe shared mutable state
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);  // Clone the Arc, not the Mutex
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

## Arc vs Rc

```rust
// Rc is NOT thread-safe (faster for single-threaded use)
use std::rc::Rc;
let rc_counter = Rc::new(5);

// Arc IS thread-safe (uses atomic operations)
use std::sync::Arc;
let arc_counter = Arc::new(5);

// Trying to send Rc to another thread won't compile:
// thread::spawn(move || {
//     println!("{}", rc_counter);  // ERROR: Rc cannot be sent between threads
// });
```

## Mutex Guards and Scope

The lock is held as long as the guard exists:

```rust
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

fn main() {
    let data = Arc::new(Mutex::new(0));

    let data_clone = Arc::clone(&data);
    let handle = thread::spawn(move || {
        let mut guard = data_clone.lock().unwrap();
        println!("Thread acquired lock");
        *guard = 1;
        // Simulate long operation while holding lock
        thread::sleep(Duration::from_secs(2));
        println!("Thread releasing lock");
    });

    thread::sleep(Duration::from_millis(100));  // Let thread acquire lock first

    println!("Main thread waiting for lock...");
    let guard = data.lock().unwrap();  // Blocks until thread releases
    println!("Main thread got lock, value: {}", *guard);

    handle.join().unwrap();
}
```

## Avoiding Deadlocks

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let resource_a = Arc::new(Mutex::new(1));
    let resource_b = Arc::new(Mutex::new(2));

    let a1 = Arc::clone(&resource_a);
    let b1 = Arc::clone(&resource_b);

    // Thread 1: Locks A then B
    let handle1 = thread::spawn(move || {
        let _a = a1.lock().unwrap();
        println!("Thread 1 locked A");
        thread::sleep(std::time::Duration::from_millis(100));
        let _b = b1.lock().unwrap();  // Might deadlock!
        println!("Thread 1 locked B");
    });

    let a2 = Arc::clone(&resource_a);
    let b2 = Arc::clone(&resource_b);

    // Thread 2: Also locks A then B (same order = safe)
    let handle2 = thread::spawn(move || {
        let _a = a2.lock().unwrap();  // Same order prevents deadlock
        println!("Thread 2 locked A");
        let _b = b2.lock().unwrap();
        println!("Thread 2 locked B");
    });

    handle1.join().unwrap();
    handle2.join().unwrap();
}
```

**Deadlock prevention rules:**
1. Always acquire locks in the same order
2. Hold locks for as short as possible
3. Consider using `try_lock()` with timeout

## try_lock for Non-Blocking

```rust
use std::sync::Mutex;

fn main() {
    let data = Mutex::new(42);

    let guard = data.lock().unwrap();

    match data.try_lock() {
        Ok(mut value) => {
            *value = 100;
        }
        Err(_) => {
            println!("Lock already held");
        }
    }

    drop(guard);
}
```

## RwLock: Multiple Readers

`RwLock` allows multiple readers or one writer:

```rust
use std::sync::{Arc, RwLock};
use std::thread;

fn main() {
    let data = Arc::new(RwLock::new(vec![1, 2, 3]));
    let mut handles = vec![];

    // Multiple readers can access simultaneously
    for i in 0..3 {
        let data = Arc::clone(&data);
        handles.push(thread::spawn(move || {
            let read_guard = data.read().unwrap();
            println!("Reader {}: {:?}", i, *read_guard);
        }));
    }

    // Writer gets exclusive access
    {
        let data = Arc::clone(&data);
        handles.push(thread::spawn(move || {
            let mut write_guard = data.write().unwrap();
            write_guard.push(4);
            println!("Writer: {:?}", *write_guard);
        }));
    }

    for handle in handles {
        handle.join().unwrap();
    }
}
```

## Interior Mutability Patterns

```rust
use std::sync::{Arc, Mutex};
use std::cell::Cell;

// Arc<Mutex<T>> - thread-safe shared mutable state
let shared = Arc::new(Mutex::new(vec![1, 2, 3]));

// Cell and RefCell are NOT thread-safe
// let bad = Arc::new(Cell::new(5));  // Compiles but dangerous patterns

// AtomicTypes for simple values
use std::sync::atomic::{AtomicUsize, Ordering};
let counter = Arc::new(AtomicUsize::new(0));
```

## Atomic Types

For simple counters, atomics are faster than Mutex:

```rust
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use std::thread;

fn main() {
    let counter = Arc::new(AtomicUsize::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            for _ in 0..1000 {
                counter.fetch_add(1, Ordering::SeqCst);
            }
        }));
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Counter: {}", counter.load(Ordering::SeqCst));
}
```

## Common Patterns

### Pattern: Shared configuration

```rust
use std::sync::{Arc, RwLock};

struct Config {
    debug: bool,
    max_connections: usize,
}

fn main() {
    let config = Arc::new(RwLock::new(Config {
        debug: false,
        max_connections: 100,
    }));

    // Readers
    let cfg = config.read().unwrap();
    println!("Debug: {}", cfg.debug);

    // Writer (for config updates)
    let mut cfg = config.write().unwrap();
    cfg.max_connections = 200;
}
```

### Pattern: Thread-safe cache

```rust
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

type Cache = Arc<Mutex<HashMap<String, String>>>;

fn get_or_compute(cache: &Cache, key: &str) -> String {
    {
        let guard = cache.lock().unwrap();
        if let Some(value) = guard.get(key) {
            return value.clone();
        }
    }  // Release lock before computing

    let value = expensive_computation(key);

    {
        let mut guard = cache.lock().unwrap();
        guard.insert(key.to_string(), value.clone());
    }

    value
}

fn expensive_computation(key: &str) -> String {
    format!("computed_{}", key)
}
```

## Key Takeaways

1. **Mutex provides exclusive access** - one thread at a time
2. **Arc enables shared ownership** across threads
3. **Arc<Mutex<T>>** is the common pattern for shared mutable state
4. **Lock guards release automatically** when dropped
5. **Acquire locks in consistent order** to prevent deadlocks
6. **RwLock allows multiple readers** or one writer
7. **Atomics are faster** for simple counters

In the next lesson, we'll explore the Send and Sync traits that make this all work.
