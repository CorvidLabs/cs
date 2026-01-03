---
title: Introduction to Recursion
order: 4
estimatedMinutes: 25
---

# Introduction to Recursion

Recursion is when a function calls itself. It's a powerful technique for solving problems that can be broken down into smaller, similar sub-problems.

## What is Recursion?

A recursive function has two parts:

1. **Base case**: The condition where recursion stops
2. **Recursive case**: The function calls itself with a simpler input

```python
def countdown(n):
    """Count down from n to 1."""
    if n <= 0:            # Base case
        print("Done!")
        return

    print(n)
    countdown(n - 1)      # Recursive case
```

```python
countdown(5)
# Output:
# 5
# 4
# 3
# 2
# 1
# Done!
```

## The Classic Example: Factorial

Factorial of n (written n!) is n x (n-1) x (n-2) x ... x 1

- 5! = 5 x 4 x 3 x 2 x 1 = 120
- 3! = 3 x 2 x 1 = 6
- 1! = 1
- 0! = 1 (by definition)

### Recursive Definition

- 0! = 1 (base case)
- n! = n x (n-1)! (recursive case)

### Implementation

```python
def factorial(n):
    """
    Calculate n! recursively.

    Args:
        n: Non-negative integer.

    Returns:
        n factorial.
    """
    if n <= 1:           # Base case
        return 1
    return n * factorial(n - 1)  # Recursive case
```

### How It Works

```
factorial(5)
= 5 * factorial(4)
= 5 * (4 * factorial(3))
= 5 * (4 * (3 * factorial(2)))
= 5 * (4 * (3 * (2 * factorial(1))))
= 5 * (4 * (3 * (2 * 1)))
= 5 * (4 * (3 * 2))
= 5 * (4 * 6)
= 5 * 24
= 120
```

### Iterative Comparison

```python
def factorial_iterative(n):
    """Calculate n! using a loop."""
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
```

## Fibonacci Sequence

Each number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8, 13, 21...

### Recursive Definition

- F(0) = 0 (base case)
- F(1) = 1 (base case)
- F(n) = F(n-1) + F(n-2) (recursive case)

### Simple Recursive Implementation

```python
def fibonacci(n):
    """
    Return the nth Fibonacci number.

    Warning: This is inefficient for large n!
    """
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)
```

### The Problem with Naive Recursion

```
fibonacci(5)
├── fibonacci(4)
│   ├── fibonacci(3)
│   │   ├── fibonacci(2)
│   │   │   ├── fibonacci(1) = 1
│   │   │   └── fibonacci(0) = 0
│   │   └── fibonacci(1) = 1
│   └── fibonacci(2)
│       ├── fibonacci(1) = 1
│       └── fibonacci(0) = 0
└── fibonacci(3)
    ├── fibonacci(2)
    │   ├── fibonacci(1) = 1
    │   └── fibonacci(0) = 0
    └── fibonacci(1) = 1
```

Notice how `fibonacci(3)` and `fibonacci(2)` are calculated multiple times!

### Memoization: Remember Previous Results

```python
def fibonacci_memo(n, memo={}):
    """
    Fibonacci with memoization.
    Much faster - O(n) instead of O(2^n).
    """
    if n in memo:
        return memo[n]

    if n <= 0:
        return 0
    if n == 1:
        return 1

    result = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    memo[n] = result
    return result
```

### Using functools.lru_cache

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci_cached(n):
    """Fibonacci with automatic memoization."""
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fibonacci_cached(n - 1) + fibonacci_cached(n - 2)
```

## Sum of a List

### Recursive Approach

```python
def sum_list(items):
    """Sum all items in a list recursively."""
    if not items:           # Base case: empty list
        return 0
    return items[0] + sum_list(items[1:])  # First + rest

print(sum_list([1, 2, 3, 4, 5]))  # 15
```

### How It Works

```
sum_list([1, 2, 3, 4, 5])
= 1 + sum_list([2, 3, 4, 5])
= 1 + (2 + sum_list([3, 4, 5]))
= 1 + (2 + (3 + sum_list([4, 5])))
= 1 + (2 + (3 + (4 + sum_list([5]))))
= 1 + (2 + (3 + (4 + (5 + sum_list([])))))
= 1 + (2 + (3 + (4 + (5 + 0))))
= 15
```

## Reversing a String

```python
def reverse_string(s):
    """Reverse a string recursively."""
    if len(s) <= 1:         # Base case
        return s
    return s[-1] + reverse_string(s[:-1])

