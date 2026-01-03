---
title: Hash Maps
order: 2
estimatedMinutes: 25
---

# Hash Maps: Key-Value Storage

Hash maps store key-value pairs with O(1) average lookup time. They're perfect for when you need to associate values with unique keys.

## Creating Hash Maps

```rust
use std::collections::HashMap;

fn main() {
    // Create an empty hash map
    let mut scores: HashMap<String, i32> = HashMap::new();

    // Insert key-value pairs
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    println!("{:?}", scores);
}
```

## Creating from Iterators

```rust
use std::collections::HashMap;

fn main() {
    // From tuples
    let teams = vec![("Blue", 10), ("Yellow", 50)];
    let scores: HashMap<_, _> = teams.into_iter().collect();

    // From two vectors
    let keys = vec!["one", "two", "three"];
    let values = vec![1, 2, 3];
    let map: HashMap<_, _> = keys.into_iter().zip(values.into_iter()).collect();

    println!("scores: {:?}", scores);
    println!("map: {:?}", map);
}
```

## Accessing Values

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    // Get returns Option<&V>
    let team_name = String::from("Blue");
    if let Some(score) = scores.get(&team_name) {
        println!("{} team score: {}", team_name, score);
    }

    // Handle missing keys
    match scores.get("Red") {
        Some(score) => println!("Red: {}", score),
        None => println!("Red team not found"),
    }

    // Use unwrap_or for default value
    let red_score = scores.get("Red").unwrap_or(&0);
    println!("Red score (with default): {}", red_score);
}
```

## Iterating Over Hash Maps

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert("Blue", 10);
    scores.insert("Yellow", 50);
    scores.insert("Red", 25);

    // Iterate over key-value pairs
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }

    // Iterate over keys only
    for key in scores.keys() {
        println!("Team: {}", key);
    }

    // Iterate over values only
    for value in scores.values() {
        println!("Score: {}", value);
    }

    // Mutable iteration
    for value in scores.values_mut() {
        *value += 10;
    }
    println!("After bonus: {:?}", scores);
}
```

## Updating Values

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();

    // Insert overwrites existing values
    scores.insert("Blue", 10);
    scores.insert("Blue", 25);  // Overwrites
    println!("Blue: {:?}", scores.get("Blue"));  // 25

    // Only insert if key doesn't exist
    scores.entry("Yellow").or_insert(50);
    scores.entry("Yellow").or_insert(100);  // Ignored, Yellow exists
    println!("Yellow: {:?}", scores.get("Yellow"));  // 50

    // Insert with a function
    scores.entry("Red").or_insert_with(|| {
        println!("Computing Red's score...");
        42
    });
}
```

## Updating Based on Old Value

```rust
use std::collections::HashMap;

fn main() {
    let text = "hello world wonderful world";

    let mut word_count = HashMap::new();

    for word in text.split_whitespace() {
        let count = word_count.entry(word).or_insert(0);
        *count += 1;
    }

    println!("{:?}", word_count);
    // {"hello": 1, "world": 2, "wonderful": 1}
}
```

## Ownership and Hash Maps

```rust
use std::collections::HashMap;

fn main() {
    let field_name = String::from("Favorite color");
    let field_value = String::from("Blue");

    let mut map = HashMap::new();

    // Ownership is moved into the hash map
    map.insert(field_name, field_value);

    // println!("{}", field_name);  // ERROR! field_name was moved

    // For types that implement Copy (like i32), values are copied
    let mut int_map = HashMap::new();
    let key = 1;
    int_map.insert(key, 100);
    println!("key is still accessible: {}", key);  // OK

    // With references (need lifetimes)
    let name = String::from("name");
    let mut ref_map: HashMap<&str, i32> = HashMap::new();
    ref_map.insert(&name, 42);
    println!("name still accessible: {}", name);  // OK
}
```

## Removing Entries

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert("Blue", 10);
    scores.insert("Yellow", 50);
    scores.insert("Red", 25);

    // Remove and return the value
    if let Some(score) = scores.remove("Blue") {
        println!("Removed Blue with score: {}", score);
    }

    println!("After removal: {:?}", scores);

    // Clear all entries
    scores.clear();
    println!("After clear: {:?}", scores);
}
```

## Checking Existence

