---
title: Threads and Parallelism
order: 1
estimatedMinutes: 20
---

# Threads and Parallelism

Rust's ownership system makes concurrent programming safer than in most languages. Data races are prevented at compile time, letting you write parallel code with confidence.

## Spawning Threads

Use `std::thread::spawn` to create a new thread:

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("Spawned thread: {}", i);
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("Main thread: {}", i);
        thread::sleep(Duration::from_millis(1));
    }

    handle.join().unwrap();  // Wait for spawned thread to finish
}
```

## The JoinHandle

`spawn` returns a `JoinHandle` that lets you wait for the thread to complete:

```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        // Do some work
        42
    });

    // Do other work in main thread...

    // Wait for the thread and get its return value
    let result = handle.join().unwrap();
    println!("Thread returned: {}", result);
}
```

`join()` returns `Result<T, E>` - it's `Err` if the thread panicked.

## Moving Data into Threads

Threads need to own their data. Use `move` to transfer ownership:

```rust
use std::thread;

fn main() {
    let data = vec![1, 2, 3];

    // This won't compile - closure borrows `data`
    // let handle = thread::spawn(|| {
    //     println!("{:?}", data);
    // });

    // Use `move` to transfer ownership
    let handle = thread::spawn(move || {
        println!("{:?}", data);
    });

    // data is no longer accessible here!
    handle.join().unwrap();
}
```

## Multiple Threads

Spawn multiple threads and collect their handles:

```rust
use std::thread;

fn main() {
    let mut handles = vec![];

    for i in 0..5 {
        let handle = thread::spawn(move || {
            println!("Thread {} is running", i);
            i * 2
        });
        handles.push(handle);
    }

    let results: Vec<_> = handles
        .into_iter()
        .map(|h| h.join().unwrap())
        .collect();

    println!("Results: {:?}", results);
}
```

## Thread Safety with Send and Sync

Rust uses two traits to ensure thread safety:

### Send

A type is `Send` if it can be transferred to another thread. Most types are `Send`, but some aren't:

```rust
use std::rc::Rc;

// Rc is NOT Send - use Arc instead for shared ownership across threads
let rc = Rc::new(5);

// This won't compile:
// thread::spawn(move || {
//     println!("{}", rc);
// });
```

### Sync

A type is `Sync` if it's safe to share references across threads. `&T` is `Send` only if `T` is `Sync`.

```rust
use std::cell::RefCell;

// RefCell is NOT Sync - use Mutex for interior mutability across threads
let cell = RefCell::new(5);
```

## Thread Builder

Customize threads with `thread::Builder`:

```rust
use std::thread;

fn main() {
    let builder = thread::Builder::new()
        .name("worker-1".into())
        .stack_size(32 * 1024);

    let handle = builder.spawn(|| {
        println!("Thread name: {:?}", thread::current().name());
    }).unwrap();

    handle.join().unwrap();
}
```

## Thread Panics

When a thread panics, only that thread is affected:

```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        panic!("Thread panicked!");
    });

    match handle.join() {
        Ok(_) => println!("Thread completed normally"),
        Err(e) => println!("Thread panicked: {:?}", e),
    }

    println!("Main thread continues...");
}
```

## Scoped Threads

For borrowing data from the parent thread, use scoped threads (Rust 1.63+):

```rust
use std::thread;

fn main() {
    let data = vec![1, 2, 3];

    thread::scope(|s| {
        s.spawn(|| {
            println!("Thread 1: {:?}", data);  // Can borrow data!
        });

        s.spawn(|| {
            println!("Thread 2: {:?}", data);  // Both threads can borrow
        });
    });  // Threads are joined automatically

    println!("Data still accessible: {:?}", data);
}
```

## Key Takeaways

1. Use `thread::spawn` to create new threads
2. `JoinHandle::join()` waits for thread completion
3. Use `move` closures to transfer ownership to threads
4. `Send` allows transfer between threads; `Sync` allows shared references
5. Scoped threads can borrow from the parent thread
6. Thread panics don't crash the whole program

In the next lesson, we'll learn about message passing between threads using channels.
