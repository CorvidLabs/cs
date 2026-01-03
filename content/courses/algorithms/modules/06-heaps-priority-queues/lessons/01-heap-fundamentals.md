---
title: Heap Fundamentals
order: 1
estimatedMinutes: 20
---

# Heap Fundamentals

A heap is a specialized tree-based data structure that satisfies the heap property. Heaps are the foundation of efficient priority queues and are essential for algorithms like heap sort and finding the kth largest element.

## What is a Heap?

A heap is a complete binary tree where every node satisfies the heap property:

- **Max-Heap**: Every parent is greater than or equal to its children
- **Min-Heap**: Every parent is less than or equal to its children

```
Max-Heap:                Min-Heap:
      90                      10
     /  \                    /  \
   80    70                20    30
  / \   /                 / \   /
 50 60 65                40 50 35
```

## Complete Binary Tree

A heap is always a **complete binary tree**:
- All levels are fully filled except possibly the last
- The last level is filled from left to right

```
Complete:              Not Complete:
      1                      1
     / \                    / \
    2   3                  2   3
   / \                        /
  4   5                      4
```

This property allows efficient array representation.

## Array Representation

Heaps are typically stored in arrays, where for a node at index `i`:

- **Parent**: `(i - 1) // 2`
- **Left child**: `2 * i + 1`
- **Right child**: `2 * i + 2`

```
Max-Heap Tree:
        90
       /  \
     80    70
    / \   /
   50 60 65

Array: [90, 80, 70, 50, 60, 65]
Index:   0   1   2   3   4   5

Index 0 (90): Left child at 1 (80), Right child at 2 (70)
Index 1 (80): Parent at 0 (90), Left at 3 (50), Right at 4 (60)
Index 2 (70): Parent at 0 (90), Left at 5 (65)
```

### Implementation

```python
class MinHeap:
    def __init__(self):
        self.heap = []

    def parent(self, i):
        return (i - 1) // 2

    def left_child(self, i):
        return 2 * i + 1

    def right_child(self, i):
        return 2 * i + 2

    def has_parent(self, i):
        return self.parent(i) >= 0

    def has_left_child(self, i):
        return self.left_child(i) < len(self.heap)

    def has_right_child(self, i):
        return self.right_child(i) < len(self.heap)
```

## Why Arrays Work Well

1. **Memory efficiency**: No pointers needed for parent/child links
2. **Cache locality**: Elements are contiguous in memory
3. **Index math**: O(1) to find parent or children
4. **Complete tree guarantee**: No wasted space

## Heap Property Visualization

Every path from root to leaf is sorted (for max-heap, descending):

```
Max-Heap:
        100
       /    \
     90      80
    /  \    /  \
   70  60  50  40

Paths from root:
100 -> 90 -> 70  (sorted descending)
100 -> 90 -> 60  (sorted descending)
100 -> 80 -> 50  (sorted descending)
100 -> 80 -> 40  (sorted descending)
```

Note: Siblings have no ordering relationship.

## Heap vs Binary Search Tree

| Property | Heap | BST |
|----------|------|-----|
| Ordering | Parent vs children only | Left < parent < right |
| Shape | Complete binary tree | Any shape |
| Find min/max | O(1) | O(log n) for balanced |
| Find arbitrary | O(n) | O(log n) for balanced |
| Insert | O(log n) | O(log n) for balanced |

## When to Use Heaps

Heaps excel when you need:

1. **Quick access to min or max**: O(1) to peek
2. **Priority queue operations**: Insert and extract-min/max in O(log n)
3. **Finding top-k elements**: Maintain a heap of size k
4. **Median maintenance**: Use two heaps (max-heap for lower half, min-heap for upper half)

## Python's heapq Module

Python provides a min-heap implementation:

```python
import heapq

# Create a heap from a list
nums = [3, 1, 4, 1, 5, 9, 2, 6]
heapq.heapify(nums)  # O(n)
print(nums)  # [1, 1, 2, 6, 5, 9, 4, 3]

# Push element
heapq.heappush(nums, 0)  # O(log n)

# Pop smallest
smallest = heapq.heappop(nums)  # O(log n)

# Push and pop in one operation
result = heapq.heappushpop(nums, 7)  # More efficient than separate ops

# Pop and push in one operation
result = heapq.heapreplace(nums, 7)

# Find n largest/smallest
largest_3 = heapq.nlargest(3, nums)
smallest_3 = heapq.nsmallest(3, nums)
```

### Max-Heap Workaround

Python only provides min-heap. For max-heap, negate values:

```python
import heapq

# Max-heap using negation
max_heap = []
heapq.heappush(max_heap, -5)
heapq.heappush(max_heap, -3)
heapq.heappush(max_heap, -7)

# Get max (negate again)
max_val = -heapq.heappop(max_heap)  # Returns 7
```

## Building a Heap

### Method 1: Repeated Insertion

Insert elements one by one, each taking O(log n).

```python
def build_heap_insert(arr):
    heap = []
    for x in arr:
        heapq.heappush(heap, x)
    return heap

# Time: O(n log n)
```

### Method 2: Heapify (Bottom-Up)

More efficient: O(n) overall.

```python
def build_heap_heapify(arr):
    heapq.heapify(arr)
    return arr

# Time: O(n)
```

The O(n) heapify works because:
- Half the nodes are leaves (no work needed)
- Each level has exponentially fewer nodes as height increases
- Most nodes only need small fixes

## Complexity Summary

| Operation | Time Complexity |
|-----------|-----------------|
| Peek min/max | O(1) |
| Insert | O(log n) |
| Extract min/max | O(log n) |
| Build heap (heapify) | O(n) |
| Build heap (insertions) | O(n log n) |
| Search | O(n) |

Space complexity: O(n) for storing n elements.

## Summary

Heaps are complete binary trees with the heap property:
- Efficiently stored as arrays using index calculations
- O(1) access to minimum (min-heap) or maximum (max-heap)
- O(log n) insertion and extraction
- Foundation for priority queues and heap sort

In the next lesson, we will explore the heapify operations that maintain the heap property during insertions and deletions.
