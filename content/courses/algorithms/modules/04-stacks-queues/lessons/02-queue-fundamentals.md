# Queue Fundamentals

## Introduction

A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. Think of a line at a store: the first person in line is the first person served. Queues are used in scheduling, breadth-first search, buffering, and many other applications.

## The FIFO Principle

```
Queue Operations (front on left, rear on right):

Enqueue 1:  Enqueue 2:  Enqueue 3:  Dequeue:    Dequeue:
+---+       +---+---+   +---+---+---+ +---+---+  +---+
| 1 |       | 1 | 2 |   | 1 | 2 | 3 | | 2 | 3 |  | 3 |
+---+       +---+---+   +---+---+---+ +---+---+  +---+
front=rear  front  rear front    rear front rear front=rear

First in (1) is first out.
```

## Core Operations

| Operation | Description | Time Complexity |
|-----------|-------------|-----------------|
| enqueue(x) | Add element x to rear | O(1) |
| dequeue() | Remove and return front element | O(1) |
| front()/peek() | Return front element without removing | O(1) |
| isEmpty() | Check if queue is empty | O(1) |
| size() | Return number of elements | O(1) |

## Implementation Using a List (Naive)

```python
class NaiveQueue:
    """Queue with O(n) dequeue - not recommended."""

    def __init__(self):
        self._items = []

    def enqueue(self, item):
        """Add to rear. Time: O(1)"""
        self._items.append(item)

    def dequeue(self):
        """Remove from front. Time: O(n) - BAD!"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._items.pop(0)  # Shifts all elements!

    def is_empty(self):
        return len(self._items) == 0
```

The problem: `pop(0)` shifts all remaining elements, making it O(n).

## Implementation Using collections.deque

Python's `deque` provides O(1) operations at both ends:

```python
from collections import deque


class Queue:
    """Queue implementation using deque."""

    def __init__(self):
        self._items = deque()

    def enqueue(self, item):
        """Add item to the rear.

        Time: O(1)
        """
        self._items.append(item)

    def dequeue(self):
        """Remove and return the front item.

        Time: O(1)
        """
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._items.popleft()

    def front(self):
        """Return the front item without removing.

        Time: O(1)
        """
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._items[0]

    def is_empty(self):
        """Check if queue is empty.

        Time: O(1)
        """
        return len(self._items) == 0

    def size(self):
        """Return number of items.

        Time: O(1)
        """
        return len(self._items)

    def __str__(self):
        return f"Queue({list(self._items)})"
```

## Implementation Using Linked List

```python
class QueueNode:
    def __init__(self, val):
        self.val = val
        self.next = None


class LinkedQueue:
    """Queue implementation using linked list."""

    def __init__(self):
        self._front = None
        self._rear = None
        self._size = 0

    def enqueue(self, item):
        """Add item to rear.

        Time: O(1)
        """
        new_node = QueueNode(item)

        if self.is_empty():
            self._front = new_node
            self._rear = new_node
        else:
            self._rear.next = new_node
            self._rear = new_node

        self._size += 1

    def dequeue(self):
        """Remove and return front item.

        Time: O(1)
        """
        if self.is_empty():
            raise IndexError("Queue is empty")

        val = self._front.val
        self._front = self._front.next

        if self._front is None:
            self._rear = None

        self._size -= 1
        return val

    def front(self):
        """Return front item without removing.

        Time: O(1)
        """
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._front.val

    def is_empty(self):
        return self._front is None

    def size(self):
        return self._size
```

## Circular Queue (Ring Buffer)

A circular queue uses a fixed-size array with wrap-around indices, avoiding the need to shift elements.

```
Array of size 5:

Initial (empty):
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
  ^
front = rear = 0

After enqueue(1), enqueue(2), enqueue(3):
+---+---+---+---+---+
| 1 | 2 | 3 |   |   |
+---+---+---+---+---+
  ^           ^
front        rear

After dequeue() (returns 1):
+---+---+---+---+---+
|   | 2 | 3 |   |   |
+---+---+---+---+---+
      ^       ^
    front    rear

After enqueue(4), enqueue(5), enqueue(6):
+---+---+---+---+---+
| 6 | 2 | 3 | 4 | 5 |
+---+---+---+---+---+
  ^   ^
rear front

The array wraps around!
```

