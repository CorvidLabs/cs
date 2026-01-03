# String Manipulation

## Introduction

Strings are sequences of characters that appear in nearly every programming problem. Efficient string manipulation requires understanding how strings are stored in memory, common operations and their costs, and proven techniques for solving string problems.

This lesson covers essential string operations, pattern matching basics, and common string algorithm patterns.

## String Fundamentals

### Immutability Matters

In many languages (Python, Java, JavaScript), strings are immutable. Every modification creates a new string, which has significant performance implications.

```python
# Inefficient: O(n^2) due to string concatenation
def build_string_bad(n):
    result = ""
    for i in range(n):
        result += str(i)  # Creates new string each time
    return result

# Efficient: O(n) using list then join
def build_string_good(n):
    parts = []
    for i in range(n):
        parts.append(str(i))
    return "".join(parts)
```

### String Operations Complexity

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| Access by index | O(1) | Direct memory access |
| Concatenation | O(n + m) | Creates new string |
| Substring | O(k) | k = substring length |
| Search (in) | O(n * m) | n = string, m = pattern |
| Compare | O(min(n, m)) | Character by character |

## Palindrome Detection

A palindrome reads the same forwards and backwards. This is a classic two-pointer problem.

### Visual Representation

```
String: "racecar"

Compare from outside in:
r a c e c a r
^           ^   r == r, continue
  ^       ^     a == a, continue
    ^   ^       c == c, continue
      ^         center reached, it's a palindrome!
```

### Python Implementation

```python
def is_palindrome(s):
    """
    Check if string is a palindrome.

    Args:
        s: Input string

    Returns:
        True if palindrome

    Time: O(n), Space: O(1)
    """
    left = 0
    right = len(s) - 1

    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1

    return True


def is_palindrome_alphanumeric(s):
    """
    Check palindrome ignoring non-alphanumeric characters.

    Time: O(n), Space: O(1)
    """
    left = 0
    right = len(s) - 1

    while left < right:
        # Skip non-alphanumeric from left
        while left < right and not s[left].isalnum():
            left += 1

        # Skip non-alphanumeric from right
        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True
```

## String Reversal

### Basic Reversal

```python
def reverse_string(s):
    """
    Reverse a string in place (if mutable) or return reversed.

    Time: O(n), Space: O(n) for immutable strings
    """
    # Python strings are immutable, so we use a list
    chars = list(s)
    left, right = 0, len(chars) - 1

    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1

    return "".join(chars)
```

### Reverse Words in a String

**Problem**: Reverse the order of words in a string.

```
Input:  "the sky is blue"
Output: "blue is sky the"
```

```python
def reverse_words(s):
    """
    Reverse words in a string.

    Args:
        s: Input string with words

    Returns:
        String with words reversed

    Time: O(n), Space: O(n)
    """
    # Split into words, filter empty strings, reverse, join
    words = s.split()
    return " ".join(reversed(words))


def reverse_words_in_place(chars):
    """
    Reverse words in place using O(1) extra space.
    Works with mutable character array.

    Strategy:
    1. Reverse entire string
    2. Reverse each word
    """
    def reverse(chars, left, right):
        while left < right:
            chars[left], chars[right] = chars[right], chars[left]
            left += 1
            right -= 1

    n = len(chars)

    # Step 1: Reverse entire string
    reverse(chars, 0, n - 1)

    # Step 2: Reverse each word
    start = 0
    for end in range(n + 1):
        if end == n or chars[end] == ' ':
            reverse(chars, start, end - 1)
            start = end + 1

    return chars
```

## Anagrams

Two strings are anagrams if they contain the same characters with the same frequencies.

```
"listen" and "silent" are anagrams
"hello" and "world" are not anagrams
```

### Checking Anagrams

```python
def are_anagrams(s1, s2):
    """
    Check if two strings are anagrams.

    Time: O(n), Space: O(k) where k is character set size
    """
    if len(s1) != len(s2):
        return False

    from collections import Counter
    return Counter(s1) == Counter(s2)


def are_anagrams_sorted(s1, s2):
    """
    Check anagrams using sorting.

    Time: O(n log n), Space: O(n)
    """
    return sorted(s1) == sorted(s2)
```

### Grouping Anagrams

**Problem**: Group strings that are anagrams of each other.

```python
def group_anagrams(strs):
    """
    Group strings that are anagrams.

    Args:
        strs: List of strings

    Returns:
        List of groups (each group is a list of anagrams)

    Time: O(n * k log k) where k is max string length
    Space: O(n * k)
    """
    from collections import defaultdict

    groups = defaultdict(list)

    for s in strs:
        # Use sorted string as key
        key = "".join(sorted(s))
        groups[key].append(s)

    return list(groups.values())


def group_anagrams_optimal(strs):
    """
    Group anagrams using character count as key.

    Time: O(n * k) where k is max string length
    Space: O(n * k)
    """
    from collections import defaultdict

    groups = defaultdict(list)

    for s in strs:
        # Use character count tuple as key
        count = [0] * 26
        for char in s:
            count[ord(char) - ord('a')] += 1
        key = tuple(count)
        groups[key].append(s)

    return list(groups.values())
```

## Substring Search

