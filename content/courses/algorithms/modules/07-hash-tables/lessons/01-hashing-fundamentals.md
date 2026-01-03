---
title: Hashing Fundamentals
order: 1
estimatedMinutes: 20
---

# Hashing Fundamentals

Hash tables are one of the most important data structures in computer science, providing average O(1) time for insertions, deletions, and lookups. This lesson covers the fundamental concepts of hashing that make this efficiency possible.

## What is Hashing?

Hashing is the process of converting a key into an array index using a hash function. This enables direct access to data without searching.

```
Key -> Hash Function -> Index -> Value

"apple" -> hash("apple") -> 42 -> {"apple": "red"}
```

## Hash Functions

A hash function takes an input (key) and returns an integer (hash code).

### Properties of Good Hash Functions

1. **Deterministic**: Same input always produces same output
2. **Uniform distribution**: Spreads keys evenly across indices
3. **Efficient**: Fast to compute
4. **Minimizes collisions**: Different keys should produce different hashes

### Simple Hash Function Examples

```python
# String hash - sum of character codes
def simple_hash(key, table_size):
    total = 0
    for char in key:
        total += ord(char)
    return total % table_size

# Better string hash - polynomial rolling hash
def polynomial_hash(key, table_size, prime=31):
    hash_value = 0
    for char in key:
        hash_value = hash_value * prime + ord(char)
    return hash_value % table_size
```

### Python's Built-in Hash

```python
# Python's hash() function
hash("hello")     # Returns an integer
hash(42)          # Works with numbers
hash((1, 2, 3))   # Works with tuples

# Dictionaries and sets use hash internally
my_dict = {"key": "value"}  # "key" is hashed to find bucket
my_set = {1, 2, 3}          # Each element is hashed
```

## Hash Table Structure

A hash table consists of:
1. An array of buckets (slots)
2. A hash function to map keys to bucket indices
3. A collision resolution strategy

```
Index:  0       1       2       3       4
      +-------+-------+-------+-------+-------+
      | None  | "cat" | None  | "dog" | "ant" |
      +-------+-------+-------+-------+-------+

hash("cat") % 5 = 1
hash("dog") % 5 = 3
hash("ant") % 5 = 4
```

## Load Factor

The load factor measures how full the hash table is:

```
Load Factor = Number of entries / Number of buckets
            = n / m
```

- **Low load factor** (< 0.5): Wastes space, but fast
- **High load factor** (> 0.7): Saves space, but more collisions
- **Typical threshold**: 0.75 (Python dicts resize at ~0.66)

## The Collision Problem

When two different keys hash to the same index, we have a **collision**:

```python
# Example collision
hash("abc") % 10 = 6
hash("bca") % 10 = 6  # Same index!
```

Collisions are inevitable due to the **pigeonhole principle**: if you have more keys than buckets, at least one bucket must contain multiple keys.

## Basic Hash Table Implementation

```python
class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.buckets = [None] * size
        self.count = 0

    def _hash(self, key):
        """Compute hash index for key."""
        return hash(key) % self.size

    def put(self, key, value):
        """Insert or update key-value pair."""
        index = self._hash(key)
        # Collision handling needed here!
        self.buckets[index] = (key, value)
        self.count += 1

    def get(self, key):
        """Retrieve value by key."""
        index = self._hash(key)
        if self.buckets[index] and self.buckets[index][0] == key:
            return self.buckets[index][1]
        return None

    def load_factor(self):
        return self.count / self.size
```

This basic implementation lacks collision handling, which we will cover in the next lesson.

## Hash Functions for Different Types

### Integers

```python
def hash_int(n, table_size):
    # Simple modular hashing
    return n % table_size

# For negative numbers, ensure positive result
def hash_int_safe(n, table_size):
    return ((n % table_size) + table_size) % table_size
```

### Strings

```python
def hash_string(s, table_size):
    """Polynomial rolling hash."""
    hash_value = 0
    prime = 31
    for char in s:
        hash_value = (hash_value * prime + ord(char))
    return hash_value % table_size
```

### Composite Keys

```python
def hash_point(x, y, table_size):
    """Hash a 2D point."""
    # Combine hashes - use prime to reduce collisions
    return (hash(x) * 31 + hash(y)) % table_size
```

## Immutability Requirement

Keys must be immutable (hashable) because:
1. Hash must remain constant while key is in table
2. Mutable objects could change, causing "lost" entries

```python
# Hashable (immutable)
hash("string")     # OK
hash((1, 2, 3))    # OK
hash(frozenset())  # OK

# Not hashable (mutable)
hash([1, 2, 3])    # TypeError!
hash({1, 2, 3})    # TypeError!
hash({"a": 1})     # TypeError!
```

## Python's dict Implementation

Python dictionaries use:
1. **Open addressing** with **random probing**
2. Automatic resizing when load factor exceeds threshold
3. Compact memory layout for cache efficiency

```python
# Python dict operations are O(1) average
d = {}
d["key"] = "value"    # O(1) insert
value = d["key"]      # O(1) lookup
del d["key"]          # O(1) delete
"key" in d            # O(1) membership test
```

## When Hashing Fails

Hash tables have O(n) worst case when:
1. **Poor hash function**: Many collisions
2. **Adversarial input**: Keys designed to collide
3. **Extreme load factor**: Table too full

```python
# Worst case: all keys hash to same index
class BadHash:
    def __hash__(self):
        return 0  # All instances collide!
```

## Complexity Summary

| Operation | Average | Worst |
|-----------|---------|-------|
| Insert | O(1) | O(n) |
| Lookup | O(1) | O(n) |
| Delete | O(1) | O(n) |
| Resize | O(n) | O(n) |

## Summary

Hash tables achieve O(1) average operations through:
- **Hash functions**: Convert keys to array indices
- **Direct access**: Jump straight to data location
- **Good distribution**: Spread keys evenly

Key concepts:
- Load factor controls space/time tradeoff
- Keys must be immutable (hashable)
- Collisions are inevitable and must be handled

In the next lesson, we will explore strategies for handling collisions.
