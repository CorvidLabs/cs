---
title: Events
order: 2
estimatedMinutes: 18
---

# Events: Responding to User Actions

Events let you respond to user interactions - clicks, key presses, form submissions, and more. Understanding events is essential for building interactive web applications.

## Adding Event Listeners

The modern way to handle events:

```javascript
const button = document.querySelector("#myButton");

button.addEventListener("click", function() {
    console.log("Button clicked!");
});

// With arrow function
button.addEventListener("click", () => {
    console.log("Clicked!");
});

// Named function (better for removal)
function handleClick() {
    console.log("Clicked!");
}
button.addEventListener("click", handleClick);
```

## The Event Object

Event handlers receive an event object with useful information:

```javascript
button.addEventListener("click", function(event) {
    console.log(event.type);     // "click"
    console.log(event.target);   // The element that was clicked
    console.log(event.currentTarget);  // The element with the listener
    console.log(event.timeStamp);      // When the event occurred
});
```

### Mouse Events

```javascript
element.addEventListener("click", (e) => {
    console.log(e.clientX, e.clientY);  // Position in viewport
    console.log(e.pageX, e.pageY);      // Position in page
    console.log(e.button);              // 0=left, 1=middle, 2=right
});

// Other mouse events
element.addEventListener("dblclick", handleDoubleClick);
element.addEventListener("mouseenter", handleMouseEnter);
element.addEventListener("mouseleave", handleMouseLeave);
element.addEventListener("mousemove", handleMouseMove);
element.addEventListener("mousedown", handleMouseDown);
element.addEventListener("mouseup", handleMouseUp);
```

### Keyboard Events

```javascript
document.addEventListener("keydown", (e) => {
    console.log(e.key);       // "Enter", "a", "Shift", etc.
    console.log(e.code);      // "Enter", "KeyA", "ShiftLeft", etc.
    console.log(e.shiftKey);  // true if Shift was pressed
    console.log(e.ctrlKey);   // true if Ctrl was pressed
    console.log(e.altKey);    // true if Alt was pressed
    console.log(e.metaKey);   // true if Cmd (Mac) or Win key
});

// Example: Keyboard shortcut
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();  // Prevent browser save dialog
        console.log("Save shortcut pressed!");
    }
});
```

### Form Events

```javascript
const form = document.querySelector("form");
const input = document.querySelector("input");

// Form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();  // Prevent page reload
    console.log("Form submitted!");
});

// Input events
input.addEventListener("input", (e) => {
    console.log("Current value:", e.target.value);
});

input.addEventListener("change", (e) => {
    console.log("Value changed to:", e.target.value);
});

input.addEventListener("focus", () => console.log("Input focused"));
input.addEventListener("blur", () => console.log("Input lost focus"));
```

## Preventing Default Behavior

```javascript
// Prevent form submission reload
form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Handle form with JavaScript instead
});

// Prevent link navigation
link.addEventListener("click", (e) => {
    e.preventDefault();
    // Handle navigation with JavaScript
});

// Prevent context menu
element.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    // Show custom menu instead
});
```

## Event Propagation

Events travel through the DOM in phases:

1. **Capture phase**: From document down to target
2. **Target phase**: At the target element
3. **Bubble phase**: From target back up to document

```html
<div class="outer">
    <div class="inner">
        <button>Click me</button>
    </div>
</div>
```

```javascript
const outer = document.querySelector(".outer");
const inner = document.querySelector(".inner");
const button = document.querySelector("button");

// All three fire when button is clicked (bubble phase)
outer.addEventListener("click", () => console.log("outer"));
inner.addEventListener("click", () => console.log("inner"));
button.addEventListener("click", () => console.log("button"));

// Clicking button logs: "button", "inner", "outer"
```

### Stopping Propagation

```javascript
button.addEventListener("click", (e) => {
    e.stopPropagation();  // Prevents bubbling to parent elements
    console.log("Button clicked");
});

// Now clicking button only logs: "button"
```

### Capture Phase

```javascript
// Third argument true = capture phase
outer.addEventListener("click", () => console.log("outer capture"), true);
outer.addEventListener("click", () => console.log("outer bubble"));

// Clicking inner element:
// "outer capture" (going down)
// "outer bubble" (going up)
```

## Removing Event Listeners

```javascript
function handleClick() {
    console.log("Clicked!");
}

button.addEventListener("click", handleClick);

// Later, remove the listener
button.removeEventListener("click", handleClick);

// Note: Must use same function reference
// This won't work:
button.addEventListener("click", () => console.log("A"));
button.removeEventListener("click", () => console.log("A"));  // Different function!
```

### One-Time Listeners

```javascript
button.addEventListener("click", () => {
    console.log("This runs only once!");
}, { once: true });
```

## Common Event Types

### Window/Document Events

```javascript
// Page fully loaded (including images, styles)
window.addEventListener("load", () => {
    console.log("Page fully loaded");
});

// DOM ready (doesn't wait for images)
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM ready");
});

// Window resize
window.addEventListener("resize", () => {
    console.log(window.innerWidth, window.innerHeight);
});

// Scroll
window.addEventListener("scroll", () => {
    console.log(window.scrollY);
});

// Before leaving page
window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    e.returnValue = "";  // Show confirmation dialog
});
```

### Touch Events (Mobile)

```javascript
element.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    console.log(touch.clientX, touch.clientY);
});

element.addEventListener("touchmove", handleTouchMove);
element.addEventListener("touchend", handleTouchEnd);
```

## Practical Examples

### Toggle Class on Click

```javascript
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

menuButton.addEventListener("click", () => {
    menu.classList.toggle("open");
});
```

### Form Validation

```javascript
const form = document.querySelector("form");
const email = document.querySelector("#email");
const error = document.querySelector(".error");

email.addEventListener("input", () => {
    if (!email.validity.valid) {
        error.textContent = "Please enter a valid email";
        error.style.display = "block";
    } else {
        error.style.display = "none";
    }
});

form.addEventListener("submit", (e) => {
    if (!email.validity.valid) {
        e.preventDefault();
        email.focus();
    }
});
```

### Debouncing

Limit how often a handler runs:

```javascript
function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

const handleSearch = debounce((e) => {
    console.log("Searching for:", e.target.value);
}, 300);

searchInput.addEventListener("input", handleSearch);
```

## Key Takeaways

1. Use `addEventListener` to attach event handlers
2. The event object contains useful information about the event
3. `preventDefault()` stops the browser's default action
4. Events bubble up by default; use `stopPropagation()` to prevent
5. Remove listeners with `removeEventListener` using the same function reference
6. Use `{ once: true }` for one-time handlers
7. Debounce frequently-firing events like scroll and input

Next, we'll learn how to modify the DOM - adding, removing, and changing elements.
