---
title: Writing Files
order: 4
estimatedMinutes: 20
---

# Writing Files

Saving data to files allows your programs to persist information between runs. Python provides several ways to write data to files.

## Basic File Writing

Use `"w"` mode to write:

```python
with open("output.txt", "w") as file:
    file.write("Hello, World!\n")
    file.write("This is line 2.\n")
```

This creates `output.txt` with:
```
Hello, World!
This is line 2.
```

## Write Modes

| Mode | Behavior |
|------|----------|
| `"w"` | Write. Creates new file or **truncates** (erases) existing. |
| `"a"` | Append. Creates new file or adds to end of existing. |
| `"x"` | Exclusive create. Fails if file exists. |

### Write Mode Overwrites!

```python
# First write
with open("data.txt", "w") as file:
    file.write("Original content\n")

# Second write - ERASES everything!
with open("data.txt", "w") as file:
    file.write("New content\n")

# File now contains only "New content"
```

### Append Mode Adds

```python
with open("log.txt", "a") as file:
    file.write("2024-01-15 10:30 - User logged in\n")

# Later...
with open("log.txt", "a") as file:
    file.write("2024-01-15 10:45 - User logged out\n")

# File contains both entries
```

### Exclusive Create

```python
try:
    with open("new_file.txt", "x") as file:
        file.write("This file was just created\n")
except FileExistsError:
    print("File already exists!")
```

## Writing Methods

### write() - Single String

```python
with open("output.txt", "w") as file:
    file.write("Line 1\n")
    file.write("Line 2\n")
    file.write("Line 3\n")
```

Note: `write()` doesn't add newlines automatically. Include `\n` yourself.

### writelines() - List of Strings

```python
lines = ["Line 1\n", "Line 2\n", "Line 3\n"]

with open("output.txt", "w") as file:
    file.writelines(lines)
```

Again, include newlines in your strings. `writelines()` doesn't add them.

### print() to File

```python
with open("output.txt", "w") as file:
    print("Line 1", file=file)
    print("Line 2", file=file)
    print("Value:", 42, file=file)
```

`print()` automatically adds newlines and handles multiple values.

## Common Writing Patterns

### Writing a List

```python
names = ["Alice", "Bob", "Charlie"]

with open("names.txt", "w") as file:
    for name in names:
        file.write(f"{name}\n")
```

Or more concisely:

```python
names = ["Alice", "Bob", "Charlie"]

with open("names.txt", "w") as file:
    file.write("\n".join(names))
```

### Writing a Dictionary

```python
config = {
    "name": "Alice",
    "age": "25",
    "city": "NYC"
}

with open("config.txt", "w") as file:
    for key, value in config.items():
        file.write(f"{key}={value}\n")
```

### Writing Tabular Data

```python
students = [
    ("Alice", 85, 92, 88),
    ("Bob", 78, 85, 90),
    ("Charlie", 92, 88, 95),
]

with open("grades.txt", "w") as file:
    file.write("Name\tMath\tScience\tEnglish\n")
    for name, math, science, english in students:
        file.write(f"{name}\t{math}\t{science}\t{english}\n")
```

## Writing CSV Files

### Manual CSV

```python
data = [
    ["Name", "Age", "City"],
    ["Alice", 25, "NYC"],
    ["Bob", 30, "LA"],
]

with open("data.csv", "w") as file:
    for row in data:
        line = ",".join(str(item) for item in row)
        file.write(line + "\n")
```

### Using the csv Module

```python
import csv

data = [
    ["Name", "Age", "City"],
    ["Alice", 25, "NYC"],
    ["Bob", 30, "LA"],
]

with open("data.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(data)
```

The csv module handles edge cases like commas in values.

## Writing JSON Files

```python
import json

data = {
    "name": "Alice",
    "age": 25,
    "hobbies": ["reading", "hiking"]
}

with open("data.json", "w") as file:
    json.dump(data, file, indent=2)
```

