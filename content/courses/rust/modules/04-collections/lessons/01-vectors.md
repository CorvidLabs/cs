---
title: Vectors
order: 1
estimatedMinutes: 25
---

# Vectors: Growable Arrays

Vectors (`Vec<T>`) are the most commonly used collection in Rust. They store values of the same type in contiguous memory and can grow or shrink dynamically.

## Creating Vectors

```rust
fn main() {
    // Create an empty vector
    let v1: Vec<i32> = Vec::new();

    // Create with initial values using vec! macro
    let v2 = vec![1, 2, 3, 4, 5];

    // Create with capacity (pre-allocate without values)
    let v3: Vec<i32> = Vec::with_capacity(10);

    println!("v1: {:?}, v2: {:?}", v1, v2);
    println!("v3 len: {}, capacity: {}", v3.len(), v3.capacity());
}
```

## Adding Elements

```rust
fn main() {
    let mut v = Vec::new();

    // push adds to the end
    v.push(1);
    v.push(2);
    v.push(3);

    println!("{:?}", v);  // [1, 2, 3]

    // insert at specific index
    v.insert(1, 10);  // Insert 10 at index 1
    println!("{:?}", v);  // [1, 10, 2, 3]

    // extend with another iterator
    v.extend([4, 5, 6]);
    println!("{:?}", v);  // [1, 10, 2, 3, 4, 5, 6]
}
```

## Accessing Elements

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    // Indexing - panics if out of bounds!
    let third = v[2];
    println!("Third element: {}", third);

    // Safe access with get() - returns Option
    match v.get(2) {
        Some(third) => println!("Third: {}", third),
        None => println!("No third element"),
    }

    // Out of bounds
    // let bad = v[100];  // PANIC!
    let safe = v.get(100);  // Returns None
    println!("Element 100: {:?}", safe);

    // First and last
    println!("First: {:?}", v.first());  // Some(&1)
    println!("Last: {:?}", v.last());    // Some(&5)
}
```

## Removing Elements

```rust
fn main() {
    let mut v = vec![1, 2, 3, 4, 5];

    // pop removes and returns the last element
    let last = v.pop();
    println!("Popped: {:?}, remaining: {:?}", last, v);

    // remove at index (shifts remaining elements)
    let removed = v.remove(1);  // Remove element at index 1
    println!("Removed: {}, remaining: {:?}", removed, v);

    // swap_remove is faster (doesn't preserve order)
    let mut v2 = vec![1, 2, 3, 4, 5];
    let swapped = v2.swap_remove(1);  // Swaps with last, then removes
    println!("Swap removed: {}, remaining: {:?}", swapped, v2);

    // clear removes all elements
    v.clear();
    println!("After clear: {:?}", v);
}
```

## Iterating Over Vectors

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    // Immutable iteration
    for item in &v {
        println!("{}", item);
    }

    // The vector is still usable
    println!("Vector: {:?}", v);

    // Mutable iteration
    let mut v2 = vec![1, 2, 3];
    for item in &mut v2 {
        *item *= 2;
    }
    println!("Doubled: {:?}", v2);

    // Consuming iteration (moves values out)
    let v3 = vec![String::from("a"), String::from("b")];
    for s in v3 {
        println!("Got: {}", s);
    }
    // v3 is no longer accessible
}
```

## Vector Slices

Vectors can be borrowed as slices:

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    // Full slice
    let slice: &[i32] = &v;

    // Partial slice
    let middle = &v[1..4];
    println!("Middle: {:?}", middle);  // [2, 3, 4]

    // Pass to functions expecting slices
    print_slice(&v);
    print_slice(&v[1..3]);
}

fn print_slice(s: &[i32]) {
    println!("{:?}", s);
}
```

## Vector Memory Layout

```
let v = vec![1, 2, 3];

Stack:                           Heap:
+--------+                      +---+---+---+
| ptr    | -------------------> | 1 | 2 | 3 |
| len: 3 |                      +---+---+---+
| cap: 3 |
+--------+

After v.push(4):

