---
title: Lists
order: 1
estimatedMinutes: 20
---

# Lists

Lists are one of Python's most versatile data structures. They store ordered collections of items that can be modified, making them essential for many programming tasks.

## Creating Lists

Create a list using square brackets `[]`:

```python
# Empty list
empty = []

# List of numbers
numbers = [1, 2, 3, 4, 5]

# List of strings
fruits = ["apple", "banana", "cherry"]

# Mixed types (allowed but often not recommended)
mixed = [1, "hello", 3.14, True]

print(numbers)  # [1, 2, 3, 4, 5]
```

## Accessing Elements

Use indexing to access individual elements. Python uses zero-based indexing:

```python
fruits = ["apple", "banana", "cherry", "date"]

print(fruits[0])   # apple (first element)
print(fruits[1])   # banana (second element)
print(fruits[-1])  # date (last element)
print(fruits[-2])  # cherry (second to last)
```

## Modifying Elements

Lists are mutable, meaning you can change their contents:

```python
fruits = ["apple", "banana", "cherry"]

fruits[1] = "blueberry"
print(fruits)  # ["apple", "blueberry", "cherry"]
```

## List Slicing

Extract portions of a list using slicing:

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(numbers[2:5])   # [2, 3, 4] - index 2 to 4
print(numbers[:3])    # [0, 1, 2] - start to index 2
print(numbers[7:])    # [7, 8, 9] - index 7 to end
print(numbers[::2])   # [0, 2, 4, 6, 8] - every 2nd element
print(numbers[::-1])  # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] - reversed
```

## List Length

Use `len()` to get the number of elements:

```python
fruits = ["apple", "banana", "cherry"]
print(len(fruits))  # 3
```

## Adding Elements

### append() - Add to the end

```python
fruits = ["apple", "banana"]
fruits.append("cherry")
print(fruits)  # ["apple", "banana", "cherry"]
```

### insert() - Add at a specific position

```python
fruits = ["apple", "cherry"]
fruits.insert(1, "banana")
print(fruits)  # ["apple", "banana", "cherry"]
```

### extend() - Add multiple elements

```python
fruits = ["apple", "banana"]
more_fruits = ["cherry", "date"]
fruits.extend(more_fruits)
print(fruits)  # ["apple", "banana", "cherry", "date"]

# Or use +=
fruits += ["elderberry"]
print(fruits)  # ["apple", "banana", "cherry", "date", "elderberry"]
```

## Removing Elements

### remove() - Remove by value

```python
fruits = ["apple", "banana", "cherry"]
fruits.remove("banana")
print(fruits)  # ["apple", "cherry"]
```

### pop() - Remove by index (returns the removed element)

```python
fruits = ["apple", "banana", "cherry"]
removed = fruits.pop(1)
print(removed)  # banana
print(fruits)   # ["apple", "cherry"]

# pop() without index removes the last element
last = fruits.pop()
print(last)     # cherry
```

### del - Delete by index or slice

```python
fruits = ["apple", "banana", "cherry", "date"]
del fruits[1]
print(fruits)  # ["apple", "cherry", "date"]

del fruits[0:2]
print(fruits)  # ["date"]
```

### clear() - Remove all elements

```python
fruits = ["apple", "banana", "cherry"]
fruits.clear()
print(fruits)  # []
```

## Finding Elements

### in - Check if element exists

```python
fruits = ["apple", "banana", "cherry"]

print("apple" in fruits)     # True
print("grape" in fruits)     # False
print("grape" not in fruits) # True
```

### index() - Find position of element

```python
fruits = ["apple", "banana", "cherry"]
position = fruits.index("banana")
print(position)  # 1

# Raises ValueError if not found
# fruits.index("grape")  # ValueError
```

### count() - Count occurrences

```python
numbers = [1, 2, 2, 3, 2, 4, 2]
count = numbers.count(2)
print(count)  # 4
```

## Sorting Lists

### sort() - Sort in place

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
numbers.sort()
print(numbers)  # [1, 1, 2, 3, 4, 5, 6, 9]

# Sort in descending order
numbers.sort(reverse=True)
print(numbers)  # [9, 6, 5, 4, 3, 2, 1, 1]
```

### sorted() - Return a new sorted list

```python
original = [3, 1, 4, 1, 5]
sorted_list = sorted(original)
print(original)     # [3, 1, 4, 1, 5] - unchanged
print(sorted_list)  # [1, 1, 3, 4, 5]
```

### reverse() - Reverse in place

```python
numbers = [1, 2, 3, 4, 5]
numbers.reverse()
print(numbers)  # [5, 4, 3, 2, 1]
```

## Copying Lists

Be careful with assignment - it creates a reference, not a copy:

```python
original = [1, 2, 3]
reference = original  # Both point to same list!
reference.append(4)
print(original)  # [1, 2, 3, 4] - original also changed!
```

Create a true copy:

```python
original = [1, 2, 3]

# Method 1: copy()
copy1 = original.copy()

# Method 2: slicing
copy2 = original[:]

# Method 3: list() constructor
copy3 = list(original)

copy1.append(4)
print(original)  # [1, 2, 3] - unchanged
print(copy1)     # [1, 2, 3, 4]
```

## List Comprehensions

Create lists with concise syntax:

```python
# Traditional approach
squares = []
for x in range(5):
    squares.append(x ** 2)

# List comprehension
squares = [x ** 2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]

# With condition
evens = [x for x in range(10) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8]
```

## Nested Lists

Lists can contain other lists:

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

print(matrix[0])     # [1, 2, 3]
print(matrix[0][1])  # 2
print(matrix[1][2])  # 6
```

## Key Takeaways

1. Lists are ordered, mutable collections
2. Access elements with indices (zero-based)
3. Use slicing to get portions of a list
4. Common methods: `append()`, `insert()`, `remove()`, `pop()`
5. Check membership with `in`
6. Be careful with references vs. copies
7. List comprehensions provide concise syntax for creating lists

Next, we'll explore tuples - immutable sequences in Python.
