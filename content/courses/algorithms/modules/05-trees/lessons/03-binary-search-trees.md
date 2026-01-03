---
title: Binary Search Trees
order: 3
estimatedMinutes: 25
---

# Binary Search Trees

## Introduction

A Binary Search Tree (BST) is a binary tree with an ordering property: for every node, all values in its left subtree are smaller, and all values in its right subtree are larger. This property enables efficient searching, insertion, and deletion with average O(log n) time complexity.

## The BST Property

```
Valid BST:
         8
        / \
       3   10
      / \    \
     1   6    14
        / \   /
       4   7 13

For node 8: left subtree (1,3,4,6,7) < 8 < right subtree (10,13,14)
For node 3: left subtree (1) < 3 < right subtree (4,6,7)
For node 6: left subtree (4) < 6 < right subtree (7)

Invalid BST:
         5
        / \
       3   7
      / \
     2   6    <- 6 > 5, but 6 is in left subtree of 5!
```

## Searching in a BST

Use the BST property to narrow search by half at each step.

```
Search for 6 in:
         8
        / \
       3   10
      / \    \
     1   6    14

Step 1: 6 < 8, go left
Step 2: 6 > 3, go right
Step 3: 6 == 6, found!
```

### Implementation

```python
def search(root, val):
    """
    Search for value in BST.

    Time: O(h), Space: O(1) iterative, O(h) recursive
    """
    # Iterative approach
    current = root
    while current:
        if val == current.val:
            return current
        elif val < current.val:
            current = current.left
        else:
            current = current.right
    return None


def search_recursive(root, val):
    """Recursive search in BST."""
    if root is None or root.val == val:
        return root

    if val < root.val:
        return search_recursive(root.left, val)
    else:
        return search_recursive(root.right, val)
```

## Finding Minimum and Maximum

In a BST, the minimum is the leftmost node, maximum is the rightmost.

```python
def find_min(root):
    """Find minimum value in BST."""
    if root is None:
        return None

    current = root
    while current.left:
        current = current.left
    return current


def find_max(root):
    """Find maximum value in BST."""
    if root is None:
        return None

    current = root
    while current.right:
        current = current.right
    return current
```

## In-Order Traversal Gives Sorted Order

A key property of BSTs: in-order traversal visits nodes in sorted order.

```
BST:
         5
        / \
       3   7
      / \ / \
     2  4 6  8

In-order: 2, 3, 4, 5, 6, 7, 8 (sorted!)
```

## Validating a BST

Check if a binary tree satisfies the BST property.

### Common Mistake: Only Checking Parent-Child

```python
# WRONG: Only checks immediate parent-child relationship
def is_bst_wrong(root):
    if root is None:
        return True
    if root.left and root.left.val >= root.val:
        return False
    if root.right and root.right.val <= root.val:
        return False
    return is_bst_wrong(root.left) and is_bst_wrong(root.right)

# This incorrectly validates:
#        5
#       / \
#      3   7
#       \
#        8  <- 8 > 5, but in left subtree!
```

### Correct Approach: Track Valid Range

```python
def is_valid_bst(root):
    """
    Validate BST using range constraints.

    Time: O(n), Space: O(h)
    """
    def validate(node, min_val, max_val):
        if node is None:
            return True

        if node.val <= min_val or node.val >= max_val:
            return False

        return (validate(node.left, min_val, node.val) and
                validate(node.right, node.val, max_val))

    return validate(root, float('-inf'), float('inf'))
```

### Alternative: In-Order Traversal Check

```python
def is_valid_bst_inorder(root):
    """
    Validate BST using in-order traversal.
    In-order should produce sorted sequence.

    Time: O(n), Space: O(h)
    """
    prev = [float('-inf')]  # Use list to allow modification in nested function

    def inorder(node):
        if node is None:
            return True

        # Check left subtree
        if not inorder(node.left):
            return False

        # Check current node
        if node.val <= prev[0]:
            return False
        prev[0] = node.val

        # Check right subtree
        return inorder(node.right)

    return inorder(root)
```

## Successor and Predecessor

### In-Order Successor

The next node in in-order traversal (smallest value greater than current).

```
         20
        /  \
       8    22
      / \
     4   12
        /  \
       10  14

Successor of 8: 10 (go right, then leftmost)
Successor of 14: 20 (go up until we come from left)
Successor of 22: None (rightmost node)
```

