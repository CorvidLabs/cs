---
title: CSS Selectors
order: 1
estimatedMinutes: 20
---

# CSS Selectors

Selectors are patterns that match elements in your HTML document. They are the first part of every CSS rule and determine which elements receive the styles you define.

## CSS Rule Structure

Every CSS rule has two parts:

```css
selector {
    property: value;
    property: value;
}
```

```css
h1 {
    color: blue;
    font-size: 2rem;
}
```

## Basic Selectors

### Type Selector

Matches elements by their tag name:

```css
/* All paragraphs */
p {
    line-height: 1.6;
}

/* All links */
a {
    color: blue;
}

/* All images */
img {
    max-width: 100%;
}
```

### Class Selector

Matches elements with a specific class attribute. Uses a dot (`.`) prefix:

```html
<p class="intro">This paragraph has the intro class.</p>
<p>This paragraph does not.</p>
```

```css
.intro {
    font-size: 1.25rem;
    font-weight: bold;
}
```

Elements can have multiple classes:

```html
<div class="card featured large">...</div>
```

```css
.card {
    border: 1px solid #ccc;
    padding: 1rem;
}

.featured {
    border-color: gold;
}

.large {
    padding: 2rem;
}
```

### ID Selector

Matches a single element with a specific ID. Uses a hash (`#`) prefix:

```html
<header id="site-header">...</header>
```

```css
#site-header {
    background-color: navy;
    color: white;
}
```

IDs should be unique on each page. Prefer classes for styling.

### Universal Selector

Matches all elements:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

## Attribute Selectors

Match elements based on attributes:

```css
/* Has attribute */
[disabled] {
    opacity: 0.5;
}

/* Attribute equals value */
[type="email"] {
    background-image: url('email-icon.svg');
}

/* Attribute contains value */
[class*="btn"] {
    cursor: pointer;
}

/* Attribute starts with value */
[href^="https"] {
    color: green;
}

/* Attribute ends with value */
[href$=".pdf"] {
    background-image: url('pdf-icon.svg');
}
```

### Attribute Selector Reference

| Selector | Matches |
|----------|---------|
| `[attr]` | Has attribute |
| `[attr="value"]` | Exact match |
| `[attr~="value"]` | Space-separated list contains |
| `[attr\|="value"]` | Starts with value or value- |
| `[attr^="value"]` | Starts with |
| `[attr$="value"]` | Ends with |
| `[attr*="value"]` | Contains |

## Combinator Selectors

Combine selectors to target specific relationships:

### Descendant Combinator (space)

Matches elements inside other elements at any depth:

```css
/* Links inside nav (at any depth) */
nav a {
    text-decoration: none;
}

/* Paragraphs inside articles */
article p {
    margin-bottom: 1rem;
}
```

### Child Combinator (`>`)

Matches direct children only:

```css
/* Only direct children, not nested ul */
ul > li {
    list-style: disc;
}

/* Direct child paragraphs of article */
article > p {
    font-size: 1.1rem;
}
```

### Adjacent Sibling Combinator (`+`)

Matches the immediately following sibling:

```css
/* Paragraph immediately after h2 */
h2 + p {
    font-size: 1.25rem;
    color: #666;
}

/* Label immediately after input */
input + label {
    margin-left: 0.5rem;
}
```

### General Sibling Combinator (`~`)

Matches all following siblings:

```css
/* All paragraphs after h2 */
h2 ~ p {
    margin-left: 1rem;
}
```

## Pseudo-Classes

Match elements based on state or position:

### State Pseudo-Classes

```css
/* Mouse hover */
a:hover {
    text-decoration: underline;
}

/* Keyboard focus */
input:focus {
    outline: 2px solid blue;
}

/* Clicked/active state */
button:active {
    transform: translateY(1px);
}

/* Visited links */
a:visited {
    color: purple;
}

/* Disabled elements */
input:disabled {
    background-color: #eee;
}

/* Checked checkboxes/radios */
input:checked {
    accent-color: green;
}
```

### Structural Pseudo-Classes

