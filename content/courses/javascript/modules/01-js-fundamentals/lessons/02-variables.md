---
title: Variables and Declarations
order: 2
estimatedMinutes: 18
---

# Variables: Storing Data

Variables are containers that hold data. JavaScript has three ways to declare variables: `let`, `const`, and `var`. Understanding their differences is crucial for writing modern JavaScript.

## The Modern Approach: let and const

### const - For Values That Don't Change

Use `const` when a variable should never be reassigned:

```javascript
const PI = 3.14159;
const APP_NAME = "MyApp";
const MAX_USERS = 100;

console.log(PI);        // 3.14159
console.log(APP_NAME);  // MyApp
```

Attempting to reassign a `const` throws an error:

```javascript
const name = "Alice";
name = "Bob";  // TypeError: Assignment to constant variable
```

### let - For Values That Change

Use `let` when a variable needs to be reassigned:

```javascript
let score = 0;
console.log(score);  // 0

score = 10;
console.log(score);  // 10

score = score + 5;
console.log(score);  // 15
```

## The Legacy Approach: var

`var` is the old way of declaring variables. It still works but has quirks that make it problematic:

```javascript
var message = "Hello";
console.log(message);  // Hello
```

### Why Avoid var?

1. **Function scope, not block scope:**

```javascript
if (true) {
    var x = 10;  // var is NOT block-scoped
    let y = 20;  // let IS block-scoped
}
console.log(x);  // 10 (var leaks out!)
console.log(y);  // ReferenceError: y is not defined
```

2. **Hoisting confusion:**

```javascript
console.log(name);  // undefined (not an error!)
var name = "Alice";

console.log(age);   // ReferenceError
let age = 25;       // let doesn't allow access before declaration
```

3. **Can be redeclared:**

```javascript
var count = 1;
var count = 2;  // No error, but confusing!

let total = 1;
let total = 2;  // SyntaxError: already declared
```

**Best Practice:** Use `const` by default. Use `let` when you need to reassign. Avoid `var`.

## Variable Naming

Choose descriptive names that explain what the variable holds:

```javascript
// Good variable names
const userName = "Bob";
const totalScore = 100;
const isActive = true;
const itemsPerPage = 25;

// Avoid unclear names
const x = "Bob";      // What is x?
const n = 100;        // What is n?
const flag = true;    // What flag?
```

### Naming Rules

- Must start with a letter, underscore `_`, or dollar sign `$`
- Can contain letters, numbers, underscores, and dollar signs
- Case-sensitive (`name` and `Name` are different)
- Cannot use reserved keywords (`if`, `for`, `while`, `const`, etc.)

```javascript
// Valid names
const myVariable = 1;
const _private = 2;
const $element = 3;
const camelCase = 4;      // JavaScript convention
const PascalCase = 5;     // Used for classes/constructors
const SCREAMING_CASE = 6; // Used for constants

// Invalid names
// const 2fast = "error";     // Can't start with number
// const my-var = "error";    // No hyphens
// const for = "error";       // Can't use keywords
```

### JavaScript Naming Convention

JavaScript uses **camelCase** for variables and functions:

```javascript
const firstName = "Alice";
const lastName = "Smith";
const dateOfBirth = "1990-01-15";

function getUserName() { /* ... */ }
function calculateTotal() { /* ... */ }
```

## Template Literals

Embed variables in strings using backticks and `${}`:

```javascript
const name = "Alice";
const age = 25;

// Template literal (recommended)
const message = `My name is ${name} and I am ${age} years old.`;
console.log(message);
// Output: My name is Alice and I am 25 years old.

// Old way with concatenation
const oldMessage = "My name is " + name + " and I am " + age + " years old.";
```

Template literals also support:

```javascript
// Expressions inside ${}
const price = 19.99;
const quantity = 3;
console.log(`Total: $${price * quantity}`);  // Total: $59.97

// Multi-line strings
const html = `
    <div>
        <h1>Hello, ${name}!</h1>
    </div>
`;
```

## Multiple Declarations

Declare multiple variables in one statement:

```javascript
// Multiple let declarations
let x = 1, y = 2, z = 3;

// Multiple const declarations
const WIDTH = 800, HEIGHT = 600, TITLE = "My App";
```

Or use destructuring (covered later):

```javascript
const [a, b, c] = [1, 2, 3];
console.log(a, b, c);  // 1 2 3
```

## Undefined and Uninitialized

A declared variable without a value is `undefined`:

```javascript
let score;
console.log(score);  // undefined

score = 100;
console.log(score);  // 100
```

Note: `const` must be initialized at declaration:

```javascript
const MAX;  // SyntaxError: Missing initializer
```

## Key Takeaways

1. Use `const` by default for values that don't change
2. Use `let` when you need to reassign a variable
3. Avoid `var` - it has confusing scoping behavior
4. Use descriptive, camelCase names
5. Template literals (backticks) allow `${variable}` interpolation
6. Variables declared without a value are `undefined`

Next, we'll explore the different data types that JavaScript variables can hold.
