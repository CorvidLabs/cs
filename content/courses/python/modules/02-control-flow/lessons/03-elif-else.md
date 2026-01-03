---
title: Elif and Else Clauses
order: 3
estimatedMinutes: 15
---

# Elif and Else Clauses

When you need to handle multiple mutually exclusive conditions, Python provides `elif` (else if) and `else` clauses to create comprehensive decision structures.

## The Else Clause

The `else` clause executes when the `if` condition is `False`:

```python
age = 15

if age >= 18:
    print("You can vote.")
else:
    print("You cannot vote yet.")
```

Output:
```
You cannot vote yet.
```

The `else` block runs only when the `if` condition is `False`. One of the two blocks will always execute.

## If-Else Structure

```python
if condition:
    # runs when condition is True
else:
    # runs when condition is False
```

This creates two mutually exclusive paths.

## The Elif Clause

When you have more than two possibilities, use `elif`:

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

print(f"Your grade is: {grade}")
```

Output:
```
Your grade is: B
```

## How Elif Works

Python evaluates conditions from top to bottom and executes only the first matching block:

```python
number = 15

if number > 20:
    print("Greater than 20")
elif number > 10:
    print("Greater than 10")    # This prints
elif number > 5:
    print("Greater than 5")     # This is also true, but skipped!
else:
    print("5 or less")
```

Output:
```
Greater than 10
```

Even though `15 > 5` is also `True`, it's never checked because `15 > 10` matched first.

## Combining If, Elif, and Else

You can use any combination:

```python
# if only
if condition:
    # code

# if-else
if condition:
    # code
else:
    # code

# if-elif
if condition1:
    # code
elif condition2:
    # code

# if-elif-else
if condition1:
    # code
elif condition2:
    # code
else:
    # code

# Multiple elif
if condition1:
    # code
elif condition2:
    # code
elif condition3:
    # code
else:
    # code
```

## Order Matters

The order of conditions affects behavior:

```python
# Correct order (specific to general):
temperature = 105

if temperature >= 100:
    print("Boiling!")
elif temperature >= 80:
    print("Hot")
elif temperature >= 60:
    print("Warm")
else:
    print("Cool")

# Output: Boiling!
```

If you reversed the order:

```python
# Wrong order (general to specific):
temperature = 105

if temperature >= 60:
    print("Warm")        # This matches first!
elif temperature >= 80:
    print("Hot")         # Never reached
elif temperature >= 100:
    print("Boiling!")    # Never reached
else:
    print("Cool")

# Output: Warm (incorrect!)
```

## Practical Example: Menu System

```python
print("Calculator Menu")
print("1. Add")
print("2. Subtract")
print("3. Multiply")
print("4. Divide")

choice = input("Enter your choice (1-4): ")

if choice == "1":
    print("You selected Addition")
elif choice == "2":
    print("You selected Subtraction")
elif choice == "3":
    print("You selected Multiplication")
elif choice == "4":
    print("You selected Division")
else:
    print("Invalid choice. Please enter 1-4.")
```

## Practical Example: Age Categories

```python
age = int(input("Enter your age: "))

if age < 0:
    print("Invalid age!")
elif age < 13:
    print("You are a child.")
elif age < 20:
    print("You are a teenager.")
elif age < 65:
    print("You are an adult.")
else:
    print("You are a senior.")
```

## Avoiding Common Mistakes

### Don't Use Multiple If When You Need Elif

```python
# Wrong approach:
score = 95
if score >= 90:
    print("A")
if score >= 80:
    print("B")  # Also prints for 95!
if score >= 70:
    print("C")  # Also prints for 95!

# Output: A, B, C (three lines - wrong!)

# Correct approach:
score = 95
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")

# Output: A (one line - correct!)
```

### Else Doesn't Have a Condition

```python
# Wrong:
# else score < 60:  # SyntaxError!

# Correct:
else:
    print("Below passing")
```

## Conditional Expressions (Ternary Operator)

For simple if-else cases, Python offers a one-line syntax:

```python
age = 20

# Traditional if-else:
if age >= 18:
    status = "adult"
else:
    status = "minor"

# Conditional expression (same result):
status = "adult" if age >= 18 else "minor"

print(status)  # adult
```

Use this for simple cases only. Complex conditions should use regular if-elif-else.

## Key Takeaways

1. `else` executes when all previous conditions are `False`
2. `elif` checks additional conditions after `if`
3. Only the first matching block executes in an if-elif-else chain
4. Order conditions from most specific to least specific
5. Use `elif` for mutually exclusive conditions, multiple `if` for independent checks
6. Conditional expressions provide a concise alternative for simple cases

Next, we'll explore combining conditions with logical operators.
