---
title: Smart Pointers
order: 2
estimatedMinutes: 25
---

# Smart Pointers

Smart pointers are data structures that act like pointers but have additional metadata and capabilities. Rust has several smart pointer types, each with specific use cases.

## Box: Heap Allocation

`Box<T>` stores data on the heap. Use it for:
- Large data you don't want to copy
- Recursive types
- Trait objects

```rust
fn main() {
    // Store i32 on heap
    let b = Box::new(5);
    println!("b = {}", *b);

    // Automatic deref in most contexts
    let b = Box::new(String::from("hello"));
    println!("Length: {}", b.len());  // No explicit deref needed
}
```

### Recursive Types

```rust
// This won't compile - infinite size
// enum List { Cons(i32, List), Nil }

// Box provides indirection - known size
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
}
```

## Rc: Reference Counting

`Rc<T>` enables multiple owners of the same data:

```rust
use std::rc::Rc;

fn main() {
    let data = Rc::new(vec![1, 2, 3]);

    let a = Rc::clone(&data);  // Increments count
    let b = Rc::clone(&data);  // Increments count

    println!("Count: {}", Rc::strong_count(&data));  // 3

    drop(a);
    println!("Count: {}", Rc::strong_count(&data));  // 2
}
```

### Shared Graph Nodes

```rust
use std::rc::Rc;

struct Node {
    value: i32,
    children: Vec<Rc<Node>>,
}

fn main() {
    let leaf = Rc::new(Node { value: 3, children: vec![] });

    let branch1 = Node {
        value: 1,
        children: vec![Rc::clone(&leaf)],
    };

    let branch2 = Node {
        value: 2,
        children: vec![Rc::clone(&leaf)],  // Same leaf, shared!
    };
}
```

**Note**: `Rc` is single-threaded. Use `Arc` for multithreading.

## RefCell: Interior Mutability

`RefCell<T>` allows mutable borrows checked at runtime:

```rust
use std::cell::RefCell;

fn main() {
    let data = RefCell::new(5);

    // Borrow rules checked at runtime
    {
        let mut borrowed = data.borrow_mut();
        *borrowed += 1;
    }  // Mutable borrow ends

    println!("Value: {}", data.borrow());  // Immutable borrow OK now
}
```

### Runtime Borrow Checking

```rust
use std::cell::RefCell;

fn main() {
    let data = RefCell::new(5);

    let r1 = data.borrow();
    let r2 = data.borrow();  // Multiple immutable borrows OK

    // This would panic at runtime:
    // let r3 = data.borrow_mut();  // Can't mutably borrow while immutably borrowed
}
```

## Combining Rc and RefCell

Share mutable data between multiple owners:

```rust
use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug)]
struct Node {
    value: i32,
    children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        children: RefCell::new(vec![]),
    });

    let branch = Rc::new(Node {
        value: 5,
        children: RefCell::new(vec![Rc::clone(&leaf)]),
    });

    // Mutate through shared reference!
    branch.children.borrow_mut().push(Rc::new(Node {
        value: 7,
        children: RefCell::new(vec![]),
    }));

    println!("{:?}", branch);
}
```

## Cell: Copy Types

`Cell<T>` is simpler than `RefCell` for `Copy` types:

```rust
use std::cell::Cell;

struct Counter {
    value: Cell<i32>,
}

impl Counter {
    fn increment(&self) {  // Note: &self, not &mut self
        self.value.set(self.value.get() + 1);
    }
}

fn main() {
    let counter = Counter { value: Cell::new(0) };
    counter.increment();
    counter.increment();
    println!("Count: {}", counter.value.get());
}
```

## Weak: Breaking Reference Cycles

`Weak<T>` doesn't prevent deallocation:

```rust
use std::rc::{Rc, Weak};
use std::cell::RefCell;

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    });

    let branch = Rc::new(Node {
        value: 5,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![Rc::clone(&leaf)]),
    });

    // Set parent as weak reference (doesn't create cycle)
    *leaf.parent.borrow_mut() = Rc::downgrade(&branch);

    // Access parent through upgrade()
    if let Some(parent) = leaf.parent.borrow().upgrade() {
        println!("Leaf parent: {}", parent.value);
    }
}
```

## Deref and Drop Traits

Smart pointers implement these traits:

```rust
use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

fn main() {
    let x = MyBox::new(5);
    assert_eq!(5, *x);  // Works because of Deref
}
```

## Choosing the Right Pointer

| Type | Ownership | Mutability | Thread-Safe |
|------|-----------|------------|-------------|
| `Box<T>` | Single | Through owner | No |
| `Rc<T>` | Shared | Immutable | No |
| `Arc<T>` | Shared | Immutable | Yes |
| `RefCell<T>` | Single | Runtime checked | No |
| `Mutex<T>` | Single | Runtime checked | Yes |

## Key Takeaways

1. `Box` puts data on the heap; useful for recursive types
2. `Rc` enables multiple owners (single-threaded)
3. `RefCell` provides interior mutability with runtime checks
4. Combine `Rc<RefCell<T>>` for shared mutable data
5. Use `Weak` to prevent reference cycles
6. Choose `Arc` + `Mutex` for multithreaded scenarios

Next, we'll explore unsafe Rust and when to use it.
