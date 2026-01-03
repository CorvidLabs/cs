---
title: Generics
order: 1
estimatedMinutes: 18
---

# Generics in TypeScript

Generics enable you to write reusable, type-safe code that works with multiple types. Instead of using `any` or writing duplicate functions, generics let you preserve type information while maintaining flexibility.

## Why Generics?

Without generics, you might write:

```typescript
// Using any - loses type safety
function identity(value: any): any {
    return value;
}

const result = identity("hello");
// result is 'any', not 'string'
result.toUppercase();  // No error, but crashes at runtime!

// Or duplicate functions
function identityString(value: string): string {
    return value;
}

function identityNumber(value: number): number {
    return value;
}
```

## Generic Functions

Use angle brackets to define type parameters:

```typescript
function identity<T>(value: T): T {
    return value;
}

// Type is inferred from argument
const str = identity("hello");  // str: string
const num = identity(42);       // num: number

// Explicit type parameter
const explicit = identity<boolean>(true);

// Full type safety preserved
str.toUpperCase();  // OK
num.toFixed(2);     // OK
```

## Naming Conventions

Use descriptive names for type parameters:

```typescript
// Good - descriptive names
function transform<Input, Output>(
    value: Input,
    transformer: (input: Input) => Output
): Output {
    return transformer(value);
}

// Common conventions (but less descriptive)
// T - Type
// K - Key
// V - Value
// E - Element
```

## Multiple Type Parameters

Functions can have multiple type parameters:

```typescript
function pair<First, Second>(first: First, second: Second): [First, Second] {
    return [first, second];
}

const result = pair("hello", 42);  // [string, number]
const coords = pair(10, 20);       // [number, number]

function map<Input, Output>(
    items: Input[],
    transform: (item: Input) => Output
): Output[] {
    return items.map(transform);
}

const numbers = [1, 2, 3];
const strings = map(numbers, n => n.toString());  // string[]
```

## Generic Constraints

Use `extends` to limit what types can be used:

```typescript
// Must have a length property
function logLength<T extends { length: number }>(item: T): void {
    console.log(`Length: ${item.length}`);
}

logLength("hello");      // OK - string has length
logLength([1, 2, 3]);    // OK - array has length
// logLength(42);        // Error - number has no length

// Constrain to specific types
function merge<T extends object, U extends object>(a: T, b: U): T & U {
    return { ...a, ...b };
}

const merged = merge({ name: "Alice" }, { age: 25 });
// { name: string; age: number }
```

### keyof Constraint

Access keys of another type parameter:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const person = { name: "Alice", age: 25 };

const name = getProperty(person, "name");  // string
const age = getProperty(person, "age");    // number
// getProperty(person, "email");           // Error: 'email' not in keyof person
```

## Generic Interfaces

```typescript
interface Container<T> {
    value: T;
    getValue(): T;
    setValue(value: T): void;
}

class Box<T> implements Container<T> {
    constructor(public value: T) {}

    getValue(): T {
        return this.value;
    }

    setValue(value: T): void {
        this.value = value;
    }
}

const stringBox = new Box("hello");  // Box<string>
const numberBox = new Box(42);       // Box<number>
```

## Generic Type Aliases

```typescript
type Result<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
};

function fetchData<T>(url: string): Promise<Result<T>> {
    // Implementation
    return fetch(url)
        .then(r => r.json())
        .then(data => ({ success: true, data }))
        .catch(error => ({ success: false, error: error.message }));
}

// Usage
interface User {
    id: number;
    name: string;
}

const result = await fetchData<User>("/api/user/1");
if (result.success) {
    console.log(result.data.name);  // TypeScript knows data is User
}
```

## Generic Classes

```typescript
class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
const top = numberStack.pop();  // number | undefined

const stringStack = new Stack<string>();
stringStack.push("hello");
```

## Default Type Parameters

Provide defaults for type parameters:

```typescript
interface ApiResponse<T = unknown> {
    data: T;
    status: number;
    timestamp: Date;
}

// Uses default (unknown)
const response1: ApiResponse = {
    data: { anything: "goes" },
    status: 200,
    timestamp: new Date()
};

// Explicit type
const response2: ApiResponse<User> = {
    data: { id: 1, name: "Alice" },
    status: 200,
    timestamp: new Date()
};
```

## Generic Functions with Arrow Syntax

```typescript
// Arrow function generics
const identity = <T>(value: T): T => value;

// In TSX files, use trailing comma to avoid JSX confusion
const identity2 = <T,>(value: T): T => value;

// Or use extends
const identity3 = <T extends unknown>(value: T): T => value;

// Multiple type parameters
const pair = <A, B>(a: A, b: B): [A, B] => [a, b];
```

## Conditional Types with Generics

```typescript
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type StringArrayElement = ArrayElement<string[]>;  // string
type NumberArrayElement = ArrayElement<number[]>;  // number
type NotArray = ArrayElement<string>;              // never

// Practical example
type Awaited<T> = T extends Promise<infer U> ? U : T;

type ResolvedString = Awaited<Promise<string>>;  // string
type AlreadyNumber = Awaited<number>;            // number
```

## Practical Examples

### Generic Data Fetcher

```typescript
async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
}

interface User {
    id: number;
    name: string;
}

const user = await fetchJson<User>("/api/users/1");
console.log(user.name);  // TypeScript knows this is string
```

### Generic Cache

```typescript
class Cache<K, V> {
    private store = new Map<K, V>();

    set(key: K, value: V): void {
        this.store.set(key, value);
    }

    get(key: K): V | undefined {
        return this.store.get(key);
    }

    has(key: K): boolean {
        return this.store.has(key);
    }
}

const userCache = new Cache<number, User>();
userCache.set(1, { id: 1, name: "Alice" });
const user = userCache.get(1);  // User | undefined
```

## Key Takeaways

1. Generics preserve type information while enabling code reuse
2. Use descriptive names for type parameters (`Input`, `Output`, `Key`, `Value`)
3. Constraints (`extends`) limit what types can be used
4. `keyof` enables type-safe property access
5. Default type parameters provide fallback types
6. Generics work with functions, interfaces, classes, and type aliases

In the next lesson, we'll explore TypeScript's built-in utility types.
