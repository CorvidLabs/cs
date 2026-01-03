---
title: Basic Types
order: 2
estimatedMinutes: 15
---

# Basic Types in TypeScript

TypeScript provides type annotations for all JavaScript primitives plus additional types for common patterns. Understanding these foundational types is essential for writing TypeScript.

## Primitive Types

### string

For textual data:

```typescript
const name: string = "Alice";
const greeting: string = `Hello, ${name}`;
const empty: string = "";
```

### number

For all numeric values (integers and floats):

```typescript
const age: number = 25;
const price: number = 19.99;
const hex: number = 0xff;
const binary: number = 0b1010;
const negative: number = -42;
```

### boolean

For true/false values:

```typescript
const isActive: boolean = true;
const hasPermission: boolean = false;
const isValid: boolean = age >= 18;
```

### null and undefined

Represent absence of value:

```typescript
const nothing: null = null;
const notDefined: undefined = undefined;

// Often used with other types
let user: string | null = null;
user = "Alice";
```

### symbol

Unique identifiers:

```typescript
const sym1: symbol = Symbol("description");
const sym2: symbol = Symbol("description");
// sym1 !== sym2 (always unique)
```

### bigint

For very large integers:

```typescript
const huge: bigint = 9007199254740991n;
const alsoHuge: bigint = BigInt(9007199254740991);
```

## Arrays

Two syntax options for arrays:

```typescript
// Type followed by []
const numbers: number[] = [1, 2, 3, 4, 5];
const names: string[] = ["Alice", "Bob", "Charlie"];

// Generic Array<Type>
const scores: Array<number> = [95, 87, 92];
const flags: Array<boolean> = [true, false, true];

// Empty arrays need type annotation
const items: string[] = [];
items.push("first");
```

### Readonly Arrays

Prevent modifications:

```typescript
const frozen: readonly number[] = [1, 2, 3];
// frozen.push(4);  // Error: push does not exist on readonly
// frozen[0] = 10;  // Error: Index signature is readonly
```

## Tuples

Fixed-length arrays with specific types per position:

```typescript
// [string, number] tuple
const person: [string, number] = ["Alice", 25];

// Accessing elements
const name = person[0];  // string
const age = person[1];   // number

// Named tuples (for clarity)
type Coordinate = [x: number, y: number];
const point: Coordinate = [10, 20];

// Optional elements
type Response = [number, string, boolean?];
const success: Response = [200, "OK"];
const withFlag: Response = [200, "OK", true];
```

## Object Types

Define object shapes inline:

```typescript
const user: { name: string; age: number } = {
    name: "Alice",
    age: 25
};

// Optional properties with ?
const config: { debug?: boolean; timeout: number } = {
    timeout: 5000
    // debug is optional
};

// Readonly properties
const point: { readonly x: number; readonly y: number } = {
    x: 10,
    y: 20
};
// point.x = 5;  // Error: Cannot assign to 'x' because it is readonly
```

## Special Types

### any

Opts out of type checking (avoid when possible):

```typescript
let flexible: any = 42;
flexible = "now a string";
flexible = { anything: "goes" };

// No type errors, but also no type safety
flexible.nonexistent.method();  // No error, crashes at runtime!
```

### unknown

Safer alternative to `any`:

```typescript
let value: unknown = "hello";

// Must narrow type before using
if (typeof value === "string") {
    console.log(value.toUpperCase());  // OK after check
}

// value.toUpperCase();  // Error: 'unknown' type
```

### void

For functions that don't return a value:

```typescript
function logMessage(msg: string): void {
    console.log(msg);
    // No return statement
}
```

### never

For functions that never return:

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

## Type Assertions

Tell TypeScript about a type you know better:

```typescript
// Angle bracket syntax
const input = <HTMLInputElement>document.getElementById("myInput");

// 'as' syntax (preferred, required in JSX)
const input2 = document.getElementById("myInput") as HTMLInputElement;

// Non-null assertion (use carefully!)
const element = document.getElementById("exists")!;  // Assert it's not null
```

## Literal Types

Exact values as types:

```typescript
// String literal
let direction: "north" | "south" | "east" | "west";
direction = "north";  // OK
// direction = "up";  // Error

// Number literal
let dice: 1 | 2 | 3 | 4 | 5 | 6;
dice = 4;  // OK
// dice = 7;  // Error

// Boolean literal
const alwaysTrue: true = true;
```

## Union Types

Multiple possible types:

```typescript
// String or number
let id: string | number;
id = "abc123";
id = 42;

// Null handling
let username: string | null = null;
username = "Alice";

// Multiple types
type Result = string | number | boolean;
```

## Type Aliases

Create named types:

```typescript
// Simple alias
type ID = string | number;

// Object type alias
type User = {
    id: ID;
    name: string;
    email: string;
};

// Using the alias
const user: User = {
    id: 1,
    name: "Alice",
    email: "alice@example.com"
};
```

## Comparison Table

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text | `"hello"` |
| `number` | Numeric | `42`, `3.14` |
| `boolean` | True/false | `true` |
| `null` | Intentional absence | `null` |
| `undefined` | Not assigned | `undefined` |
| `any` | Any type (unsafe) | anything |
| `unknown` | Any type (safe) | anything, must narrow |
| `void` | No return value | functions |
| `never` | Never returns | throw, infinite loop |

## Key Takeaways

1. TypeScript has types for all JavaScript primitives
2. Use `number[]` or `Array<number>` for arrays
3. Tuples are fixed-length arrays with specific types
4. Avoid `any`; use `unknown` when type is uncertain
5. Union types (`|`) allow multiple possible types
6. Type aliases create reusable type names
7. Literal types restrict to specific values

In the next lesson, we'll learn how TypeScript can infer types automatically.
