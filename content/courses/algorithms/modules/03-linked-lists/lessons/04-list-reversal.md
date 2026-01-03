# Linked List Reversal

## Introduction

Reversing a linked list is one of the most common and important linked list operations. It appears frequently in coding interviews and forms the basis for solving many other problems. We will explore iterative and recursive approaches, as well as variations like partial reversal.

## The Problem

Given a linked list, reverse the order of nodes.

```
Before: 1 -> 2 -> 3 -> 4 -> 5 -> null
After:  5 -> 4 -> 3 -> 2 -> 1 -> null
```

## Iterative Approach

### Core Idea

Traverse the list once, reversing each link as we go. We need to track three nodes:
- **prev**: The already-reversed portion
- **current**: The node we are processing
- **next**: The not-yet-processed portion

### Visual Walkthrough

```
Initial: null   1 -> 2 -> 3 -> 4 -> null
          ^     ^
        prev  curr

Step 1: Save next, reverse link
         null <- 1    2 -> 3 -> 4 -> null
          ^      ^    ^
        prev   curr  next

Step 2: Move prev and curr forward
         null <- 1    2 -> 3 -> 4 -> null
                 ^    ^
               prev  curr

Step 3: Save next, reverse link
         null <- 1 <- 2    3 -> 4 -> null
                 ^    ^    ^
               prev  curr next

Step 4: Move forward
         null <- 1 <- 2    3 -> 4 -> null
                      ^    ^
                    prev  curr

Step 5: Save next, reverse link
         null <- 1 <- 2 <- 3    4 -> null
                      ^    ^    ^
                    prev  curr next

Step 6: Move forward
         null <- 1 <- 2 <- 3    4 -> null
                           ^    ^
                         prev  curr

Step 7: Save next, reverse link
         null <- 1 <- 2 <- 3 <- 4    null
                           ^    ^    ^
                         prev  curr next

Step 8: Move forward (curr becomes null)
         null <- 1 <- 2 <- 3 <- 4    null
                                ^    ^
                              prev  curr

curr is null, loop ends. Return prev.

Result: 4 -> 3 -> 2 -> 1 -> null (prev is new head)
```

### Python Implementation

```python
def reverse_list_iterative(head):
    """
    Reverse linked list iteratively.

    Time: O(n), Space: O(1)
    """
    prev = None
    current = head

    while current is not None:
        # Save next node
        next_node = current.next

        # Reverse the link
        current.next = prev

        # Move forward
        prev = current
        current = next_node

    return prev
```

## Recursive Approach

### Core Idea

Recursively reverse the rest of the list, then fix up the pointers.

### Visual Walkthrough

```
reverse(1 -> 2 -> 3 -> null)

Call stack:
reverse(1) -> reverse(2) -> reverse(3) -> return 3 (base case)

Unwinding:

At reverse(3): return 3 (head.next is null)

At reverse(2):
  - reversed_rest = 3 -> null
  - current = 2
  - 2.next = 3, so 3.next = 2 (point 3 back to 2)
  - 2.next = null
  Result: 3 -> 2 -> null

At reverse(1):
  - reversed_rest = 3 -> 2 -> null
  - current = 1
  - 1.next = 2, so 2.next = 1 (point 2 back to 1)
  - 1.next = null
  Result: 3 -> 2 -> 1 -> null

Return: 3 -> 2 -> 1 -> null
```

### Python Implementation

```python
def reverse_list_recursive(head):
    """
    Reverse linked list recursively.

    Time: O(n), Space: O(n) due to call stack
    """
    # Base case: empty or single node
    if head is None or head.next is None:
        return head

    # Recursively reverse the rest
    reversed_rest = reverse_list_recursive(head.next)

    # Fix pointers
    head.next.next = head  # Point next node back to current
    head.next = None        # Remove forward pointer

    return reversed_rest
```

### Understanding the Pointer Fix

```
Before recursive call:
head -> next -> [reversed rest]
  1  ->  2   -> 3 -> null

After recursive call:
head -> next <- [reversed rest]
  1  ->  2   <- 3
                ^
         reversed_rest points here

After head.next.next = head:
head <-> next <- [reversed rest]
  1  <-> 2   <- 3

After head.next = None:
head <- next <- [reversed rest]
  1  <- 2   <- 3
```

## Reverse Between Positions

Reverse only a portion of the list between positions m and n.

```
Before: 1 -> 2 -> 3 -> 4 -> 5 -> null, m=2, n=4
After:  1 -> 4 -> 3 -> 2 -> 5 -> null
             ----------
             reversed portion
```

### Python Implementation

```python
def reverse_between(head, m, n):
    """
    Reverse nodes between positions m and n (1-indexed).

    Time: O(n), Space: O(1)
    """
    if head is None or m == n:
        return head

    dummy = ListNode(0)
    dummy.next = head
    prev = dummy

    # Move prev to node before reversal starts
    for _ in range(m - 1):
        prev = prev.next

    # Start reversing
    current = prev.next
    for _ in range(n - m):
        # Move next node to front of reversed portion
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev.next
        prev.next = next_node

    return dummy.next
```

