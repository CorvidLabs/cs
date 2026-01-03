---
title: Arrays
order: 1
estimatedMinutes: 20
---

# Arrays: Ordered Collections

Arrays store ordered lists of values. They're one of the most commonly used data structures in JavaScript.

## Creating Arrays

```javascript
// Array literal (preferred)
const numbers = [1, 2, 3, 4, 5];
const fruits = ["apple", "banana", "cherry"];
const mixed = [1, "hello", true, null];

// Empty array
const empty = [];

// Array constructor (less common)
const arr = new Array(3);  // Creates array with 3 empty slots
console.log(arr.length);   // 3
```

## Accessing Elements

Arrays are zero-indexed - the first element is at index 0:

```javascript
const colors = ["red", "green", "blue"];

console.log(colors[0]);  // "red"
console.log(colors[1]);  // "green"
console.log(colors[2]);  // "blue"
console.log(colors[3]);  // undefined (out of bounds)

// Negative indices don't work like Python
console.log(colors[-1]); // undefined

// Use at() for negative indexing
console.log(colors.at(-1));  // "blue" (last element)
console.log(colors.at(-2));  // "green"
```

## Array Length

```javascript
const items = ["a", "b", "c", "d"];
console.log(items.length);  // 4

// Access last element
console.log(items[items.length - 1]);  // "d"
// Or use at()
console.log(items.at(-1));  // "d"
```

## Modifying Arrays

### Adding Elements

```javascript
const arr = [1, 2, 3];

// Add to end
arr.push(4);
console.log(arr);  // [1, 2, 3, 4]

// Add to beginning
arr.unshift(0);
console.log(arr);  // [0, 1, 2, 3, 4]

// Add at specific index
arr.splice(2, 0, 1.5);  // At index 2, remove 0, insert 1.5
console.log(arr);  // [0, 1, 1.5, 2, 3, 4]
```

### Removing Elements

```javascript
const arr = [1, 2, 3, 4, 5];

// Remove from end
const last = arr.pop();
console.log(last);  // 5
console.log(arr);   // [1, 2, 3, 4]

// Remove from beginning
const first = arr.shift();
console.log(first); // 1
console.log(arr);   // [2, 3, 4]

// Remove at specific index
arr.splice(1, 1);  // At index 1, remove 1 element
console.log(arr);  // [2, 4]
```

### Updating Elements

```javascript
const arr = ["a", "b", "c"];
arr[1] = "B";
console.log(arr);  // ["a", "B", "c"]
```

## Iterating Over Arrays

### for...of Loop (Preferred)

```javascript
const fruits = ["apple", "banana", "cherry"];

for (const fruit of fruits) {
    console.log(fruit);
}
// apple
// banana
// cherry
```

### forEach Method

```javascript
const numbers = [1, 2, 3];

numbers.forEach((num, index) => {
    console.log(`Index ${index}: ${num}`);
});
// Index 0: 1
// Index 1: 2
// Index 2: 3
```

### Traditional for Loop

```javascript
const arr = [10, 20, 30];

for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
```

## Array Transformation Methods

These methods don't modify the original array - they return a new one.

### map - Transform Each Element

```javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
console.log(doubled);  // [2, 4, 6, 8]
console.log(numbers);  // [1, 2, 3, 4] (unchanged)

const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 }
];
const names = users.map(user => user.name);
console.log(names);  // ["Alice", "Bob"]
```

### filter - Keep Elements That Pass a Test

```javascript
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens);  // [2, 4, 6]

const users = [
    { name: "Alice", active: true },
    { name: "Bob", active: false },
    { name: "Charlie", active: true }
];
const activeUsers = users.filter(user => user.active);
console.log(activeUsers);  // [{ name: "Alice", active: true }, { name: "Charlie", active: true }]
```

### reduce - Accumulate to a Single Value

```javascript
const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum);  // 15

// Find maximum
const max = numbers.reduce((acc, n) => n > acc ? n : acc, numbers[0]);
console.log(max);  // 5

// Count occurrences
const fruits = ["apple", "banana", "apple", "cherry", "banana", "apple"];
const counts = fruits.reduce((acc, fruit) => {
    acc[fruit] = (acc[fruit] || 0) + 1;
    return acc;
}, {});
console.log(counts);  // { apple: 3, banana: 2, cherry: 1 }
```

## Searching Arrays

```javascript
const fruits = ["apple", "banana", "cherry", "banana"];

// Check if element exists
console.log(fruits.includes("banana"));  // true
console.log(fruits.includes("grape"));   // false

// Find index of element
console.log(fruits.indexOf("banana"));     // 1 (first occurrence)
console.log(fruits.lastIndexOf("banana")); // 3 (last occurrence)
console.log(fruits.indexOf("grape"));      // -1 (not found)

// Find element matching condition
const numbers = [1, 5, 10, 15, 20];
const found = numbers.find(n => n > 8);
console.log(found);  // 10 (first match)

// Find index matching condition
const foundIndex = numbers.findIndex(n => n > 8);
console.log(foundIndex);  // 2

// Check if any/all elements match
console.log(numbers.some(n => n > 15));   // true (at least one)
console.log(numbers.every(n => n > 0));   // true (all match)
```

## Sorting Arrays

```javascript
// Sort modifies the original array!
const fruits = ["cherry", "apple", "banana"];
fruits.sort();
console.log(fruits);  // ["apple", "banana", "cherry"]

// Numbers need a compare function
const numbers = [10, 5, 40, 25, 100];
numbers.sort();  // Wrong!
console.log(numbers);  // [10, 100, 25, 40, 5] (string comparison)

numbers.sort((a, b) => a - b);  // Correct: ascending
console.log(numbers);  // [5, 10, 25, 40, 100]

numbers.sort((a, b) => b - a);  // Descending
console.log(numbers);  // [100, 40, 25, 10, 5]

// To avoid mutating, copy first
const original = [3, 1, 2];
const sorted = [...original].sort((a, b) => a - b);
console.log(original);  // [3, 1, 2]
console.log(sorted);    // [1, 2, 3]
```

## Combining Arrays

```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];

// concat
const combined = arr1.concat(arr2);
console.log(combined);  // [1, 2, 3, 4]

// spread operator (preferred)
const combined2 = [...arr1, ...arr2];
console.log(combined2);  // [1, 2, 3, 4]

// join into string
const words = ["Hello", "World"];
console.log(words.join(" "));  // "Hello World"
console.log(words.join("-"));  // "Hello-World"
```

## Key Takeaways

1. Arrays are zero-indexed ordered collections
2. Use `push`/`pop` for end, `shift`/`unshift` for beginning
3. `map`, `filter`, and `reduce` are essential transformation methods
4. `find`, `findIndex`, `includes` help search arrays
5. `sort` modifies the original array - copy first if needed
6. Use `for...of` for simple iteration, `forEach` when you need the index
7. Most array methods return new arrays and don't mutate the original

Next, we'll explore objects - JavaScript's key-value data structure.
