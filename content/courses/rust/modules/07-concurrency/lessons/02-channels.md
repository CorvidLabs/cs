---
title: Channels
order: 2
estimatedMinutes: 25
---

# Channels: Message Passing

Channels provide a way for threads to communicate by sending messages. This is often safer than sharing memory because ownership transfers with the message.

## Creating Channels

Use `mpsc` (multiple producer, single consumer):

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    // Create a channel
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let message = String::from("Hello from thread!");
        tx.send(message).unwrap();
        // message has been moved, can't use it here
    });

    // Receive blocks until a message arrives
    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

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
            thread::sleep(Duration::from_millis(500));
        }
    });

    // Iterate over received messages
    for received in rx {
        println!("Got: {}", received);
    }
    // Loop ends when sender is dropped
}
```

## Multiple Producers

Clone the sender for multiple producers:

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

    // Drop the original sender so rx iterator can end
    drop(tx);

    for msg in rx {
        println!("{}", msg);
    }
}
```

## Non-Blocking Receive

Use `try_recv` for non-blocking:

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        thread::sleep(Duration::from_millis(500));
        tx.send("delayed message").unwrap();
    });

    // Poll without blocking
    loop {
        match rx.try_recv() {
            Ok(msg) => {
                println!("Received: {}", msg);
                break;
            }
            Err(mpsc::TryRecvError::Empty) => {
                println!("No message yet, doing other work...");
                thread::sleep(Duration::from_millis(100));
            }
            Err(mpsc::TryRecvError::Disconnected) => {
                println!("Sender disconnected");
                break;
            }
        }
    }
}
```

## Receive with Timeout

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel::<String>();

    thread::spawn(move || {
        thread::sleep(Duration::from_secs(2));
        tx.send("late message".to_string()).unwrap();
    });

    match rx.recv_timeout(Duration::from_secs(1)) {
        Ok(msg) => println!("Got: {}", msg),
        Err(mpsc::RecvTimeoutError::Timeout) => println!("Timeout!"),
        Err(mpsc::RecvTimeoutError::Disconnected) => println!("Disconnected!"),
    }
}
```

## Bounded Channels (sync_channel)

Limit buffer size to apply backpressure:

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    // Buffer size of 2
    let (tx, rx) = mpsc::sync_channel(2);

    thread::spawn(move || {
        for i in 0..5 {
            println!("Sending: {}", i);
            tx.send(i).unwrap();  // Blocks when buffer is full
            println!("Sent: {}", i);
        }
    });

    thread::sleep(Duration::from_secs(1));

    for received in rx {
        println!("Received: {}", received);
        thread::sleep(Duration::from_millis(500));
    }
}
```

## Channel Patterns

### Pattern: Worker Pool

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    let (result_tx, result_rx) = mpsc::channel();

    // Spawn worker threads
    for id in 0..4 {
        let rx = rx.clone();  // Note: can't clone receiver directly
        let result_tx = result_tx.clone();

        thread::spawn(move || {
            // This worker would receive from a shared receiver
            // For real worker pools, use crossbeam or similar
            println!("Worker {} started", id);
        });
    }
}
```

### Pattern: Request-Response

```rust
use std::sync::mpsc;
use std::thread;

struct Request {
    data: String,
    response_channel: mpsc::Sender<String>,
}

fn main() {
    let (tx, rx) = mpsc::channel::<Request>();

    // Server thread
    thread::spawn(move || {
        for request in rx {
            let response = format!("Processed: {}", request.data.to_uppercase());
            request.response_channel.send(response).unwrap();
        }
    });

    // Client makes requests
    for i in 0..3 {
        let (resp_tx, resp_rx) = mpsc::channel();

        tx.send(Request {
            data: format!("request {}", i),
            response_channel: resp_tx,
        }).unwrap();

        let response = resp_rx.recv().unwrap();
        println!("Response: {}", response);
    }
}
```

### Pattern: Pipeline

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    // Stage 1 -> Stage 2 -> Stage 3
    let (tx1, rx1) = mpsc::channel();
    let (tx2, rx2) = mpsc::channel();
    let (tx3, rx3) = mpsc::channel();

    // Stage 1: Generate numbers
    thread::spawn(move || {
        for i in 0..5 {
            tx1.send(i).unwrap();
        }
    });

    // Stage 2: Double them
    thread::spawn(move || {
        for n in rx1 {
            tx2.send(n * 2).unwrap();
        }
    });

    // Stage 3: Add 1
    thread::spawn(move || {
        for n in rx2 {
            tx3.send(n + 1).unwrap();
        }
    });

    // Collect results
    for result in rx3 {
        println!("Result: {}", result);
    }
}
```

### Pattern: Fan-out / Fan-in

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (work_tx, work_rx) = mpsc::channel();
    let (result_tx, result_rx) = mpsc::channel();

    // Fan-out: Distribute work (need shared receiver - use Arc<Mutex>)
    // For simplicity, we'll pre-distribute work
    let workers: Vec<_> = (0..4).map(|id| {
        let result_tx = result_tx.clone();
        let (work_tx, work_rx) = mpsc::channel::<i32>();

        thread::spawn(move || {
            for work in work_rx {
                let result = work * work;  // Square the number
                result_tx.send((id, result)).unwrap();
            }
        });

        work_tx
    }).collect();

    drop(result_tx);  // Drop original so iterator ends

    // Distribute work
    for (i, n) in (1..=12).enumerate() {
        workers[i % workers.len()].send(n).unwrap();
    }
    drop(workers);  // Close all channels

    // Fan-in: Collect results
    for (worker_id, result) in result_rx {
        println!("Worker {}: {}", worker_id, result);
    }
}
```

## Error Handling

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel::<i32>();

    // Drop sender immediately
    drop(tx);

    // recv() on closed channel returns error
    match rx.recv() {
        Ok(msg) => println!("Got: {}", msg),
        Err(e) => println!("Channel closed: {:?}", e),
    }

    // send() on closed channel returns error
    let (tx2, rx2) = mpsc::channel::<i32>();
    drop(rx2);

    match tx2.send(42) {
        Ok(()) => println!("Sent!"),
        Err(e) => println!("Send failed: {:?}", e),
    }
}
```

## Key Takeaways

1. **mpsc = multiple producer, single consumer**
2. **`send()` transfers ownership** of the message
3. **`recv()` blocks** until a message arrives
4. **`try_recv()` is non-blocking** - returns immediately
5. **Clone sender for multiple producers**
6. **sync_channel provides bounded buffer** for backpressure
7. **Channels close when all senders are dropped**

In the next lesson, we'll learn about shared state concurrency with Mutex and Arc.
