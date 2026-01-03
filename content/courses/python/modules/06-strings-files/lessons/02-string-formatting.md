---
title: String Formatting
order: 2
estimatedMinutes: 20
---

# String Formatting

Creating dynamic text with variables and expressions is a core skill. Python offers multiple approaches, with f-strings being the modern standard.

## F-Strings (Formatted String Literals)

Prefix a string with `f` and embed expressions in curly braces:

```python
name = "Alice"
age = 25

message = f"Hello, {name}! You are {age} years old."
print(message)
# Output: Hello, Alice! You are 25 years old.
```

### Expressions in F-Strings

Any valid Python expression works:

```python
x = 10
y = 5

print(f"{x} + {y} = {x + y}")        # 10 + 5 = 15
print(f"{x} squared = {x ** 2}")     # 10 squared = 100
print(f"Is {x} greater? {x > y}")    # Is 10 greater? True
```

### Method Calls

```python
name = "alice smith"

print(f"Title case: {name.title()}")
# Output: Title case: Alice Smith

print(f"Uppercase: {name.upper()}")
# Output: Uppercase: ALICE SMITH

text = "  hello  "
print(f"Stripped: '{text.strip()}'")
# Output: Stripped: 'hello'
```

## Number Formatting

Control how numbers appear with format specifiers after a colon:

### Decimal Places

```python
pi = 3.141592653589793

print(f"Default: {pi}")           # 3.141592653589793
print(f"2 decimals: {pi:.2f}")    # 3.14
print(f"4 decimals: {pi:.4f}")    # 3.1416 (rounded!)
print(f"0 decimals: {pi:.0f}")    # 3
```

### Thousands Separator

```python
population = 8000000
price = 1234567.89

print(f"Population: {population:,}")      # 8,000,000
print(f"Price: ${price:,.2f}")            # $1,234,567.89
```

### Percentage

```python
ratio = 0.756
completion = 0.5

print(f"Success: {ratio:.1%}")      # 75.6%
print(f"Complete: {completion:.0%}") # 50%
```

### Scientific Notation

```python
large = 6.022e23
small = 1.38e-23

print(f"Avogadro: {large:.2e}")    # 6.02e+23
print(f"Boltzmann: {small:.2e}")   # 1.38e-23
```

### Integer Formats

```python
num = 42

print(f"Binary: {num:b}")      # 101010
print(f"Octal: {num:o}")       # 52
print(f"Hex: {num:x}")         # 2a
print(f"Hex upper: {num:X}")   # 2A
```

## Alignment and Width

Control spacing with width and alignment specifiers:

### Basic Width

```python
name = "Python"

print(f"|{name:10}|")    # |Python    | (default left-aligned)
print(f"|{name:>10}|")   # |    Python| (right-aligned)
print(f"|{name:<10}|")   # |Python    | (left-aligned)
print(f"|{name:^10}|")   # |  Python  | (centered)
```

### Fill Characters

```python
name = "Test"

print(f"|{name:*>10}|")  # |******Test|
print(f"|{name:-<10}|")  # |Test------|
print(f"|{name:=^10}|")  # |===Test===|
```

### Number Padding

```python
num = 42

print(f"{num:05}")       # 00042 (zero-padded)
print(f"{num:>5}")       # "   42" (space-padded)
print(f"{num:+05}")      # +0042 (with sign)
```

### Combining Width and Precision

```python
price = 19.99

print(f"${price:10.2f}")     # $     19.99
print(f"${price:>10.2f}")    # $     19.99
print(f"${price:<10.2f}")    # $19.99
print(f"${price:010.2f}")    # $0000019.99
```

## Creating Tables

Format specifiers make clean tables easy:

```python
data = [
    ("Python", 1991, "Guido van Rossum"),
    ("JavaScript", 1995, "Brendan Eich"),
    ("Go", 2009, "Rob Pike"),
]

print(f"{'Language':<12} {'Year':>6} {'Creator':<20}")
print("-" * 40)

for language, year, creator in data:
    print(f"{language:<12} {year:>6} {creator:<20}")
```

Output:
```
Language         Year Creator
----------------------------------------
Python           1991 Guido van Rossum
JavaScript       1995 Brendan Eich
Go               2009 Rob Pike
```

