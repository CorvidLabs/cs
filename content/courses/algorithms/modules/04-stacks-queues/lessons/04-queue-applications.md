# Queue Applications

## Introduction

Queues excel at problems involving level-order processing, scheduling, and buffering. This lesson explores practical queue applications including BFS traversal, task scheduling, and sliding window problems using deques.

## Implement Queue Using Stacks

A classic problem: implement a queue using only stack operations.

### Approach 1: Costly Enqueue

Transfer all elements between stacks on each enqueue.

```
Enqueue 1: Stack1 = [1]
Enqueue 2: Pop 1 to Stack2 = [1]
           Push 2 to Stack1 = [2]
           Pop 1 back = [2, 1]
Enqueue 3: Pop all to Stack2 = [1, 2]
           Push 3 = [3]
           Pop all back = [3, 2, 1]
Dequeue:   Pop from Stack1 = 1 (correct FIFO order)
```

### Approach 2: Amortized O(1) Operations

Use two stacks: one for input, one for output. Only transfer when output is empty.

```python
class QueueUsingStacks:
    """
    Queue implemented with two stacks.

    Amortized O(1) for both enqueue and dequeue.
    """

    def __init__(self):
        self.input_stack = []
        self.output_stack = []

    def enqueue(self, x):
        """Add to rear. Time: O(1)"""
        self.input_stack.append(x)

    def dequeue(self):
        """Remove from front. Time: O(1) amortized"""
        if not self.output_stack:
            # Transfer all from input to output
            while self.input_stack:
                self.output_stack.append(self.input_stack.pop())

        if not self.output_stack:
            raise IndexError("Queue is empty")

        return self.output_stack.pop()

    def front(self):
        """Peek front. Time: O(1) amortized"""
        if not self.output_stack:
            while self.input_stack:
                self.output_stack.append(self.input_stack.pop())

        if not self.output_stack:
            raise IndexError("Queue is empty")

        return self.output_stack[-1]

    def is_empty(self):
        return not self.input_stack and not self.output_stack
```

### Why Amortized O(1)?

Each element is pushed and popped at most twice (once to each stack). For n operations, total work is O(n), making each operation O(1) amortized.

## Implement Stack Using Queues

The reverse problem: implement a stack using queues.

```python
from collections import deque


class StackUsingQueues:
    """
    Stack implemented with a single queue.

    Push: O(n), Pop: O(1)
    """

    def __init__(self):
        self.queue = deque()

    def push(self, x):
        """Add to top. Time: O(n)"""
        self.queue.append(x)
        # Rotate to bring new element to front
        for _ in range(len(self.queue) - 1):
            self.queue.append(self.queue.popleft())

    def pop(self):
        """Remove from top. Time: O(1)"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.queue.popleft()

    def top(self):
        """Peek top. Time: O(1)"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.queue[0]

    def is_empty(self):
        return len(self.queue) == 0
```

## Sliding Window Maximum

**Problem**: Find maximum in each sliding window of size k.

```
Array: [1, 3, -1, -3, 5, 3, 6, 7], k = 3

Window:     Max:
[1, 3, -1]   3
[3, -1, -3]  3
[-1, -3, 5]  5
[-3, 5, 3]   5
[5, 3, 6]    6
[3, 6, 7]    7

Result: [3, 3, 5, 5, 6, 7]
```

### Approach: Monotonic Deque

Maintain a deque of indices where values are in decreasing order. The front is always the maximum of the current window.

```python
from collections import deque


def max_sliding_window(nums, k):
    """
    Find maximum in each sliding window of size k.

    Time: O(n), Space: O(k)
    """
    if not nums or k == 0:
        return []

    dq = deque()  # Stores indices
    result = []

    for i in range(len(nums)):
        # Remove indices outside current window
        while dq and dq[0] < i - k + 1:
            dq.popleft()

        # Remove indices of smaller elements (they won't be max)
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()

        dq.append(i)

        # Start adding to result once we have a full window
        if i >= k - 1:
            result.append(nums[dq[0]])

    return result
```

### Visual Walkthrough

```
nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3

i=0: dq=[0]            window not full yet
i=1: nums[1]=3 > nums[0]=1, pop 0
     dq=[1]            window not full yet
i=2: nums[2]=-1 < nums[1]=3, keep
     dq=[1,2]          result=[3] (nums[1])
i=3: nums[3]=-3 < nums[2]=-1, keep
     dq=[1,2,3]        dq[0]=1 outside window, pop
     dq=[2,3]          result=[3,3] (but actually should be 3)
     Wait, let's redo...

i=3: remove old first (index 1-3+1=1, dq[0]=1 equals 1, so pop)
     Wait, 1 is not < 0, so keep. Actually window is [1,3].
     nums[3]=-3, append index 3
     dq=[1,2,3]
     i=3, window is [i-k+1, i] = [1,3]
     dq[0]=1 >= 1, keep
     result=[3,-3] ? No, should be 3.

Let me trace more carefully:

i=0: dq=[], append 0, dq=[0]
     i < k-1=2, no output
i=1: nums[1]=3 > nums[0]=1, pop, dq=[]
     append 1, dq=[1]
     i < k-1, no output
i=2: nums[2]=-1 < nums[1]=3, keep dq=[1]
     append 2, dq=[1,2]
     i >= k-1, output nums[dq[0]]=nums[1]=3
     result=[3]
i=3: dq[0]=1, window starts at i-k+1=1, 1>=1 ok
     nums[3]=-3 < nums[2]=-1, keep
     append 3, dq=[1,2,3]
     output nums[1]=3
     result=[3,3]
i=4: dq[0]=1 < i-k+1=2, remove, dq=[2,3]
     nums[4]=5 > nums[3]=-3, pop, dq=[2]
     nums[4]=5 > nums[2]=-1, pop, dq=[]
     append 4, dq=[4]
     output nums[4]=5
     result=[3,3,5]
...

Final: [3,3,5,5,6,7]
```

