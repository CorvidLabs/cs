---
title: Data Analysis Basics
order: 4
estimatedMinutes: 18
---

# Data Analysis Basics

Data analysis involves extracting insights from data through aggregation, grouping, and sorting. Python's built-in functions and simple patterns make basic analysis straightforward.

## Aggregation Functions

Python provides built-in functions for common calculations:

### Sum

```python
numbers = [10, 20, 30, 40, 50]
total = sum(numbers)
print(total)  # 150

# Sum with a starting value
total_plus_100 = sum(numbers, 100)
print(total_plus_100)  # 250
```

### Min and Max

```python
numbers = [45, 22, 78, 12, 56]
print(min(numbers))  # 12
print(max(numbers))  # 78

# Works with strings too (alphabetically)
names = ['Carol', 'Alice', 'Bob']
print(min(names))  # Alice
print(max(names))  # Carol
```

### Count and Length

```python
items = ['apple', 'banana', 'apple', 'cherry', 'apple']
print(len(items))           # 5
print(items.count('apple')) # 3
```

### Average

Python doesn't have a built-in average, but it's easy to calculate:

```python
numbers = [10, 20, 30, 40, 50]
average = sum(numbers) / len(numbers)
print(average)  # 30.0

# Or use statistics module
from statistics import mean, median, mode

data = [1, 2, 3, 4, 5, 5, 6]
print(mean(data))    # 3.714...
print(median(data))  # 4
print(mode(data))    # 5
```

## Working with Data Records

Most data comes as a list of dictionaries:

```python
sales = [
    {'product': 'Widget', 'price': 25.00, 'quantity': 10},
    {'product': 'Gadget', 'price': 50.00, 'quantity': 5},
    {'product': 'Widget', 'price': 25.00, 'quantity': 8},
    {'product': 'Gizmo', 'price': 35.00, 'quantity': 12}
]
```

### Extracting Values

```python
# Get all prices
prices = [item['price'] for item in sales]
print(prices)  # [25.0, 50.0, 25.0, 35.0]

# Get unique products
products = list(set(item['product'] for item in sales))
print(products)  # ['Widget', 'Gadget', 'Gizmo']
```

### Calculating Totals

```python
# Total revenue
total_revenue = sum(item['price'] * item['quantity'] for item in sales)
print(f"Total revenue: ${total_revenue}")  # Total revenue: $920.0

# Total quantity sold
total_qty = sum(item['quantity'] for item in sales)
print(f"Total items sold: {total_qty}")  # Total items sold: 35
```

### Finding Records

```python
# Highest price item
most_expensive = max(sales, key=lambda x: x['price'])
print(most_expensive)  # {'product': 'Gadget', 'price': 50.0, 'quantity': 5}

# Lowest quantity
lowest_qty = min(sales, key=lambda x: x['quantity'])
print(lowest_qty)  # {'product': 'Gadget', 'price': 50.0, 'quantity': 5}
```

## Grouping Data

Group data by a common field:

```python
sales = [
    {'product': 'Widget', 'price': 25.00, 'quantity': 10},
    {'product': 'Gadget', 'price': 50.00, 'quantity': 5},
    {'product': 'Widget', 'price': 25.00, 'quantity': 8},
    {'product': 'Gizmo', 'price': 35.00, 'quantity': 12}
]

# Group by product
by_product = {}
for item in sales:
    product = item['product']
    if product not in by_product:
        by_product[product] = []
    by_product[product].append(item)

print(by_product.keys())  # dict_keys(['Widget', 'Gadget', 'Gizmo'])
print(len(by_product['Widget']))  # 2
```

### Using collections.defaultdict

Simplify grouping with defaultdict:

```python
from collections import defaultdict

by_product = defaultdict(list)
for item in sales:
    by_product[item['product']].append(item)

# Calculate totals per product
for product, items in by_product.items():
    total = sum(i['quantity'] for i in items)
    print(f"{product}: {total} units")
# Widget: 18 units
# Gadget: 5 units
# Gizmo: 12 units
```

## Sorting Data

### Basic Sorting

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
print(sorted(numbers))           # [1, 1, 2, 3, 4, 5, 6, 9]
print(sorted(numbers, reverse=True))  # [9, 6, 5, 4, 3, 2, 1, 1]

names = ['Carol', 'Alice', 'Bob']
print(sorted(names))  # ['Alice', 'Bob', 'Carol']
```

### Sorting by Key

Sort complex data by a specific field:

```python
students = [
    {'name': 'Alice', 'grade': 90},
    {'name': 'Carol', 'grade': 85},
    {'name': 'Bob', 'grade': 92}
]

# Sort by grade
by_grade = sorted(students, key=lambda x: x['grade'])
print([s['name'] for s in by_grade])  # ['Carol', 'Alice', 'Bob']