```python
class CircularQueue:
    """Fixed-size circular queue (ring buffer)."""

    def __init__(self, capacity):
        self._capacity = capacity
        self._items = [None] * capacity
        self._front = 0
        self._rear = 0
        self._size = 0

    def enqueue(self, item):
        """Add item to rear.

        Time: O(1)
        Raises: IndexError if queue is full
        """
        if self.is_full():
            raise IndexError("Queue is full")

        self._items[self._rear] = item
        self._rear = (self._rear + 1) % self._capacity
        self._size += 1

    def dequeue(self):
        """Remove and return front item.

        Time: O(1)
        """
        if self.is_empty():
            raise IndexError("Queue is empty")

        val = self._items[self._front]
        self._items[self._front] = None  # Help garbage collection
        self._front = (self._front + 1) % self._capacity
        self._size -= 1
        return val

    def front(self):
        """Return front item.

        Time: O(1)
        """
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._items[self._front]

    def is_empty(self):
        return self._size == 0

    def is_full(self):
        return self._size == self._capacity

    def size(self):
        return self._size
```

## Double-Ended Queue (Deque)

A deque allows insertion and deletion at both ends:

```python
from collections import deque


class Deque:
    """Double-ended queue."""

    def __init__(self):
        self._items = deque()

    def add_front(self, item):
        """Add to front. Time: O(1)"""
        self._items.appendleft(item)

    def add_rear(self, item):
        """Add to rear. Time: O(1)"""
        self._items.append(item)

    def remove_front(self):
        """Remove from front. Time: O(1)"""
        return self._items.popleft()

    def remove_rear(self):
        """Remove from rear. Time: O(1)"""
        return self._items.pop()
```

## Priority Queue Preview

A priority queue serves elements by priority rather than arrival order. We will cover this in detail in the Heaps module.

```python
import heapq


class PriorityQueue:
    """Priority queue using a min-heap."""

    def __init__(self):
        self._heap = []

    def enqueue(self, priority, item):
        """Add item with priority (lower = higher priority)."""
        heapq.heappush(self._heap, (priority, item))

    def dequeue(self):
        """Remove and return highest-priority item."""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return heapq.heappop(self._heap)[1]

    def is_empty(self):
        return len(self._heap) == 0
```

## Comparing Queue Types

| Type | Order | Operations | Use Case |
|------|-------|------------|----------|
| Queue | FIFO | enqueue, dequeue | Task scheduling |
| Deque | Both ends | add/remove front/rear | Sliding window |
| Priority Queue | By priority | enqueue with priority | Dijkstra's algorithm |
| Circular Queue | FIFO, fixed size | enqueue, dequeue | Buffering |

## Real-World Applications

### 1. Print Queue

Documents are printed in the order they are submitted.

```python
class PrintQueue:
    def __init__(self):
        self.queue = Queue()

    def submit_job(self, document):
        self.queue.enqueue(document)
        print(f"Job submitted: {document}")

    def process_next(self):
        if not self.queue.is_empty():
            doc = self.queue.dequeue()
            print(f"Printing: {doc}")
```

### 2. Message Queue

Systems communicate by passing messages through queues.

### 3. Task Scheduler

Operating systems schedule processes using queues.

## Practice Problems

1. **Implement Queue using Stacks**: Use two stacks to simulate a queue
2. **Design Circular Queue**: Implement a fixed-size circular queue
3. **Moving Average from Data Stream**: Calculate moving average using queue
4. **Number of Recent Calls**: Count calls in last 3000 milliseconds

## Summary

Queues provide FIFO access to elements:

| Property | Value |
|----------|-------|
| Access Pattern | First-In-First-Out |
| Key Operations | enqueue, dequeue, front |
| Time Complexity | O(1) for all operations |

Key implementations:
- `collections.deque` for general use
- Circular queue for fixed-size buffers
- Linked list for guaranteed O(1)

In the next lesson, we will explore advanced stack applications.
