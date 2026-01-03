---
title: JSON Handling
order: 3
estimatedMinutes: 14
---

# Working with JSON

JSON (JavaScript Object Notation) is the standard data format for web APIs. Understanding how to parse, stringify, and transform JSON is essential for working with APIs.

## Parsing JSON

Convert JSON strings to JavaScript objects:

```javascript
// Basic parsing
const jsonString = '{"name": "Alice", "age": 25}';
const user = JSON.parse(jsonString);

console.log(user.name);  // "Alice"
console.log(user.age);   // 25

// Parsing arrays
const jsonArray = '[1, 2, 3, 4, 5]';
const numbers = JSON.parse(jsonArray);
console.log(numbers[0]);  // 1
```

### Handling Parse Errors

```javascript
function safeJsonParse(str) {
    try {
        return { success: true, data: JSON.parse(str) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

const result = safeJsonParse('invalid json');
if (!result.success) {
    console.error("Parse failed:", result.error);
}
```

### Reviver Function

Transform values during parsing:

```javascript
// Convert date strings to Date objects
const jsonWithDates = '{"created": "2024-01-15T10:30:00Z"}';

const obj = JSON.parse(jsonWithDates, (key, value) => {
    if (key === "created" && typeof value === "string") {
        return new Date(value);
    }
    return value;
});

console.log(obj.created instanceof Date);  // true

// More robust date detection
function dateReviver(key, value) {
    const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (typeof value === "string" && datePattern.test(value)) {
        return new Date(value);
    }
    return value;
}

const parsed = JSON.parse(jsonString, dateReviver);
```

## Stringifying JSON

Convert JavaScript objects to JSON strings:

```javascript
const user = {
    name: "Alice",
    age: 25,
    hobbies: ["reading", "coding"]
};

const json = JSON.stringify(user);
// '{"name":"Alice","age":25,"hobbies":["reading","coding"]}'
```

### Formatting Output

```javascript
const user = { name: "Alice", age: 25 };

// No formatting (compact)
JSON.stringify(user);
// '{"name":"Alice","age":25}'

// Pretty print with 2 spaces
JSON.stringify(user, null, 2);
/*
{
  "name": "Alice",
  "age": 25
}
*/

// With tabs
JSON.stringify(user, null, "\t");
```

### Replacer Function

Filter or transform values during stringification:

```javascript
const user = {
    name: "Alice",
    password: "secret123",
    age: 25
};

// Filter out sensitive fields
const json = JSON.stringify(user, (key, value) => {
    if (key === "password") {
        return undefined;  // Exclude this field
    }
    return value;
});
// '{"name":"Alice","age":25}'

// Replacer array - include only specified keys
const filtered = JSON.stringify(user, ["name", "age"]);
// '{"name":"Alice","age":25}'
```

### toJSON Method

Objects can customize their JSON representation:

```javascript
class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    toJSON() {
        // Exclude password from JSON
        return {
            name: this.name,
            email: this.email
        };
    }
}

const user = new User("Alice", "alice@example.com", "secret");
JSON.stringify(user);
// '{"name":"Alice","email":"alice@example.com"}'
```

## Handling Special Values

```javascript
// undefined is stripped from objects
JSON.stringify({ a: undefined, b: 1 });  // '{"b":1}'

// undefined in arrays becomes null
JSON.stringify([undefined, 1, undefined]);  // '[null,1,null]'

// Functions are stripped
JSON.stringify({ fn: () => {} });  // '{}'

// NaN and Infinity become null
JSON.stringify({ n: NaN, i: Infinity });  // '{"n":null,"i":null}'

// Dates are converted to ISO strings
JSON.stringify({ date: new Date("2024-01-15") });
// '{"date":"2024-01-15T00:00:00.000Z"}'
```

## Deep Cloning with JSON

Quick deep clone for JSON-serializable objects:

```javascript
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const original = {
    name: "Alice",
    address: {
        city: "Boston",
        zip: "02101"
    }
};

const clone = deepClone(original);
clone.address.city = "New York";

console.log(original.address.city);  // "Boston" (unchanged)
console.log(clone.address.city);     // "New York"
```

Note: This doesn't work for functions, undefined, symbols, or circular references.

## Data Transformation

### Renaming Keys

```javascript
function transformKeys(obj, keyMap) {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
            const newKey = keyMap[key] || key;
            return [newKey, value];
        })
    );
}

// API response uses snake_case
const apiResponse = {
    user_name: "Alice",
    email_address: "alice@example.com",
    created_at: "2024-01-15"
};

// Transform to camelCase
const user = transformKeys(apiResponse, {
    user_name: "userName",
    email_address: "emailAddress",
    created_at: "createdAt"
});
// { userName: "Alice", emailAddress: "alice@example.com", createdAt: "2024-01-15" }
```

### Case Conversion Utilities

```javascript
function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function camelToSnake(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function convertObjectKeys(obj, converter) {
    if (Array.isArray(obj)) {
        return obj.map(item => convertObjectKeys(item, converter));
    }
    if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                converter(key),
                convertObjectKeys(value, converter)
            ])
        );
    }
    return obj;
}

// Usage
const apiData = { user_name: "Alice", home_address: { street_name: "Main St" } };
const jsData = convertObjectKeys(apiData, snakeToCamel);
// { userName: "Alice", homeAddress: { streetName: "Main St" } }
```

### Selecting Fields

```javascript
function pick(obj, keys) {
    return Object.fromEntries(
        keys.filter(key => key in obj).map(key => [key, obj[key]])
    );
}

function omit(obj, keys) {
    const keySet = new Set(keys);
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keySet.has(key))
    );
}

const user = { id: 1, name: "Alice", password: "secret", email: "a@b.com" };

pick(user, ["id", "name"]);
// { id: 1, name: "Alice" }

omit(user, ["password"]);
// { id: 1, name: "Alice", email: "a@b.com" }
```

## Working with API Responses

```javascript
async function fetchAndTransform(url, transformer) {
    const response = await fetch(url);
    const data = await response.json();
    return transformer(data);
}

// Transform API response
const users = await fetchAndTransform("/api/users", (data) => {
    return data.map(user => ({
        ...convertObjectKeys(user, snakeToCamel),
        fullName: `${user.first_name} ${user.last_name}`,
        createdAt: new Date(user.created_at)
    }));
});
```

## Handling Large JSON

For very large JSON files, consider streaming:

```javascript
// In Node.js/Bun, use streams for large files
import { createReadStream } from "fs";

async function processLargeJson(filepath) {
    const stream = createReadStream(filepath, { encoding: "utf8" });
    let buffer = "";

    for await (const chunk of stream) {
        buffer += chunk;
        // Process complete JSON objects as they arrive
    }

    return JSON.parse(buffer);
}
```

## Key Takeaways

1. `JSON.parse()` converts JSON strings to objects
2. `JSON.stringify()` converts objects to JSON strings
3. Reviver/replacer functions transform data during parse/stringify
4. `toJSON()` method customizes object serialization
5. Some values (undefined, functions) don't serialize
6. JSON parse/stringify can be used for simple deep cloning
7. Transform API responses to match your application's conventions

In the next lesson, we'll learn about validating data from APIs.
