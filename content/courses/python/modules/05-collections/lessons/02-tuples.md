---
title: Tuples
order: 2
estimatedMinutes: 15
---

# Tuples

Tuples are ordered, immutable sequences in Python. Once created, their contents cannot be changed. This immutability makes them useful for data that shouldn't be modified.

## Creating Tuples

Create tuples using parentheses `()` or just commas:

```python
# Empty tuple
empty = ()

# Tuple with parentheses
coordinates = (10, 20)

# Tuple without parentheses (comma creates the tuple)
point = 3, 4

# Single element tuple (comma is required!)
single = (42,)
not_a_tuple = (42)  # This is just an integer!

print(type(single))       # <class 'tuple'>
print(type(not_a_tuple))  # <class 'int'>
```

## Accessing Elements

Access tuple elements just like lists:

```python
colors = ("red", "green", "blue")

print(colors[0])   # red
print(colors[-1])  # blue
print(colors[1:])  # ("green", "blue")
```

## Tuples are Immutable

You cannot modify tuple elements:

```python
point = (10, 20)

# This raises an error:
# point[0] = 15  # TypeError: 'tuple' object does not support item assignment

# This is also not allowed:
# point.append(30)  # AttributeError: 'tuple' object has no attribute 'append'
```

## Why Use Tuples?

### 1. Data Integrity

When data shouldn't change:

```python
# Configuration that should remain constant
DATABASE_CONFIG = ("localhost", 5432, "mydb")
```

### 2. Dictionary Keys

Unlike lists, tuples can be dictionary keys because they're hashable:

```python
# Using tuple as dictionary key
locations = {
    (40.7128, -74.0060): "New York",
    (51.5074, -0.1278): "London"
}

print(locations[(40.7128, -74.0060)])  # New York

# Lists can't be keys:
# locations[[1, 2]] = "Error"  # TypeError: unhashable type: 'list'
```

### 3. Multiple Return Values

Functions often return tuples:

```python
def get_user():
    return "Alice", 25, "alice@example.com"

name, age, email = get_user()  # Tuple unpacking
print(name)   # Alice
print(age)    # 25
print(email)  # alice@example.com
```

### 4. Performance

Tuples are slightly more memory-efficient than lists.

## Tuple Unpacking

Extract tuple elements into variables:

```python
point = (10, 20, 30)

# Unpack all elements
x, y, z = point
print(x, y, z)  # 10 20 30

# Swap variables (uses implicit tuples)
a, b = 1, 2
a, b = b, a
print(a, b)  # 2 1

# Unpack with * for remaining elements
first, *rest = (1, 2, 3, 4, 5)
print(first)  # 1
print(rest)   # [2, 3, 4, 5]  (note: becomes a list)

*start, last = (1, 2, 3, 4, 5)
print(start)  # [1, 2, 3, 4]
print(last)   # 5
```

## Tuple Operations

### Concatenation and Repetition

```python
tuple1 = (1, 2, 3)
tuple2 = (4, 5, 6)

# Concatenation creates a new tuple
combined = tuple1 + tuple2
print(combined)  # (1, 2, 3, 4, 5, 6)

# Repetition
repeated = tuple1 * 3
print(repeated)  # (1, 2, 3, 1, 2, 3, 1, 2, 3)
```

### Membership Testing

```python
colors = ("red", "green", "blue")

print("red" in colors)     # True
print("yellow" in colors)  # False
```

### Length, Min, Max

```python
numbers = (3, 1, 4, 1, 5, 9, 2, 6)

print(len(numbers))  # 8
print(min(numbers))  # 1
print(max(numbers))  # 9
print(sum(numbers))  # 31
```

## Tuple Methods

Tuples have only two methods (due to immutability):

### count() - Count occurrences

```python
numbers = (1, 2, 2, 3, 2, 4, 2)
print(numbers.count(2))  # 4
```

### index() - Find position

```python
colors = ("red", "green", "blue")
print(colors.index("green"))  # 1
```

## Converting Between Lists and Tuples

```python
# List to tuple
my_list = [1, 2, 3]
my_tuple = tuple(my_list)
print(my_tuple)  # (1, 2, 3)

# Tuple to list
my_tuple = (4, 5, 6)
my_list = list(my_tuple)
print(my_list)  # [4, 5, 6]
```

## Named Tuples

For more readable code, use named tuples:

```python
from collections import namedtuple

# Define a named tuple type
Point = namedtuple("Point", ["x", "y"])

# Create instances
p1 = Point(10, 20)
p2 = Point(x=30, y=40)

# Access by name or index
print(p1.x)    # 10
print(p1[0])   # 10
print(p2.y)    # 40

# Still immutable
# p1.x = 15  # AttributeError

# Use in calculations
print(f"Distance from origin: {(p1.x**2 + p1.y**2)**0.5}")
```

## Practical Examples

### Returning Multiple Values

```python
def analyze_text(text):
    words = text.split()
    word_count = len(words)
    char_count = len(text)
    avg_word_length = char_count / word_count if word_count > 0 else 0
    return word_count, char_count, avg_word_length

words, chars, avg = analyze_text("Hello World")
print(f"Words: {words}, Characters: {chars}, Avg length: {avg:.1f}")
```

### Storing Records

```python
# Database-like records
students = [
    ("Alice", 22, "Computer Science"),
    ("Bob", 20, "Mathematics"),
    ("Charlie", 21, "Physics")
]

for name, age, major in students:
    print(f"{name} ({age}) studies {major}")
```

### Coordinate Systems

```python
# 2D points
points = [(0, 0), (10, 5), (3, 8), (7, 2)]

# Find closest to origin
def distance_from_origin(point):
    x, y = point
    return (x**2 + y**2) ** 0.5

closest = min(points, key=distance_from_origin)
print(f"Closest to origin: {closest}")
```

## Tuples vs Lists: When to Use Which

| Use Tuples When | Use Lists When |
|-----------------|----------------|
| Data shouldn't change | Data needs to be modified |
| Using as dictionary keys | Order might change |
| Returning multiple values | Collection will grow/shrink |
| Heterogeneous data (different types) | Homogeneous data (same types) |

## Key Takeaways

1. Tuples are ordered, immutable sequences
2. Create with parentheses `()` or just commas
3. Single-element tuples need a trailing comma: `(item,)`
4. Tuples can be dictionary keys; lists cannot
5. Use tuple unpacking to extract values
6. Functions often return tuples for multiple values
7. Named tuples improve code readability

Next, we'll explore dictionaries - Python's key-value storage.
