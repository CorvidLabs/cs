---
title: Hash Table Applications
order: 4
estimatedMinutes: 25
---

# Hash Table Applications

## Introduction

Hash tables are versatile tools that appear in countless algorithmic problems. This lesson explores common applications including two-sum patterns, duplicate detection, anagram grouping, and more complex problems.

## Two Sum Pattern

### Classic Two Sum

```python
def two_sum(nums, target):
    """
    Find indices of two numbers that sum to target.

    Time: O(n), Space: O(n)
    """
    seen = {}  # value -> index

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []
```

### Two Sum with Multiple Solutions

```python
def two_sum_all_pairs(nums, target):
    """
    Find all pairs that sum to target.

    Time: O(n), Space: O(n)
    """
    seen = {}
    pairs = []

    for num in nums:
        complement = target - num

        if complement in seen:
            for _ in range(seen[complement]):
                pairs.append((complement, num))

        seen[num] = seen.get(num, 0) + 1

    return pairs
```

### Three Sum

```python
def three_sum(nums, target=0):
    """
    Find all unique triplets that sum to target.

    Time: O(n^2), Space: O(n)
    """
    nums.sort()
    result = []
    n = len(nums)

    for i in range(n - 2):
        # Skip duplicates
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        # Two-pointer for remaining two elements
        left, right = i + 1, n - 1
        need = target - nums[i]

        while left < right:
            current_sum = nums[left] + nums[right]

            if current_sum == need:
                result.append([nums[i], nums[left], nums[right]])

                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1

                left += 1
                right -= 1
            elif current_sum < need:
                left += 1
            else:
                right -= 1

    return result
```

## Duplicate Detection

### Contains Duplicate

```python
def contains_duplicate(nums):
    """
    Check if any value appears at least twice.

    Time: O(n), Space: O(n)
    """
    return len(nums) != len(set(nums))
```

### Contains Duplicate Within Distance K

```python
def contains_nearby_duplicate(nums, k):
    """
    Check if nums[i] == nums[j] with |i - j| <= k.

    Time: O(n), Space: O(min(n, k))
    """
    window = set()

    for i, num in enumerate(nums):
        if num in window:
            return True

        window.add(num)

        if len(window) > k:
            window.remove(nums[i - k])

    return False
```

### Find All Duplicates

```python
from collections import Counter


def find_duplicates(nums):
    """
    Find all elements that appear twice.

    Time: O(n), Space: O(n)
    """
    return [num for num, count in Counter(nums).items() if count == 2]
```

## Anagram Problems

### Valid Anagram

```python
from collections import Counter


def is_anagram(s, t):
    """
    Check if t is an anagram of s.

    Time: O(n), Space: O(1) - limited alphabet
    """
    return Counter(s) == Counter(t)
```

### Group Anagrams

```python
from collections import defaultdict


def group_anagrams(strs):
    """
    Group strings that are anagrams.

    Time: O(n * k log k), Space: O(n * k)
    """
    groups = defaultdict(list)

    for s in strs:
        # Sorted string as key
        key = ''.join(sorted(s))
        groups[key].append(s)

    return list(groups.values())


def group_anagrams_optimal(strs):
    """
    Group anagrams using character count as key.

    Time: O(n * k), Space: O(n * k)
    """
    groups = defaultdict(list)

    for s in strs:
        # Character count tuple as key
        count = [0] * 26
        for c in s:
            count[ord(c) - ord('a')] += 1
        groups[tuple(count)].append(s)

    return list(groups.values())
```

### Find Anagram Indices

```python
from collections import Counter


def find_anagrams(s, p):
    """
    Find all start indices of p's anagrams in s.

    Time: O(n), Space: O(1) - limited alphabet
    """
    if len(p) > len(s):
        return []

    p_count = Counter(p)
    window_count = Counter(s[:len(p)])
    result = []

    if window_count == p_count:
        result.append(0)

    for i in range(len(p), len(s)):
        # Add new character
        window_count[s[i]] += 1

        # Remove old character
        old_char = s[i - len(p)]
        window_count[old_char] -= 1
        if window_count[old_char] == 0:
            del window_count[old_char]

        if window_count == p_count:
            result.append(i - len(p) + 1)

    return result
```

## Subarray Problems

### Subarray Sum Equals K

