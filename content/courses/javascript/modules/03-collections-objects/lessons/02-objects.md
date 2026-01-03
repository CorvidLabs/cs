---
title: Objects
order: 2
estimatedMinutes: 18
---

# Objects: Key-Value Collections

Objects are collections of key-value pairs. They're the foundation for organizing related data in JavaScript.

## Creating Objects

```javascript
// Object literal (preferred)
const person = {
    name: "Alice",
    age: 30,
    city: "New York"
};

// Empty object
const empty = {};

// Object constructor (rarely used)
const obj = new Object();
obj.name = "Bob";
```

## Accessing Properties

```javascript
const user = {
    name: "Alice",
    email: "alice@example.com",
    age: 25
};

// Dot notation (preferred when possible)
console.log(user.name);   // "Alice"
console.log(user.email);  // "alice@example.com"

// Bracket notation (required for special keys)
console.log(user["name"]);  // "Alice"

// When to use bracket notation:
const key = "age";
console.log(user[key]);  // 25 (dynamic key)

const data = {
    "first-name": "Alice",      // Hyphen in key
    "2024-data": [1, 2, 3],     // Starts with number
    "some key": "value"          // Contains space
};
console.log(data["first-name"]);
console.log(data["2024-data"]);
```

## Modifying Objects

```javascript
const user = {
    name: "Alice",
    age: 25
};

// Add new property
user.email = "alice@example.com";
console.log(user);  // { name: "Alice", age: 25, email: "alice@example.com" }

// Update existing property
user.age = 26;
console.log(user.age);  // 26

// Delete property
delete user.email;
console.log(user);  // { name: "Alice", age: 26 }
```

## Checking for Properties

```javascript
const user = {
    name: "Alice",
    age: 25
};

// in operator
console.log("name" in user);  // true
console.log("email" in user); // false

// hasOwnProperty method
console.log(user.hasOwnProperty("name"));  // true
console.log(user.hasOwnProperty("toString")); // false (inherited)

// Check value (careful with falsy values)
if (user.name) {
    console.log("Has name");
}

// Better: explicit check
if (user.name !== undefined) {
    console.log("Has name");
}
```

## Iterating Over Objects

### Object.keys(), Object.values(), Object.entries()

```javascript
const person = {
    name: "Alice",
    age: 30,
    city: "NYC"
};

// Get all keys
const keys = Object.keys(person);
console.log(keys);  // ["name", "age", "city"]

// Get all values
const values = Object.values(person);
console.log(values);  // ["Alice", 30, "NYC"]

// Get key-value pairs
const entries = Object.entries(person);
console.log(entries);
// [["name", "Alice"], ["age", 30], ["city", "NYC"]]
```

### Looping Through Objects

```javascript
const scores = {
    Alice: 95,
    Bob: 87,
    Charlie: 92
};

// for...in loop (iterates over keys)
for (const name in scores) {
    console.log(`${name}: ${scores[name]}`);
}
// Alice: 95
// Bob: 87
// Charlie: 92

// Using Object.entries with for...of
for (const [name, score] of Object.entries(scores)) {
    console.log(`${name}: ${score}`);
}
```

## Nested Objects

```javascript
const company = {
    name: "TechCorp",
    address: {
        street: "123 Main St",
        city: "San Francisco",
        zip: "94102"
    },
    employees: [
        { name: "Alice", role: "Developer" },
        { name: "Bob", role: "Designer" }
    ]
};

// Access nested properties
console.log(company.address.city);          // "San Francisco"
console.log(company.employees[0].name);     // "Alice"

// Optional chaining for safe access
console.log(company.address?.country);      // undefined (no error)
console.log(company.location?.city);        // undefined (no error)
// Without ?. this would throw: company.location.city
```

## Object Methods

Objects can contain functions as properties:

```javascript
const calculator = {
    value: 0,
    add: function(n) {
        this.value += n;
        return this;  // Enable chaining
    },
    subtract(n) {  // Shorthand method syntax
        this.value -= n;
        return this;
    },
    getValue() {
        return this.value;
    }
};

calculator.add(10).subtract(3).add(5);
console.log(calculator.getValue());  // 12
```

## Object Copying

```javascript
const original = {
    name: "Alice",
    age: 25
};

// Shallow copy with spread
const copy = { ...original };
copy.name = "Bob";
console.log(original.name);  // "Alice" (unchanged)
console.log(copy.name);      // "Bob"

// Object.assign for shallow copy
const copy2 = Object.assign({}, original);

// Warning: Nested objects are still references!
const nested = {
    user: { name: "Alice" },
    scores: [1, 2, 3]
};

const shallowCopy = { ...nested };
shallowCopy.user.name = "Bob";
console.log(nested.user.name);  // "Bob" (also changed!)

// Deep copy with structuredClone (modern)
const deepCopy = structuredClone(nested);
deepCopy.user.name = "Charlie";
console.log(nested.user.name);  // "Bob" (unchanged)
```

## Merging Objects

```javascript
const defaults = {
    theme: "light",
    fontSize: 14,
    language: "en"
};

const userPrefs = {
    theme: "dark",
    fontSize: 16
};

// Spread operator (later properties override earlier)
const settings = { ...defaults, ...userPrefs };
console.log(settings);
// { theme: "dark", fontSize: 16, language: "en" }

// Object.assign
const settings2 = Object.assign({}, defaults, userPrefs);
```

## Computed Property Names

```javascript
const key = "dynamicKey";
const value = "dynamicValue";

const obj = {
    [key]: value,
    [`prefix_${key}`]: "prefixed value",
    ["count" + 1]: 100
};

console.log(obj);
// { dynamicKey: "dynamicValue", prefix_dynamicKey: "prefixed value", count1: 100 }
```

## Object Shorthand

```javascript
const name = "Alice";
const age = 25;
const greet = () => "Hello!";

// Old way
const person1 = {
    name: name,
    age: age,
    greet: greet
};

// Shorthand (when variable name matches property name)
const person2 = {
    name,
    age,
    greet
};

console.log(person2);  // { name: "Alice", age: 25, greet: [Function: greet] }
```

## Freezing and Sealing Objects

```javascript
// Object.freeze - no changes allowed
const frozen = Object.freeze({
    name: "Alice"
});
frozen.name = "Bob";     // Silently fails (or throws in strict mode)
frozen.age = 25;         // Silently fails
console.log(frozen);     // { name: "Alice" }

// Object.seal - can modify existing, can't add/delete
const sealed = Object.seal({
    name: "Alice"
});
sealed.name = "Bob";     // Works
sealed.age = 25;         // Silently fails
console.log(sealed);     // { name: "Bob" }
```

## Key Takeaways

1. Objects store key-value pairs using property names as keys
2. Use dot notation for simple keys, brackets for dynamic or special keys
3. `Object.keys()`, `Object.values()`, `Object.entries()` help iterate
4. Spread operator creates shallow copies and merges objects
5. Use optional chaining (`?.`) for safe nested access
6. Use `structuredClone()` for deep copying
7. Property shorthand simplifies object creation when names match

Next, we'll learn destructuring - a powerful way to extract values from objects and arrays.
