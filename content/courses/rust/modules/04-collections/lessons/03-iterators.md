---
title: Iterators
order: 3
estimatedMinutes: 30
---

# Iterators: Lazy Sequence Processing

Iterators are one of Rust's most powerful abstractions. They provide a way to process sequences of elements lazily, efficiently, and expressively.

## The Iterator Trait

All iterators implement the `Iterator` trait:

```rust
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
    // Many provided methods...
}
```

The `next()` method returns `Some(item)` for each element and `None` when exhausted.

## Creating Iterators

```rust
fn main() {
    let v = vec![1, 2, 3];

    // iter() - borrows elements
    let iter1 = v.iter();
    for item in iter1 {
        println!("{}", item);  // item is &i32
    }

    // iter_mut() - mutably borrows elements
    let mut v2 = vec![1, 2, 3];
    for item in v2.iter_mut() {
        *item *= 2;  // item is &mut i32
    }
    println!("{:?}", v2);  // [2, 4, 6]

    // into_iter() - takes ownership
    let v3 = vec![String::from("a"), String::from("b")];
    for item in v3.into_iter() {
        println!("{}", item);  // item is String
    }
    // v3 is no longer accessible
}
```

## Iterators are Lazy

Iterators don't do anything until consumed:

```rust
fn main() {
    let v = vec![1, 2, 3];

    // This does nothing yet!
    let iter = v.iter().map(|x| {
        println!("Processing {}", x);
        x * 2
    });

    println!("Iterator created, nothing printed yet");

    // Now it runs
    let doubled: Vec<_> = iter.collect();
    println!("Result: {:?}", doubled);
}
```

## Consuming Iterators

Consuming methods take ownership and produce a result:

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    // sum() - add all elements
    let sum: i32 = v.iter().sum();
    println!("Sum: {}", sum);  // 15

    // product() - multiply all elements
    let product: i32 = v.iter().product();
    println!("Product: {}", product);  // 120

    // count() - number of elements
    let count = v.iter().count();
    println!("Count: {}", count);  // 5

    // collect() - gather into a collection
    let doubled: Vec<_> = v.iter().map(|x| x * 2).collect();
    println!("Doubled: {:?}", doubled);

    // min() and max()
    println!("Min: {:?}", v.iter().min());  // Some(&1)
    println!("Max: {:?}", v.iter().max());  // Some(&5)

    // find() - first matching element
    let first_even = v.iter().find(|&&x| x % 2 == 0);
    println!("First even: {:?}", first_even);  // Some(&2)

    // any() and all()
    println!("Any even: {}", v.iter().any(|&x| x % 2 == 0));    // true
    println!("All positive: {}", v.iter().all(|&x| x > 0));     // true

    // last()
    println!("Last: {:?}", v.iter().last());  // Some(&5)
}
```

## Using next() Directly

```rust
fn main() {
    let v = vec![1, 2, 3];
    let mut iter = v.iter();

    println!("{:?}", iter.next());  // Some(&1)
    println!("{:?}", iter.next());  // Some(&2)
    println!("{:?}", iter.next());  // Some(&3)
    println!("{:?}", iter.next());  // None
}
```

## Fold and Reduce

Powerful accumulation methods:

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    // fold: accumulate with initial value
    let sum = v.iter().fold(0, |acc, &x| acc + x);
    println!("Sum: {}", sum);  // 15

    // Building a string
    let sentence = vec!["Hello", "world"];
    let joined = sentence.iter().fold(String::new(), |mut acc, &word| {
        if !acc.is_empty() {
            acc.push(' ');
        }
        acc.push_str(word);
        acc
    });
    println!("Joined: {}", joined);

    // reduce: like fold but uses first element as initial
    let max = v.iter().copied().reduce(|a, b| if a > b { a } else { b });
    println!("Max: {:?}", max);  // Some(5)
}
```

## for_each

When you don't need to collect:

```rust
fn main() {
    let v = vec![1, 2, 3];

    // Using for_each instead of for loop
    v.iter().for_each(|x| println!("{}", x));

    // Useful in chains
    v.iter()
        .map(|x| x * 2)
        .for_each(|x| println!("Doubled: {}", x));
}
```

## Range Iterators

```rust
fn main() {
    // Exclusive range
    for i in 0..5 {
        print!("{} ", i);  // 0 1 2 3 4
    }
    println!();

    // Inclusive range
    for i in 0..=5 {
        print!("{} ", i);  // 0 1 2 3 4 5
    }
    println!();

    // Ranges are iterators
    let squares: Vec<_> = (1..=5).map(|x| x * x).collect();
    println!("Squares: {:?}", squares);  // [1, 4, 9, 16, 25]
}
```

## String Iterators

```rust
fn main() {
    let s = "hello";

    // Iterate over characters
    for c in s.chars() {
        print!("{} ", c);  // h e l l o
    }
    println!();

    // Iterate over bytes
    for b in s.bytes() {
        print!("{} ", b);  // 104 101 108 108 111
    }
    println!();

    // Character indices
    for (i, c) in s.char_indices() {
        println!("Index {}: {}", i, c);
    }

    // Split
    let sentence = "hello world rust";
    let words: Vec<_> = sentence.split_whitespace().collect();
    println!("{:?}", words);  // ["hello", "world", "rust"]
}
```

## Implementing Iterator

Create your own iterator:

```rust
struct Counter {
    count: u32,
    max: u32,
}

impl Counter {
    fn new(max: u32) -> Counter {
        Counter { count: 0, max }
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.count < self.max {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}

fn main() {
    let counter = Counter::new(5);

    for n in counter {
        println!("{}", n);  // 1, 2, 3, 4, 5
    }

    // Chain with other iterators
    let sum: u32 = Counter::new(5)
        .zip(Counter::new(5).skip(1))
        .map(|(a, b)| a * b)
        .filter(|x| x % 2 == 0)
        .sum();

    println!("Sum: {}", sum);
}
```

## IntoIterator Trait

Allows types to be used in for loops:

```rust
struct Colors {
    colors: Vec<String>,
}

impl IntoIterator for Colors {
    type Item = String;
    type IntoIter = std::vec::IntoIter<String>;

    fn into_iter(self) -> Self::IntoIter {
        self.colors.into_iter()
    }
}

fn main() {
    let palette = Colors {
        colors: vec!["red".to_string(), "green".to_string(), "blue".to_string()],
    };

    for color in palette {
        println!("{}", color);
    }
}
```

## Iterator Performance

Iterators have zero-cost abstraction - they compile to the same code as hand-written loops:

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    // This iterator chain...
    let sum: i32 = v.iter()
        .map(|x| x * 2)
        .filter(|x| x > &5)
        .sum();

    // ...compiles to roughly the same as:
    let mut sum2 = 0;
    for x in &v {
        let doubled = x * 2;
        if doubled > 5 {
            sum2 += doubled;
        }
    }

    assert_eq!(sum, sum2);
}
```

## Key Takeaways

1. **Iterators are lazy** - nothing happens until consumed
2. **Three types of iterators**: `.iter()`, `.iter_mut()`, `.into_iter()`
3. **Consuming methods** produce final results: `sum()`, `collect()`, `count()`
4. **`fold()` is powerful** for complex accumulations
5. **Ranges are iterators** - `0..n` and `0..=n`
6. **Implement `Iterator` trait** for custom iterators
7. **Zero-cost abstraction** - no performance penalty

In the next lesson, we'll explore iterator adaptors - methods that transform iterators into new iterators.