```python
def subarray_sum(nums, k):
    """
    Count subarrays with sum equal to k.

    Key insight: If prefix_sum[j] - prefix_sum[i] = k,
    then subarray [i+1, j] has sum k.

    Time: O(n), Space: O(n)
    """
    count = 0
    prefix_sum = 0
    prefix_counts = {0: 1}  # Empty prefix has sum 0

    for num in nums:
        prefix_sum += num

        # How many prefixes with sum = prefix_sum - k?
        if prefix_sum - k in prefix_counts:
            count += prefix_counts[prefix_sum - k]

        prefix_counts[prefix_sum] = prefix_counts.get(prefix_sum, 0) + 1

    return count
```

### Longest Subarray with Sum K

```python
def longest_subarray_with_sum(nums, k):
    """
    Find length of longest subarray with sum k.

    Time: O(n), Space: O(n)
    """
    prefix_sum = 0
    first_occurrence = {0: -1}  # sum -> first index
    max_length = 0

    for i, num in enumerate(nums):
        prefix_sum += num

        if prefix_sum - k in first_occurrence:
            max_length = max(max_length, i - first_occurrence[prefix_sum - k])

        # Only store first occurrence
        if prefix_sum not in first_occurrence:
            first_occurrence[prefix_sum] = i

    return max_length
```

## String Problems

### Longest Substring Without Repeating Characters

```python
def length_of_longest_substring(s):
    """
    Find longest substring without repeating characters.

    Time: O(n), Space: O(min(n, alphabet_size))
    """
    char_index = {}
    max_length = 0
    start = 0

    for end, char in enumerate(s):
        if char in char_index and char_index[char] >= start:
            start = char_index[char] + 1

        char_index[char] = end
        max_length = max(max_length, end - start + 1)

    return max_length
```

### First Unique Character

```python
from collections import Counter


def first_uniq_char(s):
    """
    Find index of first non-repeating character.

    Time: O(n), Space: O(1) - limited alphabet
    """
    counts = Counter(s)

    for i, char in enumerate(s):
        if counts[char] == 1:
            return i

    return -1
```

## LRU Cache

```python
from collections import OrderedDict


class LRUCache:
    """
    Least Recently Used cache with O(1) operations.
    """

    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        """Get value and mark as recently used."""
        if key not in self.cache:
            return -1

        # Move to end (most recently used)
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        """Insert or update key-value pair."""
        if key in self.cache:
            self.cache.move_to_end(key)
        else:
            if len(self.cache) >= self.capacity:
                # Remove least recently used (first item)
                self.cache.popitem(last=False)

        self.cache[key] = value
```

## Insert Delete GetRandom O(1)

```python
import random


class RandomizedSet:
    """
    Set supporting O(1) insert, delete, and getRandom.
    """

    def __init__(self):
        self.val_to_index = {}
        self.values = []

    def insert(self, val):
        """Insert if not present. Returns True if inserted."""
        if val in self.val_to_index:
            return False

        self.val_to_index[val] = len(self.values)
        self.values.append(val)
        return True

    def remove(self, val):
        """Remove if present. Returns True if removed."""
        if val not in self.val_to_index:
            return False

        # Swap with last element for O(1) removal
        index = self.val_to_index[val]
        last_val = self.values[-1]

        self.values[index] = last_val
        self.val_to_index[last_val] = index

        self.values.pop()
        del self.val_to_index[val]

        return True

    def get_random(self):
        """Return random element."""
        return random.choice(self.values)
```

## Practice Problems

1. **Intersection of Two Arrays**: Find common elements
2. **Happy Number**: Detect cycle in number sequence
3. **Isomorphic Strings**: Check structural equivalence
4. **Minimum Window Substring**: Smallest window containing all chars
5. **Longest Consecutive Sequence**: Find longest consecutive elements

## Summary

Hash table application patterns:

| Pattern | Key Technique |
|---------|---------------|
| Two Sum | Store complement |
| Duplicate detection | Track seen elements |
| Anagrams | Sort or count characters |
| Subarray sum | Prefix sum + hash map |
| Sliding window | Hash map for window state |
| LRU Cache | OrderedDict or custom |

Key insights:
- Hash tables enable O(1) lookup to avoid nested loops
- Prefix sums + hash maps solve many subarray problems
- Counter simplifies frequency-based problems
- OrderedDict provides order-aware hash operations

This concludes the Hash Tables module. Hash tables are fundamental to efficient algorithm design and appear throughout the remaining modules.
