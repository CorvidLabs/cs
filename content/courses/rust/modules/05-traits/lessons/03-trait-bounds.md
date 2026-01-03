---
title: Trait Bounds
order: 3
estimatedMinutes: 25
---

# Trait Bounds: Constraining Generics

Trait bounds specify what capabilities a generic type must have. They're how you tell the compiler "this type must be able to do X."

## Basic Trait Bounds

```rust
use std::fmt::Display;

// T must implement Display
fn print_item<T: Display>(item: T) {
    println!("{}", item);
}

// Multiple bounds with +
fn print_and_clone<T: Display + Clone>(item: T) {
    println!("{}", item.clone());
}

fn main() {
    print_item(42);
    print_item("hello");
    print_and_clone(String::from("rust"));
}
```

## Where Clauses

For complex bounds, use `where`:

```rust
use std::fmt::{Debug, Display};

// Without where - hard to read
fn some_function<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> String {
    format!("{}", t)
}

// With where - much cleaner
fn some_function_better<T, U>(t: &T, u: &U) -> String
where
    T: Display + Clone,
    U: Clone + Debug,
{
    format!("{}", t)
}
```

## Bounds on Struct Implementations

```rust
use std::fmt::Display;

struct Pair<T> {
    x: T,
    y: T,
}

// Methods for all T
impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Pair { x, y }
    }
}

// Methods only when T: Display + PartialOrd
impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }
}

fn main() {
    let pair = Pair::new(5, 10);
    pair.cmp_display();

    // This would work too because String implements Display + PartialOrd
    let string_pair = Pair::new(String::from("a"), String::from("b"));
    string_pair.cmp_display();
}
```

## Blanket Implementations

Implement a trait for all types that satisfy certain bounds:

```rust
use std::fmt::Display;

trait Printable {
    fn print(&self);
}

// Implement Printable for any type that implements Display
impl<T: Display> Printable for T {
    fn print(&self) {
        println!("{}", self);
    }
}

fn main() {
    5.print();
    "hello".print();
    3.14.print();
}
```

The standard library uses this pattern extensively:

```rust
// From the standard library:
// impl<T: Display> ToString for T {
//     fn to_string(&self) -> String { ... }
// }

fn main() {
    let s = 42.to_string();  // Works because i32: Display
}
```

## Conditional Method Implementation

```rust
use std::fmt::Display;

struct Container<T> {
    value: T,
}

impl<T> Container<T> {
    fn new(value: T) -> Self {
        Container { value }
    }

    fn get(&self) -> &T {
        &self.value
    }
}

// Only available when T: Display
impl<T: Display> Container<T> {
    fn display(&self) {
        println!("Value: {}", self.value);
    }
}

// Only available when T: Clone
impl<T: Clone> Container<T> {
    fn get_cloned(&self) -> T {
        self.value.clone()
    }
}

// Only available when T: Display + Clone
impl<T: Display + Clone> Container<T> {
    fn display_clone(&self) {
        let cloned = self.value.clone();
        println!("Cloned value: {}", cloned);
    }
}
```

## Common Trait Bound Patterns

### Pattern: Require equality checking

```rust
fn contains<T: PartialEq>(haystack: &[T], needle: &T) -> bool {
    haystack.iter().any(|item| item == needle)
}
```

### Pattern: Require ordering

```rust
fn find_max<T: Ord>(items: &[T]) -> Option<&T> {
    items.iter().max()
}

fn sort_items<T: Ord>(items: &mut [T]) {
    items.sort();
}
```

### Pattern: Require copying

```rust
fn duplicate<T: Copy>(value: T) -> (T, T) {
    (value, value)
}
```

### Pattern: Require debug printing

```rust
use std::fmt::Debug;

fn debug_print<T: Debug>(value: &T) {
    println!("{:?}", value);
}
```

### Pattern: Require hashing

```rust
use std::collections::HashSet;
use std::hash::Hash;

fn unique<T: Hash + Eq>(items: Vec<T>) -> HashSet<T> {
    items.into_iter().collect()
}
```

## Trait Bounds with Lifetimes

Combine trait bounds with lifetime annotations:

```rust
use std::fmt::Display;

fn longest_with_announcement<'a, T>(
    x: &'a str,
    y: &'a str,
    ann: T,
) -> &'a str
where
    T: Display,
{
    println!("Announcement: {}", ann);
    if x.len() > y.len() { x } else { y }
}
```

## The Sized Trait

By default, generic types must be `Sized` (known size at compile time):

```rust
// Implicitly: fn generic<T: Sized>(t: T)
fn generic<T>(t: T) {
    // T must have a known size
}

// Opt out with ?Sized for dynamically sized types
fn generic_unsized<T: ?Sized>(t: &T) {
    // T can be unsized (like str or [i32])
    // Must use reference because size unknown
}

fn main() {
    generic_unsized("hello");  // &str works
    generic_unsized(&[1, 2, 3]);  // &[i32] works
}
```

## Supertraits

Require one trait to implement another:

```rust
use std::fmt::Display;

// OutlinePrint requires Display
trait OutlinePrint: Display {
    fn outline_print(&self) {
        let output = self.to_string();  // Can use Display methods
        let len = output.len();
        println!("{}", "*".repeat(len + 4));
        println!("* {} *", output);
        println!("{}", "*".repeat(len + 4));
    }
}

struct Point { x: i32, y: i32 }

impl Display for Point {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

impl OutlinePrint for Point {}

fn main() {
    let p = Point { x: 1, y: 2 };
    p.outline_print();
}
```

## Associated Types vs Type Parameters

Use associated types when there's one logical type:

```rust
// With associated type (preferred for Iterator)
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}

// With type parameter (allows multiple implementations)
trait ConvertTo<T> {
    fn convert(&self) -> T;
}

// Type parameters allow multiple implementations for same type
impl ConvertTo<i32> for String {
    fn convert(&self) -> i32 { self.parse().unwrap_or(0) }
}

impl ConvertTo<f64> for String {
    fn convert(&self) -> f64 { self.parse().unwrap_or(0.0) }
}
```

## Complex Bound Examples

```rust
use std::fmt::Debug;
use std::hash::Hash;
use std::collections::HashMap;

// Count occurrences of items
fn count_items<T>(items: impl IntoIterator<Item = T>) -> HashMap<T, usize>
where
    T: Hash + Eq,
{
    let mut counts = HashMap::new();
    for item in items {
        *counts.entry(item).or_insert(0) += 1;
    }
    counts
}

// Find duplicates
fn find_duplicates<T>(items: &[T]) -> Vec<&T>
where
    T: Hash + Eq + Debug,
{
    let mut seen = std::collections::HashSet::new();
    let mut duplicates = Vec::new();

    for item in items {
        if !seen.insert(item) {
            duplicates.push(item);
        }
    }

    duplicates
}
```

## Key Takeaways

1. **Trait bounds constrain** what generic types can do
2. **Use `+`** for multiple bounds: `T: Display + Clone`
3. **`where` clauses** improve readability for complex bounds
4. **Blanket implementations** implement traits for all matching types
5. **Conditional implementations** provide methods only when bounds are met
6. **`?Sized`** allows dynamically sized types
7. **Supertraits** require prerequisite trait implementations
8. **Choose associated types or type parameters** based on use case

Trait bounds are essential for writing generic code that's both flexible and type-safe. In the next lesson, we'll explore `impl Trait` syntax for cleaner code.
