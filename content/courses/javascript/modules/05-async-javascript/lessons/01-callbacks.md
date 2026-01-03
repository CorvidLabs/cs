---
title: Callbacks
order: 1
estimatedMinutes: 15
---

# Callbacks: The Foundation of Async JavaScript

JavaScript is single-threaded but needs to handle operations that take time - network requests, file reading, timers. Callbacks were the original solution to this challenge.

## What is a Callback?

A callback is a function passed to another function to be executed later:

```javascript
function greet(name, callback) {
    const message = `Hello, ${name}!`;
    callback(message);
}

greet("Alice", function(result) {
    console.log(result);  // "Hello, Alice!"
});

// With arrow function
greet("Bob", (result) => console.log(result));
```

## Synchronous vs Asynchronous Callbacks

### Synchronous Callbacks

Execute immediately, like array methods:

```javascript
const numbers = [1, 2, 3, 4, 5];

// forEach callback runs immediately for each element
numbers.forEach((num) => {
    console.log(num * 2);
});

console.log("Done");

// Output:
// 2, 4, 6, 8, 10, Done (in order)
```

### Asynchronous Callbacks

Execute later, after some operation completes:

```javascript
console.log("Start");

setTimeout(() => {
    console.log("This runs later");
}, 1000);

console.log("End");

// Output:
// Start
// End
// This runs later (after 1 second)
```

## Common Async Callbacks

### setTimeout and setInterval

```javascript
// setTimeout - run once after delay
const timeoutId = setTimeout(() => {
    console.log("Executed after 2 seconds");
}, 2000);

// Cancel if needed
clearTimeout(timeoutId);

// setInterval - run repeatedly
let count = 0;
const intervalId = setInterval(() => {
    count++;
    console.log(`Count: ${count}`);
    if (count >= 5) {
        clearInterval(intervalId);
    }
}, 1000);
```

### Event Listeners

```javascript
const button = document.querySelector("button");

button.addEventListener("click", () => {
    console.log("Button clicked!");
});

// The callback runs later, when user clicks
```

### File Reading (Node.js)

```javascript
import { readFile } from "fs";

readFile("data.txt", "utf8", (error, data) => {
    if (error) {
        console.error("Error reading file:", error);
        return;
    }
    console.log("File contents:", data);
});

console.log("This runs first!");
```

## The Error-First Callback Pattern

A convention in Node.js where the first argument is an error:

```javascript
function fetchData(id, callback) {
    // Simulate async operation
    setTimeout(() => {
        if (id < 0) {
            callback(new Error("Invalid ID"));
            return;
        }
        callback(null, { id, name: "Item " + id });
    }, 100);
}

// Usage
fetchData(1, (error, data) => {
    if (error) {
        console.error("Error:", error.message);
        return;
    }
    console.log("Data:", data);
});
```

## Callback Hell

Nested callbacks become hard to read and maintain:

```javascript
// This is "callback hell" or "pyramid of doom"
getUserById(1, (err, user) => {
    if (err) return console.error(err);

    getOrdersByUser(user.id, (err, orders) => {
        if (err) return console.error(err);

        getOrderDetails(orders[0].id, (err, details) => {
            if (err) return console.error(err);

            getShippingInfo(details.shippingId, (err, shipping) => {
                if (err) return console.error(err);

                console.log("Shipping:", shipping);
            });
        });
    });
});
```

### Mitigating Callback Hell

#### 1. Named Functions

```javascript
function handleShipping(err, shipping) {
    if (err) return console.error(err);
    console.log("Shipping:", shipping);
}

function handleDetails(err, details) {
    if (err) return console.error(err);
    getShippingInfo(details.shippingId, handleShipping);
}

function handleOrders(err, orders) {
    if (err) return console.error(err);
    getOrderDetails(orders[0].id, handleDetails);
}

function handleUser(err, user) {
    if (err) return console.error(err);
    getOrdersByUser(user.id, handleOrders);
}

getUserById(1, handleUser);
```

#### 2. Early Returns

```javascript
function processData(callback) {
    getData((err, data) => {
        if (err) return callback(err);

        validateData(data, (err, valid) => {
            if (err) return callback(err);
            if (!valid) return callback(new Error("Invalid data"));

            saveData(data, (err, result) => {
                if (err) return callback(err);
                callback(null, result);
            });
        });
    });
}
```

## Real-World Example: Sequential Loading

```javascript
function loadImage(src, callback) {
    const img = new Image();

    img.onload = () => callback(null, img);
    img.onerror = () => callback(new Error(`Failed to load ${src}`));

    img.src = src;
}

// Load images sequentially
loadImage("image1.jpg", (err, img1) => {
    if (err) return console.error(err);
    console.log("Image 1 loaded:", img1.width, "x", img1.height);

    loadImage("image2.jpg", (err, img2) => {
        if (err) return console.error(err);
        console.log("Image 2 loaded:", img2.width, "x", img2.height);

        console.log("All images loaded!");
    });
});
```

## When Callbacks Are Still Used

Despite promises being preferred, callbacks are still common:

1. **Event listeners** - addEventListener uses callbacks
2. **Array methods** - map, filter, reduce, forEach
3. **Legacy APIs** - Older libraries and Node.js core
4. **Simple one-off operations** - setTimeout, requestAnimationFrame

```javascript
// These all use callbacks and that's fine!
document.addEventListener("click", handleClick);
array.map(item => item.value);
setTimeout(doSomething, 1000);
requestAnimationFrame(animate);
```

## Key Takeaways

1. Callbacks are functions passed as arguments to be executed later
2. Synchronous callbacks run immediately; async callbacks run later
3. Error-first pattern: `callback(error, result)`
4. Deeply nested callbacks create "callback hell"
5. Name functions and use early returns to improve readability
6. Callbacks are still used for events, array methods, and timers

Callbacks work but have limitations. Next, we'll learn about Promises - a better way to handle asynchronous operations.
