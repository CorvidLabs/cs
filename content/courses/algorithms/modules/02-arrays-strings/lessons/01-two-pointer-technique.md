# Two-Pointer Technique

## Introduction

The two-pointer technique is a fundamental pattern for solving array and string problems efficiently. Instead of using nested loops that result in O(n^2) complexity, two pointers allow us to traverse the data structure in a single pass, achieving O(n) time complexity.

The core idea is simple: maintain two indices (pointers) that move through the array based on certain conditions. The pointers can start from the same position or opposite ends, depending on the problem.

## When to Use Two Pointers

The two-pointer technique works well when:

1. The array is sorted (or needs to be)
2. You need to find pairs or triplets with specific properties
3. You need to compare elements from different positions
4. You are searching for a subarray with certain characteristics

## Types of Two-Pointer Patterns

### Pattern 1: Opposite Direction Pointers

Start one pointer at the beginning and one at the end, moving them toward each other.

```
Array: [1, 2, 3, 4, 5, 6, 7]
        ^                 ^
       left             right

Move pointers based on conditions until they meet.
```

### Pattern 2: Same Direction Pointers (Fast and Slow)

Both pointers start at the same position, but one moves faster than the other.

```
Array: [1, 2, 3, 4, 5, 6, 7]
        ^
       slow
        ^
       fast

Fast pointer explores ahead while slow pointer tracks a boundary.
```

## Example 1: Two Sum in Sorted Array

**Problem**: Given a sorted array and a target sum, find two numbers that add up to the target.

**Approach**: Use opposite direction pointers. If the sum is too small, move left pointer right. If too large, move right pointer left.

```
Initial:  [1, 2, 4, 6, 8, 9, 14, 15]   Target: 13
           ^                     ^
          left                 right
          sum = 1 + 15 = 16 > 13, move right left

Step 1:   [1, 2, 4, 6, 8, 9, 14, 15]
           ^                 ^
          left             right
          sum = 1 + 14 = 15 > 13, move right left

Step 2:   [1, 2, 4, 6, 8, 9, 14, 15]
           ^              ^
          left          right
          sum = 1 + 9 = 10 < 13, move left right

Step 3:   [1, 2, 4, 6, 8, 9, 14, 15]
              ^           ^
             left       right
          sum = 2 + 9 = 11 < 13, move left right

Step 4:   [1, 2, 4, 6, 8, 9, 14, 15]
                 ^        ^
                left    right
          sum = 4 + 9 = 13 = target, FOUND!
```

### Python Implementation

```python
def two_sum_sorted(nums, target):
    """
    Find two numbers in sorted array that sum to target.

    Args:
        nums: Sorted list of integers
        target: Target sum

    Returns:
        Tuple of indices, or None if not found

    Time: O(n), Space: O(1)
    """
    left = 0
    right = len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]

        if current_sum == target:
            return (left, right)
        elif current_sum < target:
            left += 1
        else:
            right -= 1

    return None
```

### Complexity Analysis

| Metric | Value | Explanation |
|--------|-------|-------------|
| Time | O(n) | Each pointer moves at most n times |
| Space | O(1) | Only two pointer variables used |

Compare this to the brute force approach with nested loops: O(n^2) time. The two-pointer technique is significantly more efficient.

## Example 2: Remove Duplicates in Place

**Problem**: Remove duplicates from a sorted array in place, returning the new length.

**Approach**: Use same-direction pointers. Slow pointer marks the boundary of unique elements. Fast pointer scans ahead.

```
Initial:  [1, 1, 2, 2, 3, 4, 4, 5]
           ^
          slow
           ^
          fast

Step 1:   [1, 1, 2, 2, 3, 4, 4, 5]
           ^  ^
          slow fast
          nums[slow] == nums[fast], just move fast

Step 2:   [1, 1, 2, 2, 3, 4, 4, 5]
           ^     ^
          slow  fast
          nums[slow] != nums[fast], copy and move slow

After:    [1, 2, 2, 2, 3, 4, 4, 5]
              ^  ^
             slow fast

Continue until fast reaches end...

Final:    [1, 2, 3, 4, 5, 4, 4, 5]
                       ^
                      slow
          Return slow + 1 = 5 (length of unique portion)
```