```css
/* First child of parent */
li:first-child {
    font-weight: bold;
}

/* Last child of parent */
li:last-child {
    margin-bottom: 0;
}

/* Only child of parent */
p:only-child {
    text-align: center;
}

/* Nth child (1-indexed) */
tr:nth-child(2) {
    background-color: #f5f5f5;
}

/* Even rows */
tr:nth-child(even) {
    background-color: #f5f5f5;
}

/* Odd rows */
tr:nth-child(odd) {
    background-color: white;
}

/* Every 3rd element */
li:nth-child(3n) {
    color: red;
}

/* First 3 elements */
li:nth-child(-n+3) {
    font-weight: bold;
}
```

### Form Pseudo-Classes

```css
/* Required fields */
input:required {
    border-left: 3px solid red;
}

/* Optional fields */
input:optional {
    border-left: 3px solid #ccc;
}

/* Valid input */
input:valid {
    border-color: green;
}

/* Invalid input */
input:invalid {
    border-color: red;
}

/* Read-only fields */
input:read-only {
    background-color: #f5f5f5;
}
```

### Negation Pseudo-Class

```css
/* All inputs except submit buttons */
input:not([type="submit"]) {
    border: 1px solid #ccc;
}

/* All links except those with .nav-link class */
a:not(.nav-link) {
    color: blue;
}

/* Paragraphs that are not first child */
p:not(:first-child) {
    margin-top: 1rem;
}
```

## Pseudo-Elements

Target specific parts of elements:

```css
/* First line of text */
p::first-line {
    font-weight: bold;
}

/* First letter */
p::first-letter {
    font-size: 2em;
    float: left;
}

/* Before content */
.required::before {
    content: "* ";
    color: red;
}

/* After content */
a[href^="http"]::after {
    content: " ↗";
}

/* Selected text */
::selection {
    background-color: yellow;
    color: black;
}

/* Placeholder text */
input::placeholder {
    color: #999;
    font-style: italic;
}
```

## Selector Grouping

Apply the same styles to multiple selectors:

```css
/* Group with commas */
h1, h2, h3 {
    font-family: Georgia, serif;
    color: #333;
}

/* Complex grouped selectors */
.btn-primary,
.btn-secondary,
input[type="submit"] {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}
```

## Selector Best Practices

### Prefer Classes Over IDs

```css
/* Avoid: too specific */
#main-navigation {
    background: navy;
}

/* Better: reusable */
.nav-primary {
    background: navy;
}
```

### Keep Selectors Simple

```css
/* Avoid: too long and brittle */
body div.container article.post p span.highlight {
    color: yellow;
}

/* Better: direct and clear */
.highlight {
    color: yellow;
}
```

### Use Meaningful Class Names

```css
/* Avoid: describes appearance */
.red-text {
    color: red;
}

/* Better: describes purpose */
.error-message {
    color: red;
}
```

## Complete Example

```html
<nav class="main-nav">
    <ul>
        <li><a href="/" class="active">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>

<main>
    <article class="post featured">
        <h1>Article Title</h1>
        <p class="intro">This is the introduction.</p>
        <p>This is a regular paragraph.</p>
        <p>Another paragraph with <a href="https://example.com">external link</a>.</p>
    </article>
</main>
```

```css
/* Navigation */
.main-nav ul {
    list-style: none;
    display: flex;
    gap: 1rem;
}

.main-nav a {
    text-decoration: none;
    color: #333;
    padding: 0.5rem 1rem;
}

.main-nav a:hover,
.main-nav a.active {
    color: blue;
}

/* Articles */
.post {
    max-width: 800px;
    margin: 0 auto;
}

.post.featured {
    border-left: 4px solid gold;
    padding-left: 1rem;
}

.post h1 {
    margin-bottom: 1rem;
}

.post p {
    line-height: 1.6;
    margin-bottom: 1rem;
}

.post p:first-of-type {
    font-size: 1.2rem;
}

.post .intro {
    font-weight: bold;
    color: #666;
}

/* External links */
.post a[href^="https"]::after {
    content: " ↗";
    font-size: 0.8em;
}
```

## Key Takeaways

1. **Type selectors** match HTML elements: `p`, `div`, `a`
2. **Class selectors** use a dot: `.classname`
3. **ID selectors** use a hash: `#idname`
4. **Combinators** target relationships: `parent child`, `parent > child`, `sibling + next`
5. **Pseudo-classes** target states: `:hover`, `:focus`, `:first-child`
6. **Pseudo-elements** target parts: `::before`, `::after`, `::first-letter`
7. **Keep selectors simple** and use meaningful class names

In the next lesson, we will learn about the cascade and specificity.
