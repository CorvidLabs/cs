---
title: The Fetch API
order: 1
estimatedMinutes: 16
---

# The Fetch API

The Fetch API is the modern way to make HTTP requests in JavaScript. It's built into browsers and provides a clean, Promise-based interface for network operations.

## Basic GET Request

```javascript
async function fetchUser(id) {
    const response = await fetch(`https://api.example.com/users/${id}`);
    const user = await response.json();
    return user;
}

// Usage
const user = await fetchUser(1);
console.log(user.name);
```

## Understanding the Response

`fetch()` returns a `Response` object with several useful properties:

```javascript
const response = await fetch("https://api.example.com/users");

// Response properties
console.log(response.ok);          // true if status 200-299
console.log(response.status);       // HTTP status code (200, 404, etc.)
console.log(response.statusText);   // Status message ("OK", "Not Found")
console.log(response.headers);      // Response headers

// Get body as different formats
const json = await response.json();     // Parse as JSON
const text = await response.text();     // Get as text
const blob = await response.blob();     // Get as Blob (binary)
const buffer = await response.arrayBuffer();  // Get as ArrayBuffer
```

## Handling Errors

Fetch only rejects on network errors, not HTTP errors:

```javascript
async function fetchUser(id) {
    const response = await fetch(`/api/users/${id}`);

    // Check if request was successful
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
}

// Usage with error handling
try {
    const user = await fetchUser(999);
    console.log(user);
} catch (error) {
    console.error("Failed to fetch user:", error.message);
}
```

## POST Requests

Send data with POST requests:

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
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
}

// Usage
const newUser = await createUser({
    name: "Alice",
    email: "alice@example.com"
});
```

## Other HTTP Methods

```javascript
// PUT - Update entire resource
async function updateUser(id, userData) {
    const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
}

// PATCH - Partial update
async function patchUser(id, updates) {
    const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
}

// DELETE
async function deleteUser(id) {
    const response = await fetch(`/api/users/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.ok;
}
```

## Request Headers

Add custom headers to requests:

```javascript
async function fetchWithAuth(url) {
    const token = getAuthToken();

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    return response.json();
}
```

## Query Parameters

Build URLs with query parameters:

```javascript
function buildUrl(baseUrl, params) {
    const url = new URL(baseUrl);

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, value);
        }
    }

    return url.toString();
}

// Usage
async function searchUsers(query, page = 1, limit = 10) {
    const url = buildUrl("/api/users", {
        q: query,
        page,
        limit
    });
    // Results in: /api/users?q=alice&page=1&limit=10

    const response = await fetch(url);
    return response.json();
}
```

## Timeout and Cancellation

Use AbortController to cancel requests:

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            signal: controller.signal
        });

        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Request timed out");
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

// Manual cancellation
const controller = new AbortController();

// Start request
const promise = fetch("/api/data", { signal: controller.signal });

// Cancel it later
controller.abort();
```

## Working with FormData

Send form data or files:

```javascript
// Form data
async function submitForm(formElement) {
    const formData = new FormData(formElement);

    const response = await fetch("/api/submit", {
        method: "POST",
        body: formData  // No Content-Type header needed
    });

    return response.json();
}

// File upload
async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);

    const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
    });

    return response.json();
}
```

## Response Headers

Access response headers:

```javascript
async function fetchWithHeaders(url) {
    const response = await fetch(url);

    // Access headers
    const contentType = response.headers.get("Content-Type");
    const cacheControl = response.headers.get("Cache-Control");

    // Iterate all headers
    for (const [key, value] of response.headers) {
        console.log(`${key}: ${value}`);
    }

    return response.json();
}
```

## Fetch Options Summary

```javascript
fetch(url, {
    method: "POST",              // GET, POST, PUT, PATCH, DELETE
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer token"
    },
    body: JSON.stringify(data),  // Request body
    mode: "cors",                // cors, no-cors, same-origin
    credentials: "include",      // include, same-origin, omit
    cache: "no-cache",           // default, no-cache, reload, force-cache
    redirect: "follow",          // follow, error, manual
    signal: abortController.signal  // AbortSignal for cancellation
});
```

## Creating a Fetch Wrapper

```javascript
class ApiClient {
    constructor(baseUrl, defaultHeaders = {}) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = defaultHeaders;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...this.defaultHeaders,
                ...options.headers
            }
        };

        if (config.body && typeof config.body === "object") {
            config.body = JSON.stringify(config.body);
        }

        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    get(endpoint, options) {
        return this.request(endpoint, { ...options, method: "GET" });
    }

    post(endpoint, body, options) {
        return this.request(endpoint, { ...options, method: "POST", body });
    }

    put(endpoint, body, options) {
        return this.request(endpoint, { ...options, method: "PUT", body });
    }

    delete(endpoint, options) {
        return this.request(endpoint, { ...options, method: "DELETE" });
    }
}

// Usage
const api = new ApiClient("https://api.example.com", {
    "Authorization": "Bearer token123"
});

const users = await api.get("/users");
const newUser = await api.post("/users", { name: "Alice" });
```

## Key Takeaways

1. `fetch()` returns a Promise that resolves to a Response object
2. Always check `response.ok` - fetch doesn't reject on HTTP errors
3. Use `response.json()` to parse JSON responses
4. POST/PUT/PATCH need `method`, `headers`, and `body` options
5. Use AbortController for timeouts and cancellation
6. FormData handles file uploads automatically
7. Create wrapper classes for cleaner API code

In the next lesson, we'll learn about REST API conventions and best practices.
