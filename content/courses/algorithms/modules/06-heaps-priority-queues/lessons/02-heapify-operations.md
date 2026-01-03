---
title: Heapify Operations
order: 2
estimatedMinutes: 25
---

# Heapify Operations

Heapify operations are the core algorithms that maintain the heap property. Understanding these operations is essential for implementing heaps and related algorithms like heap sort.

## Two Key Operations

1. **Sift Up (Bubble Up)**: Move a node up to restore heap property after insertion
2. **Sift Down (Bubble Down)**: Move a node down to restore heap property after extraction

## Sift Up (Bubble Up)

When we insert a new element at the end of the heap, it might violate the heap property. We fix this by comparing with the parent and swapping if necessary, continuing until the heap property is restored.

### Min-Heap Sift Up

```
Insert 5 into min-heap:
Before:                 After insert:           After sift up:
      10                     10                      5
     /  \                   /  \                    / \
   20    15               20    15                10   15
  /                      /  \                    / \
 30                     30   5                  30  20

Steps:
1. Insert 5 at end (index 4)
2. Compare 5 with parent 20: 5 < 20, swap
3. Compare 5 with parent 10: 5 < 10, swap
4. 5 is now root, done
```

### Implementation

```python
def sift_up(self, index):
    """
    Restore heap property by moving element up.

    Time: O(log n)
    """
    while index > 0:
        parent_idx = (index - 1) // 2

        if self.heap[index] < self.heap[parent_idx]:
            # Swap with parent
            self.heap[index], self.heap[parent_idx] = \
                self.heap[parent_idx], self.heap[index]
            index = parent_idx
        else:
            # Heap property satisfied
            break
```

### Complexity Analysis

- **Time**: O(log n) - at most we traverse the height of the tree
- **Space**: O(1) - only swapping in place

## Sift Down (Bubble Down)

When we extract the root, we replace it with the last element and sift down to restore the heap property. We compare with both children and swap with the smaller (min-heap) or larger (max-heap) child.

### Min-Heap Sift Down

```
Extract min from:
Before:                 After replace:          After sift down:
      5                      30                      10
     / \                    /  \                    /  \
   10   15                10    15                20    15
  / \                    /                       /
 20  30                 20                      30

Steps:
1. Remove 5, move 30 to root
2. Compare 30 with children 10, 15: smaller is 10, 30 > 10, swap
3. Compare 30 with child 20: 30 > 20, swap
4. 30 has no children, done
```

### Implementation

```python
def sift_down(self, index):
    """
    Restore heap property by moving element down.

    Time: O(log n)
    """
    size = len(self.heap)

    while True:
        smallest = index
        left = 2 * index + 1
        right = 2 * index + 2

        # Check if left child is smaller
        if left < size and self.heap[left] < self.heap[smallest]:
            smallest = left

        # Check if right child is smaller
        if right < size and self.heap[right] < self.heap[smallest]:
            smallest = right

        if smallest != index:
            # Swap with smaller child
            self.heap[index], self.heap[smallest] = \
                self.heap[smallest], self.heap[index]
            index = smallest
        else:
            # Heap property satisfied
            break
```

## Complete Min-Heap Implementation

```python
class MinHeap:
    def __init__(self):
        self.heap = []

    def push(self, val):
        """Insert element into heap. Time: O(log n)"""
        self.heap.append(val)
        self._sift_up(len(self.heap) - 1)

    def pop(self):
        """Remove and return minimum element. Time: O(log n)"""
        if not self.heap:
            raise IndexError("Heap is empty")

        if len(self.heap) == 1:
            return self.heap.pop()

        min_val = self.heap[0]
        self.heap[0] = self.heap.pop()  # Move last to root
        self._sift_down(0)
        return min_val

    def peek(self):
        """Return minimum without removing. Time: O(1)"""
        if not self.heap:
            raise IndexError("Heap is empty")
        return self.heap[0]

    def _sift_up(self, index):
        while index > 0:
            parent = (index - 1) // 2
            if self.heap[index] < self.heap[parent]:
                self.heap[index], self.heap[parent] = \
                    self.heap[parent], self.heap[index]
                index = parent
            else:
                break

    def _sift_down(self, index):
        size = len(self.heap)
        while True:
            smallest = index
            left = 2 * index + 1
            right = 2 * index + 2

            if left < size and self.heap[left] < self.heap[smallest]:
                smallest = left
            if right < size and self.heap[right] < self.heap[smallest]:
                smallest = right

            if smallest != index:
                self.heap[index], self.heap[smallest] = \
                    self.heap[smallest], self.heap[index]
                index = smallest
            else:
                break
```

