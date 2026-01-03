---
title: Data Types
order: 3
estimatedMinutes: 20
---

# Python Data Types

Every value in Python has a type. Understanding data types helps you work with data correctly and avoid common errors.

## The Four Basic Types

Python has four fundamental data types for storing simple values:

```python
name = "Alice"        # str (string) - text
age = 25              # int (integer) - whole numbers
height = 5.7          # float - decimal numbers
is_student = True     # bool (boolean) - True or False
```

## Strings (str)

Strings store text. Enclose them in quotes:

```python
# Single or double quotes work the same
first_name = "Alice"
last_name = 'Smith'

# Use one type of quote to include the other
message = "It's a great day!"
quote = 'She said "Hello"'

# Triple quotes for multi-line strings
poem = """Roses are red,
Violets are blue,
Python is fun,
And so are you!"""
```

### String Operations

```python
# Concatenation (joining)
greeting = "Hello" + " " + "World"
print(greeting)  # Hello World

# Repetition
border = "-" * 20
print(border)  # --------------------

# Length
name = "Alice"
print(len(name))  # 5

# Indexing (0-based)
print(name[0])   # A (first character)
print(name[-1])  # e (last character)

# Slicing
print(name[0:3])  # Ali (characters 0, 1, 2)
print(name[2:])   # ice (from index 2 to end)
```

### Escape Characters

Special characters that start with backslash:

```python
# Newline
print("Hello\nWorld")
# Output:
# Hello
# World

# Tab
print("Name:\tAlice")
# Output: Name:    Alice

# Backslash
print("C:\\Users\\Alice")
# Output: C:\Users\Alice
```

## Integers (int)

Whole numbers, positive or negative, without decimals:

```python
population = 8000000
temperature = -15
zero = 0
```

### Integer Operations

```python
a = 10
b = 3

print(a + b)   # 13 (addition)
print(a - b)   # 7 (subtraction)
print(a * b)   # 30 (multiplication)
print(a / b)   # 3.333... (division - returns float!)
print(a // b)  # 3 (floor division - rounds down)
print(a % b)   # 1 (modulo - remainder)
print(a ** b)  # 1000 (exponentiation - 10^3)
```

### Useful Integer Facts

```python
# No size limit in Python!
big_number = 12345678901234567890123456789
print(big_number)  # Works perfectly

# Underscores for readability
population = 8_000_000
print(population)  # 8000000

# Different bases
binary = 0b1010      # Binary (base 2)
octal = 0o17         # Octal (base 8)
hexadecimal = 0xFF   # Hexadecimal (base 16)
print(binary, octal, hexadecimal)  # 10 15 255
```

## Floats (float)

Numbers with decimal points:

```python
price = 19.99
pi = 3.14159
negative = -0.5
```

### Scientific Notation

```python
# Use 'e' for scientific notation
light_speed = 3e8      # 3 * 10^8 = 300000000.0
tiny = 1.5e-10         # 1.5 * 10^-10 = 0.00000000015
```

### Float Precision Warning

Floats have limited precision. This can cause surprising results:

```python
print(0.1 + 0.2)  # 0.30000000000000004 (not exactly 0.3!)

# For money, use integers (cents) or the decimal module
price_cents = 1999  # $19.99 stored as cents
```

## Booleans (bool)

Only two possible values: `True` or `False`

```python
is_active = True
is_deleted = False
```

### Boolean from Comparisons

```python
print(5 > 3)    # True
print(5 == 3)   # False
print(5 != 3)   # True
print(5 >= 5)   # True
```

### Truthy and Falsy Values

Python treats some values as `False` when used in conditions:

```python
# These are "falsy" - treated as False
print(bool(0))       # False
print(bool(0.0))     # False
print(bool(""))      # False (empty string)
print(bool([]))      # False (empty list)
print(bool(None))    # False

# Everything else is "truthy"
print(bool(1))       # True
print(bool(-1))      # True
print(bool("hello")) # True
print(bool([1, 2]))  # True
```

## Checking Types

Use `type()` to check a value's type:

```python
print(type("hello"))   # <class 'str'>
print(type(42))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type(True))      # <class 'bool'>
```

Use `isinstance()` to check if a value is a specific type:

```python
age = 25
print(isinstance(age, int))    # True
print(isinstance(age, str))    # False
print(isinstance(age, (int, float)))  # True (either type)
```

## Type Conversion

Convert between types using type functions:

```python
# String to integer
age_str = "25"
age = int(age_str)
print(age + 5)  # 30

# String to float
price_str = "19.99"
price = float(price_str)
print(price * 2)  # 39.98

# Number to string
count = 42
count_str = str(count)
print("Count: " + count_str)  # Count: 42

# Float to integer (truncates!)
pi = 3.99
print(int(pi))  # 3 (not rounded, just cut off)

# Integer to float
whole = 5
decimal = float(whole)
print(decimal)  # 5.0
```

### Conversion Errors

Invalid conversions raise errors:

```python
# This works
int("42")      # 42

# This fails!
int("hello")   # ValueError: invalid literal for int()
int("3.14")    # ValueError (use float() first)

# For decimal strings, convert to float first
price = float("3.14")  # 3.14
whole = int(price)     # 3
```

## The None Type

`None` represents the absence of a value:

```python
result = None

# Check for None using 'is'
if result is None:
    print("No result yet")

# Functions without return statements return None
def greet(name):
    print(f"Hello, {name}!")

value = greet("Alice")  # Prints: Hello, Alice!
print(value)            # None
```

## Type Hints (Optional)

Python 3.5+ supports type hints for documentation:

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"

age: int = 25
price: float = 19.99
active: bool = True
```

Type hints don't enforce types at runtime but help with readability and IDE support.

## Common Mistakes

### Mixing Types Without Conversion

```python
# Error: can't concatenate str and int
age = 25
# print("Age: " + age)  # TypeError!

# Solution: convert to string
print("Age: " + str(age))  # Age: 25

# Or use f-strings (automatic conversion)
print(f"Age: {age}")  # Age: 25
```

### Integer Division Surprise

```python
# Division always returns float
result = 10 / 2
print(result)       # 5.0 (not 5!)
print(type(result)) # <class 'float'>

# Use // for integer result
result = 10 // 2
print(result)       # 5
print(type(result)) # <class 'int'>
```

## Try It Yourself

1. Create variables of each type and print their types
2. Convert the string "100" to an integer and add 50 to it
3. Check if 0.1 + 0.2 equals 0.3 (it won't - why?)
4. Use `bool()` to check which values are truthy or falsy

## Key Takeaways

1. Python's basic types: `str`, `int`, `float`, `bool`
2. Use `type()` to check types, `isinstance()` to verify
3. Convert types with `str()`, `int()`, `float()`, `bool()`
4. Floats have precision limits - be careful with money!
5. `None` represents "no value"
6. Mix types carefully - explicit conversion is often needed

Next, we'll learn how to get input from users and format output nicely.
