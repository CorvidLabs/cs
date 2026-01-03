---
title: Reading Files
order: 3
estimatedMinutes: 20
---

# Reading Files

Files let programs persist data beyond a single run. Python makes reading files straightforward with the `open()` function.

## The open() Function

```python
file = open("filename.txt", "r")
content = file.read()
file.close()
```

But this approach has a problem: if an error occurs before `close()`, the file stays open. Use the `with` statement instead.

## The with Statement

`with` automatically closes the file when the block ends:

```python
with open("example.txt", "r") as file:
    content = file.read()
    print(content)
# File is automatically closed here
```

This is the recommended approach. Always use `with` for file operations.

## File Modes

The second argument to `open()` specifies the mode:

| Mode | Description |
|------|-------------|
| `"r"` | Read (default). File must exist. |
| `"w"` | Write. Creates new or truncates existing. |
| `"a"` | Append. Creates new or adds to existing. |
| `"r+"` | Read and write. File must exist. |
| `"x"` | Create. Fails if file exists. |
| `"b"` | Binary mode (e.g., `"rb"`, `"wb"`). |
| `"t"` | Text mode (default, e.g., `"rt"`). |

## Reading Methods

### read() - Entire File

```python
with open("story.txt", "r") as file:
    content = file.read()
    print(content)
```

For large files, this loads everything into memory at once.

### read(n) - Specific Characters

```python
with open("story.txt", "r") as file:
    first_100 = file.read(100)
    next_50 = file.read(50)  # Continues from position 100
```

### readline() - One Line

```python
with open("story.txt", "r") as file:
    line1 = file.readline()
    line2 = file.readline()
    print(line1)
    print(line2)
```

### readlines() - All Lines as List

```python
with open("names.txt", "r") as file:
    lines = file.readlines()
    print(lines)
# ['Alice\n', 'Bob\n', 'Charlie\n']
```

Note: Lines include the newline character `\n`.

## Iterating Over Lines

The most memory-efficient approach for large files:

```python
with open("data.txt", "r") as file:
    for line in file:
        print(line.strip())  # strip() removes \n
```

This reads one line at a time, not the whole file.

## Working with Line Numbers

```python
with open("code.py", "r") as file:
    for line_number, line in enumerate(file, start=1):
        print(f"{line_number:4}: {line}", end="")
```

Output:
```
   1: def hello():
   2:     print("Hello, World!")
   3:
   4: hello()
```

## Handling the Newline Character

Lines from files include `\n`. Remove it with:

```python
# strip() - removes whitespace from both ends
line = "Hello World\n"
print(line.strip())      # "Hello World"

# rstrip() - removes from right end only
print(line.rstrip())     # "Hello World"

# rstrip('\n') - removes only newline
line = "  Hello  \n"
print(line.rstrip('\n')) # "  Hello  "
```

## Common Patterns

### Processing Each Line

```python
totals = []

with open("numbers.txt", "r") as file:
    for line in file:
        number = int(line.strip())
        totals.append(number)

print(f"Sum: {sum(totals)}")
```

### Filtering Lines

```python
errors = []

with open("log.txt", "r") as file:
    for line in file:
        if "ERROR" in line:
            errors.append(line.strip())

print(f"Found {len(errors)} errors")
```

### Building a Dictionary

```python
# config.txt contains:
# name=Alice
# age=25
# city=NYC

config = {}

with open("config.txt", "r") as file:
    for line in file:
        line = line.strip()
        if "=" in line:
            key, value = line.split("=", 1)
            config[key] = value

print(config)
# {'name': 'Alice', 'age': '25', 'city': 'NYC'}
```

## Checking If a File Exists

```python
import os

filename = "data.txt"

if os.path.exists(filename):
    with open(filename, "r") as file:
        content = file.read()
else:
    print(f"File not found: {filename}")
```

Or use pathlib (modern approach):

```python
from pathlib import Path

path = Path("data.txt")

if path.exists():
    content = path.read_text()
else:
    print(f"File not found: {path}")
```

## Handling Errors

Use try-except for robust file handling:

```python
try:
    with open("config.txt", "r") as file:
        content = file.read()
except FileNotFoundError:
    print("Config file not found!")
    content = ""
except PermissionError:
    print("Permission denied!")
    content = ""
except IOError as e:
    print(f"Error reading file: {e}")
    content = ""
```

## File Paths

### Relative Paths

```python
# Same directory as script
with open("data.txt", "r") as file:
    pass

# Subdirectory
with open("data/config.txt", "r") as file:
    pass

# Parent directory
with open("../shared/data.txt", "r") as file:
    pass
```

### Absolute Paths

```python
# Windows
with open(r"C:\Users\Alice\data.txt", "r") as file:
    pass

# macOS/Linux
with open("/home/alice/data.txt", "r") as file:
    pass
```

### Cross-Platform Paths

```python
from pathlib import Path

# Works on all platforms
data_path = Path("data") / "config.txt"
with open(data_path, "r") as file:
    pass

# Get current script's directory
script_dir = Path(__file__).parent
config_path = script_dir / "config.txt"
```

## Text Encoding

Specify encoding for non-ASCII text:

```python
# UTF-8 (handles most international text)
with open("french.txt", "r", encoding="utf-8") as file:
    content = file.read()

# Windows default
with open("windows.txt", "r", encoding="cp1252") as file:
    content = file.read()

# Handle encoding errors
with open("mixed.txt", "r", encoding="utf-8", errors="replace") as file:
    content = file.read()  # Invalid bytes become ?
```

Always specify `encoding="utf-8"` for reliable cross-platform behavior.

## Reading Binary Files

For images, PDFs, and other binary data:

```python
with open("image.png", "rb") as file:  # rb = read binary
    data = file.read()
    print(f"File size: {len(data)} bytes")
```

## Pathlib: Modern File Reading

```python
from pathlib import Path

# Read entire file
content = Path("story.txt").read_text()

# Read as lines
lines = Path("names.txt").read_text().splitlines()

# Read binary
data = Path("image.png").read_bytes()
```

## Try It Yourself

1. Read a text file and count the number of lines
2. Read a file and find all lines containing a specific word
3. Read a configuration file (key=value format) into a dictionary
4. Read a CSV file and print each row's first column

## Key Takeaways

1. Always use `with open(...) as file:` for automatic cleanup
2. `read()` gets entire file, `readline()` one line, iterate for efficiency
3. Lines include `\n` - use `strip()` to remove it
4. Handle `FileNotFoundError` for missing files
5. Specify `encoding="utf-8"` for reliable text handling
6. Use `pathlib.Path` for modern, cross-platform file operations

Next, we'll learn how to write data to files.
