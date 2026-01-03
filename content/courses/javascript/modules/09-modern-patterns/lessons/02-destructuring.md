---
title: Destructuring
order: 2
estimatedMinutes: 15
---

# Destructuring

Destructuring is a syntax for extracting values from arrays and objects into distinct variables. It makes working with complex data structures cleaner and more readable.

## Object Destructuring

Extract properties from objects:

```javascript
const user = {
    name: "Alice",
    age: 25,
    email: "alice@example.com"
};

// Without destructuring
const name = user.name;
const age = user.age;

// With destructuring
const { name, age, email } = user;
console.log(name);   // "Alice"
console.log(age);    // 25
console.log(email);  // "alice@example.com"
```

## Renaming Variables

Use `:` to rename while destructuring:

```javascript
const user = { name: "Alice", age: 25 };

const { name: userName, age: userAge } = user;
console.log(userName);  // "Alice"
console.log(userAge);   // 25
// Note: 'name' and 'age' are not defined
```

## Default Values

Provide defaults for missing properties:

```javascript
const user = { name: "Alice" };

const { name, age = 18, role = "user" } = user;
console.log(name);  // "Alice"
console.log(age);   // 18 (default)
console.log(role);  // "user" (default)
```

Combine renaming with defaults:

```javascript
const { name: userName = "Anonymous", role = "guest" } = {};
console.log(userName);  // "Anonymous"
console.log(role);      // "guest"
```

## Nested Destructuring

Extract from nested objects:

```javascript
const user = {
    name: "Alice",
    address: {
        city: "New York",
        zip: "10001"
    }
};

const { name, address: { city, zip } } = user;
console.log(name);  // "Alice"
console.log(city);  // "New York"
console.log(zip);   // "10001"
```

With defaults for nested properties:

```javascript
const user = { name: "Alice" };

const { name, address: { city = "Unknown" } = {} } = user;
console.log(city);  // "Unknown"
```

## Array Destructuring

Extract elements by position:

```javascript
const colors = ["red", "green", "blue"];

const [first, second, third] = colors;
console.log(first);   // "red"
console.log(second);  // "green"
console.log(third);   // "blue"
```

## Skipping Elements

Use empty slots to skip elements:

```javascript
const numbers = [1, 2, 3, 4, 5];

const [first, , third, , fifth] = numbers;
console.log(first);  // 1
console.log(third);  // 3
console.log(fifth);  // 5
```

## Rest Elements

Collect remaining elements with `...`:

```javascript
const numbers = [1, 2, 3, 4, 5];

const [first, second, ...rest] = numbers;
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]
```

Works with objects too:

```javascript
const user = { name: "Alice", age: 25, email: "alice@example.com" };

const { name, ...rest } = user;
console.log(name);  // "Alice"
console.log(rest);  // { age: 25, email: "alice@example.com" }
```

## Swapping Variables

Swap values without a temporary variable:

```javascript
let a = 1;
let b = 2;

[a, b] = [b, a];
console.log(a);  // 2
console.log(b);  // 1
```

## Function Parameter Destructuring

Destructure parameters directly:

```javascript
// Object parameters
function greet({ name, age }) {
    console.log(`Hello ${name}, you are ${age} years old`);
}

greet({ name: "Alice", age: 25 });
// "Hello Alice, you are 25 years old"

// With defaults
function createUser({ name, role = "user", active = true } = {}) {
    return { name, role, active };
}

createUser({ name: "Bob" });
// { name: "Bob", role: "user", active: true }
```

Array parameters:

```javascript
function sum([a, b, c]) {
    return a + b + c;
}

sum([1, 2, 3]);  // 6
```

## Return Value Destructuring

Destructure returned objects or arrays:

```javascript
// Returning an object
function getUser() {
    return { name: "Alice", age: 25 };
}

const { name, age } = getUser();

// Returning an array (like React's useState)
function useState(initial) {
    let value = initial;
    const setValue = (newValue) => { value = newValue; };
    return [value, setValue];
}

const [count, setCount] = useState(0);
```

## Destructuring in Loops

Extract values in for...of loops:

```javascript
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Carol", age: 28 }
];

for (const { name, age } of users) {
    console.log(`${name} is ${age}`);
}
// "Alice is 25"
// "Bob is 30"
// "Carol is 28"
```

With Object.entries():

```javascript
const scores = { alice: 90, bob: 85, carol: 92 };

for (const [name, score] of Object.entries(scores)) {
    console.log(`${name}: ${score}`);
}
// "alice: 90"
// "bob: 85"
// "carol: 92"
```

## Practical Examples

### API Response Handling

```javascript
async function fetchUser(id) {
    const response = await fetch(`/api/users/${id}`);
    const { data: { user, permissions }, status } = await response.json();

    if (status === "success") {
        return { user, permissions };
    }
}
```

### Configuration Objects

```javascript
function initApp({
    debug = false,
    theme = "light",
    api: { baseUrl, timeout = 5000 } = {}
} = {}) {
    console.log(`Debug: ${debug}`);
    console.log(`Theme: ${theme}`);
    console.log(`API: ${baseUrl}, timeout: ${timeout}`);
}

initApp({
    debug: true,
    api: { baseUrl: "https://api.example.com" }
});
```

### Multiple Return Values

```javascript
function parseCoordinates(input) {
    const [lat, lng] = input.split(",").map(Number);
    return { lat, lng };
}

const { lat, lng } = parseCoordinates("40.7128,-74.0060");
console.log(lat);  // 40.7128
console.log(lng);  // -74.006
```

## Key Takeaways

1. Object destructuring uses property names: `const { a, b } = obj`
2. Array destructuring uses position: `const [a, b] = arr`
3. Use `=` for default values: `const { a = 1 } = obj`
4. Use `:` to rename: `const { a: renamed } = obj`
5. Use `...` for rest elements: `const [a, ...rest] = arr`
6. Destructuring works in function parameters
7. Nest destructuring for deep objects

Next, we'll explore spread and rest operators.
