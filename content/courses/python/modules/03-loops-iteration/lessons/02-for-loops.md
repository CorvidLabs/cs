---
title: For Loops
order: 2
estimatedMinutes: 20
---

# For Loops

For loops iterate over sequences like lists, strings, and ranges. They're the most common way to repeat code in Python.

## Basic Syntax

```python
for item in sequence:
    # code to repeat for each item
```

Python automatically handles iteration - no index management needed.

## Iterating Over Sequences

### Lists

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)
```

Output:
```
apple
banana
cherry
```

### Strings

Strings are sequences of characters:

```python
word = "Python"

for letter in word:
    print(letter)
```

Output:
```
P
y
t
h
o
n
```

### Tuples

```python
coordinates = (10, 20, 30)

for value in coordinates:
    print(value)
```

## The range() Function

`range()` generates a sequence of numbers. Perfect for counting loops.

### range(stop)

Generates 0 to stop-1:

```python
for i in range(5):
    print(i)
```

Output:
```
0
1
2
3
4
```

### range(start, stop)

Generates start to stop-1:

```python
for i in range(1, 6):
    print(i)
```

Output:
```
1
2
3
4
5
```

### range(start, stop, step)

Generates with custom step size:

```python
# Count by 2s
for i in range(0, 10, 2):
    print(i)
```

Output:
```
0
2
4
6
8
```

### Counting Backwards

Use a negative step:

```python
for i in range(5, 0, -1):
    print(i)
```

Output:
```
5
4
3
2
1
```

## Practical range() Examples

### Accessing List by Index

```python
colors = ["red", "green", "blue"]

for i in range(len(colors)):
    print(f"Color {i}: {colors[i]}")
```

Output:
```
Color 0: red
Color 1: green
Color 2: blue
```

### Repeating an Action N Times

```python
for _ in range(3):  # _ means we don't need the variable
    print("Hello!")
```

Output:
```
Hello!
Hello!
Hello!
```

## enumerate() - Index and Value

Often you need both the index and value. Use `enumerate()`:

```python
fruits = ["apple", "banana", "cherry"]

for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
```

Output:
```
0: apple
1: banana
2: cherry
```

### Custom Start Index

```python
for position, fruit in enumerate(fruits, start=1):
    print(f"{position}. {fruit}")
```

Output:
```
1. apple
2. banana
3. cherry
```

## zip() - Multiple Sequences

Iterate over multiple sequences in parallel:

```python
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]

for name, age in zip(names, ages):
    print(f"{name} is {age} years old")
```

Output:
```
Alice is 25 years old
Bob is 30 years old
Charlie is 35 years old
```

### Zip Stops at Shortest

```python
letters = ["A", "B", "C"]
numbers = [1, 2]

for letter, number in zip(letters, numbers):
    print(letter, number)
```

Output:
```
A 1
B 2
```

## Iterating Over Dictionaries

### Keys (Default)

```python
person = {"name": "Alice", "age": 25, "city": "NYC"}

for key in person:
    print(key)
```

Output:
```
name
age
city
```

### Values

```python
for value in person.values():
    print(value)
```

Output:
```
Alice
25
NYC
```

### Keys and Values

```python
for key, value in person.items():
    print(f"{key}: {value}")
```

Output:
```
name: Alice
age: 25
city: NYC
```

## Building Results with For Loops

### Summing Numbers

```python
numbers = [10, 20, 30, 40, 50]
total = 0

for num in numbers:
    total += num

print(f"Sum: {total}")  # Sum: 150
```

### Building a New List

```python
numbers = [1, 2, 3, 4, 5]
squares = []

for num in numbers:
    squares.append(num ** 2)

print(squares)  # [1, 4, 9, 16, 25]
```

### Finding Items

```python
words = ["apple", "banana", "apricot", "cherry"]
a_words = []

for word in words:
    if word.startswith("a"):
        a_words.append(word)

print(a_words)  # ['apple', 'apricot']
```

## For vs While

Choose the right loop:

| Situation | Use |
|-----------|-----|
| Known number of iterations | `for` with `range()` |
| Iterating over a sequence | `for` |
| Unknown iterations (until condition) | `while` |
| User input validation | `while` |

### Example Comparison

```python
# Counting to 5: for is cleaner
for i in range(1, 6):
    print(i)

# Same with while: more code
i = 1
while i <= 6:
    print(i)
    i += 1
```

```python
# Until user quits: while is appropriate
while True:
    command = input("Enter command (q to quit): ")
    if command == "q":
        break
    print(f"Processing: {command}")
```

## Common Patterns

### Finding Maximum/Minimum

```python
numbers = [34, 67, 23, 89, 12]

max_num = numbers[0]
for num in numbers:
    if num > max_num:
        max_num = num

print(f"Maximum: {max_num}")  # Maximum: 89
```

### Counting Occurrences

```python
text = "hello world"
count = 0

for char in text:
    if char == "l":
        count += 1

print(f"Letter 'l' appears {count} times")  # 3 times
```

### Filtering and Transforming

```python
scores = [85, 92, 78, 95, 88, 72]

passing_scores = []
for score in scores:
    if score >= 80:
        passing_scores.append(score)

print(passing_scores)  # [85, 92, 95, 88]
```

## Try It Yourself

1. Print numbers 1 through 10 using a for loop
2. Calculate the sum of all even numbers from 1 to 100
3. Iterate over a list of names and print each with its position
4. Create a list of the first 10 square numbers

## Key Takeaways

1. For loops iterate over sequences (lists, strings, ranges)
2. `range(n)` generates 0 to n-1; `range(start, stop, step)` for more control
3. Use `enumerate()` when you need both index and value
4. Use `zip()` to iterate over multiple sequences together
5. Dictionary iteration: `.keys()`, `.values()`, `.items()`
6. For loops are ideal when you know what you're iterating over

Next, we'll learn how to control loop execution with break, continue, and the else clause.
