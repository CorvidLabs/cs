---
title: Hash Table Operations
order: 3
estimatedMinutes: 20
---

# Hash Table Operations

This lesson covers the essential operations of hash tables and their implementation details using Python's dictionary as a reference.

## Core Operations

| Operation | Python Syntax | Average Time |
|-----------|---------------|--------------|
| Insert | `d[key] = value` | O(1) |
| Lookup | `d[key]` or `d.get(key)` | O(1) |
| Delete | `del d[key]` | O(1) |
| Check existence | `key in d` | O(1) |
| Get size | `len(d)` | O(1) |

## Insertion

### Basic Insertion

```python
# Using Python dict
d = {}
d["name"] = "Alice"  # Insert
d["age"] = 30        # Insert
d["name"] = "Bob"    # Update existing key

# What happens internally:
# 1. Compute hash(key)
# 2. Map to bucket index
# 3. If key exists, update value
# 4. If not, insert new entry
# 5. If load factor exceeds threshold, resize
```

### setdefault and defaultdict

```python
# setdefault: insert only if key missing
d = {}
d.setdefault("count", 0)
d["count"] += 1

# Equivalent to:
if "count" not in d:
    d["count"] = 0
d["count"] += 1

# defaultdict: automatic default values
from collections import defaultdict
counts = defaultdict(int)
counts["a"] += 1  # No KeyError, starts at 0

lists = defaultdict(list)
lists["key"].append(1)  # No KeyError, starts with []
```

## Lookup

### Direct Access

```python
d = {"a": 1, "b": 2}

# Direct access - raises KeyError if missing
value = d["a"]  # Returns 1
value = d["c"]  # KeyError!

# Safe access with get()
value = d.get("a")        # Returns 1
value = d.get("c")        # Returns None
value = d.get("c", 0)     # Returns 0 (default)
```

### Membership Testing

```python
d = {"a": 1, "b": 2}

# Check if key exists
if "a" in d:
    print("Found")

# Check if key is missing
if "c" not in d:
    print("Not found")

# Note: `in` tests KEYS, not values
1 in d  # False (1 is a value, not a key)
```

## Deletion

### Remove by Key

```python
d = {"a": 1, "b": 2, "c": 3}

# del statement - raises KeyError if missing
del d["a"]
del d["x"]  # KeyError!

# pop() - returns value and removes
value = d.pop("b")        # Returns 2, removes "b"
value = d.pop("x", None)  # Returns None, no error

# popitem() - remove arbitrary item (LIFO in Python 3.7+)
key, value = d.popitem()

# clear() - remove all items
d.clear()
```

### Safe Deletion Pattern

```python
# Pattern 1: Check first
if key in d:
    del d[key]

# Pattern 2: Use pop with default
d.pop(key, None)

# Pattern 3: Exception handling
try:
    del d[key]
except KeyError:
    pass
```

## Iteration

### Iterating Over Keys, Values, Items

```python
d = {"a": 1, "b": 2, "c": 3}

# Keys (default iteration)
for key in d:
    print(key)

# Values
for value in d.values():
    print(value)

# Key-value pairs
for key, value in d.items():
    print(f"{key}: {value}")
```

### Iteration Order

Python 3.7+ guarantees insertion order:

```python
d = {}
d["first"] = 1
d["second"] = 2
d["third"] = 3

list(d.keys())  # ['first', 'second', 'third']
```

### Safe Modification During Iteration

```python
d = {"a": 1, "b": 2, "c": 3}

# DON'T: Modify during iteration
for key in d:
    if d[key] < 2:
        del d[key]  # RuntimeError!

# DO: Iterate over a copy
for key in list(d.keys()):
    if d[key] < 2:
        del d[key]

# Or use dict comprehension
d = {k: v for k, v in d.items() if v >= 2}
```

## Merging Dictionaries

```python
d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}

# Method 1: update() modifies in place
d1.update(d2)  # d1 = {"a": 1, "b": 3, "c": 4}

# Method 2: Unpacking (Python 3.5+)
merged = {**d1, **d2}

# Method 3: Union operator (Python 3.9+)
merged = d1 | d2      # New dict
d1 |= d2              # In-place update
```

## Dictionary Comprehensions

```python
# Basic comprehension
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# With condition
even_squares = {x: x**2 for x in range(10) if x % 2 == 0}

# Transforming an existing dict
d = {"a": 1, "b": 2}
doubled = {k: v * 2 for k, v in d.items()}

# Inverting a dict
inverted = {v: k for k, v in d.items()}

# Filtering
filtered = {k: v for k, v in d.items() if v > 1}
```

## Common Patterns

### Counting Occurrences

```python
# Manual counting
counts = {}
for item in items:
    counts[item] = counts.get(item, 0) + 1

# Using defaultdict
from collections import defaultdict
counts = defaultdict(int)
for item in items:
    counts[item] += 1

# Using Counter
from collections import Counter
counts = Counter(items)
```

### Grouping Items

```python
from collections import defaultdict

# Group words by first letter
words = ["apple", "ant", "banana", "berry", "cherry"]
groups = defaultdict(list)

for word in words:
    groups[word[0]].append(word)

# {'a': ['apple', 'ant'], 'b': ['banana', 'berry'], 'c': ['cherry']}
```

### Caching/Memoization

```python
# Manual cache
cache = {}

def expensive_function(n):
    if n in cache:
        return cache[n]
    result = compute(n)  # Expensive computation
    cache[n] = result
    return result

# Using functools.lru_cache
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_function(n):
    return compute(n)
```

### Two-way Mapping

```python
# Create bidirectional mapping
id_to_name = {1: "Alice", 2: "Bob", 3: "Charlie"}
name_to_id = {v: k for k, v in id_to_name.items()}

# Lookup both ways
name = id_to_name[1]  # "Alice"
id = name_to_id["Bob"]  # 2
```

## Performance Tips

### Use the Right Key Type

```python
# Tuple keys (hashable) - OK
cache = {}
cache[(x, y)] = value

# List keys (not hashable) - Error!
cache[[x, y]] = value  # TypeError

# Convert to tuple if needed
cache[tuple([x, y])] = value
```

### Avoid Repeated Hashing

```python
# Inefficient: hashes "key" multiple times
if "key" in d:
    value = d["key"]
else:
    value = default

# Better: single hash lookup
value = d.get("key", default)
```

### Pre-allocate When Size Known

```python
# Dict comprehension pre-allocates
d = {i: i**2 for i in range(1000)}

# Versus incremental insertion
d = {}
for i in range(1000):
    d[i] = i**2  # May trigger multiple resizes
```

## Summary

Hash table operations in Python:
- O(1) average for insert, lookup, delete
- Multiple ways to handle missing keys
- Iteration preserves insertion order (Python 3.7+)
- Rich set of methods for common patterns

Key patterns:
- Use `get()` for safe access with defaults
- Use `setdefault()` or `defaultdict` for initialization
- Use comprehensions for transformations
- Be careful modifying during iteration

In the next lesson, we will explore practical applications of hash tables.
