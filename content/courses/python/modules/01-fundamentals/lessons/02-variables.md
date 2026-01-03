---
title: Variables and Assignment
order: 2
estimatedMinutes: 15
---

# Variables: Storing Data

Variables are like labeled containers that hold data. They let you store values and use them later in your program.

## Creating Variables

Use the `=` operator to assign a value to a variable:

```python
name = "Alice"
age = 25
height = 5.7
```

## Variable Names

Choose descriptive names that explain what the variable holds:

```python
# Good variable names
user_name = "Bob"
total_score = 100
is_active = True

# Avoid single letters (except for loops)
x = "Bob"  # What is x? Not clear!
```

### Naming Rules

- Must start with a letter or underscore
- Can contain letters, numbers, and underscores
- Case-sensitive (`name` and `Name` are different)
- Cannot use Python keywords (`if`, `for`, `while`, etc.)

```python
# Valid names
my_variable = 1
_private = 2
camelCase = 3
snake_case = 4  # Python convention

# Invalid names
# 2fast = "error"  # Can't start with number
# my-var = "error"  # No hyphens
# for = "error"    # Can't use keywords
```

## Using Variables

Once created, use the variable name to access its value:

```python
greeting = "Hello"
name = "World"

print(greeting)      # Output: Hello
print(name)          # Output: World
print(greeting, name) # Output: Hello World
```

## Reassigning Variables

Variables can change value:

```python
score = 0
print(score)  # Output: 0

score = 10
print(score)  # Output: 10

score = score + 5
print(score)  # Output: 15
```

## f-Strings: Formatted String Literals

Embed variables directly in strings using f-strings:

```python
name = "Alice"
age = 25

# Using f-string (prefix with f)
message = f"My name is {name} and I am {age} years old."
print(message)
# Output: My name is Alice and I am 25 years old.
```

The `f` before the string enables curly brace `{}` substitution.

## Multiple Assignment

Assign multiple variables in one line:

```python
x, y, z = 1, 2, 3
print(x, y, z)  # Output: 1 2 3

# Same value to multiple variables
a = b = c = 0
print(a, b, c)  # Output: 0 0 0
```

## Key Takeaways

1. Variables store data using `=` assignment
2. Use descriptive, snake_case names
3. Variables can be reassigned to new values
4. f-strings let you embed variables in strings with `{}`
5. Python is dynamically typed - variables can hold any type

Next, we'll explore the different data types that variables can hold.
