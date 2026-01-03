---
title: Common Standard Library Traits
order: 3
estimatedMinutes: 25
---

# Common Standard Library Traits

Rust's standard library defines many traits that are used pervasively throughout the ecosystem. Understanding these traits is essential for writing idiomatic Rust code.

## Display and Debug

These traits control how types are formatted as strings.

### Debug

`Debug` is for programmer-facing output. It can be automatically derived:

```rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 10, y: 20 };
    println!("{:?}", p);   // Point { x: 10, y: 20 }
    println!("{:#?}", p);  // Pretty-printed version
}
```

### Display

`Display` is for user-facing output and must be implemented manually:

```rust
use std::fmt;

struct Point {
    x: i32,
    y: i32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    let p = Point { x: 10, y: 20 };
    println!("{}", p);  // (10, 20)
}
```

## Clone and Copy

These traits control how values are duplicated.

### Clone

`Clone` creates an explicit deep copy:

```rust
#[derive(Clone, Debug)]
struct Document {
    title: String,
    content: String,
}

fn main() {
    let doc1 = Document {
        title: String::from("Report"),
        content: String::from("..."),
    };

    let doc2 = doc1.clone();  // Explicit copy
    println!("{:?}", doc1);   // doc1 still valid
    println!("{:?}", doc2);
}
```

### Copy

`Copy` allows implicit bitwise copying (only for simple types):

```rust
#[derive(Copy, Clone, Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p1 = Point { x: 10, y: 20 };
    let p2 = p1;  // Implicit copy, not move
    println!("{:?}", p1);  // p1 still valid!
}
```

`Copy` requires `Clone` and can only be implemented on types that are "stack-only" (no heap allocation).

## Comparison Traits

### PartialEq and Eq

`PartialEq` enables `==` and `!=` comparisons:

```rust
#[derive(PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p1 = Point { x: 1, y: 2 };
    let p2 = Point { x: 1, y: 2 };
    println!("{}", p1 == p2);  // true
}
```

`Eq` is a marker trait indicating that equality is reflexive (every value equals itself). `f32` and `f64` implement `PartialEq` but not `Eq` because `NaN != NaN`.

### PartialOrd and Ord

`PartialOrd` enables `<`, `>`, `<=`, `>=`:

```rust
#[derive(PartialEq, PartialOrd)]
struct Score(i32);

fn main() {
    let a = Score(100);
    let b = Score(200);
    println!("{}", a < b);  // true
}
```

`Ord` indicates total ordering (every pair is comparable). Required for `BTreeMap` keys and sorting.

## Default

`Default` provides a default value for a type:

```rust
#[derive(Default, Debug)]
struct Config {
    verbose: bool,
    max_connections: u32,
    timeout_seconds: u64,
}

fn main() {
    let config = Config::default();
    println!("{:?}", config);
    // Config { verbose: false, max_connections: 0, timeout_seconds: 0 }

    // Partial initialization with defaults
    let custom = Config {
        verbose: true,
        ..Default::default()
    };
}
```

## From and Into

These traits handle type conversions.

### From

`From` defines how to create a type from another:

```rust
struct Millimeters(u32);

impl From<u32> for Millimeters {
    fn from(value: u32) -> Self {
        Millimeters(value)
    }
}

fn main() {
    let mm = Millimeters::from(100);
    let mm2: Millimeters = 200.into();  // Into comes free with From
}
```

### Into

You get `Into` for free when you implement `From`:

```rust
fn process_length(length: impl Into<Millimeters>) {
    let mm: Millimeters = length.into();
    // ...
}
```

## Iterator

The `Iterator` trait powers Rust's for loops and functional-style iteration:

```rust
struct Counter {
    current: u32,
    max: u32,
}

impl Counter {
    fn new(max: u32) -> Self {
        Counter { current: 0, max }
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.current < self.max {
            self.current += 1;
            Some(self.current)
        } else {
            None
        }
    }
}

fn main() {
    for n in Counter::new(5) {
        println!("{}", n);  // 1, 2, 3, 4, 5
    }
}
```

## Drop

`Drop` runs code when a value goes out of scope:

```rust
struct FileHandle {
    name: String,
}

impl Drop for FileHandle {
    fn drop(&mut self) {
        println!("Closing file: {}", self.name);
    }
}

fn main() {
    let handle = FileHandle {
        name: String::from("data.txt"),
    };
    // "Closing file: data.txt" prints when handle goes out of scope
}
```

## Derivable Traits Summary

Many traits can be automatically derived:

```rust
#[derive(
    Debug,      // {:?} formatting
    Clone,      // .clone() method
    Copy,       // Implicit copying
    PartialEq,  // == and !=
    Eq,         // Marker for total equality
    PartialOrd, // <, >, <=, >=
    Ord,        // Total ordering
    Hash,       // Can be hashed (for HashMap keys)
    Default,    // Default::default()
)]
struct Point {
    x: i32,
    y: i32,
}
```

## Key Takeaways

1. `Debug` (derivable) is for developer output, `Display` (manual) is for users
2. `Clone` is explicit copying, `Copy` is implicit (for simple types only)
3. `PartialEq`/`Eq` enable equality, `PartialOrd`/`Ord` enable ordering
4. `Default` provides default values for types
5. `From`/`Into` handle type conversions
6. `Iterator` enables custom iteration
7. `Drop` runs cleanup code when values are dropped

In the next lesson, we'll explore trait objects for runtime polymorphism.
