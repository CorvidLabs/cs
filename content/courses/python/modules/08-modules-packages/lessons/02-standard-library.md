---
title: Standard Library
order: 2
estimatedMinutes: 25
---

# Python Standard Library

Python's "batteries included" philosophy means it comes with a rich standard library. These modules are available without installing anything extra.

## os - Operating System Interface

Work with files, directories, and the operating system:

```python
import os

# Current working directory
print(os.getcwd())

# List directory contents
print(os.listdir("."))
print(os.listdir("/home/user"))

# Check if path exists
print(os.path.exists("myfile.txt"))
print(os.path.isfile("myfile.txt"))
print(os.path.isdir("myfolder"))

# Create directories
os.mkdir("new_folder")          # Single directory
os.makedirs("path/to/folder")   # Nested directories

# Remove files and directories
os.remove("file.txt")           # Delete file
os.rmdir("empty_folder")        # Delete empty directory

# Rename/move
os.rename("old.txt", "new.txt")
```

### Path Manipulation

```python
import os.path

path = "/home/user/documents/report.pdf"

print(os.path.basename(path))   # report.pdf
print(os.path.dirname(path))    # /home/user/documents
print(os.path.splitext(path))   # ('/home/user/documents/report', '.pdf')
print(os.path.join("folder", "subfolder", "file.txt"))
# folder/subfolder/file.txt (or folder\subfolder\file.txt on Windows)
```

## pathlib - Modern Path Handling

The object-oriented alternative to os.path (Python 3.4+):

```python
from pathlib import Path

# Create path objects
home = Path.home()
current = Path.cwd()

# Build paths with /
config = home / ".config" / "myapp" / "settings.json"

# Path properties
print(config.name)      # settings.json
print(config.stem)      # settings
print(config.suffix)    # .json
print(config.parent)    # /home/user/.config/myapp

# Check existence
if config.exists():
    content = config.read_text()

# Iterate directory
for file in Path(".").glob("*.txt"):
    print(file)

# Recursive glob
for py_file in Path(".").glob("**/*.py"):
    print(py_file)

# Create/delete
Path("new_folder").mkdir(exist_ok=True)
Path("temp.txt").unlink(missing_ok=True)  # Delete file
```

## sys - System-Specific Parameters

Access Python interpreter and system information:

```python
import sys

# Command-line arguments
print(sys.argv)         # ['script.py', 'arg1', 'arg2']

# Python version
print(sys.version)
print(sys.version_info) # (3, 11, 0, 'final', 0)

# Exit the program
sys.exit(0)             # Success
sys.exit(1)             # Error

# Module search path
print(sys.path)

# Standard streams
sys.stdout.write("Hello\n")
sys.stderr.write("Error!\n")
```

### Command-Line Arguments Example

```python
import sys

if len(sys.argv) < 2:
    print("Usage: python script.py <name>")
    sys.exit(1)

name = sys.argv[1]
print(f"Hello, {name}!")
```

## datetime - Dates and Times

```python
from datetime import datetime, date, time, timedelta

# Current date and time
now = datetime.now()
today = date.today()

print(now)      # 2024-01-15 10:30:45.123456
print(today)    # 2024-01-15

# Create specific dates/times
birthday = date(1990, 5, 15)
meeting = datetime(2024, 1, 20, 14, 30)

# Access components
print(now.year, now.month, now.day)
print(now.hour, now.minute, now.second)

# Formatting
print(now.strftime("%Y-%m-%d"))           # 2024-01-15
print(now.strftime("%B %d, %Y"))          # January 15, 2024
print(now.strftime("%I:%M %p"))           # 10:30 AM

# Parsing strings
date_str = "2024-01-15"
parsed = datetime.strptime(date_str, "%Y-%m-%d")
```

### Date Arithmetic

```python
from datetime import datetime, timedelta

now = datetime.now()

# Add/subtract time
tomorrow = now + timedelta(days=1)
next_week = now + timedelta(weeks=1)
two_hours_later = now + timedelta(hours=2)

# Difference between dates
date1 = datetime(2024, 1, 1)
date2 = datetime(2024, 12, 31)
diff = date2 - date1
print(f"{diff.days} days")  # 365 days
```

## json - JSON Encoding/Decoding

```python
import json

# Python to JSON string
data = {"name": "Alice", "age": 25, "active": True}
json_str = json.dumps(data)
print(json_str)  # {"name": "Alice", "age": 25, "active": true}

# Formatted output
json_str = json.dumps(data, indent=2)

# JSON string to Python
json_str = '{"name": "Bob", "scores": [85, 92, 78]}'
data = json.loads(json_str)
print(data["name"])     # Bob
print(data["scores"])   # [85, 92, 78]

# Read/write JSON files
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

with open("data.json", "r") as f:
    data = json.load(f)
```

## random - Random Numbers

