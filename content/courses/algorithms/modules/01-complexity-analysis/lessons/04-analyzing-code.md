# Analyzing Code for Complexity

## A Systematic Approach

Analyzing code complexity becomes straightforward once you learn to recognize patterns. This lesson provides a step-by-step method for determining the time and space complexity of any code.

## Step 1: Identify the Input Size

Before analyzing, identify what "n" represents. This is typically:

- The length of an array or list
- The number of elements in a collection
- The size of a number (for numeric algorithms)
- Multiple variables for multi-dimensional problems (m x n)

```python
def process_list(items):      # n = len(items)
    pass

def search_matrix(matrix):    # m = rows, n = columns
    pass

def count_digits(number):     # n = number of digits in number
    pass
```

## Step 2: Count the Basic Operations

Look for operations that execute based on input size:

### Simple Statements: O(1)

```python
x = 5                    # O(1)
y = x + 10               # O(1)
result = items[0]        # O(1) - array access
value = dictionary[key]  # O(1) - hash table lookup
```

A sequence of O(1) operations is still O(1).

### Loops: Multiply

```python
# Single loop over n items: O(n)
for item in items:
    print(item)          # O(1) operation inside

# Nested loops: multiply the iterations
for i in range(n):       # O(n)
    for j in range(n):   # O(n)
        print(i, j)      # O(1)
# Total: O(n) * O(n) * O(1) = O(n^2)

# Nested loops with different bounds
for i in range(n):       # O(n)
    for j in range(m):   # O(m)
        print(i, j)
# Total: O(n * m)
```

### Consecutive Sections: Add

```python
# First section: O(n)
for item in items:
    print(item)

# Second section: O(n^2)
for i in range(len(items)):
    for j in range(len(items)):
        print(items[i], items[j])

# Total: O(n) + O(n^2) = O(n^2) (drop lower order term)
```

## Step 3: Recognize Loop Patterns

### Linear Loops: O(n)

```python
for i in range(n):           # O(n)
    pass

i = 0
while i < n:                 # O(n)
    i += 1
```

### Logarithmic Loops: O(log n)

The loop variable multiplies or divides:

```python
i = 1
while i < n:                 # O(log n)
    i *= 2                   # doubles each iteration

i = n
while i > 1:                 # O(log n)
    i //= 2                  # halves each iteration
```

### Quadratic Nested Loops: O(n^2)

```python
for i in range(n):
    for j in range(n):       # O(n^2)
        pass

# Also O(n^2): triangular iteration
for i in range(n):
    for j in range(i):       # Still O(n^2), roughly n^2/2
        pass
```

### Linear Times Logarithmic: O(n log n)

```python
for i in range(n):           # O(n) outer loop
    j = 1
    while j < n:             # O(log n) inner loop
        j *= 2
# Total: O(n log n)
```

## Step 4: Analyze Recursion

### Method 1: Count the Calls

Draw the recursion tree and count total calls:

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Calls: factorial(n), factorial(n-1), ..., factorial(1)
# Total: n calls, each O(1) work
# Time: O(n), Space: O(n) for call stack
```

### Method 2: Recurrence Relations

Express the time as a formula:

```python
def binary_search(arr, target, left, right):
    if left > right:
        return -1
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search(arr, target, mid + 1, right)
    else:
        return binary_search(arr, target, left, mid - 1)

