---
title: Generics
order: 2
estimatedMinutes: 25
---

# Generics: Writing Flexible Code

Generics let you write code that works with multiple types while maintaining type safety. They're compile-time abstractions with zero runtime cost.

## The Problem Generics Solve

Without generics, you'd need separate functions for each type:

```rust
fn largest_i32(list: &[i32]) -> i32 {
    let mut largest = list[0];
    for &item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

fn largest_char(list: &[char]) -> char {
    let mut largest = list[0];
    for &item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```

Generics eliminate this duplication.

## Generic Functions

```rust
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0];
    for &item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("Largest number: {}", largest(&numbers));

    let chars = vec!['y', 'm', 'a', 'q'];
    println!("Largest char: {}", largest(&chars));
}
```

The `<T: PartialOrd + Copy>` syntax specifies that `T` must implement both traits.

## Generic Type Parameters

Use descriptive names for complex generics:

```rust
// Single type parameter
fn identity<T>(value: T) -> T {
    value
}

// Multiple type parameters
fn swap<First, Second>(pair: (First, Second)) -> (Second, First) {
    (pair.1, pair.0)
}

// Descriptive names
fn transform<Input, Output>(value: Input, f: fn(Input) -> Output) -> Output {
    f(value)
}

fn main() {
    let x = identity(5);
    let swapped = swap((1, "hello"));
    let doubled = transform(5, |x| x * 2);

    println!("{} {:?} {}", x, swapped, doubled);
}
```

## Generic Structs

```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn new(x: T, y: T) -> Point<T> {
        Point { x, y }
    }

    fn x(&self) -> &T {
        &self.x
    }
}

fn main() {
    let integer_point = Point::new(5, 10);
    let float_point = Point::new(1.0, 4.0);

    println!("x = {}", integer_point.x());
    println!("x = {}", float_point.x());
}
```

## Multiple Type Parameters

```rust
struct Point<X, Y> {
    x: X,
    y: Y,
}

impl<X, Y> Point<X, Y> {
    fn mixup<X2, Y2>(self, other: Point<X2, Y2>) -> Point<X, Y2> {
        Point {
            x: self.x,
            y: other.y,
        }
    }
}

fn main() {
    let p1 = Point { x: 5, y: 10.4 };
    let p2 = Point { x: "Hello", y: 'c' };

    let p3 = p1.mixup(p2);
    println!("p3.x = {}, p3.y = {}", p3.x, p3.y);  // 5, c
}
```

## Generic Enums

You've already used generic enums:

```rust
// From the standard library
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}

// Your own generic enum
enum Tree<T> {
    Empty,
    Node {
        value: T,
        left: Box<Tree<T>>,
        right: Box<Tree<T>>,
    },
}

fn main() {
    let some_number: Option<i32> = Some(5);
    let some_string: Option<String> = Some(String::from("hello"));

    let success: Result<i32, &str> = Ok(42);
    let failure: Result<i32, &str> = Err("something went wrong");
}
```

## Method Implementations on Specific Types

```rust
struct Point<T> {
    x: T,
    y: T,
}

// Methods for all Point<T>
impl<T> Point<T> {
    fn new(x: T, y: T) -> Point<T> {
        Point { x, y }
    }
}

// Methods only for Point<f64>
impl Point<f64> {
    fn distance_from_origin(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

fn main() {
    let p = Point::new(3.0, 4.0);
    println!("Distance: {}", p.distance_from_origin());  // 5.0

    let p2 = Point::new(3, 4);
    // p2.distance_from_origin();  // ERROR! Not available for Point<i32>
}
```

## Const Generics

Generics over constant values:

```rust
struct ArrayWrapper<T, const N: usize> {
    data: [T; N],
}

impl<T, const N: usize> ArrayWrapper<T, N> {
    fn len(&self) -> usize {
        N
    }
}

fn main() {
    let arr = ArrayWrapper { data: [1, 2, 3, 4, 5] };
    println!("Length: {}", arr.len());  // 5

    let arr2 = ArrayWrapper { data: [1.0, 2.0, 3.0] };
    println!("Length: {}", arr2.len());  // 3
}
```

## Generic Functions with References

Careful with lifetimes:

```rust
// Lifetimes work with generics
fn longest<'a, T>(x: &'a T, y: &'a T) -> &'a T
where
    T: PartialOrd,
{
    if x > y { x } else { y }
}

fn main() {
    let a = 5;
    let b = 10;
    let result = longest(&a, &b);
    println!("Longest: {}", result);
}
```

## Monomorphization: Zero-Cost Generics

Rust compiles generics by generating specialized code for each type used:

```rust
fn print_type<T: std::fmt::Display>(value: T) {
    println!("{}", value);
}

fn main() {
    print_type(5);        // Generates print_type_i32
    print_type(3.14);     // Generates print_type_f64
    print_type("hello");  // Generates print_type_str
}

// The compiler generates something like:
// fn print_type_i32(value: i32) { println!("{}", value); }
// fn print_type_f64(value: f64) { println!("{}", value); }
// fn print_type_str(value: &str) { println!("{}", value); }
```

This means:
- No runtime overhead
- Type-specific optimizations
- Larger binary size (code duplication)

## Common Generic Patterns

### Pattern: Builder with generics

```rust
struct Request<T> {
    body: T,
    headers: Vec<(String, String)>,
}

impl<T> Request<T> {
    fn new(body: T) -> Self {
        Request {
            body,
            headers: Vec::new(),
        }
    }

    fn header(mut self, key: &str, value: &str) -> Self {
        self.headers.push((key.to_string(), value.to_string()));
        self
    }
}

fn main() {
    let request = Request::new("Hello")
        .header("Content-Type", "text/plain")
        .header("Authorization", "Bearer token");
}
```

### Pattern: Generic conversion

```rust
struct Wrapper<T>(T);

impl<T> Wrapper<T> {
    fn into_inner(self) -> T {
        self.0
    }

    fn map<U, F>(self, f: F) -> Wrapper<U>
    where
        F: FnOnce(T) -> U,
    {
        Wrapper(f(self.0))
    }
}

fn main() {
    let wrapped = Wrapper(5);
    let doubled = wrapped.map(|x| x * 2);
    println!("{}", doubled.into_inner());  // 10
}
```

### Pattern: Generic collections

```rust
struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }

    fn push(&mut self, item: T) {
        self.items.push(item);
    }

    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    fn peek(&self) -> Option<&T> {
        self.items.last()
    }

    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}

fn main() {
    let mut stack: Stack<i32> = Stack::new();
    stack.push(1);
    stack.push(2);
    stack.push(3);

    while let Some(value) = stack.pop() {
        println!("{}", value);  // 3, 2, 1
    }
}
```

## When to Use Generics

Use generics when:
- The same logic applies to multiple types
- You want to avoid code duplication
- The caller should choose the type
- You want zero-runtime-cost abstraction

Avoid generics when:
- The logic differs significantly per type
- You need dynamic dispatch (use trait objects)
- It makes the code harder to understand

## Key Takeaways

1. **Generics enable code reuse** across types
2. **Use descriptive type parameter names** for clarity
3. **Structs, enums, and functions** can all be generic
4. **Implement methods on specific types** with `impl Point<f64>`
5. **Const generics** allow generics over values
6. **Monomorphization** means zero runtime cost
7. **Generics + traits** create powerful, flexible abstractions

In the next lesson, we'll dive deep into trait bounds - the key to constraining generic types.
