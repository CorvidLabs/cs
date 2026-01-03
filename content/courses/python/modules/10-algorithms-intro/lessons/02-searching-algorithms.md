---
title: Searching Algorithms
order: 2
estimatedMinutes: 20
---

# Searching Algorithms

Searching is one of the most fundamental operations in programming. Let's explore two essential algorithms: linear search and binary search.

## Linear Search

Linear search checks each element one by one until it finds the target or reaches the end.

### Implementation

```python
def linear_search(items, target):
    """
    Search for target in items.

    Args:
        items: List to search.
        target: Value to find.

    Returns:
        Index of target if found, -1 otherwise.
    """
    for index in range(len(items)):
        if items[index] == target:
            return index
    return -1
```

### Using enumerate

```python
def linear_search(items, target):
    for index, item in enumerate(items):
        if item == target:
            return index
    return -1
```

### Example Usage

```python
numbers = [4, 2, 7, 1, 9, 3, 8]

print(linear_search(numbers, 7))   # 2
print(linear_search(numbers, 5))   # -1
```

### Time Complexity

- **Best case**: O(1) - Target is the first element
- **Worst case**: O(n) - Target is last or not present
- **Average case**: O(n)

### When to Use Linear Search

- Unsorted data
- Small datasets
- Searching only once
- Finding all occurrences

### Finding All Occurrences

```python
def linear_search_all(items, target):
    """Return all indices where target appears."""
    indices = []
    for index, item in enumerate(items):
        if item == target:
            indices.append(index)
    return indices

data = [1, 3, 5, 3, 7, 3, 9]
print(linear_search_all(data, 3))  # [1, 3, 5]
```

## Binary Search

Binary search is much faster but requires **sorted** data. It repeatedly divides the search space in half.

### How It Works

1. Check the middle element
2. If it's the target, return its index
3. If target is smaller, search the left half
4. If target is larger, search the right half
5. Repeat until found or no elements remain

### Iterative Implementation

```python
def binary_search(sorted_items, target):
    """
    Search for target in a sorted list.

    Args:
        sorted_items: Sorted list to search.
        target: Value to find.

    Returns:
        Index of target if found, -1 otherwise.
    """
    left = 0
    right = len(sorted_items) - 1

    while left <= right:
        mid = (left + right) // 2

        if sorted_items[mid] == target:
            return mid
        elif sorted_items[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
```

### Step-by-Step Example

```python
sorted_numbers = [1, 3, 5, 7, 9, 11, 13, 15]
target = 7

# Step 1: left=0, right=7, mid=3
# sorted_numbers[3] = 7 == target
# Found at index 3!
```

Searching for 9:
```
Array: [1, 3, 5, 7, 9, 11, 13, 15]
        0  1  2  3  4   5   6   7

Step 1: left=0, right=7, mid=3
        Check arr[3]=7, target=9
        7 < 9, so search right half
        left = 4

Step 2: left=4, right=7, mid=5
        Check arr[5]=11, target=9
        11 > 9, so search left half
        right = 4

Step 3: left=4, right=4, mid=4
        Check arr[4]=9, target=9
        Found at index 4!
```

### Time Complexity

- **Best case**: O(1) - Target is in the middle
- **Worst case**: O(log n) - Maximum divisions needed
- **Average case**: O(log n)

### The Power of O(log n)

| Items | Linear Search (worst) | Binary Search (worst) |
|-------|----------------------|----------------------|
| 10 | 10 comparisons | 4 comparisons |
| 100 | 100 | 7 |
| 1,000 | 1,000 | 10 |
| 1,000,000 | 1,000,000 | 20 |

Binary search scales incredibly well!

### Recursive Implementation

```python
def binary_search_recursive(sorted_items, target, left=0, right=None):
    """Binary search using recursion."""
    if right is None:
        right = len(sorted_items) - 1

    if left > right:
        return -1

    mid = (left + right) // 2

    if sorted_items[mid] == target:
        return mid
    elif sorted_items[mid] < target:
        return binary_search_recursive(sorted_items, target, mid + 1, right)
    else:
        return binary_search_recursive(sorted_items, target, left, mid - 1)
```