### Python Implementation

```python
def remove_duplicates(nums):
    """
    Remove duplicates from sorted array in place.

    Args:
        nums: Sorted list with possible duplicates

    Returns:
        Length of array after removing duplicates

    Time: O(n), Space: O(1)
    """
    if not nums:
        return 0

    slow = 0

    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]

    return slow + 1
```

## Example 3: Container With Most Water

**Problem**: Given an array of heights, find two lines that together with the x-axis form a container holding the most water.

**Approach**: Start with widest container (pointers at ends). Move the shorter line inward, hoping to find a taller one.

```
Heights: [1, 8, 6, 2, 5, 4, 8, 3, 7]

         |       |               |
         |   |   |       |       |
         |   |   |   |   |   |   |
         |   |   |   |   |   |   |   |
         |   |   |   |   |   |   |   |
         |   |   |   |   |   |   |   |
         |   |   |   | __|   |   |   |
        _|___|___|___|___|___|___|___|___
         1   8   6   2   5   4   8   3   7
         ^                               ^
        left                           right

        Area = min(1, 7) * 8 = 8
        Move left (shorter) inward
```

### Python Implementation

```python
def max_area(heights):
    """
    Find maximum water container between two lines.

    Args:
        heights: List of line heights

    Returns:
        Maximum area of water container

    Time: O(n), Space: O(1)
    """
    left = 0
    right = len(heights) - 1
    max_water = 0

    while left < right:
        width = right - left
        height = min(heights[left], heights[right])
        area = width * height
        max_water = max(max_water, area)

        # Move the shorter line inward
        if heights[left] < heights[right]:
            left += 1
        else:
            right -= 1

    return max_water
```

## Example 4: Three Sum

**Problem**: Find all unique triplets in an array that sum to zero.

**Approach**: Sort the array. For each element, use two pointers to find pairs that complete the triplet.

```python
def three_sum(nums):
    """
    Find all unique triplets that sum to zero.

    Args:
        nums: List of integers

    Returns:
        List of triplets

    Time: O(n^2), Space: O(1) excluding output
    """
    nums.sort()
    result = []
    n = len(nums)

    for i in range(n - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left = i + 1
        right = n - 1
        target = -nums[i]

        while left < right:
            current_sum = nums[left] + nums[right]

            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])

                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1

                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1

    return result
```

## Common Mistakes to Avoid

### 1. Forgetting to Handle Edge Cases

```python
# Bad: No check for empty or small arrays
def two_sum(nums, target):
    left, right = 0, len(nums) - 1
    # Crashes if nums is empty

# Good: Handle edge cases
def two_sum(nums, target):
    if len(nums) < 2:
        return None
    left, right = 0, len(nums) - 1
```

### 2. Off-by-One Errors in Loop Conditions

```python
# Bad: Using <= causes pointers to cross
while left <= right:
    # May process same element twice

# Good: Stop when pointers meet
while left < right:
    # Each element processed once
```

### 3. Not Skipping Duplicates When Required

When problems ask for unique results, you must skip duplicate values to avoid repeating answers.

## Practice Problems

1. **Valid Palindrome**: Check if a string is a palindrome, ignoring non-alphanumeric characters
2. **Merge Sorted Arrays**: Merge two sorted arrays into one sorted array
3. **Move Zeroes**: Move all zeroes to the end while maintaining order of non-zero elements
4. **Sort Colors (Dutch National Flag)**: Sort array containing only 0s, 1s, and 2s

## Summary

The two-pointer technique is essential for efficient array manipulation:

| Pattern | Starting Position | Use Case |
|---------|------------------|----------|
| Opposite Direction | Ends of array | Pair finding in sorted arrays |
| Same Direction | Same position | In-place modifications |

Key benefits:
- Reduces O(n^2) brute force to O(n)
- Constant space complexity
- Works on sorted and unsorted arrays (with modifications)

In the next lesson, we will explore the sliding window technique, which extends the two-pointer concept to handle subarray and substring problems.