# Sort by grade descending
top_grades = sorted(students, key=lambda x: x['grade'], reverse=True)
print([s['name'] for s in top_grades])  # ['Bob', 'Alice', 'Carol']

# Sort by name
by_name = sorted(students, key=lambda x: x['name'])
print([s['name'] for s in by_name])  # ['Alice', 'Bob', 'Carol']
```

### Multiple Sort Keys

```python
from operator import itemgetter

data = [
    {'dept': 'Engineering', 'name': 'Alice', 'salary': 80000},
    {'dept': 'Marketing', 'name': 'Bob', 'salary': 70000},
    {'dept': 'Engineering', 'name': 'Carol', 'salary': 75000}
]

# Sort by department, then by salary within each department
sorted_data = sorted(data, key=itemgetter('dept', 'salary'))
for item in sorted_data:
    print(f"{item['dept']}: {item['name']} - ${item['salary']}")
# Engineering: Carol - $75000
# Engineering: Alice - $80000
# Marketing: Bob - $70000
```

## Filtering Data

### Simple Filters

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

evens = [n for n in numbers if n % 2 == 0]
print(evens)  # [2, 4, 6, 8, 10]

greater_than_5 = [n for n in numbers if n > 5]
print(greater_than_5)  # [6, 7, 8, 9, 10]
```

### Filter with filter()

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4, 6, 8, 10]
```

### Complex Filters

```python
employees = [
    {'name': 'Alice', 'dept': 'Engineering', 'years': 5},
    {'name': 'Bob', 'dept': 'Marketing', 'years': 3},
    {'name': 'Carol', 'dept': 'Engineering', 'years': 7}
]

# Senior engineers (Engineering + 5+ years)
senior_engineers = [
    e for e in employees
    if e['dept'] == 'Engineering' and e['years'] >= 5
]
print([e['name'] for e in senior_engineers])  # ['Alice', 'Carol']
```

## Real-World Example: Sales Analysis

```python
import json
from collections import defaultdict

# Sample sales data
sales_data = [
    {'date': '2024-01-15', 'product': 'Widget', 'region': 'North', 'amount': 150},
    {'date': '2024-01-15', 'product': 'Gadget', 'region': 'South', 'amount': 200},
    {'date': '2024-01-16', 'product': 'Widget', 'region': 'South', 'amount': 175},
    {'date': '2024-01-16', 'product': 'Widget', 'region': 'North', 'amount': 125},
    {'date': '2024-01-17', 'product': 'Gadget', 'region': 'North', 'amount': 300}
]

# Total sales
total = sum(s['amount'] for s in sales_data)
print(f"Total sales: ${total}")  # Total sales: $950

# Average sale
average = total / len(sales_data)
print(f"Average sale: ${average:.2f}")  # Average sale: $190.00

# Sales by product
by_product = defaultdict(int)
for sale in sales_data:
    by_product[sale['product']] += sale['amount']
print("\nSales by product:")
for product, amount in sorted(by_product.items(), key=lambda x: x[1], reverse=True):
    print(f"  {product}: ${amount}")
# Sales by product:
#   Widget: $450
#   Gadget: $500

# Sales by region
by_region = defaultdict(int)
for sale in sales_data:
    by_region[sale['region']] += sale['amount']
print("\nSales by region:")
for region, amount in by_region.items():
    print(f"  {region}: ${amount}")
# Sales by region:
#   North: $575
#   South: $375

# Best selling day
by_date = defaultdict(int)
for sale in sales_data:
    by_date[sale['date']] += sale['amount']
best_day = max(by_date.items(), key=lambda x: x[1])
print(f"\nBest day: {best_day[0]} (${best_day[1]})")
# Best day: 2024-01-15 ($350)

# Top 3 sales
top_sales = sorted(sales_data, key=lambda x: x['amount'], reverse=True)[:3]
print("\nTop 3 sales:")
for sale in top_sales:
    print(f"  {sale['date']}: {sale['product']} - ${sale['amount']}")
```

## Using Counter for Frequency Analysis

```python
from collections import Counter

# Count occurrences
words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']
counts = Counter(words)
print(counts)  # Counter({'apple': 3, 'banana': 2, 'cherry': 1})
print(counts.most_common(2))  # [('apple', 3), ('banana', 2)]

# Count from data
products = [sale['product'] for sale in sales_data]
product_counts = Counter(products)
print(product_counts)  # Counter({'Widget': 3, 'Gadget': 2})
```

## Key Takeaways

1. Use `sum()`, `min()`, `max()`, `len()` for basic aggregations
2. Use list comprehensions with `sum()` for calculated totals
3. Use `sorted()` with `key` parameter for custom sorting
4. Use `defaultdict(list)` or `defaultdict(int)` for grouping
5. Use `Counter` for frequency analysis
6. Combine filtering, grouping, and aggregation for complex analysis
7. The `statistics` module provides `mean()`, `median()`, `mode()`

Congratulations! You've learned the fundamentals of data processing in Python.