```python
def inorder_successor(root, node):
    """
    Find in-order successor of a node.

    Time: O(h), Space: O(1)
    """
    successor = None

    # Case 1: Node has right subtree
    if node.right:
        current = node.right
        while current.left:
            current = current.left
        return current

    # Case 2: Find ancestor where node is in left subtree
    current = root
    while current:
        if node.val < current.val:
            successor = current
            current = current.left
        elif node.val > current.val:
            current = current.right
        else:
            break

    return successor
```

### In-Order Predecessor

The previous node in in-order traversal (largest value smaller than current).

```python
def inorder_predecessor(root, node):
    """
    Find in-order predecessor of a node.

    Time: O(h), Space: O(1)
    """
    predecessor = None

    # Case 1: Node has left subtree
    if node.left:
        current = node.left
        while current.right:
            current = current.right
        return current

    # Case 2: Find ancestor where node is in right subtree
    current = root
    while current:
        if node.val > current.val:
            predecessor = current
            current = current.right
        elif node.val < current.val:
            current = current.left
        else:
            break

    return predecessor
```

## Lowest Common Ancestor in BST

Find the lowest node that is an ancestor of both given nodes.

```
         6
        / \
       2   8
      / \ / \
     0  4 7  9
       / \
      3   5

LCA(2, 8) = 6
LCA(2, 4) = 2
LCA(3, 5) = 4
```

```python
def lowest_common_ancestor(root, p, q):
    """
    Find LCA in BST.

    Key insight: LCA is where p and q diverge
    (one goes left, one goes right).

    Time: O(h), Space: O(1)
    """
    current = root

    while current:
        if p.val < current.val and q.val < current.val:
            # Both in left subtree
            current = current.left
        elif p.val > current.val and q.val > current.val:
            # Both in right subtree
            current = current.right
        else:
            # Split point (or one equals current)
            return current

    return None
```

## Kth Smallest Element

Find the kth smallest element in BST.

```python
def kth_smallest(root, k):
    """
    Find kth smallest element.

    Time: O(h + k), Space: O(h)
    """
    stack = []
    current = root

    while current or stack:
        while current:
            stack.append(current)
            current = current.left

        current = stack.pop()
        k -= 1
        if k == 0:
            return current.val

        current = current.right

    return None
```

## Range Queries

Find all values in a given range [low, high].

```python
def range_query(root, low, high):
    """
    Find all values in range [low, high].

    Time: O(h + m) where m is count of values in range
    Space: O(h + m)
    """
    result = []

    def inorder(node):
        if node is None:
            return

        # Skip left if all values would be too small
        if node.val > low:
            inorder(node.left)

        # Add if in range
        if low <= node.val <= high:
            result.append(node.val)

        # Skip right if all values would be too large
        if node.val < high:
            inorder(node.right)

    inorder(root)
    return result
```

## Building a Balanced BST from Sorted Array

```python
def sorted_array_to_bst(nums):
    """
    Create balanced BST from sorted array.

    Time: O(n), Space: O(log n) for recursion
    """
    def build(left, right):
        if left > right:
            return None

        mid = (left + right) // 2
        node = TreeNode(nums[mid])
        node.left = build(left, mid - 1)
        node.right = build(mid + 1, right)
        return node

    return build(0, len(nums) - 1)
```

Visual example:
```
Input: [1, 2, 3, 4, 5, 6, 7]

         4
        / \
       2   6
      / \ / \
     1  3 5  7
```

## BST vs Balanced BST

| Property | BST | Balanced BST (AVL, Red-Black) |
|----------|-----|------------------------------|
| Height | O(n) worst case | O(log n) guaranteed |
| Search | O(n) worst case | O(log n) |
| Insert | O(n) worst case | O(log n) |
| Delete | O(n) worst case | O(log n) |

```
Degenerate BST (insert 1,2,3,4,5 in order):
1
 \
  2
   \
    3
     \
      4
       \
        5

Height = n-1, operations become O(n)
```

## Practice Problems

1. **Validate Binary Search Tree**: Check if tree is valid BST
2. **Kth Smallest Element in BST**: Find kth smallest value
3. **Lowest Common Ancestor of BST**: Find LCA of two nodes
4. **Convert Sorted Array to BST**: Create balanced BST
5. **Two Sum IV - Input is a BST**: Find pair with target sum

## Summary

Binary Search Trees provide efficient ordered data storage:

| Operation | Average | Worst (unbalanced) |
|-----------|---------|-------------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Min/Max | O(log n) | O(n) |

Key properties:
- Left subtree < root < right subtree
- In-order traversal gives sorted sequence
- Balance affects performance significantly

In the next lesson, we will explore BST insertion and deletion operations.
