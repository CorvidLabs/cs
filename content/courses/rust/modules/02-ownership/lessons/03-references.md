---
title: References and Slices
order: 3
estimatedMinutes: 25
---

# References In Depth

Now that you understand borrowing, let's explore reference types more deeply, including the powerful slice type.

## Reference Types Recap

Rust has two types of references:

```rust
fn main() {
    let mut s = String::from("hello");

    let immut_ref: &String = &s;        // Immutable reference
    println!("{}", immut_ref);

    let mut_ref: &mut String = &mut s;  // Mutable reference
    mut_ref.push_str(" world");
    println!("{}", mut_ref);
}
```

## Dereferencing

To access the value behind a reference, use the dereference operator `*`:

```rust
fn main() {
    let x = 5;
    let y = &x;

    // y is a reference, *y is the value
    assert_eq!(5, x);
    assert_eq!(5, *y);

    // This works too (Rust auto-dereferences for comparisons)
    assert_eq!(x, *y);
}
```

For methods and field access, Rust auto-dereferences:

```rust
fn main() {
    let s = String::from("hello");
    let r = &s;

    // These are equivalent:
    println!("Length: {}", (*r).len());
    println!("Length: {}", r.len());  // Auto-deref
}
```

## Mutable Reference Modification

With mutable references, you must dereference to assign a new value:

```rust
fn main() {
    let mut x = 5;
    let y = &mut x;

    *y += 1;  // Dereference to modify

    println!("x = {}", x);  // Prints: x = 6
}
```

## String Slices

A **slice** is a reference to a contiguous sequence of elements. The most common is the string slice `&str`:

```rust
fn main() {
    let s = String::from("hello world");

    let hello: &str = &s[0..5];   // Slice of first 5 bytes
    let world: &str = &s[6..11];  // Slice of last 5 bytes

    println!("{} {}", hello, world);
}
```

## Slice Syntax

```rust
fn main() {
    let s = String::from("hello");

    let slice1 = &s[0..2];   // "he" - indices 0 and 1
    let slice2 = &s[..2];    // "he" - start from beginning
    let slice3 = &s[3..];    // "lo" - go to end
    let slice4 = &s[..];     // "hello" - entire string

    println!("{} {} {} {}", slice1, slice2, slice3, slice4);
}
```

## Visualizing String Slices

```
String and Slice Memory Layout:

    let s = String::from("hello world");
    let hello = &s[0..5];
    let world = &s[6..11];

    Stack:                              Heap:
    ┌──────────────┐                   ┌─────────────────────┐
    │ s            │                   │ h e l l o   w o r l d │
    │ ptr ─────────┼──────────────────►│ 0 1 2 3 4 5 6 7 8 9 10│
    │ len: 11      │                   └─────────────────────┘
    │ cap: 11      │                         ▲         ▲
    └──────────────┘                         │         │
                                             │         │
    ┌──────────────┐                         │         │
    │ hello        │                         │         │
    │ ptr ─────────┼─────────────────────────┘         │
    │ len: 5       │                                   │
    └──────────────┘                                   │
                                                       │
    ┌──────────────┐                                   │
    │ world        │                                   │
    │ ptr ─────────┼───────────────────────────────────┘
    │ len: 5       │
    └──────────────┘
```

## String Literals Are Slices

String literals are actually slices:

```rust
fn main() {
    let s: &str = "Hello, world!";

    // s is a slice pointing to data embedded in the binary
    // It's immutable and has a static lifetime
}
```

## &String vs &str

Understanding the difference is crucial:

```rust
fn main() {
    let s = String::from("hello");

    // &String: reference to a String object
    let ref_string: &String = &s;

    // &str: slice of string data (more flexible)
    let ref_str: &str = &s;  // String can coerce to &str
    let ref_str2: &str = &s[..];  // Explicit slice
    let ref_str3: &str = "hello";  // Literal

    print_str(ref_str);
    print_str(ref_string);  // &String coerces to &str
}

fn print_str(s: &str) {
    println!("{}", s);
}
```

**Best Practice**: Prefer `&str` in function parameters - it accepts both `&String` and `&str`.

