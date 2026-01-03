# Doubly Linked Lists

## Introduction

A doubly linked list extends the singly linked list by adding a pointer to the previous node. This bidirectional linking enables traversal in both directions and makes certain operations more efficient, at the cost of additional memory for the extra pointers.

## Structure

### Node Structure

Each node contains:
1. **Data**: The value stored
2. **Next pointer**: Reference to the next node
3. **Prev pointer**: Reference to the previous node

```
Node Structure:
+------+-------+------+
| Prev |  Data | Next |
+------+-------+------+

Doubly Linked List:
null <--- +---+ <---> +---+ <---> +---+ <---> +---+ ---> null
          | 1 |       | 2 |       | 3 |       | 4 |
          +---+       +---+       +---+       +---+
           ^                                   ^
          head                                tail
```

### Python Implementation

```python
class DoublyListNode:
    """A node in a doubly linked list."""

    def __init__(self, val=0, prev=None, next=None):
        self.val = val
        self.prev = prev
        self.next = next


class DoublyLinkedList:
    """Doubly linked list with head and tail pointers."""

    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def is_empty(self):
        return self.head is None
```

## Comparison with Singly Linked Lists

| Operation | Singly | Doubly |
|-----------|--------|--------|
| Insert at beginning | O(1) | O(1) |
| Insert at end | O(n)* | O(1) |
| Delete at beginning | O(1) | O(1) |
| Delete at end | O(n) | O(1) |
| Delete given node | O(n)** | O(1) |
| Memory per node | 1 pointer | 2 pointers |
| Backward traversal | Not possible | O(n) |

*O(1) if tail pointer maintained in singly list
**O(1) if previous node is known

## Basic Operations

### Insertion at Beginning

```
Before: null <--- 2 <---> 3 ---> null
                  ^        ^
                head     tail

Insert 1 at beginning:

Step 1: Create new node
        +---+
        | 1 |
        +---+

Step 2: Link new node to current head
        +---+       +---+       +---+
        | 1 | <---> | 2 | <---> | 3 |
        +---+       +---+       +---+

Step 3: Update head
        +---+       +---+       +---+
        | 1 | <---> | 2 | <---> | 3 |
        +---+       +---+       +---+
         ^                       ^
        head                   tail

After: null <--- 1 <---> 2 <---> 3 ---> null
```

```python
def prepend(self, val):
    """
    Insert at the beginning.

    Time: O(1), Space: O(1)
    """
    new_node = DoublyListNode(val)

    if self.is_empty():
        self.head = new_node
        self.tail = new_node
    else:
        new_node.next = self.head
        self.head.prev = new_node
        self.head = new_node

    self.size += 1
```

### Insertion at End

```
Before: null <--- 1 <---> 2 ---> null
                  ^        ^
                head     tail

Insert 3 at end:

Step 1: Create new node and link to tail
        +---+       +---+       +---+
        | 1 | <---> | 2 | <---> | 3 |
        +---+       +---+       +---+

Step 2: Update tail
        +---+       +---+       +---+
        | 1 | <---> | 2 | <---> | 3 |
        +---+       +---+       +---+
         ^                       ^
        head                   tail

After: null <--- 1 <---> 2 <---> 3 ---> null
```

```python
def append(self, val):
    """
    Insert at the end.

    Time: O(1), Space: O(1)
    """
    new_node = DoublyListNode(val)

    if self.is_empty():
        self.head = new_node
        self.tail = new_node
    else:
        new_node.prev = self.tail
        self.tail.next = new_node
        self.tail = new_node

    self.size += 1
```

### Insertion at Position

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

    if index == self.size:
        self.append(val)
        return

    new_node = DoublyListNode(val)

    # Optimize: start from closer end
    if index <= self.size // 2:
        current = self.head
        for _ in range(index):
            current = current.next
    else:
        current = self.tail
        for _ in range(self.size - 1 - index):
            current = current.prev

    # Insert before current
    new_node.next = current
    new_node.prev = current.prev
    current.prev.next = new_node
    current.prev = new_node

    self.size += 1
```

### Deletion from Beginning

```python
def delete_first(self):
    """
    Delete the first node.

    Time: O(1), Space: O(1)
    """
    if self.is_empty():
        raise ValueError("List is empty")

    val = self.head.val

    if self.head == self.tail:
        # Only one node
        self.head = None
        self.tail = None
    else:
        self.head = self.head.next
        self.head.prev = None

    self.size -= 1
    return val
```

### Deletion from End

```python
def delete_last(self):
    """
    Delete the last node.

    Time: O(1), Space: O(1)
    """
    if self.is_empty():
        raise ValueError("List is empty")

    val = self.tail.val

    if self.head == self.tail:
        # Only one node
        self.head = None
        self.tail = None
    else:
        self.tail = self.tail.prev
        self.tail.next = None

    self.size -= 1
    return val
```

### Delete Specific Node

One major advantage of doubly linked lists is deleting a node in O(1) when you have a reference to it:

```python
def delete_node(self, node):
    """
    Delete a specific node.

    Time: O(1), Space: O(1)
    """
    if node is None:
        return

    if node.prev is not None:
        node.prev.next = node.next
    else:
        # Deleting head
        self.head = node.next

    if node.next is not None:
        node.next.prev = node.prev
    else:
        # Deleting tail
        self.tail = node.prev

    self.size -= 1
```

## Traversal

### Forward Traversal

```python
def traverse_forward(self):
    """Traverse from head to tail."""
    result = []
    current = self.head

    while current is not None:
        result.append(current.val)
        current = current.next

    return result
```

### Backward Traversal

```python
def traverse_backward(self):
    """Traverse from tail to head."""
    result = []
    current = self.tail

    while current is not None:
        result.append(current.val)
        current = current.prev

    return result
