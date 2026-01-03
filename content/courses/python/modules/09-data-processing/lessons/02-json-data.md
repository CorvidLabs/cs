---
title: JSON Data
order: 2
estimatedMinutes: 16
---

# JSON Data

JSON (JavaScript Object Notation) is a lightweight data format widely used for APIs, configuration files, and data storage. Python's `json` module handles JSON seamlessly.

## What Is JSON?

JSON stores data using a simple text format:

```json
{
    "name": "Alice",
    "age": 25,
    "active": true,
    "skills": ["Python", "SQL", "Git"],
    "address": {
        "city": "New York",
        "zip": "10001"
    }
}
```

JSON supports: strings, numbers, booleans, null, arrays, and objects.

## JSON to Python Mapping

| JSON Type | Python Type |
|-----------|-------------|
| object    | dict        |
| array     | list        |
| string    | str         |
| number    | int/float   |
| true      | True        |
| false     | False       |
| null      | None        |

## Parsing JSON Strings

Use `json.loads()` to parse a JSON string:

```python
import json

json_string = '{"name": "Alice", "age": 25}'
data = json.loads(json_string)

print(data['name'])  # Alice
print(data['age'])   # 25
print(type(data))    # <class 'dict'>
```

## Creating JSON Strings

Use `json.dumps()` to convert Python objects to JSON:

```python
import json

data = {
    'name': 'Bob',
    'age': 30,
    'active': True
}

json_string = json.dumps(data)
print(json_string)  # {"name": "Bob", "age": 30, "active": true}
```

### Pretty Printing

Make JSON human-readable with `indent`:

```python
import json

data = {
    'name': 'Carol',
    'skills': ['Python', 'SQL'],
    'contact': {'email': 'carol@example.com'}
}

pretty = json.dumps(data, indent=2)
print(pretty)
# {
#   "name": "Carol",
#   "skills": [
#     "Python",
#     "SQL"
#   ],
#   "contact": {
#     "email": "carol@example.com"
#   }
# }
```

### Sorting Keys

Sort dictionary keys alphabetically:

```python
import json

data = {'zebra': 1, 'apple': 2, 'mango': 3}
print(json.dumps(data, sort_keys=True))
# {"apple": 2, "mango": 3, "zebra": 1}
```

## Reading JSON Files

Use `json.load()` (no 's') to read from a file:

```python
import json

with open('config.json', 'r') as file:
    config = json.load(file)

print(config['database']['host'])
```

## Writing JSON Files

Use `json.dump()` (no 's') to write to a file:

```python
import json

data = {
    'users': [
        {'name': 'Alice', 'id': 1},
        {'name': 'Bob', 'id': 2}
    ]
}

with open('users.json', 'w') as file:
    json.dump(data, file, indent=2)
```

## Working with JSON Data

### Accessing Nested Data

Navigate through nested structures:

```python
import json

json_data = '''
{
    "company": "Tech Corp",
    "employees": [
        {"name": "Alice", "department": "Engineering"},
        {"name": "Bob", "department": "Marketing"}
    ]
}
'''

data = json.loads(json_data)
print(data['company'])                      # Tech Corp
print(data['employees'][0]['name'])         # Alice
print(data['employees'][1]['department'])   # Marketing
```

### Modifying JSON Data

JSON data becomes regular Python objects you can modify:

```python
import json

with open('config.json', 'r') as file:
    config = json.load(file)

# Modify
config['debug'] = True
config['version'] = '2.0'

# Save changes
with open('config.json', 'w') as file:
    json.dump(config, file, indent=2)
```

### Processing Lists of Objects

Common pattern for API responses:

```python
import json

response = '''
[
    {"id": 1, "title": "Task A", "done": false},
    {"id": 2, "title": "Task B", "done": true},
    {"id": 3, "title": "Task C", "done": false}
]
'''

tasks = json.loads(response)

# Filter incomplete tasks
incomplete = [t for t in tasks if not t['done']]
print(f"Incomplete tasks: {len(incomplete)}")

# Get all titles
titles = [t['title'] for t in tasks]
print(f"All tasks: {titles}")
```

## Handling JSON Errors

### Invalid JSON

`json.loads()` raises `JSONDecodeError` for invalid JSON:

```python
import json

invalid = '{"name": "Alice", age: 25}'  # Missing quotes around age

try:
    data = json.loads(invalid)
except json.JSONDecodeError as e:
    print(f"Invalid JSON: {e}")
```

### Safe Access with .get()

Use `.get()` for optional fields:

```python
import json

data = json.loads('{"name": "Alice"}')

# This would raise KeyError
# print(data['age'])

# Safe access with default
age = data.get('age', 0)
print(age)  # 0
```

## Converting Between CSV and JSON

### CSV to JSON

```python
import csv
import json

with open('data.csv', 'r') as csv_file:
    reader = csv.DictReader(csv_file)
    data = list(reader)

with open('data.json', 'w') as json_file:
    json.dump(data, json_file, indent=2)
```

### JSON to CSV

```python
import csv
import json

with open('data.json', 'r') as json_file:
    data = json.load(json_file)

with open('data.csv', 'w', newline='') as csv_file:
    if data:
        fieldnames = data[0].keys()
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
```

## Real-World Example: API Response Handler

```python
import json

def process_api_response(response_text):
    """Parse API response and extract relevant data."""
    try:
        data = json.loads(response_text)
    except json.JSONDecodeError:
        return {'error': 'Invalid JSON response'}

    # Check for error in response
    if 'error' in data:
        return {'error': data['error']['message']}

    # Extract results
    results = []
    for item in data.get('items', []):
        results.append({
            'id': item['id'],
            'name': item.get('name', 'Unknown'),
            'status': item.get('status', 'pending')
        })

    return {
        'count': len(results),
        'results': results
    }

# Example usage
response = '''
{
    "items": [
        {"id": 1, "name": "Item A", "status": "active"},
        {"id": 2, "name": "Item B"}
    ]
}
'''

result = process_api_response(response)
print(json.dumps(result, indent=2))
```

## Custom JSON Encoding

Some Python types aren't JSON serializable:

```python
import json
from datetime import datetime

data = {'timestamp': datetime.now()}

# This fails:
# json.dumps(data)  # TypeError

# Solution: convert to string
data = {'timestamp': datetime.now().isoformat()}
json.dumps(data)  # Works
```

## Key Takeaways

1. Use `json.loads()` to parse JSON strings and `json.dumps()` to create them
2. Use `json.load()` and `json.dump()` for file operations (no 's')
3. JSON maps directly to Python dicts, lists, strings, numbers, and booleans
4. Use `indent` parameter for human-readable output
5. Use `.get()` with defaults for optional fields
6. Handle `JSONDecodeError` for invalid JSON input

Next, we'll learn about list comprehensions for efficient data transformation.
