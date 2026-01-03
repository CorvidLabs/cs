---
title: Unsafe Rust
order: 3
estimatedMinutes: 25
---

# Unsafe Rust

Rust's safety guarantees come with restrictions. Sometimes you need to step outside these restrictions for low-level programming, FFI, or performance. That's what `unsafe` is for.

## What Unsafe Unlocks

Inside an `unsafe` block, you can:

1. Dereference raw pointers
2. Call unsafe functions
3. Access mutable static variables
4. Implement unsafe traits
5. Access union fields

```rust
unsafe {
    // Unsafe operations allowed here
}
```

**Important**: `unsafe` doesn't disable the borrow checker or other checks. It only allows these five specific operations.

## Raw Pointers

Raw pointers `*const T` and `*mut T` bypass Rust's borrowing rules:

```rust
fn main() {
    let mut num = 5;

    // Creating raw pointers is safe
    let r1 = &num as *const i32;
    let r2 = &mut num as *mut i32;

    // Dereferencing requires unsafe
    unsafe {
        println!("r1 is: {}", *r1);
        println!("r2 is: {}", *r2);
    }
}
```

### Why Raw Pointers?

- Interfacing with C code (FFI)
- Building unsafe abstractions
- Performance-critical code
- Working with memory-mapped I/O

```rust
// Creating a pointer to arbitrary address (dangerous!)
let address = 0x012345usize;
let ptr = address as *const i32;

unsafe {
    // This would likely crash or cause undefined behavior
    // println!("{}", *ptr);
}
```

## Unsafe Functions

Some functions are inherently unsafe:

```rust
unsafe fn dangerous() {
    // Unsafe operations here
}

fn main() {
    unsafe {
        dangerous();
    }
}
```

### Safe Abstraction Over Unsafe

Wrap unsafe code in safe APIs:

```rust
fn split_at_mut(values: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = values.len();
    let ptr = values.as_mut_ptr();

    assert!(mid <= len);

    unsafe {
        (
            std::slice::from_raw_parts_mut(ptr, mid),
            std::slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}

fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    let (left, right) = split_at_mut(&mut v, 2);
    println!("{:?}, {:?}", left, right);
}
```

The function is safe to call even though it uses unsafe internally.

## FFI: Foreign Function Interface

Calling C code requires `extern` and `unsafe`:

```rust
extern "C" {
    fn abs(input: i32) -> i32;
}

fn main() {
    unsafe {
        println!("Absolute value of -3: {}", abs(-3));
    }
}
```

### Exporting Rust Functions to C

```rust
#[no_mangle]  // Don't mangle the function name
pub extern "C" fn call_from_c() {
    println!("Called from C!");
}
```

## Mutable Static Variables

Global mutable state requires `unsafe`:

```rust
static mut COUNTER: u32 = 0;

fn add_to_counter(inc: u32) {
    unsafe {
        COUNTER += inc;
    }
}

fn main() {
    add_to_counter(3);

    unsafe {
        println!("COUNTER: {}", COUNTER);
    }
}
```

**Warning**: Mutable statics are inherently unsafe due to data races. Prefer `AtomicU32` or other synchronization.

## Unsafe Traits

Some traits are unsafe to implement:

```rust
unsafe trait Dangerous {
    // Implementing this requires upholding invariants
}

unsafe impl Dangerous for i32 {
    // Implementer guarantees safety requirements
}
```

The `Send` and `Sync` traits are examples:

```rust
// Marking a type as safe to send between threads
unsafe impl Send for MyType {}
unsafe impl Sync for MyType {}
```

## Guidelines for Unsafe

### When to Use Unsafe

- FFI with C libraries
- Performance-critical hot paths (after profiling!)
- Building safe abstractions over low-level operations
- Hardware access and OS primitives

### Best Practices

1. **Minimize unsafe blocks** - Keep them as small as possible
2. **Document invariants** - Explain what must be true for safety
3. **Encapsulate** - Provide safe APIs around unsafe operations
4. **Test thoroughly** - Unsafe code needs extra testing

```rust
/// Reads a value from the given pointer.
///
/// # Safety
///
/// - `ptr` must be valid and properly aligned
/// - `ptr` must point to initialized memory
/// - The memory must not be mutated while this reference exists
unsafe fn read_ptr<T>(ptr: *const T) -> T
where
    T: Copy,
{
    *ptr
}
```

### What Unsafe Does NOT Do

- Doesn't disable the borrow checker
- Doesn't allow memory leaks
- Doesn't allow data races (they're still UB)
- Doesn't make your code "not Rust"

## Common Unsafe Patterns

### Null Pointer Check

```rust
fn safe_deref(ptr: *const i32) -> Option<i32> {
    if ptr.is_null() {
        None
    } else {
        unsafe { Some(*ptr) }
    }
}
```

### Transmute (Type Punning)

```rust
fn main() {
    let num: u32 = 42;

    // Reinterpret bits as different type (very dangerous!)
    let bytes: [u8; 4] = unsafe { std::mem::transmute(num) };
    println!("{:?}", bytes);
}
```

## Key Takeaways

1. `unsafe` unlocks five specific capabilities, not everything
2. Raw pointers bypass borrow checking but still need valid memory
3. FFI requires unsafe because Rust can't verify external code
4. Wrap unsafe code in safe abstractions whenever possible
5. Document safety requirements with `# Safety` doc comments
6. Minimize unsafe and test it thoroughly

In the next lesson, we'll explore Rust's macro system.
