---
title: Binary Search Applications
order: 4
estimatedMinutes: 18
---

# Binary Search Applications

Binary search extends beyond arrays to any problem where we can efficiently check if an answer is valid and the search space is monotonic.

## Binary Search on Answer Space

When you need to find the minimum/maximum value that satisfies a condition:

```python
def binary_search_answer(lo, hi, is_valid):
    """
    Find minimum value in [lo, hi] that satisfies is_valid.

    Template for "minimum x such that condition(x) is true"
    """
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if is_valid(mid):
            hi = mid  # Try smaller
        else:
            lo = mid + 1
    return lo
```

## Example 1: Koko Eating Bananas

Find minimum eating speed to finish all bananas in h hours:

```python
import math

def min_eating_speed(piles, h):
    """
    Find minimum eating speed k to eat all bananas in h hours.

    Time: O(n * log(max_pile))
    """
    def can_finish(k):
        """Check if speed k allows finishing in h hours."""
        hours = sum(math.ceil(pile / k) for pile in piles)
        return hours <= h

    left = 1
    right = max(piles)

    while left < right:
        mid = left + (right - left) // 2
        if can_finish(mid):
            right = mid
        else:
            left = mid + 1

    return left


piles = [3, 6, 7, 11]
h = 8
print(min_eating_speed(piles, h))  # 4
```

## Example 2: Split Array Largest Sum

Split array into m subarrays to minimize the maximum sum:

```python
def split_array(nums, m):
    """
    Split array into m parts, minimize maximum sum of any part.

    Time: O(n * log(sum - max))
    """
    def can_split(max_sum):
        """Check if we can split with max sum <= max_sum."""
        parts = 1
        current_sum = 0

        for num in nums:
            if current_sum + num > max_sum:
                parts += 1
                current_sum = num
            else:
                current_sum += num

        return parts <= m

    left = max(nums)  # At least max element
    right = sum(nums)  # At most sum of all

    while left < right:
        mid = left + (right - left) // 2
        if can_split(mid):
            right = mid
        else:
            left = mid + 1

    return left


nums = [7, 2, 5, 10, 8]
m = 2
print(split_array(nums, m))  # 18 ([7,2,5] and [10,8])
```

## Example 3: Median of Two Sorted Arrays

Find median in O(log(min(m,n))):

```python
def find_median_sorted_arrays(nums1, nums2):
    """
    Find median of two sorted arrays.

    Time: O(log(min(m, n)))
    """
    # Ensure nums1 is smaller
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1

    m, n = len(nums1), len(nums2)
    left, right = 0, m

    while left <= right:
        # Partition nums1
        partition1 = (left + right) // 2
        # Partition nums2 (to get equal halves)
        partition2 = (m + n + 1) // 2 - partition1

        # Edge cases: use -inf and +inf
        max_left1 = float('-inf') if partition1 == 0 else nums1[partition1 - 1]
        min_right1 = float('inf') if partition1 == m else nums1[partition1]

        max_left2 = float('-inf') if partition2 == 0 else nums2[partition2 - 1]
        min_right2 = float('inf') if partition2 == n else nums2[partition2]

        # Check if we found correct partition
        if max_left1 <= min_right2 and max_left2 <= min_right1:
            # Found it!
            if (m + n) % 2 == 0:
                return (max(max_left1, max_left2) +
                        min(min_right1, min_right2)) / 2
            else:
                return max(max_left1, max_left2)
        elif max_left1 > min_right2:
            right = partition1 - 1
        else:
            left = partition1 + 1

    return 0


print(find_median_sorted_arrays([1, 3], [2]))     # 2.0
print(find_median_sorted_arrays([1, 2], [3, 4]))  # 2.5
```

## Example 4: Find K-th Element in Sorted Arrays

```python
def find_kth_element(nums1, nums2, k):
    """
    Find k-th smallest element in two sorted arrays.

    Time: O(log(min(m, n)))
    """
    m, n = len(nums1), len(nums2)

    # Ensure nums1 is smaller
    if m > n:
        return find_kth_element(nums2, nums1, k)

    left = max(0, k - n)  # Min elements from nums1
    right = min(k, m)     # Max elements from nums1

    while left < right:
        mid = left + (right - left) // 2
        # Take mid from nums1, k-mid from nums2

        if nums1[mid] < nums2[k - mid - 1]:
            left = mid + 1
        else:
            right = mid

    # left elements from nums1, k-left from nums2
    val1 = nums1[left - 1] if left > 0 else float('-inf')
    val2 = nums2[k - left - 1] if k - left > 0 else float('-inf')

    return max(val1, val2)
```

## Example 5: Magnetic Force Between Balls

Place m balls in positions to maximize minimum distance:

```python
def max_distance(positions, m):
    """
    Place m balls to maximize minimum distance between any two.

    Time: O(n log n + n log(max_dist))
    """
    positions.sort()

    def can_place(min_dist):
        """Check if we can place m balls with min_dist apart."""
        count = 1
        last_pos = positions[0]

        for pos in positions[1:]:
            if pos - last_pos >= min_dist:
                count += 1
                last_pos = pos
                if count >= m:
                    return True

        return False

    left = 1
    right = positions[-1] - positions[0]

    while left < right:
        mid = left + (right - left + 1) // 2  # Round up
        if can_place(mid):
            left = mid
        else:
            right = mid - 1

    return left


positions = [1, 2, 3, 4, 7]
m = 3
print(max_distance(positions, m))  # 3 (place at 1, 4, 7)
```

## When to Use Binary Search on Answer

Look for these patterns:
1. "Minimum/Maximum value such that..."
2. "Find the smallest k where condition is satisfied"
3. Condition changes from False to True (or vice versa) at some point
4. Checking a candidate answer is efficient

## Template Comparison

### Minimize (Find First True)
```python
while left < right:
    mid = left + (right - left) // 2
    if is_valid(mid):
        right = mid      # Try smaller
    else:
        left = mid + 1
return left
```

### Maximize (Find Last True)
```python
while left < right:
    mid = left + (right - left + 1) // 2  # Round UP
    if is_valid(mid):
        left = mid       # Try larger
    else:
        right = mid - 1
return left
```

## Key Takeaways

1. Binary search works on any monotonic search space
2. "Minimum x such that condition" → search for first True
3. "Maximum x such that condition" → search for last True
4. Always define clear search bounds
5. Checking validity should be efficient (usually O(n))
6. Total complexity: O(n log(search_space))

This completes the searching algorithms module.
