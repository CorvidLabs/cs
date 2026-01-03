---
title: Heap Applications
order: 4
estimatedMinutes: 25
---

# Heap Applications

Heaps are versatile data structures with applications beyond simple priority queues. This lesson covers common algorithmic problems that leverage heap properties for efficient solutions.

## Finding Kth Largest/Smallest Element

One of the most common heap applications is finding the kth element without fully sorting.

### Kth Largest Using Min-Heap

Maintain a min-heap of size k. The root is the kth largest.

```python
import heapq

def find_kth_largest(nums, k):
    """
    Find kth largest element.

    Time: O(n log k)
    Space: O(k)
    """
    # Maintain heap of k largest elements
    heap = []

    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)  # Remove smallest

    return heap[0]  # Kth largest is the smallest in our heap

# Example
nums = [3, 2, 1, 5, 6, 4]
print(find_kth_largest(nums, 2))  # 5 (second largest)
```

### Why This Works

```
Finding 3rd largest in [3, 2, 1, 5, 6, 4]:

Process 3: heap = [3]
Process 2: heap = [2, 3]
Process 1: heap = [1, 3, 2]
Process 5: heap = [2, 3, 5], popped 1
Process 6: heap = [3, 5, 6], popped 2
Process 4: heap = [4, 5, 6], popped 3

Result: 4 (3rd largest)
```

### Using heapq.nlargest

```python
import heapq

def find_kth_largest_simple(nums, k):
    return heapq.nlargest(k, nums)[-1]
```

## Top K Frequent Elements

Find the k most frequent elements in a list.

```python
import heapq
from collections import Counter

def top_k_frequent(nums, k):
    """
    Find k most frequent elements.

    Time: O(n log k)
    Space: O(n)
    """
    count = Counter(nums)

    # Min-heap of (frequency, element)
    heap = []
    for num, freq in count.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap)

    return [num for freq, num in heap]

# Example
nums = [1, 1, 1, 2, 2, 3]
print(top_k_frequent(nums, 2))  # [1, 2]
```

## Heap Sort

Sort an array using heap operations.

```python
def heap_sort(arr):
    """
    Sort array using heap.

    Time: O(n log n)
    Space: O(1) for in-place, O(n) for this version
    """
    import heapq

    heapq.heapify(arr)
    return [heapq.heappop(arr) for _ in range(len(arr))]

# In-place max-heap version
def heap_sort_inplace(arr):
    n = len(arr)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        sift_down_max(arr, i, n)

    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        sift_down_max(arr, 0, i)

def sift_down_max(arr, index, size):
    while True:
        largest = index
        left = 2 * index + 1
        right = 2 * index + 2

        if left < size and arr[left] > arr[largest]:
            largest = left
        if right < size and arr[right] > arr[largest]:
            largest = right

        if largest != index:
            arr[index], arr[largest] = arr[largest], arr[index]
            index = largest
        else:
            break
```

## Finding Median in a Stream

Maintain the median as numbers arrive one by one.

```python
import heapq

class MedianFinder:
    """
    Find median from a data stream.

    Two heaps:
    - max_heap: stores smaller half (inverted for max behavior)
    - min_heap: stores larger half

    Median is derived from heap tops.
    """

    def __init__(self):
        self.max_heap = []  # Smaller half (negated)
        self.min_heap = []  # Larger half

    def add_num(self, num):
        """Add number. Time: O(log n)"""
        # Add to max_heap first
        heapq.heappush(self.max_heap, -num)

        # Balance: move max of smaller half to larger half
        heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))

        # Ensure smaller half has >= elements
        if len(self.min_heap) > len(self.max_heap):
            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))

    def find_median(self):
        """Get median. Time: O(1)"""
        if len(self.max_heap) > len(self.min_heap):
            return -self.max_heap[0]
        return (-self.max_heap[0] + self.min_heap[0]) / 2

# Example
mf = MedianFinder()
mf.add_num(1)
print(mf.find_median())  # 1.0
mf.add_num(2)
print(mf.find_median())  # 1.5
mf.add_num(3)
print(mf.find_median())  # 2.0
```

## Merge K Sorted Arrays

Efficiently merge multiple sorted arrays.

