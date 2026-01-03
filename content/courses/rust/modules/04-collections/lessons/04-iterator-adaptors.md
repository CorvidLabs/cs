---
title: Iterator Adaptors
order: 4
estimatedMinutes: 30
---

# Iterator Adaptors: Transforming Sequences

Iterator adaptors are methods that transform one iterator into another. They're lazy - they create new iterators without doing any work until consumed.

## Map: Transform Each Element

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    // Transform each element
    let doubled: Vec<_> = v.iter().map(|x| x * 2).collect();
    println!("Doubled: {:?}", doubled);  // [2, 4, 6, 8, 10]

    // Transform type
    let strings: Vec<String> = v.iter().map(|x| x.to_string()).collect();
    println!("Strings: {:?}", strings);

    // Chain multiple maps
    let result: Vec<_> = v.iter()
        .map(|x| x * 2)
        .map(|x| x + 1)
        .collect();
    println!("Doubled + 1: {:?}", result);  // [3, 5, 7, 9, 11]
}
```

## Filter: Keep Matching Elements

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Keep only even numbers
    let evens: Vec<_> = v.iter().filter(|&x| x % 2 == 0).collect();
    println!("Evens: {:?}", evens);  // [2, 4, 6, 8, 10]

    // Filter with complex conditions
    let special: Vec<_> = v.iter()
        .filter(|&x| x % 2 == 0 && *x > 4)
        .collect();
    println!("Even and > 4: {:?}", special);  // [6, 8, 10]
}
```

## Filter Map: Filter and Transform

```rust
fn main() {
    let strings = vec!["1", "two", "3", "four", "5"];

    // Parse only valid numbers
    let numbers: Vec<i32> = strings
        .iter()
        .filter_map(|s| s.parse().ok())
        .collect();

    println!("Valid numbers: {:?}", numbers);  // [1, 3, 5]
}
```

## Flat Map: Flatten Nested Iterators

```rust
fn main() {
    let nested = vec![vec![1, 2], vec![3, 4], vec![5, 6]];

    // Flatten with map
    let flat: Vec<_> = nested.iter()
        .flat_map(|inner| inner.iter())
        .collect();
    println!("Flattened: {:?}", flat);  // [1, 2, 3, 4, 5, 6]

    // Split strings and flatten
    let text = "hello world rust programming";
    let chars: Vec<_> = text
        .split_whitespace()
        .flat_map(|word| word.chars())
        .collect();
    println!("Chars: {:?}", chars);
}
```

## Flatten

```rust
fn main() {
    let nested = vec![vec![1, 2], vec![3], vec![4, 5, 6]];

    let flat: Vec<_> = nested.into_iter().flatten().collect();
    println!("{:?}", flat);  // [1, 2, 3, 4, 5, 6]

    // Flatten Options (removes None)
    let options = vec![Some(1), None, Some(3), None, Some(5)];
    let values: Vec<_> = options.into_iter().flatten().collect();
    println!("{:?}", values);  // [1, 3, 5]
}
```

## Take and Skip

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Take first n elements
    let first_three: Vec<_> = v.iter().take(3).collect();
    println!("First 3: {:?}", first_three);  // [1, 2, 3]

    // Skip first n elements
    let after_three: Vec<_> = v.iter().skip(3).collect();
    println!("After 3: {:?}", after_three);  // [4, 5, 6, 7, 8, 9, 10]

    // Pagination-like behavior
    let page_2: Vec<_> = v.iter().skip(3).take(3).collect();
    println!("Page 2: {:?}", page_2);  // [4, 5, 6]
}
```

## Take While and Skip While

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5, 4, 3, 2, 1];

    // Take while condition is true
    let ascending: Vec<_> = v.iter().take_while(|&&x| x < 5).collect();
    println!("Take while < 5: {:?}", ascending);  // [1, 2, 3, 4]

    // Skip while condition is true
    let from_five: Vec<_> = v.iter().skip_while(|&&x| x < 5).collect();
    println!("Skip while < 5: {:?}", from_five);  // [5, 4, 3, 2, 1]
}
```

## Enumerate: Add Indices

```rust
fn main() {
    let v = vec!["a", "b", "c"];

    // Get index with each element
    for (i, val) in v.iter().enumerate() {
        println!("{}: {}", i, val);
    }

    // Find index of element
    let maybe_b = v.iter()
        .enumerate()
        .find(|(_, &val)| val == "b")
        .map(|(i, _)| i);

    println!("Index of 'b': {:?}", maybe_b);  // Some(1)
}
```

## Zip: Combine Iterators

```rust
fn main() {
    let names = vec!["Alice", "Bob", "Charlie"];
    let ages = vec![30, 25, 35];

    // Zip combines element by element
    let people: Vec<_> = names.iter()
        .zip(ages.iter())
        .collect();

    for (name, age) in &people {
        println!("{} is {} years old", name, age);
    }

    // Zip stops at shorter iterator
    let short = vec![1, 2];
    let long = vec!["a", "b", "c", "d"];
    let zipped: Vec<_> = short.iter().zip(long.iter()).collect();
    println!("Zipped: {:?}", zipped);  // [(1, "a"), (2, "b")]
}
```