### Visual Walkthrough

```
1 -> 2 -> 3 -> 4 -> 5, m=2, n=4

dummy -> 1 -> 2 -> 3 -> 4 -> 5
         ^    ^
       prev  curr

Iteration 1: Move 3 to front of reversed section
dummy -> 1 -> 3 -> 2 -> 4 -> 5
         ^         ^
       prev      curr

Iteration 2: Move 4 to front of reversed section
dummy -> 1 -> 4 -> 3 -> 2 -> 5
         ^              ^
       prev           curr

Result: 1 -> 4 -> 3 -> 2 -> 5
```

## Reverse in Groups of K

Reverse every k nodes in the list.

```
Before: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> null, k=3
After:  3 -> 2 -> 1 -> 6 -> 5 -> 4 -> 7 -> 8 -> null
        ----------    ----------    --------
        group 1       group 2       remaining
```

### Python Implementation

```python
def reverse_k_group(head, k):
    """
    Reverse nodes in k-group.

    Time: O(n), Space: O(1)
    """
    if head is None or k == 1:
        return head

    dummy = ListNode(0)
    dummy.next = head
    prev_group_end = dummy

    while True:
        # Check if there are k nodes left
        kth_node = prev_group_end
        for _ in range(k):
            kth_node = kth_node.next
            if kth_node is None:
                return dummy.next

        # Mark the start and end of current group
        group_start = prev_group_end.next
        next_group_start = kth_node.next

        # Reverse the k nodes
        prev = next_group_start
        current = group_start

        for _ in range(k):
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node

        # Connect with previous part
        prev_group_end.next = kth_node

        # Move to next group
        prev_group_end = group_start

    return dummy.next
```

## Reverse Alternating K Groups

Reverse every alternate group of k nodes.

```
Before: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> null, k=2
After:  2 -> 1 -> 3 -> 4 -> 6 -> 5 -> 7 -> 8 -> null
        ------   ------   ------   ------
        reverse  keep     reverse  keep
```

## Checking for Palindrome

Use reversal to check if a linked list is a palindrome.

```python
def is_palindrome(head):
    """
    Check if linked list is a palindrome.

    Strategy:
    1. Find the middle
    2. Reverse the second half
    3. Compare first and second halves
    4. Restore the list (optional)

    Time: O(n), Space: O(1)
    """
    if head is None or head.next is None:
        return True

    # Find middle
    slow = head
    fast = head

    while fast.next is not None and fast.next.next is not None:
        slow = slow.next
        fast = fast.next.next

    # Reverse second half
    second_half = reverse_list_iterative(slow.next)

    # Compare
    first_half = head
    is_palindrome_list = True

    while second_half is not None:
        if first_half.val != second_half.val:
            is_palindrome_list = False
            break
        first_half = first_half.next
        second_half = second_half.next

    # Restore (optional but good practice)
    slow.next = reverse_list_iterative(slow.next)

    return is_palindrome_list
```

## Comparison of Approaches

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Iterative | O(n) | O(1) | Memory constrained |
| Recursive | O(n) | O(n) | Cleaner code, small lists |

## Common Mistakes

### 1. Losing the Reference to Next

```python
# Wrong: Lose access to rest of list
current.next = prev
current = current.next  # This is now prev!

# Correct: Save next first
next_node = current.next
current.next = prev
current = next_node
```

### 2. Forgetting to Update All Pointers

```python
# Incomplete: Head still points to old location
def reverse(head):
    # ... reverse logic ...
    return prev  # prev is new head

# Usage: Must update the head reference
head = reverse(head)
```

### 3. Not Handling Edge Cases

```python
# Missing edge cases
def reverse(head):
    # What if head is None?
    # What if only one node?

# Correct
def reverse(head):
    if head is None or head.next is None:
        return head
    # ... rest of logic
```

## Practice Problems

1. **Reverse Linked List**: Reverse entire list
2. **Reverse Linked List II**: Reverse between positions m and n
3. **Reverse Nodes in k-Group**: Reverse every k nodes
4. **Palindrome Linked List**: Check if list is palindrome
5. **Swap Nodes in Pairs**: Swap every two adjacent nodes
6. **Reorder List**: Reorder to L0 -> Ln -> L1 -> Ln-1 -> ...

## Summary

Linked list reversal is a fundamental technique:

| Operation | Key Insight |
|-----------|-------------|
| Full reversal | Track prev, curr, next |
| Partial reversal | Use dummy node, track boundaries |
| K-group reversal | Check length first, reverse in batches |
| Palindrome check | Reverse half, then compare |

Key techniques:
- Always save the next pointer before modifying links
- Use dummy nodes to simplify edge cases
- Recursive approach uses O(n) space due to call stack
- Iterative approach is more space-efficient

This concludes the Linked Lists module. These techniques are foundational for understanding more complex data structures.
