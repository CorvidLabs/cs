---
title: Radix Sort
order: 4
estimatedMinutes: 16
---

# Radix Sort

Radix sort sorts integers digit by digit, from least significant to most significant. It uses counting sort as a subroutine and achieves O(d × (n + k)) time where d is the number of digits.

## How It Works

1. Find the maximum number to determine number of digits
2. For each digit position (starting from least significant):
   - Use a stable sort (counting sort) to sort by that digit

## Implementation

```python
def radix_sort(arr):
    """
    Sort array of non-negative integers using radix sort.

    Time: O(d × (n + k)) where d = digits, k = base (10)
    Space: O(n + k)
    """
    if not arr:
        return arr

    max_val = max(arr)

    # Process each digit
    exp = 1  # Current digit position (1, 10, 100, ...)
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10

    return arr


def counting_sort_by_digit(arr, exp):
    """
    Stable sort by the digit at position exp.
    exp = 1 for ones digit, 10 for tens, etc.
    """
    n = len(arr)
    output = [0] * n
    count = [0] * 10  # Digits 0-9

    # Count occurrences of each digit
    for num in arr:
        digit = (num // exp) % 10
        count[digit] += 1

    # Cumulative count
    for i in range(1, 10):
        count[i] += count[i - 1]

    # Build output (backwards for stability)
    for i in range(n - 1, -1, -1):
        digit = (arr[i] // exp) % 10
        count[digit] -= 1
        output[count[digit]] = arr[i]

    # Copy back to original array
    for i in range(n):
        arr[i] = output[i]


# Example
arr = [170, 45, 75, 90, 802, 24, 2, 66]
radix_sort(arr)
print(arr)  # [2, 24, 45, 66, 75, 90, 170, 802]
```

## Visualization

```
Array: [170, 45, 75, 90, 802, 24, 2, 66]

Pass 1 (ones digit):
170→0, 45→5, 75→5, 90→0, 802→2, 24→4, 2→2, 66→6
Sorted by ones: [170, 90, 802, 2, 24, 45, 75, 66]

Pass 2 (tens digit):
170→7, 90→9, 802→0, 2→0, 24→2, 45→4, 75→7, 66→6
Sorted by tens: [802, 2, 24, 45, 66, 170, 75, 90]

Pass 3 (hundreds digit):
802→8, 2→0, 24→0, 45→0, 66→0, 170→1, 75→0, 90→0
Sorted by hundreds: [2, 24, 45, 66, 75, 90, 170, 802]
```

## Handling Negative Numbers

Separate negatives, sort both groups, combine:

```python
def radix_sort_with_negatives(arr):
    """Radix sort supporting negative numbers."""
    if not arr:
        return arr

    # Separate into negatives and non-negatives
    negatives = [-x for x in arr if x < 0]
    non_negatives = [x for x in arr if x >= 0]

    # Sort both groups
    if negatives:
        radix_sort(negatives)
        negatives = [-x for x in reversed(negatives)]

    if non_negatives:
        radix_sort(non_negatives)

    return negatives + non_negatives


arr = [170, -45, 75, -90, 802, 24, -2, 66]
print(radix_sort_with_negatives(arr))
# [-90, -45, -2, 24, 66, 75, 170, 802]
```

## Different Bases

Using larger bases can be faster:

```python
def radix_sort_base256(arr):
    """
    Radix sort using base 256.
    Fewer passes but larger count array.
    """
    if not arr:
        return arr

    max_val = max(arr)
    base = 256

    exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit_base(arr, exp, base)
        exp *= base

    return arr


def counting_sort_by_digit_base(arr, exp, base):
    n = len(arr)
    output = [0] * n
    count = [0] * base

    for num in arr:
        digit = (num // exp) % base
        count[digit] += 1

    for i in range(1, base):
        count[i] += count[i - 1]

    for i in range(n - 1, -1, -1):
        digit = (arr[i] // exp) % base
        count[digit] -= 1
        output[count[digit]] = arr[i]

    for i in range(n):
        arr[i] = output[i]
```

## MSD Radix Sort (Most Significant Digit First)

Sorts from most significant digit - can short-circuit:

```python
def msd_radix_sort(arr):
    """Most significant digit radix sort."""
    if not arr:
        return arr

    max_val = max(arr)
    max_digits = len(str(max_val))

    return msd_sort(arr, max_digits - 1)


def msd_sort(arr, digit):
    """Recursively sort by digit position."""
    if len(arr) <= 1 or digit < 0:
        return arr

    # Create buckets for each digit (0-9)
    buckets = [[] for _ in range(10)]
    divisor = 10 ** digit

    for num in arr:
        d = (num // divisor) % 10
        buckets[d].append(num)

    # Recursively sort each bucket
    result = []
    for bucket in buckets:
        result.extend(msd_sort(bucket, digit - 1))

    return result
```

## Radix Sort for Strings

Sort strings lexicographically:

```python
def radix_sort_strings(strings):
    """
    Sort strings of same length using radix sort.
    """
    if not strings:
        return strings

    max_len = max(len(s) for s in strings)

    # Pad strings to same length
    padded = [s.ljust(max_len) for s in strings]

    # Sort by each character position (right to left)
    for pos in range(max_len - 1, -1, -1):
        # Counting sort by character at position pos
        count = [0] * 256  # ASCII characters
        output = [''] * len(padded)

        for s in padded:
            count[ord(s[pos])] += 1

        for i in range(1, 256):
            count[i] += count[i - 1]

        for s in reversed(padded):
            idx = ord(s[pos])
            count[idx] -= 1
            output[count[idx]] = s

        padded = output

    # Remove padding
    return [s.rstrip() for s in padded]


strings = ["cat", "car", "cab", "can", "cap"]
print(radix_sort_strings(strings))
# ['cab', 'can', 'cap', 'car', 'cat']
```

## Time and Space Complexity

- **Time**: O(d × (n + k))
  - d = number of digits
  - n = number of elements
  - k = base/radix (e.g., 10 for decimal)
- **Space**: O(n + k)

| Scenario | Time |
|----------|------|
| 32-bit integers, base 256 | O(4 × n) = O(n) |
| n integers up to n² | O(2 × n) = O(n) |
| n integers up to n^k | O(k × n) |

## Properties

| Property | Value |
|----------|-------|
| Time | O(d × (n + k)) |
| Space | O(n + k) |
| Stable | Yes |
| In-place | No |
| Comparison-based | No |

## When to Use Radix Sort

**Ideal when:**
- Sorting integers with bounded size
- Number of digits d is constant or small
- Need O(n) sorting for integers

**Not suitable when:**
- Floating point numbers (need special handling)
- Data doesn't have fixed-length keys
- Very large range of values with few elements

## Key Takeaways

1. Sorts digit by digit from least to most significant
2. Uses stable counting sort as subroutine
3. O(d × n) where d is number of digits
4. Can achieve linear time for fixed-width integers
5. Stable sorting algorithm
6. Works for strings too (character by character)

This completes the sorting algorithms module.
