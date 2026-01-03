---
title: Big O Basics
order: 1
estimatedMinutes: 20
---

# Big O Basics

Big O notation describes how an algorithm's performance changes as input size grows. Understanding Big O helps you write efficient code and choose the right algorithms.

## Why Big O Matters

Consider finding a name in a phone book:

- **Linear search**: Check every entry from the start. For 1,000 entries, you might check all 1,000.
- **Binary search**: Open to the middle, eliminate half, repeat. For 1,000 entries, you need at most 10 checks.

As the phone book grows, the difference becomes dramatic. That's what Big O measures.

## What Big O Measures

Big O describes the **worst-case** growth rate of:
- **Time complexity**: How runtime grows with input size
- **Space complexity**: How memory usage grows with input size

We care about growth rate, not exact numbers. Constants and small terms are ignored.

## Common Big O Classifications

### O(1) - Constant Time

Runtime doesn't change with input size:

```python
def get_first(items):
    return items[0]

def add_to_dict(dictionary, key, value):
    dictionary[key] = value
```

Whether the list has 10 or 10 million items, accessing the first element takes the same time.

**Examples:**
- Array access by index
- Dictionary lookup
- Push/pop from a stack

### O(log n) - Logarithmic Time

Runtime grows slowly as input doubles:

```python
def binary_search(sorted_list, target):
    left, right = 0, len(sorted_list) - 1

    while left <= right:
        mid = (left + right) // 2
        if sorted_list[mid] == target:
            return mid
        elif sorted_list[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
```

Each step eliminates half the remaining options.

**Examples:**
- Binary search
- Balanced tree operations
- Finding a word in a dictionary

### O(n) - Linear Time

Runtime grows proportionally with input:

```python
def find_max(items):
    max_value = items[0]
    for item in items:
        if item > max_value:
            max_value = item
    return max_value
```

Doubling the input doubles the work.

**Examples:**
- Simple loops
- Linear search
- Counting items

### O(n log n) - Linearithmic Time

Common for efficient sorting algorithms:

```python
def merge_sort(items):
    if len(items) <= 1:
        return items

    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])

    return merge(left, right)
```

**Examples:**
- Merge sort
- Quick sort (average case)
- Heap sort

### O(n^2) - Quadratic Time

Nested loops over the same data:

```python
def bubble_sort(items):
    n = len(items)
    for i in range(n):
        for j in range(n - 1):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
    return items
```

Doubling the input quadruples the work.

**Examples:**
- Nested loops
- Bubble sort
- Comparing all pairs

### O(2^n) - Exponential Time

Extremely slow; avoid if possible:

```python
def fibonacci_recursive(n):
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)
```

Each additional input element doubles the work.

**Examples:**
- Naive recursive Fibonacci
- Power set generation
- Some brute-force algorithms

## Comparing Growth Rates

For an input of size n = 1,000:

| Big O | Operations |
|-------|------------|
| O(1) | 1 |
| O(log n) | ~10 |
| O(n) | 1,000 |
| O(n log n) | ~10,000 |
| O(n^2) | 1,000,000 |
| O(2^n) | More than atoms in universe |

## Analyzing Your Code

### Rule 1: Drop Constants

O(2n) simplifies to O(n). Constants don't matter at scale.

```python
# Both are O(n)
for item in items:
    print(item)
for item in items:
    print(item)
```

### Rule 2: Drop Smaller Terms

O(n^2 + n) simplifies to O(n^2). The largest term dominates.

### Rule 3: Different Inputs = Different Variables

```python
def compare_lists(list_a, list_b):
    for a in list_a:        # O(n)
        for b in list_b:    # O(m)
            if a == b:
                return True
    return False
```

This is O(n * m), not O(n^2), because the lists may have different sizes.

### Rule 4: Consecutive Steps Add

```python
def process(items):
    for item in items:      # O(n)
        print(item)

    for i in range(len(items)):  # O(n)
        for j in range(len(items)):  # O(n)
            print(i, j)
```

Total: O(n) + O(n^2) = O(n^2)

## Space Complexity

Big O also measures memory usage:

```python
def create_matrix(n):
    # Creates n x n grid = O(n^2) space
    return [[0] * n for _ in range(n)]

def sum_list(items):
    # Only stores one number = O(1) space
    total = 0
    for item in items:
        total += item
    return total
```

## Practical Tips

1. **O(1) and O(log n)** - Excellent, scale effortlessly
2. **O(n)** - Good, acceptable for most applications
3. **O(n log n)** - Reasonable, typical for sorting
4. **O(n^2)** - Problematic for large inputs, optimize if possible
5. **O(2^n)** - Usually impractical, find a better approach

## Try It Yourself

Analyze these functions:

```python
def mystery1(n):
    for i in range(n):
        print(i)

def mystery2(n):
    for i in range(n):
        for j in range(n):
            print(i, j)

def mystery3(items):
    return items[len(items) // 2]
```

## Key Takeaways

1. Big O describes how performance scales with input size
2. Focus on the dominant term; ignore constants
3. O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)
4. Choose algorithms based on expected input size
5. Sometimes trading space for time (or vice versa) is worth it

Next, we'll explore searching algorithms and see Big O in action.
