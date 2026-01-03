---
title: Async Error Handling
order: 4
estimatedMinutes: 14
---

# Async Error Handling

Proper error handling is crucial in asynchronous code. Unhandled errors can cause silent failures, memory leaks, or application crashes. This lesson covers comprehensive error handling strategies.

## Types of Async Errors

### Network Errors

```javascript
async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        if (error.name === "TypeError") {
            // Network failure, CORS issue, or invalid URL
            console.error("Network error:", error.message);
        }
        throw error;
    }
}
```

### HTTP Errors

Fetch doesn't throw on HTTP error status codes:

```javascript
async function fetchData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        // HTTP error (4xx or 5xx)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
}
```

### Timeout Errors

```javascript
class TimeoutError extends Error {
    constructor(message = "Operation timed out") {
        super(message);
        this.name = "TimeoutError";
    }
}

async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { signal: controller.signal });
        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") {
            throw new TimeoutError(`Request to ${url} timed out after ${timeout}ms`);
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}
```

## Custom Error Classes

Create descriptive error types:

```javascript
class ApiError extends Error {
    constructor(message, statusCode, endpoint) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.endpoint = endpoint;
    }
}

class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = "ValidationError";
        this.field = field;
    }
}

class NetworkError extends Error {
    constructor(message, url) {
        super(message);
        this.name = "NetworkError";
        this.url = url;
    }
}
```

## Error Handling Patterns

### Centralized Error Handler

```javascript
function handleAsyncError(error, context = "") {
    console.error(`Error in ${context}:`, error);

    if (error instanceof ApiError) {
        if (error.statusCode === 401) {
            redirectToLogin();
        } else if (error.statusCode === 404) {
            showNotFoundMessage();
        } else if (error.statusCode >= 500) {
            showServerErrorMessage();
        }
    } else if (error instanceof NetworkError) {
        showOfflineMessage();
    } else if (error instanceof ValidationError) {
        showFieldError(error.field, error.message);
    } else {
        showGenericError("Something went wrong. Please try again.");
    }
}

async function loadUserProfile(userId) {
    try {
        const user = await fetchUser(userId);
        displayProfile(user);
    } catch (error) {
        handleAsyncError(error, "loadUserProfile");
    }
}
```

### Result Objects

Return structured results instead of throwing:

```javascript
async function fetchUserSafe(id) {
    try {
        const response = await fetch(`/api/users/${id}`);

        if (!response.ok) {
            return {
                success: false,
                error: `HTTP ${response.status}`,
                data: null
            };
        }

        const user = await response.json();
        return {
            success: true,
            error: null,
            data: user
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

// Usage
const result = await fetchUserSafe(123);

if (result.success) {
    console.log("User:", result.data);
} else {
    console.error("Failed:", result.error);
}
```

### Error Boundaries Pattern

Wrap operations with fallback behavior:

```javascript
async function withFallback(asyncFn, fallbackValue) {
    try {
        return await asyncFn();
    } catch (error) {
        console.warn("Operation failed, using fallback:", error.message);
        return fallbackValue;
    }
}

// Usage
const user = await withFallback(
    () => fetchUser(userId),
    { name: "Guest", id: null }
);
```

## Handling Multiple Async Operations

### Promise.all Error Handling

```javascript
async function loadDashboard() {
    try {
        const [user, posts, notifications] = await Promise.all([
            fetchUser(),
            fetchPosts(),
            fetchNotifications()
        ]);

        return { user, posts, notifications };
    } catch (error) {
        // If ANY fails, all fail
        console.error("Dashboard load failed:", error);
        throw error;
    }
}
```

### Promise.allSettled for Partial Success

```javascript
async function loadDashboardResilient() {
    const results = await Promise.allSettled([
        fetchUser(),
        fetchPosts(),
        fetchNotifications()
    ]);

    const dashboard = {};
    const errors = [];

    if (results[0].status === "fulfilled") {
        dashboard.user = results[0].value;
    } else {
        errors.push({ component: "user", error: results[0].reason });
        dashboard.user = null;
    }

    if (results[1].status === "fulfilled") {
        dashboard.posts = results[1].value;
    } else {
        errors.push({ component: "posts", error: results[1].reason });
        dashboard.posts = [];
    }

    if (results[2].status === "fulfilled") {
        dashboard.notifications = results[2].value;
    } else {
        errors.push({ component: "notifications", error: results[2].reason });
        dashboard.notifications = [];
    }

    return { dashboard, errors };
}
```

## Retry Strategies

### Simple Retry

```javascript
async function retry(asyncFn, maxAttempts = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await asyncFn();
        } catch (error) {
            lastError = error;
            console.warn(`Attempt ${attempt} failed:`, error.message);
        }
    }

    throw lastError;
}
```

### Exponential Backoff

```javascript
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff(asyncFn, options = {}) {
    const {
        maxAttempts = 3,
        initialDelay = 1000,
        maxDelay = 30000,
        shouldRetry = () => true
    } = options;

    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await asyncFn();
        } catch (error) {
            lastError = error;

            if (attempt === maxAttempts || !shouldRetry(error)) {
                throw error;
            }

            const delayTime = Math.min(
                initialDelay * Math.pow(2, attempt - 1),
                maxDelay
            );

            console.log(`Retrying in ${delayTime}ms...`);
            await delay(delayTime);
        }
    }

    throw lastError;
}

// Usage
const data = await retryWithBackoff(
    () => fetch("https://api.example.com/data").then(r => r.json()),
    {
        maxAttempts: 5,
        shouldRetry: (error) => error.name !== "ValidationError"
    }
);
```

## Cleanup and Resource Management

### Using finally

```javascript
async function processFile(filename) {
    const file = await openFile(filename);

    try {
        const data = await file.read();
        await processData(data);
    } catch (error) {
        console.error("Processing failed:", error);
        throw error;
    } finally {
        // Always close the file, even if error occurred
        await file.close();
    }
}
```

### AbortController for Cancellation

```javascript
function createCancellableRequest(url) {
    const controller = new AbortController();

    const promise = fetch(url, { signal: controller.signal })
        .then(response => response.json());

    return {
        promise,
        cancel: () => controller.abort()
    };
}

// Usage
const request = createCancellableRequest("/api/large-data");

// Later, if needed:
request.cancel();
```

## Logging and Monitoring

```javascript
async function loggedFetch(url, options = {}) {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    console.log(`[${requestId}] Starting request to ${url}`);

    try {
        const response = await fetch(url, options);
        const duration = Date.now() - startTime;

        console.log(`[${requestId}] Completed in ${duration}ms - Status: ${response.status}`);

        return response;
    } catch (error) {
        const duration = Date.now() - startTime;

        console.error(`[${requestId}] Failed after ${duration}ms:`, error.message);

        // Send to monitoring service
        reportError({ requestId, url, error: error.message, duration });

        throw error;
    }
}
```

## Key Takeaways

1. Always check `response.ok` - fetch doesn't throw on HTTP errors
2. Create custom error classes for better error categorization
3. Use `Promise.allSettled()` when you need partial success handling
4. Implement retry logic with exponential backoff for transient failures
5. Always clean up resources in `finally` blocks
6. Use AbortController for cancellable operations
7. Log errors with context for debugging

Proper error handling makes your applications more reliable and easier to debug. In the exercises, you'll practice implementing these patterns.
