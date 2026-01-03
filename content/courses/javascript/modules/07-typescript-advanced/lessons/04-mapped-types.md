---
title: Mapped Types
order: 4
estimatedMinutes: 18
---

# Mapped Types: Programmatic Type Transformations

Mapped types let you create new types by transforming properties of existing types. They're the foundation of many utility types.

## Basic Mapped Types

Transform each property of a type:

```typescript
// Original type
interface User {
    id: number;
    name: string;
    email: string;
}

// Make all properties optional (like Partial)
type OptionalUser = {
    [Key in keyof User]?: User[Key];
};

// Make all properties readonly (like Readonly)
type ReadonlyUser = {
    readonly [Key in keyof User]: User[Key];
};

// Make all properties nullable
type NullableUser = {
    [Key in keyof User]: User[Key] | null;
};
```

## The Mapping Syntax

```typescript
type MappedType = {
    [Key in Keys]: ValueType;
};

// Key - the iteration variable
// Keys - union of keys to iterate over (often keyof T)
// ValueType - the type for each property
```

## Generic Mapped Types

Create reusable type transformations:

```typescript
// Generic nullable type
type Nullable<T> = {
    [Key in keyof T]: T[Key] | null;
};

// Generic getter type
type Getters<T> = {
    [Key in keyof T as `get${Capitalize<string & Key>}`]: () => T[Key];
};

interface Person {
    name: string;
    age: number;
}

type PersonGetters = Getters<Person>;
// {
//     getName: () => string;
//     getAge: () => number;
// }
```

## Key Remapping with 'as'

Transform property names:

```typescript
// Add prefix to all keys
type Prefixed<T, Prefix extends string> = {
    [Key in keyof T as `${Prefix}${string & Key}`]: T[Key];
};

interface User {
    name: string;
    email: string;
}

type FormUser = Prefixed<User, "form_">;
// { form_name: string; form_email: string; }

// Create event handlers
type EventHandlers<T> = {
    [Key in keyof T as `on${Capitalize<string & Key>}Change`]: (value: T[Key]) => void;
};

type UserHandlers = EventHandlers<User>;
// {
//     onNameChange: (value: string) => void;
//     onEmailChange: (value: string) => void;
// }
```

## Filtering Properties

Use `never` to exclude properties:

```typescript
// Remove keys of a certain type
type RemoveNullable<T> = {
    [Key in keyof T as T[Key] extends null | undefined ? never : Key]: T[Key];
};

interface Data {
    id: number;
    value: string;
    nothing: null;
    maybe: undefined;
}

type NonNullData = RemoveNullable<Data>;
// { id: number; value: string; }

// Keep only string properties
type StringProperties<T> = {
    [Key in keyof T as T[Key] extends string ? Key : never]: T[Key];
};

interface Mixed {
    name: string;
    count: number;
    label: string;
    active: boolean;
}

type StringOnly = StringProperties<Mixed>;
// { name: string; label: string; }
```

## Modifying Modifiers

Add or remove `readonly` and `?`:

```typescript
// Remove readonly (using -)
type Mutable<T> = {
    -readonly [Key in keyof T]: T[Key];
};

// Remove optional (using -)
type Required<T> = {
    [Key in keyof T]-?: T[Key];
};

// Add readonly
type Frozen<T> = {
    +readonly [Key in keyof T]: T[Key];  // + is optional
};

// Add optional
type AllOptional<T> = {
    [Key in keyof T]+?: T[Key];
};

// Example
interface Locked {
    readonly x: number;
    readonly y: number;
}

type Unlocked = Mutable<Locked>;
// { x: number; y: number; }  (no readonly)
```

## Conditional Mapped Types

Combine with conditional types:

```typescript
// Make certain properties optional
type OptionalExcept<T, K extends keyof T> = {
    [Key in keyof T as Key extends K ? Key : never]: T[Key];
} & {
    [Key in keyof T as Key extends K ? never : Key]?: T[Key];
};

interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

type UserWithRequiredId = OptionalExcept<User, "id">;
// { id: number; } & { name?: string; email?: string; age?: number; }

// Different types for different properties
type TypeMapping = {
    string: string;
    number: number;
    boolean: boolean;
};

type FromSchema<T extends Record<string, keyof TypeMapping>> = {
    [Key in keyof T]: TypeMapping[T[Key]];
};

type Schema = {
    name: "string";
    age: "number";
    active: "boolean";
};

type Model = FromSchema<Schema>;
// { name: string; age: number; active: boolean; }
```

## Deep Mapped Types

Transform nested objects:

```typescript
type DeepReadonly<T> = {
    readonly [Key in keyof T]: T[Key] extends object
        ? DeepReadonly<T[Key]>
        : T[Key];
};

interface Config {
    api: {
        url: string;
        timeout: number;
    };
    features: {
        darkMode: boolean;
        beta: boolean;
    };
}

type FrozenConfig = DeepReadonly<Config>;
// All properties at all levels are readonly

// Deep partial
type DeepPartial<T> = {
    [Key in keyof T]?: T[Key] extends object
        ? DeepPartial<T[Key]>
        : T[Key];
};

type PartialConfig = DeepPartial<Config>;
// All properties at all levels are optional
```

## Practical Examples

### Form Fields

```typescript
type FormField<T> = {
    value: T;
    error: string | null;
    touched: boolean;
};

type FormFields<T> = {
    [Key in keyof T]: FormField<T[Key]>;
};

interface UserData {
    name: string;
    email: string;
    age: number;
}

type UserForm = FormFields<UserData>;
// {
//     name: FormField<string>;
//     email: FormField<string>;
//     age: FormField<number>;
// }
```

### API Methods

```typescript
type ApiMethod<T> = {
    get: () => Promise<T>;
    create: (data: Omit<T, "id">) => Promise<T>;
    update: (id: number, data: Partial<T>) => Promise<T>;
    delete: (id: number) => Promise<void>;
};

type ApiEndpoints<T extends Record<string, object>> = {
    [Key in keyof T]: ApiMethod<T[Key]>;
};

interface Models {
    user: { id: number; name: string };
    post: { id: number; title: string };
}

type Api = ApiEndpoints<Models>;
// {
//     user: ApiMethod<{ id: number; name: string }>;
//     post: ApiMethod<{ id: number; title: string }>;
// }
```

### State Actions

```typescript
type Actions<T> = {
    [Key in keyof T as `set${Capitalize<string & Key>}`]: (value: T[Key]) => void;
} & {
    [Key in keyof T as `reset${Capitalize<string & Key>}`]: () => void;
};

interface State {
    count: number;
    name: string;
}

type StateActions = Actions<State>;
// {
//     setCount: (value: number) => void;
//     resetCount: () => void;
//     setName: (value: string) => void;
//     resetName: () => void;
// }
```

## Key Takeaways

1. Mapped types iterate over keys with `[Key in Keys]`
2. Use `keyof T` to iterate over type's properties
3. Key remapping with `as` transforms property names
4. Return `never` to filter out properties
5. `+` and `-` modifiers add/remove `readonly` and `?`
6. Combine with conditional types for complex transformations
7. Recursion enables deep transformations

Mapped types are powerful tools for building type-safe APIs and enforcing consistency across your codebase.
