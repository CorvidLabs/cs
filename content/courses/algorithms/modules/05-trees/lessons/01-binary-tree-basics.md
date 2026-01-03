---
title: Binary Tree Basics
order: 1
estimatedMinutes: 20
---

# Binary Tree Basics

Trees are hierarchical data structures that organize elements in a parent-child relationship. Unlike linear structures like arrays and linked lists, trees allow for efficient operations on hierarchical data and enable fast searching when properly organized.

## What is a Tree?

A tree consists of nodes connected by edges, with these properties:

- One node is designated as the **root** (the topmost node)
- Every node except the root has exactly one **parent**
- Each node can have zero or more **children**
- Nodes with no children are called **leaves**

```
        A           <- Root
       / \
      B   C         <- Internal nodes
     /|   |\
    D E   F G       <- Leaves
```

## Binary Trees

A **binary tree** is a special type of tree where each node has at most two children, referred to as the **left child** and **right child**.

```
        10
       /  \
      5    15
     / \     \
    3   7    20
```

### Binary Tree Node Structure

In Python, we represent a binary tree node with a class:

```python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
```

### Building a Simple Tree

```python
# Create nodes
root = TreeNode(10)
root.left = TreeNode(5)
root.right = TreeNode(15)
root.left.left = TreeNode(3)
root.left.right = TreeNode(7)
root.right.right = TreeNode(20)
```

## Tree Terminology

Understanding tree vocabulary is essential for discussing algorithms:

| Term | Definition |
|------|------------|
| **Root** | The topmost node (no parent) |
| **Parent** | A node that has children |
| **Child** | A node that has a parent |
| **Sibling** | Nodes that share the same parent |
| **Leaf** | A node with no children |
| **Internal node** | A node with at least one child |
| **Edge** | Connection between parent and child |
| **Path** | Sequence of nodes connected by edges |
| **Depth** | Number of edges from root to a node |
| **Height** | Number of edges on longest path to a leaf |
| **Subtree** | A node and all its descendants |

### Visual Example

```
           1          <- Root, depth 0, height 3
          / \
         2   3        <- Depth 1
        / \   \
       4   5   6      <- Depth 2
      /
     7                <- Leaf, depth 3
```

- Height of tree: 3 (longest path from root to leaf)
- Height of node 2: 2 (path to node 7)
- Height of node 6: 0 (it's a leaf)

## Types of Binary Trees

### Full Binary Tree

Every node has either 0 or 2 children (no nodes with only 1 child).

```
       1
      / \
     2   3
    / \
   4   5
```

### Complete Binary Tree

All levels are fully filled except possibly the last, which is filled from left to right.

```
       1
      / \
     2   3
    / \  /
   4  5 6
```

### Perfect Binary Tree

All internal nodes have two children, and all leaves are at the same level.

```
       1
      / \
     2   3
    /|   |\
   4 5   6 7
```

### Balanced Binary Tree

The height difference between left and right subtrees of any node is at most 1.

```
       1           1
      / \         / \
     2   3       2   3      <- Both balanced
    /           / \
   4           4   5
```

## Properties of Binary Trees

### Maximum Nodes

For a binary tree of height h:
- Maximum nodes at level i: 2^i
- Maximum total nodes: 2^(h+1) - 1

```python
def max_nodes_at_height(h):
    return 2 ** (h + 1) - 1

# Height 0: 1 node (just root)
# Height 1: 3 nodes
# Height 2: 7 nodes
# Height 3: 15 nodes
```

### Minimum Height

For n nodes, the minimum possible height is floor(log2(n)).

```python
import math

def min_height(n):
    return math.floor(math.log2(n)) if n > 0 else 0
```

## Basic Tree Operations

### Counting Nodes

```python
def count_nodes(root):
    if root is None:
        return 0
    return 1 + count_nodes(root.left) + count_nodes(root.right)
```

### Finding Maximum Value

```python
def find_max(root):
    if root is None:
        return float('-inf')

    left_max = find_max(root.left)
    right_max = find_max(root.right)

    return max(root.value, left_max, right_max)
```

### Calculating Height

```python
def tree_height(root):
    if root is None:
        return -1  # Empty tree has height -1

    left_height = tree_height(root.left)
    right_height = tree_height(root.right)

    return 1 + max(left_height, right_height)
```

### Checking if Leaf

```python
def is_leaf(node):
    return node is not None and node.left is None and node.right is None
```

## Why Trees Matter

Trees are fundamental because they:

1. **Model hierarchical relationships**: File systems, organization charts, DOM trees
2. **Enable efficient searching**: Binary search trees offer O(log n) lookups
3. **Support efficient sorting**: Heap sort uses a tree structure
4. **Power expression evaluation**: Compilers use trees to parse expressions
5. **Underlie databases**: B-trees enable fast disk-based storage

## Complexity Analysis

| Operation | Time Complexity |
|-----------|-----------------|
| Search (unbalanced) | O(n) |
| Search (balanced) | O(log n) |
| Insert (unbalanced) | O(n) |
| Insert (balanced) | O(log n) |
| Count nodes | O(n) |
| Find height | O(n) |

Space complexity for recursive operations is O(h) where h is the height, due to the call stack.

## Summary

Binary trees are hierarchical structures where each node has at most two children. Key concepts include:

- Nodes, edges, root, leaves, and internal nodes
- Depth (distance from root) and height (longest path to leaf)
- Types: full, complete, perfect, and balanced trees
- Basic operations: counting, finding max, calculating height

In the next lesson, we will explore tree traversals: systematic ways to visit every node in a tree.
