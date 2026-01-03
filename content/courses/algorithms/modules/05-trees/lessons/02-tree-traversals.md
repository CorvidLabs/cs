---
title: Tree Traversals
order: 2
estimatedMinutes: 25
---

# Tree Traversals

Tree traversal is the process of visiting every node in a tree exactly once. Unlike linear structures where traversal is straightforward, trees offer multiple ways to visit nodes. Each traversal order has specific use cases and applications.

## Types of Traversals

There are two main categories of tree traversals:

1. **Depth-First Traversals**: Go deep before going wide
   - In-order (Left, Root, Right)
   - Pre-order (Root, Left, Right)
   - Post-order (Left, Right, Root)

2. **Breadth-First Traversal**: Go level by level
   - Level-order traversal

## Example Tree

We will use this tree throughout the lesson:

```
        4
       / \
      2   6
     / \ / \
    1  3 5  7
```

## In-Order Traversal (LNR)

Visit the left subtree, then the node, then the right subtree.

**Order: Left -> Node -> Right**

```python
def inorder(root):
    if root is None:
        return []

    result = []
    result.extend(inorder(root.left))
    result.append(root.value)
    result.extend(inorder(root.right))
    return result

# For our tree: [1, 2, 3, 4, 5, 6, 7]
```

### In-Order Visualization

```
        4
       / \
      2   6
     / \ / \
    1  3 5  7

Step by step:
1. Go left from 4 -> 2
2. Go left from 2 -> 1
3. Go left from 1 -> None, visit 1
4. Back to 2, visit 2
5. Go right from 2 -> 3
6. Go left from 3 -> None, visit 3
7. Back to 4, visit 4
8. Go right from 4 -> 6
9. Go left from 6 -> 5
10. Go left from 5 -> None, visit 5
11. Back to 6, visit 6
12. Go right from 6 -> 7
13. Go left from 7 -> None, visit 7

Result: 1, 2, 3, 4, 5, 6, 7
```

### Use Cases

- **Binary Search Trees**: In-order traversal visits nodes in sorted order
- **Expression trees**: Produces infix notation (a + b)

## Pre-Order Traversal (NLR)

Visit the node, then the left subtree, then the right subtree.

**Order: Node -> Left -> Right**

```python
def preorder(root):
    if root is None:
        return []

    result = []
    result.append(root.value)
    result.extend(preorder(root.left))
    result.extend(preorder(root.right))
    return result

# For our tree: [4, 2, 1, 3, 6, 5, 7]
```

### Pre-Order Visualization

```
        4
       / \
      2   6
     / \ / \
    1  3 5  7

Step by step:
1. Visit 4
2. Go left, visit 2
3. Go left, visit 1
4. Back to 2, go right, visit 3
5. Back to 4, go right, visit 6
6. Go left, visit 5
7. Back to 6, go right, visit 7

Result: 4, 2, 1, 3, 6, 5, 7
```

### Use Cases

- **Copying a tree**: Pre-order creates nodes before children
- **Prefix expressions**: Produces prefix notation (+ a b)
- **Serialization**: Saving tree structure to storage

## Post-Order Traversal (LRN)

Visit the left subtree, then the right subtree, then the node.

**Order: Left -> Right -> Node**

```python
def postorder(root):
    if root is None:
        return []

    result = []
    result.extend(postorder(root.left))
    result.extend(postorder(root.right))
    result.append(root.value)
    return result

# For our tree: [1, 3, 2, 5, 7, 6, 4]
```

### Post-Order Visualization

```
        4
       / \
      2   6
     / \ / \
    1  3 5  7

Step by step:
1. Go left from 4 -> 2
2. Go left from 2 -> 1
3. Go left from 1 -> None
4. Go right from 1 -> None
5. Visit 1
6. Back to 2, go right -> 3
7. Visit 3
8. Visit 2
9. Back to 4, go right -> 6
10. Go left from 6 -> 5
11. Visit 5
12. Go right from 6 -> 7
13. Visit 7
14. Visit 6
15. Visit 4

Result: 1, 3, 2, 5, 7, 6, 4
```

### Use Cases