```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();
    map.insert("key1", 1);
    map.insert("key2", 2);

    // Check if key exists
    println!("Contains key1: {}", map.contains_key("key1"));
    println!("Contains key3: {}", map.contains_key("key3"));

    // Check if empty
    println!("Is empty: {}", map.is_empty());

    // Get length
    println!("Length: {}", map.len());
}
```

## Custom Hash Functions

By default, HashMap uses SipHash (secure but not the fastest). For performance-critical code:

```rust
use std::collections::HashMap;
use std::hash::BuildHasherDefault;

// Using a faster hasher (requires external crate in practice)
// This is just to show the pattern

fn main() {
    // Default hasher
    let map: HashMap<String, i32> = HashMap::new();

    // You can specify capacity
    let map_with_capacity: HashMap<String, i32> = HashMap::with_capacity(100);

    println!("Capacity: {}", map_with_capacity.capacity());
}
```

## Nested Hash Maps

```rust
use std::collections::HashMap;

fn main() {
    let mut grades: HashMap<&str, HashMap<&str, i32>> = HashMap::new();

    // Insert nested data
    let mut alice_grades = HashMap::new();
    alice_grades.insert("Math", 95);
    alice_grades.insert("English", 88);
    grades.insert("Alice", alice_grades);

    let mut bob_grades = HashMap::new();
    bob_grades.insert("Math", 82);
    bob_grades.insert("English", 91);
    grades.insert("Bob", bob_grades);

    // Access nested values
    if let Some(alice) = grades.get("Alice") {
        if let Some(math) = alice.get("Math") {
            println!("Alice's Math grade: {}", math);
        }
    }
}
```

## HashSet: Unique Values

When you only care about keys:

```rust
use std::collections::HashSet;

fn main() {
    let mut books = HashSet::new();

    books.insert("The Rust Programming Language");
    books.insert("Programming Rust");
    books.insert("The Rust Programming Language");  // Duplicate, ignored

    println!("Number of books: {}", books.len());  // 2

    // Check membership
    if books.contains("Programming Rust") {
        println!("Found it!");
    }

    // Set operations
    let mut set1: HashSet<i32> = [1, 2, 3].into_iter().collect();
    let set2: HashSet<i32> = [2, 3, 4].into_iter().collect();

    // Union
    let union: HashSet<_> = set1.union(&set2).collect();
    println!("Union: {:?}", union);

    // Intersection
    let intersection: HashSet<_> = set1.intersection(&set2).collect();
    println!("Intersection: {:?}", intersection);

    // Difference
    let difference: HashSet<_> = set1.difference(&set2).collect();
    println!("Difference: {:?}", difference);
}
```

## Common Patterns

### Pattern: Default values with entry

```rust
use std::collections::HashMap;

fn main() {
    let mut cache: HashMap<String, Vec<String>> = HashMap::new();

    // Get or create default
    let items = cache.entry("category".to_string()).or_default();
    items.push("item1".to_string());
    items.push("item2".to_string());

    println!("{:?}", cache);
}
```

### Pattern: Counting occurrences

```rust
use std::collections::HashMap;

fn count_chars(s: &str) -> HashMap<char, usize> {
    let mut counts = HashMap::new();
    for c in s.chars() {
        *counts.entry(c).or_insert(0) += 1;
    }
    counts
}

fn main() {
    let counts = count_chars("hello");
    println!("{:?}", counts);
}
```

### Pattern: Grouping by key

```rust
use std::collections::HashMap;

fn group_by_length(words: &[&str]) -> HashMap<usize, Vec<&str>> {
    let mut groups: HashMap<usize, Vec<&str>> = HashMap::new();
    for word in words {
        groups.entry(word.len()).or_default().push(word);
    }
    groups
}

fn main() {
    let words = vec!["hi", "hello", "bye", "world", "a"];
    let groups = group_by_length(&words);
    println!("{:?}", groups);
}
```

## Key Takeaways

1. **HashMap<K, V> stores key-value pairs** with O(1) average lookup
2. **Use `.get()` for safe access** - returns `Option<&V>`
3. **`.entry()` is powerful** for conditional insertion and updates
4. **Keys must implement Hash and Eq** traits
5. **Ownership transfers to the map** for non-Copy types
6. **Use HashSet for unique values** without associated data
7. **Iteration order is not guaranteed** - hash maps are unordered

Hash maps are essential for efficient lookups. In the next lesson, we'll explore iterators - Rust's powerful abstraction for processing sequences.
