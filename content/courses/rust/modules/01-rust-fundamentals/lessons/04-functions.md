---
title: Functions
order: 4
estimatedMinutes: 20
---

# Functions

Functions are the building blocks of Rust programs. You've already seen `main`, the entry point of every program. Now let's learn how to define your own functions.

## Defining Functions

Use `fn` to declare a function:

```rust
fn main() {
    println!("Hello from main!");
    greet();
}

fn greet() {
    println!("Hello from greet!");
}
```

Output:
```
Hello from main!
Hello from greet!
```

Rust uses **snake_case** for function names by convention.

## Parameters

Functions can accept parameters. You **must** declare the type of each parameter:

```rust
fn main() {
    greet_person("Alice");
    print_sum(5, 3);
}

fn greet_person(name: &str) {
    println!("Hello, {name}!");
}

fn print_sum(a: i32, b: i32) {
    println!("The sum is: {}", a + b);
}
```

Output:
```
Hello, Alice!
The sum is: 8
```

## Statements vs Expressions

Understanding this distinction is crucial in Rust:

- **Statements** perform actions but don't return values
- **Expressions** evaluate to a value

```rust
fn main() {
    let x = 5;  // Statement (assignment)

    let y = {
        let x = 3;
        x + 1      // Expression (no semicolon) - returns 4
    };

    println!("y is: {y}");  // Prints: y is: 4
}
```

Note: Adding a semicolon turns an expression into a statement, which returns `()` (the unit type).

## Return Values

Functions can return values. Declare the return type with `->`:

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b  // No semicolon - this expression is returned
}

fn main() {
    let result = add(5, 3);
    println!("5 + 3 = {result}");
}
```

The last expression in a function is implicitly returned. You can also use `return` for early returns:

```rust
fn absolute(x: i32) -> i32 {
    if x < 0 {
        return -x;  // Early return
    }
    x  // Implicit return
}
```

## The Unit Type

Functions without a return type implicitly return `()`:

```rust
fn say_hello() {
    println!("Hello!");
    // Implicitly returns ()
}

// Equivalent to:
fn say_hello_explicit() -> () {
    println!("Hello!");
}
```

## Multiple Return Values with Tuples

Return multiple values using a tuple:

```rust
fn swap(a: i32, b: i32) -> (i32, i32) {
    (b, a)
}

fn divide_with_remainder(dividend: i32, divisor: i32) -> (i32, i32) {
    let quotient = dividend / divisor;
    let remainder = dividend % divisor;
    (quotient, remainder)
}

fn main() {
    let (x, y) = swap(1, 2);
    println!("Swapped: {x}, {y}");

    let (q, r) = divide_with_remainder(17, 5);
    println!("17 / 5 = {q} remainder {r}");
}
```

## Function Examples

Here are some practical function patterns:

```rust
// Calculate the area of a rectangle
fn rectangle_area(width: f64, height: f64) -> f64 {
    width * height
}

// Check if a number is even
fn is_even(n: i32) -> bool {
    n % 2 == 0
}

// Get the larger of two numbers
fn max(a: i32, b: i32) -> i32 {
    if a > b {
        a
    } else {
        b
    }
}

fn main() {
    println!("Area: {}", rectangle_area(10.0, 5.0));
    println!("Is 4 even? {}", is_even(4));
    println!("Max of 3 and 7: {}", max(3, 7));
}
```

## Function Order Doesn't Matter

Unlike some languages, you can call functions defined later in the file:

```rust
fn main() {
    helper();  // Works even though helper is defined below
}

fn helper() {
    println!("I'm helping!");
}
```

Rust compiles the entire file before execution, so function order is irrelevant.

## A Note on Ownership

When passing values to functions, Rust's ownership rules apply. We'll explore this deeply in the ownership module, but here's a preview:

```rust
fn main() {
    let s = String::from("hello");
    takes_ownership(s);
    // println!("{s}");  // ERROR: s was moved into the function

    let x = 5;
    makes_copy(x);
    println!("{x}");  // Works: integers are copied, not moved
}

fn takes_ownership(s: String) {
    println!("{s}");
}

fn makes_copy(x: i32) {
    println!("{x}");
}
```

Simple types like integers are copied; complex types like `String` are moved. We'll cover this in detail soon.

## Key Takeaways

1. Define functions with `fn function_name(parameters) -> ReturnType`
2. Parameter types must be explicitly annotated
3. The last expression (without semicolon) is implicitly returned
4. Use `return` for early returns from functions
5. Return multiple values with tuples
6. Statements don't return values; expressions do
7. Function definitions can appear in any order

With functions mastered, you're ready to control program flow with conditionals and loops in the next lesson.
