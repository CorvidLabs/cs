---
title: Shared State with Mutex and Arc
order: 3
estimatedMinutes: 25
---

# Shared State with Mutex and Arc

While message passing is powerful, sometimes threads need to share mutable state. Rust provides `Mutex` for mutual exclusion and `Arc` for thread-safe reference counting.

## Mutex Basics

A `Mutex` (mutual exclusion) allows only one thread to access data at a time:

```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);

    {
        let mut num = m.lock().unwrap();
        *num = 6;
    }  // Lock is released here when MutexGuard goes out of scope

    println!("m = {:?}", m);
}
```

## How Mutex Works

1. Call `lock()` to acquire the mutex
2. Get a `MutexGuard` that provides access to the data
3. The lock is automatically released when the guard is dropped

```rust
use std::sync::Mutex;

fn main() {
    let data = Mutex::new(vec![1, 2, 3]);

    {
        let mut guard = data.lock().unwrap();
        guard.push(4);
        println!("Inside lock: {:?}", *guard);
    }  // guard dropped, lock released

    println!("After lock: {:?}", data.lock().unwrap());
}
```

## Mutex Poisoning

If a thread panics while holding a lock, the mutex becomes "poisoned":

```rust
use std::sync::Mutex;

fn main() {
    let data = Mutex::new(5);

    // This would poison the mutex if it panicked
    let result = std::panic::catch_unwind(|| {
        let _guard = data.lock().unwrap();
        panic!("Oh no!");
    });

    // Lock is poisoned - we can still access it
    match data.lock() {
        Ok(guard) => println!("Data: {}", *guard),
        Err(poisoned) => {
            println!("Mutex was poisoned, recovering...");
            let guard = poisoned.into_inner();
            println!("Data: {}", *guard);
        }
    }
}
```

## Arc: Atomic Reference Counting

`Mutex` needs to be shared across threads. `Rc` isn't thread-safe, so use `Arc`:

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
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

| `Rc<T>` | `Arc<T>` |
|---------|----------|
| Single-threaded | Thread-safe |
| Faster (no atomic operations) | Slightly slower |
| Not `Send` | Is `Send` and `Sync` |

## RwLock: Multiple Readers

`RwLock` allows multiple readers OR one writer:

```rust
use std::sync::RwLock;

fn main() {
    let lock = RwLock::new(5);

    // Multiple readers can access simultaneously
    {
        let r1 = lock.read().unwrap();
        let r2 = lock.read().unwrap();
        println!("Readers: {} and {}", *r1, *r2);
    }  // Read locks released

    // Only one writer at a time
    {
        let mut w = lock.write().unwrap();
        *w += 1;
    }  // Write lock released

    println!("Final value: {:?}", lock);
}
```

## Deadlock Prevention

Deadlocks can occur when threads wait for each other's locks:

```rust
// DANGER: This can deadlock!
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let a = Arc::new(Mutex::new(1));
    let b = Arc::new(Mutex::new(2));

    let a1 = Arc::clone(&a);
    let b1 = Arc::clone(&b);

    let handle1 = thread::spawn(move || {
        let _a = a1.lock().unwrap();
        std::thread::sleep(std::time::Duration::from_millis(1));
        let _b = b1.lock().unwrap();  // Might wait forever!
    });

    let a2 = Arc::clone(&a);
    let b2 = Arc::clone(&b);

    let handle2 = thread::spawn(move || {
        let _b = b2.lock().unwrap();
        std::thread::sleep(std::time::Duration::from_millis(1));
        let _a = a2.lock().unwrap();  // Might wait forever!
    });

    handle1.join().unwrap();
    handle2.join().unwrap();
}
```

**Prevention strategies:**
1. Always acquire locks in the same order
2. Use `try_lock()` with backoff
3. Use higher-level synchronization primitives

## Atomic Types

For simple counters, atomics are more efficient than mutexes:

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
            counter.fetch_add(1, Ordering::SeqCst);
        }));
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", counter.load(Ordering::SeqCst));
}
```

## Common Pattern: Shared Configuration

```rust
use std::sync::{Arc, RwLock};
use std::thread;

struct Config {
    debug_mode: bool,
    max_connections: usize,
}

fn main() {
    let config = Arc::new(RwLock::new(Config {
        debug_mode: false,
        max_connections: 100,
    }));

    // Reader threads
    for i in 0..3 {
        let config = Arc::clone(&config);
        thread::spawn(move || {
            let c = config.read().unwrap();
            println!("Thread {}: debug={}", i, c.debug_mode);
        });
    }

    // Writer thread (update config)
    {
        let mut c = config.write().unwrap();
        c.debug_mode = true;
    }
}
```

## Key Takeaways

1. `Mutex` provides exclusive access to shared data
2. `Arc` enables thread-safe reference counting
3. Always pair `Arc` with `Mutex` for shared mutable state across threads
4. `RwLock` allows multiple readers or one writer
5. Avoid deadlocks by acquiring locks in consistent order
6. Use atomics for simple counters and flags

Next, we'll get an introduction to async/await for asynchronous programming.
