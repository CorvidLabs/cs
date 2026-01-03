---
title: Interfaces
order: 2
estimatedMinutes: 16
---

# Interfaces: Defining Object Shapes

Interfaces define the structure of objects. They're TypeScript's primary way to name and reuse object types, enabling better code organization and documentation.

## Basic Interfaces

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

// Objects must match the interface shape
const user: User = {
    id: 1,
    name: "Alice",
    email: "alice@example.com"
};

// Missing or extra properties cause errors
const badUser: User = {
    id: 1,
    name: "Bob"
    // Error: Property 'email' is missing
};

const extraUser: User = {
    id: 1,
    name: "Charlie",
    email: "charlie@example.com",
    age: 25  // Error: Object literal may only specify known properties
};
```

## Optional Properties

```typescript
interface Config {
    apiUrl: string;
    timeout?: number;      // Optional
    debug?: boolean;       // Optional
}

// Only required properties are mandatory
const config: Config = {
    apiUrl: "https://api.example.com"
};

// Optional properties can be provided
const fullConfig: Config = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    debug: true
};
```

## Readonly Properties

```typescript
interface Point {
    readonly x: number;
    readonly y: number;
}

const origin: Point = { x: 0, y: 0 };
origin.x = 10; // Error: Cannot assign to 'x' because it is a read-only property

// Readonly arrays
interface Config {
    readonly allowedDomains: readonly string[];
}

const config: Config = {
    allowedDomains: ["example.com", "test.com"]
};
config.allowedDomains.push("new.com"); // Error: push does not exist on readonly array
```

## Method Signatures

```typescript
interface Calculator {
    // Method signature syntax
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;

    // Property with function type (equivalent)
    multiply: (a: number, b: number) => number;
}

const calc: Calculator = {
    add(a, b) {
        return a + b;
    },
    subtract(a, b) {
        return a - b;
    },
    multiply: (a, b) => a * b
};
```

## Extending Interfaces

```typescript
interface Person {
    name: string;
    age: number;
}

interface Employee extends Person {
    employeeId: string;
    department: string;
}

// Employee has all Person properties plus its own
const employee: Employee = {
    name: "Alice",
    age: 30,
    employeeId: "E123",
    department: "Engineering"
};

// Extend multiple interfaces
interface Manager extends Employee {
    teamSize: number;
}

const manager: Manager = {
    name: "Bob",
    age: 35,
    employeeId: "E100",
    department: "Engineering",
    teamSize: 5
};
```

## Index Signatures

For objects with dynamic keys:

```typescript
interface StringMap {
    [key: string]: string;
}

const headers: StringMap = {
    "Content-Type": "application/json",
    "Authorization": "Bearer token123"
};

// Can add any string key
headers["X-Custom-Header"] = "value";

// Mixed: specific properties plus index signature
interface User {
    id: number;
    name: string;
    [key: string]: string | number;  // Must include all property types
}

const user: User = {
    id: 1,
    name: "Alice",
    email: "alice@example.com",  // Additional string property
    score: 100                    // Additional number property
};
```

## Function Interfaces

```typescript
// Interface for a function
interface SearchFunction {
    (query: string, limit?: number): string[];
}

const search: SearchFunction = (query, limit = 10) => {
    // Implementation
    return [];
};

// Callable interface with properties
interface ApiClient {
    (endpoint: string): Promise<unknown>;
    baseUrl: string;
    timeout: number;
}

const api = ((endpoint: string) => fetch(endpoint)) as ApiClient;
api.baseUrl = "https://api.example.com";
api.timeout = 5000;
```

## Hybrid Types

Objects that act as both functions and objects:

```typescript
interface Counter {
    (): number;           // Callable
    count: number;        // Property
    reset(): void;        // Method
}

function createCounter(): Counter {
    const counter = function() {
        counter.count++;
        return counter.count;
    } as Counter;

    counter.count = 0;
    counter.reset = () => { counter.count = 0; };

    return counter;
}

const counter = createCounter();
console.log(counter());     // 1
console.log(counter());     // 2
console.log(counter.count); // 2
counter.reset();
console.log(counter.count); // 0
```

## Interface vs Type Alias

Both can define object shapes, with subtle differences:

```typescript
// Interface
interface UserInterface {
    name: string;
    age: number;
}

// Type alias
type UserType = {
    name: string;
    age: number;
};

// Both work similarly for objects
const user1: UserInterface = { name: "Alice", age: 25 };
const user2: UserType = { name: "Bob", age: 30 };
```

### When to Use Each

```typescript
// Use interface for:
// 1. Object shapes that might be extended
interface Animal {
    name: string;
}
interface Dog extends Animal {
    breed: string;
}

// 2. Declaration merging (adding to existing interface)
interface Window {
    myCustomProperty: string;
}

// Use type for:
// 1. Union types
type Status = "pending" | "success" | "error";

// 2. Mapped types, conditional types
type ReadonlyUser = Readonly<User>;

// 3. Tuples
type Coordinate = [number, number];

// 4. Primitive aliases
type ID = string | number;
```

## Declaration Merging

Interfaces with the same name merge automatically:

```typescript
interface Box {
    height: number;
    width: number;
}

interface Box {
    depth: number;
}

// Box now has all three properties
const box: Box = {
    height: 10,
    width: 20,
    depth: 30
};

// Useful for extending library types
interface Window {
    myApp: {
        version: string;
    };
}

window.myApp = { version: "1.0.0" };
```

## Real-World Examples

### API Response

```typescript
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
    timestamp: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
}
```

### Component Props

```typescript
interface ButtonProps {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
    icon?: string;
}

function Button(props: ButtonProps) {
    const { label, onClick, variant = "primary", disabled = false } = props;
    // Render button
}
```

## Key Takeaways

1. Interfaces define the shape of objects
2. Use `?` for optional properties, `readonly` for immutable properties
3. Interfaces can be extended with `extends`
4. Index signatures handle dynamic property names
5. Interfaces can define function and method signatures
6. Interfaces merge; type aliases don't
7. Prefer interfaces for object shapes; use types for unions, tuples, primitives

Next, we'll explore type inference - how TypeScript automatically determines types.
