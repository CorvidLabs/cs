---
title: Creating Modules
order: 3
estimatedMinutes: 20
---

# Creating Your Own Modules

Modules let you organize code into reusable files. Any Python file can be imported as a module.

## Your First Module

Create a file called `greetings.py`:

```python
# greetings.py

def say_hello(name):
    """Return a greeting message."""
    return f"Hello, {name}!"

def say_goodbye(name):
    """Return a farewell message."""
    return f"Goodbye, {name}!"

DEFAULT_GREETING = "Hello, stranger!"
```

Now use it in another file:

```python
# main.py
import greetings

print(greetings.say_hello("Alice"))  # Hello, Alice!
print(greetings.DEFAULT_GREETING)    # Hello, stranger!
```

## Module Structure Best Practices

### Organize Related Functions

```python
# math_utils.py

def add(a, b):
    """Add two numbers."""
    return a + b

def subtract(a, b):
    """Subtract b from a."""
    return a - b

def multiply(a, b):
    """Multiply two numbers."""
    return a * b

def divide(a, b):
    """Divide a by b. Raises ValueError if b is zero."""
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b
```

### Include Constants

```python
# constants.py

# Application settings
APP_NAME = "MyApp"
VERSION = "1.0.0"
DEBUG = False

# API endpoints
API_BASE_URL = "https://api.example.com"
API_VERSION = "v1"

# Limits
MAX_RETRIES = 3
TIMEOUT_SECONDS = 30
```

### Add Docstrings

```python
# text_utils.py

"""
Text processing utilities.

This module provides functions for common text operations
like cleaning, formatting, and validation.
"""

def clean_whitespace(text):
    """
    Remove extra whitespace from text.

    Args:
        text: The input string to clean.

    Returns:
        String with normalized whitespace.

    Example:
        >>> clean_whitespace("  too   many  spaces  ")
        'too many spaces'
    """
    return " ".join(text.split())

def truncate(text, max_length, suffix="..."):
    """
    Truncate text to a maximum length.

    Args:
        text: The string to truncate.
        max_length: Maximum length including suffix.
        suffix: String to append if truncated (default: "...").

    Returns:
        Truncated string if longer than max_length,
        otherwise the original string.
    """
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)] + suffix
```

## The __name__ Variable

Every module has a `__name__` variable. When run directly, it's `"__main__"`. When imported, it's the module name.

```python
# my_module.py

def greet():
    print("Hello from my_module!")

# This runs only when executed directly, not when imported
if __name__ == "__main__":
    print("Running as main program")
    greet()
```

### Why Use if __name__ == "__main__"?

1. **Test your module**: Run it directly to test
2. **Prevent side effects**: Code won't run when imported
3. **Dual purpose**: File works as both module and script

```python
# calculator.py

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

if __name__ == "__main__":
    # This only runs when calculator.py is executed directly
    print("Calculator Test")
    print(f"5 + 3 = {add(5, 3)}")
    print(f"5 - 3 = {subtract(5, 3)}")
```

## Module with Classes

```python
# models.py

class User:
    """Represents a user in the system."""

    def __init__(self, name, email):
        self.name = name
        self.email = email
        self.active = True

    def deactivate(self):
        """Mark the user as inactive."""
        self.active = False

    def __repr__(self):
        status = "active" if self.active else "inactive"
        return f"User({self.name!r}, {status})"


class Product:
    """Represents a product for sale."""

    def __init__(self, name, price):
        self.name = name
        self.price = price

    def apply_discount(self, percent):
        """Apply a percentage discount."""
        self.price *= (1 - percent / 100)

    def __repr__(self):
        return f"Product({self.name!r}, ${self.price:.2f})"
```

Usage:

```python
from models import User, Product

alice = User("Alice", "alice@example.com")
laptop = Product("Laptop", 999.99)

laptop.apply_discount(10)
print(laptop)  # Product('Laptop', $899.99)
```

## Private vs Public

By convention, names starting with underscore are "private":

