---
title: REST APIs
order: 2
estimatedMinutes: 14
---

# Understanding REST APIs

REST (Representational State Transfer) is an architectural style for designing web APIs. Understanding REST conventions helps you work with APIs effectively and design your own.

## REST Principles

### Resources and URLs

REST APIs organize data as resources with unique URLs:

```
GET    /users          - List all users
GET    /users/123      - Get user with id 123
POST   /users          - Create a new user
PUT    /users/123      - Replace user 123
PATCH  /users/123      - Update user 123 partially
DELETE /users/123      - Delete user 123
```

### HTTP Methods

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| GET | Read resource | Yes | Yes |
| POST | Create resource | No | No |
| PUT | Replace resource | Yes | No |
| PATCH | Update resource | No | No |
| DELETE | Delete resource | Yes | No |

**Idempotent**: Multiple identical requests have same effect as single request
**Safe**: Does not modify server state

## Nested Resources

Represent relationships through URL hierarchy:

```
GET    /users/123/posts      - Get posts by user 123
POST   /users/123/posts      - Create post for user 123
GET    /users/123/posts/456  - Get post 456 by user 123
```

```javascript
// Fetching nested resources
async function getUserPosts(userId) {
    const response = await fetch(`/api/users/${userId}/posts`);
    return response.json();
}

async function createPost(userId, postData) {
    const response = await fetch(`/api/users/${userId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
    });
    return response.json();
}
```

## Query Parameters

Filter, sort, and paginate with query parameters:

```
GET /users?role=admin                    - Filter by role
GET /users?sort=name&order=asc          - Sort results
GET /users?page=2&limit=20              - Paginate
GET /users?fields=id,name,email         - Select fields
GET /posts?author=123&status=published  - Multiple filters
```

```javascript
async function getUsers(options = {}) {
    const params = new URLSearchParams();

    if (options.role) params.append("role", options.role);
    if (options.sort) params.append("sort", options.sort);
    if (options.page) params.append("page", options.page);
    if (options.limit) params.append("limit", options.limit);

    const response = await fetch(`/api/users?${params}`);
    return response.json();
}

// Usage
const admins = await getUsers({ role: "admin", sort: "name" });
const page2 = await getUsers({ page: 2, limit: 20 });
```

## HTTP Status Codes

### Success Codes (2xx)

| Code | Name | When to Use |
|------|------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |

### Client Error Codes (4xx)

| Code | Name | When to Use |
|------|------|-------------|
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not permitted |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity | Validation errors |

### Server Error Codes (5xx)

| Code | Name | When to Use |
|------|------|-------------|
| 500 | Internal Server Error | Unexpected server error |
| 502 | Bad Gateway | Upstream server error |
| 503 | Service Unavailable | Server temporarily down |

```javascript
async function handleApiResponse(response) {
    if (response.ok) {
        if (response.status === 204) {
            return null;  // No content
        }
        return response.json();
    }

    switch (response.status) {
        case 400:
            throw new Error("Invalid request");
        case 401:
            throw new Error("Please log in");
        case 403:
            throw new Error("Access denied");
        case 404:
            throw new Error("Resource not found");
        case 422: {
            const errors = await response.json();
            throw new ValidationError(errors);
        }
        case 500:
            throw new Error("Server error");
        default:
            throw new Error(`HTTP error ${response.status}`);
    }
}
```

## Common API Response Formats

### Single Resource

```json
{
    "id": 123,
    "name": "Alice",
    "email": "alice@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
}
```

### Collection with Pagination

```json
{
    "data": [
        { "id": 1, "name": "Alice" },
        { "id": 2, "name": "Bob" }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
    }
}
```

### Error Response

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input",
        "details": [
            { "field": "email", "message": "Invalid email format" }
        ]
    }
}
```

## Working with Paginated APIs

```javascript
// Fetch single page
async function getUsers(page = 1, limit = 20) {
    const response = await fetch(`/api/users?page=${page}&limit=${limit}`);
    return response.json();
}

// Fetch all pages
async function getAllUsers() {
    const allUsers = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const result = await getUsers(page);
        allUsers.push(...result.data);

        hasMore = page < result.pagination.totalPages;
        page++;
    }

    return allUsers;
}

// Generator for lazy loading
async function* paginatedUsers() {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const result = await getUsers(page);
        yield* result.data;

        hasMore = page < result.pagination.totalPages;
        page++;
    }
}

// Usage
for await (const user of paginatedUsers()) {
    console.log(user.name);
}
```

## Authentication Headers

### Bearer Token (JWT)

```javascript
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        }
    });
}
```

### API Key

```javascript
async function fetchWithApiKey(url) {
    return fetch(url, {
        headers: {
            "X-API-Key": process.env.API_KEY
        }
    });
}
```

## CRUD Operations Example

```javascript
class UserApi {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    // Create
    async create(userData) {
        const response = await fetch(`${this.baseUrl}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        return this.handleResponse(response);
    }

    // Read (single)
    async getById(id) {
        const response = await fetch(`${this.baseUrl}/users/${id}`);
        return this.handleResponse(response);
    }

    // Read (list)
    async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${this.baseUrl}/users?${query}`);
        return this.handleResponse(response);
    }

    // Update
    async update(id, userData) {
        const response = await fetch(`${this.baseUrl}/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        return this.handleResponse(response);
    }

    // Delete
    async delete(id) {
        const response = await fetch(`${this.baseUrl}/users/${id}`, {
            method: "DELETE"
        });
        if (response.status === 204) return true;
        return this.handleResponse(response);
    }

    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        return response.json();
    }
}

// Usage
const userApi = new UserApi("https://api.example.com");

const users = await userApi.getAll({ role: "admin" });
const user = await userApi.getById(123);
const newUser = await userApi.create({ name: "Alice", email: "alice@example.com" });
await userApi.update(123, { name: "Alice Smith" });
await userApi.delete(123);
```

## Key Takeaways

1. REST uses standard HTTP methods for CRUD operations
2. URLs represent resources; hierarchies represent relationships
3. Query parameters handle filtering, sorting, and pagination
4. Status codes convey operation results
5. Consistent response formats improve API usability
6. Authentication usually uses Authorization header
7. CRUD operations map to POST, GET, PUT/PATCH, DELETE

In the next lesson, we'll dive deeper into working with JSON data.
