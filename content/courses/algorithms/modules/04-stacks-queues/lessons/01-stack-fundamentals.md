# Stack Fundamentals

## Introduction

A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. Think of a stack of plates: you add plates to the top and remove plates from the top. The last plate placed is the first one removed.

Stacks are fundamental to computing, appearing in function call management, expression evaluation, undo mechanisms, and many algorithms.

## The LIFO Principle

```
Stack Operations:

Push 1:  Push 2:  Push 3:  Pop:     Pop:
+---+    +---+    +---+    +---+    +---+
|   |    |   |    | 3 |    |   |    |   |
+---+    +---+    +---+    +---+    +---+
|   |    | 2 |    | 2 |    | 2 |    |   |
+---+    +---+    +---+    +---+    +---+
| 1 |    | 1 |    | 1 |    | 1 |    | 1 |
+---+    +---+    +---+    +---+    +---+

Last pushed (3) is first popped.
```

## Core Operations

| Operation | Description | Time Complexity |
|-----------|-------------|-----------------|
| push(x) | Add element x to top | O(1) |
| pop() | Remove and return top element | O(1) |
| peek()/top() | Return top element without removing | O(1) |
| isEmpty() | Check if stack is empty | O(1) |
| size() | Return number of elements | O(1) |

## Implementation Using a List

Python lists provide efficient stack operations with `append()` and `pop()`.

```python
class Stack:
    """Stack implementation using a list."""

    def __init__(self):
        self._items = []

    def push(self, item):
        """Add item to the top of the stack.

        Time: O(1) amortized
        """
        self._items.append(item)

    def pop(self):
        """Remove and return the top item.

        Time: O(1)
        Raises: IndexError if stack is empty
        """
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._items.pop()

    def peek(self):
        """Return the top item without removing it.

        Time: O(1)
        Raises: IndexError if stack is empty
        """
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._items[-1]

    def is_empty(self):
        """Check if the stack is empty.

        Time: O(1)
        """
        return len(self._items) == 0

    def size(self):
        """Return the number of items in the stack.

        Time: O(1)
        """
        return len(self._items)

    def __str__(self):
        return f"Stack({self._items})"
```

## Implementation Using a Linked List

For guaranteed O(1) operations without amortization:

```python
class StackNode:
    def __init__(self, val):
        self.val = val
        self.next = None


class LinkedStack:
    """Stack implementation using a linked list."""

    def __init__(self):
        self._top = None
        self._size = 0

    def push(self, item):
        """Add item to the top.

        Time: O(1)
        """
        new_node = StackNode(item)
        new_node.next = self._top
        self._top = new_node
        self._size += 1

    def pop(self):
        """Remove and return the top item.

        Time: O(1)
        """
        if self.is_empty():
            raise IndexError("Stack is empty")

        val = self._top.val
        self._top = self._top.next
        self._size -= 1
        return val

    def peek(self):
        """Return the top item without removing.

        Time: O(1)
        """
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._top.val

    def is_empty(self):
        return self._top is None

    def size(self):
        return self._size
```

## Comparison of Implementations

| Aspect | List-based | Linked List-based |
|--------|------------|-------------------|
| Push | O(1) amortized* | O(1) |
| Pop | O(1) | O(1) |
| Memory | Contiguous, may waste space | Extra pointer per element |
| Cache | Better cache locality | Worse cache locality |

*List may occasionally resize, causing O(n) operation

## The Call Stack

Every running program uses a stack to manage function calls.

```
def main():
    a = 1
    result = foo(a)
    print(result)

def foo(x):
    b = x + 1
    return bar(b)

def bar(y):
    return y * 2

main()
```

```
Call Stack Evolution:

Call main():    Call foo(1):    Call bar(2):    Return 4:       Return 4:
+-------+       +-------+       +-------+       +-------+       +-------+
|       |       |       |       | bar   |       |       |       |       |
+-------+       +-------+       | y=2   |       +-------+       +-------+
|       |       | foo   |       +-------+       | foo   |       |       |
+-------+       | x=1   |       | foo   |       | x=1   |       +-------+
| main  |       +-------+       | x=1   |       +-------+       | main  |
| a=1   |       | main  |       +-------+       | main  |       | a=1   |
+-------+       | a=1   |       | main  |       | a=1   |       | result=4
                +-------+       | a=1   |       +-------+       +-------+
                                +-------+
```

