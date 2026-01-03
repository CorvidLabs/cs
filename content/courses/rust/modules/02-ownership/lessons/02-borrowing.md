---
title: Borrowing
order: 2
estimatedMinutes: 25
---

# Borrowing: Using Without Owning

In the previous lesson, we saw how passing values to functions transfers ownership. But what if we want to use a value without taking ownership? That's where **borrowing** comes in.

## The Problem with Ownership Transfer

Remember this awkward pattern?

```rust
fn main() {
    let s1 = String::from("hello");

    // We have to return the String to use it again
    let (s2, len) = calculate_length(s1);

    println!("The length of '{}' is {}.", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();
    (s, length)  // Tedious!
}
```

There's a better way.

## References: Borrowing Values

A **reference** allows you to refer to a value without taking ownership:

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);  // &s1 creates a reference

    println!("The length of '{}' is {}.", s1, len);
    // s1 is still valid because we only borrowed it!
}

fn calculate_length(s: &String) -> usize {  // s is a reference to a String
    s.len()
}  // s goes out of scope, but since it doesn't own what it refers to, nothing is dropped
```

The `&` symbol creates a reference. The reference "borrows" the value without taking ownership.

## Visualizing References

```
References:

    let s1 = String::from("hello")

    Stack:                    Heap:
    ┌─────────┐              ┌───────────┐
    │   s1    │─────────────►│  "hello"  │
    │ ptr|5|5 │              └───────────┘
    └─────────┘
         ▲
         │
    ┌─────────┐
    │   &s1   │  (reference - just a pointer to s1)
    └─────────┘

    The reference points to s1, not directly to the heap data.
    When the reference goes out of scope, nothing is freed.
```

## The Borrowing Rules

Rust enforces two critical rules for references:

```rust
// Rule 1: At any given time, you can have EITHER:
//         - One mutable reference, OR
//         - Any number of immutable references

// Rule 2: References must always be valid
```

Let's explore what these rules mean.

## Immutable References: Sharing Is Caring

You can have multiple immutable references at the same time:

```rust
fn main() {
    let s = String::from("hello");

    let r1 = &s;  // OK
    let r2 = &s;  // OK - multiple immutable references allowed
    let r3 = &s;  // OK

    println!("{}, {}, and {}", r1, r2, r3);
    // All three references are valid here
}
```

Why is this safe? Because no one can modify the data, there's no risk of data races or unexpected changes.

## Mutable References: Exclusive Access

To modify borrowed data, you need a mutable reference:

```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);  // Pass a mutable reference

    println!("{}", s);  // Prints "hello, world"
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

Note: The variable must be declared `mut` to create a mutable reference.

## Only One Mutable Reference

You cannot have multiple mutable references to the same data:

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &mut s;
    let r2 = &mut s;  // ERROR!

    println!("{}, {}", r1, r2);
}
```

Error:
```
error[E0499]: cannot borrow `s` as mutable more than once at a time
 --> src/main.rs:5:14
  |
4 |     let r1 = &mut s;
  |              ------ first mutable borrow occurs here
5 |     let r2 = &mut s;
  |              ^^^^^^ second mutable borrow occurs here
6 |
7 |     println!("{}, {}", r1, r2);
  |                        -- first borrow later used here
```

This restriction prevents data races at compile time!

## No Mixing Mutable and Immutable

You can't have a mutable reference while immutable references exist:

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s;      // OK - immutable borrow
    let r2 = &s;      // OK - another immutable borrow
    let r3 = &mut s;  // ERROR! Can't borrow as mutable

    println!("{}, {}, and {}", r1, r2, r3);
}
```

Error:
```
error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
 --> src/main.rs:6:14
  |
4 |     let r1 = &s;
  |              -- immutable borrow occurs here
5 |     let r2 = &s;
6 |     let r3 = &mut s;
  |              ^^^^^^ mutable borrow occurs here
7 |
8 |     println!("{}, {}, and {}", r1, r2, r3);
  |                                -- immutable borrow later used here
```

## Non-Lexical Lifetimes (NLL)

Modern Rust is smart about when references end:

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s;
    let r2 = &s;
    println!("{} and {}", r1, r2);
    // r1 and r2 are no longer used after this point

    let r3 = &mut s;  // OK! r1 and r2 are done
    println!("{}", r3);
}
```

References are considered to end at their last use, not at the end of the scope. This makes Rust more ergonomic.

## Preventing Dangling References

Rust prevents dangling references - references to memory that has been freed:

```rust
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String {  // ERROR!
    let s = String::from("hello");

    &s  // We're returning a reference to s...
}  // ...but s goes out of scope and is dropped here!
```

Error:
```
error[E0106]: missing lifetime specifier
 --> src/main.rs:5:16
  |
5 | fn dangle() -> &String {
  |                ^ expected named lifetime parameter
  |
  = help: this function's return type contains a borrowed value,
          but there is no value for it to be borrowed from
```

The solution is to return the owned value:

```rust
fn no_dangle() -> String {
    let s = String::from("hello");
    s  // Ownership is moved out, nothing is dropped
}
```

## Borrowing in Practice

Here's a practical example showing borrowing patterns:

```rust
fn main() {
    let mut book = String::from("The Rust Programming Language");

    // Multiple readers can look at the book
    let reader1 = &book;
    let reader2 = &book;
    print_book(reader1);
    print_book(reader2);

    // Now we can edit (readers are done)
    edit_book(&mut book);

    println!("Final: {}", book);
}

fn print_book(book: &String) {
    println!("Reading: {}", book);
}

fn edit_book(book: &mut String) {
    book.push_str(" - Annotated Edition");
}
```

## The Borrow Checker

The borrow checker is the part of the Rust compiler that enforces borrowing rules. It tracks:

1. When borrows start
2. When borrows end
3. Whether borrows are mutable or immutable
4. Whether any conflicts exist

```rust
fn main() {
    let mut data = vec![1, 2, 3];

    // The borrow checker prevents this common bug:
    for item in &data {
        // data.push(4);  // ERROR! Can't modify while iterating
        println!("{}", item);
    }

    // Safe to modify after the loop
    data.push(4);
}
```

## Common Borrowing Patterns

### Pattern 1: Read-only access

```rust
fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}
```

### Pattern 2: Mutable access for modification

```rust
fn add_suffix(s: &mut String, suffix: &str) {
    s.push_str(suffix);
}
```

### Pattern 3: Split borrows

```rust
fn main() {
    let mut pair = (String::from("hello"), String::from("world"));

    // You can borrow different parts of a struct separately
    let first = &mut pair.0;
    let second = &pair.1;  // Different field, so this is OK

    first.push_str("!");
    println!("{} {}", first, second);
}
```

## Key Takeaways

1. **References borrow values without taking ownership** - use `&` to create references
2. **Immutable references (`&T`)** allow reading but not modifying
3. **Mutable references (`&mut T`)** allow reading and modifying
4. **Only one mutable reference at a time** - prevents data races
5. **No mixing mutable and immutable references** - prevents unexpected changes
6. **References must always be valid** - no dangling pointers
7. **The borrow checker enforces these rules at compile time** - no runtime cost

Borrowing is how Rust achieves memory safety without garbage collection. The rules might feel restrictive at first, but they prevent entire classes of bugs. In the next lesson, we'll dive deeper into reference types.
