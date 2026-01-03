# Time vs. Space Complexity

## The Fundamental Trade-off

In algorithm design, you often face a choice: use more memory to save time, or use more time to save memory. This trade-off is fundamental to computer science and appears in countless real-world scenarios.

Understanding when and how to make this trade-off is a critical skill for any programmer.

## Space Complexity Basics

Space complexity measures how much memory an algorithm uses relative to its input size. Like time complexity, we express it using Big-O notation.

### What Counts as Space?

1. **Input space**: Memory used to store the input (often excluded from analysis)
2. **Auxiliary space**: Extra memory used by the algorithm itself
3. **Output space**: Memory used to store the result

When we discuss space complexity, we typically mean **auxiliary space** unless otherwise stated.

### Common Space Complexities

```python
# O(1) space - uses fixed amount of memory
def find_max(items):
    maximum = items[0]  # One variable, regardless of input size
    for item in items:
        if item > maximum:
            maximum = item
    return maximum

# O(n) space - memory grows with input
def duplicate_list(items):
    return [item for item in items]  # New list same size as input

# O(n^2) space - memory grows quadratically
def create_matrix(n):
    return [[0 for _ in range(n)] for _ in range(n)]
```

## Trading Space for Time

The most common trade-off is using additional memory to speed up computation.

### Example 1: Memoization

Consider computing Fibonacci numbers:

```python
# Time: O(2^n), Space: O(n) for call stack
def fib_recursive(n):
    if n <= 1:
        return n
    return fib_recursive(n - 1) + fib_recursive(n - 2)

# Time: O(n), Space: O(n) for cache
def fib_memoized(n, cache=None):
    if cache is None:
        cache = {}

    if n in cache:
        return cache[n]

    if n <= 1:
        return n

    cache[n] = fib_memoized(n - 1, cache) + fib_memoized(n - 2, cache)
    return cache[n]
```

By storing previously computed results, we reduce time complexity from O(2^n) to O(n) at the cost of O(n) space.

### Example 2: Hash Tables for Fast Lookup

Finding duplicates in a list:

```python
# Time: O(n^2), Space: O(1) (excluding output)
def find_duplicates_slow(items):
    duplicates = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j] and items[i] not in duplicates:
                duplicates.append(items[i])
    return duplicates

# Time: O(n), Space: O(n)
def find_duplicates_fast(items):
    seen = set()
    duplicates = set()

    for item in items:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)

    return list(duplicates)
```

The hash set trades O(n) space for a dramatic improvement from O(n^2) to O(n) time.

### Example 3: Precomputation

Two sum problem - find two numbers that add to a target:

```python
# Time: O(n^2), Space: O(1)
def two_sum_slow(numbers, target):
    for i in range(len(numbers)):
        for j in range(i + 1, len(numbers)):
            if numbers[i] + numbers[j] == target:
                return (i, j)
    return None

# Time: O(n), Space: O(n)
def two_sum_fast(numbers, target):
    seen = {}

    for i, num in enumerate(numbers):
        complement = target - num
        if complement in seen:
            return (seen[complement], i)
        seen[num] = i

    return None
```

## Trading Time for Space

Sometimes memory is the constraint, and we accept slower execution to fit within limits.

### Example 1: In-Place Sorting

```python
# Time: O(n log n), Space: O(n) - merge sort needs temporary arrays
def merge_sort(items):
    if len(items) <= 1:
        return items
    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])
    return merge(left, right)

# Time: O(n^2), Space: O(1) - insertion sort works in place
def insertion_sort(items):
    for i in range(1, len(items)):
        key = items[i]
        j = i - 1
        while j >= 0 and items[j] > key:
            items[j + 1] = items[j]
            j -= 1
        items[j + 1] = key
    return items
```

When memory is severely constrained, O(n^2) time with O(1) space might be preferable to O(n log n) time with O(n) space.

### Example 2: Streaming Algorithms

When data is too large to fit in memory:

```python
# Requires O(n) space - stores all data
def find_median_simple(stream):
    all_data = list(stream)
    all_data.sort()
    mid = len(all_data) // 2
    return all_data[mid]

# O(1) space but only approximate median
# Uses reservoir sampling or streaming algorithms
def find_approximate_median(stream):
    # Simplified example using reservoir sampling
    count = 0
    result = None

    for item in stream:
        count += 1
        if count == 1:
            result = item
        elif random.random() < 1.0 / count:
            result = item

    return result  # Not exact median, but representative sample
```

## Analyzing the Trade-off

When deciding between time and space, consider:

### 1. What Are Your Constraints?

- **Memory-limited**: Embedded systems, mobile devices, processing huge datasets
- **Time-limited**: Real-time systems, user-facing applications
- **Balanced**: Most server applications, batch processing

### 2. What Is the Scale?

At small scales, the trade-off often does not matter. At large scales, it becomes critical.

```python
# For n = 100, difference between O(n) and O(n^2) is 100 vs 10,000
# For n = 1,000,000, difference is 1M vs 1 trillion
```

### 3. Is the Space Persistent or Temporary?

- **Temporary space**: Used during computation, then freed
- **Persistent space**: Stored for future use (caches, indexes)

Temporary space is usually more acceptable because it does not accumulate.

### 4. Can You Use External Storage?

Sometimes you can trade disk I/O time for memory:

```python
# In-memory: Fast but limited by RAM
cache = {}

# On-disk: Slower but virtually unlimited
import shelve
cache = shelve.open('cache.db')
```

## Common Patterns

### Caching / Memoization

Store computed results to avoid recomputation.

**Trade-off**: O(n) or more space for potentially exponential time savings.

### Indexing

Build data structures for fast lookup.

**Trade-off**: O(n) space for O(1) lookup instead of O(n) search.

### Precomputation

Calculate values upfront that will be needed repeatedly.

**Trade-off**: One-time O(n) or O(n^2) work plus storage for O(1) queries.

### Compression

Store data in compressed form, decompress when needed.

**Trade-off**: Less space, more CPU time for encoding/decoding.

## The Right Choice

There is no universal "right" answer. The best choice depends on:

1. Your specific constraints (memory, time, or both)
2. The expected input size
3. How often the operation runs
4. The cost of memory versus compute in your environment

As a general guideline:

- **Optimize for time** when responsiveness matters and memory is available
- **Optimize for space** when memory is constrained or when working with huge datasets
- **Start simple** and optimize only when measurements show it is necessary

## Summary

Time and space complexity often trade off against each other:

- Use more memory to save time: caching, hash tables, precomputation
- Use more time to save memory: in-place algorithms, streaming, recomputation

The right choice depends on your constraints, scale, and requirements. Understanding both dimensions of complexity helps you make informed decisions.

In the next lesson, we will learn practical techniques for analyzing code to determine its time and space complexity.
