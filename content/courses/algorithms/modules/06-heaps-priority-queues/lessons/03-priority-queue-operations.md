---
title: Priority Queue Operations
order: 3
estimatedMinutes: 20
---

# Priority Queue Operations

A priority queue is an abstract data type where elements are served based on their priority rather than their insertion order. Heaps provide an efficient implementation for priority queues.

## What is a Priority Queue?

Unlike a regular queue (FIFO), a priority queue serves elements by priority:
- **Min-Priority Queue**: Lowest priority value served first
- **Max-Priority Queue**: Highest priority value served first

```
Regular Queue:           Priority Queue (min):
Insert: A, B, C          Insert: (C, 3), (A, 1), (B, 2)
Remove: A, B, C          Remove: A, B, C (by priority 1, 2, 3)
```

## Core Operations

| Operation | Description | Time Complexity |
|-----------|-------------|-----------------|
| `insert(item, priority)` | Add item with priority | O(log n) |
| `extract_min/max()` | Remove highest priority item | O(log n) |
| `peek()` | View highest priority item | O(1) |
| `is_empty()` | Check if queue is empty | O(1) |
| `size()` | Number of elements | O(1) |

## Implementation with Heap

```python
import heapq

class PriorityQueue:
    def __init__(self):
        self.heap = []
        self.counter = 0  # For breaking ties

    def push(self, item, priority):
        """
        Add item with given priority.
        Lower priority value = higher priority.

        Time: O(log n)
        """
        # Counter ensures FIFO order for equal priorities
        entry = (priority, self.counter, item)
        heapq.heappush(self.heap, entry)
        self.counter += 1

    def pop(self):
        """
        Remove and return highest priority item.

        Time: O(log n)
        """
        if not self.heap:
            raise IndexError("Priority queue is empty")
        priority, count, item = heapq.heappop(self.heap)
        return item

    def peek(self):
        """
        View highest priority item without removing.

        Time: O(1)
        """
        if not self.heap:
            raise IndexError("Priority queue is empty")
        priority, count, item = self.heap[0]
        return item

    def is_empty(self):
        return len(self.heap) == 0

    def __len__(self):
        return len(self.heap)
```

## Handling Ties with Counter

When two items have the same priority, the counter ensures FIFO order:

```python
pq = PriorityQueue()
pq.push("Task A", priority=1)
pq.push("Task B", priority=1)
pq.push("Task C", priority=1)

# With counter: (1, 0, "Task A"), (1, 1, "Task B"), (1, 2, "Task C")
# Pop order: Task A, Task B, Task C (FIFO for equal priority)
```

## Custom Objects

For objects with natural ordering, implement comparison methods:

```python
class Task:
    def __init__(self, name, priority):
        self.name = name
        self.priority = priority

    def __lt__(self, other):
        # Lower priority value = higher priority
        return self.priority < other.priority

# Usage
import heapq
tasks = []
heapq.heappush(tasks, Task("Email", 3))
heapq.heappush(tasks, Task("Urgent Bug", 1))
heapq.heappush(tasks, Task("Meeting", 2))

# Pop returns Task("Urgent Bug", 1) first
```

## Max-Priority Queue

For max-priority queue, negate priorities:

```python
class MaxPriorityQueue:
    def __init__(self):
        self.heap = []
        self.counter = 0

    def push(self, item, priority):
        # Negate priority for max behavior
        entry = (-priority, self.counter, item)
        heapq.heappush(self.heap, entry)
        self.counter += 1

    def pop(self):
        if not self.heap:
            raise IndexError("Priority queue is empty")
        neg_priority, count, item = heapq.heappop(self.heap)
        return item
```

## Priority Queue with Decrease Key

Some algorithms (like Dijkstra's) need to decrease an item's priority:

```python
class IndexedPriorityQueue:
    def __init__(self):
        self.heap = []
        self.entry_finder = {}  # Map item to entry
        self.counter = 0
        self.REMOVED = '<removed>'

    def push(self, item, priority):
        if item in self.entry_finder:
            self._remove(item)
        entry = [priority, self.counter, item]
        self.entry_finder[item] = entry
        heapq.heappush(self.heap, entry)
        self.counter += 1

    def _remove(self, item):
        """Mark entry as removed."""
        entry = self.entry_finder.pop(item)
        entry[-1] = self.REMOVED

    def pop(self):
        """Remove and return lowest priority item."""
        while self.heap:
            priority, count, item = heapq.heappop(self.heap)
            if item is not self.REMOVED:
                del self.entry_finder[item]
                return item
        raise IndexError("Priority queue is empty")

    def decrease_key(self, item, new_priority):
        """Decrease priority of existing item."""
        if item in self.entry_finder:
            old_entry = self.entry_finder[item]
            if new_priority < old_entry[0]:
                self.push(item, new_priority)
```

## Common Applications

### 1. Task Scheduling

```python
class TaskScheduler:
    def __init__(self):
        self.pq = PriorityQueue()

    def add_task(self, task_name, priority):
        self.pq.push(task_name, priority)

    def get_next_task(self):
        return self.pq.pop() if not self.pq.is_empty() else None

# Usage
scheduler = TaskScheduler()
scheduler.add_task("Fix critical bug", 1)
scheduler.add_task("Write docs", 5)
scheduler.add_task("Code review", 3)

print(scheduler.get_next_task())  # "Fix critical bug"
print(scheduler.get_next_task())  # "Code review"
print(scheduler.get_next_task())  # "Write docs"
```

### 2. Event-Driven Simulation

```python
import heapq

def event_simulation():
    events = []  # (time, event_type, data)

    # Schedule events
    heapq.heappush(events, (10, "arrival", "Customer A"))
    heapq.heappush(events, (5, "arrival", "Customer B"))
    heapq.heappush(events, (15, "departure", "Customer A"))

    # Process events in time order
    while events:
        time, event_type, data = heapq.heappop(events)
        print(f"Time {time}: {event_type} - {data}")
```

### 3. Merge K Sorted Lists

```python
def merge_k_sorted_lists(lists):
    """
    Merge k sorted lists into one sorted list.

    Time: O(n log k) where n is total elements, k is number of lists
    """
    result = []
    heap = []

    # Initialize with first element from each list
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))

    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)

        # Add next element from same list
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))

    return result
```

## Priority Queue vs Sorted List

| Operation | Priority Queue (Heap) | Sorted List |
|-----------|----------------------|-------------|
| Insert | O(log n) | O(n) |
| Extract min/max | O(log n) | O(1) or O(n) |
| Peek | O(1) | O(1) |
| Build from n items | O(n) | O(n log n) |

Priority queues are preferred when:
- Frequent insertions and extractions
- Don't need to iterate in sorted order
- Only need min or max, not arbitrary access

## Thread-Safe Priority Queue

Python's `queue.PriorityQueue` is thread-safe:

```python
from queue import PriorityQueue

pq = PriorityQueue()
pq.put((2, "task B"))
pq.put((1, "task A"))
pq.put((3, "task C"))

while not pq.empty():
    priority, task = pq.get()
    print(task)  # task A, task B, task C
```

## Summary

Priority queues provide efficient priority-based access:
- Heap-based implementation gives O(log n) insert and extract
- Counter handles ties for FIFO behavior
- Lazy deletion enables decrease-key operation
- Essential for scheduling, simulation, and graph algorithms

In the next lesson, we will explore practical applications of heaps beyond priority queues.
