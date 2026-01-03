---
title: Data Types
order: 3
estimatedMinutes: 25
---

# Data Types

Rust is **statically typed**, meaning every value has a known type at compile time. The compiler can usually infer types, but sometimes you'll need to specify them explicitly.

## Scalar Types

Scalar types represent single values. Rust has four primary scalar types.

### Integers

Integers are whole numbers without a fractional component:

| Length | Signed | Unsigned |
|--------|--------|----------|
| 8-bit  | i8     | u8       |
| 16-bit | i16    | u16      |
| 32-bit | i32    | u32      |
| 64-bit | i64    | u64      |
| 128-bit| i128   | u128     |
| arch   | isize  | usize    |

- **Signed** (i): Can be negative or positive
- **Unsigned** (u): Only positive (or zero)
- **isize/usize**: Depends on computer architecture (64 bits on 64-bit systems)

```rust
fn main() {
    let age: u8 = 25;           // Unsigned 8-bit
    let temperature: i32 = -10; // Signed 32-bit (default for integers)
    let big_number: i64 = 9_000_000_000;

    // Number literals can include type suffix
    let x = 42u8;
    let y = 1_000_000i64;  // Underscores improve readability
}
```

### Floating-Point Numbers

For decimal numbers, Rust provides two floating-point types:

```rust
fn main() {
    let x = 2.5;      // f64 (default - double precision)
    let y: f32 = 3.0; // f32 (single precision)

    let sum = 5.0 + 10.5;
    let quotient = 56.7 / 32.2;
}
```

Use `f64` unless you have a specific reason for `f32` - modern CPUs handle both at similar speeds, and `f64` is more precise.

### Booleans

The boolean type has two values:

```rust
fn main() {
    let t = true;
    let f: bool = false;

    let is_greater = 10 > 5;  // true
}
```

### Characters

The `char` type represents a single Unicode scalar value:

```rust
fn main() {
    let c = 'z';
    let heart = '❤';
    let emoji = '😊';

    // char uses single quotes; strings use double quotes
    println!("Character: {c}, Heart: {heart}, Emoji: {emoji}");
}
```

A `char` is 4 bytes, supporting the full Unicode range.

## Compound Types

Compound types group multiple values into one type.

### Tuples

A tuple groups values of different types with a fixed length:

```rust
fn main() {
    let tup: (i32, f64, char) = (500, 6.4, 'x');

    // Destructuring
    let (x, y, z) = tup;
    println!("y is: {y}");

    // Access by index
    let first = tup.0;
    let second = tup.1;
}
```

The unit type `()` is a special tuple with no values - functions that don't return anything implicitly return `()`.

### Arrays

Arrays have a fixed length and contain elements of the same type:

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];
    let months = ["January", "February", "March"];

    // Type annotation: [type; length]
    let b: [i32; 5] = [1, 2, 3, 4, 5];

    // Initialize with same value
    let zeros = [0; 5];  // [0, 0, 0, 0, 0]

    // Access elements by index
    let first = a[0];
    let second = a[1];
}
```

### Array Bounds Checking

Rust prevents out-of-bounds access at compile time when possible, and panics at runtime otherwise:

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];

    // This would cause a runtime panic
    // let element = a[10];  // index out of bounds!
}
```

This protection prevents buffer overflow vulnerabilities common in other systems languages.

## Type Inference and Annotations

Rust's compiler is smart about inferring types:

```rust
fn main() {
    let x = 5;           // i32 inferred
    let y = 2.0;         // f64 inferred
    let active = true;   // bool inferred
    let name = "Alice";  // &str inferred

    // Sometimes you must specify
    let guess: u32 = "42".parse().expect("Not a number!");
}
```

## Numeric Operations

All standard math operations work as expected:

```rust
fn main() {
    // Addition
    let sum = 5 + 10;

    // Subtraction
    let difference = 95.5 - 4.3;

    // Multiplication
    let product = 4 * 30;

    // Division
    let quotient = 56.7 / 32.2;
    let truncated = 5 / 3;  // Integer division: result is 1

    // Remainder
    let remainder = 43 % 5;
}
```

Note: Integer division truncates toward zero.

## Type Conversion

Rust requires explicit type conversions using `as`:

```rust
fn main() {
    let x: i32 = 10;
    let y: f64 = x as f64;  // Convert i32 to f64

    let a: f64 = 4.7;
    let b: i32 = a as i32;  // Truncates to 4

    let c: u8 = 255;
    let d: i8 = c as i8;    // Be careful: this wraps to -1
}
```

Explicit conversions make potential data loss visible in your code.

## Strings: A Preview

Rust has two main string types, which we'll cover in depth later:

```rust
fn main() {
    // String literal (stored in program binary)
    let s1: &str = "Hello";

    // Owned String (heap-allocated, growable)
    let s2: String = String::from("Hello");
    let s3 = "World".to_string();
}
```

## Key Takeaways

1. Rust has four scalar types: integers, floats, booleans, and characters
2. Choose integer size based on your data's range; `i32` is the default
3. Tuples group mixed types; arrays group same types with fixed length
4. Rust checks array bounds, preventing memory safety issues
5. Type conversions must be explicit using `as`
6. The compiler infers types when possible but sometimes needs annotations

Understanding types is crucial in Rust, as the type system is a key tool for catching bugs at compile time. Next, we'll learn how to write reusable code with functions.
