---
title: Binary Search Variations
order: 2
estimatedMinutes: 16
---

# Binary Search Variations

Beyond basic searching, binary search can solve many problems involving finding boundaries, peaks, or answers in a search space.

## Finding Peak Element

A peak is an element greater than its neighbors:

```python
def find_peak(arr):
    """
    Find a peak element (greater than neighbors).

    Returns any peak index.
    Time: O(log n)
    """
    left, right = 0, len(arr) - 1

    while left < right:
        mid = left + (right - left) // 2

        if arr[mid] < arr[mid + 1]:
            # Peak is on the right
            left = mid + 1
        else:
            # Peak is at mid or left
            right = mid

    return left


arr = [1, 3, 5, 4, 2]
print(find_peak(arr))  # 2 (element 5)
```

## Finding Minimum in Rotated Array

A rotated sorted array: `[4, 5, 6, 7, 0, 1, 2]`

```python
def find_min_rotated(arr):
    """
    Find minimum element in rotated sorted array.

    Time: O(log n)
    """
    left, right = 0, len(arr) - 1

    while left < right:
        mid = left + (right - left) // 2

        if arr[mid] > arr[right]:
            # Minimum is in right half
            left = mid + 1
        else:
            # Minimum is at mid or left
            right = mid

    return arr[left]


arr = [4, 5, 6, 7, 0, 1, 2]
print(find_min_rotated(arr))  # 0
```

## Square Root (Integer)

Find the largest integer whose square <= n:

```python
def sqrt_int(n):
    """
    Find floor(sqrt(n)).

    Time: O(log n)
    """
    if n < 2:
        return n

    left, right = 1, n // 2

    while left <= right:
        mid = left + (right - left) // 2
        square = mid * mid

        if square == n:
            return mid
        elif square < n:
            left = mid + 1
        else:
            right = mid - 1

    return right


print(sqrt_int(8))   # 2
print(sqrt_int(16))  # 4
print(sqrt_int(17))  # 4
```

## First Bad Version

Find the first version that is bad (binary search on boolean condition):

```python
def first_bad_version(n, is_bad):
    """
    Find first bad version.

    Args:
        n: Total versions (1 to n)
        is_bad: Function that returns True if version is bad

    Time: O(log n)
    """
    left, right = 1, n

    while left < right:
        mid = left + (right - left) // 2

        if is_bad(mid):
            right = mid  # Bad version at mid or earlier
        else:
            left = mid + 1  # Bad version is after mid

    return left


# Example: versions 1-5, first bad is 4
def is_bad(version):
    return version >= 4

print(first_bad_version(5, is_bad))  # 4
```

## Search in Sorted 2D Matrix

Matrix where each row is sorted and first element of each row > last of previous:

```python
def search_matrix(matrix, target):
    """
    Search in row-wise and column-wise sorted matrix.

    Time: O(log(m*n))
    """
    if not matrix or not matrix[0]:
        return False

    rows, cols = len(matrix), len(matrix[0])
    left, right = 0, rows * cols - 1

    while left <= right:
        mid = left + (right - left) // 2
        # Convert 1D index to 2D
        row, col = mid // cols, mid % cols
        value = matrix[row][col]

        if value == target:
            return True
        elif value < target:
            left = mid + 1
        else:
            right = mid - 1

    return False


matrix = [
    [1, 3, 5, 7],
    [10, 11, 16, 20],
    [23, 30, 34, 60]
]
print(search_matrix(matrix, 3))   # True
print(search_matrix(matrix, 13))  # False
```

## Find K-th Smallest Element

Binary search on answer space:

```python
def kth_smallest(matrix, k):
    """
    Find k-th smallest in sorted matrix.

    Matrix is sorted row-wise and column-wise.
    Time: O(n * log(max-min))
    """
    n = len(matrix)
    lo, hi = matrix[0][0], matrix[n-1][n-1]

    while lo < hi:
        mid = lo + (hi - lo) // 2

        # Count elements <= mid
        count = count_less_equal(matrix, mid)

        if count < k:
            lo = mid + 1
        else:
            hi = mid

    return lo


def count_less_equal(matrix, target):
    """Count elements <= target using staircase search."""
    n = len(matrix)
    count = 0
    row, col = n - 1, 0

    while row >= 0 and col < n:
        if matrix[row][col] <= target:
            count += row + 1
            col += 1
        else:
            row -= 1

    return count
```

## Binary Search on Answer

When the answer must satisfy a condition, binary search the answer space:

```python
def min_capacity_to_ship(weights, days):
    """
    Find minimum ship capacity to ship all weights in 'days' days.

    Time: O(n * log(sum - max))
    """
    def can_ship(capacity):
        """Check if we can ship with given capacity."""
        current_load = 0
        days_needed = 1

        for weight in weights:
            if current_load + weight > capacity:
                days_needed += 1
                current_load = 0
            current_load += weight

        return days_needed <= days

    # Search space: max weight to total weight
    left = max(weights)
    right = sum(weights)

    while left < right:
        mid = left + (right - left) // 2

        if can_ship(mid):
            right = mid  # Try smaller capacity
        else:
            left = mid + 1

    return left


weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(min_capacity_to_ship(weights, 5))  # 15
```

## Template Summary

### Template 1: Standard Binary Search
```python
while left <= right:
    mid = left + (right - left) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        left = mid + 1
    else:
        right = mid - 1
```

### Template 2: Find Boundary (left < right)
```python
while left < right:
    mid = left + (right - left) // 2
    if condition(mid):
        right = mid
    else:
        left = mid + 1
return left
```

### Template 3: Find Last True
```python
while left < right:
    mid = left + (right - left + 1) // 2  # Round up
    if condition(mid):
        left = mid
    else:
        right = mid - 1
return left
```

## Key Takeaways

1. Binary search works on any monotonic condition
2. Peak finding: compare with neighbor
3. Rotated array: compare with rightmost element
4. 2D matrix: convert to 1D index
5. Answer space: binary search when checking condition is efficient
6. Choose template based on what boundary you need

Next, we'll dive deeper into searching rotated arrays.
