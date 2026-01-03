---
title: Search in Rotated Arrays
order: 3
estimatedMinutes: 16
---

# Search in Rotated Arrays

A rotated sorted array is created by taking a sorted array and rotating it at some pivot. Binary search can still achieve O(log n) with modifications.

## Understanding Rotation

```
Original sorted: [0, 1, 2, 4, 5, 6, 7]
Rotated at 4:    [4, 5, 6, 7, 0, 1, 2]
                        pivot ↑
```

Properties:
- One portion is always sorted
- The minimum element is at the rotation point
- All elements before rotation > all elements after

## Search in Rotated Array (No Duplicates)

```python
def search_rotated(arr, target):
    """
    Search in rotated sorted array (no duplicates).

    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return mid

        # Determine which half is sorted
        if arr[left] <= arr[mid]:
            # Left half is sorted
            if arr[left] <= target < arr[mid]:
                right = mid - 1  # Target in left half
            else:
                left = mid + 1   # Target in right half
        else:
            # Right half is sorted
            if arr[mid] < target <= arr[right]:
                left = mid + 1   # Target in right half
            else:
                right = mid - 1  # Target in left half

    return -1


arr = [4, 5, 6, 7, 0, 1, 2]
print(search_rotated(arr, 0))  # 4
print(search_rotated(arr, 3))  # -1
```

## Visualization

```
Array: [4, 5, 6, 7, 0, 1, 2]
Target: 0

Step 1: left=0, right=6, mid=3
[4, 5, 6, 7, 0, 1, 2]
 L        M        R
arr[left]=4 <= arr[mid]=7 → left half sorted
target=0 not in [4, 7) → search right
left = 4

Step 2: left=4, right=6, mid=5
[4, 5, 6, 7, 0, 1, 2]
             L  M  R
arr[left]=0 <= arr[mid]=1 → left half sorted
target=0 in [0, 1) → search left
right = 4

Step 3: left=4, right=4, mid=4
arr[mid]=0 == target → found at index 4
```

## Search in Rotated Array (With Duplicates)

Duplicates complicate determining which half is sorted:

```python
def search_rotated_with_dups(arr, target):
    """
    Search in rotated sorted array (with duplicates).

    Time: O(log n) average, O(n) worst case
    Space: O(1)
    """
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return True

        # Handle duplicates: can't determine sorted half
        if arr[left] == arr[mid] == arr[right]:
            left += 1
            right -= 1
        elif arr[left] <= arr[mid]:
            # Left half is sorted
            if arr[left] <= target < arr[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # Right half is sorted
            if arr[mid] < target <= arr[right]:
                left = mid + 1
            else:
                right = mid - 1

    return False


arr = [2, 5, 6, 0, 0, 1, 2]
print(search_rotated_with_dups(arr, 0))  # True
print(search_rotated_with_dups(arr, 3))  # False
```

## Find Minimum Element

```python
def find_minimum(arr):
    """
    Find minimum in rotated sorted array (no duplicates).

    Time: O(log n)
    """
    left, right = 0, len(arr) - 1

    # Array not rotated
    if arr[left] < arr[right]:
        return arr[left]

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
print(find_minimum(arr))  # 0

arr = [3, 1, 2]
print(find_minimum(arr))  # 1
```

## Find Minimum (With Duplicates)

```python
def find_minimum_with_dups(arr):
    """
    Find minimum in rotated sorted array (with duplicates).

    Time: O(log n) average, O(n) worst case
    """
    left, right = 0, len(arr) - 1

    while left < right:
        mid = left + (right - left) // 2

        if arr[mid] > arr[right]:
            left = mid + 1
        elif arr[mid] < arr[right]:
            right = mid
        else:
            # arr[mid] == arr[right], can't determine
            right -= 1

    return arr[left]


arr = [2, 2, 2, 0, 1, 2]
print(find_minimum_with_dups(arr))  # 0
```

## Find Rotation Point

The rotation point is where the minimum element is:

```python
def find_rotation_point(arr):
    """
    Find the index where rotation occurred.

    Returns index of minimum element (rotation point).
    """
    left, right = 0, len(arr) - 1

    # Not rotated
    if arr[left] < arr[right]:
        return 0

    while left < right:
        mid = left + (right - left) // 2

        if arr[mid] > arr[right]:
            left = mid + 1
        else:
            right = mid

    return left


arr = [4, 5, 6, 7, 0, 1, 2]
print(find_rotation_point(arr))  # 4 (index of 0)
```

## Find Original Position

Given rotated array and rotation point:

```python
def search_with_rotation(arr, target, rotation_point):
    """
    Search knowing the rotation point.

    Can search in O(log n) by adjusting indices.
    """
    n = len(arr)
    left, right = 0, n - 1

    while left <= right:
        mid = left + (right - left) // 2
        # Adjust mid to actual position
        actual_mid = (mid + rotation_point) % n

        if arr[actual_mid] == target:
            return actual_mid
        elif arr[actual_mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
```

## Summary: Key Patterns

### Determining Which Half is Sorted
```python
if arr[left] <= arr[mid]:
    # Left half [left, mid] is sorted
else:
    # Right half [mid, right] is sorted
```

### Checking if Target is in Sorted Half
```python
# For sorted left half:
if arr[left] <= target < arr[mid]:
    # Target is in left half

# For sorted right half:
if arr[mid] < target <= arr[right]:
    # Target is in right half
```

### Handling Duplicates
```python
if arr[left] == arr[mid] == arr[right]:
    # Can't determine, shrink from both ends
    left += 1
    right -= 1
```

## Time Complexity

| Problem | No Duplicates | With Duplicates |
|---------|---------------|-----------------|
| Search | O(log n) | O(n) worst |
| Find Min | O(log n) | O(n) worst |

## Key Takeaways

1. One half of a rotated array is always sorted
2. Compare middle with edges to determine sorted half
3. Check if target is in the sorted half to decide direction
4. Duplicates require special handling (shrink bounds)
5. Finding minimum: compare with rightmost element

Next, we'll explore more binary search applications.
