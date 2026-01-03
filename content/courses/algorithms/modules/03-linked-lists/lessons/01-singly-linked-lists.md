# Singly Linked Lists

## Introduction

A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node in the sequence. Unlike arrays, linked list elements are not stored in contiguous memory locations, which gives them unique advantages and trade-offs.

Understanding linked lists is fundamental because they form the basis for more complex data structures like stacks, queues, and graphs.

## Structure of a Linked List

### Node Structure

Each node in a singly linked list contains:
1. **Data**: The value stored in the node
2. **Next pointer**: Reference to the next node (or null if last)

```
Node Structure:
+-------+------+
| Data  | Next |--->
+-------+------+

Linked List:
+---+    +---+    +---+    +---+
| 1 |--->| 2 |--->| 3 |--->| 4 |---> null
+---+    +---+    +---+    +---+
 ^
head
```

### Python Implementation

```python
class ListNode:
    """A node in a singly linked list."""

    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class LinkedList:
    """Singly linked list with basic operations."""

    def __init__(self):
        self.head = None
        self.size = 0

    def is_empty(self):
        return self.head is None
```

## Arrays vs Linked Lists

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) | O(n) |
| Insert at beginning | O(n) | O(1) |
| Insert at end | O(1)* | O(n)** |
| Insert at middle | O(n) | O(n)*** |
| Delete at beginning | O(n) | O(1) |
| Memory usage | Contiguous | Scattered + overhead |

*Amortized for dynamic arrays
**O(1) if tail pointer maintained
***O(1) once position is found

## Basic Operations

### Traversal

Visit each node in the list sequentially.

```
Traversing: 1 -> 2 -> 3 -> 4 -> null

Step 1: current = head (1)
Step 2: current = current.next (2)
Step 3: current = current.next (3)
Step 4: current = current.next (4)
Step 5: current = current.next (null) - stop
```

```python
def traverse(self):
    """
    Visit each node and collect values.

    Time: O(n), Space: O(n) for result
    """
    result = []
    current = self.head

    while current is not None:
        result.append(current.val)
        current = current.next

    return result


def find(self, val):
    """
    Find first node with given value.

    Time: O(n), Space: O(1)
    """
    current = self.head

    while current is not None:
        if current.val == val:
            return current
        current = current.next

    return None
```

### Insertion

#### Insert at Beginning (Prepend)

```
Before: head -> 2 -> 3 -> null
Insert 1 at beginning:

Step 1: Create new node with value 1
        +---+
        | 1 |
        +---+

Step 2: Point new node's next to current head
        +---+    +---+    +---+
        | 1 |--->| 2 |--->| 3 |---> null
        +---+    +---+    +---+

Step 3: Update head to new node
        +---+    +---+    +---+
        | 1 |--->| 2 |--->| 3 |---> null
        +---+    +---+    +---+
         ^
        head

After: head -> 1 -> 2 -> 3 -> null
```

```python
def prepend(self, val):
    """
    Insert at the beginning.

    Time: O(1), Space: O(1)
    """
    new_node = ListNode(val)
    new_node.next = self.head
    self.head = new_node
    self.size += 1
```

#### Insert at End (Append)

```
Before: head -> 1 -> 2 -> null
Insert 3 at end:

Step 1: Traverse to last node
        +---+    +---+
        | 1 |--->| 2 |---> null
        +---+    +---+
                  ^
                current (last node)

Step 2: Create new node and link
        +---+    +---+    +---+
        | 1 |--->| 2 |--->| 3 |---> null
        +---+    +---+    +---+

After: head -> 1 -> 2 -> 3 -> null
```

```python
def append(self, val):
    """
    Insert at the end.

    Time: O(n), Space: O(1)
    """
    new_node = ListNode(val)

    if self.head is None:
        self.head = new_node
    else:
        current = self.head
        while current.next is not None:
            current = current.next
        current.next = new_node

    self.size += 1
```

#### Insert at Position

```python
def insert_at(self, index, val):
    """
    Insert at specific position.

    Time: O(n), Space: O(1)
    """
    if index < 0 or index > self.size:
        raise IndexError("Index out of bounds")

    if index == 0:
        self.prepend(val)
        return

    new_node = ListNode(val)
    current = self.head

    # Traverse to node before insertion point
    for _ in range(index - 1):
        current = current.next

    new_node.next = current.next
    current.next = new_node
    self.size += 1
```

### Deletion

#### Delete from Beginning

```
Before: head -> 1 -> 2 -> 3 -> null
Delete first node:

Step 1: Store reference to second node
        +---+    +---+    +---+
        | 1 |--->| 2 |--->| 3 |---> null
        +---+    +---+    +---+
         ^        ^
        head    temp

Step 2: Update head to second node
        +---+    +---+    +---+
        | 1 |    | 2 |--->| 3 |---> null
        +---+    +---+    +---+
                  ^
                 head

After: head -> 2 -> 3 -> null
```

