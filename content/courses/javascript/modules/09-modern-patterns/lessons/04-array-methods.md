---
title: Modern Array Methods
order: 4
estimatedMinutes: 18
---

# Modern Array Methods

JavaScript arrays have powerful built-in methods for transforming, filtering, and reducing data. These methods enable functional programming patterns and produce cleaner, more readable code.

## map() - Transform Elements

Create a new array by transforming each element:

```javascript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]

const squared = numbers.map(n => n ** 2);
console.log(squared);  // [1, 4, 9, 16, 25]
```

With objects:

```javascript
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 }
];

const names = users.map(user => user.name);
console.log(names);  // ["Alice", "Bob"]

const formatted = users.map(user => `${user.name} (${user.age})`);
console.log(formatted);  // ["Alice (25)", "Bob (30)"]
```

## filter() - Select Elements

Create a new array with elements that pass a test:

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evens = numbers.filter(n => n % 2 === 0);
console.log(evens);  // [2, 4, 6, 8, 10]

const greaterThan5 = numbers.filter(n => n > 5);
console.log(greaterThan5);  // [6, 7, 8, 9, 10]
```

With objects:

```javascript
const users = [
    { name: "Alice", age: 25, active: true },
    { name: "Bob", age: 30, active: false },
    { name: "Carol", age: 28, active: true }
];

const activeUsers = users.filter(user => user.active);
console.log(activeUsers.length);  // 2

const adults = users.filter(user => user.age >= 18);
```

## reduce() - Accumulate Values

Reduce an array to a single value:

```javascript
const numbers = [1, 2, 3, 4, 5];

// Sum
const sum = numbers.reduce((total, n) => total + n, 0);
console.log(sum);  // 15

// Product
const product = numbers.reduce((result, n) => result * n, 1);
console.log(product);  // 120

// Max
const max = numbers.reduce((max, n) => n > max ? n : max, numbers[0]);
console.log(max);  // 5
```

Building objects:

```javascript
const items = ["apple", "banana", "apple", "cherry", "banana", "apple"];

const counts = items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
}, {});

console.log(counts);  // { apple: 3, banana: 2, cherry: 1 }
```

## find() - First Match

Find the first element that passes a test:

```javascript
const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Carol" }
];

const user = users.find(u => u.id === 2);
console.log(user);  // { id: 2, name: "Bob" }

const notFound = users.find(u => u.id === 99);
console.log(notFound);  // undefined
```

## findIndex() - First Match Index

Get the index of the first matching element:

```javascript
const numbers = [10, 20, 30, 40, 50];

const index = numbers.findIndex(n => n > 25);
console.log(index);  // 2 (value 30)

const notFound = numbers.findIndex(n => n > 100);
console.log(notFound);  // -1
```

## some() - Any Match

Check if at least one element passes:

```javascript
const numbers = [1, 2, 3, 4, 5];

const hasEven = numbers.some(n => n % 2 === 0);
console.log(hasEven);  // true

const hasNegative = numbers.some(n => n < 0);
console.log(hasNegative);  // false
```

## every() - All Match

Check if all elements pass:

```javascript
const numbers = [2, 4, 6, 8, 10];

const allEven = numbers.every(n => n % 2 === 0);
console.log(allEven);  // true

const allPositive = numbers.every(n => n > 0);
console.log(allPositive);  // true

const allLarge = numbers.every(n => n > 5);
console.log(allLarge);  // false
```

## includes() - Contains Value

Check if array contains a value:

```javascript
const fruits = ["apple", "banana", "cherry"];

console.log(fruits.includes("banana"));  // true
console.log(fruits.includes("grape"));   // false

// With start index
console.log(fruits.includes("apple", 1)); // false (starts at index 1)
```

## flat() - Flatten Arrays

Flatten nested arrays:

```javascript
const nested = [1, [2, 3], [4, [5, 6]]];

console.log(nested.flat());     // [1, 2, 3, 4, [5, 6]]
console.log(nested.flat(2));    // [1, 2, 3, 4, 5, 6]
console.log(nested.flat(Infinity));  // Flatten all levels
```

## flatMap() - Map and Flatten

Map and flatten in one step:

```javascript
const sentences = ["Hello world", "How are you"];

