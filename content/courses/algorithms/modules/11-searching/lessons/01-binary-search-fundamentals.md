---
title: Binary Search Fundamentals
order: 1
estimatedMinutes: 18
---

# Binary Search Fundamentals

Binary search is a divide-and-conquer algorithm that finds a target in a sorted array in O(log n) time by repeatedly halving the search space.

## How It Works

1. Start with the full array
2. Check the middle element
3. If target found, return index
4. If target < middle, search left half
5. If target > middle, search right half
6. Repeat until found or search space is empty

## Basic Implementation

```python
def binary_search(arr, target):
    """
    Find target in sorted array.

    Args:
        arr: Sorted array
        target: Value to find

    Returns:
        Index of target, or -1 if not found

    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = left + (right - left) // 2  # Avoid overflow

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1


# Example
arr = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(arr, 7))   # 3
print(binary_search(arr, 6))   # -1
```

## Recursive Implementation

```python
def binary_search_recursive(arr, target, left, right):
    """Recursive binary search."""
    if left > right:
        return -1

    mid = left + (right - left) // 2

    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)


# Usage
arr = [1, 3, 5, 7, 9, 11, 13]
result = binary_search_recursive(arr, 7, 0, len(arr) - 1)
```

## Visualization

```
Array: [1, 3, 5, 7, 9, 11, 13]
Target: 9

Step 1: left=0, right=6, mid=3
[1, 3, 5, 7, 9, 11, 13]
          ^
arr[3]=7 < 9, search right half

Step 2: left=4, right=6, mid=5
[1, 3, 5, 7, 9, 11, 13]
                ^
arr[5]=11 > 9, search left half

Step 3: left=4, right=4, mid=4
[1, 3, 5, 7, 9, 11, 13]
             ^
arr[4]=9 == 9, found at index 4
```

## Common Mistakes

### 1. Integer Overflow

```python
# Bad: Can overflow in some languages
mid = (left + right) // 2

# Good: Safe from overflow
mid = left + (right - left) // 2
```

### 2. Infinite Loops

```python
# Bad: Wrong update causes infinite loop
left = mid  # Should be mid + 1

# Good: Proper boundary updates
left = mid + 1
right = mid - 1
```

### 3. Off-by-One Errors

```python
# Bad: Missing equals in condition
while left < right:  # Might miss single element

# Good: Include equals
while left <= right:
```

## Finding Boundaries

### Find Leftmost (First) Occurrence

```python
def find_leftmost(arr, target):
    """Find first occurrence of target."""
    left, right = 0, len(arr) - 1
    result = -1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            result = mid
            right = mid - 1  # Keep searching left
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result


arr = [1, 2, 2, 2, 3, 4]
print(find_leftmost(arr, 2))  # 1 (first 2)
```

### Find Rightmost (Last) Occurrence

```python
def find_rightmost(arr, target):
    """Find last occurrence of target."""
    left, right = 0, len(arr) - 1
    result = -1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            result = mid
            left = mid + 1  # Keep searching right
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result


arr = [1, 2, 2, 2, 3, 4]
print(find_rightmost(arr, 2))  # 3 (last 2)
```

## Lower and Upper Bound

### Lower Bound (First >= target)

```python
def lower_bound(arr, target):
    """Find first index where arr[i] >= target."""
    left, right = 0, len(arr)

    while left < right:
        mid = left + (right - left) // 2

        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid

    return left


arr = [1, 2, 4, 4, 5, 6]
print(lower_bound(arr, 4))  # 2 (first 4)
print(lower_bound(arr, 3))  # 2 (first >= 3 is 4)
```

### Upper Bound (First > target)

```python
def upper_bound(arr, target):
    """Find first index where arr[i] > target."""
    left, right = 0, len(arr)

    while left < right:
        mid = left + (right - left) // 2

        if arr[mid] <= target:
            left = mid + 1
        else:
            right = mid

    return left


arr = [1, 2, 4, 4, 5, 6]
print(upper_bound(arr, 4))  # 4 (first > 4 is 5)
```

## Time and Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Binary Search | O(log n) | O(1) |
| Recursive | O(log n) | O(log n) stack |

## Binary Search vs Linear Search

| Aspect | Binary Search | Linear Search |
|--------|--------------|---------------|
| Time | O(log n) | O(n) |
| Requires sorted | Yes | No |
| # comparisons (n=1M) | ~20 | Up to 1M |

## Key Takeaways

1. Binary search halves the search space each step
2. Requires a sorted array
3. O(log n) time - extremely efficient
4. Use `left + (right - left) // 2` to avoid overflow
5. Pay attention to loop condition and boundary updates
6. Can find first/last occurrence with modifications

Next, we'll explore variations of binary search.
