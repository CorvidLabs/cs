---
title: Nested Loops
order: 4
estimatedMinutes: 20
---

# Nested Loops

When you put a loop inside another loop, you create a nested loop. The inner loop runs completely for each iteration of the outer loop.

## Basic Nested Loop

```python
for i in range(3):
    for j in range(3):
        print(f"i={i}, j={j}")
```

Output:
```
i=0, j=0
i=0, j=1
i=0, j=2
i=1, j=0
i=1, j=1
i=1, j=2
i=2, j=0
i=2, j=1
i=2, j=2
```

### How It Works

1. Outer loop starts: `i = 0`
2. Inner loop runs completely: `j = 0, 1, 2`
3. Outer loop continues: `i = 1`
4. Inner loop runs completely again: `j = 0, 1, 2`
5. This continues until the outer loop finishes

## Multiplication Table

A classic nested loop example:

```python
for i in range(1, 6):
    for j in range(1, 6):
        product = i * j
        print(f"{product:3}", end=" ")
    print()  # New line after each row
```

Output:
```
  1   2   3   4   5
  2   4   6   8  10
  3   6   9  12  15
  4   8  12  16  20
  5  10  15  20  25
```

## Working with 2D Data

Nested loops are essential for 2D structures like matrices and grids.

### Processing a Matrix

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for row in matrix:
    for value in row:
        print(value, end=" ")
    print()
```

Output:
```
1 2 3
4 5 6
7 8 9
```

### Accessing by Index

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        print(f"matrix[{i}][{j}] = {matrix[i][j]}")
```

### Modifying Matrix Values

```python
# Double all values
matrix = [
    [1, 2, 3],
    [4, 5, 6]
]

for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        matrix[i][j] *= 2

print(matrix)  # [[2, 4, 6], [8, 10, 12]]
```

## Pattern Printing

Nested loops excel at creating text patterns.

### Right Triangle

```python
rows = 5

for i in range(1, rows + 1):
    for j in range(i):
        print("*", end="")
    print()
```

Output:
```
*
**
***
****
*****
```

### Inverted Triangle

```python
rows = 5

for i in range(rows, 0, -1):
    for j in range(i):
        print("*", end="")
    print()
```

Output:
```
*****
****
***
**
*
```

### Centered Triangle (Pyramid)

```python
rows = 5

for i in range(1, rows + 1):
    spaces = " " * (rows - i)
    stars = "*" * (2 * i - 1)
    print(spaces + stars)
```

Output:
```
    *
   ***
  *****
 *******
*********
```

### Number Pattern

```python
rows = 5

for i in range(1, rows + 1):
    for j in range(1, i + 1):
        print(j, end="")
    print()
```

Output:
```
1
12
123
1234
12345
```

### Diamond Pattern

```python
n = 5

# Upper half
for i in range(1, n + 1):
    print(" " * (n - i) + "*" * (2 * i - 1))

# Lower half
for i in range(n - 1, 0, -1):
    print(" " * (n - i) + "*" * (2 * i - 1))
```

Output:
```
    *
   ***
  *****
 *******
*********
 *******
  *****
   ***
    *
```

## Comparing Items

Nested loops can compare each item with every other item.

### Finding Pairs That Sum to Target

```python
numbers = [1, 5, 3, 9, 2, 7]
target = 10

for i in range(len(numbers)):
    for j in range(i + 1, len(numbers)):
        if numbers[i] + numbers[j] == target:
            print(f"{numbers[i]} + {numbers[j]} = {target}")
```

Output:
```
1 + 9 = 10
3 + 7 = 10
```

### Finding Duplicates

```python
names = ["Alice", "Bob", "Charlie", "Alice", "David", "Bob"]

for i in range(len(names)):
    for j in range(i + 1, len(names)):
        if names[i] == names[j]:
            print(f"Duplicate found: {names[i]} at positions {i} and {j}")
```

Output:
```
Duplicate found: Alice at positions 0 and 3
Duplicate found: Bob at positions 1 and 5
```

## Breaking Out of Nested Loops

`break` only exits the innermost loop. To exit all loops, use techniques like flags or functions.

### Using a Flag

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
target = 5
found = False

for i, row in enumerate(matrix):
    for j, value in enumerate(row):
        if value == target:
            print(f"Found {target} at ({i}, {j})")
            found = True
            break
    if found:
        break
```

### Using a Function

```python
def find_in_matrix(matrix, target):
    for i, row in enumerate(matrix):
        for j, value in enumerate(row):
            if value == target:
                return (i, j)
    return None

matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

result = find_in_matrix(matrix, 5)
if result:
    print(f"Found at {result}")
else:
    print("Not found")
```

### Using for-else

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
target = 5

for i, row in enumerate(matrix):
    for j, value in enumerate(row):
        if value == target:
            print(f"Found {target} at ({i}, {j})")
            break
    else:
        continue  # Only executed if inner loop didn't break
    break  # Exit outer loop
```

## Grid-Based Games

Nested loops are perfect for game boards:

```python
def print_board(board):
    print("  0 1 2")
    for i, row in enumerate(board):
        print(f"{i} {' '.join(row)}")

def check_winner(board):
    # Check rows
    for row in board:
        if row[0] == row[1] == row[2] != " ":
            return row[0]

    # Check columns
    for col in range(3):
        if board[0][col] == board[1][col] == board[2][col] != " ":
            return board[0][col]

    # Check diagonals
    if board[0][0] == board[1][1] == board[2][2] != " ":
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] != " ":
        return board[0][2]

    return None

# Example board
board = [
    ["X", "O", "X"],
    ["O", "X", "O"],
    ["O", "X", "X"]
]

print_board(board)
winner = check_winner(board)
if winner:
    print(f"Winner: {winner}")
```

## Performance Considerations

Nested loops multiply the work. Be mindful of complexity:

```python
# O(n) - linear
for item in items:
    process(item)

# O(n^2) - quadratic
for i in items:
    for j in items:
        compare(i, j)

# O(n^3) - cubic
for i in items:
    for j in items:
        for k in items:
            process(i, j, k)
```

For large datasets, consider more efficient algorithms or data structures.

## Try It Yourself

1. Print a 10x10 multiplication table
2. Create a checkerboard pattern with X and O
3. Find all pairs of numbers in a list that multiply to give a target
4. Print a hollow square made of asterisks

## Key Takeaways

1. The inner loop completes fully for each outer loop iteration
2. Total iterations = outer iterations x inner iterations
3. Nested loops are essential for 2D data (matrices, grids)
4. Use `break` with flags or functions to exit multiple loops
5. Be aware of O(n^2) or higher complexity with nested loops
6. Common uses: patterns, comparisons, grid processing

You've completed the Loops and Iteration module! You now have the tools to repeat code efficiently and process any kind of sequential data.