## Task Scheduler

**Problem**: Schedule tasks with cooldown period between same tasks.

```
Tasks: ["A","A","A","B","B","B"], cooldown = 2

Schedule: A B idle A B idle A B
          0 1  2   3 4  5   6 7

Minimum time: 8
```

```python
from collections import Counter
import heapq


def least_interval(tasks, n):
    """
    Find minimum time to complete all tasks with cooldown.

    Time: O(m) where m is total tasks, Space: O(26)
    """
    # Count task frequencies
    counts = list(Counter(tasks).values())

    # Find max frequency and how many tasks have it
    max_freq = max(counts)
    max_count = counts.count(max_freq)

    # Formula: (max_freq - 1) * (n + 1) + max_count
    # This creates slots: [A _ _] [A _ _] [A]
    #                      ^ n+1 width each
    result = (max_freq - 1) * (n + 1) + max_count

    # If we have more tasks than slots, no idle time needed
    return max(result, len(tasks))
```

### Understanding the Formula

```
Tasks: A A A B B B, n = 2

Create (max_freq - 1) groups of (n + 1) slots:
[A _ _] [A _ _]     <- 2 groups of 3 slots

Add final slot for tasks with max frequency:
[A _ _] [A _ _] [A B]

Fill remaining tasks:
[A B _] [A B _] [A B]

Total: (3-1) * (2+1) + 2 = 8
```

## Number of Recent Calls

**Problem**: Count function calls in the last 3000 milliseconds.

```python
from collections import deque


class RecentCounter:
    """Count calls within last 3000ms."""

    def __init__(self):
        self.calls = deque()

    def ping(self, t):
        """
        Record call at time t and return count of calls
        in range [t - 3000, t].

        Time: O(1) amortized
        """
        self.calls.append(t)

        # Remove calls outside the window
        while self.calls[0] < t - 3000:
            self.calls.popleft()

        return len(self.calls)
```

## Moving Average from Data Stream

```python
from collections import deque


class MovingAverage:
    """Calculate moving average over a window."""

    def __init__(self, size):
        self.size = size
        self.window = deque()
        self.total = 0

    def next(self, val):
        """
        Add value and return current average.

        Time: O(1)
        """
        self.window.append(val)
        self.total += val

        if len(self.window) > self.size:
            removed = self.window.popleft()
            self.total -= removed

        return self.total / len(self.window)
```

## Design Hit Counter

```python
from collections import deque


class HitCounter:
    """Count hits in the last 300 seconds."""

    def __init__(self):
        self.hits = deque()

    def hit(self, timestamp):
        """Record a hit at given timestamp."""
        self.hits.append(timestamp)

    def get_hits(self, timestamp):
        """Return hits in the last 300 seconds."""
        # Remove old hits
        while self.hits and self.hits[0] <= timestamp - 300:
            self.hits.popleft()

        return len(self.hits)
```

## BFS with Queue

Queues are fundamental to Breadth-First Search:

```python
from collections import deque


def bfs_level_order(root):
    """
    BFS traversal of a binary tree.

    Returns list of levels, each level is a list of values.
    """
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        level = []

        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(level)

    return result
```

## Rotting Oranges (Multi-source BFS)

**Problem**: Find time for all oranges to rot. Fresh oranges rot if adjacent to rotten ones.

```python
from collections import deque


def oranges_rotting(grid):
    """
    Time for all oranges to rot.

    Time: O(m * n), Space: O(m * n)
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0

    # Find all rotten oranges and count fresh
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))  # (row, col, time)
            elif grid[r][c] == 1:
                fresh += 1

    if fresh == 0:
        return 0

    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    max_time = 0

    while queue:
        r, c, time = queue.popleft()
        max_time = max(max_time, time)

        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2  # Mark as rotten
                fresh -= 1
                queue.append((nr, nc, time + 1))

    return max_time if fresh == 0 else -1
```

## Comparison: When to Use Stack vs Queue

| Problem Type | Use Stack | Use Queue |
|--------------|-----------|-----------|
| Nested structures | Yes | No |
| Most recent first | Yes | No |
| Level-by-level processing | No | Yes |
| FIFO ordering | No | Yes |
| Backtracking (DFS) | Yes | No |
| Shortest path (BFS) | No | Yes |

## Practice Problems

1. **Implement Stack using Queues**: Simulate LIFO with FIFO
2. **Sliding Window Maximum**: Maximum in each window
3. **Design Circular Deque**: Fixed-size double-ended queue
4. **Shortest Path in Binary Matrix**: BFS shortest path
5. **Open the Lock**: Minimum moves to reach target

## Summary

Queue applications leverage FIFO processing:

| Application | Key Pattern |
|-------------|-------------|
| BFS Traversal | Level-order processing |
| Sliding Window | Maintain window with deque |
| Rate Limiting | Remove expired entries |
| Task Scheduling | Process in order with constraints |

Key insights:
- Monotonic deque for sliding window extrema
- Multi-source BFS starts with all sources in queue
- Two-stack queue achieves amortized O(1) operations
- Deque enables efficient operations at both ends

This concludes the Stacks and Queues module. These fundamental data structures appear throughout algorithm design and will be used extensively in subsequent modules.
