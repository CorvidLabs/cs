---
title: Advanced Patterns
order: 4
estimatedMinutes: 18
---

# Advanced TypeScript Patterns

This lesson covers advanced patterns that leverage TypeScript's type system for building robust, maintainable applications.

## Mapped Types

Transform types by mapping over their properties:

```typescript
// Make all properties optional
type Optional<T> = {
    [K in keyof T]?: T[K];
};

// Make all properties readonly
type Immutable<T> = {
    readonly [K in keyof T]: T[K];
};

// Make all properties nullable
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};

interface User {
    id: number;
    name: string;
    email: string;
}

type OptionalUser = Optional<User>;
// { id?: number; name?: string; email?: string }

type ImmutableUser = Immutable<User>;
// { readonly id: number; readonly name: string; readonly email: string }
```

### Key Remapping

Rename keys during mapping:

```typescript
// Add prefix to all keys
type Prefixed<T, P extends string> = {
    [K in keyof T as `${P}${Capitalize<string & K>}`]: T[K];
};

interface User {
    name: string;
    age: number;
}

type UserWithGet = Prefixed<User, "get">;
// { getName: string; getAge: number }

// Filter properties by type
type OnlyStrings<T> = {
    [K in keyof T as T[K] extends string ? K : never]: T[K];
};

interface Mixed {
    name: string;
    age: number;
    email: string;
}

type StringProps = OnlyStrings<Mixed>;
// { name: string; email: string }
```

## Conditional Types

Types that depend on conditions:

```typescript
// Basic conditional
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Infer keyword extracts types
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type P1 = UnwrapPromise<Promise<string>>;  // string
type P2 = UnwrapPromise<number>;           // number

// Array element type
type ElementType<T> = T extends (infer E)[] ? E : never;

type E1 = ElementType<string[]>;   // string
type E2 = ElementType<number[]>;   // number
type E3 = ElementType<string>;     // never
```

### Distributive Conditional Types

Conditionals distribute over unions:

```typescript
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumberArray = ToArray<string | number>;
// string[] | number[]  (distributed)

// Prevent distribution with brackets
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type SingleArray = ToArrayNonDist<string | number>;
// (string | number)[]  (not distributed)
```

## Template Literal Types

String manipulation at the type level:

```typescript
// Basic template
type Greeting = `Hello, ${string}!`;
const valid: Greeting = "Hello, World!";
// const invalid: Greeting = "Hi there";  // Error

// With union types
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = "/users" | "/posts";
type Route = `${HTTPMethod} ${Endpoint}`;
// "GET /users" | "GET /posts" | "POST /users" | ... (8 combinations)

// Built-in string manipulation types
type Upper = Uppercase<"hello">;     // "HELLO"
type Lower = Lowercase<"HELLO">;     // "hello"
type Cap = Capitalize<"hello">;      // "Hello"
type Uncap = Uncapitalize<"Hello">;  // "hello"
```

### Event Handler Types

```typescript
type EventName = "click" | "focus" | "blur";
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

type EventHandlers = {
    [K in EventName as `on${Capitalize<K>}`]: (event: Event) => void;
};
// { onClick: (event: Event) => void; onFocus: ...; onBlur: ... }
```

## Builder Pattern

Fluent API with type safety:

```typescript
interface BuilderState {
    hasName: boolean;
    hasEmail: boolean;
}

class UserBuilder<State extends BuilderState = { hasName: false; hasEmail: false }> {
    private user: Partial<{ name: string; email: string }> = {};

    setName(name: string): UserBuilder<State & { hasName: true }> {
        this.user.name = name;
        return this as any;
    }

    setEmail(email: string): UserBuilder<State & { hasEmail: true }> {
        this.user.email = email;
        return this as any;
    }

    build(
        this: UserBuilder<{ hasName: true; hasEmail: true }>
    ): { name: string; email: string } {
        return this.user as { name: string; email: string };
    }
}

const builder = new UserBuilder();

// builder.build();  // Error: missing hasName and hasEmail

const user = builder
    .setName("Alice")
    .setEmail("alice@example.com")
    .build();  // OK: both set
```

## Type-Safe Event Emitter

