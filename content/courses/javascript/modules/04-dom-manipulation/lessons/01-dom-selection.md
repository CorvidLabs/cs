---
title: DOM Selection
order: 1
estimatedMinutes: 16
---

# DOM Selection: Finding Elements

The Document Object Model (DOM) is a programming interface for web documents. It represents the page as a tree of objects that JavaScript can manipulate.

## What is the DOM?

When a browser loads an HTML page, it creates a DOM - a structured representation of the document:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1 id="title">Hello</h1>
    <p class="intro">Welcome!</p>
</body>
</html>
```

The DOM tree:
```
document
└── html
    ├── head
    │   └── title
    │       └── "My Page"
    └── body
        ├── h1#title
        │   └── "Hello"
        └── p.intro
            └── "Welcome!"
```

## Selecting Single Elements

### getElementById

Select by ID (fastest method):

```javascript
const title = document.getElementById("title");
console.log(title);  // <h1 id="title">Hello</h1>
console.log(title.textContent);  // "Hello"
```

### querySelector

Select using CSS selectors (most flexible):

```javascript
// By ID
const title = document.querySelector("#title");

// By class
const intro = document.querySelector(".intro");

// By tag
const firstParagraph = document.querySelector("p");

// Complex selectors
const navLink = document.querySelector("nav a.active");
const input = document.querySelector("form input[type='email']");
```

`querySelector` returns the first matching element, or `null` if none found.

## Selecting Multiple Elements

### querySelectorAll

Returns a NodeList of all matching elements:

```javascript
// All paragraphs
const paragraphs = document.querySelectorAll("p");
console.log(paragraphs.length);  // Number of matches

// All elements with class "item"
const items = document.querySelectorAll(".item");

// Iterate over results
paragraphs.forEach((p, index) => {
    console.log(`Paragraph ${index}: ${p.textContent}`);
});

// Convert to array for more array methods
const itemsArray = Array.from(items);
// or
const itemsArray2 = [...items];
```

### getElementsByClassName

Returns a live HTMLCollection:

```javascript
const buttons = document.getElementsByClassName("btn");
console.log(buttons.length);

// Access by index
console.log(buttons[0]);

// Note: HTMLCollection is "live" - it updates automatically
// when matching elements are added/removed
```

### getElementsByTagName

Select all elements of a specific tag:

```javascript
const divs = document.getElementsByTagName("div");
const links = document.getElementsByTagName("a");
```

## NodeList vs HTMLCollection

```javascript
// NodeList (from querySelectorAll)
const nodeList = document.querySelectorAll(".item");
nodeList.forEach(item => console.log(item));  // forEach works!

// HTMLCollection (from getElementsByClassName)
const htmlCollection = document.getElementsByClassName("item");
// htmlCollection.forEach(...)  // Error! No forEach on HTMLCollection

// Convert HTMLCollection to array
Array.from(htmlCollection).forEach(item => console.log(item));

// Key difference: HTMLCollection is "live"
const items = document.getElementsByClassName("item");
console.log(items.length);  // e.g., 3

document.body.innerHTML += '<div class="item">New</div>';
console.log(items.length);  // Now 4! (automatically updated)
```

## Traversing the DOM

Navigate between related elements:

```javascript
const element = document.querySelector(".target");

// Parent
const parent = element.parentElement;
const parentNode = element.parentNode;  // Can include non-element nodes

// Children
const children = element.children;           // HTMLCollection of child elements
const childNodes = element.childNodes;       // NodeList including text nodes
const firstChild = element.firstElementChild;
const lastChild = element.lastElementChild;

// Siblings
const next = element.nextElementSibling;
const previous = element.previousElementSibling;
```

### Example: Navigation

```html
<ul id="nav">
    <li>Home</li>
    <li class="active">About</li>
    <li>Contact</li>
</ul>
```

```javascript
const active = document.querySelector(".active");

console.log(active.parentElement);           // <ul id="nav">
console.log(active.previousElementSibling);  // <li>Home</li>
console.log(active.nextElementSibling);      // <li>Contact</li>

const nav = document.querySelector("#nav");
console.log(nav.children);                   // [<li>, <li>, <li>]
console.log(nav.firstElementChild);          // <li>Home</li>
```

## Searching Within Elements

Query from any element, not just document:

```javascript
const container = document.querySelector(".container");

// Find elements only within container
const buttons = container.querySelectorAll("button");
const title = container.querySelector("h2");
```

## Checking Element Properties

```javascript
const element = document.querySelector("#myElement");

// Check if element exists
if (element) {
    console.log("Element found!");
}

// Check if element matches a selector
if (element.matches(".active")) {
    console.log("Element has active class");
}

// Find closest ancestor matching selector
const closestForm = element.closest("form");
const closestContainer = element.closest(".container");
```

## Common Patterns

### Safe Selection

```javascript
function getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
    return element;
}

const button = getElement("#submit-btn");
if (button) {
    // Safe to use button
}
```

### Waiting for DOM

```javascript
// Scripts in <head> run before body exists
// Use DOMContentLoaded event

document.addEventListener("DOMContentLoaded", () => {
    // DOM is fully loaded and parsed
    const element = document.querySelector("#myElement");
    console.log(element);  // Now this works!
});

// Or place scripts at end of <body>
// Or use defer attribute: <script defer src="script.js">
```

### Working with Forms

```javascript
// Get form
const form = document.querySelector("#myForm");

// Access form elements by name
const email = form.elements.email;
const password = form.elements.password;

// Or query within form
const submitBtn = form.querySelector("button[type='submit']");
```

## Key Takeaways

1. `querySelector` uses CSS selectors to find one element
2. `querySelectorAll` returns a NodeList of all matches
3. `getElementById` is fastest for ID-based selection
4. NodeList supports `forEach`; HTMLCollection needs conversion
5. Use `parentElement`, `children`, `nextElementSibling` to traverse
6. Query from any element to limit search scope
7. Wait for `DOMContentLoaded` or use `defer` for scripts in `<head>`

Next, we'll learn how to respond to user interactions with event handling.
