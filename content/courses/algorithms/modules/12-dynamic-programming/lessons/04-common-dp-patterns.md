---
title: Common DP Patterns
order: 4
estimatedMinutes: 20
---

# Common DP Patterns

Recognizing DP patterns helps you quickly identify the approach for new problems. Here are the most common patterns.

## Pattern 1: Linear Sequence

Problems on a 1D array where each element depends on previous elements.

**Template:**
```python
def linear_dp(arr):
    dp = [0] * len(arr)
    dp[0] = base_case

    for i in range(1, len(arr)):
        dp[i] = f(dp[i-1], dp[i-2], ..., arr[i])

    return dp[-1]
```

**Examples:**
- Climbing Stairs
- House Robber
- Maximum Subarray

```python
def max_subarray(nums):
    """Maximum sum contiguous subarray (Kadane's)."""
    dp = [0] * len(nums)
    dp[0] = nums[0]

    for i in range(1, len(nums)):
        dp[i] = max(nums[i], dp[i-1] + nums[i])

    return max(dp)
```

## Pattern 2: Two Sequences (LCS Pattern)

Compare two sequences, typically using 2D DP.

**Template:**
```python
def two_sequence_dp(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1  # Match
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # No match

    return dp[m][n]
```

**Examples:**
- Longest Common Subsequence
- Edit Distance
- Shortest Common Supersequence

```python
def edit_distance(word1, word2):
    """Minimum operations to transform word1 to word2."""
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all
    for j in range(n + 1):
        dp[0][j] = j  # Insert all

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # Delete
                    dp[i][j-1],    # Insert
                    dp[i-1][j-1]   # Replace
                )

    return dp[m][n]
```

## Pattern 3: Knapsack

Choose items with constraints on capacity.

### 0/1 Knapsack (Each Item Once)
```python
def knapsack_01(weights, values, capacity):
    n = len(weights)
    dp = [0] * (capacity + 1)

    for i in range(n):
        # Backwards to use each item once
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])

    return dp[capacity]
```

### Unbounded Knapsack (Unlimited Items)
```python
def knapsack_unbounded(weights, values, capacity):
    dp = [0] * (capacity + 1)

    for w in range(1, capacity + 1):
        for i in range(len(weights)):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])

    return dp[capacity]
```

### Subset Sum (Can we make target?)
```python
def can_sum(nums, target):
    dp = [False] * (target + 1)
    dp[0] = True

    for num in nums:
        for t in range(target, num - 1, -1):
            dp[t] = dp[t] or dp[t - num]

    return dp[target]
```

## Pattern 4: Grid Traversal

Problems on 2D grids, typically moving right/down.

**Template:**
```python
def grid_dp(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]

    # Base case: first cell
    dp[0][0] = grid[0][0]

    # First row and column
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]

    # Fill rest
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])

    return dp[m-1][n-1]
```

**Examples:**
- Minimum Path Sum
- Unique Paths
- Dungeon Game

## Pattern 5: Interval DP

Problems involving intervals [i, j] where solution depends on subintervals.

**Template:**
```python
def interval_dp(arr):
    n = len(arr)
    dp = [[0] * n for _ in range(n)]

    # Base: single elements
    for i in range(n):
        dp[i][i] = base_case(i)

    # Increasing interval lengths
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            for k in range(i, j):  # Split point
                dp[i][j] = optimal(dp[i][k], dp[k+1][j])

    return dp[0][n-1]
```

**Examples:**
- Matrix Chain Multiplication
- Burst Balloons
- Palindrome Partitioning

```python
def min_cost_merge_stones(stones, k):
    """Minimum cost to merge stones into one pile."""
    n = len(stones)

    if (n - 1) % (k - 1) != 0:
        return -1

    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]

    dp = [[0] * n for _ in range(n)]

    for length in range(k, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')

            for mid in range(i, j, k - 1):
                dp[i][j] = min(dp[i][j], dp[i][mid] + dp[mid + 1][j])

            if (j - i) % (k - 1) == 0:
                dp[i][j] += prefix[j + 1] - prefix[i]

    return dp[0][n - 1]
```

## Pattern 6: State Machine

Track state transitions, often for buy/sell problems.

```python
def max_profit_with_cooldown(prices):
    """
    Max profit with cooldown after selling.

    States: hold, sold, rest
    """
    hold = float('-inf')  # Holding stock
    sold = 0              # Just sold
    rest = 0              # Resting (cooldown)

    for price in prices:
        prev_hold = hold
        hold = max(hold, rest - price)    # Buy or keep holding
        rest = max(rest, sold)            # Rest or continue resting
        sold = prev_hold + price          # Sell

    return max(sold, rest)
```

## Pattern 7: Decision Making

At each step, make a decision that affects future options.

```python
def paint_house(costs):
    """
    Minimum cost to paint houses (no adjacent same color).

    costs[i][j] = cost to paint house i with color j
    """
    n = len(costs)
    dp = costs[0][:]  # First house costs

    for i in range(1, n):
        new_dp = [0] * 3
        new_dp[0] = costs[i][0] + min(dp[1], dp[2])
        new_dp[1] = costs[i][1] + min(dp[0], dp[2])
        new_dp[2] = costs[i][2] + min(dp[0], dp[1])
        dp = new_dp

    return min(dp)
```

## Pattern Recognition Cheat Sheet

| Pattern | Key Indicator | Example |
|---------|---------------|---------|
| Linear | Single array, local choices | House Robber |
| Two Sequences | Compare two strings | LCS, Edit Distance |
| Knapsack | Capacity constraint | Subset Sum |
| Grid | 2D movement | Path problems |
| Interval | Range [i,j] | Matrix Chain |
| State Machine | Multiple states | Stock problems |
| Decision | Choose from options | Paint House |

## Key Takeaways

1. Pattern recognition speeds up problem solving
2. Most DP problems fit one of these patterns
3. Start by identifying: state, choices, transitions
4. 2D problems often reducible to 1D space
5. Practice recognizing patterns in new problems

This completes the dynamic programming module.
