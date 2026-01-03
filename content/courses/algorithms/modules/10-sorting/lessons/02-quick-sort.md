---
title: Quick Sort
order: 2
estimatedMinutes: 20
---

# Quick Sort

Quick sort is a divide-and-conquer algorithm that selects a "pivot" element and partitions the array around it, then recursively sorts the partitions.

## How It Works

1. **Choose a pivot**: Select an element as pivot
2. **Partition**: Rearrange so elements < pivot are left, > pivot are right
3. **Recurse**: Sort left and right partitions

## Basic Implementation

```python
def quick_sort(arr):
    """
    Sort array using quick sort.

    Time: O(n log n) average, O(n²) worst
    Space: O(log n) for recursion stack
    """
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)


arr = [3, 6, 8, 10, 1, 2, 1]
print(quick_sort(arr))  # [1, 1, 2, 3, 6, 8, 10]
```

## In-Place Implementation

More efficient - no extra arrays:

```python
def quick_sort_inplace(arr, low, high):
    """Sort arr[low:high+1] in place."""
    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort_inplace(arr, low, pivot_idx - 1)
        quick_sort_inplace(arr, pivot_idx + 1, high)


def partition(arr, low, high):
    """
    Partition array and return pivot index.
    Uses Lomuto partition scheme (pivot = last element).
    """
    pivot = arr[high]
    i = low - 1  # Index of smaller element

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1


# Usage
arr = [3, 6, 8, 10, 1, 2, 1]
quick_sort_inplace(arr, 0, len(arr) - 1)
print(arr)  # [1, 1, 2, 3, 6, 8, 10]
```

## Hoare Partition Scheme

More efficient - fewer swaps on average:

```python
def partition_hoare(arr, low, high):
    """
    Hoare partition - pivot is first element.
    Returns index where partitions meet.
    """
    pivot = arr[low]
    i = low - 1
    j = high + 1

    while True:
        i += 1
        while arr[i] < pivot:
            i += 1

        j -= 1
        while arr[j] > pivot:
            j -= 1

        if i >= j:
            return j

        arr[i], arr[j] = arr[j], arr[i]


def quick_sort_hoare(arr, low, high):
    if low < high:
        p = partition_hoare(arr, low, high)
        quick_sort_hoare(arr, low, p)
        quick_sort_hoare(arr, p + 1, high)
```

## Visualization

```
Array: [3, 6, 8, 10, 1, 2, 1]
Pivot: 10 (last element)

Partition:
[3, 6, 8, 10, 1, 2, 1]  i=-1, j=0
 ^
3 <= 10: i=0, swap arr[0] with arr[0] → [3, 6, 8, 10, 1, 2, 1]

[3, 6, 8, 10, 1, 2, 1]  i=0, j=1
    ^
6 <= 10: i=1, swap → [3, 6, 8, 10, 1, 2, 1]

... continue ...

Final: [3, 6, 8, 1, 1, 2, 10]
       ←── < 10 ───→   pivot
```

## Pivot Selection Strategies

### 1. First/Last Element (Simple but risky)
```python
pivot = arr[high]  # or arr[low]
# Problem: O(n²) on sorted arrays
```

### 2. Random Element
```python
import random

def partition_random(arr, low, high):
    rand_idx = random.randint(low, high)
    arr[rand_idx], arr[high] = arr[high], arr[rand_idx]
    return partition(arr, low, high)
```

### 3. Median of Three
```python
def median_of_three(arr, low, high):
    mid = (low + high) // 2

    # Sort low, mid, high
    if arr[low] > arr[mid]:
        arr[low], arr[mid] = arr[mid], arr[low]
    if arr[low] > arr[high]:
        arr[low], arr[high] = arr[high], arr[low]
    if arr[mid] > arr[high]:
        arr[mid], arr[high] = arr[high], arr[mid]

    # Use mid as pivot, move to high-1
    arr[mid], arr[high - 1] = arr[high - 1], arr[mid]
    return arr[high - 1]
```

## Three-Way Partition (Dutch National Flag)

Efficient when many duplicates exist:

```python
def quick_sort_3way(arr, low, high):
    """
    Three-way partition for arrays with many duplicates.
    Partitions into: < pivot, == pivot, > pivot
    """
    if low >= high:
        return

    lt = low      # arr[low..lt-1] < pivot
    gt = high     # arr[gt+1..high] > pivot
    i = low       # arr[lt..i-1] == pivot
    pivot = arr[low]

    while i <= gt:
        if arr[i] < pivot:
            arr[lt], arr[i] = arr[i], arr[lt]
            lt += 1
            i += 1
        elif arr[i] > pivot:
            arr[gt], arr[i] = arr[i], arr[gt]
            gt -= 1
        else:
            i += 1

    quick_sort_3way(arr, low, lt - 1)
    quick_sort_3way(arr, gt + 1, high)
```

## Time and Space Complexity

| Case | Time | When |
|------|------|------|
| Best | O(n log n) | Balanced partitions |
| Average | O(n log n) | Random data |
| Worst | O(n²) | Already sorted + bad pivot |

**Space**: O(log n) for recursion stack (worst case O(n))

## Properties

| Property | Value |
|----------|-------|
| Time (best) | O(n log n) |
| Time (avg) | O(n log n) |
| Time (worst) | O(n²) |
| Space | O(log n) |
| Stable | No |
| In-place | Yes |

## Quick Sort vs Merge Sort

| Aspect | Quick Sort | Merge Sort |
|--------|------------|------------|
| Average time | O(n log n) | O(n log n) |
| Worst time | O(n²) | O(n log n) |
| Space | O(log n) | O(n) |
| Cache efficiency | Better | Worse |
| Stable | No | Yes |
| In-place | Yes | No |

## When to Use Quick Sort

**Good for:**
- General purpose sorting
- When average O(n log n) is acceptable
- When memory is limited
- Arrays (cache-friendly)

**Not ideal for:**
- When worst case O(n²) is unacceptable
- When stability is required
- Linked lists (poor cache locality)

## Key Takeaways

1. Divide-and-conquer using pivot-based partitioning
2. O(n log n) average, O(n²) worst case
3. In-place with O(log n) stack space
4. Not stable - equal elements may be reordered
5. Pivot selection is crucial for performance
6. Often fastest in practice due to cache efficiency

Next, we'll explore Counting Sort - a linear time algorithm.
