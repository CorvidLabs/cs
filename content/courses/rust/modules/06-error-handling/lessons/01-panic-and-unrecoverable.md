---
title: Panic and Unrecoverable Errors
order: 1
estimatedMinutes: 15
---

# Panic and Unrecoverable Errors

Rust distinguishes between two kinds of errors: recoverable errors (like file not found) and unrecoverable errors (like accessing memory out of bounds). This lesson covers unrecoverable errors handled by `panic!`.

## What is Panic?

When your program encounters a situation it cannot handle, it can **panic**. A panic:

1. Prints an error message
2. Unwinds and cleans up the stack
3. Terminates the program

```rust
fn main() {
    panic!("crash and burn");
}
```

Output:
```
thread 'main' panicked at 'crash and burn', src/main.rs:2:5
```

## When to Panic

Panic is appropriate when:

- The program is in an **unrecoverable state**
- Continuing would be **unsafe or meaningless**
- You're writing **examples, prototypes, or tests**
- You have more information than the compiler about validity

```rust
fn main() {
    let v = vec![1, 2, 3];

    // This panics! Index out of bounds.
    let value = v[99];
}
```

## Panic vs Return Error

| Panic | Return Error |
|-------|--------------|
| Program terminates | Caller handles the error |
| For bugs and impossible states | For expected error conditions |
| Cannot be caught (usually) | Can be propagated or handled |

## The `unreachable!` Macro

Use `unreachable!()` for code that should never execute:

```rust
fn process_direction(dir: &str) -> i32 {
    match dir {
        "north" => 1,
        "south" => -1,
        "east" => 2,
        "west" => -2,
        _ => unreachable!("Invalid direction: {}", dir),
    }
}
```

## The `unimplemented!` and `todo!` Macros

For code that isn't written yet:

```rust
fn complex_calculation() -> i32 {
    todo!("implement this algorithm later")
}

fn experimental_feature() {
    unimplemented!("feature not ready")
}
```

Both panic when called, but communicate different intent.

## Panic in Production

By default, Rust unwinds the stack on panic, running destructors. For smaller binaries, you can abort instead:

```toml
# Cargo.toml
[profile.release]
panic = 'abort'
```

## Backtraces

Set `RUST_BACKTRACE=1` to see the full call stack when a panic occurs:

```bash
RUST_BACKTRACE=1 cargo run
```

This shows you exactly where and why the panic happened.

## Catching Panics (Advanced)

While rare, you can catch panics with `std::panic::catch_unwind`:

```rust
use std::panic;

fn main() {
    let result = panic::catch_unwind(|| {
        println!("About to panic!");
        panic!("oh no!");
    });

    match result {
        Ok(_) => println!("No panic occurred"),
        Err(_) => println!("Caught a panic!"),
    }

    println!("Program continues...");
}
```

This is mainly used for:
- FFI boundaries
- Thread pools that need to continue after a task panics
- Testing frameworks

## Best Practices

1. **Prefer `Result` over panic** for recoverable errors
2. **Use `expect()` over `unwrap()`** to provide context
3. **Document panics** in your public API
4. **Panic in impossible states** to catch bugs early

```rust
// Bad: No context
let config = parse_config().unwrap();

// Good: Clear error message
let config = parse_config().expect("Config file must be valid");
```

## Key Takeaways

1. `panic!` terminates the program for unrecoverable errors
2. Use `unreachable!`, `unimplemented!`, and `todo!` for special cases
3. Backtraces help debug panics
4. Prefer `Result` for recoverable errors (covered next)
5. Use `expect()` over `unwrap()` for better error messages

In the next lesson, we'll explore the `Result` type for handling recoverable errors gracefully.