const words = sentences.flatMap(s => s.split(" "));
console.log(words);  // ["Hello", "world", "How", "are", "you"]

// Equivalent to
const words2 = sentences.map(s => s.split(" ")).flat();
```

## Chaining Methods

Combine multiple operations:

```javascript
const users = [
    { name: "Alice", age: 25, score: 85 },
    { name: "Bob", age: 30, score: 92 },
    { name: "Carol", age: 28, score: 78 },
    { name: "Dave", age: 35, score: 95 }
];

// Get names of users with score > 80, sorted by score
const topScorers = users
    .filter(user => user.score > 80)
    .sort((a, b) => b.score - a.score)
    .map(user => user.name);

console.log(topScorers);  // ["Dave", "Bob", "Alice"]
```

Complex data processing:

```javascript
const orders = [
    { product: "Widget", qty: 2, price: 10 },
    { product: "Gadget", qty: 1, price: 25 },
    { product: "Widget", qty: 3, price: 10 },
    { product: "Gizmo", qty: 2, price: 15 }
];

const summary = orders
    .filter(order => order.price >= 10)
    .map(order => ({
        ...order,
        total: order.qty * order.price
    }))
    .reduce((acc, order) => {
        acc.totalRevenue += order.total;
        acc.totalItems += order.qty;
        return acc;
    }, { totalRevenue: 0, totalItems: 0 });

console.log(summary);  // { totalRevenue: 105, totalItems: 8 }
```

## forEach() - Side Effects

Execute a function for each element (no return value):

```javascript
const numbers = [1, 2, 3];

numbers.forEach((n, index) => {
    console.log(`Index ${index}: ${n}`);
});
// Index 0: 1
// Index 1: 2
// Index 2: 3
```

Note: Use `map` when transforming, `forEach` for side effects only.

## sort() - With Compare Function

Sort with custom logic:

```javascript
const numbers = [10, 5, 8, 1, 7];

// Ascending
numbers.sort((a, b) => a - b);
console.log(numbers);  // [1, 5, 7, 8, 10]

// Descending
numbers.sort((a, b) => b - a);
console.log(numbers);  // [10, 8, 7, 5, 1]

// Objects by property
const users = [
    { name: "Carol", age: 28 },
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 }
];

users.sort((a, b) => a.age - b.age);
// Sorted by age ascending
```

**Warning:** `sort()` mutates the original array. Use `[...arr].sort()` for immutable sorting.

## Practical Example: Data Pipeline

```javascript
const transactions = [
    { id: 1, type: "sale", amount: 100, date: "2024-01-15" },
    { id: 2, type: "refund", amount: -25, date: "2024-01-16" },
    { id: 3, type: "sale", amount: 75, date: "2024-01-16" },
    { id: 4, type: "sale", amount: 200, date: "2024-01-17" },
    { id: 5, type: "refund", amount: -50, date: "2024-01-17" }
];

// Calculate daily sales totals (excluding refunds)
const dailySales = transactions
    .filter(t => t.type === "sale")
    .reduce((acc, t) => {
        acc[t.date] = (acc[t.date] || 0) + t.amount;
        return acc;
    }, {});

console.log(dailySales);
// { "2024-01-15": 100, "2024-01-16": 75, "2024-01-17": 200 }

// Find best day
const bestDay = Object.entries(dailySales)
    .sort(([, a], [, b]) => b - a)[0];

console.log(`Best day: ${bestDay[0]} with $${bestDay[1]}`);
// Best day: 2024-01-17 with $200
```

## Key Takeaways

1. `map()` transforms each element - returns new array
2. `filter()` selects elements - returns new array
3. `reduce()` accumulates to single value
4. `find()` returns first match, `findIndex()` returns its index
5. `some()` checks if any match, `every()` checks if all match
6. Chain methods for complex transformations
7. Prefer `map`/`filter`/`reduce` over `forEach` for data transformation
8. Most methods don't mutate - `sort()` does!

Congratulations! You've learned modern JavaScript patterns for cleaner, more functional code.
