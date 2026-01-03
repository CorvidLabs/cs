---
title: If Statements
order: 1
estimatedMinutes: 15
---

# If Statements

Programs need to make decisions. If statements let your code take different paths based on conditions.

## Basic If Statement

```python
age = 18

if age >= 18:
    print("You are an adult.")
```

The indented code runs only if the condition is `True`.

## The if-else Statement

Handle both cases - when the condition is true and when it's false:

```python
age = 16

if age >= 18:
    print("You are an adult.")
else:
    print("You are a minor.")
```

Output: `You are a minor.`

## The if-elif-else Chain

Test multiple conditions in order:

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is {grade}")  # Your grade is B
```

### How It Works

1. Python checks each condition from top to bottom
2. The first true condition's block executes
3. All remaining conditions are skipped
4. If no condition is true, `else` runs (if present)

### Order Matters!

```python
score = 95

# Wrong order - always matches first condition
if score >= 60:
    print("D")  # This runs for score=95!
elif score >= 70:
    print("C")
elif score >= 80:
    print("B")
elif score >= 90:
    print("A")

# Correct order - check highest first
if score >= 90:
    print("A")  # Now this correctly runs
elif score >= 80:
    print("B")
# ...
```

## Indentation is Crucial

Python uses indentation to define code blocks:

```python
temperature = 35

if temperature > 30:
    print("It's hot!")
    print("Stay hydrated!")
    print("Find some shade!")

print("Weather report complete.")
```

All three print statements are inside the if block. The last print runs regardless.

### Indentation Errors

```python
if True:
print("This causes an IndentationError!")
```

Always use consistent indentation (4 spaces is standard).

## Nested If Statements

Put if statements inside other if statements:

```python
age = 25
has_license = True

if age >= 18:
    print("Age requirement met.")
    if has_license:
        print("You can drive!")
    else:
        print("Get a license first.")
else:
    print("Too young to drive.")
```

### Avoid Deep Nesting

Deeply nested code is hard to read:

```python
# Hard to follow
if condition1:
    if condition2:
        if condition3:
            if condition4:
                do_something()

# Better: combine conditions or use early returns
if condition1 and condition2 and condition3 and condition4:
    do_something()
```

## Conditional Expressions (Ternary Operator)

A concise way to choose between two values:

```python
age = 20
status = "adult" if age >= 18 else "minor"
print(status)  # adult

# Equivalent to:
if age >= 18:
    status = "adult"
else:
    status = "minor"
```

### When to Use

Good for simple assignments:

```python
# Clear and readable
max_value = a if a > b else b
label = "Yes" if active else "No"
discount = 0.1 if is_member else 0
```

Avoid for complex logic:

```python
# Too complex - use regular if statement
result = value1 if condition1 else value2 if condition2 else value3
```

## Truthy and Falsy Values

Python evaluates non-boolean values in conditions:

```python
# These are "falsy" - treated as False
if 0:          # False
if 0.0:        # False
if "":         # False (empty string)
if []:         # False (empty list)
if {}:         # False (empty dict)
if None:       # False

# These are "truthy" - treated as True
if 1:          # True
if -1:         # True
if "hello":    # True (non-empty string)
if [1, 2, 3]:  # True (non-empty list)
```

### Practical Use

```python
name = input("Enter your name: ")

if name:  # True if name is not empty
    print(f"Hello, {name}!")
else:
    print("You didn't enter a name.")
```

```python
items = []

if items:  # True if list is not empty
    print(f"You have {len(items)} items.")
else:
    print("Your cart is empty.")
```

## Common Patterns

### Validating Input

```python
user_input = input("Enter a number: ")

if user_input.isdigit():
    number = int(user_input)
    print(f"You entered {number}")
else:
    print("That's not a valid number!")
```

### Default Values

```python
name = input("Enter name (or press Enter for default): ")

if not name:
    name = "Guest"

print(f"Welcome, {name}!")
```

### Bounds Checking

```python
value = 150

if value < 0:
    print("Value too low!")
elif value > 100:
    print("Value too high!")
else:
    print(f"Value {value} is in range.")
```

## Try It Yourself

1. Write a program that checks if a number is positive, negative, or zero
2. Create a simple ticket pricing system based on age
3. Build a basic login check (username and password)

## Key Takeaways

1. `if` checks a condition; indented code runs if true
2. `else` handles the false case; `elif` adds more conditions
3. Conditions are checked in order; first match wins
4. Use 4 spaces for indentation (be consistent!)
5. Conditional expressions: `value_if_true if condition else value_if_false`
6. Empty values (0, "", [], {}, None) are "falsy"

Next, we'll explore comparison operators in detail.
