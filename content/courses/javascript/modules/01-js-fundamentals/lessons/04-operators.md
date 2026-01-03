---
title: Operators
order: 4
estimatedMinutes: 22
---

# JavaScript Operators

Operators perform operations on values. JavaScript has operators for arithmetic, comparison, logic, and more.

## Arithmetic Operators

Perform mathematical calculations:

```javascript
const a = 10;
const b = 3;

console.log(a + b);   // 13 (addition)
console.log(a - b);   // 7  (subtraction)
console.log(a * b);   // 30 (multiplication)
console.log(a / b);   // 3.333... (division)
console.log(a % b);   // 1  (modulo - remainder)
console.log(a ** b);  // 1000 (exponentiation - 10^3)
```

### Modulo Operator (%)

Returns the remainder after division:

```javascript
console.log(10 % 3);  // 1  (10 / 3 = 3 remainder 1)
console.log(15 % 5);  // 0  (evenly divisible)
console.log(7 % 2);   // 1  (odd number)
console.log(8 % 2);   // 0  (even number)

// Common use: check if even or odd
const num = 42;
if (num % 2 === 0) {
    console.log("Even");
} else {
    console.log("Odd");
}
```

### Increment and Decrement

```javascript
let count = 5;

count++;        // count is now 6 (post-increment)
++count;        // count is now 7 (pre-increment)
count--;        // count is now 6 (post-decrement)
--count;        // count is now 5 (pre-decrement)

// Difference between pre and post:
let x = 5;
console.log(x++);  // 5 (returns then increments)
console.log(x);    // 6

let y = 5;
console.log(++y);  // 6 (increments then returns)
console.log(y);    // 6
```

## Assignment Operators

Assign and modify values:

```javascript
let x = 10;      // Assignment

x += 5;          // x = x + 5  -> 15
x -= 3;          // x = x - 3  -> 12
x *= 2;          // x = x * 2  -> 24
x /= 4;          // x = x / 4  -> 6
x %= 4;          // x = x % 4  -> 2
x **= 3;         // x = x ** 3 -> 8

console.log(x);  // 8
```

## Comparison Operators

Compare values and return booleans:

```javascript
const a = 5;
const b = 10;
const c = "5";

// Equality
console.log(a == c);   // true (loose equality, converts types)
console.log(a === c);  // false (strict equality, no conversion)

// Inequality
console.log(a != c);   // false (loose)
console.log(a !== c);  // true (strict)

// Relational
console.log(a < b);    // true
console.log(a > b);    // false
console.log(a <= 5);   // true
console.log(a >= 5);   // true
```

### Strict vs Loose Equality

**Always use strict equality (`===` and `!==`):**

```javascript
// Loose equality has surprising behavior
console.log(0 == false);      // true
console.log("" == false);     // true
console.log(null == undefined); // true
console.log("0" == 0);        // true

// Strict equality is predictable
console.log(0 === false);     // false (different types)
console.log("" === false);    // false
console.log(null === undefined); // false
console.log("0" === 0);       // false
```

## Logical Operators

Combine boolean expressions:

### AND (&&)

Returns `true` only if both operands are true:

```javascript
console.log(true && true);    // true
console.log(true && false);   // false
console.log(false && true);   // false
console.log(false && false);  // false

const age = 25;
const hasLicense = true;
console.log(age >= 18 && hasLicense);  // true
```

### OR (||)

Returns `true` if either operand is true:

```javascript
console.log(true || true);    // true
console.log(true || false);   // true
console.log(false || true);   // true
console.log(false || false);  // false

const isAdmin = false;
const isModerator = true;
console.log(isAdmin || isModerator);  // true
```

### NOT (!)

Inverts a boolean:

```javascript
console.log(!true);   // false
console.log(!false);  // true
console.log(!0);      // true (0 is falsy)
console.log(!"");     // true (empty string is falsy)
console.log(!!"hello"); // true (double NOT converts to boolean)
```

### Short-Circuit Evaluation

Logical operators stop evaluating as soon as the result is determined:

```javascript
// AND stops at first falsy value
console.log(null && "hello");  // null
console.log("hi" && "hello");  // "hello" (returns last value if all truthy)

// OR stops at first truthy value
console.log(null || "default");  // "default"
console.log("value" || "default"); // "value"

// Common pattern: default values
const username = inputName || "Guest";
```

## Nullish Coalescing (??)

Returns right operand only if left is `null` or `undefined`:

```javascript
// ?? only checks for null/undefined
console.log(null ?? "default");      // "default"
console.log(undefined ?? "default"); // "default"
console.log(0 ?? "default");         // 0 (0 is not nullish)
console.log("" ?? "default");        // "" (empty string is not nullish)

// Compare with ||
console.log(0 || "default");         // "default" (0 is falsy)
console.log("" || "default");        // "default" (empty string is falsy)
```

## Ternary Operator

A concise way to write if-else:

```javascript
// Syntax: condition ? valueIfTrue : valueIfFalse

const age = 20;
const status = age >= 18 ? "adult" : "minor";
console.log(status);  // "adult"

// Equivalent if-else:
let statusLong;
if (age >= 18) {
    statusLong = "adult";
} else {
    statusLong = "minor";
}
```

Nested ternaries (use sparingly):

```javascript
const score = 85;
const grade = score >= 90 ? "A"
            : score >= 80 ? "B"
            : score >= 70 ? "C"
            : score >= 60 ? "D"
            : "F";
console.log(grade);  // "B"
```

## String Operators

### Concatenation (+)

```javascript
const first = "Hello";
const second = "World";
console.log(first + " " + second);  // "Hello World"

// With numbers
console.log("Age: " + 25);  // "Age: 25"
console.log(5 + 5 + " apples");  // "10 apples" (numbers first)
console.log("apples: " + 5 + 5); // "apples: 55" (string first)
```

### Template Literals (preferred)

```javascript
const name = "Alice";
const age = 25;
console.log(`${name} is ${age} years old`);
// "Alice is 25 years old"
```

## Operator Precedence

Operators are evaluated in a specific order:

```javascript
// Higher precedence operators execute first
console.log(2 + 3 * 4);    // 14 (not 20)
console.log((2 + 3) * 4);  // 20 (parentheses override)

// Precedence order (high to low):
// 1. () - Grouping
// 2. ** - Exponentiation
// 3. *, /, % - Multiplication, division, modulo
// 4. +, - - Addition, subtraction
// 5. <, >, <=, >= - Comparisons
// 6. ==, ===, !=, !== - Equality
// 7. && - Logical AND
// 8. || - Logical OR
// 9. ?? - Nullish coalescing
// 10. = - Assignment
```

When in doubt, use parentheses for clarity:

```javascript
// Clear intent with parentheses
const result = (a + b) * (c - d);
const isValid = (age >= 18) && (hasLicense === true);
```

## Key Takeaways

1. Arithmetic: `+`, `-`, `*`, `/`, `%` (modulo), `**` (exponent)
2. Always use strict equality (`===`, `!==`) instead of loose (`==`, `!=`)
3. Logical operators: `&&` (AND), `||` (OR), `!` (NOT)
4. `||` returns first truthy value; `??` returns first non-nullish value
5. Ternary operator: `condition ? ifTrue : ifFalse`
6. Use parentheses to clarify operator precedence
7. Assignment operators combine assignment with operation: `+=`, `-=`, etc.

Congratulations! You've completed the JavaScript Fundamentals module. Practice these concepts with the exercises before moving on to control flow and functions.
