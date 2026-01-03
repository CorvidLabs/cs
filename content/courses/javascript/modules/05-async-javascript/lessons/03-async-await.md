---
title: Async/Await
order: 3
estimatedMinutes: 18
---

# Async/Await: Clean Asynchronous Code

Async/await is syntactic sugar over promises that makes asynchronous code look and behave more like synchronous code.

## Basic Syntax

### async Functions

The `async` keyword marks a function as asynchronous:

```javascript
async function fetchData() {
    return "Hello";
}

// async functions always return a Promise
fetchData().then(result => console.log(result));  // "Hello"

// Arrow function syntax
const fetchData2 = async () => {
    return "World";
};
```

### await Expressions

`await` pauses execution until a Promise settles:

```javascript
async function getUser() {
    // await pauses here until the promise resolves
    const response = await fetch("/api/user");
    const user = await response.json();
    return user;
}

// Calling the async function
getUser().then(user => console.log(user));
```

## Comparing Promises and Async/Await

### With Promises

```javascript
function loadUserData(userId) {
    return fetch(`/api/users/${userId}`)
        .then(response => response.json())
        .then(user => fetch(`/api/posts?userId=${user.id}`))
        .then(response => response.json())
        .then(posts => {
            return { user, posts };
        });
}
```

### With Async/Await

```javascript
async function loadUserData(userId) {
    const userResponse = await fetch(`/api/users/${userId}`);
    const user = await userResponse.json();

    const postsResponse = await fetch(`/api/posts?userId=${user.id}`);
    const posts = await postsResponse.json();

    return { user, posts };
}
```

Much more readable!

## Error Handling

### try/catch

```javascript
async function fetchUser(id) {
    try {
        const response = await fetch(`/api/users/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw error;  // Re-throw if caller should handle it
    }
}
```

### Handling Multiple Operations

```javascript
async function processData() {
    try {
        const data = await fetchData();
        const validated = await validateData(data);
        const result = await saveData(validated);
        return result;
    } catch (error) {
        // Handle error from any step
        console.error("Processing failed:", error);
        return null;
    } finally {
        // Cleanup code runs regardless
        console.log("Processing complete");
    }
}
```

### Error Handling Without try/catch

Use `.catch()` on the returned promise:

```javascript
async function riskyOperation() {
    const result = await somethingDangerous();
    return result;
}

// Handle error at call site
riskyOperation()
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

## Parallel Execution

### Sequential (Slow)

```javascript
async function loadAllData() {
    // Each await waits for the previous to complete
    const users = await fetchUsers();      // 1 second
    const posts = await fetchPosts();      // 1 second
    const comments = await fetchComments(); // 1 second
    // Total: ~3 seconds
    return { users, posts, comments };
}
```

### Parallel (Fast)

```javascript
async function loadAllData() {
    // Start all requests simultaneously
    const [users, posts, comments] = await Promise.all([
        fetchUsers(),
        fetchPosts(),
        fetchComments()
    ]);
    // Total: ~1 second (limited by slowest)
    return { users, posts, comments };
}
```

### Parallel with Error Handling

```javascript
async function loadAllDataSafely() {
    const results = await Promise.allSettled([
        fetchUsers(),
        fetchPosts(),
        fetchComments()
    ]);

    const data = {};
    if (results[0].status === "fulfilled") data.users = results[0].value;
    if (results[1].status === "fulfilled") data.posts = results[1].value;
    if (results[2].status === "fulfilled") data.comments = results[2].value;

    return data;
}
```

## Loops with Async/Await

### Sequential Processing

```javascript
async function processItems(items) {
    const results = [];

    for (const item of items) {
        // Each iteration waits for the previous
        const result = await processItem(item);
        results.push(result);
    }

    return results;
}
```

### Parallel Processing

```javascript
async function processItems(items) {
    // All items processed in parallel
    const results = await Promise.all(
        items.map(item => processItem(item))
    );
    return results;
}
```

### Controlled Parallel Processing

```javascript
async function processInBatches(items, batchSize) {
    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(item => processItem(item))
        );
        results.push(...batchResults);
    }

    return results;
}

// Process 100 items, 10 at a time
processInBatches(items, 10);
```

## Top-Level Await

In ES modules, you can use await at the top level:

```javascript
// config.js (ES module)
const response = await fetch("/api/config");
export const config = await response.json();

// main.js
import { config } from "./config.js";
console.log(config);  // Already loaded!
```

## Common Patterns

### Retry Logic

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            console.log(`Attempt ${attempt} failed`);
            if (attempt === maxRetries) throw error;
            await delay(1000 * attempt);  // Exponential backoff
        }
    }
}
```

### Loading State

```javascript
async function loadData(setState) {
    setState({ loading: true, error: null });

    try {
        const data = await fetchData();
        setState({ data, loading: false, error: null });
    } catch (error) {
        setState({ loading: false, error: error.message });
    }
}
```

### Timeout

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { signal: controller.signal });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}
```

## Common Mistakes

### Forgetting await

```javascript
async function buggy() {
    const data = fetch("/api/data");  // Missing await!
    console.log(data);  // Promise object, not the data
}
```

### Using await in Non-Async Function

```javascript
function wrong() {
    const data = await fetch("/api/data");  // SyntaxError!
}

// Must be async
async function right() {
    const data = await fetch("/api/data");
}
```

### Not Handling Errors

```javascript
// Unhandled rejection if fetch fails
async function risky() {
    const data = await fetch("/api/data");
    return data.json();
}

// Better: handle errors
async function safe() {
    try {
        const data = await fetch("/api/data");
        return data.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
```

## Key Takeaways

1. `async` functions always return promises
2. `await` pauses execution until a promise settles
3. Use try/catch for error handling
4. Use `Promise.all()` for parallel execution
5. Sequential loops are fine; parallel uses `Promise.all()` with map
6. Don't forget `await` - common source of bugs
7. Top-level await works in ES modules

Next, we'll learn the Fetch API - the modern way to make HTTP requests in JavaScript.
