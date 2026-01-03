---
title: Memoization (Top-Down DP)
order: 2
estimatedMinutes: 16
---

# Memoization (Top-Down DP)

Memoization is a top-down approach where we start with the original problem, recursively solve subproblems, and cache results to avoid recomputation.

## Basic Pattern

```python
def solve(args, memo=None):
    if memo is None:
        memo = {}

    # Check cache
    if args in memo:
        return memo[args]

    # Base case
    if is_base_case(args):
        return base_value

    # Recursive case with caching
    result = combine(solve(subproblem1, memo), solve(subproblem2, memo))
    memo[args] = result
    return result
```

## Using Python's @cache Decorator

Python 3.9+ provides `functools.cache`:

```python
from functools import cache

@cache
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)


print(fib(100))  # Instant!
```

For earlier versions, use `@lru_cache`:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

## Example: House Robber

Maximum money robbing non-adjacent houses:

```python
from functools import cache

def rob(nums):
    """
    Maximum money from non-adjacent houses.

    State: max money starting from house i
    Choice: rob house i (skip i+1) or skip house i
    """
    @cache
    def dp(i):
        # Base case: no more houses
        if i >= len(nums):
            return 0

        # Choice: rob this house or skip it
        rob_current = nums[i] + dp(i + 2)
        skip_current = dp(i + 1)

        return max(rob_current, skip_current)

    return dp(0)


print(rob([1, 2, 3, 1]))  # 4 (rob houses 0 and 2)
print(rob([2, 7, 9, 3, 1]))  # 12 (rob houses 0, 2, 4)
```

## Example: Unique Paths

Count paths from top-left to bottom-right (only right/down moves):

```python
from functools import cache

def unique_paths(m, n):
    """
    Count unique paths in m×n grid.

    State: (row, col) position
    Choices: move right or down
    """
    @cache
    def dp(row, col):
        # Base case: reached destination
        if row == m - 1 and col == n - 1:
            return 1

        # Out of bounds
        if row >= m or col >= n:
            return 0

        # Move right or down
        return dp(row + 1, col) + dp(row, col + 1)

    return dp(0, 0)


print(unique_paths(3, 7))  # 28
print(unique_paths(3, 2))  # 3
```

## Example: Word Break

Can we segment a string using dictionary words?

```python
from functools import cache

def word_break(s, word_dict):
    """
    Check if s can be segmented into dictionary words.

    State: starting index in s
    """
    word_set = set(word_dict)

    @cache
    def dp(start):
        # Base case: reached end of string
        if start == len(s):
            return True

        # Try each possible word starting at 'start'
        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            if word in word_set and dp(end):
                return True

        return False

    return dp(0)


print(word_break("leetcode", ["leet", "code"]))  # True
print(word_break("applepenapple", ["apple", "pen"]))  # True
print(word_break("catsandog", ["cats", "dog", "sand", "and", "cat"]))  # False
```

## Example: Longest Increasing Subsequence

```python
from functools import cache

def length_of_lis(nums):
    """
    Find length of longest increasing subsequence.

    State: (index, previous value)
    Choice: include or skip current element
    """
    @cache
    def dp(i, prev):
        # Base case: processed all elements
        if i == len(nums):
            return 0

        # Option 1: Skip current element
        skip = dp(i + 1, prev)

        # Option 2: Include if greater than previous
        include = 0
        if prev == float('-inf') or nums[i] > prev:
            include = 1 + dp(i + 1, nums[i])

        return max(skip, include)

    return dp(0, float('-inf'))


print(length_of_lis([10, 9, 2, 5, 3, 7, 101, 18]))  # 4 ([2,3,7,101])
```

## When to Use Memoization

**Advantages:**
- More intuitive - follows natural recursive thinking
- Only computes needed subproblems
- Easy to implement from recursive solution

**Disadvantages:**
- Recursion overhead (function call stack)
- May hit recursion limit for deep problems
- Harder to optimize space

## Tips for Memoization

### 1. Identify State Variables
What parameters uniquely define a subproblem?

```python
# Grid path: (row, col)
# Subsequence: (index, previous_element)
# Knapsack: (index, remaining_capacity)
```

### 2. Handle Unhashable States
When state includes lists, use tuples:

```python
@cache
def dp(index, items):  # items as tuple
    ...

# Call with tuple
dp(0, tuple(selected_items))
```

### 3. Clear Cache When Needed

```python
dp.cache_clear()  # For @cache or @lru_cache
```

### 4. Watch for Recursion Limits

```python
import sys
sys.setrecursionlimit(10000)  # Increase if needed
```

## Common Mistakes

### 1. Forgetting Base Cases
```python
# Bad: No base case
@cache
def dp(i):
    return dp(i - 1) + dp(i - 2)  # Infinite recursion!

# Good: Include base cases
@cache
def dp(i):
    if i <= 1:
        return i
    return dp(i - 1) + dp(i - 2)
```

### 2. Mutable Default Arguments
```python
# Bad: Shared mutable default
def solve(args, memo={}):  # Same dict across calls!
    ...

# Good: Use None default
def solve(args, memo=None):
    if memo is None:
        memo = {}
    ...
```

## Key Takeaways

1. Memoization = recursion + caching
2. Use `@cache` decorator for clean implementation
3. State variables must be hashable
4. Natural top-down approach, easy to derive from recursion
5. Watch for recursion limits on deep problems

Next, we'll explore tabulation (bottom-up DP).
