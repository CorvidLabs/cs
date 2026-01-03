---
title: Send and Sync
order: 4
estimatedMinutes: 25
---

# Send and Sync: Thread Safety Guarantees

Rust's thread safety comes from two marker traits: `Send` and `Sync`. The compiler uses these to prevent data races at compile time.

## The Send Trait

A type is `Send` if it can be safely transferred to another thread:

```rust
use std::thread;

fn main() {
    let data = vec![1, 2, 3];  // Vec<i32> is Send

    // This works because Vec<i32> is Send
    let handle = thread::spawn(move || {
        println!("Data: {:?}", data);
    });

    handle.join().unwrap();
}
```

Most types are `Send`, but not all:

```rust
use std::rc::Rc;
use std::thread;

fn main() {
    let rc_data = Rc::new(5);  // Rc is NOT Send

    // This won't compile!
    // let handle = thread::spawn(move || {
    //     println!("Data: {:?}", rc_data);
    // });
}
```

Error:
```
error[E0277]: `Rc<i32>` cannot be sent between threads safely
```

## The Sync Trait

A type is `Sync` if it can be safely **shared** between threads (via references):

```rust
use std::thread;

fn main() {
    let data = 5;  // i32 is Sync

    thread::scope(|s| {
        s.spawn(|| {
            println!("Thread 1: {}", data);  // Borrows data
        });

        s.spawn(|| {
            println!("Thread 2: {}", data);  // Also borrows data
        });
    });
}
```

## Send and Sync Relationship

- If `T` is `Sync`, then `&T` is `Send`
- If `T` is `Send`, then `&mut T` is `Send`

```rust
// T: Sync means &T: Send
// Multiple threads can hold &T simultaneously

// T: Send means the value itself can move between threads
```

## Types That Are NOT Send or Sync

### Rc<T> - Not Send, Not Sync

```rust
use std::rc::Rc;

// Rc uses non-atomic reference counting
// Not thread-safe for either sending or sharing
let rc = Rc::new(5);

// Use Arc instead for thread-safe reference counting
use std::sync::Arc;
let arc = Arc::new(5);  // Arc is Send + Sync
```

### RefCell<T> - Send but NOT Sync

```rust
use std::cell::RefCell;

// RefCell allows interior mutability
// Safe to send to one other thread
// NOT safe to share between threads (not Sync)
let cell = RefCell::new(5);

// Use Mutex or RwLock instead
use std::sync::Mutex;
let mutex = Mutex::new(5);  // Mutex<T> is Sync if T is Send
```

### Raw Pointers - Not Send, Not Sync

```rust
let x = 5;
let ptr: *const i32 = &x;

// Raw pointers are not thread-safe
// Wrap in a struct and implement Send/Sync if you know it's safe
```

## Implementing Send and Sync

These traits are automatically implemented when appropriate:

```rust
// Automatically Send + Sync if all fields are
struct Point {
    x: i32,  // i32 is Send + Sync
    y: i32,
}  // Point is automatically Send + Sync

// NOT automatically Send + Sync
struct NotSend {
    data: std::rc::Rc<i32>,  // Rc is not Send
}  // NotSend is not Send

// Manual implementation (unsafe!)
struct MyPointer(*mut i32);

// This is unsafe - only do this if you guarantee thread safety
unsafe impl Send for MyPointer {}
unsafe impl Sync for MyPointer {}
```

## Common Type Thread Safety

| Type | Send | Sync |
|------|------|------|
| `i32`, `bool`, `char` | Yes | Yes |
| `String`, `Vec<T>` | If T: Send | If T: Sync |
| `&T` | If T: Sync | If T: Sync |
| `&mut T` | If T: Send | If T: Send |
| `Box<T>` | If T: Send | If T: Sync |
| `Arc<T>` | If T: Send + Sync | If T: Send + Sync |
| `Mutex<T>` | If T: Send | If T: Send |
| `RwLock<T>` | If T: Send | If T: Send + Sync |
| `Rc<T>` | No | No |
| `RefCell<T>` | If T: Send | No |
| `Cell<T>` | If T: Send | No |
| `*const T`, `*mut T` | No | No |

## Why This Matters

The compiler prevents data races:

```rust
use std::cell::RefCell;
use std::thread;

fn main() {
    let cell = RefCell::new(5);

    // Won't compile! RefCell is not Sync
    // thread::scope(|s| {
    //     s.spawn(|| {
    //         *cell.borrow_mut() += 1;
    //     });
    //     s.spawn(|| {
    //         *cell.borrow_mut() += 1;  // Data race!
    //     });
    // });
}
```

Use the right tools instead:

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(5));

    thread::scope(|s| {
        s.spawn(|| {
            *counter.lock().unwrap() += 1;
        });
        s.spawn(|| {
            *counter.lock().unwrap() += 1;  // Safe!
        });
    });

    println!("Result: {}", *counter.lock().unwrap());
}
```

## Generic Bounds with Send/Sync

```rust
use std::thread;

// Function that requires T to be Send
fn spawn_with<T: Send + 'static>(value: T) -> thread::JoinHandle<T> {
    thread::spawn(move || value)
}

// Function that requires T to be Sync for sharing
fn share_between_threads<T: Sync>(value: &T) {
    thread::scope(|s| {
        s.spawn(|| {
            // Use value
        });
        s.spawn(|| {
            // Also use value
        });
    });
}
```

## Negative Trait Implementations

Some types explicitly opt out:

```rust
// In the standard library:
// impl<T: ?Sized> !Send for Rc<T> {}
// impl<T: ?Sized> !Sync for Rc<T> {}

// This prevents Rc from being Send or Sync
```

## Practical Patterns

### Pattern: Thread-safe wrapper

```rust
use std::sync::{Arc, Mutex};

struct ThreadSafe<T> {
    inner: Arc<Mutex<T>>,
}

impl<T> ThreadSafe<T> {
    fn new(value: T) -> Self {
        ThreadSafe {
            inner: Arc::new(Mutex::new(value)),
        }
    }

    fn with<R>(&self, f: impl FnOnce(&mut T) -> R) -> R {
        let mut guard = self.inner.lock().unwrap();
        f(&mut *guard)
    }
}

impl<T> Clone for ThreadSafe<T> {
    fn clone(&self) -> Self {
        ThreadSafe {
            inner: Arc::clone(&self.inner),
        }
    }
}
```

### Pattern: Choosing the right type

```rust
// Single-threaded: Rc + RefCell
use std::rc::Rc;
use std::cell::RefCell;
let local = Rc::new(RefCell::new(vec![]));

// Multi-threaded: Arc + Mutex
use std::sync::{Arc, Mutex};
let shared = Arc::new(Mutex::new(vec![]));

// Multi-threaded, mostly reads: Arc + RwLock
use std::sync::RwLock;
let read_heavy = Arc::new(RwLock::new(vec![]));
```

## Key Takeaways

1. **Send means transferrable** between threads
2. **Sync means shareable** between threads via references
3. **Most types are automatically Send/Sync** if their fields are
4. **Rc is NOT thread-safe** - use Arc instead
5. **RefCell is NOT Sync** - use Mutex instead
6. **The compiler enforces thread safety** at compile time
7. **Implementing Send/Sync manually is unsafe** - be careful

You've completed the concurrency module! Rust's ownership system and these marker traits work together to eliminate data races at compile time. Next, we'll explore advanced topics like unsafe code and FFI.
