---
title: List Comprehensions
order: 3
estimatedMinutes: 18
---

# List Comprehensions

List comprehensions provide a concise way to create lists. They're a powerful Python feature for transforming and filtering data in a single, readable line.

## Basic Syntax

A list comprehension creates a new list by applying an expression to each item:

```python
# Traditional loop
squares = []
for x in range(5):
    squares.append(x ** 2)
print(squares)  # [0, 1, 4, 9, 16]

# List comprehension
squares = [x ** 2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]
```

The pattern is: `[expression for item in iterable]`

## Transforming Data

Apply operations to each element:

```python
# Convert to uppercase
names = ['alice', 'bob', 'carol']
upper_names = [name.upper() for name in names]
print(upper_names)  # ['ALICE', 'BOB', 'CAROL']

# Calculate lengths
lengths = [len(name) for name in names]
print(lengths)  # [5, 3, 5]

# Double each number
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(doubled)  # [2, 4, 6, 8, 10]
```

## Filtering with Conditions

Add `if` to filter items:

```python
# Only even numbers
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = [n for n in numbers if n % 2 == 0]
print(evens)  # [2, 4, 6, 8, 10]

# Names longer than 4 characters
names = ['Alice', 'Bob', 'Carol', 'Dave', 'Elizabeth']
long_names = [name for name in names if len(name) > 4]
print(long_names)  # ['Alice', 'Carol', 'Elizabeth']

# Positive numbers only
values = [-2, -1, 0, 1, 2, 3]
positive = [v for v in values if v > 0]
print(positive)  # [1, 2, 3]
```

## Transform and Filter Together

Combine transformation and filtering:

```python
# Square only even numbers
numbers = [1, 2, 3, 4, 5, 6]
even_squares = [n ** 2 for n in numbers if n % 2 == 0]
print(even_squares)  # [4, 16, 36]

# Uppercase names that start with 'A'
names = ['Alice', 'Bob', 'Anna', 'Carol']
a_names = [name.upper() for name in names if name.startswith('A')]
print(a_names)  # ['ALICE', 'ANNA']
```

## Conditional Expressions

Use if-else in the expression (before `for`):

```python
# Label as even or odd
numbers = [1, 2, 3, 4, 5]
labels = ['even' if n % 2 == 0 else 'odd' for n in numbers]
print(labels)  # ['odd', 'even', 'odd', 'even', 'odd']

# Pass or fail based on score
scores = [85, 62, 78, 45, 91]
results = ['pass' if s >= 60 else 'fail' for s in scores]
print(results)  # ['pass', 'pass', 'pass', 'fail', 'pass']

# Cap values at a maximum
values = [5, 15, 25, 35]
capped = [min(v, 20) for v in values]
print(capped)  # [5, 15, 20, 20]
```

## Working with Strings

Common string operations:

```python
# Split and process
sentence = "the quick brown fox"
words = [word.capitalize() for word in sentence.split()]
print(words)  # ['The', 'Quick', 'Brown', 'Fox']

# Extract first characters
names = ['Alice', 'Bob', 'Carol']
initials = [name[0] for name in names]
print(initials)  # ['A', 'B', 'C']

# Filter empty strings
data = ['apple', '', 'banana', '', 'cherry']
non_empty = [s for s in data if s]
print(non_empty)  # ['apple', 'banana', 'cherry']
```

## Working with Dictionaries

Extract data from dictionaries:

```python
# Get values for a specific key
students = [
    {'name': 'Alice', 'grade': 90},
    {'name': 'Bob', 'grade': 85},
    {'name': 'Carol', 'grade': 92}
]

names = [s['name'] for s in students]
print(names)  # ['Alice', 'Bob', 'Carol']

grades = [s['grade'] for s in students]
print(grades)  # [90, 85, 92]

# Filter by value
honors = [s['name'] for s in students if s['grade'] >= 90]
print(honors)  # ['Alice', 'Carol']
```

## Nested List Comprehensions

Flatten nested lists:

