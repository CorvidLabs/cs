---
title: impl Trait and Trait Objects
order: 4
estimatedMinutes: 30
---

# impl Trait and Trait Objects

Rust offers two ways to work with traits polymorphically: static dispatch with `impl Trait` and dynamic dispatch with trait objects (`dyn Trait`).

## impl Trait in Parameters

Use `impl Trait` to accept any type implementing a trait:

```rust
use std::fmt::Display;

// Accept any type implementing Display
fn print(item: impl Display) {
    println!("{}", item);
}

// Equivalent to:
fn print_generic<T: Display>(item: T) {
    println!("{}", item);
}

fn main() {
    print(42);
    print("hello");
    print(3.14);
}
```

## impl Trait in Return Types

Return a type without naming it:

```rust
fn make_iterator() -> impl Iterator<Item = i32> {
    (0..10).filter(|x| x % 2 == 0)
}

fn main() {
    for n in make_iterator() {
        println!("{}", n);
    }
}
```

The actual type is complex (`Filter<Range<i32>, ...>`), but `impl Iterator` hides it.

## Limitations of impl Trait Returns

You can only return one concrete type:

```rust
use std::fmt::Display;

// ERROR: Returns different types
fn get_displayable(flag: bool) -> impl Display {
    if flag {
        42      // Returns i32
    } else {
        "hello" // Returns &str - DIFFERENT TYPE!
    }
}
```

For different types, use trait objects.

## Trait Objects with dyn

Trait objects enable runtime polymorphism:

```rust
trait Animal {
    fn speak(&self) -> String;
}

struct Dog { name: String }
struct Cat { name: String }

impl Animal for Dog {
    fn speak(&self) -> String {
        format!("{} says woof!", self.name)
    }
}

impl Animal for Cat {
    fn speak(&self) -> String {
        format!("{} says meow!", self.name)
    }
}

fn main() {
    // Box<dyn Animal> can hold any Animal implementor
    let animals: Vec<Box<dyn Animal>> = vec![
        Box::new(Dog { name: String::from("Rex") }),
        Box::new(Cat { name: String::from("Whiskers") }),
    ];

    for animal in &animals {
        println!("{}", animal.speak());
    }
}
```

## Reference Trait Objects

You don't always need `Box`:

```rust
trait Drawable {
    fn draw(&self);
}

struct Circle;
struct Square;

impl Drawable for Circle {
    fn draw(&self) { println!("Drawing circle"); }
}

impl Drawable for Square {
    fn draw(&self) { println!("Drawing square"); }
}

fn draw_shape(shape: &dyn Drawable) {
    shape.draw();
}

fn main() {
    let circle = Circle;
    let square = Square;

    draw_shape(&circle);
    draw_shape(&square);
}
```

## Static vs Dynamic Dispatch

### Static Dispatch (impl Trait / generics)

```rust
// Compile-time: creates print_i32, print_str, etc.
fn print<T: std::fmt::Display>(item: T) {
    println!("{}", item);
}
```

- Monomorphization at compile time
- No runtime cost
- Larger binary (code for each type)
- Type known at compile time

### Dynamic Dispatch (dyn Trait)

```rust
// Runtime: one function, dispatch through vtable
fn print_dynamic(item: &dyn std::fmt::Display) {
    println!("{}", item);
}
```

- Virtual table lookup at runtime
- Small runtime cost (pointer indirection)
- Smaller binary
- Type resolved at runtime

## How Trait Objects Work

```
Trait object (&dyn Trait) memory layout:

+-------------+
| data_ptr    | ──────► Actual data (Dog, Cat, etc.)
+-------------+
| vtable_ptr  | ──────► Virtual table
+-------------+

Virtual table (vtable):
+---------------+
| drop          | ──► destructor
+---------------+
| size          |
+---------------+
| align         |
+---------------+
| speak         | ──► Dog::speak or Cat::speak
+---------------+
```

## Object Safety

Not all traits can be used as trait objects. A trait is **object safe** if:

1. It doesn't return `Self`
2. It has no generic methods