# T(n) = T(n/2) + O(1)
# Each call does O(1) work, then calls with half the size
# Solution: O(log n)
```

### Method 3: Common Patterns

| Recurrence | Solution | Example |
|------------|----------|---------|
| T(n) = T(n-1) + O(1) | O(n) | Factorial |
| T(n) = T(n-1) + O(n) | O(n^2) | Selection sort |
| T(n) = T(n/2) + O(1) | O(log n) | Binary search |
| T(n) = T(n/2) + O(n) | O(n) | Quick select |
| T(n) = 2T(n/2) + O(1) | O(n) | Tree traversal |
| T(n) = 2T(n/2) + O(n) | O(n log n) | Merge sort |
| T(n) = 2T(n-1) + O(1) | O(2^n) | Naive Fibonacci |

## Step 5: Account for Built-in Operations

Know the complexity of language features:

### Python Built-ins

| Operation | Time Complexity |
|-----------|-----------------|
| `list.append()` | O(1) amortized |
| `list.pop()` (end) | O(1) |
| `list.pop(0)` | O(n) |
| `list.insert(i, x)` | O(n) |
| `x in list` | O(n) |
| `list.sort()` | O(n log n) |
| `dict[key]` | O(1) average |
| `x in dict` | O(1) average |
| `set.add()` | O(1) average |
| `x in set` | O(1) average |
| `string + string` | O(n) |

### Hidden Loops

```python
# This looks O(n) but is O(n^2) due to string concatenation
result = ""
for char in string:
    result += char      # Creates new string each time: O(n)
# Total: O(n^2)

# Better: O(n)
result = []
for char in string:
    result.append(char)  # O(1)
result = "".join(result) # O(n)
# Total: O(n)
```

## Complete Examples

### Example 1: Nested Loop Analysis

```python
def mystery(n):
    count = 0
    for i in range(n):           # O(n)
        for j in range(i):       # O(i), varies from 0 to n-1
            count += 1
    return count
```

Analysis:
- Outer loop runs n times
- Inner loop runs 0 + 1 + 2 + ... + (n-1) = n(n-1)/2 times total
- Total: O(n^2)

### Example 2: Multiple Loops

```python
def process(items):
    n = len(items)

    # Phase 1: O(n)
    total = sum(items)

    # Phase 2: O(n log n)
    sorted_items = sorted(items)

    # Phase 3: O(n)
    for item in sorted_items:
        print(item)

    return total
```

Analysis:
- O(n) + O(n log n) + O(n) = O(n log n)

### Example 3: Recursion with Loop

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])    # T(n/2)
    right = merge_sort(arr[mid:])   # T(n/2)

    # Merge: O(n)
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

Analysis:
- Recurrence: T(n) = 2T(n/2) + O(n)
- Solution: O(n log n)

### Example 4: Space Complexity

```python
def example(n):
    # O(1) space: fixed variables
    x = 0
    y = 0

    # O(n) space: array of size n
    arr = [0] * n

    # O(n^2) space: 2D matrix
    matrix = [[0] * n for _ in range(n)]

    # O(log n) space: recursion depth in balanced recursion
    # (assuming the recursive call stack)

    return matrix
```

Total space: O(n^2) (dominated by the matrix)

## Common Mistakes to Avoid

### Mistake 1: Forgetting Hidden Loops

```python
# Looks O(n) but slice is O(k)
for i in range(n):
    sublist = items[i:]  # O(n-i) slice operation
# Actually O(n^2)
```

### Mistake 2: Ignoring String Operations

```python
# Each + creates a new string
s = ""
for c in chars:
    s += c  # O(current length)
# O(n^2) total
```

### Mistake 3: Assuming Dictionary Operations Are Always O(1)

```python
# Usually O(1), but worst case is O(n) with hash collisions
# For analysis, we typically use average case O(1)
value = dictionary[key]
```

### Mistake 4: Forgetting Recursion Stack Space

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
# Time: O(n), Space: O(n) - don't forget the call stack!
```

## Summary

To analyze code complexity:

1. **Identify input size**: What does n represent?
2. **Count operations**: O(1) for simple statements
3. **Analyze loops**: Multiply nested, add consecutive
4. **Handle recursion**: Draw trees, use recurrence relations
5. **Know built-ins**: Understand language-specific costs
6. **Watch for traps**: Hidden loops, string ops, recursion space

With practice, you will be able to determine complexity at a glance. The exercises in this module will help you build that intuition.
