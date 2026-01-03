---
title: Merge Sort
order: 1
estimatedMinutes: 18
---

# Merge Sort

Merge sort is a divide-and-conquer algorithm that splits an array in half, recursively sorts each half, and merges the sorted halves.

## How It Works

1. **Divide**: Split array into two halves
2. **Conquer**: Recursively sort each half
3. **Combine**: Merge the two sorted halves

## Implementation

```python
def merge_sort(arr):
    """
    Sort array using merge sort.

    Time: O(n log n)
    Space: O(n)
    """
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)


def merge(left, right):
    """Merge two sorted arrays."""
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Append remaining elements
    result.extend(left[i:])
    result.extend(right[j:])

    return result


# Example
arr = [38, 27, 43, 3, 9, 82, 10]
print(merge_sort(arr))  # [3, 9, 10, 27, 38, 43, 82]
```

## In-Place Merge Sort

Uses indices instead of creating new arrays:

```python
def merge_sort_inplace(arr, left, right):
    """
    Sort arr[left:right+1] in place.
    """
    if left >= right:
        return

    mid = (left + right) // 2
    merge_sort_inplace(arr, left, mid)
    merge_sort_inplace(arr, mid + 1, right)
    merge_inplace(arr, left, mid, right)


def merge_inplace(arr, left, mid, right):
    """Merge arr[left:mid+1] and arr[mid+1:right+1]."""
    # Create temp arrays
    left_arr = arr[left:mid + 1]
    right_arr = arr[mid + 1:right + 1]

    i = j = 0
    k = left

    while i < len(left_arr) and j < len(right_arr):
        if left_arr[i] <= right_arr[j]:
            arr[k] = left_arr[i]
            i += 1
        else:
            arr[k] = right_arr[j]
            j += 1
        k += 1

    while i < len(left_arr):
        arr[k] = left_arr[i]
        i += 1
        k += 1

    while j < len(right_arr):
        arr[k] = right_arr[j]
        j += 1
        k += 1


# Usage
arr = [38, 27, 43, 3, 9, 82, 10]
merge_sort_inplace(arr, 0, len(arr) - 1)
print(arr)  # [3, 9, 10, 27, 38, 43, 82]
```

## Visualization

```
Initial: [38, 27, 43, 3, 9, 82, 10]

Divide:
         [38, 27, 43, 3, 9, 82, 10]
              /              \
      [38, 27, 43]      [3, 9, 82, 10]
        /     \           /       \
    [38]   [27, 43]    [3, 9]   [82, 10]
            /    \      /   \     /    \
         [27]  [43]   [3]  [9]  [82]  [10]

Merge back:
         [27]  [43]   [3]  [9]  [82]  [10]
            \   /       \  /      \   /
         [27, 43]      [3, 9]   [10, 82]
           \    \      /    /
        [27, 38, 43]  [3, 9, 10, 82]
              \            /
        [3, 9, 10, 27, 38, 43, 82]
```

## Time and Space Complexity

- **Time**: O(n log n) - always, regardless of input
- **Space**: O(n) for the temporary arrays

## Properties

| Property | Value |
|----------|-------|
| Time (best) | O(n log n) |
| Time (avg) | O(n log n) |
| Time (worst) | O(n log n) |
| Space | O(n) |
| Stable | Yes |
| In-place | No |

## Stability

Merge sort is **stable** - equal elements maintain their relative order:

```python
# Original: [(3, 'a'), (1, 'b'), (3, 'c'), (2, 'd')]
# Sorted:   [(1, 'b'), (2, 'd'), (3, 'a'), (3, 'c')]
# Note: (3, 'a') still comes before (3, 'c')
```

## Merge Sort for Linked Lists

Merge sort is ideal for linked lists - merging is O(1) space:

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def merge_sort_list(head):
    """Sort linked list using merge sort."""
    if not head or not head.next:
        return head

    # Find middle using slow/fast pointers
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    # Split the list
    mid = slow.next
    slow.next = None

    # Recursively sort both halves
    left = merge_sort_list(head)
    right = merge_sort_list(mid)

    # Merge sorted halves
    return merge_lists(left, right)


def merge_lists(l1, l2):
    """Merge two sorted linked lists."""
    dummy = ListNode()
    curr = dummy

    while l1 and l2:
        if l1.val <= l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next

    curr.next = l1 or l2
    return dummy.next
```

## When to Use Merge Sort

**Good for:**
- When stability is required
- Linked lists (O(1) extra space for merge)
- External sorting (sorting data on disk)
- Guaranteed O(n log n) performance needed

**Not ideal for:**
- When space is limited (O(n) extra space)
- Small arrays (overhead not worth it)
- Nearly sorted arrays (insertion sort is O(n))

## Key Takeaways

1. Divide-and-conquer: split, sort recursively, merge
2. Always O(n log n) - no worst case degradation
3. Stable sorting algorithm
4. Requires O(n) extra space for arrays
5. Ideal for linked lists and external sorting

Next, we'll learn Quick Sort - often faster in practice.
