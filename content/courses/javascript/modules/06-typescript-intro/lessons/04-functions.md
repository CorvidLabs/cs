---
title: Functions in TypeScript
order: 4
estimatedMinutes: 14
---

# Functions in TypeScript

TypeScript enhances JavaScript functions with type safety for parameters, return values, and function signatures. Understanding function types is essential for writing robust TypeScript code.

## Parameter Type Annotations

Add types after parameter names:

```typescript
function greet(name: string) {
    console.log(`Hello, ${name}!`);
}

function add(a: number, b: number) {
    return a + b;
}

greet("Alice");      // OK
// greet(42);        // Error: Argument of type 'number' is not assignable to parameter of type 'string'

add(2, 3);           // OK
// add("2", "3");    // Error
```

## Return Type Annotations

Specify return types after the parameter list:

```typescript
function multiply(a: number, b: number): number {
    return a * b;
}

function getMessage(): string {
    return "Hello, World!";
}

function processData(data: string[]): boolean {
    // Process and return success status
    return data.length > 0;
}
```

### When Return Types Are Inferred

```typescript
// Return type inferred as number
function square(x: number) {
    return x * x;
}

// Return type inferred as string
function format(value: number) {
    return `Value: ${value}`;
}
```

### When to Annotate Return Types

1. **Public APIs** - For clarity and documentation
2. **Complex functions** - Multiple return paths
3. **Recursive functions** - Helps TypeScript analyze

```typescript
// Good practice for public functions
function fetchUser(id: number): Promise<User> {
    return fetch(`/api/users/${id}`).then(r => r.json());
}
```

## Optional Parameters

Use `?` for optional parameters:

```typescript
function greet(name: string, greeting?: string) {
    const msg = greeting ?? "Hello";
    console.log(`${msg}, ${name}!`);
}

greet("Alice");           // "Hello, Alice!"
greet("Bob", "Hi");       // "Hi, Bob!"
```

## Default Parameters

Default values also make parameters optional:

```typescript
function greet(name: string, greeting: string = "Hello") {
    console.log(`${greeting}, ${name}!`);
}

greet("Alice");           // "Hello, Alice!"
greet("Bob", "Hi");       // "Hi, Bob!"

function createUser(name: string, role: string = "user", active: boolean = true) {
    return { name, role, active };
}
```

## Rest Parameters

Type rest parameters as arrays:

```typescript
function sum(...numbers: number[]): number {
    return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2);              // 3
sum(1, 2, 3, 4, 5);     // 15

function joinStrings(separator: string, ...strings: string[]): string {
    return strings.join(separator);
}

joinStrings(", ", "a", "b", "c");  // "a, b, c"
```

## Arrow Functions

Type annotations work the same way:

```typescript
// With type annotations
const add = (a: number, b: number): number => {
    return a + b;
};

// Concise syntax (return type inferred)
const multiply = (a: number, b: number) => a * b;

// No parameters
const getTimestamp = (): number => Date.now();
```

## Function Type Expressions

Define function types separately:

```typescript
// Function type
type MathOperation = (a: number, b: number) => number;

// Using the type
const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;

// As parameter type
function calculate(
    a: number,
    b: number,
    operation: MathOperation
): number {
    return operation(a, b);
}

calculate(10, 5, add);       // 15
calculate(10, 5, subtract);  // 5
```

## Call Signatures

Define function types in object types:

```typescript
interface Calculator {
    (a: number, b: number): number;
    description: string;
}

const add: Calculator = (a, b) => a + b;
add.description = "Adds two numbers";

console.log(add(2, 3));        // 5
console.log(add.description);  // "Adds two numbers"
```

## Overloads

Multiple function signatures for different parameter types:

```typescript
// Overload signatures
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;

// Implementation signature
function makeDate(yearOrTimestamp: number, month?: number, day?: number): Date {
    if (month !== undefined && day !== undefined) {
        return new Date(yearOrTimestamp, month - 1, day);
    }
    return new Date(yearOrTimestamp);
}

// Usage - TypeScript knows valid call patterns
const d1 = makeDate(1234567890000);     // From timestamp
const d2 = makeDate(2024, 6, 15);       // From year, month, day
// const d3 = makeDate(2024, 6);        // Error: No overload matches
```

## Generic Functions

Functions that work with multiple types:

```typescript
function identity<T>(value: T): T {
    return value;
}

// Type parameter inferred
const num = identity(42);        // T is number
const str = identity("hello");   // T is string

// Explicit type parameter
const explicit = identity<boolean>(true);
```

### Multiple Type Parameters

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

const p1 = pair("hello", 42);      // [string, number]
const p2 = pair(true, [1, 2, 3]);  // [boolean, number[]]
```

### Constrained Generics

```typescript
function getLength<T extends { length: number }>(item: T): number {
    return item.length;
}

getLength("hello");      // 5
getLength([1, 2, 3]);    // 3
// getLength(42);        // Error: number doesn't have length
```

## void and never Return Types

### void - No Return Value

```typescript
function logMessage(msg: string): void {
    console.log(msg);
    // No return, or return; with no value
}

// Arrow function version
const log: (msg: string) => void = (msg) => {
    console.log(msg);
};
```

### never - Function Never Returns

```typescript
function throwError(message: string): never {
    throw new Error(message);
}

function infiniteLoop(): never {
    while (true) {
        // Never exits
    }
}
```

## this Parameter

Explicitly type `this` in functions:

```typescript
interface Button {
    label: string;
    click(this: Button): void;
}

const button: Button = {
    label: "Submit",
    click() {
        console.log(`Clicked: ${this.label}`);
    }
};

button.click();  // "Clicked: Submit"
```

## Callback Functions

Type callback parameters:

```typescript
function processItems(
    items: string[],
    callback: (item: string, index: number) => void
): void {
    items.forEach((item, index) => callback(item, index));
}

processItems(["a", "b", "c"], (item, index) => {
    console.log(`${index}: ${item}`);
});
```

## Practical Examples

### Event Handler

```typescript
type ClickHandler = (event: MouseEvent) => void;

function setupButton(button: HTMLButtonElement, onClick: ClickHandler): void {
    button.addEventListener("click", onClick);
}
```

### API Function

```typescript
interface User {
    id: number;
    name: string;
}

async function fetchUser(id: number): Promise<User | null> {
    try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) return null;
        return response.json();
    } catch {
        return null;
    }
}
```

## Key Takeaways

1. Annotate parameter types after parameter names
2. Return types come after the parameter list
3. Use `?` for optional parameters, `= value` for defaults
4. Rest parameters are typed as arrays
5. Function types: `(params) => returnType`
6. Use generics for reusable functions with multiple types
7. `void` for no return, `never` for functions that don't return
8. Overloads handle multiple valid call signatures

You now have a solid foundation in TypeScript! The exercises will help you practice these concepts.
