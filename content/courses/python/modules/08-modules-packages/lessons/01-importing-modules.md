---
title: Importing Modules
order: 1
estimatedMinutes: 15
---

# Importing Modules

Modules are Python files containing reusable code. Instead of writing everything from scratch, you can import existing modules to access their functions, classes, and variables.

## What Is a Module?

A module is simply a `.py` file containing Python code. Python comes with hundreds of built-in modules called the Standard Library.

## Basic Import

Use the `import` statement to load a module:

```python
import math

print(math.pi)         # 3.141592653589793
print(math.sqrt(16))   # 4.0
print(math.floor(3.7)) # 3
```

After importing, access module contents using dot notation: `module_name.item_name`

## Import Specific Items

Use `from ... import` to import specific items:

```python
from math import pi, sqrt

print(pi)        # 3.141592653589793
print(sqrt(16))  # 4.0
# No need for math. prefix!
```

## Import with Alias

Use `as` to give a module a shorter name:

```python
import statistics as stats

data = [1, 2, 3, 4, 5]
print(stats.mean(data))    # 3
print(stats.median(data))  # 3
```

This is common with longer module names or modules with conventional aliases.

## Import All (Use Sparingly)

You can import everything from a module:

```python
from math import *

print(pi)       # Works
print(sqrt(16)) # Works
print(ceil(3.2)) # Works
```

**Warning:** This can cause name conflicts and makes code harder to understand. Avoid in production code.

## Common Standard Library Modules

### math - Mathematical Functions

```python
import math

print(math.pi)           # Pi constant
print(math.e)            # Euler's number
print(math.sqrt(25))     # Square root: 5.0
print(math.pow(2, 3))    # Power: 8.0
print(math.ceil(4.2))    # Round up: 5
print(math.floor(4.8))   # Round down: 4
print(math.factorial(5)) # 120
```

### random - Random Numbers

```python
import random

print(random.random())           # Random float 0.0 to 1.0
print(random.randint(1, 10))     # Random int from 1 to 10
print(random.choice(['a', 'b', 'c']))  # Random item from list

items = [1, 2, 3, 4, 5]
random.shuffle(items)            # Shuffle list in place
print(items)
```

### datetime - Dates and Times

```python
from datetime import datetime, date, timedelta

now = datetime.now()
print(now)                       # Current date and time

today = date.today()
print(today)                     # Current date

future = today + timedelta(days=30)
print(future)                    # Date 30 days from now
```

### os - Operating System Interface

```python
import os

print(os.getcwd())               # Current working directory
print(os.listdir('.'))           # Files in directory
print(os.path.exists('file.txt')) # Check if file exists
```

## How Python Finds Modules

When you import a module, Python looks in these locations (in order):

1. The current directory
2. Built-in modules
3. Directories in `PYTHONPATH`
4. Site-packages (installed packages)

You can see the search path:

```python
import sys
print(sys.path)
```

## Checking Module Contents

Use `dir()` to see what a module contains:

```python
import math
print(dir(math))
# ['__doc__', '__name__', 'acos', 'ceil', 'cos', 'e', 'floor', 'pi', ...]
```

Use `help()` for documentation:

```python
import math
help(math.sqrt)
# Help on built-in function sqrt in module math...
```

## Conditional Imports

Sometimes you want to handle missing modules gracefully:

```python
try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False
    print("NumPy not available, using basic math")
```

## Best Practices

### 1. Import at the Top

Put all imports at the beginning of your file:

```python
# Good
import math
import random
from datetime import datetime

def calculate():
    return math.sqrt(random.randint(1, 100))
```

### 2. Order Your Imports

Follow this order:
1. Standard library modules
2. Third-party modules
3. Your own modules

```python
# Standard library
import os
import sys

# Third-party
import requests
import numpy as np

# Local modules
from myproject import utils
```

### 3. Be Explicit

Prefer explicit imports over `import *`:

```python
# Good
from math import pi, sqrt

# Avoid
from math import *
```

## Try It Yourself

1. Import the `random` module and generate 5 random numbers between 1 and 100
2. Use the `datetime` module to print today's date in a nice format
3. Explore the `os` module to list files in your current directory

## Key Takeaways

1. Modules are reusable Python files you import with `import`
2. Use `from module import item` for specific items
3. Use `as` to create shorter aliases
4. Python's Standard Library has modules for most common tasks
5. Put imports at the top of your file, organized by category

Next, we'll explore the Standard Library in more depth.
