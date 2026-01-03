---
title: Input and Output
order: 4
estimatedMinutes: 15
---

# Input and Output

Programs communicate with users through input (receiving data) and output (displaying data). Let's master both.

## The print() Function

We've used `print()` throughout this module. Let's explore its full capabilities.

### Basic Printing

```python
print("Hello, World!")
print(42)
print(3.14)
print(True)
```

### Printing Multiple Values

Separate values with commas. Python adds spaces automatically:

```python
name = "Alice"
age = 25
print("Name:", name, "Age:", age)
# Output: Name: Alice Age: 25
```

### Customizing Separators

Change what appears between values with `sep`:

```python
print("apple", "banana", "cherry")
# Output: apple banana cherry

print("apple", "banana", "cherry", sep=", ")
# Output: apple, banana, cherry

print("apple", "banana", "cherry", sep=" - ")
# Output: apple - banana - cherry

print(2024, 1, 15, sep="/")
# Output: 2024/1/15
```

### Customizing Line Endings

By default, `print()` adds a newline. Change it with `end`:

```python
print("Loading", end="")
print(".", end="")
print(".", end="")
print(".", end="")
print(" Done!")
# Output: Loading.... Done!

# Print items on same line
for i in range(5):
    print(i, end=" ")
# Output: 0 1 2 3 4
```

### Printing to Files

Direct output to a file instead of the console:

```python
with open("output.txt", "w") as file:
    print("Hello, File!", file=file)
```

## The input() Function

`input()` pauses the program and waits for user input:

```python
name = input("What is your name? ")
print(f"Hello, {name}!")
```

When this runs:
```
What is your name? Alice
Hello, Alice!
```

### Important: input() Returns Strings

Everything from `input()` is a string, even numbers:

```python
age = input("Enter your age: ")
print(type(age))  # <class 'str'>

# This doesn't work as expected:
# age + 5  # TypeError: can't add str and int!

# Convert to integer first:
age = int(input("Enter your age: "))
next_year = age + 1
print(f"Next year you'll be {next_year}")
```

### Handling Numeric Input

```python
# Integer input
quantity = int(input("How many? "))

# Float input
price = float(input("Enter price: "))

# Calculate with the values
total = quantity * price
print(f"Total: ${total:.2f}")
```

### Input Without a Prompt

The prompt is optional:

```python
print("Enter your name:")
name = input()  # Waits on a new line
```

## String Formatting

There are three ways to format strings in Python. F-strings (formatted string literals) are the modern, preferred approach.

### F-Strings (Recommended)

Prefix the string with `f` and use `{}` for expressions:

```python
name = "Alice"
age = 25

message = f"My name is {name} and I am {age} years old."
print(message)
# Output: My name is Alice and I am 25 years old.
```

### Expressions in F-Strings

You can put any expression inside `{}`:

```python
x = 10
y = 5

print(f"{x} + {y} = {x + y}")
# Output: 10 + 5 = 15

print(f"{x} squared is {x ** 2}")
# Output: 10 squared is 100

name = "alice"
print(f"Hello, {name.title()}!")
# Output: Hello, Alice!
```

### Formatting Numbers

Control how numbers appear with format specifiers:

```python
price = 19.99
quantity = 3
total = price * quantity

# Fixed decimal places
print(f"Price: ${price:.2f}")
# Output: Price: $19.99

print(f"Total: ${total:.2f}")
# Output: Total: $59.97

# Large numbers with commas
population = 8000000
print(f"Population: {population:,}")
# Output: Population: 8,000,000

# Percentage
ratio = 0.756
print(f"Success rate: {ratio:.1%}")
# Output: Success rate: 75.6%
```

### Alignment and Padding

Control width and alignment:

```python
name = "Alice"

# Right-align in 10 characters
print(f"|{name:>10}|")
# Output: |     Alice|

# Left-align in 10 characters
print(f"|{name:<10}|")
# Output: |Alice     |

# Center in 10 characters
print(f"|{name:^10}|")
# Output: |  Alice   |

# Pad numbers with zeros
number = 42
print(f"ID: {number:05}")
# Output: ID: 00042
```

### Creating Tables

```python
products = [
    ("Apple", 0.99, 50),
    ("Banana", 0.59, 100),
    ("Orange", 1.29, 75),
]

print(f"{'Product':<10} {'Price':>8} {'Stock':>8}")
print("-" * 28)

for name, price, stock in products:
    print(f"{name:<10} ${price:>7.2f} {stock:>8}")
```

Output:
```
Product       Price    Stock
----------------------------
Apple         $  0.99       50
Banana        $  0.59      100
Orange        $  1.29       75
```

## Older Formatting Methods

You may encounter these in existing code.

### The format() Method

```python
name = "Alice"
age = 25

message = "My name is {} and I am {} years old.".format(name, age)
print(message)

# With positions
message = "I am {1} years old. My name is {0}.".format(name, age)
print(message)
# Output: I am 25 years old. My name is Alice.

# With names
message = "Hello, {name}!".format(name="Bob")
print(message)
```

### Percent Formatting (Legacy)

```python
name = "Alice"
age = 25

message = "My name is %s and I am %d years old." % (name, age)
print(message)

# %s = string, %d = integer, %f = float
price = 19.99
print("Price: $%.2f" % price)
# Output: Price: $19.99
```

## Input Validation

Users make mistakes. Validate their input:

```python
# Simple validation with a loop
while True:
    age_input = input("Enter your age (1-120): ")

    if not age_input.isdigit():
        print("Please enter a number.")
        continue

    age = int(age_input)

    if age < 1 or age > 120:
        print("Age must be between 1 and 120.")
        continue

    break  # Valid input, exit loop

print(f"You are {age} years old.")
```

### Try-Except for Conversion Errors

```python
while True:
    try:
        price = float(input("Enter price: "))
        if price < 0:
            print("Price cannot be negative.")
            continue
        break
    except ValueError:
        print("Please enter a valid number.")

print(f"Price: ${price:.2f}")
```

## Practical Example: Simple Calculator

```python
print("=== Simple Calculator ===")
print()

# Get first number
while True:
    try:
        num1 = float(input("Enter first number: "))
        break
    except ValueError:
        print("Invalid number. Try again.")

# Get second number
while True:
    try:
        num2 = float(input("Enter second number: "))
        break
    except ValueError:
        print("Invalid number. Try again.")

# Get operation
print("\nOperations: +, -, *, /")
operation = input("Enter operation: ")

# Calculate and display result
if operation == "+":
    result = num1 + num2
elif operation == "-":
    result = num1 - num2
elif operation == "*":
    result = num1 * num2
elif operation == "/":
    if num2 == 0:
        print("Error: Cannot divide by zero!")
        result = None
    else:
        result = num1 / num2
else:
    print(f"Unknown operation: {operation}")
    result = None

if result is not None:
    print(f"\n{num1} {operation} {num2} = {result}")
```

## Try It Yourself

1. Create a program that asks for your name and age, then prints a greeting
2. Build a tip calculator that asks for the bill amount and tip percentage
3. Create a formatted receipt with item names, prices, and a total

## Key Takeaways

1. `print()` displays output; customize with `sep` and `end`
2. `input()` reads user input as a string - convert as needed
3. F-strings (`f"..."`) are the modern way to format strings
4. Format specifiers control number display (`.2f`, `,`, `%`)
5. Validate user input to handle errors gracefully

You've completed the Python Fundamentals module! You now understand variables, data types, and input/output - the foundation for everything that follows.
