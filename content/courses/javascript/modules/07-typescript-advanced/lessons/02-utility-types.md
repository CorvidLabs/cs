---
title: Utility Types
order: 2
estimatedMinutes: 16
---

# Utility Types

TypeScript provides built-in utility types that help transform existing types. These are generics that operate on types, making common type transformations easy and consistent.

## Partial<Type>

Makes all properties optional:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

// All properties become optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string }

// Useful for update functions
function updateUser(id: number, updates: Partial<User>): User {
    const user = getUserById(id);
    return { ...user, ...updates };
}

// Can update any subset of properties
updateUser(1, { name: "New Name" });
updateUser(1, { email: "new@email.com" });
```

## Required<Type>

Makes all properties required (opposite of Partial):

```typescript
interface Config {
    debug?: boolean;
    timeout?: number;
    retries?: number;
}

// All properties become required
type RequiredConfig = Required<Config>;
// { debug: boolean; timeout: number; retries: number }

function initialize(config: RequiredConfig): void {
    // All properties guaranteed to exist
    console.log(`Debug: ${config.debug}`);
    console.log(`Timeout: ${config.timeout}`);
}
```

## Readonly<Type>

Makes all properties readonly:

```typescript
interface Point {
    x: number;
    y: number;
}

type ReadonlyPoint = Readonly<Point>;
// { readonly x: number; readonly y: number }

const origin: ReadonlyPoint = { x: 0, y: 0 };
// origin.x = 5;  // Error: Cannot assign to 'x' because it is a read-only property

// Useful for immutable data
function freeze<T>(obj: T): Readonly<T> {
    return Object.freeze(obj);
}
```

## Pick<Type, Keys>

Creates a type with only selected properties:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

// Only include specified properties
type PublicUser = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string }

function getPublicProfile(user: User): PublicUser {
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
}
```

## Omit<Type, Keys>

Creates a type without specified properties:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

// Exclude specified properties
type UserWithoutPassword = Omit<User, "password">;
// { id: number; name: string; email: string }

type CreateUserInput = Omit<User, "id">;
// { name: string; email: string; password: string }

function createUser(input: CreateUserInput): User {
    return {
        id: generateId(),
        ...input
    };
}
```

## Record<Keys, Type>

Creates an object type with specified keys and value type:

```typescript
// String keys with specific value type
type UserRoles = Record<string, boolean>;
// { [key: string]: boolean }

const roles: UserRoles = {
    admin: true,
    editor: false,
    viewer: true
};

// Union of string literals as keys
type Status = "pending" | "approved" | "rejected";
type StatusMessages = Record<Status, string>;
// { pending: string; approved: string; rejected: string }

const messages: StatusMessages = {
    pending: "Awaiting review",
    approved: "Request approved",
    rejected: "Request denied"
};

// With complex value types
type UserMap = Record<number, User>;
const users: UserMap = {
    1: { id: 1, name: "Alice", email: "alice@example.com", password: "..." },
    2: { id: 2, name: "Bob", email: "bob@example.com", password: "..." }
};
```

## Exclude<Type, ExcludedUnion>

Removes types from a union:

```typescript
type Status = "pending" | "approved" | "rejected" | "cancelled";

// Remove specific types from union
type ActiveStatus = Exclude<Status, "cancelled">;
// "pending" | "approved" | "rejected"

type FinalStatus = Exclude<Status, "pending">;
// "approved" | "rejected" | "cancelled"

// Remove multiple types
type OnlyPending = Exclude<Status, "approved" | "rejected" | "cancelled">;
// "pending"
```

## Extract<Type, Union>

Keeps only types that match:

```typescript
type Status = "pending" | "approved" | "rejected" | 0 | 1;

// Extract only string types
type StringStatus = Extract<Status, string>;
// "pending" | "approved" | "rejected"

// Extract only number types
type NumericStatus = Extract<Status, number>;
// 0 | 1