```

## Sentinel Nodes Pattern

Using sentinel (dummy) nodes at both ends eliminates edge cases:

```
Empty list with sentinels:
+-------+       +-------+
| DUMMY | <---> | DUMMY |
| (head)|       | (tail)|
+-------+       +-------+

List with data:
+-------+       +---+       +---+       +-------+
| DUMMY | <---> | 1 | <---> | 2 | <---> | DUMMY |
| (head)|       +---+       +---+       | (tail)|
+-------+                               +-------+
```

```python
class DoublyLinkedListWithSentinels:
    """Doubly linked list using sentinel nodes."""

    def __init__(self):
        self.head = DoublyListNode(None)  # Dummy head
        self.tail = DoublyListNode(None)  # Dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head
        self.size = 0

    def is_empty(self):
        return self.size == 0

    def prepend(self, val):
        """Insert after dummy head."""
        self._insert_after(self.head, val)

    def append(self, val):
        """Insert before dummy tail."""
        self._insert_before(self.tail, val)

    def _insert_after(self, node, val):
        """Insert new node after given node."""
        new_node = DoublyListNode(val)
        new_node.prev = node
        new_node.next = node.next
        node.next.prev = new_node
        node.next = new_node
        self.size += 1

    def _insert_before(self, node, val):
        """Insert new node before given node."""
        self._insert_after(node.prev, val)

    def delete_node(self, node):
        """Remove a node (not a sentinel)."""
        if node == self.head or node == self.tail:
            raise ValueError("Cannot delete sentinel nodes")

        node.prev.next = node.next
        node.next.prev = node.prev
        self.size -= 1
        return node.val
```

## LRU Cache Implementation

A practical application of doubly linked lists is the Least Recently Used (LRU) cache:

```python
class LRUCache:
    """
    LRU Cache using doubly linked list and hash map.

    Most recently used items are at the front.
    Least recently used items are at the back.
    """

    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}  # key -> node

        # Sentinel nodes
        self.head = DoublyListNode(None)
        self.tail = DoublyListNode(None)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        """Remove node from its current position."""
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_front(self, node):
        """Add node right after head."""
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def _move_to_front(self, node):
        """Move existing node to front."""
        self._remove(node)
        self._add_to_front(node)

    def get(self, key):
        """
        Get value by key. Returns -1 if not found.

        Time: O(1)
        """
        if key not in self.cache:
            return -1

        node = self.cache[key]
        self._move_to_front(node)
        return node.val[1]  # val is (key, value) tuple

    def put(self, key, value):
        """
        Insert or update key-value pair.

        Time: O(1)
        """
        if key in self.cache:
            node = self.cache[key]
            node.val = (key, value)
            self._move_to_front(node)
        else:
            if len(self.cache) >= self.capacity:
                # Remove least recently used (before tail)
                lru = self.tail.prev
                self._remove(lru)
                del self.cache[lru.val[0]]

            new_node = DoublyListNode((key, value))
            self.cache[key] = new_node
            self._add_to_front(new_node)
```

## Circular Doubly Linked List

In a circular doubly linked list, the last node points to the first, and the first points back to the last:

```
Circular Doubly Linked List:

    +------------------------------------------+
    |                                          |
    v                                          |
+-------+       +---+       +---+       +---+  |
| DUMMY | <---> | 1 | <---> | 2 | <---> | 3 |--+
+-------+       +---+       +---+       +---+
    ^                                      |
    +--------------------------------------+
```

This is useful for applications like round-robin scheduling.

## Complete Implementation

```python
class DoublyLinkedList:
    """Complete doubly linked list implementation."""

    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def is_empty(self):
        return self.head is None

    def __len__(self):
        return self.size

    def prepend(self, val):
        new_node = DoublyListNode(val)
        if self.is_empty():
            self.head = new_node
            self.tail = new_node
        else:
            new_node.next = self.head
            self.head.prev = new_node
            self.head = new_node
        self.size += 1

    def append(self, val):
        new_node = DoublyListNode(val)
        if self.is_empty():
            self.head = new_node
            self.tail = new_node
        else:
            new_node.prev = self.tail
            self.tail.next = new_node
            self.tail = new_node
        self.size += 1

    def delete_first(self):
        if self.is_empty():
            raise ValueError("List is empty")
        val = self.head.val
        if self.head == self.tail:
            self.head = None
            self.tail = None
        else:
            self.head = self.head.next
            self.head.prev = None
        self.size -= 1
        return val

    def delete_last(self):
        if self.is_empty():
            raise ValueError("List is empty")
        val = self.tail.val
        if self.head == self.tail:
            self.head = None
            self.tail = None
        else:
            self.tail = self.tail.prev
            self.tail.next = None
        self.size -= 1
        return val

    def __str__(self):
        if self.is_empty():
            return "null"
        values = []
        current = self.head
        while current:
            values.append(str(current.val))
            current = current.next
        return "null <-> " + " <-> ".join(values) + " <-> null"
```

## Practice Problems

1. **Flatten a Multilevel Doubly Linked List**: Flatten list with child pointers
2. **Design Browser History**: Implement back/forward navigation
3. **Insert into a Sorted Circular Linked List**: Maintain sorted order
4. **All O(1) Data Structure**: Insert, delete, getRandom in O(1)

## Summary

Doubly linked lists offer:

| Advantage | Trade-off |
|-----------|-----------|
| O(1) deletion with node reference | Extra memory per node |
| Bidirectional traversal | More pointers to maintain |
| O(1) operations at both ends | Slightly complex implementation |

Use doubly linked lists when you need:
- Frequent deletions given node references
- Backward traversal
- Efficient operations at both ends

In the next lesson, we will explore cycle detection algorithms for linked lists.
