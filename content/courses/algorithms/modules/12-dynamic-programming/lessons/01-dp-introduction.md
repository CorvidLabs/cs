---
title: Introduction to Dynamic Programming
order: 1
estimatedMinutes: 18
---

# Introduction to Dynamic Programming

Dynamic Programming (DP) is a technique for solving problems by breaking them into overlapping subproblems and storing results to avoid redundant computation.

## When to Use DP

DP applies when a problem has:
1. **Optimal Substructure**: Optimal solution built from optimal subproblem solutions
2. **Overlapping Subproblems**: Same subproblems are solved multiple times

## Classic Example: Fibonacci

### Naive Recursion (Exponential)

```python
def fib_naive(n):
    """
    Fibonacci - naive recursive.
    Time: O(2^n) - exponential!
    """
    if n <= 1:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)


print(fib_naive(10))  # 55
# fib_naive(40) takes seconds!
```

The problem: We recalculate the same values many times.

```
fib(5)
├── fib(4)
│   ├── fib(3)
│   │   ├── fib(2)
│   │   └── fib(1)
│   └── fib(2)
└── fib(3)         ← Already calculated above!
    ├── fib(2)
    └── fib(1)
```

### DP Solution: Memoization (Top-Down)

Store results to avoid recalculation:

```python
def fib_memo(n, memo=None):
    """
    Fibonacci with memoization.
    Time: O(n)
    Space: O(n)
    """
    if memo is None:
        memo = {}

    if n in memo:
        return memo[n]

    if n <= 1:
        return n

    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]


print(fib_memo(40))  # 102334155 (instant!)
```

### DP Solution: Tabulation (Bottom-Up)

Build solution iteratively:

```python
def fib_tab(n):
    """
    Fibonacci with tabulation.
    Time: O(n)
    Space: O(n)
    """
    if n <= 1:
        return n

    dp = [0] * (n + 1)
    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]


print(fib_tab(40))  # 102334155
```

### Space Optimized

Only need last two values:

```python
def fib_optimized(n):
    """
    Fibonacci - O(1) space.
    Time: O(n)
    Space: O(1)
    """
    if n <= 1:
        return n

    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr

    return prev1


print(fib_optimized(40))  # 102334155
```

## DP Problem-Solving Steps

### 1. Define the State

What information do we need to represent a subproblem?

```python
# Example: Climbing stairs
# State: dp[i] = number of ways to reach step i
```

### 2. Define the Recurrence Relation

How do we build the solution from subproblems?

```python
# Climbing stairs: can take 1 or 2 steps
# dp[i] = dp[i-1] + dp[i-2]
```

### 3. Identify Base Cases

What are the smallest subproblems with known answers?

```python
# Climbing stairs base cases:
# dp[0] = 1 (one way to stay at ground)
# dp[1] = 1 (one way to reach step 1)
```

### 4. Determine Computation Order

For tabulation, compute subproblems before they're needed:

```python
# Climb stairs: compute dp[2], dp[3], ..., dp[n]
```

## Example: Climbing Stairs

```python
def climb_stairs(n):
    """
    Count ways to climb n stairs (1 or 2 steps at a time).

    State: dp[i] = ways to reach step i
    Recurrence: dp[i] = dp[i-1] + dp[i-2]
    Base: dp[0] = dp[1] = 1

    Time: O(n)
    Space: O(1)
    """
    if n <= 1:
        return 1

    prev2, prev1 = 1, 1
    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr

    return prev1


print(climb_stairs(5))  # 8 ways
```

## Example: Min Cost Climbing Stairs

```python
def min_cost_stairs(cost):
    """
    Find minimum cost to reach the top.

    State: dp[i] = min cost to reach step i
    Recurrence: dp[i] = min(dp[i-1], dp[i-2]) + cost[i]
    Base: dp[0] = cost[0], dp[1] = cost[1]

    Time: O(n)
    Space: O(1)
    """
    n = len(cost)
    if n == 1:
        return cost[0]

    prev2 = cost[0]
    prev1 = cost[1]

    for i in range(2, n):
        curr = min(prev1, prev2) + cost[i]
        prev2 = prev1
        prev1 = curr

    # Can reach top from last or second-to-last step
    return min(prev1, prev2)


cost = [10, 15, 20]
print(min_cost_stairs(cost))  # 15 (step on index 1)

cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]
print(min_cost_stairs(cost))  # 6
```

## Comparing Approaches

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Naive Recursion | O(2^n) | O(n) stack | Simple | Too slow |
| Memoization | O(n) | O(n) | Intuitive | Recursion overhead |
| Tabulation | O(n) | O(n) | Fast, no recursion | Need order |
| Space Optimized | O(n) | O(1) | Best efficiency | Less readable |

## Recognizing DP Problems

Look for these clues:
1. "Count the number of ways..."
2. "Find the minimum/maximum..."
3. "Is it possible to..."
4. "Find the longest/shortest..."
5. Choices at each step that depend on previous choices

## Key Takeaways

1. DP trades space for time by storing subproblem results
2. Two approaches: memoization (top-down) and tabulation (bottom-up)
3. Define state, recurrence, base cases
4. Often can optimize space by keeping only recent values
5. Transforms exponential problems to polynomial time

Next, we'll dive deeper into memoization.