```python
# database.py

# Public API
def connect(host, port):
    """Connect to the database."""
    return _create_connection(host, port)

def query(connection, sql):
    """Execute a query."""
    _validate_sql(sql)
    return _execute(connection, sql)

# "Private" implementation details
def _create_connection(host, port):
    """Internal: Create a connection object."""
    pass

def _validate_sql(sql):
    """Internal: Validate SQL syntax."""
    pass

def _execute(connection, sql):
    """Internal: Execute the query."""
    pass

# Private constant
_CONNECTION_POOL = []
```

Note: Python doesn't enforce privacy. This is just a convention.

## Organizing Larger Modules

For complex modules, split into multiple files within a package.

### Package Structure

```
mypackage/
    __init__.py      # Makes it a package
    core.py          # Core functionality
    utils.py         # Utility functions
    models.py        # Data models
    exceptions.py    # Custom exceptions
```

### The __init__.py File

Controls what's available when the package is imported:

```python
# mypackage/__init__.py

from .core import main_function, important_class
from .models import User, Product
from .exceptions import MyPackageError

__version__ = "1.0.0"
__all__ = ["main_function", "important_class", "User", "Product"]
```

### Using the Package

```python
# Option 1: Import from package
from mypackage import User, main_function

# Option 2: Import specific module
from mypackage.models import User

# Option 3: Import entire package
import mypackage
mypackage.main_function()
```

## Relative Imports

Within a package, use relative imports:

```python
# mypackage/core.py

from .utils import helper_function    # Same package
from .models import User              # Same package
from ..other_package import something # Parent package
```

## Module Caching

Python caches imported modules. Changes require restarting:

```python
import my_module     # First import: file is executed
import my_module     # Second import: uses cached version

# Force reload (usually for development)
import importlib
importlib.reload(my_module)
```

## Complete Example: Utility Library

```python
# string_utils.py

"""
String utility functions.

Provides common string operations for text processing.
"""

import re

__version__ = "1.0.0"
__author__ = "Your Name"

# Constants
WORD_PATTERN = re.compile(r'\b\w+\b')

def count_words(text):
    """
    Count words in text.

    Args:
        text: Input string.

    Returns:
        Number of words.
    """
    return len(WORD_PATTERN.findall(text))

def reverse_words(text):
    """
    Reverse the order of words.

    Args:
        text: Input string.

    Returns:
        String with words in reverse order.
    """
    words = text.split()
    return " ".join(reversed(words))

def is_palindrome(text):
    """
    Check if text is a palindrome (ignoring case and spaces).

    Args:
        text: Input string.

    Returns:
        True if palindrome, False otherwise.
    """
    cleaned = "".join(c.lower() for c in text if c.isalnum())
    return cleaned == cleaned[::-1]

def title_case(text):
    """
    Convert to title case, handling edge cases.

    Args:
        text: Input string.

    Returns:
        Title-cased string.
    """
    small_words = {"a", "an", "the", "and", "but", "or", "for", "in", "on"}
    words = text.lower().split()

    result = []
    for i, word in enumerate(words):
        if i == 0 or word not in small_words:
            result.append(word.capitalize())
        else:
            result.append(word)

    return " ".join(result)


if __name__ == "__main__":
    # Test the module
    test_text = "The quick brown fox jumps over the lazy dog"

    print(f"Word count: {count_words(test_text)}")
    print(f"Reversed: {reverse_words(test_text)}")
    print(f"Title case: {title_case(test_text)}")
    print(f"Is 'A man a plan a canal Panama' palindrome? "
          f"{is_palindrome('A man a plan a canal Panama')}")
```

## Try It Yourself

1. Create a module with math helper functions (factorial, is_prime, fibonacci)
2. Build a module for validating user input (email, phone, password)
3. Create a simple logging module with different log levels
4. Design a configuration module that reads from environment variables

## Key Takeaways

1. Any `.py` file can be imported as a module
2. Use `if __name__ == "__main__":` for test code
3. Prefix "private" names with underscore
4. Docstrings document functions and modules
5. Packages are folders with `__init__.py`
6. Use relative imports within packages

Next, we'll learn about pip and managing external packages.
