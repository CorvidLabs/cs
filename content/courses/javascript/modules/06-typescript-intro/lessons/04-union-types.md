---
title: Union Types
order: 4
estimatedMinutes: 16
---

# Union Types: Either This or That

Union types let a value be one of several types. They're fundamental to modeling real-world data that can take different forms.

## Basic Union Types

```typescript
// Variable can be string OR number
let id: string | number;

id = "abc123";  // OK
id = 12345;     // OK
id = true;      // Error: Type 'boolean' is not assignable

// Function parameter
function printId(id: string | number): void {
    console.log(`ID: ${id}`);
}

printId("abc");
printId(123);
```

## Working with Union Types

You can only use properties/methods common to all types:

```typescript
function printId(id: string | number): void {
    // Error: Property 'toUpperCase' does not exist on type 'number'
    console.log(id.toUpperCase());

    // OK: toString exists on both string and number
    console.log(id.toString());
}
```

## Type Narrowing

Use control flow to narrow union types:

```typescript
function printId(id: string | number): void {
    if (typeof id === "string") {
        // TypeScript knows id is string here
        console.log(id.toUpperCase());
    } else {
        // TypeScript knows id is number here
        console.log(id.toFixed(2));
    }
}

// instanceof narrowing
function processValue(value: Date | string): string {
    if (value instanceof Date) {
        return value.toISOString();
    }
    return value;
}

// in narrowing
interface Dog {
    bark(): void;
}

interface Cat {
    meow(): void;
}

function speak(animal: Dog | Cat): void {
    if ("bark" in animal) {
        animal.bark();
    } else {
        animal.meow();
    }
}
```

## Literal Unions

Combine literal types for specific allowed values:

```typescript
type Status = "pending" | "active" | "completed";

let taskStatus: Status = "pending";
taskStatus = "active";     // OK
taskStatus = "cancelled";  // Error

// Numeric literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

function roll(): DiceRoll {
    return Math.ceil(Math.random() * 6) as DiceRoll;
}

// Boolean-like
type YesNo = "yes" | "no";
```

## Discriminated Unions

Use a common property to distinguish between types:

```typescript
interface Circle {
    kind: "circle";
    radius: number;
}

interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}

interface Triangle {
    kind: "triangle";
    base: number;
    height: number;
}

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        case "triangle":
            return (shape.base * shape.height) / 2;
    }
}

const circle: Circle = { kind: "circle", radius: 5 };
console.log(getArea(circle)); // 78.54...
```

## Exhaustiveness Checking

Ensure all union variants are handled:

```typescript
type Status = "pending" | "success" | "error";

function handleStatus(status: Status): string {
    switch (status) {
        case "pending":
            return "Waiting...";
        case "success":
            return "Done!";
        case "error":
            return "Failed!";
        default:
            // This ensures all cases are handled
            const _exhaustive: never = status;
            return _exhaustive;
    }
}

// If you add a new status like "cancelled" and forget to handle it,
// TypeScript will error at the never assignment
```

## Nullable Types

Union with null or undefined:

```typescript
// With strictNullChecks enabled (recommended)
function greet(name: string | null): string {
    if (name === null) {
        return "Hello, Guest!";
    }
    return `Hello, ${name}!`;
}

greet("Alice");  // "Hello, Alice!"
greet(null);     // "Hello, Guest!"

// Optional parameters are automatically T | undefined
function log(message: string, level?: string): void {
    // level is string | undefined
    console.log(`[${level ?? "INFO"}] ${message}`);
}
```

## Optional Chaining with Unions

```typescript
interface User {
    name: string;
    address?: {
        city: string;
        zip: string;
    };
}

function getCity(user: User): string | undefined {
    return user.address?.city;
}

// Nullish coalescing
function getCityOrDefault(user: User): string {
    return user.address?.city ?? "Unknown";
}
```

## Union of Objects

```typescript
interface SuccessResponse {
    success: true;
    data: object;
}

interface ErrorResponse {
    success: false;
    error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse): void {
    if (response.success) {
        // TypeScript knows response is SuccessResponse
        console.log("Data:", response.data);
    } else {
        // TypeScript knows response is ErrorResponse
        console.log("Error:", response.error);
    }
}
```

## Arrays of Union Types

```typescript
// Array where each element can be string or number
const mixed: (string | number)[] = [1, "two", 3, "four"];

// Different from tuple
const tuple: [string, number] = ["hello", 42];  // Exactly 2 elements

// Process mixed array
mixed.forEach(item => {
    if (typeof item === "string") {
        console.log(item.toUpperCase());
    } else {
        console.log(item * 2);
    }
});
```

## Type Guards

Create reusable type checking functions:

```typescript
interface Dog {
    type: "dog";
    bark(): void;
}

interface Cat {
    type: "cat";
    meow(): void;
}

type Pet = Dog | Cat;

// Type guard function
function isDog(pet: Pet): pet is Dog {
    return pet.type === "dog";
}

function interact(pet: Pet): void {
    if (isDog(pet)) {
        pet.bark();  // TypeScript knows it's Dog
    } else {
        pet.meow();  // TypeScript knows it's Cat
    }
}
```

## Practical Examples

### API Error Handling

```typescript
type Result<T> =
    | { ok: true; value: T }
    | { ok: false; error: string };

async function fetchUser(id: number): Promise<Result<User>> {
    try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
            return { ok: false, error: `HTTP ${response.status}` };
        }
        const user = await response.json();
        return { ok: true, value: user };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

const result = await fetchUser(1);
if (result.ok) {
    console.log(result.value.name);
} else {
    console.error(result.error);
}
```

### Form State

```typescript
type FormState =
    | { status: "idle" }
    | { status: "validating" }
    | { status: "submitting" }
    | { status: "success"; data: object }
    | { status: "error"; message: string };

function renderForm(state: FormState): string {
    switch (state.status) {
        case "idle":
            return "Fill out the form";
        case "validating":
            return "Checking...";
        case "submitting":
            return "Submitting...";
        case "success":
            return "Submitted!";
        case "error":
            return `Error: ${state.message}`;
    }
}
```

## Key Takeaways

1. Union types use `|` to allow multiple types
2. Narrow unions with `typeof`, `instanceof`, or `in`
3. Literal unions define specific allowed values
4. Discriminated unions use a common property for type distinction
5. Use exhaustiveness checking to handle all cases
6. Type guards (`is` keyword) create reusable narrowing
7. Unions are essential for nullable types and API responses

You now have a solid foundation in TypeScript basics. Next, we'll explore advanced TypeScript features like generics and utility types.
