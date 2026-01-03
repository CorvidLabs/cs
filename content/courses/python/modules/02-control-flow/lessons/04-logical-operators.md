---
title: Logical Operators
order: 3
estimatedMinutes: 15
---

# Logical Operators

Logical operators combine multiple conditions. They let you create complex decision logic from simple comparisons.

## The Three Logical Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `and` | Both must be True | `x > 0 and x < 10` |
| `or` | At least one must be True | `x < 0 or x > 100` |
| `not` | Inverts True/False | `not is_closed` |

## The and Operator

Returns `True` only if both conditions are `True`:

```python
age = 25
has_license = True

if age >= 18 and has_license:
    print("You can drive!")
```

### Truth Table for and

| A | B | A and B |
|---|---|---------|
| True | True | True |
| True | False | False |
| False | True | False |
| False | False | False |

### Multiple and Conditions

```python
age = 30
income = 50000
credit_score = 720

if age >= 21 and income >= 40000 and credit_score >= 700:
    print("Loan approved!")
else:
    print("Loan denied.")
```

## The or Operator

Returns `True` if at least one condition is `True`:

```python
day = "Saturday"

if day == "Saturday" or day == "Sunday":
    print("It's the weekend!")
```

### Truth Table for or

| A | B | A or B |
|---|---|--------|
| True | True | True |
| True | False | True |
| False | True | True |
| False | False | False |

### Multiple or Conditions

```python
answer = input("Continue? (y/yes/yeah): ")

if answer == "y" or answer == "yes" or answer == "yeah":
    print("Continuing...")
```

A cleaner approach:

```python
if answer in ["y", "yes", "yeah"]:
    print("Continuing...")
```

## The not Operator

Inverts a boolean value:

```python
is_raining = False

if not is_raining:
    print("No umbrella needed!")

# Equivalent to:
if is_raining == False:
    print("No umbrella needed!")
```

### Common not Patterns

```python
# Check if not in a list
if item not in allowed_items:
    print("Item not allowed")

# Check if empty (falsy)
if not my_list:
    print("List is empty")

# Double negative (avoid this!)
if not is_not_valid:  # Confusing!
    process()

# Better
if is_valid:
    process()
```

## Combining Operators

Combine `and`, `or`, and `not` for complex logic:

```python
age = 20
is_student = True
has_coupon = False

# Discount if: student OR has coupon, AND is adult
if age >= 18 and (is_student or has_coupon):
    print("Discount applied!")
```

### Operator Precedence

Order of evaluation (highest to lowest):
1. `not`
2. `and`
3. `or`

```python
# These are equivalent:
a or b and c
a or (b and c)  # and binds tighter

# These are equivalent:
not a and b
(not a) and b  # not binds tightest

# When in doubt, use parentheses!
if (a and b) or (c and d):
    pass
```

## Short-Circuit Evaluation

Python stops evaluating as soon as the result is determined:

### and Short-Circuits

```python
# If first condition is False, second isn't checked
if False and some_expensive_function():
    pass  # some_expensive_function() never runs

# Useful for avoiding errors
if items and items[0] > 0:  # Checks if list exists first
    print("First item is positive")
```

### or Short-Circuits

```python
# If first condition is True, second isn't checked
if True or some_expensive_function():
    pass  # some_expensive_function() never runs

# Useful for defaults
name = user_input or "Guest"  # If user_input is empty, use "Guest"
```

### Practical Short-Circuit Examples

```python
# Safe division
if denominator != 0 and numerator / denominator > 1:
    print("Ratio is greater than 1")

# Safe attribute access
if user and user.is_active:
    grant_access()

# Default values
config = user_config or default_config
```

## Return Values of Logical Operators

Python's logical operators return the actual values, not just True/False:

### and Returns

Returns the first falsy value, or the last value if all are truthy:

```python
print(1 and 2 and 3)      # 3 (last value, all truthy)
print(1 and 0 and 3)      # 0 (first falsy)
print(None and "hello")   # None (first falsy)
print("hello" and "world") # "world" (last value)
```

### or Returns

Returns the first truthy value, or the last value if all are falsy:

```python
print(0 or "" or "hello")  # "hello" (first truthy)
print(0 or "" or None)     # None (last value, all falsy)
print("a" or "b")          # "a" (first truthy)
```

### Default Value Pattern

```python
# If name is empty or None, use "Guest"
name = user_input or "Guest"

# Get first non-None value
result = value1 or value2 or value3 or "default"

# With and for conditional values
greeting = is_formal and "Good morning" or "Hey"
# Better: use conditional expression
greeting = "Good morning" if is_formal else "Hey"
```

## De Morgan's Laws

Useful for simplifying complex conditions:

- `not (a and b)` equals `not a or not b`
- `not (a or b)` equals `not a and not b`

```python
# These are equivalent:
if not (age >= 18 and has_license):
    print("Cannot drive")

if age < 18 or not has_license:
    print("Cannot drive")
```

## Practical Examples

### Password Validation

```python
password = "Secret123"

has_length = len(password) >= 8
has_upper = any(c.isupper() for c in password)
has_lower = any(c.islower() for c in password)
has_digit = any(c.isdigit() for c in password)

if has_length and has_upper and has_lower and has_digit:
    print("Strong password!")
else:
    print("Weak password.")
```

### Access Control

```python
is_admin = False
is_owner = True
is_moderator = False

# Can edit if admin, owner, or moderator
can_edit = is_admin or is_owner or is_moderator

# Can delete only if admin or owner
can_delete = is_admin or is_owner

# Can ban only if admin and not banning themselves
can_ban = is_admin and not is_owner
```

### Form Validation

```python
def validate_form(email, password, age):
    # Email must contain @
    valid_email = "@" in email

    # Password must be at least 8 characters
    valid_password = len(password) >= 8

    # Age must be 18 or older
    valid_age = age >= 18

    if valid_email and valid_password and valid_age:
        return True, "Form valid!"
    else:
        errors = []
        if not valid_email:
            errors.append("Invalid email")
        if not valid_password:
            errors.append("Password too short")
        if not valid_age:
            errors.append("Must be 18 or older")
        return False, errors
```

## Common Mistakes

### Incomplete Comparisons

```python
# Wrong - always True!
if x == 1 or 2 or 3:
    pass
# This evaluates as: (x == 1) or 2 or 3
# 2 is truthy, so it's always True

# Right
if x == 1 or x == 2 or x == 3:
    pass

# Better
if x in [1, 2, 3]:
    pass
```

### Overcomplicating with not

```python
# Confusing
if not x != 5:
    pass

# Clear
if x == 5:
    pass
```

## Try It Yourself

1. Check if a number is between 1 and 100 (inclusive)
2. Validate that a string is not empty and starts with a letter
3. Create a movie rating system (G if age < 13, PG-13 if < 17 with parent, R otherwise)

## Key Takeaways

1. `and` requires all conditions to be True
2. `or` requires at least one condition to be True
3. `not` inverts True to False and vice versa
4. Precedence: `not` > `and` > `or` (use parentheses!)
5. Short-circuit evaluation can prevent errors
6. Logical operators return actual values, not just booleans

Next, we'll explore Python's match statement for pattern matching.
