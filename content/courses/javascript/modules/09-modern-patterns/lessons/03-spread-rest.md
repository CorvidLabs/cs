---
title: Spread and Rest Operators
order: 3
estimatedMinutes: 14
---

# Spread and Rest Operators

The `...` syntax serves two purposes in JavaScript: spreading (expanding) iterables and collecting rest elements. These operators enable elegant data manipulation.

## Spread Operator - Arrays

Expand an array into individual elements:

```javascript
const numbers = [1, 2, 3];

// Spread into another array
const moreNumbers = [...numbers, 4, 5, 6];
console.log(moreNumbers);  // [1, 2, 3, 4, 5, 6]

// Spread into function arguments
console.log(Math.max(...numbers));  // 3
```

## Copying Arrays

Create shallow copies:

```javascript
const original = [1, 2, 3];
const copy = [...original];

copy.push(4);
console.log(original);  // [1, 2, 3] - unchanged
console.log(copy);      // [1, 2, 3, 4]
```

## Merging Arrays

Combine multiple arrays:

```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const arr3 = [5, 6];

const merged = [...arr1, ...arr2, ...arr3];
console.log(merged);  // [1, 2, 3, 4, 5, 6]

// Insert in middle
const withMiddle = [0, ...arr1, 2.5, ...arr2];
console.log(withMiddle);  // [0, 1, 2, 2.5, 3, 4]
```

## Spread Operator - Objects

Expand object properties:

```javascript
const defaults = { theme: "light", fontSize: 14 };
const userPrefs = { theme: "dark" };

const settings = { ...defaults, ...userPrefs };
console.log(settings);  // { theme: "dark", fontSize: 14 }
```

Later spreads override earlier ones.

## Copying Objects

Create shallow copies:

```javascript
const user = { name: "Alice", age: 25 };
const copy = { ...user };

copy.name = "Bob";
console.log(user.name);  // "Alice" - unchanged
console.log(copy.name);  // "Bob"
```

## Adding/Overriding Properties

```javascript
const user = { name: "Alice", age: 25 };

// Add property
const withRole = { ...user, role: "admin" };
console.log(withRole);  // { name: "Alice", age: 25, role: "admin" }

// Override property
const older = { ...user, age: 26 };
console.log(older);  // { name: "Alice", age: 26 }

// Order matters
const withNewName = { name: "Bob", ...user };
console.log(withNewName);  // { name: "Alice", age: 25 } - user's name wins
```

## Conditional Spreading

Add properties conditionally:

```javascript
const includeEmail = true;
const includePhone = false;

const contact = {
    name: "Alice",
    ...(includeEmail && { email: "alice@example.com" }),
    ...(includePhone && { phone: "555-1234" })
};

console.log(contact);
// { name: "Alice", email: "alice@example.com" }
```

## Rest Parameters

Collect remaining function arguments:

```javascript
function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3));      // 6
console.log(sum(1, 2, 3, 4, 5)); // 15
```

Combine with regular parameters:

```javascript
function greet(greeting, ...names) {
    return names.map(name => `${greeting}, ${name}!`);
}

console.log(greet("Hello", "Alice", "Bob"));
// ["Hello, Alice!", "Hello, Bob!"]
```

Rest must be the last parameter:

```javascript
// Valid
function fn(a, b, ...rest) {}

// Invalid - SyntaxError
// function fn(...rest, last) {}
```

## Rest in Destructuring

Collect remaining elements:

```javascript
// Arrays
const [first, ...others] = [1, 2, 3, 4, 5];
console.log(first);   // 1
console.log(others);  // [2, 3, 4, 5]

// Objects
const { name, ...rest } = { name: "Alice", age: 25, role: "admin" };
console.log(name);  // "Alice"
console.log(rest);  // { age: 25, role: "admin" }
```

## Removing Properties

Use rest to omit properties:

```javascript
const user = { id: 1, name: "Alice", password: "secret" };

// Remove password
const { password, ...safeUser } = user;
console.log(safeUser);  // { id: 1, name: "Alice" }
```

## Converting Iterables

Spread converts iterables to arrays:

```javascript
// String to array
const chars = [..."hello"];
console.log(chars);  // ["h", "e", "l", "l", "o"]

// Set to array
const unique = [...new Set([1, 2, 2, 3, 3, 3])];
console.log(unique);  // [1, 2, 3]

// NodeList to array
const divs = [...document.querySelectorAll("div")];
```

## Practical Examples

### Immutable Updates

```javascript
// Updating array item
const todos = [
    { id: 1, text: "Learn JS", done: false },
    { id: 2, text: "Build app", done: false }
];

const updatedTodos = todos.map(todo =>
    todo.id === 1 ? { ...todo, done: true } : todo
);

// Removing item
const withoutFirst = todos.filter(todo => todo.id !== 1);

// Adding item
const withNew = [...todos, { id: 3, text: "Deploy", done: false }];
```

### Merging Configurations

```javascript
function createServer(options = {}) {
    const defaults = {
        port: 3000,
        host: "localhost",
        ssl: false,
        timeout: 30000
    };

    const config = { ...defaults, ...options };
    console.log(`Starting server on ${config.host}:${config.port}`);
    return config;
}

createServer({ port: 8080, ssl: true });
// Starting server on localhost:8080
```

### Collecting Event Data

```javascript
function handleFormSubmit(event, ...extraData) {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log("Form data:", Object.fromEntries(formData));
    console.log("Extra data:", extraData);
}
```

### Cloning with Modifications

```javascript
function updateUser(user, updates) {
    return {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString()
    };
}

const user = { id: 1, name: "Alice", email: "alice@example.com" };
const updated = updateUser(user, { name: "Alicia" });
// { id: 1, name: "Alicia", email: "alice@example.com", updatedAt: "..." }
```

## Shallow Copy Warning

Spread creates shallow copies - nested objects are still referenced:

```javascript
const original = {
    name: "Alice",
    address: { city: "NYC" }
};

const copy = { ...original };
copy.address.city = "LA";

console.log(original.address.city);  // "LA" - also changed!
```

For deep copies:

```javascript
// Using structuredClone (modern browsers/Node)
const deepCopy = structuredClone(original);

// Or JSON (doesn't handle functions, dates, etc.)
const deepCopy2 = JSON.parse(JSON.stringify(original));
```

## Key Takeaways

1. Spread (`...`) expands arrays/objects: `[...arr]`, `{...obj}`
2. Rest (`...`) collects remaining elements: `function(...args)`
3. Spread creates shallow copies - nested objects are shared
4. Use spread for immutable updates and merging
5. Use rest for variable-length function arguments
6. Rest must be the last parameter/element
7. Spread works on any iterable (strings, Sets, Maps)

Next, we'll explore modern array methods for functional programming.
