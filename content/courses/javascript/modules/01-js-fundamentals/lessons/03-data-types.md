---
title: Data Types
order: 3
estimatedMinutes: 20
---

# JavaScript Data Types

JavaScript has several built-in data types. Understanding these types is essential for writing correct programs. JavaScript is dynamically typed, meaning variables can hold values of any type.

## Primitive Types

Primitives are the most basic data types. They are immutable (cannot be changed) and compared by value.

### String

Text data enclosed in quotes:

```javascript
const firstName = "Alice";
const lastName = 'Smith';
const greeting = `Hello, ${firstName}!`;

console.log(firstName);           // Alice
console.log(greeting);            // Hello, Alice!
console.log(firstName.length);    // 5
console.log(firstName.toUpperCase()); // ALICE
```

### Number

JavaScript has a single number type for both integers and decimals:

```javascript
const age = 25;           // Integer
const price = 19.99;      // Decimal (floating-point)
const negative = -10;     // Negative
const billion = 1e9;      // Scientific notation (1000000000)

console.log(age + 5);     // 30
console.log(price * 2);   // 39.98
```

Special number values:

```javascript
console.log(Infinity);     // Infinity
console.log(-Infinity);    // -Infinity
console.log(NaN);          // NaN (Not a Number)

console.log(1 / 0);        // Infinity
console.log("hello" * 2);  // NaN
```

### BigInt

For integers larger than Number can safely handle:

```javascript
const bigNumber = 9007199254740991n;  // Note the 'n' suffix
const anotherBig = BigInt("9007199254740992");

console.log(bigNumber + 1n);  // 9007199254740992n
```

### Boolean

Logical values representing true or false:

```javascript
const isActive = true;
const isDeleted = false;

console.log(isActive);        // true
console.log(!isActive);       // false (NOT operator)
console.log(isActive && isDeleted);  // false (AND)
console.log(isActive || isDeleted);  // true (OR)
```

### undefined

A variable that has been declared but not assigned a value:

```javascript
let score;
console.log(score);          // undefined
console.log(typeof score);   // "undefined"
```

### null

Intentional absence of a value:

```javascript
let user = null;  // Explicitly "no value"
console.log(user);           // null
console.log(typeof null);    // "object" (a known JavaScript quirk!)
```

### Symbol

Unique identifiers (advanced, used for object properties):

```javascript
const id = Symbol("id");
const anotherId = Symbol("id");

console.log(id === anotherId);  // false (each Symbol is unique)
```

## The typeof Operator

Use `typeof` to check a value's type:

```javascript
console.log(typeof "hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof 42n);         // "bigint"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" (JavaScript bug!)
console.log(typeof Symbol());    // "symbol"
console.log(typeof {});          // "object"
console.log(typeof []);          // "object" (arrays are objects)
console.log(typeof function(){}); // "function"
```

## Type Coercion

JavaScript automatically converts types in certain situations:

### String Coercion

Using `+` with a string converts other values to strings:

```javascript
console.log("5" + 3);      // "53" (number becomes string)
console.log("Hello " + 42); // "Hello 42"
console.log(5 + "");       // "5"
```

### Numeric Coercion

Other operators convert strings to numbers:

```javascript
console.log("5" - 3);      // 2 (string becomes number)
console.log("5" * 2);      // 10
console.log("10" / 2);     // 5
console.log(+"42");        // 42 (unary plus converts to number)
```

### Boolean Coercion (Truthy and Falsy)

In boolean contexts, values are converted:

**Falsy values** (evaluate to `false`):
```javascript
console.log(Boolean(false));     // false
console.log(Boolean(0));         // false
console.log(Boolean(-0));        // false
console.log(Boolean(""));        // false (empty string)
console.log(Boolean(null));      // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN));       // false
```

**Truthy values** (everything else):
```javascript
console.log(Boolean(true));      // true
console.log(Boolean(1));         // true
console.log(Boolean(-1));        // true
console.log(Boolean("hello"));   // true
console.log(Boolean("0"));       // true (non-empty string!)
console.log(Boolean([]));        // true (empty array)
console.log(Boolean({}));        // true (empty object)
```

## Explicit Type Conversion

Convert types explicitly for clarity:

```javascript
// To String
const num = 42;
console.log(String(num));     // "42"
console.log(num.toString());  // "42"

// To Number
const str = "42";
console.log(Number(str));     // 42
console.log(parseInt(str));   // 42 (integer)
console.log(parseFloat("3.14")); // 3.14

// To Boolean
console.log(Boolean(1));      // true
console.log(Boolean(0));      // false
console.log(!!1);             // true (double NOT)
```

## Checking for null and undefined

```javascript
let value = null;

// Check for null
if (value === null) {
    console.log("Value is null");
}

// Check for undefined
let other;
if (other === undefined) {
    console.log("Other is undefined");
}

// Check for either (nullish)
if (value == null) {  // Note: loose equality
    console.log("Value is null or undefined");
}
```

## Objects and Arrays (Preview)

JavaScript also has reference types. We'll cover these in depth later:

```javascript
// Object - key-value pairs
const person = {
    name: "Alice",
    age: 25
};

// Array - ordered list
const colors = ["red", "green", "blue"];

console.log(person.name);   // Alice
console.log(colors[0]);     // red
console.log(typeof person); // "object"
console.log(typeof colors); // "object" (arrays are objects)
console.log(Array.isArray(colors)); // true
```

## Key Takeaways

1. JavaScript has 7 primitive types: string, number, bigint, boolean, undefined, null, symbol
2. Use `typeof` to check a value's type
3. JavaScript automatically converts types (coercion) - be aware of this behavior
4. Falsy values: `false`, `0`, `""`, `null`, `undefined`, `NaN`
5. Use explicit conversion (`Number()`, `String()`, `Boolean()`) for clarity
6. `typeof null` returns `"object"` - this is a known JavaScript bug
7. Arrays and objects are reference types (covered in Module 3)

Next, we'll learn about operators for performing calculations and comparisons.
