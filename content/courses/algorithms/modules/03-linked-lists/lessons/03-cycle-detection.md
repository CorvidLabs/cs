# Cycle Detection in Linked Lists

## Introduction

A cycle in a linked list occurs when a node's next pointer points back to a previous node, creating a loop. Detecting cycles is crucial because iterating through a cyclic list without detection would cause an infinite loop.

This lesson covers techniques to detect cycles, find the cycle start, and determine cycle length.

## What is a Cycle?

```
Normal List (no cycle):
1 -> 2 -> 3 -> 4 -> null

List with cycle:
1 -> 2 -> 3 -> 4
          ^    |
          |    v
          6 <- 5

Node 5 points to node 3, creating a cycle.
```

## Approach 1: Hash Set

Store visited nodes and check if we encounter one again.

### Visual Walkthrough

```
List: 1 -> 2 -> 3 -> 4 -> 2 (back to node with value 2)

Step 1: Visit 1, seen = {1}
Step 2: Visit 2, seen = {1, 2}
Step 3: Visit 3, seen = {1, 2, 3}
Step 4: Visit 4, seen = {1, 2, 3, 4}
Step 5: Visit 2, already in seen! Cycle detected.
```

### Python Implementation

```python
def has_cycle_hash(head):
    """
    Detect cycle using a hash set.

    Time: O(n), Space: O(n)
    """
    seen = set()
    current = head

    while current is not None:
        if current in seen:
            return True
        seen.add(current)
        current = current.next

    return False
```

## Approach 2: Floyd's Cycle Detection (Tortoise and Hare)

Use two pointers moving at different speeds. If there is a cycle, they will eventually meet.

### Why It Works

Imagine two runners on a circular track:
- Slow runner: 1 lap per hour
- Fast runner: 2 laps per hour

The fast runner will eventually lap the slow runner. Similarly, in a cyclic list, the fast pointer will catch up to the slow pointer.

### Visual Walkthrough

```
List: 1 -> 2 -> 3 -> 4 -> 5 -> 3 (cycle back to 3)

      1 -> 2 -> 3 -> 4 -> 5
                ^         |
                |_________|

Initial: slow = 1, fast = 1

Step 1: slow = 2, fast = 3
        1 -> 2 -> 3 -> 4 -> 5
              S    F

Step 2: slow = 3, fast = 5
        1 -> 2 -> 3 -> 4 -> 5
                   S         F

Step 3: slow = 4, fast = 4 (fast went 5->3->4)
        1 -> 2 -> 3 -> 4 -> 5
                       S,F

slow == fast, cycle detected!
```

### Mathematical Proof

Let:
- L = distance from head to cycle start
- C = cycle length
- K = distance from cycle start to meeting point

When slow enters the cycle, fast has already traveled some distance inside.

When they meet:
- Slow has traveled: L + K
- Fast has traveled: L + K + nC (for some integer n)

Since fast travels twice as fast:
2(L + K) = L + K + nC
L + K = nC

This means the distance from head to cycle start equals the distance from meeting point to cycle start (modulo cycle length).

### Python Implementation

```python
def has_cycle(head):
    """
    Detect cycle using Floyd's algorithm.

    Time: O(n), Space: O(1)
    """
    if head is None or head.next is None:
        return False

    slow = head
    fast = head

    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next

        if slow == fast:
            return True

    return False
```

## Finding the Cycle Start

Once we detect a cycle, we can find where it starts.

### Algorithm

1. Detect the meeting point using Floyd's algorithm
2. Move one pointer back to head
3. Move both pointers one step at a time
4. They will meet at the cycle start

### Visual Walkthrough

```
List: 1 -> 2 -> 3 -> 4 -> 5 -> 3

After detection, slow and fast meet at node 4.

Phase 2: Reset slow to head
         slow = 1, fast = 4

Step 1:  slow = 2, fast = 5
Step 2:  slow = 3, fast = 3 (5->3)

slow == fast at node 3, which is the cycle start!
```

### Python Implementation

```python
def find_cycle_start(head):
    """
    Find the node where the cycle begins.

    Returns None if no cycle exists.

    Time: O(n), Space: O(1)
    """
    if head is None or head.next is None:
        return None

    # Phase 1: Detect cycle
    slow = head
    fast = head

    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next

        if slow == fast:
            break
    else:
        # No cycle
        return None

    # Phase 2: Find cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next

    return slow
```

## Finding Cycle Length

Once we have a meeting point inside the cycle, we can count the cycle length.

