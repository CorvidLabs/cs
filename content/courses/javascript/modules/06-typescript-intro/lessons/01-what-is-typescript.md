---
title: What is TypeScript?
order: 1
estimatedMinutes: 12
---

# What is TypeScript?

TypeScript is a statically typed superset of JavaScript developed by Microsoft. It adds optional type annotations that enable catching errors during development rather than at runtime.

## TypeScript vs JavaScript

Every valid JavaScript program is also a valid TypeScript program. TypeScript simply adds types:

```typescript
// JavaScript
function add(a, b) {
    return a + b;
}

// TypeScript
function add(a: number, b: number): number {
    return a + b;
}
```

## Why Use TypeScript?

### 1. Catch Errors Early

TypeScript catches type errors before your code runs:

```typescript
function greet(name: string) {
    return `Hello, ${name.toUpperCase()}!`;
}

greet("Alice");  // Works fine
greet(42);       // Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

### 2. Better IDE Support

TypeScript provides enhanced autocomplete, navigation, and refactoring:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

const user: User = {
    id: 1,
    name: "Alice",
    email: "alice@example.com"
};

// IDE knows user.name is a string
// and shows all available properties
user.name.toUpperCase();  // Full autocomplete support
```

### 3. Self-Documenting Code

Types serve as documentation that stays in sync with your code:

```typescript
// Clear what this function expects and returns
function calculateDiscount(
    price: number,
    discountPercent: number
): number {
    return price * (1 - discountPercent / 100);
}
```

### 4. Safer Refactoring

When you change a type, TypeScript shows everywhere that needs updating:

```typescript
interface Product {
    id: number;
    name: string;
    price: number;
    // Adding a required field
    inStock: boolean;
}

// TypeScript now shows errors everywhere
// Product is created without inStock
```

## How TypeScript Works

TypeScript code is compiled (transpiled) to JavaScript:

```
TypeScript (.ts) → TypeScript Compiler → JavaScript (.js)
```

The compiler:
1. Checks your types
2. Reports errors
3. Outputs plain JavaScript

```typescript
// input.ts
const message: string = "Hello, TypeScript!";
console.log(message);

// output.js (after compilation)
const message = "Hello, TypeScript!";
console.log(message);
```

## Setting Up TypeScript

### Installation

Using npm or Bun:

```bash
# Install TypeScript
bun add -d typescript

# Initialize configuration
bunx tsc --init
```

### The tsconfig.json File

TypeScript configuration lives in `tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "strict": true,
        "outDir": "./dist"
    },
    "include": ["src/**/*"]
}
```

Key options:
- `target`: JavaScript version to compile to
- `module`: Module system to use
- `strict`: Enable all strict type checking
- `outDir`: Where to put compiled files

### Running TypeScript

Several ways to run TypeScript:

```bash
# Compile to JavaScript
bunx tsc

# Run directly with Bun (recommended)
bun run file.ts

# Watch mode for development
bunx tsc --watch
```

## Your First TypeScript Program

Create a file called `hello.ts`:

```typescript
// Type annotation for the parameter
function greet(name: string): string {
    return `Hello, ${name}!`;
}

// TypeScript infers the type of message
const message = greet("World");

console.log(message);
```

Run it:

```bash
bun run hello.ts
```

## TypeScript Playground

The official TypeScript Playground lets you experiment without setup:
- Visit: typescriptlang.org/play
- Write TypeScript on the left
- See compiled JavaScript on the right
- Errors appear immediately

## Key Concepts Preview

TypeScript introduces several key concepts we'll explore:

1. **Type Annotations**: Explicit type declarations
2. **Type Inference**: Automatic type detection
3. **Interfaces**: Define object shapes
4. **Union Types**: Multiple possible types
5. **Generics**: Reusable type patterns

```typescript
// Type annotation
const count: number = 42;

// Type inference
const name = "Alice";  // TypeScript knows this is string

// Interface
interface Point {
    x: number;
    y: number;
}

// Union type
let id: string | number = "abc123";

// Generic
function first<T>(arr: T[]): T | undefined {
    return arr[0];
}
```

## Key Takeaways

1. TypeScript adds static types to JavaScript
2. All JavaScript is valid TypeScript
3. Types catch errors before runtime
4. TypeScript compiles to plain JavaScript
5. Better IDE support and self-documenting code
6. Use `tsconfig.json` for project configuration

In the next lesson, we'll dive into TypeScript's basic types and how to use them.
