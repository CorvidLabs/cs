---
title: Trait Objects and Dynamic Dispatch
order: 4
estimatedMinutes: 20
---

# Trait Objects and Dynamic Dispatch

Sometimes you need to work with values of different types that share common behavior, but you don't know the specific types at compile time. Trait objects provide runtime polymorphism for these situations.

## The Problem: Heterogeneous Collections

Imagine you want a vector of different drawable shapes:

```rust
trait Draw {
    fn draw(&self);
}

struct Circle { radius: f64 }
struct Square { side: f64 }

impl Draw for Circle {
    fn draw(&self) {
        println!("Drawing circle with radius {}", self.radius);
    }
}

impl Draw for Square {
    fn draw(&self) {
        println!("Drawing square with side {}", self.side);
    }
}

// This won't work - Vec needs a single concrete type
// let shapes: Vec<???> = vec![Circle { radius: 1.0 }, Square { side: 2.0 }];
```

## Trait Objects with `dyn`

Trait objects solve this using the `dyn` keyword:

```rust
fn main() {
    let shapes: Vec<Box<dyn Draw>> = vec![
        Box::new(Circle { radius: 1.0 }),
        Box::new(Square { side: 2.0 }),
    ];

    for shape in shapes {
        shape.draw();
    }
}
```

`Box<dyn Draw>` is a trait object - a pointer to any type that implements `Draw`.

## How Trait Objects Work

A trait object consists of two pointers:
1. A pointer to the data
2. A pointer to a vtable (virtual method table)

The vtable contains pointers to the concrete implementations of each trait method for that specific type. This is **dynamic dispatch** - the correct method is looked up at runtime.

```rust
// Static dispatch - resolved at compile time
fn draw_static<T: Draw>(item: &T) {
    item.draw();  // Compiler knows exact method to call
}

// Dynamic dispatch - resolved at runtime
fn draw_dynamic(item: &dyn Draw) {
    item.draw();  // Method looked up via vtable
}
```

## Reference vs Box

Trait objects can be behind any pointer type:

```rust
fn process_shapes(shapes: &[&dyn Draw]) {
    for shape in shapes {
        shape.draw();
    }
}

fn process_owned_shapes(shapes: Vec<Box<dyn Draw>>) {
    for shape in shapes {
        shape.draw();
    }
}

fn main() {
    let circle = Circle { radius: 1.0 };
    let square = Square { side: 2.0 };

    // Using references
    let refs: Vec<&dyn Draw> = vec![&circle, &square];
    process_shapes(&refs);

    // Using owned boxes
    let owned: Vec<Box<dyn Draw>> = vec![
        Box::new(Circle { radius: 2.0 }),
        Box::new(Square { side: 3.0 }),
    ];
    process_owned_shapes(owned);
}
```

## Object Safety

Not all traits can be made into trait objects. A trait is **object-safe** if:

1. It doesn't return `Self`
2. It has no generic type parameters
3. All methods take `self` by reference or value

```rust
// Object-safe
trait Draw {
    fn draw(&self);
}

// NOT object-safe - returns Self
trait Clone {
    fn clone(&self) -> Self;
}

// NOT object-safe - generic method
trait Process {
    fn process<T>(&self, item: T);
}
```

## Returning Trait Objects

Functions can return trait objects for flexibility:

```rust
trait Animal {
    fn speak(&self) -> String;
}

struct Dog;
struct Cat;

impl Animal for Dog {
    fn speak(&self) -> String {
        String::from("Woof!")
    }
}

impl Animal for Cat {
    fn speak(&self) -> String {
        String::from("Meow!")
    }
}

fn get_pet(wants_dog: bool) -> Box<dyn Animal> {
    if wants_dog {
        Box::new(Dog)
    } else {
        Box::new(Cat)
    }
}

fn main() {
    let pet = get_pet(true);
    println!("{}", pet.speak());
}
```

## Static vs Dynamic: Trade-offs

**Static Dispatch (Generics)**:
- Zero runtime cost
- Compiler can inline and optimize
- Results in larger binary (code duplicated per type)
- Type must be known at compile time

**Dynamic Dispatch (Trait Objects)**:
- Small runtime overhead (vtable lookup)
- Smaller binary (single implementation)
- Enables heterogeneous collections
- Type can be determined at runtime

```rust
// Prefer static when you can
fn process_all<T: Draw>(items: &[T]) {
    for item in items {
        item.draw();
    }
}

// Use dynamic when you need flexibility
fn process_mixed(items: &[Box<dyn Draw>]) {
    for item in items {
        item.draw();
    }
}
```

## Common Use Cases

### Plugin Systems

```rust
trait Plugin {
    fn name(&self) -> &str;
    fn execute(&self);
}

struct PluginManager {
    plugins: Vec<Box<dyn Plugin>>,
}

impl PluginManager {
    fn new() -> Self {
        PluginManager { plugins: Vec::new() }
    }

    fn register(&mut self, plugin: Box<dyn Plugin>) {
        self.plugins.push(plugin);
    }

    fn run_all(&self) {
        for plugin in &self.plugins {
            println!("Running: {}", plugin.name());
            plugin.execute();
        }
    }
}
```

### Event Handlers

```rust
trait EventHandler {
    fn handle(&self, event: &str);
}

fn register_handlers() -> Vec<Box<dyn EventHandler>> {
    vec![
        Box::new(LoggingHandler),
        Box::new(MetricsHandler),
        Box::new(AlertHandler),
    ]
}
```

## Key Takeaways

1. Trait objects (`dyn Trait`) enable runtime polymorphism
2. They consist of a data pointer and a vtable pointer
3. Use `Box<dyn Trait>` for owned trait objects, `&dyn Trait` for references
4. Not all traits are object-safe (no `Self` return, no generic methods)
5. Dynamic dispatch has small runtime cost but enables flexibility
6. Prefer generics when types are known; use trait objects for heterogeneous collections

You now have a comprehensive understanding of Rust's trait system!
