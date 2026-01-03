---
title: Message Passing with Channels
order: 2
estimatedMinutes: 20
---

# Message Passing with Channels

Rust's channels provide a way for threads to communicate by sending messages. This follows the philosophy: "Do not communicate by sharing memory; instead, share memory by communicating."

## Creating a Channel

Use `std::sync::mpsc` (multiple producer, single consumer):

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    // Create a channel
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let message = String::from("Hello from thread!");
        tx.send(message).unwrap();
        // message is moved, can't use it here
    });

    // Receive blocks until a message arrives
    let received = rx.recv().unwrap();
    println!("Received: {}", received);
}
```

## Channel Components

- `tx` (transmitter/sender): Used to send messages
- `rx` (receiver): Used to receive messages
- Messages are moved through the channel (ownership transfer)

## Sending Multiple Messages

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let messages = vec!["hi", "from", "the", "thread"];

        for msg in messages {
            tx.send(msg).unwrap();
            thread::sleep(Duration::from_millis(200));
        }
    });

    // Iterate over received messages
    for received in rx {
        println!("Got: {}", received);
    }
}
```

The receiver iterator ends when the sender is dropped.

## Multiple Producers

Clone the transmitter for multiple senders:

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    for i in 0..3 {
        let tx_clone = tx.clone();
        thread::spawn(move || {
            tx_clone.send(format!("Message from thread {}", i)).unwrap();
        });
    }

    // Drop original tx so rx knows when all senders are done
    drop(tx);

    for msg in rx {
        println!("{}", msg);
    }
}
```

## Non-Blocking Receive

Use `try_recv` for non-blocking checks:

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        thread::sleep(Duration::from_secs(1));
        tx.send("delayed message").unwrap();
    });

    loop {
        match rx.try_recv() {
            Ok(msg) => {
                println!("Received: {}", msg);
                break;
            }
            Err(mpsc::TryRecvError::Empty) => {
                println!("No message yet, doing other work...");
                thread::sleep(Duration::from_millis(200));
            }
            Err(mpsc::TryRecvError::Disconnected) => {
                println!("Channel closed");
                break;
            }
        }
    }
}
```

## Receive with Timeout

```rust
use std::sync::mpsc;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel::<String>();

    // Don't send anything, let it timeout
    drop(tx);

    match rx.recv_timeout(Duration::from_secs(1)) {
        Ok(msg) => println!("Received: {}", msg),
        Err(mpsc::RecvTimeoutError::Timeout) => println!("Timed out!"),
        Err(mpsc::RecvTimeoutError::Disconnected) => println!("Channel closed"),
    }
}
```

## Synchronous Channels

`sync_channel` has a bounded buffer:

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    // Buffer size of 2
    let (tx, rx) = mpsc::sync_channel(2);

    thread::spawn(move || {
        for i in 0..5 {
            println!("Sending {}", i);
            tx.send(i).unwrap();  // Blocks if buffer is full
            println!("Sent {}", i);
        }
    });

    for val in rx {
        println!("Received {}", val);
    }
}
```

## Practical Pattern: Worker Pool

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    // Spawn worker threads
    let mut handles = vec![];
    for id in 0..4 {
        let tx = tx.clone();
        handles.push(thread::spawn(move || {
            // Simulate work
            let result = id * 10;
            tx.send((id, result)).unwrap();
        }));
    }

    drop(tx);  // Drop original sender

    // Collect results
    let results: Vec<_> = rx.iter().collect();
    println!("Results: {:?}", results);

    for handle in handles {
        handle.join().unwrap();
    }
}
```

## Error Handling

Channel operations can fail:

```rust
use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel::<i32>();

    // Drop the receiver
    drop(rx);

    // Sending fails because no receiver exists
    match tx.send(42) {
        Ok(()) => println!("Sent successfully"),
        Err(e) => println!("Failed to send: {}", e.0),  // e.0 is the unsent value
    }
}
```

## Key Takeaways

1. Channels transfer ownership of values between threads
2. `mpsc::channel()` creates an unbounded asynchronous channel
3. Clone `tx` for multiple producers
4. `recv()` blocks; `try_recv()` doesn't
5. The channel closes when all senders are dropped
6. `sync_channel` provides bounded, backpressure-aware channels

Next, we'll explore sharing state between threads with mutexes.
