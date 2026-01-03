---
title: Basic Types
order: 1
estimatedMinutes: 18
---

# Basic Types: Type Safety in JavaScript

TypeScript adds static type checking to JavaScript. By declaring types, you catch errors at compile time rather than runtime, making your code more reliable.

## What is TypeScript?

TypeScript is a superset of JavaScript that adds:
- Static type checking
- Enhanced IDE support (autocomplete, refactoring)
- Compile-time error detection
- Better documentation through types

TypeScript compiles to plain JavaScript that runs anywhere.

## Primitive Types

### String, Number, Boolean

```typescript
// Type annotations use : Type
let name: string = "Alice";
let age: number = 25;
let isActive: boolean = true;

// TypeScript catches type errors
name = 42;        // Error: Type 'number' is not assignable to type 'string'
age = "twenty";   // Error: Type 'string' is not assignable to type 'number'
isActive = "yes"; // Error: Type 'string' is not assignable to type 'boolean'
```

### Number Types

```typescript
// All numbers are 'number' type (no int/float distinction)
let integer: number = 42;
let float: number = 3.14;
let hex: number = 0xff;
let binary: number = 0b1010;
let octal: number = 0o744;
let bigInt: bigint = 100n;  // BigInt is a separate type
```

### Null and Undefined

```typescript
let nothing: null = null;
let notDefined: undefined = undefined;

// With strictNullChecks (recommended), these are distinct types
let name: string = null;      // Error in strict mode
let age: number = undefined;  // Error in strict mode

// Use union types to allow null/undefined
let optionalName: string | null = null;
let maybeAge: number | undefined = undefined;
```

## Arrays

```typescript
// Two ways to declare array types
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: Array<string> = ["a", "b", "c"];

// Mixed arrays with union types
let mixed: (string | number)[] = [1, "two", 3, "four"];

// TypeScript enforces element types
numbers.push("five"); // Error: Argument of type 'string' is not assignable
```

## Tuples

Fixed-length arrays with known types at each position:

```typescript
// Tuple: exactly 2 elements, string then number
let person: [string, number] = ["Alice", 25];

// Access with correct types
const name: string = person[0];  // "Alice"
const age: number = person[1];   // 25

// Errors
person = ["Bob"];              // Error: Missing element
person = [25, "Alice"];        // Error: Wrong order
person[2] = "extra";           // Error: Index out of bounds
```

## Objects

### Basic Object Types

```typescript
// Inline object type
let user: { name: string; age: number } = {
    name: "Alice",
    age: 25
};

// Optional properties with ?
let config: { debug?: boolean; timeout: number } = {
    timeout: 5000
    // debug is optional
};

// Readonly properties
let point: { readonly x: number; readonly y: number } = { x: 10, y: 20 };
point.x = 30; // Error: Cannot assign to 'x' because it is a read-only property
```

### The object Type

```typescript
// 'object' type = any non-primitive
let obj: object = { name: "Alice" };
let arr: object = [1, 2, 3];
let fn: object = () => {};

// But not primitives
obj = "string"; // Error
obj = 42;       // Error
```

## Any and Unknown

### any - Escape Hatch

```typescript
// any disables type checking
let value: any = 4;
value = "hello";
value = true;
value.foo.bar.baz(); // No error, but might crash at runtime!

// Avoid any when possible - defeats the purpose of TypeScript
```

### unknown - Safe Any

```typescript
// unknown is a type-safe alternative to any
let value: unknown = 4;
value = "hello";
value = true;

// Must narrow the type before using
value.toUpperCase();        // Error: Object is of type 'unknown'

if (typeof value === "string") {
    value.toUpperCase();    // OK - TypeScript knows it's a string
}
```

## Void and Never

### void - No Return Value

```typescript
function logMessage(message: string): void {
    console.log(message);
    // No return statement needed
}

// Variables of type void are not useful
let unusable: void = undefined;
```

### never - Never Returns

```typescript
// Function that never returns (throws or infinite loop)
function throwError(message: string): never {
    throw new Error(message);
}

function infiniteLoop(): never {
    while (true) {
        // ...
    }
}

// Useful in exhaustive checks
type Status = "pending" | "success" | "error";

function handleStatus(status: Status): string {
    switch (status) {
        case "pending": return "Waiting...";
        case "success": return "Done!";
        case "error": return "Failed!";
        default:
            // If we add a new status and forget to handle it,
            // TypeScript will error here
            const _exhaustive: never = status;
            return _exhaustive;
    }
}
```

## Functions

### Function Parameters and Return Types

```typescript
// Parameter types and return type
function add(a: number, b: number): number {
    return a + b;
}

// Optional parameters
function greet(name: string, greeting?: string): string {
    return `${greeting || "Hello"}, ${name}!`;
}

// Default parameters
function greet2(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}!`;
}

// Rest parameters
function sum(...numbers: number[]): number {
    return numbers.reduce((acc, n) => acc + n, 0);
}
```

### Function Type Expressions

```typescript
// Define a function type
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

// Function as parameter
function calculate(a: number, b: number, operation: MathOperation): number {
    return operation(a, b);
}

calculate(5, 3, add);      // 8
calculate(5, 3, multiply); // 15
```

## Type Assertions

Tell TypeScript to treat a value as a specific type:

```typescript
// Angle bracket syntax
let value: unknown = "hello";
let length: number = (<string>value).length;

// as syntax (preferred, required in JSX)
let length2: number = (value as string).length;

// DOM example
const input = document.querySelector("#email") as HTMLInputElement;
input.value = "user@example.com";

// Be careful - assertions override TypeScript's inference
const num = "not a number" as unknown as number; // Compiles but wrong!
```

## Literal Types

```typescript
// Literal types are exact values
let direction: "north" | "south" | "east" | "west";
direction = "north"; // OK
direction = "up";    // Error

// Numeric literals
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6;
diceRoll = 3; // OK
diceRoll = 7; // Error

// Boolean literals
let success: true = true;
success = false; // Error
```

## Key Takeaways

1. TypeScript adds static types to JavaScript
2. Use `: Type` syntax for type annotations
3. Primitive types: `string`, `number`, `boolean`, `null`, `undefined`
4. Arrays: `number[]` or `Array<number>`
5. Tuples: `[string, number]` for fixed-length, typed arrays
6. Avoid `any` - use `unknown` for truly unknown types
7. `void` for no return, `never` for functions that don't return
8. Type assertions (`as Type`) override TypeScript's inference

Next, we'll learn about interfaces - reusable type definitions for objects.
