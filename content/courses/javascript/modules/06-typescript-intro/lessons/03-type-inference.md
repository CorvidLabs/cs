---
title: Type Inference
order: 3
estimatedMinutes: 14
---

# Type Inference: TypeScript's Smart Typing

TypeScript can automatically determine types from context. Understanding when to rely on inference and when to add explicit annotations makes your code cleaner.

## Basic Inference

TypeScript infers types from initialization:

```typescript
// TypeScript infers these types automatically
let name = "Alice";        // string
let age = 25;              // number
let isActive = true;       // boolean
let items = [1, 2, 3];     // number[]

// Hover over variables in your IDE to see inferred types
// No need to write: let name: string = "Alice";

// Type is locked in
name = 42; // Error: Type 'number' is not assignable to type 'string'
```

## When to Add Annotations

### 1. Uninitialized Variables

```typescript
// TypeScript can't infer without a value
let name;           // any (implicit)
let name: string;   // Annotate to get proper typing

name = "Alice";     // OK with annotation
name = 42;          // Error with annotation
```

### 2. Function Parameters

```typescript
// Parameters need annotations
function greet(name: string, age: number): string {
    return `Hello, ${name}! You are ${age} years old.`;
}

// Without annotations, parameters are implicitly 'any'
function badGreet(name, age) { // Error in strict mode
    return `Hello, ${name}!`;
}
```

### 3. Complex Object Literals

```typescript
// Inference works but explicit types are clearer
interface User {
    id: number;
    name: string;
    email: string;
}

// Explicit: catches errors at declaration
const user: User = {
    id: 1,
    name: "Alice",
    email: "alice@example.com"
};

// Inferred: catches errors at usage
const user2 = {
    id: 1,
    name: "Alice",
    emial: "alice@example.com"  // Typo not caught until used as User
};
```

## Return Type Inference

```typescript
// Return type inferred from return statements
function add(a: number, b: number) {
    return a + b;  // TypeScript infers return type is number
}

// Multiple return paths
function process(value: string | number) {
    if (typeof value === "string") {
        return value.toUpperCase();  // string
    }
    return value * 2;                 // number
}
// Inferred return type: string | number

// Explicit return types document intent
function fetchUser(id: number): Promise<User> {
    return fetch(`/api/users/${id}`).then(r => r.json());
}
```

## Array Inference

```typescript
// Empty arrays are any[]
const empty = [];     // any[]
empty.push(1);
empty.push("two");    // Mixed types OK

// Annotate for proper typing
const numbers: number[] = [];
numbers.push(1);
numbers.push("two");  // Error!

// Arrays with values are inferred
const mixed = [1, "two", true];  // (string | number | boolean)[]
```

## Contextual Typing

TypeScript uses context to infer types:

```typescript
// Event handlers
document.addEventListener("click", (event) => {
    // TypeScript knows event is MouseEvent
    console.log(event.clientX, event.clientY);
});

// Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => {
    // TypeScript knows n is number
    return n * 2;
});

// Callback parameters
interface Button {
    onClick: (event: { x: number; y: number }) => void;
}

const button: Button = {
    onClick: (event) => {
        // event.x and event.y are known to be numbers
        console.log(event.x, event.y);
    }
};
```

## const vs let

```typescript
// let infers wider types
let status = "pending";  // string (any string value allowed)
status = "complete";     // OK

// const infers literal types
const status2 = "pending";  // "pending" (exact value)
// status2 = "complete";    // Error: can't reassign const

// This matters for objects
const config = {
    apiUrl: "https://api.example.com",
    timeout: 5000
};
// config.apiUrl is string, not "https://api.example.com"

// Use 'as const' for literal inference
const config2 = {
    apiUrl: "https://api.example.com",
    timeout: 5000
} as const;
// config2.apiUrl is "https://api.example.com"
// config2 is readonly
```

## as const Assertion

Create deeply readonly literal types:

```typescript
// Without as const
const routes = {
    home: "/",
    about: "/about",
    users: "/users"
};
// typeof routes = { home: string, about: string, users: string }

// With as const
const routes2 = {
    home: "/",
    about: "/about",
    users: "/users"
} as const;
// typeof routes2 = { readonly home: "/", readonly about: "/about", readonly users: "/users" }

// Useful for fixed values
const DIRECTIONS = ["north", "south", "east", "west"] as const;
type Direction = typeof DIRECTIONS[number];  // "north" | "south" | "east" | "west"
```

## Type Widening and Narrowing

### Widening

TypeScript widens types in certain contexts:

```typescript
let x = 10;        // number (widened from 10)
const y = 10;      // 10 (literal, not widened)

function getStatus() {
    return "pending";  // Return type is string, not "pending"
}

// Prevent widening
function getStatus2(): "pending" | "complete" {
    return "pending";  // Return type is the union
}
```

### Narrowing

TypeScript narrows types based on control flow:

```typescript
function process(value: string | number) {
    if (typeof value === "string") {
        // value is string here
        console.log(value.toUpperCase());
    } else {
        // value is number here
        console.log(value.toFixed(2));
    }
}

function processUser(user: User | null) {
    if (user === null) {
        return;
    }
    // user is User here (not null)
    console.log(user.name);
}
```

## Generic Inference

TypeScript infers generic type parameters:

```typescript
function identity<T>(value: T): T {
    return value;
}

// Type inferred from argument
const str = identity("hello");  // identity<string>("hello")
const num = identity(42);       // identity<number>(42)

// Array.map infers types
const numbers = [1, 2, 3];
const strings = numbers.map(n => String(n));  // string[]
```

## Best Practices

### Rely on Inference

```typescript
// Don't over-annotate
const name: string = "Alice";           // Redundant
const name = "Alice";                   // Better

const numbers: number[] = [1, 2, 3];    // Redundant
const numbers = [1, 2, 3];              // Better
```

### Annotate When Helpful

```typescript
// Document function contracts
function calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
}

// Define empty collections
const users: User[] = [];

// API response types
const response: ApiResponse<User> = await fetchUser(1);
```

## Key Takeaways

1. TypeScript infers types from initialization values
2. Annotate uninitialized variables and function parameters
3. Return types are usually inferred correctly
4. Use contextual typing for callbacks and event handlers
5. `const` gives literal types; `let` gives wider types
6. `as const` creates deeply readonly literal types
7. Rely on inference for clear cases; annotate for documentation

Next, we'll learn about union types - combining multiple types into one.
