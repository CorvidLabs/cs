---
title: Boolean Logic and Comparisons
order: 1
estimatedMinutes: 15
---

# Boolean Logic and Comparisons

Before we can make decisions in our programs, we need to understand how Python evaluates conditions. This is where boolean logic comes in.

## Boolean Values

Python has two boolean values: `True` and `False`. These are the foundation of all decision-making in programming.

```python
is_raining = True
has_umbrella = False

print(is_raining)   # True
print(has_umbrella) # False
```

Note that `True` and `False` are capitalized in Python. Writing `true` or `false` will cause an error.

## The bool Type

Booleans are their own data type in Python:

```python
print(type(True))   # <class 'bool'>
print(type(False))  # <class 'bool'>
```

## Comparison Operators

Comparison operators compare two values and return a boolean result:

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| `==` | Equal to | `5 == 5` | `True` |
| `!=` | Not equal to | `5 != 3` | `True` |
| `<` | Less than | `3 < 5` | `True` |
| `>` | Greater than | `5 > 3` | `True` |
| `<=` | Less than or equal | `5 <= 5` | `True` |
| `>=` | Greater than or equal | `5 >= 3` | `True` |

## Using Comparison Operators

Let's see these operators in action:

```python
age = 18
voting_age = 18

print(age == voting_age)  # True - age equals voting_age
print(age != voting_age)  # False - age is not different from voting_age
print(age >= voting_age)  # True - age is at least voting_age
```

## Comparing Different Types

You can compare numbers of different types:

```python
print(5 == 5.0)   # True - int and float with same value
print(10 > 3.14)  # True - comparing int to float
```

Comparing strings uses alphabetical (lexicographic) order:

```python
print("apple" < "banana")  # True - 'a' comes before 'b'
print("cat" < "car")       # False - 't' comes after 'r'
print("Apple" < "apple")   # True - uppercase letters come before lowercase
```

## Common Mistakes

### Assignment vs. Comparison

A common error is confusing `=` (assignment) with `==` (comparison):

```python
x = 5      # This ASSIGNS 5 to x
x == 5     # This COMPARES x to 5, returns True

# This is wrong in a condition:
# if x = 5:  # SyntaxError!

# This is correct:
# if x == 5:  # Correct!
```

### Floating Point Comparisons

Be careful comparing floating-point numbers due to precision issues:

```python
print(0.1 + 0.2)          # 0.30000000000000004
print(0.1 + 0.2 == 0.3)   # False!

# Better approach: check if they're close enough
difference = abs((0.1 + 0.2) - 0.3)
print(difference < 0.0001)  # True
```

## Truthiness and Falsiness

Python can evaluate non-boolean values as booleans. This concept is called "truthiness":

```python
# Falsy values (evaluate to False):
print(bool(0))        # False
print(bool(0.0))      # False
print(bool(""))       # False - empty string
print(bool([]))       # False - empty list
print(bool(None))     # False

# Truthy values (evaluate to True):
print(bool(1))        # True
print(bool(-5))       # True - any non-zero number
print(bool("hello"))  # True - non-empty string
print(bool([1, 2]))   # True - non-empty list
```

## Practical Example

Let's use comparisons to check a student's score:

```python
score = 85
passing_score = 60

is_passing = score >= passing_score
print(f"Score: {score}")
print(f"Passing: {is_passing}")  # Passing: True

# Check if it's a perfect score
is_perfect = score == 100
print(f"Perfect score: {is_perfect}")  # Perfect score: False
```

## Key Takeaways

1. Boolean values are `True` and `False` (capitalized)
2. Comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`) return boolean values
3. Use `==` for comparison, not `=` (which is assignment)
4. Be careful with floating-point comparisons
5. Python has "truthy" and "falsy" values beyond just `True` and `False`

In the next lesson, we'll use these boolean concepts to make decisions with `if` statements.
