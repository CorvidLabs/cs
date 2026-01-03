---
title: Closures
order: 4
estimatedMinutes: 18
---

# Closures: Functions That Remember

A closure is a function that retains access to its outer scope even after the outer function has returned. This is one of JavaScript's most powerful features.

## Understanding Scope First

Before closures, let's review how scope works:

```javascript
function outer() {
    const outerVar = "I'm from outer";

    function inner() {
        console.log(outerVar);  // inner can access outerVar
    }

    inner();
}

outer();  // "I'm from outer"
```

Inner functions can access variables from outer functions. This is lexical scope.

## What Makes a Closure

A closure occurs when an inner function is returned or passed outside its parent:

```javascript
function createGreeter(greeting) {
    // greeting is in the outer scope

    return function(name) {
        // This inner function "closes over" greeting
        return `${greeting}, ${name}!`;
    };
}

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");

// createGreeter has finished, but greeting is remembered!
console.log(sayHello("Alice"));  // "Hello, Alice!"
console.log(sayHi("Bob"));       // "Hi, Bob!"
```

The returned function "remembers" the `greeting` variable from when it was created.

## Closures in Practice

### 1. Data Privacy

Create private variables that can't be accessed directly:

```javascript
function createCounter() {
    let count = 0;  // Private variable

    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.increment());  // 1
console.log(counter.increment());  // 2
console.log(counter.decrement());  // 1
console.log(counter.getCount());   // 1

// count is not accessible directly!
console.log(counter.count);  // undefined
```

### 2. Function Factories

Create specialized functions:

```javascript
function createMultiplier(multiplier) {
    return (number) => number * multiplier;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

console.log(double(5));     // 10
console.log(triple(5));     // 15
console.log(quadruple(5));  // 20
```

Each function remembers its own `multiplier` value.

### 3. Event Handlers with State

```javascript
function createButtonHandler(buttonName) {
    let clickCount = 0;

    return function() {
        clickCount++;
        console.log(`${buttonName} clicked ${clickCount} times`);
    };
}

const handleSave = createButtonHandler("Save");
const handleCancel = createButtonHandler("Cancel");

// Each handler has its own independent count
handleSave();    // "Save clicked 1 times"
handleSave();    // "Save clicked 2 times"
handleCancel();  // "Cancel clicked 1 times"
handleSave();    // "Save clicked 3 times"
```

### 4. Memoization

Cache expensive calculations:

```javascript
function createMemoizedFunction(fn) {
    const cache = {};

    return function(arg) {
        if (arg in cache) {
            console.log("Returning cached result");
            return cache[arg];
        }

        console.log("Computing result");
        const result = fn(arg);
        cache[arg] = result;
        return result;
    };
}

const expensiveSquare = createMemoizedFunction((n) => {
    // Simulate expensive calculation
    return n * n;
});

console.log(expensiveSquare(5));  // "Computing result", 25
console.log(expensiveSquare(5));  // "Returning cached result", 25
console.log(expensiveSquare(6));  // "Computing result", 36
```

## Common Closure Pitfall: Loop Variables

A classic mistake with closures in loops:

```javascript
// Problem: All functions share the same i
const functions = [];

for (var i = 0; i < 3; i++) {
    functions.push(function() {
        console.log(i);
    });
}

functions[0]();  // 3 (not 0!)
functions[1]();  // 3 (not 1!)
functions[2]();  // 3 (not 2!)
```

The issue: `var` is function-scoped, so all closures share the same `i`, which is 3 after the loop.

### Solution 1: Use let

```javascript
const functions = [];

for (let i = 0; i < 3; i++) {
    functions.push(function() {
        console.log(i);
    });
}

functions[0]();  // 0
functions[1]();  // 1
functions[2]();  // 2
```

`let` creates a new binding for each iteration.

### Solution 2: Create a Closure Explicitly

```javascript
const functions = [];

for (var i = 0; i < 3; i++) {
    functions.push((function(index) {
        return function() {
            console.log(index);
        };
    })(i));
}

functions[0]();  // 0
functions[1]();  // 1
functions[2]();  // 2
```

## Closures and Memory

Closures keep references to their outer scope, which means:

```javascript
function createHugeArray() {
    const hugeArray = new Array(1000000).fill("data");

    return function() {
        // This closure keeps hugeArray in memory!
        return hugeArray.length;
    };
}

const getLength = createHugeArray();
// hugeArray stays in memory as long as getLength exists
```

Be mindful of what your closures capture. If you don't need the full array:

```javascript
function createLength() {
    const hugeArray = new Array(1000000).fill("data");
    const length = hugeArray.length;

    return function() {
        return length;  // Only captures the number, not the array
    };
}
```

## Practical Example: Rate Limiter

```javascript
function createRateLimiter(limit, interval) {
    let calls = 0;

    setInterval(() => {
        calls = 0;  // Reset count every interval
    }, interval);

    return function(fn) {
        if (calls < limit) {
            calls++;
            fn();
            return true;
        }
        console.log("Rate limit exceeded");
        return false;
    };
}

const rateLimited = createRateLimiter(3, 1000);

rateLimited(() => console.log("Call 1"));  // Executes
rateLimited(() => console.log("Call 2"));  // Executes
rateLimited(() => console.log("Call 3"));  // Executes
rateLimited(() => console.log("Call 4"));  // "Rate limit exceeded"
```

## Key Takeaways

1. A closure is a function that retains access to its creation scope
2. Use closures to create private variables and state
3. Function factories use closures to create specialized functions
4. Use `let` in loops to avoid the classic closure pitfall
5. Be aware of memory implications - closures keep their scope alive
6. Closures enable powerful patterns like memoization and rate limiting

Closures are everywhere in JavaScript - callbacks, event handlers, and many design patterns rely on them. Understanding closures is essential for mastering JavaScript.
