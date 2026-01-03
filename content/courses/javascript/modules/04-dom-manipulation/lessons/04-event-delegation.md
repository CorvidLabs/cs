---
title: Event Delegation
order: 4
estimatedMinutes: 14
---

# Event Delegation: Efficient Event Handling

Event delegation is a pattern that takes advantage of event bubbling to handle events efficiently, especially for dynamic content and large lists.

## The Problem with Individual Listeners

Consider a list with many items:

```html
<ul id="todo-list">
    <li>Task 1 <button class="delete">X</button></li>
    <li>Task 2 <button class="delete">X</button></li>
    <li>Task 3 <button class="delete">X</button></li>
    <!-- ... many more items -->
</ul>
```

The naive approach attaches a listener to each button:

```javascript
// Inefficient: One listener per button
const buttons = document.querySelectorAll(".delete");
buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.target.closest("li").remove();
    });
});
```

Problems:
1. **Memory**: Each listener consumes memory
2. **Performance**: Adding many listeners takes time
3. **Dynamic content**: New items don't get listeners

## The Solution: Event Delegation

Attach one listener to a parent element and use event bubbling:

```javascript
// Efficient: One listener on parent
const list = document.querySelector("#todo-list");

list.addEventListener("click", (e) => {
    // Check if a delete button was clicked
    if (e.target.matches(".delete")) {
        e.target.closest("li").remove();
    }
});
```

Benefits:
1. **Memory efficient**: Only one listener
2. **Faster setup**: No looping through elements
3. **Handles dynamic content**: New items automatically work

## Understanding Event Bubbling

When you click a button inside a list item:

```
Click on button
    ↓
button receives click event
    ↓
li receives click event (bubbles up)
    ↓
ul receives click event (bubbles up)
    ↓
body receives click event (bubbles up)
    ↓
... continues to document
```

The parent listener catches the bubbled event and checks what was clicked.

## Using matches() and closest()

### matches()

Checks if element matches a selector:

```javascript
list.addEventListener("click", (e) => {
    if (e.target.matches("button.delete")) {
        // Handle delete button click
    }

    if (e.target.matches("button.edit")) {
        // Handle edit button click
    }

    if (e.target.matches(".item-title")) {
        // Handle title click
    }
});
```

### closest()

Finds the nearest ancestor matching a selector:

```javascript
list.addEventListener("click", (e) => {
    // Find the list item, even if we clicked a child element
    const item = e.target.closest("li");
    if (!item) return;  // Click wasn't inside an li

    // Get data from the list item
    const itemId = item.dataset.id;

    if (e.target.matches(".delete")) {
        deleteItem(itemId);
    } else if (e.target.matches(".edit")) {
        editItem(itemId);
    }
});
```

## Handling Multiple Event Types

```javascript
const container = document.querySelector(".container");

function handleContainerClick(e) {
    const button = e.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;

    switch (action) {
        case "delete":
            handleDelete(button);
            break;
        case "edit":
            handleEdit(button);
            break;
        case "view":
            handleView(button);
            break;
    }
}

container.addEventListener("click", handleContainerClick);
```

## Dynamic Content Example

```javascript
const form = document.querySelector("#add-form");
const list = document.querySelector("#item-list");

// Handle form submission - adds new items
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");

    const li = document.createElement("li");
    li.innerHTML = `
        <span class="text">${input.value}</span>
        <button class="edit" data-action="edit">Edit</button>
        <button class="delete" data-action="delete">Delete</button>
    `;
    li.dataset.id = Date.now();  // Unique ID

    list.appendChild(li);
    input.value = "";
});

// Single delegated listener handles all list interactions
list.addEventListener("click", (e) => {
    const item = e.target.closest("li");
    if (!item) return;

    if (e.target.matches(".delete")) {
        item.remove();
    } else if (e.target.matches(".edit")) {
        const text = item.querySelector(".text");
        const newValue = prompt("Edit item:", text.textContent);
        if (newValue !== null) {
            text.textContent = newValue;
        }
    }
});
```

## Delegation with Forms

```javascript
const form = document.querySelector("form");

form.addEventListener("input", (e) => {
    const field = e.target;

    // Validate based on field type
    if (field.matches("[type='email']")) {
        validateEmail(field);
    } else if (field.matches("[type='password']")) {
        validatePassword(field);
    } else if (field.matches("[name='phone']")) {
        validatePhone(field);
    }
});

form.addEventListener("focus", (e) => {
    const field = e.target;
    if (field.matches("input, textarea")) {
        field.classList.add("focused");
    }
}, true);  // Use capture for focus (doesn't bubble)

form.addEventListener("blur", (e) => {
    const field = e.target;
    if (field.matches("input, textarea")) {
        field.classList.remove("focused");
    }
}, true);
```

## Table Delegation

```html
<table id="data-table">
    <tbody>
        <tr data-id="1">
            <td>John</td>
            <td>john@example.com</td>
            <td>
                <button data-action="edit">Edit</button>
                <button data-action="delete">Delete</button>
            </td>
        </tr>
        <!-- More rows -->
    </tbody>
</table>
```

```javascript
const table = document.querySelector("#data-table");

table.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;

    const row = button.closest("tr");
    const id = row.dataset.id;
    const action = button.dataset.action;

    switch (action) {
        case "edit":
            console.log(`Edit row ${id}`);
            break;
        case "delete":
            if (confirm("Delete this row?")) {
                row.remove();
            }
            break;
    }
});
```

## When Not to Use Delegation

Delegation isn't always the best choice:

```javascript
// Simple case with few static elements - direct listeners are fine
const submitBtn = document.querySelector("#submit");
const cancelBtn = document.querySelector("#cancel");

submitBtn.addEventListener("click", handleSubmit);
cancelBtn.addEventListener("click", handleCancel);

// Events that don't bubble (focus, blur, load, etc.)
// Use capture phase instead
container.addEventListener("focus", handler, true);

// When you need to prevent event propagation at specific elements
element.addEventListener("click", (e) => {
    e.stopPropagation();  // Breaks delegation chain
});
```

## Performance Tip: Throttling Delegated Events

```javascript
function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn.apply(this, args);
        }
    };
}

// Throttle mousemove delegation
container.addEventListener("mousemove", throttle((e) => {
    if (e.target.matches(".hoverable")) {
        // Handle hover effect
    }
}, 100));
```

## Key Takeaways

1. Event delegation attaches one listener to a parent instead of many to children
2. Use `e.target` to identify which element triggered the event
3. Use `matches()` to check if element matches a selector
4. Use `closest()` to find the relevant ancestor element
5. Delegation automatically works with dynamically added content
6. Some events (focus, blur) need capture phase (`true` as third argument)
7. Use data attributes to store action types and IDs

Event delegation is a fundamental pattern in modern JavaScript development. It's used extensively in frameworks and vanilla JS applications alike.
