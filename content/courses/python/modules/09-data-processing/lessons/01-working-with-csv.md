---
title: Working with CSV Files
order: 1
estimatedMinutes: 18
---

# Working with CSV Files

CSV (Comma-Separated Values) is one of the most common formats for storing tabular data. Python's built-in `csv` module makes reading and writing CSV files straightforward.

## What Is a CSV File?

A CSV file stores data in rows and columns, with each value separated by a comma:

```
name,age,city
Alice,25,New York
Bob,30,San Francisco
Carol,28,Chicago
```

The first row typically contains column headers, and each subsequent row contains data.

## Reading CSV Files

### Basic Reader

Use `csv.reader()` to read CSV files:

```python
import csv

with open('data.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)
# ['name', 'age', 'city']
# ['Alice', '25', 'New York']
# ['Bob', '30', 'San Francisco']
# ['Carol', '28', 'Chicago']
```

Each row is returned as a list of strings.

### Skipping the Header

Often you want to process data without the header row:

```python
import csv

with open('data.csv', 'r') as file:
    reader = csv.reader(file)
    header = next(reader)  # Read and skip header
    print(f"Columns: {header}")

    for row in reader:
        name, age, city = row
        print(f"{name} is {age} years old")
# Columns: ['name', 'age', 'city']
# Alice is 25 years old
# Bob is 30 years old
# Carol is 28 years old
```

### DictReader - Reading as Dictionaries

`csv.DictReader` reads each row as a dictionary with column headers as keys:

```python
import csv

with open('data.csv', 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(f"{row['name']} lives in {row['city']}")
# Alice lives in New York
# Bob lives in San Francisco
# Carol lives in Chicago
```

This is often more readable than accessing by index.

## Writing CSV Files

### Basic Writer

Use `csv.writer()` to write CSV files:

```python
import csv

data = [
    ['name', 'score', 'grade'],
    ['Alice', 95, 'A'],
    ['Bob', 82, 'B'],
    ['Carol', 78, 'C']
]

with open('grades.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    for row in data:
        writer.writerow(row)
```

**Important:** Always use `newline=''` when opening files for CSV writing to prevent extra blank lines.

### Writing Multiple Rows at Once

Use `writerows()` to write all rows at once:

```python
import csv

data = [
    ['name', 'score', 'grade'],
    ['Alice', 95, 'A'],
    ['Bob', 82, 'B'],
    ['Carol', 78, 'C']
]

with open('grades.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(data)
```

### DictWriter - Writing from Dictionaries

`csv.DictWriter` writes dictionaries to CSV:

```python
import csv

students = [
    {'name': 'Alice', 'score': 95, 'grade': 'A'},
    {'name': 'Bob', 'score': 82, 'grade': 'B'},
    {'name': 'Carol', 'score': 78, 'grade': 'C'}
]

with open('grades.csv', 'w', newline='') as file:
    fieldnames = ['name', 'score', 'grade']
    writer = csv.DictWriter(file, fieldnames=fieldnames)

    writer.writeheader()  # Write the header row
    writer.writerows(students)
```

## Handling Different Delimiters

Not all CSV files use commas. Some use tabs, semicolons, or other characters:

```python
import csv

# Reading a tab-separated file
with open('data.tsv', 'r') as file:
    reader = csv.reader(file, delimiter='\t')
    for row in reader:
        print(row)

# Writing a semicolon-separated file
with open('data.csv', 'w', newline='') as file:
    writer = csv.writer(file, delimiter=';')
    writer.writerow(['name', 'value'])
```

## Working with CSV Data

### Converting Types

CSV values are always strings. Convert them as needed:

```python
import csv

with open('sales.csv', 'r') as file:
    reader = csv.DictReader(file)
    total = 0
    for row in reader:
        price = float(row['price'])
        quantity = int(row['quantity'])
        total += price * quantity
    print(f"Total sales: ${total:.2f}")
```

### Filtering Data

Process only rows that match certain criteria:

```python
import csv

with open('employees.csv', 'r') as file:
    reader = csv.DictReader(file)
    senior_employees = []
    for row in reader:
        if int(row['years']) >= 5:
            senior_employees.append(row)

    print(f"Found {len(senior_employees)} senior employees")
```

### Reading into a List

Load all data into memory for multiple passes:

```python
import csv

with open('data.csv', 'r') as file:
    reader = csv.DictReader(file)
    data = list(reader)

# Now you can iterate multiple times
print(f"Total rows: {len(data)}")
print(f"First row: {data[0]}")
print(f"Last row: {data[-1]}")
```

## Real-World Example: Grade Calculator

```python
import csv

def calculate_grades(input_file, output_file):
    """Read scores, calculate grades, write results."""

    with open(input_file, 'r') as infile:
        reader = csv.DictReader(infile)
        students = list(reader)

    # Calculate grades
    for student in students:
        score = float(student['score'])
        if score >= 90:
            student['grade'] = 'A'
        elif score >= 80:
            student['grade'] = 'B'
        elif score >= 70:
            student['grade'] = 'C'
        elif score >= 60:
            student['grade'] = 'D'
        else:
            student['grade'] = 'F'

    # Write results
    with open(output_file, 'w', newline='') as outfile:
        fieldnames = ['name', 'score', 'grade']
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(students)

# Usage
calculate_grades('scores.csv', 'results.csv')
```

## Common Pitfalls

### 1. Forgetting newline=''

```python
# Wrong - may create extra blank lines on Windows
with open('data.csv', 'w') as file:
    writer = csv.writer(file)

# Correct
with open('data.csv', 'w', newline='') as file:
    writer = csv.writer(file)
```

### 2. Not Handling Missing Values

```python
import csv

with open('data.csv', 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        # Check for empty values
        age = int(row['age']) if row['age'] else 0
```

### 3. Forgetting to Close Files

Always use `with` statements to ensure files are properly closed:

```python
# Good - file automatically closed
with open('data.csv', 'r') as file:
    reader = csv.reader(file)
    data = list(reader)
```

## Key Takeaways

1. Use `csv.reader()` and `csv.writer()` for basic CSV operations
2. Use `csv.DictReader()` and `csv.DictWriter()` for more readable code with headers
3. Always use `newline=''` when opening files for writing
4. CSV values are strings - convert to int or float as needed
5. Use `delimiter` parameter for non-comma separators
6. Use `with` statements to automatically close files

Next, we'll explore working with JSON data.
