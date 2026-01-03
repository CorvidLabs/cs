---
title: Dictionaries
order: 3
estimatedMinutes: 20
---

# Dictionaries

Dictionaries are Python's built-in mapping type. They store key-value pairs, allowing fast lookup of values by their keys. Think of them like a real dictionary: you look up a word (key) to find its definition (value).

## Creating Dictionaries

Create dictionaries using curly braces `{}` or the `dict()` constructor:

```python
# Empty dictionary
empty = {}

# Dictionary with initial values
person = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}

# Using dict() constructor
person = dict(name="Alice", age=25, city="New York")

print(person)
# {"name": "Alice", "age": 25, "city": "New York"}
```

## Accessing Values

Access values using their keys:

```python
person = {"name": "Alice", "age": 25, "city": "New York"}

# Using square brackets
print(person["name"])  # Alice
print(person["age"])   # 25

# KeyError if key doesn't exist
# print(person["email"])  # KeyError: 'email'
```

### The get() Method

Use `get()` to avoid KeyError:

```python
person = {"name": "Alice", "age": 25}

# Returns None if key doesn't exist
email = person.get("email")
print(email)  # None

# Provide a default value
email = person.get("email", "not provided")
print(email)  # not provided
```

## Modifying Dictionaries

### Adding and Updating Values

```python
person = {"name": "Alice", "age": 25}

# Add new key-value pair
person["email"] = "alice@example.com"

# Update existing value
person["age"] = 26

print(person)
# {"name": "Alice", "age": 26, "email": "alice@example.com"}
```

### update() - Add/update multiple values

```python
person = {"name": "Alice", "age": 25}

person.update({"age": 26, "city": "Boston", "email": "alice@example.com"})

print(person)
# {"name": "Alice", "age": 26, "city": "Boston", "email": "alice@example.com"}
```

### Removing Values

```python
person = {"name": "Alice", "age": 25, "city": "New York"}

# del - Remove by key
del person["city"]

# pop() - Remove and return value
age = person.pop("age")
print(age)  # 25

# pop() with default (no error if missing)
city = person.pop("city", "Unknown")
print(city)  # Unknown

# popitem() - Remove and return last item (Python 3.7+)
person = {"a": 1, "b": 2, "c": 3}
item = person.popitem()
print(item)  # ("c", 3)

# clear() - Remove all items
person.clear()
print(person)  # {}
```

## Checking for Keys

```python
person = {"name": "Alice", "age": 25}

# Check if key exists
print("name" in person)      # True
print("email" in person)     # False
print("email" not in person) # True
```

## Iterating Over Dictionaries

```python
person = {"name": "Alice", "age": 25, "city": "New York"}

# Iterate over keys (default)
for key in person:
    print(key)
# name, age, city

# Iterate over keys explicitly
for key in person.keys():
    print(key)

# Iterate over values
for value in person.values():
    print(value)
# Alice, 25, New York

# Iterate over key-value pairs
for key, value in person.items():
    print(f"{key}: {value}")
# name: Alice
# age: 25
# city: New York
```

## Dictionary Methods

```python
person = {"name": "Alice", "age": 25}

# Get all keys
keys = person.keys()
print(list(keys))  # ["name", "age"]

# Get all values
values = person.values()
print(list(values))  # ["Alice", 25]

# Get all key-value pairs as tuples
items = person.items()
print(list(items))  # [("name", "Alice"), ("age", 25)]

# Get length
print(len(person))  # 2
```

### setdefault() - Get or Set Default

```python
person = {"name": "Alice"}

# Get existing value
name = person.setdefault("name", "Unknown")
print(name)  # Alice

# Set and return default for missing key
age = person.setdefault("age", 0)
print(age)     # 0
print(person)  # {"name": "Alice", "age": 0}
```

## Dictionary Comprehensions

Create dictionaries with concise syntax:

```python
# Square numbers
squares = {x: x**2 for x in range(5)}
print(squares)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Filter while creating
even_squares = {x: x**2 for x in range(10) if x % 2 == 0}
print(even_squares)  # {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

# Transform existing dictionary
prices = {"apple": 1.00, "banana": 0.50, "cherry": 2.00}
discounted = {fruit: price * 0.9 for fruit, price in prices.items()}
print(discounted)
```

## Nested Dictionaries

Dictionaries can contain other dictionaries:

```python
students = {
    "alice": {
        "age": 22,
        "grades": {"math": 95, "english": 88}
    },
    "bob": {
        "age": 20,
        "grades": {"math": 78, "english": 92}
    }
}

# Access nested values
print(students["alice"]["age"])             # 22
print(students["alice"]["grades"]["math"])  # 95

# Modify nested values
students["alice"]["grades"]["math"] = 97
```

## Valid Dictionary Keys

Keys must be immutable (hashable):

```python
# Valid keys
valid = {
    "string": 1,
    42: 2,
    (1, 2): 3,
    True: 4
}

# Invalid keys (mutable types)
# invalid = {[1, 2]: "list"}  # TypeError: unhashable type: 'list'
# invalid = {{}: "dict"}      # TypeError: unhashable type: 'dict'
```

## Practical Examples

### Word Frequency Counter

```python
def count_words(text):
    words = text.lower().split()
    frequency = {}
    for word in words:
        frequency[word] = frequency.get(word, 0) + 1
    return frequency

text = "the cat and the dog and the fish"
counts = count_words(text)
print(counts)
# {"the": 3, "cat": 1, "and": 2, "dog": 1, "fish": 1}
```

### Grouping Data

```python
students = [
    {"name": "Alice", "grade": "A"},
    {"name": "Bob", "grade": "B"},
    {"name": "Charlie", "grade": "A"},
    {"name": "Diana", "grade": "B"}
]

by_grade = {}
for student in students:
    grade = student["grade"]
    if grade not in by_grade:
        by_grade[grade] = []
    by_grade[grade].append(student["name"])

print(by_grade)
# {"A": ["Alice", "Charlie"], "B": ["Bob", "Diana"]}
```

### Configuration Storage

```python
config = {
    "database": {
        "host": "localhost",
        "port": 5432,
        "name": "myapp"
    },
    "cache": {
        "enabled": True,
        "ttl": 3600
    },
    "debug": False
}

# Access configuration
db_host = config["database"]["host"]
cache_enabled = config["cache"]["enabled"]
```

## Merging Dictionaries

```python
dict1 = {"a": 1, "b": 2}
dict2 = {"c": 3, "d": 4}

# Python 3.9+ - Union operator
merged = dict1 | dict2
print(merged)  # {"a": 1, "b": 2, "c": 3, "d": 4}

# Earlier versions - unpacking
merged = {**dict1, **dict2}
print(merged)  # {"a": 1, "b": 2, "c": 3, "d": 4}
```

## Key Takeaways

1. Dictionaries store key-value pairs
2. Access values using `dict[key]` or `dict.get(key)`
3. Keys must be immutable (strings, numbers, tuples)
4. Use `in` to check for key existence
5. Iterate with `.keys()`, `.values()`, or `.items()`
6. Dictionary comprehensions create dictionaries concisely
7. Dictionaries are ordered (Python 3.7+)

Next, we'll explore sets - unordered collections of unique elements.
