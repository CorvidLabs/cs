---
title: BST Operations
order: 4
estimatedMinutes: 30
---

# BST Operations: Insertion and Deletion

## Introduction

While searching in a BST is straightforward, insertion and deletion require careful handling to maintain the BST property. This lesson covers these operations in detail, along with more advanced BST applications.

## Insertion

To insert a value, traverse the tree like a search, then add the new node at the appropriate leaf position.

### Visual Walkthrough

```
Insert 5 into:
         8
        / \
       3   10
      / \
     1   6

Step 1: 5 < 8, go left
Step 2: 5 > 3, go right
Step 3: 5 < 6, go left (6.left is null)
Step 4: Insert 5 as left child of 6

Result:
         8
        / \
       3   10
      / \
     1   6
        /
       5
```

### Implementation

```python
def insert(root, val):
    """
    Insert value into BST.

    Time: O(h), Space: O(h) recursive, O(1) iterative
    """
    if root is None:
        return TreeNode(val)

    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)

    return root


def insert_iterative(root, val):
    """Iterative insertion."""
    new_node = TreeNode(val)

    if root is None:
        return new_node

    current = root
    while True:
        if val < current.val:
            if current.left is None:
                current.left = new_node
                break
            current = current.left
        else:
            if current.right is None:
                current.right = new_node
                break
            current = current.right

    return root
```

## Deletion

Deletion is more complex because we must maintain the BST property. There are three cases:

### Case 1: Deleting a Leaf Node

Simply remove the node.

```
Delete 4:
    5              5
   / \            / \
  3   7    ->    3   7
 / \
2   4

Just remove the leaf.
```

### Case 2: Deleting a Node with One Child

Replace the node with its child.

```
Delete 3:
    5              5
   / \            / \
  3   7    ->    2   7
 /
2

Replace 3 with its only child 2.
```

### Case 3: Deleting a Node with Two Children

Replace with in-order successor (or predecessor) and delete that node.

```
Delete 5:
    5                   6
   / \                 / \
  3   7      ->       3   7
     / \                   \
    6   8                   8

Find successor (6), replace 5 with 6, delete original 6.
```

### Implementation

```python
def delete_node(root, key):
    """
    Delete node with given key from BST.

    Time: O(h), Space: O(h)
    """
    if root is None:
        return None

    # Find the node to delete
    if key < root.val:
        root.left = delete_node(root.left, key)
    elif key > root.val:
        root.right = delete_node(root.right, key)
    else:
        # Found the node to delete

        # Case 1 & 2: Node with 0 or 1 child
        if root.left is None:
            return root.right
        if root.right is None:
            return root.left

        # Case 3: Node with 2 children
        # Find in-order successor (smallest in right subtree)
        successor = root.right
        while successor.left:
            successor = successor.left

        # Replace value with successor's value
        root.val = successor.val

        # Delete the successor
        root.right = delete_node(root.right, successor.val)

    return root
```

### Alternative: Use Predecessor

```python
def delete_with_predecessor(root, key):
    """Delete using in-order predecessor instead."""
    if root is None:
        return None

    if key < root.val:
        root.left = delete_with_predecessor(root.left, key)
    elif key > root.val:
        root.right = delete_with_predecessor(root.right, key)
    else:
        if root.left is None:
            return root.right
        if root.right is None:
            return root.left

        # Find predecessor (largest in left subtree)
        predecessor = root.left
        while predecessor.right:
            predecessor = predecessor.right

        root.val = predecessor.val
        root.left = delete_with_predecessor(root.left, predecessor.val)

    return root
```

## Building BST from Sequences

### From Preorder Traversal

```python
def bst_from_preorder(preorder):
    """
    Construct BST from preorder traversal.

    Time: O(n), Space: O(n)
    """
    def build(min_val, max_val):
        nonlocal index
        if index >= len(preorder):
            return None

        val = preorder[index]
        if val < min_val or val > max_val:
            return None

        index += 1
        node = TreeNode(val)
        node.left = build(min_val, val)
        node.right = build(val, max_val)
        return node

    index = 0
    return build(float('-inf'), float('inf'))
```

### From Inorder and Preorder

```python
def build_tree(preorder, inorder):
    """
    Construct tree from preorder and inorder traversals.

    Time: O(n), Space: O(n)
    """
    if not preorder or not inorder:
        return None

    # Root is first element of preorder
    root = TreeNode(preorder[0])

    # Find root in inorder to split left and right subtrees
    mid = inorder.index(preorder[0])

    # Build subtrees
    root.left = build_tree(preorder[1:mid+1], inorder[:mid])
    root.right = build_tree(preorder[mid+1:], inorder[mid+1:])

    return root
```

## Recover BST

Two nodes of a BST are swapped by mistake. Recover the tree.

```
Swapped BST:
    3              1
   / \            / \
  1   4    ->    3   4
     /              /
    2              2

Original: 1,3,2,4 (in-order) -> wrong!
After fix: 1,2,3,4 (in-order) -> correct!
```

