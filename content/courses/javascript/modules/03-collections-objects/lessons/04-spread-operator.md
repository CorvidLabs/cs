---
title: Spread Operator
order: 4
estimatedMinutes: 14
---

# Spread Operator: Expanding Collections

The spread operator (`...`) expands an iterable (like an array) or object into individual elements. It's the complement to destructuring's rest pattern.

## Spread with Arrays

### Copying Arrays

```javascript
const original = [1, 2, 3];

// Shallow copy
const copy = [...original];
copy.push(4);

console.log(original);  // [1, 2, 3] (unchanged)
console.log(copy);      // [1, 2, 3, 4]
```

### Combining Arrays

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const combined = [...arr1, ...arr2];
console.log(combined);  // [1, 2, 3, 4, 5, 6]

// Insert elements in between
const middle = [0, ...arr1, 3.5, ...arr2, 7];
console.log(middle);  // [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
```

### Passing Array Elements as Arguments

```javascript
const numbers = [5, 2, 8, 1, 9];

// Without spread
console.log(Math.max(5, 2, 8, 1, 9));  // 9

// With spread
console.log(Math.max(...numbers));  // 9
console.log(Math.min(...numbers));  // 1

// Multiple arrays
const more = [3, 7];
console.log(Math.max(...numbers, ...more));  // 9
```

### Converting Iterables to Arrays

```javascript
// String to array
const chars = [..."hello"];
console.log(chars);  // ["h", "e", "l", "l", "o"]

// Set to array (removes duplicates)
const unique = [...new Set([1, 2, 2, 3, 3, 3])];
console.log(unique);  // [1, 2, 3]

// NodeList to array (in browsers)
// const elements = [...document.querySelectorAll("div")];
```

## Spread with Objects

### Copying Objects

```javascript
const original = { a: 1, b: 2 };

const copy = { ...original };
copy.c = 3;

console.log(original);  // { a: 1, b: 2 } (unchanged)
console.log(copy);      // { a: 1, b: 2, c: 3 }
```

### Merging Objects

```javascript
const defaults = {
    theme: "light",
    language: "en",
    fontSize: 14
};

const userSettings = {
    theme: "dark",
    fontSize: 16
};

// Later properties override earlier ones
const merged = { ...defaults, ...userSettings };
console.log(merged);
// { theme: "dark", language: "en", fontSize: 16 }
```

### Adding/Overriding Properties

```javascript
const user = {
    name: "Alice",
    age: 25
};

// Add properties
const userWithId = { id: 1, ...user };
console.log(userWithId);
// { id: 1, name: "Alice", age: 25 }

// Override properties
const updatedUser = { ...user, age: 26 };
console.log(updatedUser);
// { name: "Alice", age: 26 }

// Add and override
const fullUser = { id: 1, ...user, role: "admin", age: 26 };
console.log(fullUser);
// { id: 1, name: "Alice", role: "admin", age: 26 }
```

## Spread vs. Rest

The `...` syntax serves two purposes:

```javascript
// REST: Collects into an array/object (in destructuring)
const [first, ...rest] = [1, 2, 3, 4];
console.log(rest);  // [2, 3, 4]

const { a, ...others } = { a: 1, b: 2, c: 3 };
console.log(others);  // { b: 2, c: 3 }

// SPREAD: Expands from an array/object
const combined = [...[1, 2], ...[3, 4]];
console.log(combined);  // [1, 2, 3, 4]
```

## Common Patterns

### Immutable Updates

```javascript
// State management pattern (React, Redux, etc.)
const state = {
    user: { name: "Alice", age: 25 },
    items: [1, 2, 3]
};

// Update nested property immutably
const newState = {
    ...state,
    user: { ...state.user, age: 26 }
};

console.log(state.user.age);     // 25 (unchanged)
console.log(newState.user.age);  // 26

// Add item to array immutably
const withNewItem = {
    ...state,
    items: [...state.items, 4]
};
console.log(state.items);          // [1, 2, 3]
console.log(withNewItem.items);    // [1, 2, 3, 4]
```

### Remove Item from Array

```javascript
const items = [1, 2, 3, 4, 5];
const indexToRemove = 2;

const filtered = [
    ...items.slice(0, indexToRemove),
    ...items.slice(indexToRemove + 1)
];
console.log(filtered);  // [1, 2, 4, 5]

// Or just use filter
const filtered2 = items.filter((_, i) => i !== indexToRemove);
console.log(filtered2);  // [1, 2, 4, 5]
```

### Conditional Spread

```javascript
const baseConfig = { debug: false };

const config = {
    ...baseConfig,
    ...(process.env.NODE_ENV === "development" && { debug: true })
};

// If condition is true, spread the object
// If false, spread false (which does nothing)
```

### Omitting Properties

```javascript
const user = {
    id: 1,
    name: "Alice",
    password: "secret",
    email: "alice@example.com"
};

// Remove password before sending to client
const { password, ...safeUser } = user;
console.log(safeUser);
// { id: 1, name: "Alice", email: "alice@example.com" }
```

## Shallow Copy Warning

Spread creates shallow copies - nested objects are still references:

```javascript
const original = {
    name: "Alice",
    address: {
        city: "NYC",
        zip: "10001"
    }
};

const copy = { ...original };
copy.address.city = "Boston";

// Both changed!
console.log(original.address.city);  // "Boston"
console.log(copy.address.city);      // "Boston"

// For deep copy, use structuredClone
const deepCopy = structuredClone(original);
deepCopy.address.city = "Chicago";

console.log(original.address.city);  // "Boston"
console.log(deepCopy.address.city);  // "Chicago"
```

## Spread in Function Calls

```javascript
function greet(greeting, name, punctuation) {
    return `${greeting}, ${name}${punctuation}`;
}

const args = ["Hello", "World", "!"];
console.log(greet(...args));  // "Hello, World!"

// Partial application
const partialArgs = ["Hello"];
console.log(greet(...partialArgs, "Alice", "?"));  // "Hello, Alice?"
```

## Performance Considerations

```javascript
// Creating new arrays/objects has overhead
// Don't overuse in performance-critical loops

// Less efficient
let result = [];
for (const item of largeArray) {
    result = [...result, transform(item)];  // Creates new array each iteration
}

// More efficient
const result2 = [];
for (const item of largeArray) {
    result2.push(transform(item));  // Mutates in place
}

// Best (when mutation isn't needed)
const result3 = largeArray.map(transform);
```

## Key Takeaways

1. Spread (`...`) expands arrays and objects into individual elements
2. Use spread to copy arrays/objects (shallow copy only)
3. Later properties override earlier ones when merging objects
4. Combine with destructuring for immutable updates
5. Spread in function calls passes array elements as arguments
6. Remember: spread creates shallow copies - nested values are references
7. Use `structuredClone()` when you need deep copies

Mastering destructuring and spread gives you powerful tools for working with JavaScript's data structures in a clean, functional style.