Creates:
```json
{
  "name": "Alice",
  "age": 25,
  "hobbies": [
    "reading",
    "hiking"
  ]
}
```

## File Safety Patterns

### Check Before Overwriting

```python
import os

filename = "important.txt"

if os.path.exists(filename):
    response = input(f"{filename} exists. Overwrite? (y/n): ")
    if response.lower() != "y":
        print("Cancelled.")
        exit()

with open(filename, "w") as file:
    file.write("New content\n")
```

### Write to Temp, Then Rename

For critical files, write to a temporary file first:

```python
import os
from pathlib import Path

data = "Important data\n"
target = Path("critical.txt")
temp = Path("critical.txt.tmp")

# Write to temp file
with open(temp, "w") as file:
    file.write(data)

# Only after successful write, replace original
temp.replace(target)
```

This prevents data loss if writing fails midway.

### Backup Before Overwriting

```python
import shutil
from pathlib import Path

filename = Path("config.txt")

if filename.exists():
    backup = filename.with_suffix(".txt.bak")
    shutil.copy(filename, backup)

with open(filename, "w") as file:
    file.write("New configuration\n")
```

## Encoding

Always specify encoding for consistent behavior:

```python
# UTF-8 for international text
with open("french.txt", "w", encoding="utf-8") as file:
    file.write("Bonjour, comment allez-vous?\n")

# Specific encoding when required
with open("legacy.txt", "w", encoding="cp1252") as file:
    file.write("Windows text\n")
```

## Binary Files

Write bytes with `"wb"` mode:

```python
# Write binary data
data = bytes([0x48, 0x65, 0x6C, 0x6C, 0x6F])  # "Hello"

with open("output.bin", "wb") as file:
    file.write(data)

# Copy a binary file
with open("image.png", "rb") as source:
    with open("copy.png", "wb") as dest:
        dest.write(source.read())
```

## Pathlib: Modern Writing

```python
from pathlib import Path

# Write text
Path("output.txt").write_text("Hello, World!\n")

# Write bytes
Path("output.bin").write_bytes(b"Binary data")
```

## Logging Pattern

A common pattern for application logging:

```python
from datetime import datetime

def log(message, filename="app.log"):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(filename, "a") as file:
        file.write(f"[{timestamp}] {message}\n")

# Usage
log("Application started")
log("User logged in")
log("Processing complete")
```

## Creating Directories

Create directories before writing to them:

```python
from pathlib import Path

output_dir = Path("output/reports/2024")
output_dir.mkdir(parents=True, exist_ok=True)

output_file = output_dir / "january.txt"
output_file.write_text("January Report\n")
```

## Complete Example: Report Generator

```python
from datetime import datetime
from pathlib import Path

def generate_report(data, output_dir="reports"):
    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)

    # Generate filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = output_path / f"report_{timestamp}.txt"

    # Write report
    with open(filename, "w", encoding="utf-8") as file:
        file.write("=" * 50 + "\n")
        file.write(f"Report generated: {datetime.now()}\n")
        file.write("=" * 50 + "\n\n")

        for key, value in data.items():
            file.write(f"{key}: {value}\n")

        file.write("\n" + "=" * 50 + "\n")

    print(f"Report saved to: {filename}")
    return filename

# Usage
data = {
    "Total Sales": "$15,234.00",
    "Orders": 127,
    "Average Order": "$119.95"
}

generate_report(data)
```

## Try It Yourself

1. Write a program that saves a shopping list to a file
2. Create a simple diary app that appends entries with dates
3. Read a file, modify its content, and save it back
4. Write a log file that tracks when your script runs

## Key Takeaways

1. `"w"` mode creates/overwrites, `"a"` mode appends
2. `write()` doesn't add newlines - include `\n` yourself
3. Always use `encoding="utf-8"` for consistent text handling
4. Use `with` statement for automatic file closing
5. Create directories with `Path.mkdir(parents=True, exist_ok=True)`
6. For critical files, write to temp first, then rename

You've completed the Strings and Files module! You can now read, process, and write text data with confidence.
