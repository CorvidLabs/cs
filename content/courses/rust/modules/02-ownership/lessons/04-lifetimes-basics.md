---
title: Lifetimes Basics
order: 4
estimatedMinutes: 30
---

# Understanding Lifetimes

Every reference in Rust has a **lifetime** - the scope for which that reference is valid. Most of the time, lifetimes are implicit and inferred, just like types. But sometimes we need to annotate lifetimes explicitly.

## What is a Lifetime?

A lifetime is the span of code during which a reference is valid:

```rust
fn main() {
    let r;                // ---------+-- 'a
                          //          |
    {                     //          |
        let x = 5;        // -+-- 'b  |
        r = &x;           //  |       |
    }                     // -+       |
                          //          |
    // println!("{}", r); // ERROR!   |
}                         // ---------+
```

The lifetime `'b` of `x` is shorter than the lifetime `'a` of `r`. Rust prevents the dangling reference.

## The Borrow Checker

Rust's borrow checker compares lifetimes to ensure references are always valid:

```rust
fn main() {
    let x = 5;            // ----------+-- 'b
                          //           |
    let r = &x;           // --+-- 'a  |
                          //   |       |
    println!("{}", r);    //   |       |
                          // --+       |
}                         // ----------+
```

Here `'a` is shorter than `'b`, so `r` can safely reference `x`.

## Lifetime Annotations

When the borrow checker can't figure out lifetimes, we help it with annotations:

```rust
&i32        // A reference
&'a i32     // A reference with an explicit lifetime 'a
&'a mut i32 // A mutable reference with an explicit lifetime 'a
```

Lifetime annotations don't change how long references live - they describe relationships between lifetimes.

## The Dangling Reference Problem

Consider this function:

```rust
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

This won't compile! Rust doesn't know if the returned reference comes from `x` or `y`, so it can't ensure the reference is valid.

Error:
```
error[E0106]: missing lifetime specifier
 --> src/main.rs:1:33
  |
1 | fn longest(x: &str, y: &str) -> &str {
  |               ----     ----     ^ expected named lifetime parameter
  |
  = help: this function's return type contains a borrowed value,
          but the signature does not say whether it is borrowed from `x` or `y`
```

## Fixing with Lifetime Annotations

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("long string");
    let string2 = String::from("xyz");

    let result = longest(&string1, &string2);
    println!("Longest: {}", result);
}
```

The `'a` annotation says: "The returned reference will be valid as long as **both** input references are valid."

## How Lifetime Annotations Work

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str
//        ^^^     ^^^         ^^^          ^^^
//         |       |           |            |
//         |       +-----------+------------+
//         |                   |
//     Lifetime          All three references
//     parameter         share the same lifetime

// This means: the return value lives at least as long
// as the shorter of the two input lifetimes
```

## Lifetimes in Practice

```rust
fn main() {
    let string1 = String::from("long string is long");

    {
        let string2 = String::from("xyz");
        let result = longest(&string1, &string2);
        println!("Longest: {}", result);
        // result is valid here because string2 is still in scope
    }
    // result would be invalid here if we tried to use it
}

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

## Invalid Lifetime Usage

This doesn't compile because `result` could outlive `string2`:

```rust
fn main() {
    let string1 = String::from("long string");
    let result;

    {
        let string2 = String::from("xyz");
        result = longest(&string1, &string2);
    }

    println!("Longest: {}", result);  // ERROR!
}
```

## Different Lifetime Parameters

When return value only depends on one parameter:

```rust
fn first<'a>(x: &'a str, y: &str) -> &'a str {
    x  // Only returns x, so only x needs the lifetime
}

fn main() {
    let s1 = String::from("hello");
    let result;

    {
        let s2 = String::from("world");
        result = first(&s1, &s2);
    }

    println!("{}", result);  // OK! result only depends on s1
}
```

## Lifetime Elision Rules

Rust has lifetime elision rules that infer lifetimes in common cases:

```rust
// These are equivalent:
fn first_word(s: &str) -> &str { ... }
fn first_word<'a>(s: &'a str) -> &'a str { ... }
```

The three elision rules:

1. Each input reference gets its own lifetime parameter
2. If there's exactly one input lifetime, it's assigned to all output lifetimes
3. If there's a `&self` or `&mut self`, that lifetime is assigned to outputs

```rust
// Rule 1: fn foo(x: &i32, y: &i32) becomes fn foo<'a, 'b>(x: &'a i32, y: &'b i32)
// Rule 2: fn foo(x: &i32) -> &i32 becomes fn foo<'a>(x: &'a i32) -> &'a i32
// Rule 3: fn foo(&self) -> &i32 becomes fn foo<'a>(&'a self) -> &'a i32
```

## Struct Lifetimes

Structs can hold references, but need lifetime annotations:

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().unwrap();

    let excerpt = ImportantExcerpt {
        part: first_sentence,
    };

    println!("Excerpt: {}", excerpt.part);
}
// excerpt can't outlive novel
```

This annotation means: an instance of `ImportantExcerpt` can't outlive the reference in its `part` field.

## Method Lifetimes

Methods on structs with lifetimes:

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 {
        3
    }

    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {}", announcement);
        self.part  // Lifetime elision: returns &'a str
    }
}
```