```rust
// Object safe
trait Draw {
    fn draw(&self);
}

// NOT object safe - returns Self
trait Clone {
    fn clone(&self) -> Self;
}

// NOT object safe - generic method
trait Convert {
    fn convert<T>(&self) -> T;
}

// Workaround: use where Self: Sized to exclude from trait objects
trait Cloneable {
    fn clone_box(&self) -> Box<dyn Cloneable>;

    // This method is excluded from trait objects
    fn clone_self(&self) -> Self
    where
        Self: Sized;
}
```

## Common Trait Object Patterns

### Pattern: Heterogeneous collection

```rust
trait Plugin {
    fn name(&self) -> &str;
    fn execute(&self);
}

struct Logger;
struct Metrics;

impl Plugin for Logger {
    fn name(&self) -> &str { "Logger" }
    fn execute(&self) { println!("Logging..."); }
}

impl Plugin for Metrics {
    fn name(&self) -> &str { "Metrics" }
    fn execute(&self) { println!("Recording metrics..."); }
}

fn main() {
    let plugins: Vec<Box<dyn Plugin>> = vec![
        Box::new(Logger),
        Box::new(Metrics),
    ];

    for plugin in &plugins {
        println!("Running: {}", plugin.name());
        plugin.execute();
    }
}
```

### Pattern: Strategy pattern

```rust
trait SortStrategy {
    fn sort(&self, data: &mut [i32]);
}

struct QuickSort;
struct BubbleSort;

impl SortStrategy for QuickSort {
    fn sort(&self, data: &mut [i32]) {
        data.sort(); // Using built-in for simplicity
    }
}

impl SortStrategy for BubbleSort {
    fn sort(&self, data: &mut [i32]) {
        // Bubble sort implementation
        let n = data.len();
        for i in 0..n {
            for j in 0..n - 1 - i {
                if data[j] > data[j + 1] {
                    data.swap(j, j + 1);
                }
            }
        }
    }
}

struct Sorter {
    strategy: Box<dyn SortStrategy>,
}

impl Sorter {
    fn new(strategy: Box<dyn SortStrategy>) -> Self {
        Sorter { strategy }
    }

    fn sort(&self, data: &mut [i32]) {
        self.strategy.sort(data);
    }
}
```

### Pattern: Callback / Event handlers

```rust
trait EventHandler {
    fn handle(&self, event: &str);
}

struct Button {
    on_click: Option<Box<dyn EventHandler>>,
}

impl Button {
    fn new() -> Self {
        Button { on_click: None }
    }

    fn set_handler(&mut self, handler: Box<dyn EventHandler>) {
        self.on_click = Some(handler);
    }

    fn click(&self) {
        if let Some(handler) = &self.on_click {
            handler.handle("click");
        }
    }
}
```

## When to Use Each

### Use impl Trait / Generics when:

- Performance is critical
- You know the concrete type at compile time
- You want type-specific optimizations
- Binary size isn't a concern

### Use dyn Trait when:

- You need heterogeneous collections
- Types are determined at runtime
- You want smaller binary size
- You're building plugin systems or callbacks

## Combining Both

```rust
trait Processor {
    fn process(&self, data: &str) -> String;
}

// Static dispatch for performance
fn process_fast<P: Processor>(processor: &P, data: &str) -> String {
    processor.process(data)
}

// Dynamic dispatch for flexibility
fn process_dynamic(processor: &dyn Processor, data: &str) -> String {
    processor.process(data)
}

// Store multiple processors
struct Pipeline {
    processors: Vec<Box<dyn Processor>>,
}

impl Pipeline {
    fn run(&self, data: &str) -> String {
        self.processors.iter().fold(
            data.to_string(),
            |acc, p| p.process(&acc)
        )
    }
}
```

## Key Takeaways

1. **`impl Trait`** provides static dispatch (zero cost, monomorphized)
2. **`dyn Trait`** provides dynamic dispatch (runtime flexibility)
3. **Trait objects use fat pointers** (data + vtable)
4. **Object safety rules** determine which traits can be trait objects
5. **Use Box<dyn Trait>** for owned trait objects
6. **Use &dyn Trait** for borrowed trait objects
7. **Choose based on needs**: performance vs flexibility

You've completed the traits module! Traits and generics are fundamental to Rust's type system. Next, we'll explore error handling patterns in depth.
