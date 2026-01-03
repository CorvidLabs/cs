---
title: Type Guards
order: 3
estimatedMinutes: 15
---

# Type Guards

Type guards are techniques that narrow types at runtime, helping TypeScript understand which specific type you're working with within a code block. They bridge the gap between compile-time types and runtime checks.

## typeof Type Guards

Use `typeof` for primitive types:

```typescript
function process(value: string | number) {
    if (typeof value === "string") {
        // TypeScript knows value is string here
        console.log(value.toUpperCase());
    } else {
        // TypeScript knows value is number here
        console.log(value.toFixed(2));
    }
}

// Works with all primitive types
function formatValue(value: string | number | boolean | undefined) {
    if (typeof value === "string") {
        return `"${value}"`;
    }
    if (typeof value === "number") {
        return value.toString();
    }
    if (typeof value === "boolean") {
        return value ? "true" : "false";
    }
    return "undefined";
}
```

## instanceof Type Guards

Use `instanceof` for class instances:

```typescript
class Dog {
    bark() {
        console.log("Woof!");
    }
}

class Cat {
    meow() {
        console.log("Meow!");
    }
}

function makeSound(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();  // TypeScript knows it's Dog
    } else {
        animal.meow();  // TypeScript knows it's Cat
    }
}

// Works with built-in classes too
function processValue(value: Date | string) {
    if (value instanceof Date) {
        console.log(value.getFullYear());
    } else {
        console.log(value.toUpperCase());
    }
}
```

## in Operator Type Guards

Check for property existence:

```typescript
interface Bird {
    fly(): void;
    layEggs(): void;
}

interface Fish {
    swim(): void;
    layEggs(): void;
}

function move(animal: Bird | Fish) {
    if ("fly" in animal) {
        animal.fly();  // TypeScript knows it's Bird
    } else {
        animal.swim();  // TypeScript knows it's Fish
    }
}

// Common pattern for optional properties
interface WithEmail {
    email: string;
}

interface WithPhone {
    phone: string;
}

function contact(info: WithEmail | WithPhone) {
    if ("email" in info) {
        console.log(`Email: ${info.email}`);
    } else {
        console.log(`Phone: ${info.phone}`);
    }
}
```

## Discriminated Unions

Use a common property to discriminate between types:

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

// TypeScript ensures exhaustive checking
function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}

function getAreaSafe(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        case "triangle":
            return (shape.base * shape.height) / 2;
        default:
            return assertNever(shape);  // Error if cases missing
    }
}
```

## Custom Type Guard Functions

Create reusable type guards with `is` keyword:

```typescript
interface User {
    type: "user";
    name: string;
    email: string;
}

interface Admin {
    type: "admin";
    name: string;
    permissions: string[];
}

// Custom type guard function
function isAdmin(person: User | Admin): person is Admin {
    return person.type === "admin";
}

function greet(person: User | Admin) {
    if (isAdmin(person)) {
        console.log(`Admin ${person.name} has ${person.permissions.length} permissions`);
    } else {
        console.log(`User ${person.name} (${person.email})`);
    }
}

// Another example
function isString(value: unknown): value is string {
    return typeof value === "string";
}

function process(value: unknown) {
    if (isString(value)) {
        console.log(value.toUpperCase());  // value is string
    }
}
```

## Assertion Functions

Assert that a condition is true:

```typescript
function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error("Value must be a string");
    }
}

function processInput(input: unknown) {
    assertIsString(input);
    // After assertion, input is string
    console.log(input.toUpperCase());
}

// Assert non-null
function assertDefined<T>(value: T | null | undefined): asserts value is T {
    if (value === null || value === undefined) {
        throw new Error("Value must be defined");
    }
}

function processUser(user: User | null) {
    assertDefined(user);
    console.log(user.name);  // user is User
}
```

## Truthiness Narrowing

TypeScript narrows based on truthiness:

```typescript
function printLength(value: string | null | undefined) {
    if (value) {
        // value is string (not null, undefined, or "")
        console.log(value.length);
    } else {
        console.log("No value");
    }
}

// Be careful with falsy values
function processNumber(num: number | null) {
    if (num) {
        // This excludes 0!
        console.log(num.toFixed(2));
    }
}

// Better for numbers
function processNumberSafe(num: number | null) {
    if (num !== null) {
        // 0 is included
        console.log(num.toFixed(2));
    }
}
```

## Equality Narrowing

Use equality checks:

```typescript
function compare(a: string | number, b: string | number) {
    if (a === b) {
        // Both are the same type and value
        console.log(`Equal: ${a}`);
    }
}

function process(value: "yes" | "no" | boolean) {
    if (value === true) {
        // value is true
    } else if (value === false) {
        // value is false
    } else if (value === "yes") {
        // value is "yes"
    } else {
        // value is "no"
    }
}
```

## Array Type Guards

Check array types:

```typescript
function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(item => typeof item === "string");
}

function processArray(value: unknown) {
    if (Array.isArray(value)) {
        // value is any[]
        console.log(`Array with ${value.length} items`);
    }

    if (isStringArray(value)) {
        // value is string[]
        console.log(value.map(s => s.toUpperCase()));
    }
}
```

## Combining Type Guards

```typescript
interface ApiSuccess<T> {
    success: true;
    data: T;
}

interface ApiError {
    success: false;
    error: string;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

function isSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
    return response.success === true;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
    // Implementation
    return { success: true, data: { type: "user", name: "Alice", email: "a@b.com" } };
}

async function displayUser(id: number) {
    const response = await fetchUser(id);

    if (isSuccess(response)) {
        console.log(`User: ${response.data.name}`);
    } else {
        console.error(`Error: ${response.error}`);
    }
}
```

## Practical Example: Form Validation

```typescript
interface ValidationSuccess {
    valid: true;
    data: {
        email: string;
        password: string;
    };
}

interface ValidationError {
    valid: false;
    errors: {
        field: string;
        message: string;
    }[];
}

type ValidationResult = ValidationSuccess | ValidationError;

function validateForm(email: string, password: string): ValidationResult {
    const errors: { field: string; message: string }[] = [];

    if (!email.includes("@")) {
        errors.push({ field: "email", message: "Invalid email format" });
    }

    if (password.length < 8) {
        errors.push({ field: "password", message: "Password too short" });
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    return { valid: true, data: { email, password } };
}

function handleSubmit(email: string, password: string) {
    const result = validateForm(email, password);

    if (result.valid) {
        // TypeScript knows result.data exists
        console.log(`Submitting: ${result.data.email}`);
    } else {
        // TypeScript knows result.errors exists
        result.errors.forEach(e => console.error(`${e.field}: ${e.message}`));
    }
}
```

## Key Takeaways

1. `typeof` guards work with primitive types
2. `instanceof` guards work with class instances
3. `in` operator checks for property existence
4. Discriminated unions use a common property (like `kind` or `type`)
5. Custom type guards use `is` keyword for reusable checks
6. Assertion functions use `asserts` to throw on invalid types
7. Combine guards for complex type narrowing
8. Always handle the `never` case in exhaustive switches

In the next lesson, we'll explore advanced TypeScript patterns.