## Python's Built-in Search

### The in Operator

```python
numbers = [4, 2, 7, 1, 9]

if 7 in numbers:
    print("Found!")

# For index, use index() method (raises error if not found)
try:
    idx = numbers.index(7)
    print(f"Found at index {idx}")
except ValueError:
    print("Not found")
```

### bisect Module for Binary Search

```python
import bisect

sorted_numbers = [1, 3, 5, 7, 9, 11, 13, 15]

# Find insertion point (for maintaining sorted order)
pos = bisect.bisect_left(sorted_numbers, 7)
print(pos)  # 3

# Check if value exists
if pos < len(sorted_numbers) and sorted_numbers[pos] == 7:
    print("Found at index", pos)

# Insert while maintaining order
bisect.insort(sorted_numbers, 8)
print(sorted_numbers)  # [1, 3, 5, 7, 8, 9, 11, 13, 15]
```

## Variations

### Binary Search: Find First Occurrence

```python
def binary_search_first(sorted_items, target):
    """Find the first occurrence of target."""
    left = 0
    right = len(sorted_items) - 1
    result = -1

    while left <= right:
        mid = (left + right) // 2

        if sorted_items[mid] == target:
            result = mid         # Found one, but keep looking left
            right = mid - 1
        elif sorted_items[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result

data = [1, 2, 2, 2, 3, 4, 5]
print(binary_search_first(data, 2))  # 1 (first 2 is at index 1)
```

### Binary Search: Find Last Occurrence

```python
def binary_search_last(sorted_items, target):
    """Find the last occurrence of target."""
    left = 0
    right = len(sorted_items) - 1
    result = -1

    while left <= right:
        mid = (left + right) // 2

        if sorted_items[mid] == target:
            result = mid         # Found one, but keep looking right
            left = mid + 1
        elif sorted_items[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result

data = [1, 2, 2, 2, 3, 4, 5]
print(binary_search_last(data, 2))  # 3 (last 2 is at index 3)
```

### Count Occurrences Using Binary Search

```python
def count_occurrences(sorted_items, target):
    """Count occurrences using binary search."""
    first = binary_search_first(sorted_items, target)
    if first == -1:
        return 0
    last = binary_search_last(sorted_items, target)
    return last - first + 1

data = [1, 2, 2, 2, 3, 4, 5]
print(count_occurrences(data, 2))  # 3
```

## Choosing the Right Algorithm

| Scenario | Best Choice |
|----------|-------------|
| Unsorted small list | Linear search |
| Sorted list | Binary search |
| Frequent searches on same data | Sort once, then binary search |
| Finding all occurrences | Linear search (or modified binary) |
| Linked list | Linear search (no random access) |

## Practical Example: Word Lookup

```python
def load_dictionary():
    """Load a sorted word list."""
    words = ["apple", "banana", "cherry", "date", "elderberry",
             "fig", "grape", "honeydew", "kiwi", "lemon"]
    return words

def spell_check(word, dictionary):
    """Check if word is in dictionary using binary search."""
    left = 0
    right = len(dictionary) - 1

    while left <= right:
        mid = (left + right) // 2
        if dictionary[mid] == word:
            return True
        elif dictionary[mid] < word:
            left = mid + 1
        else:
            right = mid - 1

    return False

# Usage
dictionary = load_dictionary()
print(spell_check("grape", dictionary))    # True
print(spell_check("orange", dictionary))   # False
```

## Try It Yourself

1. Implement linear search that returns all matching indices
2. Write binary search for a list of strings (alphabetical order)
3. Find the square root of a number using binary search
4. Count how many times a value appears in a sorted list

## Key Takeaways

1. Linear search: O(n), works on any data
2. Binary search: O(log n), requires sorted data
3. For n=1,000,000: linear needs up to 1M checks, binary needs only 20
4. Python's `in` operator uses linear search
5. Use the `bisect` module for binary search in production
6. Always verify data is sorted before using binary search

Next, we'll explore sorting algorithms that prepare data for binary search.
