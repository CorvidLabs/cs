---
title: Sets and Comprehensions
order: 4
estimatedMinutes: 20
---

# Sets and Comprehensions

Sets are unordered collections of unique items. Comprehensions provide concise syntax for creating collections.

## Creating Sets

```python
# With curly braces
fruits = {"apple", "banana", "cherry"}

# Empty set (not {} - that's an empty dict!)
empty = set()

# From other iterables
from_list = set([1, 2, 2, 3, 3, 3])  # {1, 2, 3}
from_string = set("hello")  # {'h', 'e', 'l', 'o'}
```

## Sets Have Unique Elements

```python
numbers = {1, 2, 2, 3, 3, 3, 4}
print(numbers)  # {1, 2, 3, 4}

# Useful for removing duplicates
names = ["Alice", "Bob", "Alice", "Charlie", "Bob"]
unique_names = set(names)  # {'Alice', 'Bob', 'Charlie'}
```

## Sets Are Unordered

```python
letters = {"c", "a", "b"}
print(letters)  # Order not guaranteed

# No indexing!
# print(letters[0])  # TypeError!

# Convert to list if you need ordering
sorted_letters = sorted(letters)  # ['a', 'b', 'c']
```

## Modifying Sets

```python
fruits = {"apple", "banana"}

# Add single item
fruits.add("cherry")
print(fruits)  # {'apple', 'banana', 'cherry'}

# Add multiple items
fruits.update(["date", "elderberry"])
print(fruits)  # {'apple', 'banana', 'cherry', 'date', 'elderberry'}

# Remove item (raises error if missing)
fruits.remove("banana")

# Remove item (no error if missing)
fruits.discard("fig")

# Remove and return arbitrary item
item = fruits.pop()

# Clear all items
fruits.clear()
```

## Set Operations

Sets support mathematical set operations:

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# Union (all items from both)
print(a | b)           # {1, 2, 3, 4, 5, 6}
print(a.union(b))      # {1, 2, 3, 4, 5, 6}

# Intersection (items in both)
print(a & b)           # {3, 4}
print(a.intersection(b))  # {3, 4}

# Difference (items in a but not b)
print(a - b)           # {1, 2}
print(a.difference(b)) # {1, 2}

# Symmetric difference (items in either, not both)
print(a ^ b)           # {1, 2, 5, 6}
print(a.symmetric_difference(b))  # {1, 2, 5, 6}
```

## Set Comparisons

```python
a = {1, 2, 3}
b = {1, 2, 3, 4, 5}
c = {1, 2, 3}

# Subset (all items in a are in b)
print(a <= b)             # True
print(a.issubset(b))      # True

# Proper subset (subset but not equal)
print(a < b)              # True

# Superset (all items in b are in a)
print(b >= a)             # True
print(b.issuperset(a))    # True

# Equality
print(a == c)             # True

# Disjoint (no common elements)
x = {1, 2}
y = {3, 4}
print(x.isdisjoint(y))    # True
```

## Frozen Sets

Immutable sets (can be used as dictionary keys):

```python
frozen = frozenset([1, 2, 3])
# frozen.add(4)  # AttributeError!

# Can use as dictionary key
cache = {frozenset([1, 2]): "result"}
```

## List Comprehensions

Create lists with concise syntax:

```python
# Basic comprehension
squares = [x**2 for x in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]

# With condition
evens = [x for x in range(10) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8]

# Transform and filter
words = ["hello", "WORLD", "Python"]
lower_long = [w.lower() for w in words if len(w) > 4]
print(lower_long)  # ['hello', 'world', 'python']
```

### Equivalent Loop

```python
# Comprehension
squares = [x**2 for x in range(1, 6)]

# Equivalent loop
squares = []
for x in range(1, 6):
    squares.append(x**2)
```

### Nested Comprehensions

```python
# Flatten a matrix
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [n for row in matrix for n in row]
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Create a matrix
matrix = [[i * j for j in range(1, 4)] for i in range(1, 4)]
print(matrix)  # [[1, 2, 3], [2, 4, 6], [3, 6, 9]]
```

### Conditional Expression in Comprehension

```python
# if-else in comprehension
labels = ["even" if x % 2 == 0 else "odd" for x in range(5)]
print(labels)  # ['even', 'odd', 'even', 'odd', 'even']
```

## Set Comprehensions

Same syntax with curly braces:

```python
# Unique squares
squares = {x**2 for x in [1, -1, 2, -2, 3, -3]}
print(squares)  # {1, 4, 9}

# First letters
words = ["apple", "banana", "apricot", "cherry"]
first_letters = {w[0] for w in words}
print(first_letters)  # {'a', 'b', 'c'}
```

## Dictionary Comprehensions

```python
# Squares dictionary
squares = {x: x**2 for x in range(1, 6)}
print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Swap keys and values
original = {"a": 1, "b": 2, "c": 3}
swapped = {v: k for k, v in original.items()}
print(swapped)  # {1: 'a', 2: 'b', 3: 'c'}

# Filter dictionary
scores = {"Alice": 85, "Bob": 62, "Charlie": 91}
passing = {k: v for k, v in scores.items() if v >= 70}
print(passing)  # {'Alice': 85, 'Charlie': 91}
```

## Generator Expressions

Like comprehensions, but lazy (generate values on demand):

```python
# Generator expression (parentheses)
gen = (x**2 for x in range(1000000))

# Doesn't create all values immediately
print(next(gen))  # 0
print(next(gen))  # 1

# Useful for memory efficiency
total = sum(x**2 for x in range(1000000))
```

## Practical Examples

### Finding Common Elements

```python
list1 = [1, 2, 3, 4, 5]
list2 = [4, 5, 6, 7, 8]

common = set(list1) & set(list2)
print(common)  # {4, 5}
```

### Removing Duplicates Preserving Order

```python
items = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]

seen = set()
unique = []
for item in items:
    if item not in seen:
        seen.add(item)
        unique.append(item)

print(unique)  # [3, 1, 4, 5, 9, 2, 6]
```

### Permission Checking

```python
user_permissions = {"read", "write"}
required_permissions = {"read", "execute"}

if required_permissions <= user_permissions:
    print("Access granted")
else:
    missing = required_permissions - user_permissions
    print(f"Missing permissions: {missing}")
```

### Data Processing with Comprehensions

```python
# Parse and filter data
raw_data = ["10", "abc", "20", "def", "30"]
numbers = [int(x) for x in raw_data if x.isdigit()]
print(numbers)  # [10, 20, 30]

# Transform dictionary values
prices = {"apple": 1.0, "banana": 0.5}
with_tax = {k: round(v * 1.1, 2) for k, v in prices.items()}
print(with_tax)  # {'apple': 1.1, 'banana': 0.55}
```

## When to Use Each Collection

| Collection | Use When |
|------------|----------|
| List | Ordered, may have duplicates, need indexing |
| Tuple | Ordered, immutable, fixed data |
| Set | Need uniqueness, set operations |
| Dict | Key-value lookups |

## Try It Yourself

1. Find unique words in a sentence using a set
2. Create a list of all even numbers from 1-100 using comprehension
3. Use set operations to find common friends between two users
4. Create a dictionary mapping numbers to their cubes

## Key Takeaways

1. Sets store unique, unordered items: `{1, 2, 3}`
2. Set operations: union `|`, intersection `&`, difference `-`
3. List comprehension: `[expr for item in iterable if condition]`
4. Set comprehension: `{expr for item in iterable if condition}`
5. Dict comprehension: `{key: value for item in iterable}`
6. Generator expressions are memory-efficient for large data

You've completed the Collections module! You can now work effectively with Python's built-in data structures.
