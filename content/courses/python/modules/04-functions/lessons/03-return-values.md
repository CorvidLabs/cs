---
title: Return Values
order: 3
estimatedMinutes: 15
---

# Return Values

Functions can send data back to where they were called using the `return` statement. This allows you to use functions as building blocks that produce results.

## The `return` Statement

Use `return` to send a value back from a function:

```python
def add(a, b):
    return a + b

result = add(3, 5)
print(result)  # 8
```

The function computes `a + b` and sends the result back to the caller.

## Functions Without Return

If a function doesn't have a `return` statement, it returns `None`:

```python
def greet(name):
    print(f"Hello, {name}!")

result = greet("Alice")
print(result)  # None
```

## Using Return Values

Return values can be used in various ways:

```python
def square(n):
    return n * n

# Store in a variable
result = square(4)

# Use directly in expressions
total = square(3) + square(4)  # 9 + 16 = 25

# Use in conditions
if square(5) > 20:
    print("Greater than 20")

# Use in other function calls
print(square(6))  # 36
```

## Return Immediately Exits the Function

When Python encounters `return`, it immediately exits the function:

```python
def check_age(age):
    if age < 0:
        return "Invalid age"
    if age < 18:
        return "Minor"
    return "Adult"
    print("This never runs!")  # Code after return is never executed

print(check_age(25))   # Adult
print(check_age(15))   # Minor
print(check_age(-5))   # Invalid age
```

## Early Returns for Validation

Use early returns to handle edge cases:

```python
def divide(a, b):
    if b == 0:
        return None  # Can't divide by zero
    return a / b

result = divide(10, 2)
if result is not None:
    print(f"Result: {result}")
else:
    print("Division error")
```

## Returning Multiple Values

Python can return multiple values as a tuple:

```python
def get_min_max(numbers):
    return min(numbers), max(numbers)

minimum, maximum = get_min_max([3, 1, 4, 1, 5, 9, 2, 6])
print(f"Min: {minimum}, Max: {maximum}")
# Min: 1, Max: 9
```

This is called tuple unpacking:

```python
def get_coordinates():
    return 10, 20, 30  # Returns a tuple (10, 20, 30)

x, y, z = get_coordinates()
print(f"x={x}, y={y}, z={z}")

# Or capture as a tuple
coords = get_coordinates()
print(coords)  # (10, 20, 30)
```

## Returning Different Types

A function can return different types depending on conditions:

```python
def safe_divide(a, b):
    if b == 0:
        return None
    return a / b

result = safe_divide(10, 2)  # Returns float: 5.0
result = safe_divide(10, 0)  # Returns None
```

However, it's often better to be consistent:

```python
def parse_int(text):
    """Parse text as integer, return 0 on failure."""
    try:
        return int(text)
    except ValueError:
        return 0  # Same type as success case
```

## Returning Boolean Values

Functions often return `True` or `False`:

```python
def is_even(number):
    return number % 2 == 0

def is_valid_email(email):
    return "@" in email and "." in email

print(is_even(4))                    # True
print(is_even(7))                    # False
print(is_valid_email("test@a.com"))  # True
```

These are often called predicate functions.

## Returning Collections

Functions can return lists, dictionaries, or other collections:

```python
def get_factors(n):
    """Return a list of all factors of n."""
    factors = []
    for i in range(1, n + 1):
        if n % i == 0:
            factors.append(i)
    return factors

print(get_factors(12))  # [1, 2, 3, 4, 6, 12]
```

```python
def word_count(text):
    """Return a dictionary with word frequencies."""
    words = text.lower().split()
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts

result = word_count("the cat and the dog")
print(result)  # {'the': 2, 'cat': 1, 'and': 1, 'dog': 1}
```

## Chaining Function Calls

Since functions return values, you can chain them:

```python
def double(n):
    return n * 2

def add_one(n):
    return n + 1

# Chain calls
result = add_one(double(5))  # double(5) = 10, add_one(10) = 11
print(result)  # 11

# Or step by step for clarity
step1 = double(5)     # 10
step2 = add_one(step1) # 11
```

## Practical Example: Calculator Functions

```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return None
    return a / b

def calculate(a, b, operation):
    """Perform calculation based on operation string."""
    if operation == "+":
        return add(a, b)
    elif operation == "-":
        return subtract(a, b)
    elif operation == "*":
        return multiply(a, b)
    elif operation == "/":
        return divide(a, b)
    else:
        return None

# Use the calculator
print(calculate(10, 5, "+"))  # 15
print(calculate(10, 5, "-"))  # 5
print(calculate(10, 5, "*"))  # 50
print(calculate(10, 5, "/"))  # 2.0
```

## Practical Example: Data Processing

```python
def get_stats(numbers):
    """Calculate statistics for a list of numbers."""
    if not numbers:
        return None, None, None

    total = sum(numbers)
    count = len(numbers)
    average = total / count

    return total, average, count

data = [10, 20, 30, 40, 50]
total, avg, count = get_stats(data)
print(f"Sum: {total}, Average: {avg}, Count: {count}")
# Sum: 150, Average: 30.0, Count: 5
```

## Key Takeaways

1. `return` sends a value back to the caller
2. Functions without `return` return `None`
3. `return` immediately exits the function
4. Use early returns for validation and edge cases
5. Return multiple values using tuples
6. Returned values can be used in expressions
7. Functions can return any type of value

Next, we'll explore variable scope and how variables work inside and outside functions.
