---
title: Macros
order: 4
estimatedMinutes: 30
---

# Macros

Macros let you write code that writes code (metaprogramming). Rust has two kinds: declarative macros (`macro_rules!`) and procedural macros. This lesson focuses on declarative macros.

## Why Macros?

Macros can:
- Accept variable numbers of arguments
- Generate repetitive code
- Create domain-specific syntax
- Perform compile-time computation

```rust
// vec! is a macro - accepts any number of elements
let v = vec![1, 2, 3, 4, 5];

// println! is a macro - format string checked at compile time
println!("Hello, {}!", "world");
```

## Declarative Macros with macro_rules!

Basic syntax:

```rust
macro_rules! say_hello {
    () => {
        println!("Hello!");
    };
}

fn main() {
    say_hello!();  // Prints: Hello!
}
```

## Pattern Matching in Macros

Macros match patterns against input:

```rust
macro_rules! create_function {
    ($func_name:ident) => {
        fn $func_name() {
            println!("Function {:?} called", stringify!($func_name));
        }
    };
}

create_function!(foo);
create_function!(bar);

fn main() {
    foo();  // Function "foo" called
    bar();  // Function "bar" called
}
```

## Designators (Matchers)

Common fragment specifiers:

| Designator | Matches |
|------------|---------|
| `ident` | Identifier (foo, x, MyType) |
| `expr` | Expression (1 + 2, foo()) |
| `ty` | Type (i32, Vec<String>) |
| `pat` | Pattern (Some(x), (a, b)) |
| `stmt` | Statement |
| `block` | Block of code { ... } |
| `item` | Item (fn, struct, impl) |
| `literal` | Literal (42, "hello") |
| `tt` | Token tree (anything) |

```rust
macro_rules! print_type {
    ($val:expr, $type:ty) => {
        println!("{} is of type {}", $val, stringify!($type));
    };
}

fn main() {
    print_type!(42, i32);       // 42 is of type i32
    print_type!("hi", &str);    // hi is of type &str
}
```

## Repetition

Handle variable arguments with `$(...)*` or `$(...)+`:

```rust
macro_rules! vector {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}

fn main() {
    let v = vector![1, 2, 3, 4, 5];
    println!("{:?}", v);  // [1, 2, 3, 4, 5]
}
```

- `*` means zero or more
- `+` means one or more
- `?` means zero or one

## Multiple Match Arms

Match different patterns:

```rust
macro_rules! calculate {
    (add $a:expr, $b:expr) => {
        $a + $b
    };
    (mul $a:expr, $b:expr) => {
        $a * $b
    };
}

fn main() {
    println!("{}", calculate!(add 1, 2));  // 3
    println!("{}", calculate!(mul 3, 4));  // 12
}
```

## Building a Simple DSL

Create domain-specific syntax:

```rust
macro_rules! html {
    ($tag:ident { $($content:tt)* }) => {
        format!("<{}>{}</{}>",
            stringify!($tag),
            html!($($content)*),
            stringify!($tag))
    };
    ($text:literal) => {
        $text.to_string()
    };
    () => {
        String::new()
    };
}

fn main() {
    let page = html!(div { "Hello, World!" });
    println!("{}", page);  // <div>Hello, World!</div>
}
```

## The matches! Macro

A useful standard library macro:

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

fn main() {
    let msg = Message::Move { x: 1, y: 2 };

    // Instead of match expression
    if matches!(msg, Message::Move { .. }) {
        println!("It's a move message");
    }
}
```

## Macro Hygiene

Macros have their own scope for identifiers:

```rust
macro_rules! using_a {
    ($e:expr) => {
        {
            let a = 42;  // This 'a' is in macro's scope
            $e           // Expression uses caller's 'a'
        }
    };
}

fn main() {
    let a = 10;
    let result = using_a!(a * 2);  // Uses outer 'a': 10 * 2 = 20
    println!("{}", result);
}
```

## Debugging Macros

Use `cargo expand` to see macro expansion:

```bash
cargo install cargo-expand
cargo expand
```

Or use the unstable `trace_macros!`:

```rust
#![feature(trace_macros)]

trace_macros!(true);
let v = vec![1, 2, 3];
trace_macros!(false);
```

## Procedural Macros (Overview)

Three types of procedural macros:

1. **Custom derive**: `#[derive(MyTrait)]`
2. **Attribute-like**: `#[route(GET, "/")]`
3. **Function-like**: `sql!(SELECT * FROM users)`

These require a separate crate and use the `proc_macro` crate:

```rust
// In a proc-macro crate
use proc_macro::TokenStream;

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    // Parse, transform, generate code
    // ...
}
```

## Best Practices

1. **Start simple** - Build up complexity gradually
2. **Use tt for flexibility** - `$($tt:tt)*` accepts anything
3. **Provide good error messages** - Use `compile_error!`
4. **Document patterns** - Show example invocations
5. **Test edge cases** - Empty input, single item, many items

```rust
macro_rules! my_macro {
    () => {
        compile_error!("my_macro requires at least one argument");
    };
    ($($args:tt)+) => {
        // Normal implementation
    };
}
```

## Key Takeaways

1. Macros generate code at compile time
2. `macro_rules!` uses pattern matching with designators
3. Repetition (`*`, `+`, `?`) handles variable arguments
4. Macros can create DSLs and reduce boilerplate
5. Use `cargo expand` to debug macro expansion
6. Procedural macros offer more power but are more complex

Congratulations! You've completed the Advanced Rust module and have a solid foundation in Rust systems programming.
