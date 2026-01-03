---
title: String Methods
order: 1
estimatedMinutes: 15
---

# String Methods

Python strings come with powerful built-in methods for searching, transforming, and manipulating text. Let's explore the most useful ones.

## Strings Are Objects

In Python, strings are objects with methods you can call using dot notation:

```python
message = "hello world"
result = message.upper()
print(result)  # HELLO WORLD
```

## Case Conversion

### upper() and lower()

```python
text = "Hello World"
print(text.upper())  # HELLO WORLD
print(text.lower())  # hello world
```

### capitalize() and title()

```python
text = "hello world"
print(text.capitalize())  # Hello world (first letter only)
print(text.title())       # Hello World (each word)
```

### swapcase()

```python
text = "Hello World"
print(text.swapcase())  # hELLO wORLD
```

## Searching and Finding

### find() and index()

```python
text = "Hello, World!"
print(text.find("World"))   # 7 (position where "World" starts)
print(text.find("Python"))  # -1 (not found)
```

`index()` works like `find()` but raises an error if not found:

```python
text.index("World")   # 7
text.index("Python")  # ValueError: substring not found
```

### startswith() and endswith()

```python
filename = "report.pdf"
print(filename.startswith("report"))  # True
print(filename.endswith(".pdf"))      # True
print(filename.endswith(".txt"))      # False
```

### count()

```python
text = "banana"
print(text.count("a"))  # 3
print(text.count("na")) # 2
```

## Checking String Content

### isalpha(), isdigit(), isalnum()

```python
print("Hello".isalpha())    # True (only letters)
print("12345".isdigit())    # True (only digits)
print("Hello123".isalnum()) # True (letters and digits)
print("Hello!".isalpha())   # False (contains !)
```

### isspace()

```python
print("   ".isspace())    # True
print("  a  ".isspace())  # False
```

### isupper() and islower()

```python
print("HELLO".isupper())  # True
print("hello".islower())  # True
print("Hello".isupper())  # False
```

## Modifying Strings

### strip(), lstrip(), rstrip()

Remove whitespace from ends:

```python
text = "   Hello World   "
print(text.strip())   # "Hello World"
print(text.lstrip())  # "Hello World   "
print(text.rstrip())  # "   Hello World"
```

You can also strip specific characters:

```python
text = "###Hello###"
print(text.strip("#"))  # "Hello"
```

### replace()

```python
text = "Hello World"
print(text.replace("World", "Python"))  # Hello Python
print(text.replace("l", "L"))           # HeLLo WorLd
```

Limit replacements:

```python
text = "one one one"
print(text.replace("one", "two", 2))  # two two one
```

## Splitting and Joining

### split()

```python
text = "apple,banana,cherry"
fruits = text.split(",")
print(fruits)  # ['apple', 'banana', 'cherry']

sentence = "Hello World Python"
words = sentence.split()  # Splits on whitespace by default
print(words)  # ['Hello', 'World', 'Python']
```

### join()

```python
words = ['Hello', 'World']
print(" ".join(words))   # Hello World
print("-".join(words))   # Hello-World
print("".join(words))    # HelloWorld
```

### splitlines()

```python
text = "Line 1\nLine 2\nLine 3"
lines = text.splitlines()
print(lines)  # ['Line 1', 'Line 2', 'Line 3']
```

## Alignment and Padding

### center(), ljust(), rjust()

```python
text = "Python"
print(text.center(20))      # "       Python       "
print(text.ljust(20, "-"))  # "Python--------------"
print(text.rjust(20, "*"))  # "**************Python"
```

### zfill()

Pad with zeros:

```python
number = "42"
print(number.zfill(5))  # "00042"
```

## Method Chaining

String methods return new strings, so you can chain them:

```python
text = "  HELLO WORLD  "
result = text.strip().lower().replace("world", "python")
print(result)  # "hello python"
```

## Strings Are Immutable

Remember: string methods don't modify the original string. They return a new one:

```python
text = "hello"
text.upper()      # Creates "HELLO" but doesn't save it
print(text)       # Still "hello"

text = text.upper()  # Reassign to save the change
print(text)          # Now "HELLO"
```

## Try It Yourself

1. Take a sentence and count how many times the letter 'e' appears
2. Clean user input by stripping whitespace and converting to lowercase
3. Split a CSV line and join it with tabs instead of commas

## Key Takeaways

1. Strings have many built-in methods for common operations
2. Methods are called using dot notation: `string.method()`
3. String methods return new strings (strings are immutable)
4. Use `split()` to break strings apart, `join()` to combine them
5. Method chaining allows multiple operations in one line

Next, we'll explore string formatting techniques for creating dynamic text.
