---
title: Defining Functions
order: 1
estimatedMinutes: 15
---

# Defining Functions

Functions are reusable blocks of code that perform specific tasks. They help you organize your code, avoid repetition, and make programs easier to understand and maintain.

## Why Use Functions?

Consider this code that greets users:

```python
print("Hello, Alice!")
print("Welcome to the program.")
print()
print("Hello, Bob!")
print("Welcome to the program.")
print()
print("Hello, Charlie!")
print("Welcome to the program.")
```

We repeat the same pattern three times. With a function, we can write it once and reuse it:

```python
def greet(name):
    print(f"Hello, {name}!")
    print("Welcome to the program.")
    print()

greet("Alice")
greet("Bob")
greet("Charlie")
```

## The `def` Keyword

Functions are defined using the `def` keyword:

```python
def function_name():
    # code goes here
    pass
```

Key components:
1. `def` - keyword that starts a function definition
2. `function_name` - the name you give your function
3. `()` - parentheses (can contain parameters)
4. `:` - colon to start the function body
5. Indented code block - the function's body

## A Simple Function

Let's create a function that prints a greeting:

```python
def say_hello():
    print("Hello, World!")

# Call the function
say_hello()
```

Output:
```
Hello, World!
```

## Calling Functions

To execute a function, you call it by name with parentheses:

```python
def print_header():
    print("=" * 40)
    print("    WELCOME TO MY PROGRAM")
    print("=" * 40)

# The function runs when we call it
print_header()

# We can call it multiple times
print("Some content here...")
print_header()
```

Output:
```
========================================
    WELCOME TO MY PROGRAM
========================================
Some content here...
========================================
    WELCOME TO MY PROGRAM
========================================
```

## Function Naming Conventions

Follow these Python conventions for naming functions:

```python
# Good: lowercase with underscores (snake_case)
def calculate_total():
    pass

def get_user_input():
    pass

def is_valid_email():
    pass

# Avoid: camelCase (this is not Pythonic)
def calculateTotal():  # Not recommended
    pass

# Avoid: starting with uppercase (reserved for classes)
def CalculateTotal():  # Not recommended
    pass
```

## Functions Must Be Defined Before Use

Python reads code from top to bottom. Define functions before calling them:

```python
# This works:
def greet():
    print("Hello!")

greet()  # Function is defined above

# This causes an error:
# say_bye()  # NameError: name 'say_bye' is not defined
# def say_bye():
#     print("Goodbye!")
```

## Empty Functions with `pass`

Sometimes you want to define a function to implement later:

```python
def future_feature():
    pass  # Placeholder - does nothing but is valid syntax

# You can call it (nothing happens)
future_feature()
```

## Docstrings

Document your functions with docstrings:

```python
def calculate_area():
    """Calculate the area of a rectangle.

    This function uses the width and height variables
    to compute and print the area.
    """
    width = 10
    height = 5
    area = width * height
    print(f"Area: {area}")
```

Access the docstring with `help()` or `__doc__`:

```python
help(calculate_area)
print(calculate_area.__doc__)
```

## Practical Example: Menu Display

```python
def display_menu():
    """Display the main menu options."""
    print("\n=== Main Menu ===")
    print("1. New Game")
    print("2. Load Game")
    print("3. Settings")
    print("4. Exit")
    print("=================\n")

def display_settings():
    """Display the settings menu."""
    print("\n--- Settings ---")
    print("1. Sound: ON")
    print("2. Difficulty: Normal")
    print("3. Back to Main Menu")
    print("----------------\n")

# Use the functions
display_menu()
print("User selects option 3...")
display_settings()
```

## Multiple Statements in a Function

A function can contain any number of statements:

```python
def introduce_python():
    """Print an introduction to Python."""
    print("Python is a programming language.")
    print("It was created by Guido van Rossum.")
    print()

    year = 1991
    print(f"Python was first released in {year}.")

    age = 2024 - year
    print(f"It's about {age} years old!")

introduce_python()
```

## Key Takeaways

1. Functions are defined with `def function_name():`
2. The function body must be indented
3. Call functions using `function_name()`
4. Use snake_case for function names
5. Define functions before calling them
6. Use docstrings to document what functions do
7. `pass` creates a valid empty function

In the next lesson, we'll learn how to pass data into functions using parameters.
