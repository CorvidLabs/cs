# Stack Applications

## Introduction

Stacks appear in many algorithmic problems due to their ability to handle nested structures, track history, and manage ordering constraints. This lesson explores advanced stack applications including monotonic stacks, expression conversion, and browser history.

## Monotonic Stack

A monotonic stack maintains elements in sorted order (either increasing or decreasing). It efficiently solves problems involving "next greater" or "next smaller" elements.

### Next Greater Element

**Problem**: For each element, find the next element that is greater.

```
Array: [4, 5, 2, 10, 8]

For 4: next greater is 5
For 5: next greater is 10
For 2: next greater is 10
For 10: no next greater (-1)
For 8: no next greater (-1)

Result: [5, 10, 10, -1, -1]
```

### How Monotonic Stack Works

```
Process from right to left, maintain decreasing stack:

Array: [4, 5, 2, 10, 8]
                     ^
                   i = 4

Step 1 (i=4): Stack = [], push 8
              Result[4] = -1
              Stack = [8]

Step 2 (i=3): 10 > 8, pop 8
              Stack = [], push 10
              Result[3] = -1
              Stack = [10]

Step 3 (i=2): 2 < 10, don't pop
              Result[2] = 10
              Stack = [10, 2]

Step 4 (i=1): 5 > 2, pop 2
              5 < 10, don't pop
              Result[1] = 10
              Stack = [10, 5]

Step 5 (i=0): 4 < 5, don't pop
              Result[0] = 5
              Stack = [10, 5, 4]

Result: [5, 10, 10, -1, -1]
```

### Python Implementation

```python
def next_greater_element(nums):
    """
    Find next greater element for each position.

    Time: O(n), Space: O(n)
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Stores indices

    # Process from right to left
    for i in range(n - 1, -1, -1):
        # Pop elements smaller than current
        while stack and nums[stack[-1]] <= nums[i]:
            stack.pop()

        # Top of stack is next greater
        if stack:
            result[i] = nums[stack[-1]]

        stack.append(i)

    return result
```

### Variation: Process Left to Right

```python
def next_greater_element_v2(nums):
    """
    Alternative approach: process left to right.
    When we find a greater element, it's the answer
    for all smaller elements waiting in the stack.

    Time: O(n), Space: O(n)
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Stores indices

    for i in range(n):
        # Current element is next greater for stack elements
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]

        stack.append(i)

    return result
```

## Daily Temperatures

**Problem**: Given daily temperatures, find how many days until a warmer day.

```
temps = [73, 74, 75, 71, 69, 72, 76, 73]
result = [1,  1,  4,  2,  1,  1,  0,  0]

Day 0 (73): Day 1 (74) is warmer, wait 1 day
Day 2 (75): Day 6 (76) is warmer, wait 4 days
```

```python
def daily_temperatures(temperatures):
    """
    Days until warmer temperature.

    Time: O(n), Space: O(n)
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # Stores indices

    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx

        stack.append(i)

    return result
```

## Largest Rectangle in Histogram

**Problem**: Find the largest rectangular area in a histogram.

```
Heights: [2, 1, 5, 6, 2, 3]

         +---+
         |   |
     +---+   +
     |       |   +---+
 +---+       +---+   +
 |                   |
 +-------------------+
   2   1   5   6   2   3

Largest rectangle: 5 * 2 = 10 (heights 5 and 6)
```

### Approach