```python
import heapq

def merge_k_sorted(arrays):
    """
    Merge k sorted arrays.

    Time: O(n log k) where n is total elements
    Space: O(k) for heap + O(n) for result
    """
    result = []
    heap = []  # (value, array_index, element_index)

    # Initialize with first element of each array
    for i, arr in enumerate(arrays):
        if arr:
            heapq.heappush(heap, (arr[0], i, 0))

    while heap:
        val, arr_idx, elem_idx = heapq.heappop(heap)
        result.append(val)

        # Add next element from same array
        if elem_idx + 1 < len(arrays[arr_idx]):
            next_val = arrays[arr_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, arr_idx, elem_idx + 1))

    return result

# Example
arrays = [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
print(merge_k_sorted(arrays))  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## K Closest Points to Origin

Find k points closest to the origin.

```python
import heapq

def k_closest(points, k):
    """
    Find k closest points to origin.

    Time: O(n log k)
    Space: O(k)
    """
    # Max-heap to keep k smallest distances
    heap = []

    for x, y in points:
        dist = x * x + y * y  # No need for sqrt
        heapq.heappush(heap, (-dist, x, y))
        if len(heap) > k:
            heapq.heappop(heap)

    return [[x, y] for dist, x, y in heap]

# Example
points = [[1, 3], [-2, 2], [5, 8], [0, 1]]
print(k_closest(points, 2))  # [[0, 1], [-2, 2]]
```

## Reorganize String

Rearrange characters so no two adjacent are the same.

```python
import heapq
from collections import Counter

def reorganize_string(s):
    """
    Reorganize string so no adjacent chars are same.

    Time: O(n log k) where k is unique characters
    Space: O(k)
    """
    count = Counter(s)

    # Max-heap of (count, char)
    heap = [(-cnt, char) for char, cnt in count.items()]
    heapq.heapify(heap)

    result = []
    prev_cnt, prev_char = 0, ''

    while heap:
        cnt, char = heapq.heappop(heap)
        result.append(char)

        # Add previous char back if count remaining
        if prev_cnt < 0:
            heapq.heappush(heap, (prev_cnt, prev_char))

        # Update previous
        prev_cnt = cnt + 1  # Decrement (since negated)
        prev_char = char

    if len(result) != len(s):
        return ""  # Not possible

    return ''.join(result)

# Example
print(reorganize_string("aab"))  # "aba"
print(reorganize_string("aaab"))  # "" (not possible)
```

## Task Scheduler

Schedule tasks with cooling period between same tasks.

```python
import heapq
from collections import Counter

def least_interval(tasks, n):
    """
    Find minimum intervals to complete all tasks.

    Time: O(t * n) where t is number of tasks
    Space: O(26) = O(1)
    """
    count = Counter(tasks)
    heap = [-cnt for cnt in count.values()]
    heapq.heapify(heap)

    time = 0

    while heap:
        cycle = []
        for _ in range(n + 1):
            if heap:
                cnt = heapq.heappop(heap)
                if cnt + 1 < 0:  # Still has remaining
                    cycle.append(cnt + 1)

            time += 1

            if not heap and not cycle:
                break

        for cnt in cycle:
            heapq.heappush(heap, cnt)

    return time

# Example
tasks = ["A", "A", "A", "B", "B", "B"]
print(least_interval(tasks, 2))  # 8: A -> B -> idle -> A -> B -> idle -> A -> B
```

## Complexity Comparison

| Problem | Time | Space |
|---------|------|-------|
| Kth Largest | O(n log k) | O(k) |
| Top K Frequent | O(n log k) | O(n) |
| Heap Sort | O(n log n) | O(1) in-place |
| Stream Median | O(log n) per add | O(n) |
| Merge K Arrays | O(n log k) | O(k) |

## Summary

Heaps solve many problems efficiently:

- **Kth element problems**: Maintain fixed-size heap
- **Top-K problems**: Heap of size k with appropriate ordering
- **Stream problems**: Two heaps for median, single heap for running min/max
- **Merge problems**: Heap tracks current minimum across sources
- **Scheduling problems**: Max-heap for most frequent first

The common pattern is using a heap to efficiently track the "best" candidates while processing a stream of data. Understanding these patterns helps recognize when heaps are the right tool.
