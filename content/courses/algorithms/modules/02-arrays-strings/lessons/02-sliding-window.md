# Sliding Window Technique

## Introduction

The sliding window technique is a powerful method for solving problems involving contiguous sequences (subarrays or substrings). Instead of recalculating everything for each position, we maintain a "window" that slides across the data, efficiently updating our answer as elements enter and leave.

This technique transforms many O(n^2) or O(n*k) problems into O(n) solutions by avoiding redundant computations.

## Core Concept

Imagine a window that can grow, shrink, or slide across an array:

```
Array: [2, 1, 5, 1, 3, 2]

Window of size 3:
Step 1: [2, 1, 5] 1, 3, 2    sum = 8
         -------
Step 2:  2 [1, 5, 1] 3, 2    sum = 8 - 2 + 1 = 7
            -------
Step 3:  2, 1 [5, 1, 3] 2    sum = 7 - 1 + 3 = 7
               -------
Step 4:  2, 1, 5 [1, 3, 2]   sum = 7 - 5 + 2 = 6
                  -------
```

Instead of summing 3 elements each time (O(k) per position), we subtract the element leaving and add the element entering (O(1) per position).

## Types of Sliding Windows

### Fixed-Size Window

The window size is predetermined. Use when the problem specifies an exact window size k.

```
Problem: Find maximum sum of any k consecutive elements.
Window size: k (fixed)
```

### Variable-Size Window

The window expands and contracts based on conditions. Use when finding the optimal subarray that meets certain criteria.

```
Problem: Find smallest subarray with sum >= target.
Window size: varies (shrink when condition met, expand otherwise)
```

## Fixed-Size Window: Maximum Sum Subarray

**Problem**: Find the maximum sum of any subarray of size k.

### Visual Walkthrough

```
Array: [2, 1, 5, 1, 3, 2], k = 3

Initialize window (first k elements):
[2, 1, 5] 1, 3, 2
 -------
sum = 8, max_sum = 8

Slide window:
Remove 2, Add 1:   2 [1, 5, 1] 3, 2    sum = 7, max_sum = 8
Remove 1, Add 3:   2, 1 [5, 1, 3] 2    sum = 9, max_sum = 9
Remove 5, Add 2:   2, 1, 5 [1, 3, 2]   sum = 6, max_sum = 9

Answer: 9
```

### Python Implementation

```python
def max_sum_subarray(nums, k):
    """
    Find maximum sum of any subarray of size k.

    Args:
        nums: List of integers
        k: Window size

    Returns:
        Maximum sum of k consecutive elements

    Time: O(n), Space: O(1)
    """
    if len(nums) < k:
        return None

    # Calculate sum of first window
    window_sum = sum(nums[:k])
    max_sum = window_sum

    # Slide the window
    for i in range(k, len(nums)):
        # Remove element leaving window, add element entering
        window_sum = window_sum - nums[i - k] + nums[i]
        max_sum = max(max_sum, window_sum)

    return max_sum
```

### Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Brute Force (sum each window) | O(n * k) | O(1) |
| Sliding Window | O(n) | O(1) |

## Variable-Size Window: Minimum Size Subarray Sum

**Problem**: Find the minimum length subarray with sum >= target.

### Visual Walkthrough

```
Array: [2, 3, 1, 2, 4, 3], target = 7

Expand until sum >= target, then shrink from left:

Step 1: [2] sum=2 < 7, expand
Step 2: [2,3] sum=5 < 7, expand
Step 3: [2,3,1] sum=6 < 7, expand
Step 4: [2,3,1,2] sum=8 >= 7, record length=4, shrink
Step 5: [3,1,2] sum=6 < 7, expand
Step 6: [3,1,2,4] sum=10 >= 7, record length=4, shrink
Step 7: [1,2,4] sum=7 >= 7, record length=3, shrink
Step 8: [2,4] sum=6 < 7, expand
Step 9: [2,4,3] sum=9 >= 7, record length=3, shrink
Step 10: [4,3] sum=7 >= 7, record length=2, shrink
Step 11: [3] sum=3 < 7, expand (end of array)

Answer: 2 (subarray [4,3])
```

### Python Implementation

```python
def min_subarray_len(target, nums):
    """
    Find minimum length subarray with sum >= target.

    Args:
        target: Target sum
        nums: List of positive integers

    Returns:
        Minimum length, or 0 if no valid subarray

    Time: O(n), Space: O(1)
    """
    n = len(nums)
    left = 0
    window_sum = 0
    min_length = float('inf')

    for right in range(n):
        # Expand window
        window_sum += nums[right]

        # Shrink while condition is met
        while window_sum >= target:
            min_length = min(min_length, right - left + 1)
            window_sum -= nums[left]
            left += 1

    return min_length if min_length != float('inf') else 0
```

## Sliding Window with Hash Map: Longest Substring Without Repeating Characters

**Problem**: Find the length of the longest substring without repeating characters.

### Visual Walkthrough

