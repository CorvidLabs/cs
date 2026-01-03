---
title: Tabulation (Bottom-Up DP)
order: 3
estimatedMinutes: 16
---

# Tabulation (Bottom-Up DP)

Tabulation is a bottom-up approach where we solve subproblems in order, building up to the final solution. No recursion needed.

## Basic Pattern

```python
def solve(n):
    # Create DP table
    dp = [0] * (n + 1)

    # Base cases
    dp[0] = base_value_0
    dp[1] = base_value_1

    # Fill table bottom-up
    for i in range(2, n + 1):
        dp[i] = recurrence(dp[i-1], dp[i-2], ...)

    return dp[n]
```

## Example: Fibonacci with Tabulation

```python
def fib(n):
    """
    Fibonacci using tabulation.

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


print(fib(10))  # 55
```

## Space Optimization

Often we only need recent values:

```python
def fib_optimized(n):
    """
    Fibonacci with O(1) space.
    """
    if n <= 1:
        return n

    prev2, prev1 = 0, 1

    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr

    return prev1
```

## Example: House Robber

```python
def rob(nums):
    """
    Maximum money from non-adjacent houses.

    dp[i] = max money robbing houses 0..i
    dp[i] = max(dp[i-2] + nums[i], dp[i-1])

    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]

    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])

    for i in range(2, len(nums)):
        curr = max(prev2 + nums[i], prev1)
        prev2 = prev1
        prev1 = curr

    return prev1


print(rob([2, 7, 9, 3, 1]))  # 12
```

## Example: Coin Change

Minimum coins to make amount:

```python
def coin_change(coins, amount):
    """
    Find minimum coins to make amount.

    dp[i] = min coins to make amount i
    dp[i] = min(dp[i - coin] + 1) for each coin

    Time: O(amount × coins)
    Space: O(amount)
    """
    # dp[i] = min coins to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # 0 coins for amount 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1


print(coin_change([1, 2, 5], 11))  # 3 (5+5+1)
print(coin_change([2], 3))  # -1
```

## Example: Unique Paths

```python
def unique_paths(m, n):
    """
    Count unique paths in m×n grid.

    dp[i][j] = paths to reach (i, j)
    dp[i][j] = dp[i-1][j] + dp[i][j-1]

    Time: O(m × n)
    Space: O(n) with optimization
    """
    # Initialize with 1s (one way to reach any cell in first row)
    dp = [1] * n

    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]  # dp[j] already has value from row above

    return dp[n - 1]


print(unique_paths(3, 7))  # 28
```

## Example: 0/1 Knapsack

```python
def knapsack(weights, values, capacity):
    """
    Maximum value within capacity.

    dp[i][w] = max value using items 0..i with capacity w
    Choice: include item i or not

    Time: O(n × capacity)
    Space: O(capacity) optimized
    """
    n = len(weights)

    # dp[w] = max value with capacity w
    dp = [0] * (capacity + 1)

    for i in range(n):
        # Traverse backwards to avoid using same item twice
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])

    return dp[capacity]


weights = [1, 2, 3, 5]
values = [1, 6, 10, 16]
capacity = 7
print(knapsack(weights, values, capacity))  # 22 (items 2 and 3)
```

## Example: Longest Common Subsequence

```python
def lcs(text1, text2):
    """
    Length of longest common subsequence.

    dp[i][j] = LCS of text1[0..i] and text2[0..j]

    Time: O(m × n)
    Space: O(n) optimized
    """
    m, n = len(text1), len(text2)

    # Two rows: previous and current
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        prev, curr = curr, prev

    return prev[n]


print(lcs("abcde", "ace"))  # 3 ("ace")
print(lcs("abc", "def"))    # 0
```

## 2D Table Pattern

For problems with two dimensions:

```python
def solve_2d(m, n):
    # Create 2D table
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases (often first row/column)
    for i in range(m + 1):
        dp[i][0] = base_value
    for j in range(n + 1):
        dp[0][j] = base_value

    # Fill table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            dp[i][j] = recurrence(dp[i-1][j], dp[i][j-1], ...)

    return dp[m][n]
```

## Tabulation vs Memoization

| Aspect | Tabulation | Memoization |
|--------|------------|-------------|
| Direction | Bottom-up | Top-down |
| Recursion | No | Yes |
| Space optimization | Easier | Harder |
| Order of solving | Must determine | Automatic |
| Subproblems solved | All | Only needed |
| Stack overflow | No risk | Possible |

## When to Choose Tabulation

- Deep recursion would hit stack limits
- All subproblems need to be solved anyway
- Space optimization is important
- Iterative solution is clearer

## Key Takeaways

1. Tabulation builds solution iteratively, no recursion
2. Determine computation order based on dependencies
3. Often can optimize from O(n) space to O(1)
4. 2D problems: often can reduce to 1D by processing row by row
5. Backward iteration prevents reusing items (0/1 knapsack)

Next, we'll explore common DP patterns.
