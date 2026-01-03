---
title: Sorting Algorithms
order: 3
estimatedMinutes: 25
---

# Sorting Algorithms

Sorting arranges data in a specific order. Understanding basic sorting algorithms teaches important algorithmic thinking, even though Python's built-in sort is usually the best choice.

## Why Learn Sorting?

1. **Interview questions**: Common topic in coding interviews
2. **Algorithm foundations**: Teaches comparison, swapping, and optimization
3. **Problem-solving patterns**: Techniques apply to many other problems
4. **Understanding tradeoffs**: Space vs. time, stability, best/worst cases

## Bubble Sort

The simplest sorting algorithm. Repeatedly swaps adjacent elements if they're in the wrong order.

### How It Works

1. Compare adjacent pairs
2. Swap if out of order
3. Repeat until no swaps needed

### Implementation

```python
def bubble_sort(items):
    """
    Sort items using bubble sort.

    Args:
        items: List to sort (modified in place).

    Returns:
        The sorted list.
    """
    n = len(items)

    for i in range(n):
        # Flag to detect if any swaps occurred
        swapped = False

        # Last i elements are already sorted
        for j in range(n - 1 - i):
            if items[j] > items[j + 1]:
                # Swap
                items[j], items[j + 1] = items[j + 1], items[j]
                swapped = True

        # If no swaps, list is sorted
        if not swapped:
            break

    return items
```

### Step-by-Step Example

```
Initial: [5, 3, 8, 1, 2]

Pass 1:
  Compare 5,3 -> swap -> [3, 5, 8, 1, 2]
  Compare 5,8 -> ok    -> [3, 5, 8, 1, 2]
  Compare 8,1 -> swap -> [3, 5, 1, 8, 2]
  Compare 8,2 -> swap -> [3, 5, 1, 2, 8]
  (8 is now in place)

Pass 2:
  Compare 3,5 -> ok    -> [3, 5, 1, 2, 8]
  Compare 5,1 -> swap -> [3, 1, 5, 2, 8]
  Compare 5,2 -> swap -> [3, 1, 2, 5, 8]
  (5 is now in place)

Pass 3:
  Compare 3,1 -> swap -> [1, 3, 2, 5, 8]
  Compare 3,2 -> swap -> [1, 2, 3, 5, 8]
  (3 is now in place)

Pass 4:
  Compare 1,2 -> ok    -> [1, 2, 3, 5, 8]
  (No swaps - done!)

Final: [1, 2, 3, 5, 8]
```

### Time Complexity

- **Best case**: O(n) - Already sorted (with optimization)
- **Worst case**: O(n^2) - Reverse sorted
- **Average case**: O(n^2)

## Selection Sort

Finds the minimum element and places it at the beginning. Repeats for the remaining unsorted portion.

### How It Works

1. Find the minimum in the unsorted portion
2. Swap it with the first unsorted element
3. Move the boundary of sorted portion
4. Repeat

### Implementation

```python
def selection_sort(items):
    """
    Sort items using selection sort.

    Args:
        items: List to sort (modified in place).

    Returns:
        The sorted list.
    """
    n = len(items)

    for i in range(n):
        # Find minimum in unsorted portion
        min_index = i
        for j in range(i + 1, n):
            if items[j] < items[min_index]:
                min_index = j

        # Swap with first unsorted element
        items[i], items[min_index] = items[min_index], items[i]

    return items
```

### Step-by-Step Example

```
Initial: [5, 3, 8, 1, 2]

Pass 1: Find min in [5,3,8,1,2] = 1 at index 3
        Swap with index 0 -> [1, 3, 8, 5, 2]

Pass 2: Find min in [3,8,5,2] = 2 at index 4
        Swap with index 1 -> [1, 2, 8, 5, 3]

Pass 3: Find min in [8,5,3] = 3 at index 4
        Swap with index 2 -> [1, 2, 3, 5, 8]

Pass 4: Find min in [5,8] = 5 at index 3
        Already in place -> [1, 2, 3, 5, 8]

Final: [1, 2, 3, 5, 8]
```

### Time Complexity

- **All cases**: O(n^2)

Selection sort always does the same number of comparisons, regardless of input.

## Insertion Sort

Builds the sorted array one element at a time by inserting each element into its correct position.

### How It Works

1. Start with the second element
2. Compare with elements before it
3. Shift larger elements right
4. Insert element in correct position
5. Repeat for remaining elements

### Implementation

```python
def insertion_sort(items):
    """
    Sort items using insertion sort.

    Args:
        items: List to sort (modified in place).

    Returns:
        The sorted list.
    """
    for i in range(1, len(items)):
        key = items[i]  # Element to insert
        j = i - 1

        # Shift elements greater than key
        while j >= 0 and items[j] > key:
            items[j + 1] = items[j]
            j -= 1

        # Insert key in correct position
        items[j + 1] = key

    return items
```

### Step-by-Step Example