```python
# Flatten a 2D list
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [num for row in matrix for num in row]
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Process pairs
pairs = [(1, 'a'), (2, 'b'), (3, 'c')]
numbers = [n for n, letter in pairs]
print(numbers)  # [1, 2, 3]
```

Creating nested lists:

```python
# Create a multiplication table
table = [[i * j for j in range(1, 4)] for i in range(1, 4)]
print(table)  # [[1, 2, 3], [4, 6, 8], [7, 8, 9]]
#               [1*1, 1*2, 1*3], [2*1, 2*2, 2*3], [3*1, 3*2, 3*3]
```

## Dictionary Comprehensions

Create dictionaries using similar syntax:

```python
# Square each number
numbers = [1, 2, 3, 4, 5]
squares = {n: n ** 2 for n in numbers}
print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Create lookup from list
names = ['Alice', 'Bob', 'Carol']
name_lengths = {name: len(name) for name in names}
print(name_lengths)  # {'Alice': 5, 'Bob': 3, 'Carol': 5}

# Swap keys and values
original = {'a': 1, 'b': 2, 'c': 3}
swapped = {v: k for k, v in original.items()}
print(swapped)  # {1: 'a', 2: 'b', 3: 'c'}

# Filter dictionary
scores = {'Alice': 90, 'Bob': 65, 'Carol': 85}
passing = {name: score for name, score in scores.items() if score >= 70}
print(passing)  # {'Alice': 90, 'Carol': 85}
```

## Set Comprehensions

Create sets with unique values:

```python
# Unique first letters
names = ['Alice', 'Anna', 'Bob', 'Carol', 'Charlie']
first_letters = {name[0] for name in names}
print(first_letters)  # {'A', 'B', 'C'}

# Unique lengths
words = ['cat', 'dog', 'elephant', 'ant']
lengths = {len(w) for w in words}
print(lengths)  # {3, 8}
```

## Real-World Examples

### Processing CSV-like Data

```python
# Raw data as list of strings
raw_data = [
    "Alice,25,Engineer",
    "Bob,30,Designer",
    "Carol,28,Manager"
]

# Parse into dictionaries
people = [
    {'name': row.split(',')[0],
     'age': int(row.split(',')[1]),
     'role': row.split(',')[2]}
    for row in raw_data
]

# Filter engineers
engineers = [p for p in people if p['role'] == 'Engineer']
```

### Data Cleanup

```python
# Clean messy data
raw_names = ['  Alice  ', 'bob', 'CAROL', '  dave ']
clean = [name.strip().title() for name in raw_names]
print(clean)  # ['Alice', 'Bob', 'Carol', 'Dave']

# Remove None values
data = [1, None, 2, None, 3, None]
valid = [x for x in data if x is not None]
print(valid)  # [1, 2, 3]
```

### Calculations

```python
# Calculate totals from transactions
transactions = [
    {'item': 'apple', 'price': 1.00, 'qty': 3},
    {'item': 'banana', 'price': 0.50, 'qty': 6},
    {'item': 'orange', 'price': 0.75, 'qty': 4}
]

totals = [t['price'] * t['qty'] for t in transactions]
print(totals)  # [3.0, 3.0, 3.0]
print(sum(totals))  # 9.0
```

## When Not to Use Comprehensions

Avoid comprehensions when they become hard to read:

```python
# Too complex - use a regular loop instead
# Bad:
result = [process(x) for x in data if condition1(x) and condition2(x) and x > 10]

# Better:
result = []
for x in data:
    if condition1(x) and condition2(x) and x > 10:
        result.append(process(x))
```

## Key Takeaways

1. List comprehensions follow the pattern `[expression for item in iterable]`
2. Add `if` after the iterable to filter: `[x for x in list if condition]`
3. Use `if-else` in the expression for conditional values: `[a if cond else b for x in list]`
4. Dictionary comprehensions use `{key: value for item in iterable}`
5. Set comprehensions use `{expression for item in iterable}`
6. Keep comprehensions simple - use loops for complex logic

Next, we'll explore basic data analysis techniques.