For each bar, find how far left and right it can extend (where it's the minimum height).

```python
def largest_rectangle_area(heights):
    """
    Find largest rectangle in histogram.

    Time: O(n), Space: O(n)
    """
    stack = []  # Stores indices
    max_area = 0
    n = len(heights)

    for i in range(n + 1):
        # Use 0 as sentinel for the end
        current_height = heights[i] if i < n else 0

        while stack and current_height < heights[stack[-1]]:
            height = heights[stack.pop()]
            # Width extends from previous stack top to current index
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)

        stack.append(i)

    return max_area
```

### Visual Walkthrough

```
Heights: [2, 1, 5, 6, 2, 3] + [0] (sentinel)

i=0: push 0                Stack: [0]
i=1: 1 < 2, pop 0
     height=2, width=1, area=2
     push 1                Stack: [1]
i=2: push 2                Stack: [1, 2]
i=3: push 3                Stack: [1, 2, 3]
i=4: 2 < 6, pop 3
     height=6, width=1, area=6
     2 < 5, pop 2
     height=5, width=2, area=10  <-- Maximum!
     push 4                Stack: [1, 4]
i=5: push 5                Stack: [1, 4, 5]
i=6 (sentinel): 0 < 3, pop 5
     height=3, width=1, area=3
     0 < 2, pop 4
     height=2, width=4, area=8
     0 < 1, pop 1
     height=1, width=6, area=6

Maximum area: 10
```

## Infix to Postfix Conversion

Convert expressions from infix (normal) to postfix notation.

```
Infix:   3 + 4 * 2 / (1 - 5)
Postfix: 3 4 2 * 1 5 - / +
```

### Algorithm (Shunting Yard)

1. Operands go directly to output
2. Operators are pushed to stack based on precedence
3. Left parenthesis is pushed to stack
4. Right parenthesis pops until left parenthesis

```python
def infix_to_postfix(expression):
    """
    Convert infix expression to postfix.

    Time: O(n), Space: O(n)
    """
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    right_associative = {'^'}

    output = []
    operator_stack = []

    tokens = tokenize(expression)  # Split into numbers and operators

    for token in tokens:
        if token.isdigit():
            output.append(token)
        elif token in precedence:
            while (operator_stack and
                   operator_stack[-1] != '(' and
                   operator_stack[-1] in precedence and
                   (precedence[operator_stack[-1]] > precedence[token] or
                    (precedence[operator_stack[-1]] == precedence[token] and
                     token not in right_associative))):
                output.append(operator_stack.pop())
            operator_stack.append(token)
        elif token == '(':
            operator_stack.append(token)
        elif token == ')':
            while operator_stack and operator_stack[-1] != '(':
                output.append(operator_stack.pop())
            operator_stack.pop()  # Remove '('

    while operator_stack:
        output.append(operator_stack.pop())

    return output


def tokenize(expression):
    """Simple tokenizer for expressions."""
    tokens = []
    i = 0
    while i < len(expression):
        if expression[i].isdigit():
            j = i
            while j < len(expression) and expression[j].isdigit():
                j += 1
            tokens.append(expression[i:j])
            i = j
        elif expression[i] in '+-*/^()':
            tokens.append(expression[i])
            i += 1
        else:
            i += 1  # Skip spaces
    return tokens
```

## Browser History

Implement browser back and forward functionality.

```python
class BrowserHistory:
    """Browser history with back and forward navigation."""

    def __init__(self, homepage):
        self.history = [homepage]
        self.current = 0

    def visit(self, url):
        """Visit a new URL, clearing forward history."""
        # Remove forward history
        self.history = self.history[:self.current + 1]
        self.history.append(url)
        self.current += 1

    def back(self, steps):
        """Go back up to 'steps' pages."""
        self.current = max(0, self.current - steps)
        return self.history[self.current]

    def forward(self, steps):
        """Go forward up to 'steps' pages."""
        self.current = min(len(self.history) - 1, self.current + steps)
        return self.history[self.current]
```

## Decode String

**Problem**: Decode encoded strings like "3[a2[c]]" -> "accaccacc"

```python
def decode_string(s):
    """
    Decode encoded string.

    Pattern: k[encoded_string]
    Example: "3[a2[c]]" -> "accaccacc"

    Time: O(n * max_k), Space: O(n)
    """
    stack = []
    current_string = ""
    current_num = 0

    for char in s:
        if char.isdigit():
            current_num = current_num * 10 + int(char)
        elif char == '[':
            # Save current state and start fresh
            stack.append((current_string, current_num))
            current_string = ""
            current_num = 0
        elif char == ']':
            # Pop and build result
            prev_string, num = stack.pop()
            current_string = prev_string + current_string * num
        else:
            current_string += char

    return current_string
```

### Visual Walkthrough

```
Input: "3[a2[c]]"

char '3': current_num = 3
char '[': push ("", 3), reset
char 'a': current_string = "a"
char '2': current_num = 2
char '[': push ("a", 2), reset
char 'c': current_string = "c"
char ']': pop ("a", 2), current_string = "a" + "c"*2 = "acc"
char ']': pop ("", 3), current_string = "" + "acc"*3 = "accaccacc"

Result: "accaccacc"
```

## Remove K Digits

**Problem**: Remove k digits from a number to get the smallest possible result.

```
num = "1432219", k = 3
Remove 4, 3, 2 -> "1219"
```

```python
def remove_k_digits(num, k):
    """
    Remove k digits to get smallest number.

    Strategy: Remove digits that are larger than the
    digit after them (greedy, using monotonic stack).

    Time: O(n), Space: O(n)
    """
    stack = []

    for digit in num:
        while k > 0 and stack and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)

    # If k > 0, remove from end
    stack = stack[:-k] if k else stack

    # Remove leading zeros
    result = ''.join(stack).lstrip('0')

    return result if result else '0'
```

## Trapping Rain Water

**Problem**: Calculate water trapped between bars.

```
Heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]

            +
        +---+---+   +
    +---+   +   +---+---+
+---+   +   +   +   +   +---+
0 1 0 2 1 0 1 3 2 1 2 1

Water trapped: 6 units
```

```python
def trap(height):
    """
    Calculate trapped rainwater using stack.

    Time: O(n), Space: O(n)
    """
    stack = []
    water = 0

    for i, h in enumerate(height):
        while stack and h > height[stack[-1]]:
            bottom = stack.pop()
            if not stack:
                break
            # Water level is min of current and left boundary
            left = stack[-1]
            width = i - left - 1
            bounded_height = min(h, height[left]) - height[bottom]
            water += width * bounded_height

        stack.append(i)

    return water
```

## Practice Problems

1. **Next Greater Element II**: Circular array version
2. **Asteroid Collision**: Asteroids moving left/right
3. **Online Stock Span**: Days of consecutive smaller prices
4. **Score of Parentheses**: Calculate score based on nesting
5. **Maximum Width Ramp**: Maximum j - i where A[i] <= A[j]

## Summary

Advanced stack applications solve complex problems efficiently:

| Application | Key Insight |
|-------------|-------------|
| Monotonic Stack | Maintain sorted order for next greater/smaller |
| Histogram | Calculate extent each bar can reach |
| Expression Conversion | Operator precedence handling |
| Decoding | Nested structure processing |

Pattern recognition:
- "Next greater/smaller" -> Monotonic stack
- "Matching/nested" -> Regular stack
- "Extend left/right" -> Stack with indices

In the next lesson, we will explore queue applications.