print(reverse_string("hello"))  # "olleh"
```

## Checking Palindromes

```python
def is_palindrome(s):
    """Check if string is a palindrome recursively."""
    # Remove non-alphanumeric and lowercase
    s = ''.join(c.lower() for c in s if c.isalnum())

    if len(s) <= 1:
        return True

    if s[0] != s[-1]:
        return False

    return is_palindrome(s[1:-1])

print(is_palindrome("A man a plan a canal Panama"))  # True
```

## Exponentiation

```python
def power(base, exponent):
    """Calculate base^exponent recursively."""
    if exponent == 0:
        return 1
    if exponent < 0:
        return 1 / power(base, -exponent)

    return base * power(base, exponent - 1)

print(power(2, 10))  # 1024
```

### Efficient Exponentiation

```python
def power_efficient(base, exponent):
    """
    Calculate base^exponent in O(log n).

    Uses the fact that x^n = (x^(n/2))^2
    """
    if exponent == 0:
        return 1
    if exponent < 0:
        return 1 / power_efficient(base, -exponent)

    if exponent % 2 == 0:
        half = power_efficient(base, exponent // 2)
        return half * half
    else:
        return base * power_efficient(base, exponent - 1)
```

## Binary Search (Recursive)

```python
def binary_search(items, target, left=0, right=None):
    """Binary search using recursion."""
    if right is None:
        right = len(items) - 1

    if left > right:
        return -1

    mid = (left + right) // 2

    if items[mid] == target:
        return mid
    elif items[mid] < target:
        return binary_search(items, target, mid + 1, right)
    else:
        return binary_search(items, target, left, mid - 1)
```

## Recursion vs Iteration

### When to Use Recursion

- Problem has a natural recursive structure (trees, graphs)
- Divide-and-conquer algorithms
- Problem is easier to express recursively
- Depth is bounded and reasonable

### When to Use Iteration

- Simple loops are clearer
- Performance is critical
- Deep recursion might overflow the stack
- Tail recursion optimization is needed (Python doesn't optimize this)

### Stack Overflow

Python has a recursion limit (usually 1000):

```python
import sys
print(sys.getrecursionlimit())  # 1000

# Can increase if needed (not recommended)
sys.setrecursionlimit(2000)
```

For deep recursion, convert to iteration:

```python
# Recursive (limited depth)
def factorial_recursive(n):
    if n <= 1:
        return 1
    return n * factorial_recursive(n - 1)

# Iterative (unlimited depth)
def factorial_iterative(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
```

## Common Mistakes

### Missing Base Case

```python
# Wrong! Will run forever
def bad_countdown(n):
    print(n)
    bad_countdown(n - 1)  # Never stops!
```

### Base Case Never Reached

```python
# Wrong! Base case can't be reached
def bad_factorial(n):
    if n == 0:
        return 1
    return n * bad_factorial(n + 1)  # Going wrong direction!
```

### Inefficient Recursion

```python
# Inefficient - creates new list each call
def sum_bad(items):
    if not items:
        return 0
    return items[0] + sum_bad(items[1:])  # Slicing is O(n)

# Better - pass index
def sum_good(items, index=0):
    if index >= len(items):
        return 0
    return items[index] + sum_good(items, index + 1)
```

## Try It Yourself

1. Write a recursive function to count digits in a number
2. Implement GCD (Greatest Common Divisor) using Euclid's algorithm
3. Write a recursive function to flatten a nested list
4. Implement a recursive directory tree printer

## Key Takeaways

1. Every recursive function needs a base case and recursive case
2. The recursive case must move toward the base case
3. Memoization prevents redundant calculations
4. Python has a recursion limit (~1000 by default)
5. Some problems are naturally recursive; others are better iterative
6. Think about the call stack and potential overflow

You've completed the Algorithms Introduction module! You now understand time complexity, searching, sorting, and recursion - fundamental concepts that will serve you throughout your programming journey.