```python
def recover_tree(root):
    """
    Recover BST where two nodes are swapped.

    Time: O(n), Space: O(h)
    """
    first = second = prev = None

    def inorder(node):
        nonlocal first, second, prev

        if node is None:
            return

        inorder(node.left)

        # Found violation
        if prev and prev.val > node.val:
            if first is None:
                first = prev
            second = node

        prev = node
        inorder(node.right)

    inorder(root)

    # Swap the values back
    first.val, second.val = second.val, first.val
```

## Convert BST to Sorted Doubly Linked List

```
BST:           Doubly Linked List:
    4          1 <-> 2 <-> 3 <-> 4 <-> 5
   / \
  2   5        (circular: 5.right = 1, 1.left = 5)
 / \
1   3
```

```python
def tree_to_doubly_list(root):
    """
    Convert BST to sorted circular doubly linked list.

    Time: O(n), Space: O(h)
    """
    if root is None:
        return None

    first = None
    last = None

    def inorder(node):
        nonlocal first, last

        if node is None:
            return

        inorder(node.left)

        # Process current node
        if last:
            last.right = node
            node.left = last
        else:
            first = node

        last = node

        inorder(node.right)

    inorder(root)

    # Make circular
    first.left = last
    last.right = first

    return first
```

## Serialize and Deserialize BST

```python
class Codec:
    """Serialize and deserialize BST."""

    def serialize(self, root):
        """Encode tree to string (preorder)."""
        vals = []

        def preorder(node):
            if node:
                vals.append(str(node.val))
                preorder(node.left)
                preorder(node.right)

        preorder(root)
        return ' '.join(vals)

    def deserialize(self, data):
        """Decode string to tree."""
        if not data:
            return None

        vals = [int(x) for x in data.split()]
        index = [0]

        def build(min_val, max_val):
            if index[0] >= len(vals):
                return None

            val = vals[index[0]]
            if val < min_val or val > max_val:
                return None

            index[0] += 1
            node = TreeNode(val)
            node.left = build(min_val, val)
            node.right = build(val, max_val)
            return node

        return build(float('-inf'), float('inf'))
```

## Floor and Ceiling

### Floor: Largest value <= key

```python
def floor(root, key):
    """
    Find largest value less than or equal to key.

    Time: O(h), Space: O(1)
    """
    result = None

    while root:
        if root.val == key:
            return root.val
        elif root.val < key:
            result = root.val
            root = root.right
        else:
            root = root.left

    return result
```

### Ceiling: Smallest value >= key

```python
def ceiling(root, key):
    """
    Find smallest value greater than or equal to key.

    Time: O(h), Space: O(1)
    """
    result = None

    while root:
        if root.val == key:
            return root.val
        elif root.val > key:
            result = root.val
            root = root.left
        else:
            root = root.right

    return result
```

## BST Iterator

Implement an iterator that returns values in sorted order.

```python
class BSTIterator:
    """
    Iterator for BST in-order traversal.

    next() and hasNext() are O(1) average.
    Space: O(h)
    """

    def __init__(self, root):
        self.stack = []
        self._push_left(root)

    def _push_left(self, node):
        """Push all left children onto stack."""
        while node:
            self.stack.append(node)
            node = node.left

    def next(self):
        """Return next smallest value."""
        node = self.stack.pop()
        if node.right:
            self._push_left(node.right)
        return node.val

    def has_next(self):
        """Return whether there are more values."""
        return len(self.stack) > 0
```

## Trim BST

Remove all nodes outside range [low, high].

```python
def trim_bst(root, low, high):
    """
    Trim BST to only contain values in [low, high].

    Time: O(n), Space: O(h)
    """
    if root is None:
        return None

    if root.val < low:
        # Root and left subtree are too small
        return trim_bst(root.right, low, high)

    if root.val > high:
        # Root and right subtree are too large
        return trim_bst(root.left, low, high)

    # Root is in range, trim subtrees
    root.left = trim_bst(root.left, low, high)
    root.right = trim_bst(root.right, low, high)

    return root
```

## Practice Problems

1. **Delete Node in BST**: Implement deletion
2. **Insert into BST**: Implement insertion
3. **Convert BST to Greater Tree**: Replace each value with sum of greater values
4. **Balance a BST**: Convert BST to balanced BST
5. **BST Iterator**: Implement iterator class

## Summary

BST modification operations:

| Operation | Time | Key Points |
|-----------|------|------------|
| Insert | O(h) | Find position, add as leaf |
| Delete Leaf | O(h) | Simply remove |
| Delete with 1 child | O(h) | Replace with child |
| Delete with 2 children | O(h) | Use successor/predecessor |

Key techniques:
- Maintain BST property during modifications
- Use successor or predecessor for deletion with two children
- Track bounds for range-based operations
- In-order traversal reveals violations

This concludes the Trees module. The BST concepts introduced here form the foundation for more advanced tree structures like AVL trees, Red-Black trees, and B-trees.