## Building a Heap: Heapify

### Bottom-Up Heapify

The efficient O(n) algorithm to convert an array into a heap:

```python
def heapify(arr):
    """
    Convert array to heap in-place.

    Time: O(n)
    """
    n = len(arr)

    # Start from last non-leaf node
    # (leaves are already valid heaps)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, i, n)

def sift_down(arr, index, size):
    while True:
        smallest = index
        left = 2 * index + 1
        right = 2 * index + 2

        if left < size and arr[left] < arr[smallest]:
            smallest = left
        if right < size and arr[right] < arr[smallest]:
            smallest = right

        if smallest != index:
            arr[index], arr[smallest] = arr[smallest], arr[index]
            index = smallest
        else:
            break
```

### Why O(n)?

The key insight is that most nodes are near the bottom:
- Half the nodes are leaves (height 0, no work)
- Quarter of nodes are at height 1 (1 comparison)
- Eighth of nodes are at height 2 (2 comparisons)

```
Total work = sum over all heights h:
  (n / 2^(h+1)) * h
= n * sum(h / 2^(h+1))
= n * O(1)
= O(n)
```

### Visualization

```
Array: [4, 10, 3, 5, 1, 2]

Initial tree:
        4
       / \
     10   3
    / \  /
   5  1  2

Start at last non-leaf (index 2, value 3):
- Compare 3 with child 2: swap
        4
       / \
     10   2
    / \  /
   5  1  3

Process index 1 (value 10):
- Compare 10 with children 5, 1: 1 is smallest, swap
        4
       / \
      1   2
    / \  /
   5 10  3

Process index 0 (value 4):
- Compare 4 with children 1, 2: 1 is smallest, swap
        1
       / \
      4   2
    / \  /
   5 10  3

- Continue sift down for 4:
- Compare 4 with children 5, 10: 4 is smallest, done

Final heap:
        1
       / \
      4   2
    / \  /
   5 10  3

Array: [1, 4, 2, 5, 10, 3]
```

## Update Key Operation

Sometimes we need to change a key's value and restore the heap property:

```python
def update_key(self, index, new_val):
    """
    Update key at index and restore heap property.

    Time: O(log n)
    """
    old_val = self.heap[index]
    self.heap[index] = new_val

    if new_val < old_val:
        # Value decreased, might need to go up
        self._sift_up(index)
    else:
        # Value increased, might need to go down
        self._sift_down(index)
```

## Delete Arbitrary Element

To delete an element at any position:

```python
def delete(self, index):
    """
    Delete element at index.

    Time: O(log n)
    """
    if index >= len(self.heap):
        raise IndexError("Index out of range")

    # Replace with last element
    last = self.heap.pop()

    if index < len(self.heap):
        old_val = self.heap[index]
        self.heap[index] = last

        if last < old_val:
            self._sift_up(index)
        else:
            self._sift_down(index)
```

## Complexity Summary

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| Sift Up | O(log n) | After insertion |
| Sift Down | O(log n) | After extraction |
| Heapify | O(n) | Build heap from array |
| Update Key | O(log n) | Change and rebalance |
| Delete | O(log n) | Remove arbitrary element |

## Summary

The heapify operations are:

- **Sift Up**: Compare with parent, swap if violating, repeat upward
- **Sift Down**: Compare with children, swap with smaller (min-heap), repeat downward
- **Heapify**: Process non-leaf nodes bottom-up using sift down

These operations maintain the heap property efficiently in O(log n) time, making heaps ideal for priority queue implementations.

In the next lesson, we will see how these operations enable efficient priority queue functionality.