// Extract specific values
type PositiveStatus = Extract<Status, "approved" | 1>;
// "approved" | 1
```

## NonNullable<Type>

Removes null and undefined:

```typescript
type MaybeString = string | null | undefined;

type DefiniteString = NonNullable<MaybeString>;
// string

// Practical usage
function processValue(value: string | null | undefined): void {
    const definite: NonNullable<typeof value> = value!;
    // Only use after null check
}

function ensureValue<T>(value: T): NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error("Value is null or undefined");
    }
    return value as NonNullable<T>;
}
```

## ReturnType<Type>

Gets the return type of a function:

```typescript
function createUser(name: string, age: number) {
    return { id: Math.random(), name, age, createdAt: new Date() };
}

type User = ReturnType<typeof createUser>;
// { id: number; name: string; age: number; createdAt: Date }

// Useful for inferring types from functions
async function fetchUsers(): Promise<User[]> {
    return [];
}

type FetchUsersReturn = ReturnType<typeof fetchUsers>;
// Promise<User[]>

type AwaitedUsers = Awaited<ReturnType<typeof fetchUsers>>;
// User[]
```

## Parameters<Type>

Gets parameter types as a tuple:

```typescript
function greet(name: string, age: number): string {
    return `Hello, ${name}! You are ${age}.`;
}

type GreetParams = Parameters<typeof greet>;
// [name: string, age: number]

// Spread parameters into another function
function wrapGreet(...args: Parameters<typeof greet>): void {
    console.log(greet(...args));
}

wrapGreet("Alice", 25);
```

## ConstructorParameters<Type>

Gets constructor parameter types:

```typescript
class User {
    constructor(
        public id: number,
        public name: string,
        public email: string
    ) {}
}

type UserConstructorParams = ConstructorParameters<typeof User>;
// [id: number, name: string, email: string]

function createUserFromParams(...args: UserConstructorParams): User {
    return new User(...args);
}
```

## InstanceType<Type>

Gets the instance type of a constructor:

```typescript
class User {
    constructor(public name: string) {}
}

type UserInstance = InstanceType<typeof User>;
// User

// Useful with factory patterns
function createInstance<T extends new (...args: any[]) => any>(
    Constructor: T,
    ...args: ConstructorParameters<T>
): InstanceType<T> {
    return new Constructor(...args);
}

const user = createInstance(User, "Alice");  // User
```

## Combining Utility Types

Utility types can be combined:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
}

// Partial + Omit: Optional updates without changing id
type UserUpdate = Partial<Omit<User, "id">>;

// Pick + Required: Require only certain fields
type RequiredUserInfo = Required<Pick<User, "name" | "email">>;

// Readonly + Pick: Immutable subset
type UserIdentity = Readonly<Pick<User, "id" | "name">>;

// Complex combination
type CreateUserDTO = Omit<User, "id"> & { confirmPassword: string };
type UpdateUserDTO = Partial<Omit<User, "id" | "password">>;
```

## Practical Example: Form State

```typescript
interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormState {
    values: FormData;
    errors: Partial<Record<keyof FormData, string>>;
    touched: Partial<Record<keyof FormData, boolean>>;
    isValid: boolean;
    isSubmitting: boolean;
}

const initialState: FormState = {
    values: {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    },
    errors: {},
    touched: {},
    isValid: false,
    isSubmitting: false
};
```

## Key Takeaways

1. `Partial<T>` makes all properties optional
2. `Required<T>` makes all properties required
3. `Readonly<T>` makes all properties immutable
4. `Pick<T, K>` selects specific properties
5. `Omit<T, K>` excludes specific properties
6. `Record<K, V>` creates object types with specific keys and values
7. `Exclude` and `Extract` filter union types
8. `ReturnType` and `Parameters` extract function type info
9. Utility types can be combined for complex transformations

In the next lesson, we'll learn about type guards for runtime type checking.