```python
def find_cycle_length(head):
    """
    Find the length of the cycle.

    Returns 0 if no cycle exists.

    Time: O(n), Space: O(1)
    """
    # First, find meeting point
    if head is None or head.next is None:
        return 0

    slow = head
    fast = head

    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next

        if slow == fast:
            # Found meeting point, count cycle length
            length = 1
            current = slow.next
            while current != slow:
                length += 1
                current = current.next
            return length

    return 0
```

## Complete Cycle Analysis

Combine all information about a cycle:

```python
def analyze_cycle(head):
    """
    Comprehensive cycle analysis.

    Returns dict with:
    - has_cycle: boolean
    - cycle_start: node where cycle begins (or None)
    - cycle_length: number of nodes in cycle (or 0)
    - tail_length: nodes before cycle (or total length if no cycle)
    """
    result = {
        'has_cycle': False,
        'cycle_start': None,
        'cycle_length': 0,
        'tail_length': 0
    }

    if head is None:
        return result

    # Detect cycle and find meeting point
    slow = head
    fast = head
    has_cycle = False

    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next

        if slow == fast:
            has_cycle = True
            break

    if not has_cycle:
        # Count total length
        current = head
        while current is not None:
            result['tail_length'] += 1
            current = current.next
        return result

    result['has_cycle'] = True

    # Find cycle length
    length = 1
    current = slow.next
    while current != slow:
        length += 1
        current = current.next
    result['cycle_length'] = length

    # Find cycle start and tail length
    slow = head
    tail_length = 0
    while slow != fast:
        slow = slow.next
        fast = fast.next
        tail_length += 1

    result['cycle_start'] = slow
    result['tail_length'] = tail_length

    return result
```

## Detecting Intersection of Two Lists

A related problem: determine if two linked lists intersect (share nodes).

```
List A: 1 -> 2 \
                -> 5 -> 6 -> null
List B:     3 /

Lists intersect at node 5.
```

```python
def find_intersection(head_a, head_b):
    """
    Find the intersection node of two linked lists.

    Key insight: If we traverse A then B, and B then A,
    both paths have equal length.

    Time: O(n + m), Space: O(1)
    """
    if head_a is None or head_b is None:
        return None

    ptr_a = head_a
    ptr_b = head_b

    # When ptr_a reaches end, redirect to head_b (and vice versa)
    # They will meet at intersection or both be null
    while ptr_a != ptr_b:
        ptr_a = ptr_a.next if ptr_a else head_b
        ptr_b = ptr_b.next if ptr_b else head_a

    return ptr_a
```

### Why This Works

```
A: a1 -> a2 -> c1 -> c2 -> c3
B: b1 -> b2 -> b3 -> c1 -> c2 -> c3

Length A = 2 + 3 = 5 (unique + common)
Length B = 3 + 3 = 6 (unique + common)

Path A then B: a1 a2 c1 c2 c3 b1 b2 b3 c1 (meets here)
Path B then A: b1 b2 b3 c1 c2 c3 a1 a2 c1 (meets here)

Both paths: unique_A + common + unique_B + common = same length
```

## Applications

### 1. Memory Leak Detection

Circular references in garbage-collected languages can prevent memory from being freed.

### 2. Deadlock Detection

In operating systems, wait-for graphs can form cycles indicating deadlocks.

### 3. Infinite Loop Prevention

Detecting cycles in state machines or iterative processes.

## Edge Cases

```python
def test_edge_cases():
    # Empty list
    assert has_cycle(None) == False

    # Single node, no cycle
    single = ListNode(1)
    assert has_cycle(single) == False

    # Single node with self-loop
    self_loop = ListNode(1)
    self_loop.next = self_loop
    assert has_cycle(self_loop) == True

    # Two nodes, cycle
    two = ListNode(1)
    two.next = ListNode(2)
    two.next.next = two
    assert has_cycle(two) == True
```

## Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Hash Set | O(n) | O(n) | Simple to implement | Extra memory |
| Floyd's | O(n) | O(1) | Constant space | Slightly complex |

Floyd's algorithm is preferred when memory is constrained.

## Practice Problems

1. **Linked List Cycle**: Determine if a cycle exists
2. **Linked List Cycle II**: Find the cycle start node
3. **Happy Number**: Detect cycles in number sequences
4. **Find the Duplicate Number**: Use cycle detection on array indices

## Summary

Cycle detection is essential for linked list operations:

| Task | Technique |
|------|-----------|
| Detect cycle | Floyd's algorithm |
| Find cycle start | Two-phase Floyd's |
| Find cycle length | Count from meeting point |
| Find intersection | Equal-length traversal |

Key insights:
- Fast and slow pointers will meet if a cycle exists
- Meeting point reveals cycle structure
- O(1) space is achievable with Floyd's algorithm

In the next lesson, we will explore list reversal techniques.
