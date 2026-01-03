---
title: Counting Sort
order: 3
estimatedMinutes: 15
---

# Counting Sort

Counting sort is a non-comparison sorting algorithm that counts occurrences of each value. It achieves O(n + k) time where k is the range of values.

## How It Works

1. **Count**: Count occurrences of each value
2. **Cumulative Count**: Convert counts to positions
3. **Build Output**: Place elements in sorted positions

## Basic Implementation

```python
def counting_sort(arr):
    """
    Sort array of non-negative integers using counting sort.

    Time: O(n + k) where k is max value
    Space: O(n + k)
    """
    if not arr:
        return arr

    # Find range
    max_val = max(arr)

    # Count occurrences
    count = [0] * (max_val + 1)
    for num in arr:
        count[num] += 1

    # Build sorted array
    result = []
    for num, freq in enumerate(count):
        result.extend([num] * freq)

    return result


arr = [4, 2, 2, 8, 3, 3, 1]
print(counting_sort(arr))  # [1, 2, 2, 3, 3, 4, 8]
```

## Stable Counting Sort

Maintains relative order of equal elements:

```python
def counting_sort_stable(arr):
    """
    Stable counting sort - preserves relative order of equal elements.
    """
    if not arr:
        return arr

    max_val = max(arr)

    # Count occurrences
    count = [0] * (max_val + 1)
    for num in arr:
        count[num] += 1

    # Cumulative count (gives ending positions)
    for i in range(1, len(count)):
        count[i] += count[i - 1]

    # Build output array (iterate backwards for stability)
    output = [0] * len(arr)
    for num in reversed(arr):
        count[num] -= 1
        output[count[num]] = num

    return output
```

## Sorting Objects by Key

Sort objects while preserving stability:

```python
def counting_sort_by_key(arr, key_func, max_key):
    """
    Sort array of objects by a key function.

    Args:
        arr: Array of objects to sort
        key_func: Function that extracts integer key from object
        max_key: Maximum possible key value
    """
    # Count occurrences of each key
    count = [0] * (max_key + 1)
    for item in arr:
        count[key_func(item)] += 1

    # Cumulative count
    for i in range(1, len(count)):
        count[i] += count[i - 1]

    # Build output (backwards for stability)
    output = [None] * len(arr)
    for item in reversed(arr):
        key = key_func(item)
        count[key] -= 1
        output[count[key]] = item

    return output


# Example: Sort students by grade
students = [
    {"name": "Alice", "grade": 85},
    {"name": "Bob", "grade": 90},
    {"name": "Charlie", "grade": 85},
    {"name": "David", "grade": 90}
]

sorted_students = counting_sort_by_key(
    students,
    lambda s: s["grade"],
    max_key=100
)
# Result: Alice(85), Charlie(85), Bob(90), David(90)
# Note: Alice before Charlie, Bob before David (stable)
```

## Handling Negative Numbers

Shift values to handle negatives:

```python
def counting_sort_with_negatives(arr):
    """Counting sort supporting negative numbers."""
    if not arr:
        return arr

    min_val = min(arr)
    max_val = max(arr)
    range_size = max_val - min_val + 1

    # Shift values to be non-negative
    count = [0] * range_size
    for num in arr:
        count[num - min_val] += 1

    # Cumulative count
    for i in range(1, range_size):
        count[i] += count[i - 1]

    # Build output
    output = [0] * len(arr)
    for num in reversed(arr):
        idx = num - min_val
        count[idx] -= 1
        output[count[idx]] = num

    return output


arr = [4, -2, -2, 8, 3, -3, 1]
print(counting_sort_with_negatives(arr))
# [-3, -2, -2, 1, 3, 4, 8]
```

## Visualization

```
Array: [4, 2, 2, 8, 3, 3, 1]

Step 1: Count occurrences
Index:  0  1  2  3  4  5  6  7  8
Count: [0, 1, 2, 2, 1, 0, 0, 0, 1]
        ↑  ↑  ↑  ↑  ↑           ↑
       0×0 1×1 2×2 2×3 1×4     1×8

Step 2: Cumulative count (for stable sort)
Index:  0  1  2  3  4  5  6  7  8
Count: [0, 1, 3, 5, 6, 6, 6, 6, 7]
       Positions where each value ends

Step 3: Place elements (backwards)
Input backwards: [1, 3, 3, 8, 2, 2, 4]
                  ↓
Output: [1, 2, 2, 3, 3, 4, 8]
```

## Time and Space Complexity

- **Time**: O(n + k) where k is the range of values
- **Space**: O(n + k)

| Scenario | Time |
|----------|------|
| n elements, range k | O(n + k) |
| Range ≈ n | O(n) |
| Range >> n | O(k) - not efficient |

## Properties

| Property | Value |
|----------|-------|
| Time | O(n + k) |
| Space | O(n + k) |
| Stable | Yes (with proper implementation) |
| In-place | No |
| Comparison-based | No |

## When to Use Counting Sort

**Ideal when:**
- Range of values (k) is O(n) or smaller
- Integers or values that map to integers
- Stability is needed (e.g., as part of radix sort)

**Not suitable when:**
- Range is much larger than n (wastes space)
- Floating point numbers
- Data doesn't map easily to integers

## Comparison with Other Sorts

| Algorithm | Time | Space | When k >> n |
|-----------|------|-------|-------------|
| Counting Sort | O(n + k) | O(n + k) | O(k) - slow |
| Merge Sort | O(n log n) | O(n) | O(n log n) |
| Quick Sort | O(n log n) | O(log n) | O(n log n) |

## Key Takeaways

1. Non-comparison sort with O(n + k) time
2. Only works for integers or discrete values
3. Very efficient when range k ≈ n
4. Stable when implemented correctly
5. Foundation for radix sort

Next, we'll learn Radix Sort - which uses counting sort as a subroutine.