Stack:                           Heap (might be reallocated):
+--------+                      +---+---+---+---+---+---+---+---+
| ptr    | -------------------> | 1 | 2 | 3 | 4 |   |   |   |   |
| len: 4 |                      +---+---+---+---+---+---+---+---+
| cap: 8 |                      (capacity doubled)
+--------+
```

## Capacity and Reallocation

```rust
fn main() {
    let mut v = Vec::new();

    // Observe capacity growth
    for i in 0..20 {
        v.push(i);
        println!("len: {:2}, capacity: {:2}", v.len(), v.capacity());
    }

    // Pre-allocate to avoid reallocations
    let mut v2 = Vec::with_capacity(20);
    for i in 0..20 {
        v2.push(i);
    }
    println!("Final capacity: {}", v2.capacity());  // Stays at 20

    // Shrink to fit
    v2.shrink_to_fit();
    println!("After shrink: {}", v2.capacity());
}
```

## Common Vector Operations

```rust
fn main() {
    let mut v = vec![3, 1, 4, 1, 5, 9, 2, 6];

    // Length and empty check
    println!("Length: {}", v.len());
    println!("Is empty: {}", v.is_empty());

    // Contains
    println!("Contains 4: {}", v.contains(&4));

    // Sort
    v.sort();
    println!("Sorted: {:?}", v);

    // Reverse
    v.reverse();
    println!("Reversed: {:?}", v);

    // Dedup (remove consecutive duplicates - sort first!)
    let mut v2 = vec![1, 1, 2, 2, 2, 3, 3];
    v2.dedup();
    println!("Deduped: {:?}", v2);  // [1, 2, 3]

    // Retain (filter in place)
    let mut v3 = vec![1, 2, 3, 4, 5, 6];
    v3.retain(|&x| x % 2 == 0);
    println!("Even only: {:?}", v3);  // [2, 4, 6]
}
```

## Vectors and Ownership

```rust
fn main() {
    let v = vec![String::from("hello"), String::from("world")];

    // Moving out of a vector by index isn't allowed
    // let s = v[0];  // ERROR! Can't move out of indexed content

    // Use swap_remove or pop to take ownership
    let mut v2 = vec![String::from("hello"), String::from("world")];
    let s = v2.swap_remove(0);
    println!("Got: {}, remaining: {:?}", s, v2);

    // Or use references
    let s_ref = &v[0];
    println!("Reference: {}", s_ref);
}
```

## Vectors of Different Types with Enums

```rust
enum Value {
    Int(i32),
    Float(f64),
    Text(String),
}

fn main() {
    let row: Vec<Value> = vec![
        Value::Int(42),
        Value::Float(3.14),
        Value::Text(String::from("hello")),
    ];

    for item in &row {
        match item {
            Value::Int(i) => println!("Integer: {}", i),
            Value::Float(f) => println!("Float: {}", f),
            Value::Text(s) => println!("Text: {}", s),
        }
    }
}
```

## Performance Considerations

```rust
fn main() {
    // Pre-allocate when you know the size
    let mut v: Vec<i32> = Vec::with_capacity(1000);

    // Use extend instead of repeated push
    v.extend(0..1000);  // Faster than 1000 pushes

    // Use drain to iterate and remove efficiently
    let mut v2 = vec![1, 2, 3, 4, 5];
    for item in v2.drain(..) {
        println!("Drained: {}", item);
    }
    // v2 is now empty but still usable
}
```

## Key Takeaways

1. **Vec is a growable array** on the heap
2. **Use `vec!` macro** for initialization with values
3. **Indexing panics on out-of-bounds** - use `.get()` for safety
4. **Iteration borrows by default** - use `&v`, `&mut v`, or consuming `v`
5. **Vectors can be sliced** - use `&v[..]` or `&v[start..end]`
6. **Pre-allocate with `with_capacity`** to avoid reallocations
7. **Use enums** to store different types in one vector

Vectors are fundamental to Rust programming. In the next lesson, we'll explore hash maps for key-value storage.