## Slices Prevent Bugs

Slices tie the reference to the original data, preventing bugs:

```rust
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}

fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s);

    // s.clear();  // ERROR! Cannot modify while word borrows s

    println!("First word: {}", word);

    s.clear();  // OK after word is done being used
}
```

The compiler prevents use-after-modification bugs!

## Array Slices

Slices work on arrays too:

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];

    let slice: &[i32] = &a[1..3];  // [2, 3]

    println!("Slice: {:?}", slice);

    // Works with any array type
    let bytes: &[u8] = &[0u8; 100][10..20];
}
```

## Slice Methods

Slices have many useful methods:

```rust
fn main() {
    let numbers = [1, 2, 3, 4, 5];
    let slice = &numbers[..];

    println!("Length: {}", slice.len());
    println!("Is empty: {}", slice.is_empty());
    println!("First: {:?}", slice.first());
    println!("Last: {:?}", slice.last());

    // Iteration
    for num in slice.iter() {
        println!("  {}", num);
    }

    // Contains
    println!("Contains 3: {}", slice.contains(&3));
}
```

## Mutable Slices

You can have mutable slices too:

```rust
fn main() {
    let mut a = [1, 2, 3, 4, 5];

    let slice: &mut [i32] = &mut a[..];

    slice[0] = 10;
    slice[4] = 50;

    println!("{:?}", a);  // [10, 2, 3, 4, 50]
}
```

## Splitting Slices

Slices can be split, allowing simultaneous mutable borrows:

```rust
fn main() {
    let mut v = [1, 2, 3, 4, 5, 6];

    // Split at index 3
    let (left, right) = v.split_at_mut(3);

    left[0] = 10;   // Modify left half
    right[0] = 40;  // Modify right half simultaneously

    println!("{:?}", v);  // [10, 2, 3, 40, 5, 6]
}
```

## Reference Rules Applied to Slices

All borrowing rules apply to slices:

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s[0..2];  // Immutable borrow of part
    let r2 = &s[3..5];  // Another immutable borrow

    println!("{} {}", r1, r2);  // OK

    // s.push_str("!");  // ERROR while slices exist

    // After r1 and r2 are done:
    s.push_str("!");  // OK
}
```

## Common Slice Patterns

### Pattern 1: Processing chunks

```rust
fn process_chunks(data: &[u8]) {
    for chunk in data.chunks(3) {
        println!("Chunk: {:?}", chunk);
    }
}

fn main() {
    let data = [1, 2, 3, 4, 5, 6, 7, 8];
    process_chunks(&data);
}
```

### Pattern 2: Window iteration

```rust
fn find_pair_sum(numbers: &[i32], target: i32) -> Option<(i32, i32)> {
    for window in numbers.windows(2) {
        if window[0] + window[1] == target {
            return Some((window[0], window[1]));
        }
    }
    None
}
```

### Pattern 3: Binary search

```rust
fn main() {
    let sorted = [1, 3, 5, 7, 9, 11, 13];

    match sorted.binary_search(&7) {
        Ok(index) => println!("Found at index {}", index),
        Err(index) => println!("Not found, would insert at {}", index),
    }
}
```

## References Summary

| Type | Syntax | Description |
|------|--------|-------------|
| `&T` | `&value` | Immutable reference |
| `&mut T` | `&mut value` | Mutable reference |
| `&str` | `&s[..]` or `"literal"` | String slice |
| `&[T]` | `&arr[..]` | Array/vector slice |
| `&mut [T]` | `&mut arr[..]` | Mutable slice |

## Key Takeaways

1. **Dereference with `*`** to access values, but Rust often auto-dereferences
2. **Slices are fat pointers** containing a pointer and a length
3. **`&str` is preferred over `&String`** in function parameters for flexibility
4. **String literals are `&'static str`** - slices with static lifetime
5. **Slices enforce borrowing rules** preventing use-after-modification bugs
6. **Mutable slices can be split** for simultaneous access to different parts
7. **Slices work on any contiguous data** - strings, arrays, vectors

In the next lesson, we'll explore lifetimes - how Rust tracks how long references are valid.