## Chain: Concatenate Iterators

```rust
fn main() {
    let v1 = vec![1, 2, 3];
    let v2 = vec![4, 5, 6];

    // Chain iterators together
    let combined: Vec<_> = v1.iter().chain(v2.iter()).collect();
    println!("Chained: {:?}", combined);  // [1, 2, 3, 4, 5, 6]

    // Chain different iterator types
    let extra = (7..=9);
    let all: Vec<i32> = v1.into_iter()
        .chain(v2.into_iter())
        .chain(extra)
        .collect();
    println!("All: {:?}", all);  // [1, 2, 3, 4, 5, 6, 7, 8, 9]
}
```

## Cycle: Infinite Repetition

```rust
fn main() {
    let colors = vec!["red", "green", "blue"];

    // Cycle repeats forever (use take!)
    let repeated: Vec<_> = colors.iter()
        .cycle()
        .take(10)
        .collect();

    println!("Cycled: {:?}", repeated);
    // ["red", "green", "blue", "red", "green", "blue", "red", "green", "blue", "red"]
}
```

## Rev: Reverse Order

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    let reversed: Vec<_> = v.iter().rev().collect();
    println!("Reversed: {:?}", reversed);  // [5, 4, 3, 2, 1]

    // Only works on DoubleEndedIterator
    // Ranges work
    let countdown: Vec<_> = (1..=5).rev().collect();
    println!("Countdown: {:?}", countdown);  // [5, 4, 3, 2, 1]
}
```

## Cloned and Copied

```rust
fn main() {
    let v = vec![1, 2, 3];

    // iter() gives &i32, copied() converts to i32
    let owned: Vec<i32> = v.iter().copied().collect();

    // For Clone types (like String), use cloned()
    let strings = vec![String::from("a"), String::from("b")];
    let cloned: Vec<String> = strings.iter().cloned().collect();

    println!("Copied: {:?}", owned);
    println!("Cloned: {:?}", cloned);
}
```

## Inspect: Debug Without Changing

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    let result: Vec<_> = v.iter()
        .inspect(|x| println!("Before filter: {}", x))
        .filter(|&&x| x % 2 == 0)
        .inspect(|x| println!("After filter: {}", x))
        .map(|x| x * 2)
        .inspect(|x| println!("After map: {}", x))
        .collect();

    println!("Result: {:?}", result);
}
```

## Peekable: Look Ahead

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];
    let mut iter = v.iter().peekable();

    while let Some(&current) = iter.next() {
        if let Some(&&next) = iter.peek() {
            println!("{} is followed by {}", current, next);
        } else {
            println!("{} is the last element", current);
        }
    }
}
```

## Complex Chains

```rust
fn main() {
    let data = vec![
        ("Alice", 85),
        ("Bob", 72),
        ("Charlie", 91),
        ("Diana", 68),
        ("Eve", 95),
    ];

    // Find top 3 scorers
    let top_3: Vec<_> = data.iter()
        .map(|(name, score)| (*name, *score))
        .filter(|(_, score)| *score >= 70)  // Passing grade
        .collect::<Vec<_>>()
        .into_iter()
        .enumerate()
        .map(|(i, (name, score))| format!("{}. {} ({})", i + 1, name, score))
        .take(3)
        .collect();

    println!("Top 3 passing students:");
    for s in top_3 {
        println!("  {}", s);
    }
}
```

## Collect Into Different Types

```rust
use std::collections::{HashSet, HashMap};

fn main() {
    let v = vec![1, 2, 2, 3, 3, 3];

    // Collect into Vec
    let as_vec: Vec<_> = v.iter().collect();

    // Collect into HashSet (deduplicates)
    let as_set: HashSet<_> = v.iter().collect();

    // Collect into HashMap
    let pairs = vec![("a", 1), ("b", 2), ("c", 3)];
    let as_map: HashMap<_, _> = pairs.into_iter().collect();

    // Collect with partition
    let numbers = vec![1, 2, 3, 4, 5, 6];
    let (evens, odds): (Vec<_>, Vec<_>) = numbers.iter().partition(|&&x| x % 2 == 0);

    println!("Set: {:?}", as_set);
    println!("Map: {:?}", as_map);
    println!("Evens: {:?}, Odds: {:?}", evens, odds);
}
```

## Key Takeaways

1. **Adaptors are lazy** - they create new iterators, not results
2. **map() transforms** - each element to a new value
3. **filter() selects** - elements matching a predicate
4. **flat_map() and flatten()** - handle nested structures
5. **take() and skip()** - for pagination-like behavior
6. **zip() combines** - multiple iterators element-wise
7. **chain() concatenates** - iterators sequentially
8. **Chains are composable** - build complex pipelines
9. **collect() is flexible** - targets many collection types

You've completed the collections module! These tools are fundamental to writing idiomatic Rust. Next, we'll explore traits - Rust's approach to shared behavior.
