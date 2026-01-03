---
title: Conditionals
order: 1
estimatedMinutes: 15
---

# Conditionals: Making Decisions

Programs need to make decisions based on data. JavaScript provides several ways to control the flow of your code based on conditions.

## The if Statement

The `if` statement executes code only when a condition is true:

```javascript
const temperature = 30;

if (temperature > 25) {
    console.log("It's a hot day!");
}
```

The condition inside the parentheses is evaluated as a boolean. If `true`, the code block runs.

## The if...else Statement

Use `else` to specify code that runs when the condition is false:

```javascript
const age = 16;

if (age >= 18) {
    console.log("You can vote!");
} else {
    console.log("You're not old enough to vote yet.");
}
```

## The if...else if...else Chain

Handle multiple conditions with `else if`:

```javascript
const score = 85;

if (score >= 90) {
    console.log("A - Excellent!");
} else if (score >= 80) {
    console.log("B - Good job!");
} else if (score >= 70) {
    console.log("C - Satisfactory");
} else if (score >= 60) {
    console.log("D - Needs improvement");
} else {
    console.log("F - Failed");
}
```

JavaScript evaluates conditions from top to bottom and stops at the first true condition.

## Comparison Operators

Use these operators to create conditions:

```javascript
const a = 5;
const b = 10;

console.log(a === b);  // false - strict equality
console.log(a !== b);  // true  - strict inequality
console.log(a < b);    // true  - less than
console.log(a > b);    // false - greater than
console.log(a <= b);   // true  - less than or equal
console.log(a >= b);   // false - greater than or equal
```

### Strict vs. Loose Equality

Always use strict equality (`===` and `!==`):

```javascript
// Loose equality (avoid)
console.log(5 == "5");   // true - type coercion happens
console.log(0 == false); // true - type coercion happens

// Strict equality (use this)
console.log(5 === "5");   // false - different types
console.log(0 === false); // false - different types
```

## Logical Operators

Combine multiple conditions:

```javascript
const age = 25;
const hasLicense = true;

// AND (&&) - both must be true
if (age >= 18 && hasLicense) {
    console.log("You can drive.");
}

// OR (||) - at least one must be true
const isWeekend = true;
const isHoliday = false;

if (isWeekend || isHoliday) {
    console.log("No work today!");
}

// NOT (!) - inverts the boolean
const isLoggedIn = false;

if (!isLoggedIn) {
    console.log("Please log in.");
}
```

## Truthy and Falsy Values

JavaScript converts values to booleans in conditions:

```javascript
// Falsy values (evaluate to false)
if (!false) console.log("false is falsy");
if (!0) console.log("0 is falsy");
if (!"") console.log("empty string is falsy");
if (!null) console.log("null is falsy");
if (!undefined) console.log("undefined is falsy");
if (!NaN) console.log("NaN is falsy");

// Truthy values (evaluate to true)
if (true) console.log("true is truthy");
if (42) console.log("non-zero numbers are truthy");
if ("hello") console.log("non-empty strings are truthy");
if ([]) console.log("arrays are truthy");
if ({}) console.log("objects are truthy");
```

## The Ternary Operator

A compact way to write simple if/else:

```javascript
const age = 20;

// Instead of:
let status;
if (age >= 18) {
    status = "adult";
} else {
    status = "minor";
}

// Use the ternary operator:
const status2 = age >= 18 ? "adult" : "minor";
console.log(status2);  // "adult"
```

Syntax: `condition ? valueIfTrue : valueIfFalse`

## Nested Conditionals

Conditionals can be nested, but avoid going too deep:

```javascript
const user = { role: "admin", isActive: true };

if (user.role === "admin") {
    if (user.isActive) {
        console.log("Active admin user");
    } else {
        console.log("Inactive admin user");
    }
} else {
    console.log("Regular user");
}

// Better: use logical operators to flatten
if (user.role === "admin" && user.isActive) {
    console.log("Active admin user");
} else if (user.role === "admin") {
    console.log("Inactive admin user");
} else {
    console.log("Regular user");
}
```

## Guard Clauses

Use early returns to reduce nesting:

```javascript
function processUser(user) {
    // Guard clauses - handle edge cases first
    if (!user) {
        return "No user provided";
    }

    if (!user.isActive) {
        return "User is inactive";
    }

    if (user.role !== "admin") {
        return "Access denied";
    }

    // Main logic with no nesting
    return `Welcome, ${user.name}!`;
}
```

## Key Takeaways

1. `if`, `else if`, and `else` control which code executes
2. Use strict equality (`===`, `!==`) to avoid type coercion bugs
3. Logical operators (`&&`, `||`, `!`) combine conditions
4. JavaScript has six falsy values; everything else is truthy
5. The ternary operator (`? :`) is great for simple conditions
6. Guard clauses help reduce nesting and improve readability

Next, we'll learn about switch statements for handling multiple specific values.