```python
import random

# Random float between 0 and 1
print(random.random())

# Random integer in range (inclusive)
print(random.randint(1, 10))

# Random choice from sequence
colors = ["red", "green", "blue"]
print(random.choice(colors))

# Multiple random choices
print(random.choices(colors, k=5))  # With replacement
print(random.sample(colors, k=2))   # Without replacement

# Shuffle a list in place
cards = [1, 2, 3, 4, 5]
random.shuffle(cards)
print(cards)

# Random float in range
print(random.uniform(1.0, 10.0))

# Reproducible randomness (for testing)
random.seed(42)
print(random.randint(1, 100))  # Always same result
```

## math - Mathematical Functions

```python
import math

# Constants
print(math.pi)      # 3.141592653589793
print(math.e)       # 2.718281828459045

# Basic functions
print(math.sqrt(16))    # 4.0
print(math.pow(2, 8))   # 256.0
print(math.log(100))    # 4.605... (natural log)
print(math.log10(100))  # 2.0

# Rounding
print(math.floor(3.7))  # 3
print(math.ceil(3.2))   # 4
print(math.trunc(-3.7)) # -3

# Trigonometry
print(math.sin(math.pi / 2))  # 1.0
print(math.cos(0))            # 1.0
print(math.degrees(math.pi))  # 180.0
print(math.radians(180))      # 3.14159...

# Absolute value and sign
print(math.fabs(-5.5))  # 5.5
print(math.copysign(1, -5))  # -1.0
```

## collections - Specialized Containers

### Counter

```python
from collections import Counter

# Count occurrences
text = "mississippi"
counts = Counter(text)
print(counts)  # Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})

# Most common
print(counts.most_common(2))  # [('i', 4), ('s', 4)]

# Arithmetic
c1 = Counter(['a', 'b', 'a'])
c2 = Counter(['a', 'b', 'c'])
print(c1 + c2)  # Counter({'a': 3, 'b': 2, 'c': 1})
```

### defaultdict

```python
from collections import defaultdict

# Auto-initialize missing keys
word_groups = defaultdict(list)
words = ["apple", "banana", "apricot", "blueberry"]

for word in words:
    first_letter = word[0]
    word_groups[first_letter].append(word)

print(dict(word_groups))
# {'a': ['apple', 'apricot'], 'b': ['banana', 'blueberry']}

# Counting with defaultdict
counts = defaultdict(int)
for char in "hello":
    counts[char] += 1
```

### namedtuple

```python
from collections import namedtuple

# Create a named tuple class
Point = namedtuple("Point", ["x", "y"])
Person = namedtuple("Person", ["name", "age", "city"])

# Create instances
p = Point(3, 4)
print(p.x, p.y)

alice = Person("Alice", 25, "NYC")
print(alice.name)   # Alice
print(alice[0])     # Alice (also works by index)
```

## itertools - Iterator Tools

```python
import itertools

# Infinite iterators
counter = itertools.count(10)      # 10, 11, 12, ...
cycle = itertools.cycle("ABC")     # A, B, C, A, B, ...

# Combinations and permutations
letters = ["A", "B", "C"]
print(list(itertools.permutations(letters, 2)))
# [('A', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'C'), ('C', 'A'), ('C', 'B')]

print(list(itertools.combinations(letters, 2)))
# [('A', 'B'), ('A', 'C'), ('B', 'C')]

# Chain multiple iterables
combined = itertools.chain([1, 2], [3, 4], [5])
print(list(combined))  # [1, 2, 3, 4, 5]

# Group consecutive items
data = [('A', 1), ('A', 2), ('B', 3), ('B', 4)]
for key, group in itertools.groupby(data, key=lambda x: x[0]):
    print(key, list(group))
```

## re - Regular Expressions

```python
import re

text = "Contact: alice@example.com or bob@test.org"

# Find all matches
emails = re.findall(r'\w+@\w+\.\w+', text)
print(emails)  # ['alice@example.com', 'bob@test.org']

# Search for pattern
match = re.search(r'\d{3}-\d{4}', "Call 555-1234")
if match:
    print(match.group())  # 555-1234

# Replace
cleaned = re.sub(r'\s+', ' ', "too   many    spaces")
print(cleaned)  # "too many spaces"

# Split
parts = re.split(r'[,;]', "apple,banana;cherry")
print(parts)  # ['apple', 'banana', 'cherry']
```

## Try It Yourself

1. List all Python files in a directory using pathlib
2. Calculate someone's age from their birthdate
3. Count word frequencies in a text file
4. Generate a random password with letters and digits

## Key Takeaways

1. `os` and `pathlib` for file system operations
2. `sys` for command-line args and system info
3. `datetime` for dates, times, and calculations
4. `json` for data serialization
5. `random` for randomness, `math` for calculations
6. `collections` for specialized data structures
7. `re` for pattern matching

Next, we'll learn how to create your own reusable modules.
