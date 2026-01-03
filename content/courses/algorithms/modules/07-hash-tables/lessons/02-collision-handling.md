---
title: Collision Handling
order: 2
estimatedMinutes: 25
---

# Collision Handling

When two keys hash to the same index, we have a collision. This lesson explores the two main strategies for handling collisions: chaining and open addressing.

## Why Collisions Happen

Even with a perfect hash function, collisions are mathematically guaranteed when you have more possible keys than bucket indices. This is the **pigeonhole principle**.

```
Birthday Paradox Example:
With only 23 people, there's a 50% chance two share a birthday.
With hash tables, collisions happen even sooner!
```

## Strategy 1: Chaining (Separate Chaining)

Each bucket contains a list of all entries that hash to that index.

```
Index:  0         1           2         3
      +-----+   +-----+     +-----+   +-----+
      |     |   | "a" |---->| "f" |   | "c" |
      +-----+   +-----+     +-----+   +-----+
                             |
                             v
                           +-----+
                           | "k" |
                           +-----+

hash("a") % 4 = 1
hash("f") % 4 = 2
hash("k") % 4 = 2  (collision with "f")
hash("c") % 4 = 3
```

### Implementation

```python
class ChainedHashTable:
    def __init__(self, size=10):
        self.size = size
        self.buckets = [[] for _ in range(size)]
        self.count = 0

    def _hash(self, key):
        return hash(key) % self.size

    def put(self, key, value):
        """Insert or update key-value pair."""
        index = self._hash(key)
        bucket = self.buckets[index]

        # Check if key exists, update if so
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return

        # Key not found, append new entry
        bucket.append((key, value))
        self.count += 1

    def get(self, key):
        """Retrieve value by key."""
        index = self._hash(key)
        bucket = self.buckets[index]

        for k, v in bucket:
            if k == key:
                return v

        raise KeyError(key)

    def delete(self, key):
        """Remove key-value pair."""
        index = self._hash(key)
        bucket = self.buckets[index]

        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                self.count -= 1
                return

        raise KeyError(key)

    def __contains__(self, key):
        index = self._hash(key)
        return any(k == key for k, v in self.buckets[index])
```

### Chaining Analysis

| Metric | Value |
|--------|-------|
| Average chain length | n/m (load factor) |
| Search (average) | O(1 + n/m) = O(1) if load factor is constant |
| Search (worst) | O(n) - all keys in one chain |
| Space | O(n + m) - entries plus bucket array |

### Advantages of Chaining

1. Simple to implement
2. Never "fills up" - can always add more entries
3. Delete operation is straightforward
4. Less sensitive to poor hash functions

### Disadvantages of Chaining

1. Extra memory for linked list pointers
2. Cache unfriendly - links scattered in memory
3. Performance degrades with high load factor

## Strategy 2: Open Addressing

All entries are stored directly in the bucket array. When a collision occurs, we probe for the next available slot.

```
Insert "cat", "dog", "car" where hash % 5:
hash("cat") = 1
hash("dog") = 1 (collision!)
hash("car") = 4

After insertion with linear probing:
Index:  0       1       2       3       4
      +-------+-------+-------+-------+-------+
      | None  | "cat" | "dog" | None  | "car" |
      +-------+-------+-------+-------+-------+
              ^       ^
              |       |
              |       dog probed to index 2
              cat at hash index
```

### Linear Probing

Check consecutive slots until an empty one is found:
- probe(i) = (hash + i) % size

```python
class LinearProbingHashTable:
    def __init__(self, size=10):
        self.size = size
        self.keys = [None] * size
        self.values = [None] * size
        self.count = 0
        self.DELETED = object()  # Tombstone marker

    def _hash(self, key):
        return hash(key) % self.size

    def put(self, key, value):
        if self.count >= self.size * 0.7:
            self._resize()

        index = self._hash(key)

        while self.keys[index] is not None:
            if self.keys[index] == key:
                # Update existing key
                self.values[index] = value
                return
            if self.keys[index] is self.DELETED:
                # Can reuse deleted slot
                break
            index = (index + 1) % self.size

        self.keys[index] = key
        self.values[index] = value
        self.count += 1

    def get(self, key):
        index = self._hash(key)
        start = index

        while self.keys[index] is not None:
            if self.keys[index] == key:
                return self.values[index]
            index = (index + 1) % self.size
            if index == start:
                break

        raise KeyError(key)

    def delete(self, key):
        index = self._hash(key)
        start = index

        while self.keys[index] is not None:
            if self.keys[index] == key:
                self.keys[index] = self.DELETED
                self.values[index] = None
                self.count -= 1
                return
            index = (index + 1) % self.size
            if index == start:
                break

        raise KeyError(key)

    def _resize(self):
        old_keys = self.keys
        old_values = self.values

        self.size *= 2
        self.keys = [None] * self.size
        self.values = [None] * self.size
        self.count = 0

        for i, key in enumerate(old_keys):
            if key is not None and key is not self.DELETED:
                self.put(key, old_values[i])
```

