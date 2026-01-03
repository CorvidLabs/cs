---
title: Destructuring
order: 3
estimatedMinutes: 15
---

# Destructuring: Elegant Value Extraction

Destructuring is a convenient way to extract values from arrays and objects into distinct variables. It makes code cleaner and more readable.

## Array Destructuring

### Basic Syntax

```javascript
const colors = ["red", "green", "blue"];

// Without destructuring
const first = colors[0];
const second = colors[1];
const third = colors[2];

// With destructuring
const [a, b, c] = colors;
console.log(a);  // "red"
console.log(b);  // "green"
console.log(c);  // "blue"
```

### Skipping Elements

```javascript
const numbers = [1, 2, 3, 4, 5];

// Skip elements with empty slots
const [first, , third] = numbers;
console.log(first);  // 1
console.log(third);  // 3

const [, , , fourth] = numbers;
console.log(fourth);  // 4
```

### Rest Pattern

```javascript
const numbers = [1, 2, 3, 4, 5];

const [first, second, ...rest] = numbers;
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]

// Useful for splitting arrays
const [head, ...tail] = numbers;
console.log(head);  // 1
console.log(tail);  // [2, 3, 4, 5]
```

### Default Values

```javascript
const arr = [1];

const [a, b = 10] = arr;
console.log(a);  // 1
console.log(b);  // 10 (default, since arr[1] is undefined)

const [x = 5, y = 5] = [1];
console.log(x);  // 1 (value exists)
console.log(y);  // 5 (default)
```

### Swapping Variables

```javascript
let a = 1;
let b = 2;

// Swap without temp variable
[a, b] = [b, a];
console.log(a);  // 2
console.log(b);  // 1
```

## Object Destructuring

### Basic Syntax

```javascript
const person = {
    name: "Alice",
    age: 30,
    city: "New York"
};

// Without destructuring
const name1 = person.name;
const age1 = person.age;

// With destructuring
const { name, age, city } = person;
console.log(name);  // "Alice"
console.log(age);   // 30
console.log(city);  // "New York"
```

### Renaming Variables

```javascript
const user = {
    name: "Alice",
    email: "alice@example.com"
};

// Rename during destructuring
const { name: userName, email: userEmail } = user;
console.log(userName);   // "Alice"
console.log(userEmail);  // "alice@example.com"
// console.log(name);    // Error - name is not defined
```

### Default Values

```javascript
const config = {
    theme: "dark"
};

const { theme, fontSize = 14, language = "en" } = config;
console.log(theme);     // "dark" (exists)
console.log(fontSize);  // 14 (default)
console.log(language);  // "en" (default)

// Combine rename and default
const { mode: displayMode = "normal" } = config;
console.log(displayMode);  // "normal"
```

### Nested Destructuring

```javascript
const user = {
    name: "Alice",
    address: {
        city: "New York",
        zip: "10001"
    }
};

// Destructure nested object
const { name, address: { city, zip } } = user;
console.log(name);  // "Alice"
console.log(city);  // "New York"
console.log(zip);   // "10001"
// console.log(address);  // Error - address is not defined

// Keep parent and destructure
const { name: userName, address } = user;
const { city: userCity } = address;
```

### Rest Pattern with Objects

```javascript
const person = {
    name: "Alice",
    age: 30,
    city: "NYC",
    country: "USA"
};

const { name, age, ...location } = person;
console.log(name);      // "Alice"
console.log(age);       // 30
console.log(location);  // { city: "NYC", country: "USA" }
```

## Destructuring in Function Parameters

### Object Parameters

```javascript
// Without destructuring
function greetOld(user) {
    console.log(`Hello, ${user.name}! You are ${user.age} years old.`);
}

// With destructuring
function greet({ name, age }) {
    console.log(`Hello, ${name}! You are ${age} years old.`);
}

greet({ name: "Alice", age: 30 });
// "Hello, Alice! You are 30 years old."
```

### With Defaults

```javascript
function createUser({ name, role = "user", active = true } = {}) {
    return { name, role, active };
}

console.log(createUser({ name: "Alice" }));
// { name: "Alice", role: "user", active: true }

console.log(createUser({ name: "Bob", role: "admin" }));
// { name: "Bob", role: "admin", active: true }

// The = {} default allows calling with no arguments
console.log(createUser());
// { name: undefined, role: "user", active: true }
```

### Array Parameters

```javascript
function sum([a, b, c = 0]) {
    return a + b + c;
}

console.log(sum([1, 2]));     // 3
console.log(sum([1, 2, 3]));  // 6
```

## Destructuring in Loops

```javascript
const users = [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 35 }
];

// Destructure in for...of
for (const { name, age } of users) {
    console.log(`${name} is ${age}`);
}

// With Object.entries
const scores = { Alice: 95, Bob: 87, Charlie: 92 };
for (const [name, score] of Object.entries(scores)) {
    console.log(`${name}: ${score}`);
}

// In array methods
const names = users.map(({ name }) => name);
console.log(names);  // ["Alice", "Bob", "Charlie"]

const adults = users.filter(({ age }) => age >= 30);
console.log(adults);  // [{ name: "Alice", age: 30 }, { name: "Charlie", age: 35 }]
```

## Practical Examples

### API Response Handling

```javascript
const response = {
    status: 200,
    data: {
        user: { id: 1, name: "Alice" },
        token: "abc123"
    }
};

const { status, data: { user: { name }, token } } = response;
console.log(status);  // 200
console.log(name);    // "Alice"
console.log(token);   // "abc123"
```

### React-style Props

```javascript
function Button({ label, onClick, disabled = false, size = "medium" }) {
    console.log(`Button: ${label}, size: ${size}, disabled: ${disabled}`);
}

Button({ label: "Submit", onClick: () => {} });
// "Button: Submit, size: medium, disabled: false"
```

### Multiple Return Values

```javascript
function getMinMax(numbers) {
    return {
        min: Math.min(...numbers),
        max: Math.max(...numbers)
    };
}

const { min, max } = getMinMax([3, 1, 4, 1, 5, 9]);
console.log(min, max);  // 1 9

// Or as array
function getMinMaxArray(numbers) {
    return [Math.min(...numbers), Math.max(...numbers)];
}

const [minimum, maximum] = getMinMaxArray([3, 1, 4, 1, 5, 9]);
console.log(minimum, maximum);  // 1 9
```

## Key Takeaways

1. Array destructuring uses position: `[a, b] = arr`
2. Object destructuring uses property names: `{ name, age } = obj`
3. Use `:` to rename: `{ name: userName } = obj`
4. Use `=` for defaults: `{ name = "Guest" } = obj`
5. Use `...rest` to collect remaining elements
6. Destructure in function parameters for cleaner APIs
7. Works in loops with `for...of` and array methods

Next, we'll explore the spread operator - destructuring's counterpart for expanding arrays and objects.