## Stack Overflow

When the call stack exceeds its maximum size, a stack overflow occurs:

```python
def infinite_recursion():
    return infinite_recursion()  # Never returns!

# This will cause: RecursionError: maximum recursion depth exceeded
infinite_recursion()
```

## Matching Parentheses

A classic stack problem: check if parentheses are balanced.

```
Valid:   "(())"  "()[]{}"  "{[()]}"
Invalid: "(()"   "([)]"    "}"
```

### Visual Walkthrough

```
Input: "{[()]}"

Char '{': Push '{'         Stack: ['{']
Char '[': Push '['         Stack: ['{', '[']
Char '(': Push '('         Stack: ['{', '[', '(']
Char ')': Pop, match '('   Stack: ['{', '[']
Char ']': Pop, match '['   Stack: ['{']
Char '}': Pop, match '{'   Stack: []

Stack empty at end -> Valid!
```

### Python Implementation

```python
def is_valid_parentheses(s):
    """
    Check if parentheses are balanced.

    Time: O(n), Space: O(n)
    """
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for char in s:
        if char in '([{':
            stack.append(char)
        elif char in ')]}':
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()

    return len(stack) == 0
```

## Evaluating Postfix Expressions

Postfix (Reverse Polish Notation) places operators after operands:

```
Infix:   3 + 4 * 2
Postfix: 3 4 2 * +

Evaluation:
Token '3': Push 3           Stack: [3]
Token '4': Push 4           Stack: [3, 4]
Token '2': Push 2           Stack: [3, 4, 2]
Token '*': Pop 2, 4         Stack: [3, 8]
           Push 4*2=8
Token '+': Pop 8, 3         Stack: [11]
           Push 3+8=11

Result: 11
```

```python
def evaluate_postfix(tokens):
    """
    Evaluate a postfix expression.

    Args:
        tokens: List of numbers and operators (+, -, *, /)

    Returns:
        Result of the expression

    Time: O(n), Space: O(n)
    """
    stack = []
    operators = {
        '+': lambda a, b: a + b,
        '-': lambda a, b: a - b,
        '*': lambda a, b: a * b,
        '/': lambda a, b: int(a / b)  # Truncate toward zero
    }

    for token in tokens:
        if token in operators:
            b = stack.pop()
            a = stack.pop()
            result = operators[token](a, b)
            stack.append(result)
        else:
            stack.append(int(token))

    return stack[0]
```

## Min Stack

Design a stack that supports push, pop, top, and retrieving the minimum element in O(1).

### Approach

Maintain a parallel stack that tracks the minimum at each level.

```
Operations: push(3), push(5), push(2), push(1), pop(), getMin()

Main Stack:   Min Stack:
push(3):
   [3]           [3]

push(5):
   [3,5]         [3,3]      min(5,3) = 3

push(2):
   [3,5,2]       [3,3,2]    min(2,3) = 2

push(1):
   [3,5,2,1]     [3,3,2,1]  min(1,2) = 1

pop():
   [3,5,2]       [3,3,2]

getMin(): return 2 (top of min stack)
```

```python
class MinStack:
    """Stack with O(1) minimum retrieval."""

    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        if not self.min_stack:
            self.min_stack.append(val)
        else:
            self.min_stack.append(min(val, self.min_stack[-1]))

    def pop(self):
        self.stack.pop()
        self.min_stack.pop()

    def top(self):
        return self.stack[-1]

    def get_min(self):
        return self.min_stack[-1]
```

## Practice Problems

1. **Valid Parentheses**: Check if brackets are balanced
2. **Min Stack**: Stack with O(1) getMin
3. **Evaluate Reverse Polish Notation**: Calculate postfix expression
4. **Daily Temperatures**: Days until warmer temperature
5. **Basic Calculator**: Evaluate expression with +, -, (, )

## Summary

Stacks are essential data structures with LIFO behavior:

| Property | Value |
|----------|-------|
| Access Pattern | Last-In-First-Out |
| All Operations | O(1) |
| Common Uses | Function calls, undo, parsing |

Key insights:
- Stacks naturally handle nested structures
- Think "stack" when you need to track what to return to
- Pair stacks can track additional properties (like minimum)

In the next lesson, we will explore queue fundamentals and their FIFO behavior.
