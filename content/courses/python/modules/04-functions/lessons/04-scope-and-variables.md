---
title: Scope and Variables
order: 4
estimatedMinutes: 15
---

# Scope and Variables

Understanding scope is crucial for writing bug-free functions. Scope determines where variables can be accessed and modified in your program.

## What is Scope?

Scope refers to the region of code where a variable is visible and accessible. Python has several scope levels:

1. **Local scope** - Inside a function
2. **Enclosing scope** - Inside enclosing functions (for nested functions)
3. **Global scope** - At the module level
4. **Built-in scope** - Python's built-in names

This is often called the LEGB rule.

## Local Variables

Variables created inside a function are local to that function:

```python
def greet():
    message = "Hello!"  # Local variable
    print(message)

greet()
# print(message)  # NameError: name 'message' is not defined
```

Local variables:
- Are created when the function is called
- Are destroyed when the function returns
- Cannot be accessed outside the function

## Global Variables

Variables created outside functions are global:

```python
greeting = "Hello"  # Global variable

def greet(name):
    print(f"{greeting}, {name}!")  # Can read global variable

greet("Alice")  # Hello, Alice!
print(greeting)  # Hello - still accessible
```

## Local vs. Global with Same Name

A local variable can have the same name as a global variable:

```python
x = 10  # Global x

def func():
    x = 20  # Local x - different variable!
    print(f"Inside function: x = {x}")

func()
print(f"Outside function: x = {x}")
```

Output:
```
Inside function: x = 20
Outside function: x = 10
```

The local `x` "shadows" the global `x` inside the function.

## The `global` Keyword

To modify a global variable inside a function, use `global`:

```python
counter = 0  # Global variable

def increment():
    global counter
    counter += 1

print(counter)  # 0
increment()
print(counter)  # 1
increment()
print(counter)  # 2
```

Without `global`, this would cause an error:

```python
counter = 0

def increment_wrong():
    counter += 1  # UnboundLocalError!

# increment_wrong()  # Error!
```

## Why Avoid Global Variables?

Global variables can make code harder to understand and debug:

```python
# Hard to track and test
total = 0

def add_to_total(amount):
    global total
    total += amount

# Better: pass and return values
def add_amounts(current_total, amount):
    return current_total + amount

total = add_amounts(total, 10)
```

Prefer passing values as parameters and returning results.

## Enclosing Scope (Nested Functions)

Nested functions can access variables from enclosing functions:

```python
def outer():
    message = "Hello from outer"

    def inner():
        print(message)  # Can access enclosing variable

    inner()

outer()  # Hello from outer
```

## The `nonlocal` Keyword

To modify an enclosing variable, use `nonlocal`:

```python
def outer():
    count = 0

    def inner():
        nonlocal count
        count += 1
        print(f"Count: {count}")

    inner()
    inner()
    inner()

outer()
# Count: 1
# Count: 2
# Count: 3
```

## Variable Lifetime

Local variables exist only during function execution:

```python
def create_list():
    data = [1, 2, 3]  # Created
    return data       # Returned, so it survives

result = create_list()
print(result)  # [1, 2, 3] - the data lives on through the return

def lose_data():
    data = [4, 5, 6]  # Created
    print(data)       # Used
    # Function ends - data is destroyed

lose_data()
# data is no longer accessible
```

## Parameters are Local Variables

Function parameters behave like local variables:

```python
def modify(x):
    x = x + 10  # x is a local variable
    print(f"Inside: {x}")

value = 5
modify(value)
print(f"Outside: {value}")
```

Output:
```
Inside: 15
Outside: 5
```

The original `value` is unchanged because `x` is a copy.

## Mutable Objects and Scope

Be careful with mutable objects (lists, dictionaries):

```python
def modify_list(items):
    items.append(4)  # Modifies the actual list!
    print(f"Inside: {items}")

my_list = [1, 2, 3]
modify_list(my_list)
print(f"Outside: {my_list}")
```

Output:
```
Inside: [1, 2, 3, 4]
Outside: [1, 2, 3, 4]
```

The list itself is modified because both names reference the same object.

To avoid this, make a copy:

```python
def safe_modify_list(items):
    items = items.copy()  # Work with a copy
    items.append(4)
    return items

my_list = [1, 2, 3]
new_list = safe_modify_list(my_list)
print(f"Original: {my_list}")   # [1, 2, 3]
print(f"Modified: {new_list}")  # [1, 2, 3, 4]
```

## Best Practices

1. **Minimize global variables** - Pass data through parameters instead

```python
# Avoid:
config = {"debug": True}
def log(msg):
    if config["debug"]:
        print(msg)

# Better:
def log(msg, debug=False):
    if debug:
        print(msg)
```

2. **Use descriptive local variable names** - They're only visible in the function

```python
def calculate_area(radius):
    pi = 3.14159
    area = pi * radius ** 2
    return area
```

3. **Return values instead of modifying globals**

```python
# Avoid:
result = None
def compute():
    global result
    result = 42

# Better:
def compute():
    return 42
result = compute()
```

## Practical Example: Counter Factory

```python
def make_counter():
    """Create a counter function with its own private count."""
    count = 0

    def counter():
        nonlocal count
        count += 1
        return count

    return counter

# Create independent counters
counter_a = make_counter()
counter_b = make_counter()

print(counter_a())  # 1
print(counter_a())  # 2
print(counter_b())  # 1 - independent!
print(counter_a())  # 3
print(counter_b())  # 2
```

## Key Takeaways

1. Local variables exist only inside their function
2. Global variables are accessible everywhere but use sparingly
3. Use `global` to modify global variables (but avoid this pattern)
4. Use `nonlocal` to modify enclosing scope variables
5. Parameters are local variables
6. Mutable objects can be modified even without `global`
7. Prefer passing parameters and returning values over using globals

You now have a solid foundation in Python functions! Practice creating your own functions to build modular, reusable code.
