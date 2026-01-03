---
title: Parameters and Arguments
order: 2
estimatedMinutes: 20
---

# Parameters and Arguments

Parameters allow you to pass data into functions, making them flexible and reusable with different inputs.

## Parameters vs. Arguments

These terms are often used interchangeably, but there's a distinction:

- **Parameters**: Variables listed in the function definition
- **Arguments**: Actual values passed when calling the function

```python
def greet(name):      # 'name' is a parameter
    print(f"Hello, {name}!")

greet("Alice")        # "Alice" is an argument
```

## Defining Parameters

Add parameters inside the parentheses:

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")   # Hello, Alice!
greet("Bob")     # Hello, Bob!
```

## Multiple Parameters

Functions can have multiple parameters, separated by commas:

```python
def describe_person(name, age, city):
    print(f"{name} is {age} years old and lives in {city}.")

describe_person("Alice", 25, "New York")
# Output: Alice is 25 years old and lives in New York.
```

## Positional Arguments

By default, arguments are matched to parameters by position:

```python
def power(base, exponent):
    result = base ** exponent
    print(f"{base} to the power of {exponent} = {result}")

power(2, 3)    # 2 to the power of 3 = 8
power(3, 2)    # 3 to the power of 2 = 9  (order matters!)
```

## Keyword Arguments

You can specify arguments by name for clarity:

```python
def describe_pet(animal, name):
    print(f"I have a {animal} named {name}.")

# Using keyword arguments
describe_pet(animal="cat", name="Whiskers")
describe_pet(name="Buddy", animal="dog")  # Order doesn't matter

# Mixing positional and keyword (positional must come first)
describe_pet("hamster", name="Fluffy")
```

## Default Parameter Values

Provide default values for parameters:

```python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Alice")                  # Hello, Alice!
greet("Bob", "Good morning")    # Good morning, Bob!
greet("Charlie", greeting="Hi") # Hi, Charlie!
```

## Rules for Default Parameters

Parameters with defaults must come after parameters without defaults:

```python
# Correct
def func(required, optional="default"):
    pass

# Incorrect - SyntaxError
# def func(optional="default", required):
#     pass
```

## Multiple Default Parameters

```python
def create_profile(name, age=None, city="Unknown", active=True):
    print(f"Name: {name}")
    print(f"Age: {age if age else 'Not specified'}")
    print(f"City: {city}")
    print(f"Active: {active}")
    print()

# Call with different combinations
create_profile("Alice")
create_profile("Bob", 25)
create_profile("Charlie", city="Boston")
create_profile("Diana", 30, "Seattle", False)
```

## Common Mistake: Mutable Default Arguments

Never use mutable objects (lists, dictionaries) as default values:

```python
# WRONG - the list is shared across all calls!
def add_item_bad(item, items=[]):
    items.append(item)
    return items

print(add_item_bad("a"))  # ['a']
print(add_item_bad("b"))  # ['a', 'b'] - Unexpected!

# CORRECT - use None and create a new list
def add_item_good(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(add_item_good("a"))  # ['a']
print(add_item_good("b"))  # ['b'] - As expected
```

## Arbitrary Positional Arguments (*args)

Accept any number of positional arguments with `*args`:

```python
def sum_all(*numbers):
    total = 0
    for num in numbers:
        total += num
    return total

print(sum_all(1, 2))           # 3
print(sum_all(1, 2, 3, 4, 5))  # 15
print(sum_all())               # 0
```

The `*args` parameter collects extra positional arguments into a tuple:

```python
def show_args(*args):
    print(f"Type: {type(args)}")
    print(f"Values: {args}")

show_args(1, "hello", True)
# Type: <class 'tuple'>
# Values: (1, 'hello', True)
```

## Arbitrary Keyword Arguments (**kwargs)

Accept any number of keyword arguments with `**kwargs`:

```python
def show_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

show_info(name="Alice", age=25, city="Boston")
# name: Alice
# age: 25
# city: Boston
```

## Combining Parameter Types

You can combine all parameter types, but they must appear in this order:

```python
def complex_function(pos1, pos2, *args, default="value", **kwargs):
    print(f"pos1: {pos1}")
    print(f"pos2: {pos2}")
    print(f"args: {args}")
    print(f"default: {default}")
    print(f"kwargs: {kwargs}")

complex_function(1, 2, 3, 4, default="custom", extra="data")
# pos1: 1
# pos2: 2
# args: (3, 4)
# default: custom
# kwargs: {'extra': 'data'}
```

Order:
1. Regular positional parameters
2. *args (arbitrary positional)
3. Keyword-only parameters (with defaults)
4. **kwargs (arbitrary keyword)

## Practical Example: Formatted Print

```python
def print_box(message, width=40, char="*"):
    """Print a message in a decorative box."""
    border = char * width
    padding = (width - len(message) - 2) // 2

    print(border)
    print(f"{char}{' ' * padding}{message}{' ' * padding}{char}")
    print(border)

print_box("Welcome!")
print_box("Python is fun!", width=30)
print_box("Custom Border", char="#", width=25)
```

## Key Takeaways

1. Parameters are variables in function definitions; arguments are values passed in calls
2. Positional arguments are matched by position
3. Keyword arguments are matched by name
4. Default values make parameters optional
5. Put required parameters before optional ones
6. Never use mutable default arguments (use `None` instead)
7. Use `*args` for variable positional arguments
8. Use `**kwargs` for variable keyword arguments

Next, we'll learn how functions can return values back to the caller.