```
String: "abcabcbb"

Window: [a]bcabcbb      chars={a:0}     length=1, max=1
Window: [ab]cabcbb      chars={a:0,b:1}  length=2, max=2
Window: [abc]abcbb      chars={a:0,b:1,c:2}  length=3, max=3
Window: a[bca]bcbb      'a' repeats, shrink; chars={b:1,c:2,a:3}  length=3
Window: ab[cab]cbb      'b' repeats, shrink; chars={c:2,a:3,b:4}  length=3
Window: abc[abc]bb      'c' repeats, shrink; chars={a:3,b:4,c:5}  length=3
Window: abcab[cb]b      'b' repeats, shrink; chars={c:5,b:6}  length=2
Window: abcabc[b]b      'b' repeats, shrink; chars={b:7}  length=1

Answer: 3 ("abc")
```

### Python Implementation

```python
def length_of_longest_substring(s):
    """
    Find length of longest substring without repeating characters.

    Args:
        s: Input string

    Returns:
        Length of longest substring

    Time: O(n), Space: O(min(n, charset_size))
    """
    char_index = {}  # Maps character to its last seen index
    left = 0
    max_length = 0

    for right, char in enumerate(s):
        # If character seen and is within current window
        if char in char_index and char_index[char] >= left:
            # Move left pointer past the duplicate
            left = char_index[char] + 1

        # Update character's position
        char_index[char] = right

        # Update maximum length
        max_length = max(max_length, right - left + 1)

    return max_length
```

## Sliding Window Pattern Template

Here is a general template for sliding window problems:

```python
def sliding_window_template(data):
    """
    General sliding window template.
    """
    left = 0
    result = initial_value  # 0, infinity, etc.
    window_state = {}  # Or counter, sum, etc.

    for right in range(len(data)):
        # 1. Expand: Add data[right] to window
        update_window_state(window_state, data[right])

        # 2. Shrink: Contract window if invalid
        while window_is_invalid(window_state):
            remove_from_window(window_state, data[left])
            left += 1

        # 3. Update result
        result = update_result(result, right - left + 1)

    return result
```

## Example: Longest Substring with At Most K Distinct Characters

**Problem**: Find the longest substring containing at most k distinct characters.

```python
def longest_k_distinct(s, k):
    """
    Find longest substring with at most k distinct characters.

    Args:
        s: Input string
        k: Maximum distinct characters allowed

    Returns:
        Length of longest valid substring

    Time: O(n), Space: O(k)
    """
    from collections import defaultdict

    char_count = defaultdict(int)
    left = 0
    max_length = 0

    for right, char in enumerate(s):
        # Expand: add character to window
        char_count[char] += 1

        # Shrink: too many distinct characters
        while len(char_count) > k:
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1

        # Update result
        max_length = max(max_length, right - left + 1)

    return max_length
```

## Example: Find All Anagrams in a String

**Problem**: Find all starting indices where anagrams of pattern p occur in string s.

```python
def find_anagrams(s, p):
    """
    Find all starting indices of p's anagrams in s.

    Args:
        s: Source string
        p: Pattern string

    Returns:
        List of starting indices

    Time: O(n), Space: O(1) - only 26 letters
    """
    from collections import Counter

    if len(p) > len(s):
        return []

    p_count = Counter(p)
    window_count = Counter()
    result = []
    k = len(p)

    for i, char in enumerate(s):
        # Add character to window
        window_count[char] += 1

        # Remove character leaving window
        if i >= k:
            left_char = s[i - k]
            window_count[left_char] -= 1
            if window_count[left_char] == 0:
                del window_count[left_char]

        # Check if window matches pattern
        if window_count == p_count:
            result.append(i - k + 1)

    return result
```

## Choosing the Right Window Type

| Problem Characteristic | Window Type |
|----------------------|-------------|
| "Subarray of size k" | Fixed |
| "Maximum/minimum length" | Variable |
| "Find all windows matching criteria" | Usually fixed |
| "Smallest window containing X" | Variable |

## Common Mistakes

### 1. Incorrect Window Boundaries

```python
# Bad: Off-by-one error
for right in range(k, len(nums)):  # Misses first window

# Good: Include all windows
window_sum = sum(nums[:k])
for right in range(k, len(nums)):
```

### 2. Not Handling Empty Results

```python
# Bad: Returns infinity for impossible cases
min_length = float('inf')
return min_length  # Returns infinity

# Good: Return appropriate default
return min_length if min_length != float('inf') else 0
```

### 3. Forgetting to Remove from Window

```python
# Bad: Only adding, never removing
for right in range(len(s)):
    window_count[s[right]] += 1
    # Window grows forever!

# Good: Remove when shrinking
while condition:
    window_count[s[left]] -= 1
    left += 1
```

## Practice Problems

1. **Maximum Average Subarray I**: Find max average of subarray with length k
2. **Permutation in String**: Check if s2 contains a permutation of s1
3. **Minimum Window Substring**: Find minimum window in s containing all characters of t
4. **Fruit Into Baskets**: Maximum fruits from contiguous trees with 2 types

## Summary

The sliding window technique efficiently solves contiguous sequence problems:

| Aspect | Fixed Window | Variable Window |
|--------|--------------|-----------------|
| Size | Constant k | Changes dynamically |
| Use Case | Known window size | Finding optimal size |
| Complexity | O(n) | O(n) |

Key insights:
- Avoid recomputation by updating incrementally
- Use hash maps to track window contents
- Shrink window when constraints are violated
- Expand window to explore new possibilities

In the next lesson, we will explore string manipulation techniques that build upon these foundation patterns.