```typescript
type EventMap = {
    userCreated: { id: number; name: string };
    userDeleted: { id: number };
    error: { message: string };
};

class TypedEventEmitter<Events extends Record<string, unknown>> {
    private listeners: {
        [K in keyof Events]?: ((data: Events[K]) => void)[];
    } = {};

    on<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(listener);
    }

    emit<K extends keyof Events>(event: K, data: Events[K]): void {
        this.listeners[event]?.forEach(listener => listener(data));
    }
}

const emitter = new TypedEventEmitter<EventMap>();

emitter.on("userCreated", (data) => {
    console.log(data.id, data.name);  // TypeScript knows the shape
});

emitter.emit("userCreated", { id: 1, name: "Alice" });  // OK
// emitter.emit("userCreated", { id: 1 });  // Error: missing name
```

## Branded Types

Create distinct types from primitives:

```typescript
// Brand symbol
declare const brand: unique symbol;

type Brand<T, B> = T & { [brand]: B };

type UserId = Brand<number, "UserId">;
type PostId = Brand<number, "PostId">;

function createUserId(id: number): UserId {
    return id as UserId;
}

function createPostId(id: number): PostId {
    return id as PostId;
}

function getUser(id: UserId): void {
    console.log("Getting user:", id);
}

const userId = createUserId(1);
const postId = createPostId(1);

getUser(userId);  // OK
// getUser(postId);  // Error: PostId not assignable to UserId
// getUser(1);       // Error: number not assignable to UserId
```

## Result Type Pattern

Handle success and failure without exceptions:

```typescript
type Result<T, E = Error> =
    | { success: true; value: T }
    | { success: false; error: E };

function ok<T>(value: T): Result<T, never> {
    return { success: true, value };
}

function err<E>(error: E): Result<never, E> {
    return { success: false, error };
}

async function parseJson<T>(json: string): Promise<Result<T, string>> {
    try {
        const data = JSON.parse(json);
        return ok(data);
    } catch {
        return err("Invalid JSON");
    }
}

async function fetchUser(id: number): Promise<Result<User, string>> {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
        return err(`HTTP error: ${response.status}`);
    }

    const result = await parseJson<User>(await response.text());
    return result;
}

// Usage
const result = await fetchUser(1);

if (result.success) {
    console.log(result.value.name);
} else {
    console.error(result.error);
}
```

## Deep Readonly

Make nested objects readonly:

```typescript
type DeepReadonly<T> = T extends (infer R)[]
    ? ReadonlyArray<DeepReadonly<R>>
    : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

interface User {
    name: string;
    address: {
        street: string;
        city: string;
    };
    tags: string[];
}

type ReadonlyUser = DeepReadonly<User>;
/*
{
    readonly name: string;
    readonly address: {
        readonly street: string;
        readonly city: string;
    };
    readonly tags: readonly string[];
}
*/
```

## Path Types

Type-safe object paths:

```typescript
type Path<T, K extends keyof T = keyof T> = K extends string
    ? T[K] extends Record<string, unknown>
        ? K | `${K}.${Path<T[K]>}`
        : K
    : never;

interface User {
    name: string;
    address: {
        street: string;
        city: string;
    };
}

type UserPath = Path<User>;
// "name" | "address" | "address.street" | "address.city"

function get<T, P extends Path<T>>(obj: T, path: P): unknown {
    const keys = (path as string).split(".");
    let result: unknown = obj;
    for (const key of keys) {
        result = (result as Record<string, unknown>)[key];
    }
    return result;
}

const user: User = {
    name: "Alice",
    address: { street: "123 Main", city: "Boston" }
};

get(user, "address.city");  // OK
// get(user, "address.zip");  // Error: not a valid path
```

## Key Takeaways

1. Mapped types transform existing types property by property
2. Conditional types enable type-level conditionals with `infer`
3. Template literal types enable string manipulation at type level
4. Builder pattern ensures all required methods are called
5. Branded types create distinct types from primitives
6. Result types handle errors without exceptions
7. Deep utility types work recursively on nested structures

These patterns enable building more type-safe and maintainable applications. Practice with the exercises to solidify your understanding.