Finding occurrences of a pattern within a text is fundamental to string processing.

### Naive Approach

```python
def find_pattern_naive(text, pattern):
    """
    Find all occurrences of pattern in text.

    Time: O(n * m) where n = len(text), m = len(pattern)
    Space: O(1)
    """
    n, m = len(text), len(pattern)
    positions = []

    for i in range(n - m + 1):
        match = True
        for j in range(m):
            if text[i + j] != pattern[j]:
                match = False
                break
        if match:
            positions.append(i)

    return positions
```

### Rabin-Karp Algorithm

Uses hashing for efficient average-case pattern matching.

```
Text:    "abracadabra"
Pattern: "abra"

Hash each window of size 4:
"abra" -> hash1
"brac" -> hash2 (computed from hash1)
"raca" -> hash3 (computed from hash2)
...

Only compare characters when hashes match.
```

```python
def rabin_karp(text, pattern):
    """
    Find pattern using rolling hash.

    Time: O(n + m) average, O(n * m) worst case
    Space: O(1)
    """
    if not pattern:
        return []

    n, m = len(text), len(pattern)
    if m > n:
        return []

    base = 256
    mod = 10**9 + 7

    # Compute hash of pattern and first window
    pattern_hash = 0
    window_hash = 0
    h = pow(base, m - 1, mod)  # base^(m-1) mod mod

    for i in range(m):
        pattern_hash = (pattern_hash * base + ord(pattern[i])) % mod
        window_hash = (window_hash * base + ord(text[i])) % mod

    positions = []

    for i in range(n - m + 1):
        # Check if hashes match
        if pattern_hash == window_hash:
            # Verify character by character
            if text[i:i+m] == pattern:
                positions.append(i)

        # Compute hash for next window
        if i < n - m:
            window_hash = ((window_hash - ord(text[i]) * h) * base + ord(text[i + m])) % mod
            if window_hash < 0:
                window_hash += mod

    return positions
```

## Longest Common Prefix

**Problem**: Find the longest common prefix among an array of strings.

```python
def longest_common_prefix(strs):
    """
    Find longest common prefix.

    Time: O(S) where S is sum of all character counts
    Space: O(1)
    """
    if not strs:
        return ""

    # Start with first string as prefix
    prefix = strs[0]

    for s in strs[1:]:
        # Shrink prefix until it matches
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""

    return prefix


def longest_common_prefix_vertical(strs):
    """
    Vertical scanning approach.
    Compare character by character across all strings.

    Time: O(S), Space: O(1)
    """
    if not strs:
        return ""

    for i in range(len(strs[0])):
        char = strs[0][i]
        for s in strs[1:]:
            if i >= len(s) or s[i] != char:
                return strs[0][:i]

    return strs[0]
```

## String Compression

**Problem**: Compress a string by replacing consecutive characters with the character and count.

```
Input:  "aabcccccaaa"
Output: "a2b1c5a3"
```

```python
def compress_string(s):
    """
    Compress string with run-length encoding.

    Time: O(n), Space: O(n)
    """
    if not s:
        return s

    result = []
    count = 1

    for i in range(1, len(s)):
        if s[i] == s[i - 1]:
            count += 1
        else:
            result.append(s[i - 1])
            result.append(str(count))
            count = 1

    # Don't forget the last group
    result.append(s[-1])
    result.append(str(count))

    compressed = "".join(result)

    # Only return compressed if shorter
    return compressed if len(compressed) < len(s) else s
```

## String Rotation

**Problem**: Check if one string is a rotation of another.

```
"waterbottle" is a rotation of "erbottlewat"
(rotate "waterbottle" right by 3 positions)
```

```python
def is_rotation(s1, s2):
    """
    Check if s2 is a rotation of s1.

    Key insight: If s2 is a rotation of s1,
    then s2 must be a substring of s1 + s1.

    Time: O(n), Space: O(n)
    """
    if len(s1) != len(s2):
        return False

    if not s1:
        return True

    doubled = s1 + s1
    return s2 in doubled
```

Visual proof:
```
s1 = "waterbottle"
s1 + s1 = "waterbottlewaterbottle"
                    -----------
               s2 = "erbottlewat" is found!
```

## Practice Problems

1. **Valid Anagram**: Determine if two strings are anagrams
2. **First Unique Character**: Find first non-repeating character
3. **String to Integer (atoi)**: Implement string to integer conversion
4. **Longest Palindromic Substring**: Find longest palindrome within string
5. **Implement strStr()**: Find first occurrence of needle in haystack
6. **ZigZag Conversion**: Convert string to zigzag pattern

## Summary

String manipulation requires understanding:

| Concept | Key Points |
|---------|------------|
| Immutability | Concatenation creates copies; use builders |
| Two Pointers | Efficient for palindromes, reversal |
| Hashing | Anagrams, pattern matching |
| Character Counting | Frequency-based problems |

Best practices:
- Use appropriate data structures (Counter, dict)
- Avoid repeated string concatenation
- Consider character set size for space complexity
- Use built-in methods when available (but know their costs)

This concludes the Arrays and Strings module. These techniques will be applied throughout the remaining modules as we explore more complex data structures and algorithms.