- **Deleting a tree**: Delete children before parent
- **Evaluating expressions**: Operands before operator
- **Postfix expressions**: Produces postfix notation (a b +)
- **Calculating folder sizes**: Need child sizes first

## Level-Order Traversal (BFS)

Visit nodes level by level, from left to right.

```python
from collections import deque

def level_order(root):
    if root is None:
        return []

    result = []
    queue = deque([root])

    while queue:
        node = queue.popleft()
        result.append(node.value)

        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)

    return result

# For our tree: [4, 2, 6, 1, 3, 5, 7]
```

### Level-Order Visualization

```
        4         <- Level 0
       / \
      2   6       <- Level 1
     / \ / \
    1  3 5  7     <- Level 2

Process:
Queue: [4]         -> Visit 4, add 2, 6
Queue: [2, 6]      -> Visit 2, add 1, 3
Queue: [6, 1, 3]   -> Visit 6, add 5, 7
Queue: [1, 3, 5, 7] -> Visit 1, 3, 5, 7

Result: 4, 2, 6, 1, 3, 5, 7
```

### Use Cases

- **Shortest path in unweighted trees**
- **Level-by-level processing**
- **Finding minimum depth**
- **Serialization by levels**

## Iterative Implementations

Recursive solutions use the call stack. For very deep trees, we might need iterative versions with explicit stacks.

### Iterative In-Order

```python
def inorder_iterative(root):
    result = []
    stack = []
    current = root

    while current or stack:
        # Go as far left as possible
        while current:
            stack.append(current)
            current = current.left

        # Process node
        current = stack.pop()
        result.append(current.value)

        # Move to right subtree
        current = current.right

    return result
```

### Iterative Pre-Order

```python
def preorder_iterative(root):
    if root is None:
        return []

    result = []
    stack = [root]

    while stack:
        node = stack.pop()
        result.append(node.value)

        # Push right first so left is processed first
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)

    return result
```

### Iterative Post-Order

```python
def postorder_iterative(root):
    if root is None:
        return []

    result = []
    stack = [root]

    while stack:
        node = stack.pop()
        result.append(node.value)

        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)

    # Reverse to get correct post-order
    return result[::-1]
```

## Comparing Traversals

| Traversal | Order | Result for Example | Primary Use |
|-----------|-------|-------------------|-------------|
| In-order | L, N, R | 1,2,3,4,5,6,7 | Sorted order in BST |
| Pre-order | N, L, R | 4,2,1,3,6,5,7 | Tree copying |
| Post-order | L, R, N | 1,3,2,5,7,6,4 | Tree deletion |
| Level-order | Level by level | 4,2,6,1,3,5,7 | Level processing |

## Morris Traversal (Advanced)

Morris traversal achieves O(1) space complexity by temporarily modifying tree structure:

```python
def morris_inorder(root):
    result = []
    current = root

    while current:
        if current.left is None:
            result.append(current.value)
            current = current.right
        else:
            # Find inorder predecessor
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right

            if predecessor.right is None:
                # Make current the right child of predecessor
                predecessor.right = current
                current = current.left
            else:
                # Revert the changes
                predecessor.right = None
                result.append(current.value)
                current = current.right

    return result
```

## Complexity Analysis

| Traversal | Time | Space (Recursive) | Space (Iterative) |
|-----------|------|-------------------|-------------------|
| In-order | O(n) | O(h) | O(h) |
| Pre-order | O(n) | O(h) | O(h) |
| Post-order | O(n) | O(h) | O(h) |
| Level-order | O(n) | - | O(w) |
| Morris | O(n) | - | O(1) |

Where n = number of nodes, h = height, w = maximum width.

## Summary

Tree traversals are fundamental operations with different applications:

- **In-order**: Visits nodes in sorted order for BSTs
- **Pre-order**: Useful for copying or serializing trees
- **Post-order**: Required when children must be processed before parents
- **Level-order**: Processes nodes level by level using a queue

Understanding when to use each traversal is essential for solving tree problems efficiently. In the next lesson, we will explore Binary Search Trees, which leverage the sorted property of in-order traversal.
