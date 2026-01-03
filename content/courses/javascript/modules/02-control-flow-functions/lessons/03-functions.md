---
title: Functions
order: 3
estimatedMinutes: 20
---

# Functions: Reusable Code Blocks

Functions are fundamental to JavaScript. They let you group code into reusable blocks, making programs more organized and maintainable.

## Function Declarations

The traditional way to define a function:

```javascript
function greet(name) {
    return `Hello, ${name}!`;
}

const message = greet("Alice");
console.log(message);  // "Hello, Alice!"
```

A function declaration has:
- The `function` keyword
- A name (`greet`)
- Parameters in parentheses (`name`)
- A code block with statements
- An optional `return` statement

## Function Expressions

Functions can also be assigned to variables:

```javascript
const greet = function(name) {
    return `Hello, ${name}!`;
};

console.log(greet("Bob"));  // "Hello, Bob!"
```

## Arrow Functions

Modern JavaScript uses arrow functions for concise syntax:

```javascript
// Standard arrow function
const greet = (name) => {
    return `Hello, ${name}!`;
};

// Implicit return (single expression)
const greet2 = (name) => `Hello, ${name}!`;

// Single parameter - parentheses optional
const double = x => x * 2;

// No parameters - empty parentheses required
const sayHi = () => "Hi!";

console.log(greet("Charlie"));  // "Hello, Charlie!"
console.log(double(5));         // 10
console.log(sayHi());           // "Hi!"
```

## Parameters and Arguments

Parameters are variables in the function definition. Arguments are values passed when calling:

```javascript
function add(a, b) {  // a and b are parameters
    return a + b;
}

const result = add(3, 5);  // 3 and 5 are arguments
console.log(result);  // 8
```

### Default Parameters

Provide fallback values for parameters:

```javascript
function greet(name = "Guest") {
    return `Hello, ${name}!`;
}

console.log(greet());         // "Hello, Guest!"
console.log(greet("Dana"));   // "Hello, Dana!"
```

### Rest Parameters

Collect multiple arguments into an array:

```javascript
function sum(...numbers) {
    let total = 0;
    for (const num of numbers) {
        total += num;
    }
    return total;
}

console.log(sum(1, 2, 3));        // 6
console.log(sum(1, 2, 3, 4, 5));  // 15
```

## Return Values

Functions can return any value:

```javascript
function getUser() {
    return {
        name: "Alice",
        age: 25,
        active: true
    };
}

const user = getUser();
console.log(user.name);  // "Alice"
```

Without a `return` statement, functions return `undefined`:

```javascript
function logMessage(msg) {
    console.log(msg);
    // No return statement
}

const result = logMessage("Hello");
console.log(result);  // undefined
```

### Early Returns

Use `return` to exit a function early:

```javascript
function divide(a, b) {
    if (b === 0) {
        return "Cannot divide by zero";
    }
    return a / b;
}

console.log(divide(10, 2));  // 5
console.log(divide(10, 0));  // "Cannot divide by zero"
```

## Function Scope

Variables declared inside a function are local to that function:

```javascript
function outer() {
    const x = 10;  // Local to outer()

    function inner() {
        const y = 20;  // Local to inner()
        console.log(x);  // Can access outer's variable
        console.log(y);  // Can access own variable
    }

    inner();
    // console.log(y);  // Error - y is not defined here
}

outer();
// console.log(x);  // Error - x is not defined here
```

## Functions as Values

Functions are first-class citizens in JavaScript - they can be:

### Passed as Arguments

```javascript
function execute(func, value) {
    return func(value);
}

const double = x => x * 2;
const square = x => x * x;

console.log(execute(double, 5));  // 10
console.log(execute(square, 5));  // 25
```

### Returned from Functions

```javascript
function createMultiplier(multiplier) {
    return function(number) {
        return number * multiplier;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

### Stored in Data Structures

```javascript
const operations = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b
};

console.log(operations.add(10, 5));       // 15
console.log(operations.multiply(10, 5));  // 50
```

## Higher-Order Functions

Functions that take or return other functions:

```javascript
const numbers = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = numbers.map(n => n * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]

// filter - keep elements that pass a test
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens);  // [2, 4]

// reduce - accumulate values
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum);  // 15
```

## Arrow Functions vs. Regular Functions

Arrow functions have some differences:

```javascript
// 1. Shorter syntax (as shown above)

// 2. No own 'this' binding
const obj = {
    name: "MyObject",
    regularMethod: function() {
        console.log(this.name);  // "MyObject"
    },
    arrowMethod: () => {
        console.log(this.name);  // undefined (arrow doesn't have own 'this')
    }
};

obj.regularMethod();
obj.arrowMethod();

// 3. Cannot be used as constructors
// const Person = (name) => { this.name = name };
// new Person("Alice");  // Error
```

## Key Takeaways

1. Functions group reusable code with parameters and return values
2. Three ways to define: declarations, expressions, and arrow functions
3. Arrow functions offer concise syntax with implicit returns
4. Default parameters provide fallback values
5. Rest parameters (`...args`) collect multiple arguments
6. Functions are first-class values - pass, return, and store them
7. Arrow functions don't have their own `this`

Next, we'll explore closures - a powerful feature that emerges from JavaScript's scoping rules.
