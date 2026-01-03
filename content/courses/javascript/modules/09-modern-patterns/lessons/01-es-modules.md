---
title: ES Modules
order: 1
estimatedMinutes: 16
---

# ES Modules

ES Modules are JavaScript's native module system, allowing you to split code into separate files and import/export functionality between them.

## Why Modules?

Without modules, all JavaScript shares a global scope:

```javascript
// file1.js
var name = "Alice";  // Pollutes global scope

// file2.js
var name = "Bob";    // Overwrites the first name!
```

Modules solve this by giving each file its own scope.

## Named Exports

Export multiple items from a module:

```javascript
// math.js
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

export class Calculator {
    constructor() {
        this.result = 0;
    }
}
```

## Named Imports

Import specific items by name:

```javascript
// app.js
import { add, multiply, PI } from "./math.js";

console.log(add(2, 3));      // 5
console.log(multiply(4, 5)); // 20
console.log(PI);             // 3.14159
```

## Renaming Imports

Use `as` to rename imports:

```javascript
import { add as sum, multiply as product } from "./math.js";

console.log(sum(2, 3));      // 5
console.log(product(4, 5));  // 20
```

## Import Everything

Use `* as` to import all exports as an object:

```javascript
import * as math from "./math.js";

console.log(math.add(2, 3));      // 5
console.log(math.PI);             // 3.14159
console.log(math.Calculator);     // [class Calculator]
```

## Default Exports

Each module can have one default export:

```javascript
// logger.js
export default class Logger {
    log(message) {
        console.log(`[LOG] ${message}`);
    }

    error(message) {
        console.error(`[ERROR] ${message}`);
    }
}
```

Import default exports without braces:

```javascript
// app.js
import Logger from "./logger.js";

const logger = new Logger();
logger.log("Application started");
```

## Combining Default and Named Exports

A module can have both:

```javascript
// api.js
export const BASE_URL = "https://api.example.com";

export function get(endpoint) {
    return fetch(BASE_URL + endpoint);
}

export default class ApiClient {
    constructor(token) {
        this.token = token;
    }
}
```

Import both together:

```javascript
import ApiClient, { BASE_URL, get } from "./api.js";

const client = new ApiClient("token123");
console.log(BASE_URL);
```

## Re-exporting

Aggregate exports from multiple modules:

```javascript
// utils/index.js
export { add, multiply } from "./math.js";
export { formatDate, parseDate } from "./dates.js";
export { default as Logger } from "./logger.js";

// Now import from single file
// app.js
import { add, formatDate, Logger } from "./utils/index.js";
```

## Export Lists

Export multiple items at once:

```javascript
// helpers.js
const helper1 = () => {};
const helper2 = () => {};
const helper3 = () => {};

export { helper1, helper2, helper3 };

// With renaming
export { helper1 as h1, helper2 as h2, helper3 as h3 };
```

## Dynamic Imports

Import modules dynamically at runtime:

```javascript
async function loadFeature(featureName) {
    const module = await import(`./features/${featureName}.js`);
    return module.default;
}

// Conditional loading
if (needsHeavyModule) {
    const { process } = await import("./heavy-processor.js");
    process(data);
}
```

Dynamic imports return a Promise and are useful for:
- Code splitting
- Conditional loading
- Loading modules based on user actions

## Module Patterns

### Barrel Exports

Create an index file that re-exports from subdirectories:

```javascript
// components/index.js
export { Button } from "./Button.js";
export { Input } from "./Input.js";
export { Modal } from "./Modal.js";

// Usage
import { Button, Input, Modal } from "./components/index.js";
```

### Factory Functions

Export functions that create configured objects:

```javascript
// database.js
export function createConnection(config) {
    return {
        query(sql) {
            // Use config.host, config.port, etc.
        },
        close() {
            // Cleanup
        }
    };
}

// app.js
import { createConnection } from "./database.js";
const db = createConnection({ host: "localhost", port: 5432 });
```

### Singleton Pattern

Export a single instance:

```javascript
// config.js
class Config {
    constructor() {
        this.settings = {};
    }

    set(key, value) {
        this.settings[key] = value;
    }

    get(key) {
        return this.settings[key];
    }
}

export default new Config();  // Export instance, not class

// app.js
import config from "./config.js";
config.set("theme", "dark");

// other.js
import config from "./config.js";
console.log(config.get("theme"));  // "dark" - same instance!
```

## Module Loading in Browsers

Use `type="module"` in script tags:

```html
<script type="module" src="app.js"></script>

<!-- Inline module -->
<script type="module">
    import { greet } from "./greet.js";
    greet("World");
</script>
```

Module scripts are:
- Deferred by default (run after HTML parsing)
- Strict mode automatically
- Have their own scope

## Module Loading in Node.js

Use `.mjs` extension or set `"type": "module"` in package.json:

```json
{
    "name": "my-app",
    "type": "module"
}
```

Then use ES module syntax:

```javascript
// app.js
import express from "express";
import { readFile } from "fs/promises";
```

## Key Takeaways

1. Use `export` to expose functionality and `import` to use it
2. Named exports use braces: `import { name } from "./module.js"`
3. Default exports don't use braces: `import Name from "./module.js"`
4. Use `* as` to import everything as an object
5. Dynamic `import()` returns a Promise for code splitting
6. Each module has its own scope - no global pollution
7. Use barrel files (index.js) to simplify imports

Next, we'll learn about destructuring for cleaner data extraction.
