---
title: DOM Modification
order: 3
estimatedMinutes: 18
---

# DOM Modification: Changing the Page

Now that you can select elements and handle events, let's learn to modify the DOM - changing content, attributes, styles, and structure.

## Modifying Text Content

### textContent

Gets or sets the text content of an element:

```javascript
const heading = document.querySelector("h1");

// Get text
console.log(heading.textContent);

// Set text (replaces all content)
heading.textContent = "New Heading";

// textContent is safe - HTML is escaped
heading.textContent = "<script>alert('XSS')</script>";
// Displays as literal text, not executed
```

### innerHTML

Gets or sets HTML content:

```javascript
const container = document.querySelector(".container");

// Get HTML
console.log(container.innerHTML);

// Set HTML (parses as HTML)
container.innerHTML = "<strong>Bold</strong> and <em>italic</em>";

// Warning: Don't use with user input!
// container.innerHTML = userInput;  // XSS vulnerability!
```

### innerText

Similar to textContent but respects CSS styling:

```javascript
const element = document.querySelector(".hidden");

// If element has display: none
console.log(element.textContent);  // Returns text
console.log(element.innerText);    // Returns "" (respects visibility)
```

## Modifying Attributes

### Standard Attributes

```javascript
const link = document.querySelector("a");

// Get attribute
console.log(link.href);
console.log(link.getAttribute("href"));

// Set attribute
link.href = "https://example.com";
link.setAttribute("href", "https://example.com");

// Check if attribute exists
if (link.hasAttribute("target")) {
    console.log("Has target attribute");
}

// Remove attribute
link.removeAttribute("target");
```

### Data Attributes

Custom attributes prefixed with `data-`:

```html
<button data-user-id="123" data-action="delete">Delete</button>
```

```javascript
const button = document.querySelector("button");

// Access via dataset
console.log(button.dataset.userId);   // "123"
console.log(button.dataset.action);   // "delete"

// Set data attribute
button.dataset.status = "pending";
// Creates: data-status="pending"

// Note: data-user-id becomes dataset.userId (camelCase)
```

## Modifying Classes

### classList API

```javascript
const element = document.querySelector(".box");

// Add class
element.classList.add("active");
element.classList.add("highlighted", "visible");  // Multiple

// Remove class
element.classList.remove("hidden");
element.classList.remove("one", "two");  // Multiple

// Toggle class
element.classList.toggle("open");  // Add if missing, remove if present

// Toggle with condition
element.classList.toggle("dark-mode", isDarkMode);  // Add if true, remove if false

// Check if has class
if (element.classList.contains("active")) {
    console.log("Element is active");
}

// Replace class
element.classList.replace("old-class", "new-class");
```

### className Property

```javascript
// Get all classes as string
console.log(element.className);  // "box active highlighted"

// Set all classes (replaces existing)
element.className = "new-box primary";
```

## Modifying Styles

### Inline Styles

```javascript
const box = document.querySelector(".box");

// Set individual styles
box.style.backgroundColor = "blue";
box.style.width = "200px";
box.style.marginTop = "20px";

// Note: CSS properties use camelCase
// background-color -> backgroundColor
// margin-top -> marginTop

// Get computed style (including CSS file styles)
const computed = getComputedStyle(box);
console.log(computed.width);
console.log(computed.backgroundColor);
```

### CSS Custom Properties

```javascript
// Set CSS variable
document.documentElement.style.setProperty("--primary-color", "#007bff");

// Get CSS variable
const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary-color");
```

## Creating Elements

```javascript
// Create element
const div = document.createElement("div");

// Add content
div.textContent = "Hello, World!";
div.innerHTML = "<span>Hello</span>";

// Add attributes
div.id = "my-div";
div.className = "container";
div.setAttribute("data-id", "123");

// Add to page
document.body.appendChild(div);
```

### Creating Complex Elements

```javascript
function createCard(title, content) {
    const card = document.createElement("article");
    card.className = "card";

    const heading = document.createElement("h2");
    heading.textContent = title;

    const body = document.createElement("p");
    body.textContent = content;

    card.appendChild(heading);
    card.appendChild(body);

    return card;
}

const card = createCard("Welcome", "This is a card component");
document.querySelector(".container").appendChild(card);
```

## Inserting Elements

```javascript
const parent = document.querySelector(".list");
const newItem = document.createElement("li");
newItem.textContent = "New Item";

// Append to end
parent.appendChild(newItem);
parent.append(newItem, "text node");  // Can append multiple, including text

// Prepend to beginning
parent.prepend(newItem);

// Insert before another element
const reference = document.querySelector(".list li:nth-child(2)");
parent.insertBefore(newItem, reference);

// Insert relative to element
reference.before(newItem);   // Before reference
reference.after(newItem);    // After reference

// insertAdjacentHTML - insert HTML at specific positions
parent.insertAdjacentHTML("beforebegin", "<p>Before parent</p>");
parent.insertAdjacentHTML("afterbegin", "<li>First child</li>");
parent.insertAdjacentHTML("beforeend", "<li>Last child</li>");
parent.insertAdjacentHTML("afterend", "<p>After parent</p>");
```

## Removing Elements

```javascript
const element = document.querySelector(".to-remove");

// Modern way
element.remove();

// Old way (still works)
element.parentNode.removeChild(element);

// Remove all children
parent.innerHTML = "";

// Or more carefully
while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
}

// Modern way to clear children
parent.replaceChildren();
```

## Cloning Elements

```javascript
const original = document.querySelector(".template");

// Shallow clone (element only)
const clone1 = original.cloneNode(false);

// Deep clone (element and all descendants)
const clone2 = original.cloneNode(true);

document.body.appendChild(clone2);
```

## Document Fragments

For efficient bulk insertions:

```javascript
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
    const item = document.createElement("li");
    item.textContent = `Item ${i}`;
    fragment.appendChild(item);
}

// Single DOM update instead of 100
document.querySelector("ul").appendChild(fragment);
```

## Template Element

```html
<template id="card-template">
    <article class="card">
        <h2 class="title"></h2>
        <p class="content"></p>
    </article>
</template>
```

```javascript
const template = document.querySelector("#card-template");

function createCardFromTemplate(title, content) {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".title").textContent = title;
    clone.querySelector(".content").textContent = content;
    return clone;
}

const card = createCardFromTemplate("Hello", "Welcome!");
document.body.appendChild(card);
```

## Practical Example: Dynamic List

```javascript
const list = document.querySelector("#todo-list");
const input = document.querySelector("#todo-input");
const form = document.querySelector("#todo-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    const item = document.createElement("li");
    item.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => item.remove());

    item.appendChild(deleteBtn);
    list.appendChild(item);

    input.value = "";
    input.focus();
});
```

## Key Takeaways

1. Use `textContent` for text (safe); `innerHTML` for HTML (careful with user input)
2. `classList` provides add, remove, toggle, contains, replace methods
3. Inline styles use camelCase: `element.style.backgroundColor`
4. `createElement`, `appendChild`, `remove` for dynamic content
5. Use `insertBefore`, `before`, `after` for precise positioning
6. Document fragments and templates improve performance for bulk operations
7. Always sanitize user input before using innerHTML

Next, we'll explore event delegation - an efficient pattern for handling events on dynamic content.
