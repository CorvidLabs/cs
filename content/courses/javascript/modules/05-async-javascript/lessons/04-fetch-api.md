---
title: Fetch API
order: 4
estimatedMinutes: 18
---

# Fetch API: Making HTTP Requests

The Fetch API is the modern way to make HTTP requests in JavaScript. It's built on Promises and provides a clean, powerful interface for network operations.

## Basic GET Request

```javascript
// Simple fetch
const response = await fetch("https://api.example.com/data");
const data = await response.json();
console.log(data);

// With error handling
async function getData() {
    try {
        const response = await fetch("https://api.example.com/data");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch failed:", error);
        throw error;
    }
}
```

## The Response Object

```javascript
const response = await fetch("/api/data");

// Response properties
console.log(response.status);     // 200
console.log(response.statusText); // "OK"
console.log(response.ok);         // true (status 200-299)
console.log(response.headers);    // Headers object
console.log(response.url);        // Final URL (after redirects)

// Response body methods (can only use one!)
const json = await response.json();     // Parse as JSON
const text = await response.text();     // Get as string
const blob = await response.blob();     // Get as Blob
const buffer = await response.arrayBuffer(); // Get as ArrayBuffer
const formData = await response.formData();  // Parse as FormData
```

## POST Requests

### Sending JSON

```javascript
async function createUser(userData) {
    const response = await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
    }

    return await response.json();
}

// Usage
const newUser = await createUser({
    name: "Alice",
    email: "alice@example.com"
});
```

### Sending Form Data

```javascript
// From a form element
const form = document.querySelector("form");
const formData = new FormData(form);

const response = await fetch("/api/submit", {
    method: "POST",
    body: formData  // No Content-Type header needed
});

// Manually creating FormData
const data = new FormData();
data.append("name", "Alice");
data.append("file", fileInput.files[0]);

await fetch("/api/upload", {
    method: "POST",
    body: data
});
```

## Other HTTP Methods

```javascript
// PUT - Update resource
await fetch("/api/users/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Updated Name" })
});

// PATCH - Partial update
await fetch("/api/users/1", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "New Name" })
});

// DELETE
await fetch("/api/users/1", {
    method: "DELETE"
});
```

## Headers

```javascript
// Create headers object
const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Authorization", "Bearer token123");

// Or use object literal
const response = await fetch("/api/data", {
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer token123",
        "X-Custom-Header": "value"
    }
});

// Reading response headers
console.log(response.headers.get("Content-Type"));
response.headers.forEach((value, key) => {
    console.log(`${key}: ${value}`);
});
```

## Request Options

```javascript
const response = await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),

    // Credentials for cookies
    credentials: "include",      // Always send
    credentials: "same-origin",  // Same origin only (default)
    credentials: "omit",         // Never send

    // CORS mode
    mode: "cors",         // Cross-origin requests (default)
    mode: "same-origin",  // Same origin only
    mode: "no-cors",      // Limited, opaque response

    // Cache control
    cache: "default",
    cache: "no-store",
    cache: "reload",
    cache: "force-cache",

    // Redirect handling
    redirect: "follow",  // Follow redirects (default)
    redirect: "error",   // Throw on redirect
    redirect: "manual",  // Handle manually
});
```

## Aborting Requests

```javascript
const controller = new AbortController();

// Start the fetch
const fetchPromise = fetch("/api/slow-endpoint", {
    signal: controller.signal
});

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
    const response = await fetchPromise;
    const data = await response.json();
} catch (error) {
    if (error.name === "AbortError") {
        console.log("Request was cancelled");
    } else {
        throw error;
    }
}
```

### Timeout Helper

```javascript
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return response;
    } finally {
        clearTimeout(id);
    }
}
```

## Error Handling Best Practices

```javascript
class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    });

    // Handle HTTP errors
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { message: response.statusText };
        }

        throw new APIError(
            errorData.message || "Request failed",
            response.status,
            errorData
        );
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

// Usage
try {
    const data = await apiRequest("/api/users");
} catch (error) {
    if (error instanceof APIError) {
        console.error(`API Error ${error.status}:`, error.data);
    } else {
        console.error("Network error:", error);
    }
}
```

## Practical Examples

### Fetching and Displaying Data

```javascript
async function loadUsers() {
    const container = document.querySelector("#users");
    container.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to load users");

        const users = await response.json();

        container.innerHTML = users.map(user => `
            <div class="user">
                <h3>${user.name}</h3>
                <p>${user.email}</p>
            </div>
        `).join("");

    } catch (error) {
        container.innerHTML = `<p class="error">${error.message}</p>`;
    }
}
```

### Search with Debounce

```javascript
let controller = null;

async function search(query) {
    // Cancel previous request
    if (controller) {
        controller.abort();
    }

    controller = new AbortController();

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
            signal: controller.signal
        });

        const results = await response.json();
        displayResults(results);

    } catch (error) {
        if (error.name !== "AbortError") {
            console.error(error);
        }
    }
}

// Debounce search input
let timeout;
searchInput.addEventListener("input", (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => search(e.target.value), 300);
});
```

## Key Takeaways

1. `fetch()` returns a Promise that resolves to a Response object
2. Check `response.ok` - fetch only rejects on network errors, not HTTP errors
3. Response body can only be read once - choose json(), text(), blob(), etc.
4. Use `JSON.stringify()` for request body and set Content-Type header
5. Use AbortController to cancel requests and implement timeouts
6. credentials option controls cookie sending
7. Always handle both network errors and HTTP errors

Mastering the Fetch API enables you to build data-driven web applications that communicate with APIs and servers.