### Financial Table

```python
transactions = [
    ("Rent", -1500.00),
    ("Salary", 5000.00),
    ("Groceries", -250.75),
    ("Bonus", 500.00),
]

print(f"{'Description':<15} {'Amount':>12}")
print("=" * 28)

total = 0
for desc, amount in transactions:
    print(f"{desc:<15} ${amount:>10,.2f}")
    total += amount

print("-" * 28)
print(f"{'Total':<15} ${total:>10,.2f}")
```

Output:
```
Description          Amount
============================
Rent            $  -1,500.00
Salary          $   5,000.00
Groceries       $    -250.75
Bonus           $     500.00
----------------------------
Total           $   3,749.25
```

## The format() Method

An older approach that's still useful:

```python
# Positional arguments
template = "Hello, {}! You are {} years old."
print(template.format("Alice", 25))
# Hello, Alice! You are 25 years old.

# Numbered positions
template = "{1} is {0} years old."
print(template.format(25, "Alice"))
# Alice is 25 years old.

# Named arguments
template = "Hello, {name}! You are {age} years old."
print(template.format(name="Alice", age=25))
# Hello, Alice! You are 25 years old.
```

### Format Specifiers with format()

```python
print("{:.2f}".format(3.14159))    # 3.14
print("{:>10}".format("test"))      #       test
print("{:,}".format(1000000))       # 1,000,000
```

### Reusing Templates

```python
template = "Dear {name},\n\nThank you for your {action}.\n\nBest,\n{sender}"

email1 = template.format(
    name="Alice",
    action="order",
    sender="Sales Team"
)

email2 = template.format(
    name="Bob",
    action="inquiry",
    sender="Support Team"
)
```

## Percent (%) Formatting

The oldest method, still seen in legacy code:

```python
name = "Alice"
age = 25

print("Hello, %s! You are %d years old." % (name, age))
# Hello, Alice! You are 25 years old.
```

### Format Specifiers

```python
# %s = string, %d = integer, %f = float
print("String: %s" % "hello")
print("Integer: %d" % 42)
print("Float: %f" % 3.14159)        # 3.141590
print("Float: %.2f" % 3.14159)      # 3.14

# Width and padding
print("|%10s|" % "test")             # |      test|
print("|%-10s|" % "test")            # |test      |
print("|%05d|" % 42)                 # |00042|
```

### When to Use Each Method

| Method | Use When |
|--------|----------|
| F-strings | Most cases (Python 3.6+) |
| format() | Need template reuse, Python 3.5 or earlier |
| % formatting | Maintaining legacy code |

## Special Characters in F-Strings

### Escaping Braces

```python
value = 42
print(f"The value is {value}")      # The value is 42
print(f"Show braces: {{value}}")    # Show braces: {value}
print(f"Both: {{{value}}}")         # Both: {42}
```

### Quotes Inside F-Strings

```python
name = "Alice"

# Mix quote types
print(f"Hello, '{name}'")           # Hello, 'Alice'
print(f'Hello, "{name}"')           # Hello, "Alice"

# Or escape
print(f"Hello, \"{name}\"")         # Hello, "Alice"
```

## Debugging with F-Strings

Python 3.8+ added a useful debugging feature:

```python
x = 10
y = 20

# Add = after the expression
print(f"{x=}")                  # x=10
print(f"{y=}")                  # y=20
print(f"{x + y=}")              # x + y=30
print(f"{x=}, {y=}")            # x=10, y=20
```

## Try It Yourself

1. Format a price as currency with 2 decimal places and comma separators
2. Create a right-aligned column of numbers with consistent width
3. Display a percentage from a decimal value
4. Build a formatted table of student names and grades

## Key Takeaways

1. F-strings (`f"..."`) are the modern, preferred approach
2. Format specifiers follow a colon: `{value:specifier}`
3. Common specifiers: `.2f` (decimals), `,` (thousands), `%` (percentage)
4. Alignment: `<` left, `>` right, `^` center, with optional width
5. Use `format()` for reusable templates
6. Escape braces with double braces: `{{` and `}}`

Next, we'll learn how to read data from files.
