---
title: While Loops
order: 1
estimatedMinutes: 15
---

# While Loops

While loops repeat a block of code as long as a condition remains true. They're perfect when you don't know in advance how many iterations you need.

## Basic Syntax

```python
while condition:
    # code to repeat
```

The loop continues as long as `condition` evaluates to `True`.

## A Simple Counter

```python
count = 1
while count <= 5:
    print(count)
    count = count + 1
```

Output:
```
1
2
3
4
5
```

## How It Works

1. Python checks if `count <= 5` is True
2. If True, it executes the indented code block
3. After the block, it returns to step 1
4. When the condition becomes False, the loop exits

## Common Patterns

### Counting Down

```python
countdown = 5
while countdown > 0:
    print(countdown)
    countdown = countdown - 1
print("Liftoff!")
```

### User Input Loops

```python
password = ""
while password != "secret":
    password = input("Enter password: ")
print("Access granted!")
```

This keeps asking until the user enters the correct password.

### Processing Until Done

```python
total = 0
number = int(input("Enter a number (0 to stop): "))

while number != 0:
    total = total + number
    number = int(input("Enter a number (0 to stop): "))

print(f"Total: {total}")
```

## Infinite Loops

Be careful! If the condition never becomes False, the loop runs forever:

```python
# WARNING: This runs forever!
while True:
    print("This never stops...")
```

To stop an infinite loop, press `Ctrl + C`.

## The break Statement

Use `break` to exit a loop early:

```python
while True:
    answer = input("Type 'quit' to exit: ")
    if answer == "quit":
        break
    print(f"You typed: {answer}")

print("Goodbye!")
```

## The continue Statement

Use `continue` to skip to the next iteration:

```python
count = 0
while count < 10:
    count = count + 1
    if count % 2 == 0:
        continue  # Skip even numbers
    print(count)
```

Output:
```
1
3
5
7
9
```

## Common Mistakes

### Forgetting to Update the Condition

```python
# Bug: count never changes, infinite loop!
count = 1
while count <= 5:
    print(count)
    # Missing: count = count + 1
```

### Off-by-One Errors

```python
# Prints 1-4, not 1-5
count = 1
while count < 5:  # Should be count <= 5
    print(count)
    count = count + 1
```

## Try It Yourself

1. Write a loop that prints numbers 10 down to 1
2. Create a guessing game that keeps asking until the user guesses correctly
3. Sum all numbers from 1 to 100 using a while loop

## Key Takeaways

1. While loops repeat code while a condition is True
2. Always ensure the condition will eventually become False
3. Use `break` to exit a loop early
4. Use `continue` to skip to the next iteration
5. Be careful of infinite loops!

Next, we'll learn about for loops, which are perfect for iterating over sequences.