### Quadratic Probing

Probe slots at quadratic intervals:
- probe(i) = (hash + i^2) % size

```python
def _probe_quadratic(self, key, for_insert=False):
    index = self._hash(key)
    i = 0

    while True:
        probe_index = (index + i * i) % self.size

        if self.keys[probe_index] is None:
            return probe_index if for_insert else -1
        if self.keys[probe_index] == key:
            return probe_index

        i += 1
        if i >= self.size:
            return -1  # Table full or not found
```

### Double Hashing

Use a second hash function for probe step:
- probe(i) = (hash1 + i * hash2) % size

```python
def _hash2(self, key):
    """Second hash function for double hashing."""
    # Must never return 0
    return 7 - (hash(key) % 7)

def _probe_double(self, key, for_insert=False):
    index = self._hash(key)
    step = self._hash2(key)
    i = 0

    while i < self.size:
        probe_index = (index + i * step) % self.size

        if self.keys[probe_index] is None:
            return probe_index if for_insert else -1
        if self.keys[probe_index] == key:
            return probe_index

        i += 1

    return -1
```

## Comparing Probing Strategies

| Strategy | Clustering | Cache Performance | Implementation |
|----------|------------|-------------------|----------------|
| Linear | Primary clustering | Best | Simplest |
| Quadratic | Secondary clustering | Good | Moderate |
| Double Hashing | Minimal | Poor | Complex |

### Clustering

**Primary clustering** (linear probing): Long runs of occupied slots form, increasing search time.

```
Bad clustering:
[x][x][x][x][x][x][x][ ][ ][ ]
 ^-------------------------^
 All inserts probe through this cluster
```

**Secondary clustering**: Keys with same initial hash follow same probe sequence.

## Tombstones for Deletion

Open addressing requires special handling for deletion:

```
Without tombstones:
Insert A at index 1
Insert B at index 2 (collision from 1)
Delete A
Search for B: Start at 1, see None, stop. B "lost"!

With tombstones:
Delete A: Mark as DELETED
Search for B: Start at 1, see DELETED, continue to 2, find B
```

## Resizing

When load factor exceeds threshold, resize and rehash:

```python
def _resize(self):
    # Save old data
    old_entries = [(k, v) for k, v in self.items()]

    # Create larger table
    self.size *= 2
    self.buckets = [[] for _ in range(self.size)]
    self.count = 0

    # Reinsert all entries
    for key, value in old_entries:
        self.put(key, value)
```

## Chaining vs Open Addressing

| Aspect | Chaining | Open Addressing |
|--------|----------|-----------------|
| Memory overhead | Pointer per entry | None |
| Cache performance | Poor | Good |
| Load factor limit | No limit | Must be < 1 |
| Deletion | Simple | Needs tombstones |
| Clustering | None | Can be severe |

## Python's Approach

Python uses **open addressing with random probing**:
- Perturbed probing to spread entries
- Compact dict representation
- Automatic resizing at ~66% load factor

```python
# Simplified Python probing logic
def probe_python(hash_value, size):
    perturb = hash_value
    index = hash_value % size

    while True:
        yield index
        perturb >>= 5
        index = (5 * index + perturb + 1) % size
```

## Summary

Collision handling is essential for hash table performance:

**Chaining**:
- Uses linked lists per bucket
- Simple, flexible, never fills up
- Extra memory for pointers

**Open Addressing**:
- Stores all entries in array
- Cache friendly, memory efficient
- Requires careful load factor management

Choose based on your memory constraints and access patterns. Next, we will explore hash table operations in detail.