```
Initial: [5, 3, 8, 1, 2]

Pass 1: Insert 3 into [5]
        3 < 5, shift 5 right -> [5, 5, 8, 1, 2]
        Insert 3 -> [3, 5, 8, 1, 2]

Pass 2: Insert 8 into [3, 5]
        8 > 5, already correct -> [3, 5, 8, 1, 2]

Pass 3: Insert 1 into [3, 5, 8]
        1 < 8, shift 8 -> [3, 5, 8, 8, 2]
        1 < 5, shift 5 -> [3, 5, 5, 8, 2]
        1 < 3, shift 3 -> [3, 3, 5, 8, 2]
        Insert 1 -> [1, 3, 5, 8, 2]

Pass 4: Insert 2 into [1, 3, 5, 8]
        2 < 8, shift 8 -> [1, 3, 5, 8, 8]
        2 < 5, shift 5 -> [1, 3, 5, 5, 8]
        2 < 3, shift 3 -> [1, 3, 3, 5, 8]
        2 > 1, stop
        Insert 2 -> [1, 2, 3, 5, 8]

Final: [1, 2, 3, 5, 8]
```

### Time Complexity

- **Best case**: O(n) - Already sorted
- **Worst case**: O(n^2) - Reverse sorted
- **Average case**: O(n^2)

### When to Use Insertion Sort

- Small datasets (< 50 elements)
- Nearly sorted data
- Online sorting (data arrives one at a time)

## Comparison Table

| Algorithm | Best | Average | Worst | Space | Stable? |
|-----------|------|---------|-------|-------|---------|
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | No |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | Yes |

**Stable** means equal elements maintain their relative order.

## Python's Built-in Sorting

For production code, always use Python's built-in sort. It uses Timsort, which is O(n log n).

### list.sort() - In-place

```python
numbers = [5, 3, 8, 1, 2]
numbers.sort()
print(numbers)  # [1, 2, 3, 5, 8]

# Reverse order
numbers.sort(reverse=True)
print(numbers)  # [8, 5, 3, 2, 1]
```

### sorted() - Returns new list

```python
numbers = [5, 3, 8, 1, 2]
sorted_numbers = sorted(numbers)
print(sorted_numbers)  # [1, 2, 3, 5, 8]
print(numbers)         # [5, 3, 8, 1, 2] (unchanged)
```

### Custom Sort Keys

```python
# Sort by length
words = ["banana", "apple", "cherry", "date"]
words.sort(key=len)
print(words)  # ['date', 'apple', 'banana', 'cherry']

# Sort by second element
pairs = [(1, 'b'), (3, 'a'), (2, 'c')]
pairs.sort(key=lambda x: x[1])
print(pairs)  # [(3, 'a'), (1, 'b'), (2, 'c')]

# Sort objects by attribute
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

people = [Person("Alice", 30), Person("Bob", 25), Person("Charlie", 35)]
people.sort(key=lambda p: p.age)
# Now sorted by age: Bob (25), Alice (30), Charlie (35)
```

### Multiple Sort Criteria

```python
students = [
    ("Alice", "B", 85),
    ("Bob", "A", 92),
    ("Charlie", "B", 88),
    ("David", "A", 78),
]

# Sort by grade, then by score (descending)
students.sort(key=lambda s: (s[1], -s[2]))
print(students)
# [('Bob', 'A', 92), ('David', 'A', 78), ('Charlie', 'B', 88), ('Alice', 'B', 85)]
```

## Visualizing the Algorithms

```python
def visualize_sort(sort_func, items):
    """Print each step of sorting."""
    items = items.copy()
    print(f"Initial: {items}")

    # Modified sort functions would print each step
    result = sort_func(items)
    print(f"Final:   {result}")
```

## Practical Applications

### Sorting with Tie-Breakers

```python
def rank_players(players):
    """
    Rank players by score, then alphabetically.

    Args:
        players: List of (name, score) tuples.

    Returns:
        Sorted list with ranks.
    """
    # Sort by score (descending), then name (ascending)
    sorted_players = sorted(players, key=lambda p: (-p[1], p[0]))

    # Add ranks
    result = []
    for rank, (name, score) in enumerate(sorted_players, 1):
        result.append((rank, name, score))

    return result

players = [("Alice", 100), ("Bob", 85), ("Charlie", 100), ("David", 85)]
print(rank_players(players))
# [(1, 'Alice', 100), (2, 'Charlie', 100), (3, 'Bob', 85), (4, 'David', 85)]
```

## Try It Yourself

1. Implement bubble sort and count the number of swaps
2. Modify selection sort to sort in descending order
3. Sort a list of dictionaries by a specific key
4. Implement a stable sort for playing cards (by suit, then value)

## Key Takeaways

1. Bubble, selection, insertion: O(n^2), good for learning
2. Insertion sort is efficient for nearly-sorted data
3. Python's built-in sort uses Timsort: O(n log n)
4. Use `list.sort()` for in-place, `sorted()` for new list
5. Custom sorting with `key` parameter
6. Stable sorts preserve order of equal elements

Next, we'll explore recursion, a powerful technique used in many advanced algorithms.
