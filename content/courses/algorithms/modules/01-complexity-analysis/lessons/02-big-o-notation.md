# Big-O Notation

## What is Big-O?

Big-O notation is a mathematical way to describe how an algorithm's resource usage grows as the input size increases. It answers the question: "If I double my input size, how much longer will this take?"

Big-O focuses on the **growth rate** rather than exact measurements. We care about the shape of the curve, not the specific values.

## The Rules of Big-O

### Rule 1: Drop Constants

O(2n) becomes O(n). O(500) becomes O(1).

Constants do not change the growth rate. Whether an operation takes 1 millisecond or 100 milliseconds per item, the total time still doubles when you double the input. The shape of the growth curve remains the same.

### Rule 2: Drop Lower-Order Terms

O(n^2 + n) becomes O(n^2). O(n + log n) becomes O(n).

As n grows large, the highest-order term dominates. When n is 1,000,000, n^2 is 1,000,000,000,000 while n is only 1,000,000. The smaller term becomes insignificant.

### Rule 3: Use the Worst Case (Usually)

When we say an algorithm is O(n), we typically mean its **worst-case** performance is O(n). Sometimes we also discuss average-case or best-case, but worst-case is the default assumption.

## Common Complexity Classes

### O(1) - Constant Time

The algorithm takes the same amount of time regardless of input size.

```python
def get_first(items):
    return items[0]

def get_by_key(dictionary, key):
    return dictionary[key]

def is_even(number):
    return number % 2 == 0
```

**Examples**: Array access by index, hash table lookup, basic arithmetic operations.

**Growth**: Flat line. 10 items or 10 million items, same time.

### O(log n) - Logarithmic Time

The algorithm divides the problem in half with each step.

```python
def binary_search(sorted_list, target):
    left = 0
    right = len(sorted_list) - 1

    while left <= right:
        mid = (left + right) // 2
        if sorted_list[mid] == target:
            return mid
        elif sorted_list[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
```

**Examples**: Binary search, balanced tree operations, finding a word in a dictionary.

**Growth**: Very slow. Doubling the input adds only one more step. 1,000 items takes about 10 steps; 1,000,000 items takes about 20 steps.

### O(n) - Linear Time

The algorithm must look at each item once.

```python
def find_max(items):
    if not items:
        return None

    maximum = items[0]
    for item in items:
        if item > maximum:
            maximum = item
    return maximum

def linear_search(items, target):
    for i, item in enumerate(items):
        if item == target:
            return i
    return -1
```

**Examples**: Finding an item in an unsorted list, summing all elements, printing all elements.

**Growth**: Proportional. Double the input, double the time.

### O(n log n) - Linearithmic Time

The algorithm divides the problem and does linear work at each level.

```python
def merge_sort(items):
    if len(items) <= 1:
        return items

    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])

    return merge(left, right)

def merge(left, right):
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

**Examples**: Efficient sorting algorithms (merge sort, quicksort average case, heapsort).

**Growth**: Slightly worse than linear. For 1,000,000 items, about 20 million operations instead of 1 million.

### O(n^2) - Quadratic Time

The algorithm compares every item to every other item.

```python
def bubble_sort(items):
    n = len(items)
    for i in range(n):
        for j in range(0, n - i - 1):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
    return items

def find_duplicates_naive(items):
    duplicates = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j] and items[i] not in duplicates:
                duplicates.append(items[i])
    return duplicates
```

**Examples**: Simple sorting algorithms (bubble sort, insertion sort, selection sort), comparing all pairs.

**Growth**: Squares with input size. 10x the input means 100x the time.

### O(2^n) - Exponential Time

The algorithm doubles its work with each additional input element.

```python
def fibonacci_recursive(n):
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)

def all_subsets(items):
    if not items:
        return [[]]

    first = items[0]
    rest = items[1:]
    subsets_without_first = all_subsets(rest)
    subsets_with_first = [[first] + subset for subset in subsets_without_first]

    return subsets_without_first + subsets_with_first
```

**Examples**: Naive recursive Fibonacci, generating all subsets, brute-force solutions to many NP problems.

**Growth**: Catastrophic. Adding one element doubles the time. O(2^50) is over a quadrillion operations.

### O(n!) - Factorial Time

The algorithm considers every possible ordering.

```python
def all_permutations(items):
    if len(items) <= 1:
        return [items]

    result = []
    for i, item in enumerate(items):
        remaining = items[:i] + items[i + 1:]
        for perm in all_permutations(remaining):
            result.append([item] + perm)
    return result
```

**Examples**: Generating all permutations, brute-force traveling salesman.

**Growth**: Even worse than exponential. 10! is 3.6 million. 20! is 2.4 quintillion.

## Visual Comparison

For input size n = 100:

| Complexity | Operations |
|------------|------------|
| O(1) | 1 |
| O(log n) | 7 |
| O(n) | 100 |
| O(n log n) | 664 |
| O(n^2) | 10,000 |
| O(2^n) | 1.27 x 10^30 |
| O(n!) | 9.33 x 10^157 |

## Best, Average, and Worst Case

Most algorithms have different performance depending on the input:

**Quicksort example:**
- Best case: O(n log n) - pivot always divides evenly
- Average case: O(n log n) - random data
- Worst case: O(n^2) - already sorted data with naive pivot

**Linear search example:**
- Best case: O(1) - target is first element
- Average case: O(n) - target is in the middle
- Worst case: O(n) - target is last or not present

When we state a single complexity without qualification, we usually mean worst case.

## Amortized Analysis

Some operations are expensive occasionally but cheap on average. We call this **amortized** complexity.

**Dynamic array append:**
- Most appends: O(1)
- Occasional resize: O(n)
- Amortized: O(1) per append

The expensive operations are rare enough that when averaged over all operations, each one is effectively constant time.

## Summary

Big-O notation describes how algorithm performance scales with input size:

- **O(1)**: Constant - same time regardless of input
- **O(log n)**: Logarithmic - halving with each step
- **O(n)**: Linear - proportional to input
- **O(n log n)**: Linearithmic - efficient sorting
- **O(n^2)**: Quadratic - comparing all pairs
- **O(2^n)**: Exponential - doubling with each element
- **O(n!)**: Factorial - all orderings

Remember the rules: drop constants, drop lower-order terms, and typically focus on worst case.

In the next lesson, we will explore the trade-offs between time complexity and space complexity.