## The 'static Lifetime

The `'static` lifetime means the reference can live for the entire program:

```rust
fn main() {
    let s: &'static str = "I have a static lifetime.";
    // String literals are stored in the binary and are always available
}
```

Be careful with `'static` - it's often not what you want:

```rust
// Usually a code smell:
fn bad_idea() -> &'static str {
    // Don't use 'static just to make the compiler happy
    // It means the data lives forever
    "This is OK because it's a literal"
}
```

## Lifetime Bounds

Generics can have lifetime bounds:

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
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

## Common Lifetime Patterns

### Pattern 1: Return input reference

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

### Pattern 2: Struct holding reference

```rust
struct Wrapper<'a> {
    value: &'a str,
}
```

### Pattern 3: Multiple lifetime parameters

```rust
fn complex<'a, 'b>(x: &'a str, y: &'b str) -> &'a str
where
    'b: 'a,  // 'b outlives 'a
{
    x
}
```

## Lifetime Visualization

```
Lifetime Relationships:

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str

    main():
    ┌─────────────────────────────────┐
    │ let s1 = String::from("long");  │ ──'s1 lifetime──────────────────┐
    │                                 │                                  │
    │   {                             │                                  │
    │   │ let s2 = String::from("x"); │ ──'s2 lifetime──┐                │
    │   │                             │                 │                │
    │   │ // 'a = min('s1, 's2) = 's2 │                 │                │
    │   │ let r = longest(&s1, &s2);  │ ──'a lifetime───│────┐           │
    │   │                             │                 │    │           │
    │   │ println!("{}", r);          │ ◄───────────────│────┘ (valid)   │
    │   }                             │ ◄───────────────┘                │
    │                                 │                                  │
    │ // r not accessible here        │                                  │
    └─────────────────────────────────┘ ◄────────────────────────────────┘
```

## Key Takeaways

1. **Every reference has a lifetime** - the scope where it's valid
2. **Most lifetimes are inferred** - explicit annotations only when needed
3. **Annotations describe relationships** - they don't change actual lifetimes
4. **`'a` is a generic lifetime parameter** - like generic types
5. **Lifetime elision rules** reduce the need for explicit annotations
6. **Structs with references need lifetime annotations**
7. **`'static` means the entire program duration** - use sparingly

Lifetimes ensure memory safety by guaranteeing references are always valid. They're checked at compile time with no runtime cost. While they can be challenging at first, they prevent dangling pointer bugs that plague other languages.

You've now mastered Rust's ownership system! This foundation enables safe, efficient memory management without garbage collection. In the next module, we'll build on this knowledge with structs and enums.
