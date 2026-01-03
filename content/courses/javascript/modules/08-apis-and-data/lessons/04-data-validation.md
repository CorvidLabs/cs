---
title: Data Validation
order: 4
estimatedMinutes: 15
---

# Data Validation

Validating data from APIs and user input is crucial for building reliable applications. This lesson covers validation strategies and patterns.

## Why Validate Data?

External data sources can provide:
- Missing required fields
- Wrong data types
- Invalid values
- Unexpected structure

```javascript
// API might return unexpected data
const apiResponse = {
    name: "Alice",
    age: "twenty-five",  // Should be number
    // email is missing!
};

// Without validation, this causes runtime errors
console.log(apiResponse.email.toLowerCase());  // TypeError!
```

## Basic Type Checking

### typeof Checks

```javascript
function isString(value) {
    return typeof value === "string";
}

function isNumber(value) {
    return typeof value === "number" && !Number.isNaN(value);
}

function isBoolean(value) {
    return typeof value === "boolean";
}

function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isArray(value) {
    return Array.isArray(value);
}
```

### Validation Functions

```javascript
function validateUser(data) {
    const errors = [];

    if (!data || typeof data !== "object") {
        return { valid: false, errors: ["Data must be an object"] };
    }

    if (!isString(data.name) || data.name.trim() === "") {
        errors.push("Name is required and must be a string");
    }

    if (!isString(data.email) || !data.email.includes("@")) {
        errors.push("Valid email is required");
    }

    if (data.age !== undefined && !isNumber(data.age)) {
        errors.push("Age must be a number");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// Usage
const result = validateUser({ name: "Alice", email: "alice@example.com" });
if (!result.valid) {
    console.error("Validation failed:", result.errors);
}
```

## Schema-Based Validation

Define schemas to validate against:

```javascript
const userSchema = {
    name: { type: "string", required: true, minLength: 1 },
    email: { type: "string", required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    age: { type: "number", required: false, min: 0, max: 150 },
    role: { type: "string", required: false, enum: ["admin", "user", "guest"] }
};

function validateField(value, rules, fieldName) {
    const errors = [];

    // Check required
    if (rules.required && (value === undefined || value === null)) {
        errors.push(`${fieldName} is required`);
        return errors;
    }

    if (value === undefined || value === null) {
        return errors;  // Optional field not provided
    }

    // Check type
    if (rules.type === "string" && typeof value !== "string") {
        errors.push(`${fieldName} must be a string`);
    }
    if (rules.type === "number" && typeof value !== "number") {
        errors.push(`${fieldName} must be a number`);
    }
    if (rules.type === "boolean" && typeof value !== "boolean") {
        errors.push(`${fieldName} must be a boolean`);
    }
    if (rules.type === "array" && !Array.isArray(value)) {
        errors.push(`${fieldName} must be an array`);
    }

    // String validations
    if (typeof value === "string") {
        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${fieldName} must be at least ${rules.minLength} characters`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${fieldName} must be at most ${rules.maxLength} characters`);
        }
        if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`${fieldName} format is invalid`);
        }
    }

    // Number validations
    if (typeof value === "number") {
        if (rules.min !== undefined && value < rules.min) {
            errors.push(`${fieldName} must be at least ${rules.min}`);
        }
        if (rules.max !== undefined && value > rules.max) {
            errors.push(`${fieldName} must be at most ${rules.max}`);
        }
    }

    // Enum validation
    if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${fieldName} must be one of: ${rules.enum.join(", ")}`);
    }

    return errors;
}

function validateSchema(data, schema) {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
        errors.push(...validateField(data[field], rules, field));
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// Usage
const user = { name: "Alice", email: "alice@example.com", age: 25 };
const result = validateSchema(user, userSchema);
```

## Type Guards in TypeScript

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

function isUser(data: unknown): data is User {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;

    return (
        typeof obj.id === "number" &&
        typeof obj.name === "string" &&
        typeof obj.email === "string"
    );
}

// Usage
async function fetchUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();

    if (!isUser(data)) {
        throw new Error("Invalid user data");
    }

    return data;  // TypeScript knows this is User
}
```

## Validation with Type Narrowing

```typescript
type ValidationResult<T> =
    | { success: true; data: T }
    | { success: false; errors: string[] };

function validateAndParse<T>(
    data: unknown,
    validator: (data: unknown) => data is T
): ValidationResult<T> {
    if (validator(data)) {
        return { success: true, data };
    }
    return { success: false, errors: ["Validation failed"] };
}

// With detailed errors
function validateUser(data: unknown): ValidationResult<User> {
    const errors: string[] = [];

    if (typeof data !== "object" || data === null) {
        return { success: false, errors: ["Data must be an object"] };
    }

    const obj = data as Record<string, unknown>;

    if (typeof obj.id !== "number") {
        errors.push("id must be a number");
    }
    if (typeof obj.name !== "string") {
        errors.push("name must be a string");
    }
    if (typeof obj.email !== "string") {
        errors.push("email must be a string");
    }

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return { success: true, data: obj as User };
}
```

## Sanitizing Data

Clean and normalize data after validation:

```javascript
function sanitizeUser(user) {
    return {
        name: user.name.trim(),
        email: user.email.toLowerCase().trim(),
        age: user.age ?? null,
        role: user.role ?? "user"
    };
}

function sanitizeHtml(str) {
    const htmlEntities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return str.replace(/[&<>"']/g, char => htmlEntities[char]);
}
```

## API Response Validation Pattern

```javascript
async function fetchValidated(url, validator) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const result = validator(data);

    if (!result.valid) {
        throw new ValidationError(result.errors);
    }

    return result.data;
}

class ValidationError extends Error {
    constructor(errors) {
        super(`Validation failed: ${errors.join(", ")}`);
        this.name = "ValidationError";
        this.errors = errors;
    }
}

// Usage
try {
    const user = await fetchValidated("/api/users/1", validateUser);
    console.log(user.name);
} catch (error) {
    if (error instanceof ValidationError) {
        console.error("Invalid data:", error.errors);
    } else {
        console.error("Request failed:", error.message);
    }
}
```

## Form Validation

```javascript
function validateForm(formData) {
    const errors = {};

    // Username
    if (!formData.username) {
        errors.username = "Username is required";
    } else if (formData.username.length < 3) {
        errors.username = "Username must be at least 3 characters";
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
        errors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
        errors.email = "Invalid email format";
    }

    // Password
    if (!formData.password) {
        errors.password = "Password is required";
    } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}
```

## Validation Best Practices

1. **Validate early**: Check data as soon as it enters your system
2. **Be specific**: Return detailed error messages
3. **Fail fast**: Stop processing invalid data immediately
4. **Sanitize after validation**: Clean data only after confirming it's valid
5. **Use TypeScript**: Type guards provide compile-time safety
6. **Consider validation libraries**: Libraries like Zod, Yup, or Joi for complex schemas

## Key Takeaways

1. Always validate external data (APIs, user input)
2. Use type checking functions for runtime validation
3. Schema-based validation scales better for complex objects
4. TypeScript type guards narrow types safely
5. Return structured validation results with specific errors
6. Sanitize data after validation
7. Create reusable validation patterns for API responses

The exercises will help you practice building robust validation systems.