```python
def delete_first(self):
    """
    Delete the first node.

    Time: O(1), Space: O(1)
    """
    if self.head is None:
        raise ValueError("List is empty")

    val = self.head.val
    self.head = self.head.next
    self.size -= 1
    return val
```

#### Delete by Value

```python
def delete_value(self, val):
    """
    Delete first node with given value.

    Time: O(n), Space: O(1)
    """
    if self.head is None:
        return False

    # Special case: delete head
    if self.head.val == val:
        self.head = self.head.next
        self.size -= 1
        return True

    # Find node before the one to delete
    current = self.head
    while current.next is not None:
        if current.next.val == val:
            current.next = current.next.next
            self.size -= 1
            return True
        current = current.next

    return False
```

#### Delete at Position

```python
def delete_at(self, index):
    """
    Delete node at specific position.

    Time: O(n), Space: O(1)
    """
    if index < 0 or index >= self.size:
        raise IndexError("Index out of bounds")

    if index == 0:
        return self.delete_first()

    current = self.head

    # Traverse to node before deletion point
    for _ in range(index - 1):
        current = current.next

    val = current.next.val
    current.next = current.next.next
    self.size -= 1
    return val
```

## The Dummy Node Technique

When operations might modify the head, using a dummy node simplifies edge cases.

```
Original:  head -> 1 -> 2 -> 3 -> null
With dummy: dummy -> 1 -> 2 -> 3 -> null
            (head = dummy.next)
```

```python
def delete_all_occurrences(head, val):
    """
    Delete all nodes with given value using dummy node.

    Time: O(n), Space: O(1)
    """
    dummy = ListNode(0)
    dummy.next = head
    current = dummy

    while current.next is not None:
        if current.next.val == val:
            current.next = current.next.next
        else:
            current = current.next

    return dummy.next
```

Without the dummy node, we would need separate logic to handle deleting the head.

## Get Node at Index

```python
def get(self, index):
    """
    Get value at index.

    Time: O(n), Space: O(1)
    """
    if index < 0 or index >= self.size:
        raise IndexError("Index out of bounds")

    current = self.head
    for _ in range(index):
        current = current.next

    return current.val
```

## Common Linked List Patterns

### Finding the Middle Node

Use the fast and slow pointer technique:

```
List: 1 -> 2 -> 3 -> 4 -> 5 -> null

slow moves 1 step, fast moves 2 steps:

Initial:  slow=1, fast=1
Step 1:   slow=2, fast=3
Step 2:   slow=3, fast=5
Step 3:   fast.next is null, stop

Middle node: 3
```

```python
def find_middle(head):
    """
    Find middle node using fast and slow pointers.

    Time: O(n), Space: O(1)
    """
    if head is None:
        return None

    slow = head
    fast = head

    while fast.next is not None and fast.next.next is not None:
        slow = slow.next
        fast = fast.next.next

    return slow
```

### Finding Nth Node from End

Use two pointers with an n-node gap:

```
List: 1 -> 2 -> 3 -> 4 -> 5 -> null
Find 2nd from end:

Step 1: Advance fast n steps (n=2)
        fast = 3

Step 2: Move both until fast reaches end
        slow=1, fast=3
        slow=2, fast=4
        slow=3, fast=5
        slow=4, fast=null

4 is the 2nd node from end.
```

```python
def find_nth_from_end(head, n):
    """
    Find nth node from the end.

    Time: O(n), Space: O(1)
    """
    fast = head
    slow = head

    # Advance fast by n nodes
    for _ in range(n):
        if fast is None:
            return None  # List shorter than n
        fast = fast.next

    # Move both until fast reaches end
    while fast is not None:
        slow = slow.next
        fast = fast.next

    return slow
```

## Complete Implementation

```python
class LinkedList:
    """Complete singly linked list implementation."""

    def __init__(self):
        self.head = None
        self.size = 0

    def is_empty(self):
        return self.head is None

    def __len__(self):
        return self.size

    def prepend(self, val):
        new_node = ListNode(val)
        new_node.next = self.head
        self.head = new_node
        self.size += 1

    def append(self, val):
        new_node = ListNode(val)
        if self.head is None:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
        self.size += 1

    def __str__(self):
        values = []
        current = self.head
        while current:
            values.append(str(current.val))
            current = current.next
        return " -> ".join(values) + " -> null"
```

## Practice Problems

1. **Remove Duplicates**: Remove all duplicate values from sorted list
2. **Partition List**: Partition around a value x
3. **Add Two Numbers**: Numbers represented as linked lists
4. **Merge Two Sorted Lists**: Merge into one sorted list

## Summary

Singly linked lists provide:

| Advantage | Disadvantage |
|-----------|--------------|
| O(1) insertion at head | O(n) access by index |
| Dynamic size | Extra memory for pointers |
| No wasted space | No backward traversal |

Key techniques:
- Use dummy nodes to handle edge cases
- Fast and slow pointers for middle/cycle detection
- Two pointers with gap for nth from end

In the next lesson, we will explore doubly linked lists, which add backward traversal capabilities.
