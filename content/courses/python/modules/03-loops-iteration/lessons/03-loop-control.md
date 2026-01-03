---
title: Loop Control
order: 3
estimatedMinutes: 15
---

# Loop Control

Python provides statements to control loop execution: `break` to exit, `continue` to skip, and `else` to run code when a loop completes normally.

## The break Statement

`break` immediately exits the loop:

```python
for i in range(10):
    if i == 5:
        break
    print(i)

print("Loop ended")
```

Output:
```
0
1
2
3
4
Loop ended
```

### Searching with break

Stop when you find what you're looking for:

```python
numbers = [4, 7, 2, 9, 1, 5, 8]
target = 9

for num in numbers:
    if num == target:
        print(f"Found {target}!")
        break
    print(f"Checking {num}...")
```

Output:
```
Checking 4...
Checking 7...
Checking 2...
Found 9!
```

### break in While Loops

Commonly used to exit infinite loops:

```python
while True:
    user_input = input("Enter 'quit' to exit: ")
    if user_input == "quit":
        break
    print(f"You entered: {user_input}")

print("Goodbye!")
```

### Password Checker Example

```python
correct_password = "secret123"
max_attempts = 3

for attempt in range(1, max_attempts + 1):
    password = input(f"Attempt {attempt}: Enter password: ")
    if password == correct_password:
        print("Access granted!")
        break
    print("Wrong password.")
else:
    print("Too many failed attempts. Locked out.")
```

## The continue Statement

`continue` skips to the next iteration:

```python
for i in range(5):
    if i == 2:
        continue
    print(i)
```

Output:
```
0
1
3
4
```

Notice that 2 is skipped.

### Skip Unwanted Items

```python
numbers = [1, -2, 3, -4, 5, -6]

print("Positive numbers only:")
for num in numbers:
    if num < 0:
        continue
    print(num)
```

Output:
```
Positive numbers only:
1
3
5
```

### Process Valid Data Only

```python
data = ["100", "abc", "200", "xyz", "300"]

total = 0
for item in data:
    if not item.isdigit():
        print(f"Skipping invalid: {item}")
        continue
    total += int(item)

print(f"Total: {total}")
```

Output:
```
Skipping invalid: abc
Skipping invalid: xyz
Total: 600
```

## The else Clause

Loops can have an `else` block that runs when the loop completes without hitting `break`:

### For-Else

```python
numbers = [1, 3, 5, 7, 9]

for num in numbers:
    if num == 4:
        print("Found 4!")
        break
else:
    print("4 was not found")
```

Output:
```
4 was not found
```

If we change the list:

```python
numbers = [1, 3, 4, 7, 9]

for num in numbers:
    if num == 4:
        print("Found 4!")
        break
else:
    print("4 was not found")
```

Output:
```
Found 4!
```

### While-Else

```python
count = 0

while count < 5:
    print(count)
    count += 1
else:
    print("Loop completed normally")
```

Output:
```
0
1
2
3
4
Loop completed normally
```

### Practical Use: Prime Number Check

```python
def is_prime(n):
    if n < 2:
        return False

    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False  # Found a divisor, not prime
    else:
        return True  # No divisors found, it's prime

# Test it
for num in range(2, 20):
    if is_prime(num):
        print(num, end=" ")
```

Output:
```
2 3 5 7 11 13 17 19
```

### Search with else for "Not Found"

```python
def find_index(items, target):
    for index, item in enumerate(items):
        if item == target:
            return index
    else:
        return -1  # Not found

names = ["Alice", "Bob", "Charlie"]
print(find_index(names, "Bob"))     # 1
print(find_index(names, "David"))   # -1
```

## Combining break and continue

You can use both in the same loop:

```python
numbers = [1, 2, 3, -1, 4, 5, -2, 6]

total = 0
for num in numbers:
    if num < 0:
        print(f"Negative number found: {num}. Stopping.")
        break
    if num % 2 != 0:
        continue  # Skip odd numbers
    total += num

print(f"Sum of even numbers before negative: {total}")
```

Output:
```
Negative number found: -1. Stopping.
Sum of even numbers before negative: 2
```

## Common Patterns

### Menu System

```python
while True:
    print("\n=== Menu ===")
    print("1. Say Hello")
    print("2. Say Goodbye")
    print("3. Exit")

    choice = input("Choose: ")

    if choice == "1":
        print("Hello!")
    elif choice == "2":
        print("Goodbye!")
    elif choice == "3":
        print("Exiting...")
        break
    else:
        print("Invalid choice. Try again.")
        continue  # Could use pass here too
```

### Input Validation with Retry

```python
max_retries = 3

for attempt in range(max_retries):
    try:
        age = int(input("Enter your age: "))
        if age < 0 or age > 150:
            print("Please enter a realistic age.")
            continue
        break  # Valid input
    except ValueError:
        print("Please enter a number.")
        continue
else:
    print("Too many invalid attempts.")
    age = None

if age is not None:
    print(f"Your age is {age}")
```

### Finding First Match

```python
users = [
    {"name": "Alice", "active": False},
    {"name": "Bob", "active": True},
    {"name": "Charlie", "active": True},
]

for user in users:
    if user["active"]:
        print(f"First active user: {user['name']}")
        break
else:
    print("No active users found")
```

## Best Practices

### Keep Loops Simple

If a loop gets complex, consider extracting to a function:

```python
# Complex loop logic
def find_valid_number(numbers):
    for num in numbers:
        if num < 0:
            continue
        if num > 100:
            continue
        if num % 2 != 0:
            continue
        return num
    return None

# Clear and readable
result = find_valid_number([150, -3, 75, 42, 88])
print(result)  # 42
```

### Avoid Deep Nesting

```python
# Hard to read
for item in items:
    if condition1:
        if condition2:
            if condition3:
                # deep code

# Better with continue
for item in items:
    if not condition1:
        continue
    if not condition2:
        continue
    if not condition3:
        continue
    # code at normal indentation
```

## Try It Yourself

1. Create a loop that prints 1-20 but skips multiples of 3
2. Search for a number in a list and print whether it was found
3. Write a number guessing game that gives 5 attempts
4. Sum positive numbers until a negative is encountered

## Key Takeaways

1. `break` exits the loop immediately
2. `continue` skips to the next iteration
3. `else` on loops runs if no `break` occurred
4. Use `break` for early exit when you find what you need
5. Use `continue` to skip unwanted iterations
6. Use `else` to handle "not found" or "completed normally" cases

Next, we'll explore nested loops for working with multi-dimensional data.
