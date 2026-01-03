---
title: Promises
order: 2
estimatedMinutes: 20
---

# Promises: Better Async Handling

Promises represent a value that may be available now, later, or never. They provide a cleaner way to handle asynchronous operations than callbacks.

## Promise States

A Promise is always in one of three states:

1. **Pending**: Initial state, operation in progress
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

Once a promise is fulfilled or rejected, it's "settled" and cannot change.

## Creating Promises

```javascript
const promise = new Promise((resolve, reject) => {
    // Async operation here
    const success = true;

    if (success) {
        resolve("Operation succeeded!");
    } else {
        reject(new Error("Operation failed"));
    }
});
```

### Example: Delayed Value

```javascript
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

delay(1000).then(() => {
    console.log("1 second has passed");
});
```

### Example: Simulated API Call

```javascript
function fetchUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id > 0) {
                resolve({ id, name: `User ${id}` });
            } else {
                reject(new Error("Invalid user ID"));
            }
        }, 100);
    });
}
```

## Consuming Promises

### .then() for Success

```javascript
fetchUser(1)
    .then((user) => {
        console.log("User:", user);
    });

// .then() returns a new promise, enabling chaining
fetchUser(1)
    .then((user) => {
        console.log("Got user:", user.name);
        return user.id;  // Pass value to next .then()
    })
    .then((id) => {
        console.log("User ID:", id);
    });
```

### .catch() for Errors

```javascript
fetchUser(-1)
    .then((user) => {
        console.log("User:", user);
    })
    .catch((error) => {
        console.error("Error:", error.message);
    });
```

### .finally() for Cleanup

```javascript
fetchUser(1)
    .then((user) => console.log(user))
    .catch((error) => console.error(error))
    .finally(() => {
        console.log("Operation complete");
        // Runs regardless of success or failure
    });
```

## Promise Chaining

Chain operations that depend on each other:

```javascript
fetchUser(1)
    .then((user) => {
        console.log("Got user:", user.name);
        return fetchOrders(user.id);
    })
    .then((orders) => {
        console.log("Got orders:", orders.length);
        return fetchOrderDetails(orders[0].id);
    })
    .then((details) => {
        console.log("Order details:", details);
    })
    .catch((error) => {
        // Catches error from any step in the chain
        console.error("Error:", error.message);
    });
```

Compare to callback hell - much cleaner!

## Error Handling in Chains

```javascript
// Error in the middle of a chain
fetchUser(1)
    .then((user) => {
        if (!user.active) {
            throw new Error("User is inactive");
        }
        return user;
    })
    .then((user) => {
        console.log("Active user:", user.name);
    })
    .catch((error) => {
        console.error("Error:", error.message);
    });

// Recovering from errors
fetchUser(-1)
    .catch((error) => {
        console.log("User not found, using default");
        return { id: 0, name: "Guest" };  // Return recovery value
    })
    .then((user) => {
        console.log("Using:", user.name);  // "Guest"
    });
```

## Promise Static Methods

### Promise.resolve() and Promise.reject()

Create already-settled promises:

```javascript
// Already fulfilled
Promise.resolve("immediate value")
    .then((value) => console.log(value));

// Already rejected
Promise.reject(new Error("immediate error"))
    .catch((error) => console.error(error));

// Useful for conditional async operations
function getData(useCache) {
    if (useCache) {
        return Promise.resolve(cachedData);
    }
    return fetchFromServer();
}
```

### Promise.all()

Wait for all promises to fulfill:

```javascript
const promises = [
    fetchUser(1),
    fetchUser(2),
    fetchUser(3)
];

Promise.all(promises)
    .then((users) => {
        console.log("All users:", users);
        // users is an array of all results
    })
    .catch((error) => {
        // If ANY promise rejects, catch is called
        console.error("One failed:", error);
    });

// Practical example
Promise.all([
    fetch("/api/user"),
    fetch("/api/posts"),
    fetch("/api/comments")
])
    .then(([userRes, postsRes, commentsRes]) => {
        // Destructure the results
    });
```

### Promise.allSettled()

Wait for all promises regardless of outcome:

```javascript
Promise.allSettled([
    fetchUser(1),
    fetchUser(-1),  // Will reject
    fetchUser(2)
])
    .then((results) => {
        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                console.log(`Promise ${index} succeeded:`, result.value);
            } else {
                console.log(`Promise ${index} failed:`, result.reason);
            }
        });
    });
```

### Promise.race()

Returns when the first promise settles:

```javascript
// Timeout pattern
function fetchWithTimeout(url, timeout) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), timeout)
        )
    ]);
}

fetchWithTimeout("/api/data", 5000)
    .then((response) => console.log("Got response"))
    .catch((error) => console.error(error.message));
```

### Promise.any()

Returns when the first promise fulfills (ignores rejections):

```javascript
// Try multiple sources, use first success
Promise.any([
    fetch("https://server1.com/data"),
    fetch("https://server2.com/data"),
    fetch("https://server3.com/data")
])
    .then((response) => {
        console.log("Got data from fastest server");
    })
    .catch((error) => {
        // Only if ALL promises reject
        console.error("All servers failed");
    });
```

## Converting Callbacks to Promises

```javascript
// Callback-based function
function readFileCallback(path, callback) {
    // ... reads file, calls callback(err, data)
}

// Promisified version
function readFilePromise(path) {
    return new Promise((resolve, reject) => {
        readFileCallback(path, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

// Usage
readFilePromise("data.txt")
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
```

## Key Takeaways

1. Promises represent eventual values with three states: pending, fulfilled, rejected
2. Use `.then()` for success, `.catch()` for errors, `.finally()` for cleanup
3. Promise chaining avoids callback nesting
4. Errors propagate through the chain to the nearest `.catch()`
5. `Promise.all()` waits for all; fails if any fails
6. `Promise.allSettled()` waits for all regardless of outcome
7. `Promise.race()` returns first to settle; `Promise.any()` returns first to fulfill

Next, we'll learn async/await - syntactic sugar that makes promises even easier to work with.
