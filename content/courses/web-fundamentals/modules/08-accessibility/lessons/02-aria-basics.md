---
title: ARIA Basics
order: 2
estimatedMinutes: 22
---

# ARIA Basics

ARIA (Accessible Rich Internet Applications) provides attributes that enhance accessibility when HTML alone is insufficient. ARIA helps assistive technologies understand dynamic content and custom widgets.

## The First Rule of ARIA

**Don't use ARIA if you can use native HTML.**

```html
<!-- Wrong: Using ARIA for a native element -->
<div role="button" tabindex="0" aria-pressed="false">Click me</div>

<!-- Right: Use native HTML -->
<button type="button">Click me</button>
```

Native HTML elements have built-in accessibility. Only use ARIA when:
- Building custom widgets without native equivalents
- Enhancing complex interactions
- Providing additional context

## ARIA Roles

Roles define what an element is:

### Landmark Roles

```html
<header role="banner">...</header>
<nav role="navigation">...</nav>
<main role="main">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>
<form role="form">...</form>
<section role="region" aria-label="Features">...</section>
```

Note: Semantic HTML elements already have implicit roles. Adding them is redundant but can improve support in older assistive technologies.

### Widget Roles

For custom interactive elements:

```html
<!-- Tabs -->
<div role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel1">Tab 1</button>
    <button role="tab" aria-selected="false" aria-controls="panel2">Tab 2</button>
</div>
<div role="tabpanel" id="panel1">Content 1</div>
<div role="tabpanel" id="panel2" hidden>Content 2</div>

<!-- Menu -->
<button aria-haspopup="true" aria-expanded="false">Menu</button>
<ul role="menu">
    <li role="menuitem">Option 1</li>
    <li role="menuitem">Option 2</li>
</ul>

<!-- Dialog -->
<div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
    <h2 id="dialog-title">Confirm Action</h2>
    <p>Are you sure you want to proceed?</p>
    <button>Confirm</button>
    <button>Cancel</button>
</div>
```

### Document Structure Roles

```html
<div role="alert">Error: Please fix the form</div>
<div role="status">Saving...</div>
<div role="tooltip" id="tip1">Helpful tip</div>
<div role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
    50%
</div>
```

## ARIA States and Properties

### aria-label

Provides an accessible name when text is not visible:

```html
<!-- Icon button without visible text -->
<button aria-label="Close dialog">
    <svg><!-- X icon --></svg>
</button>

<!-- Search input -->
<input type="search" aria-label="Search products">

<!-- Navigation with generic text -->
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Footer navigation">...</nav>
```

### aria-labelledby

References another element as the label:

```html
<section aria-labelledby="section-heading">
    <h2 id="section-heading">Featured Products</h2>
    ...
</section>

<dialog aria-labelledby="dialog-title">
    <h2 id="dialog-title">Confirm Deletion</h2>
    ...
</dialog>
```

### aria-describedby

References additional descriptive text:

```html
<label for="password">Password</label>
<input
    type="password"
    id="password"
    aria-describedby="password-requirements"
>
<p id="password-requirements">
    Must be at least 8 characters with one number
</p>

<button aria-describedby="delete-warning">Delete Account</button>
<p id="delete-warning" hidden>This action cannot be undone</p>
```

### aria-expanded

Indicates if a collapsible element is open:

```html
<button
    aria-expanded="false"
    aria-controls="dropdown-menu"
>
    Menu
</button>
<ul id="dropdown-menu" hidden>
    <li>Option 1</li>
    <li>Option 2</li>
</ul>
```

```javascript
button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);
    menu.hidden = isExpanded;
});
```

### aria-hidden

Hides content from assistive technologies:

```html
<!-- Hide decorative elements -->
<span aria-hidden="true">★★★★☆</span>
<span class="sr-only">4 out of 5 stars</span>

<!-- Hide icons when text is present -->
<button>
    <svg aria-hidden="true"><!-- icon --></svg>
    Close
</button>
```

Never use `aria-hidden="true"` on focusable elements.

### aria-live

Announces dynamic content updates:

```html
<!-- Polite: waits for user to stop interacting -->
<div aria-live="polite" aria-atomic="true">
    Form saved successfully
</div>

<!-- Assertive: interrupts immediately -->
<div role="alert" aria-live="assertive">
    Error: Connection lost
</div>

<!-- Status updates -->
<div role="status" aria-live="polite">
    3 items in cart
</div>
```

### aria-current

Indicates the current item in a set:

```html
<nav>
    <a href="/" aria-current="page">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
</nav>

<ol aria-label="Checkout steps">
    <li aria-current="step">Shipping</li>
    <li>Payment</li>
    <li>Confirm</li>
</ol>
```

## Common ARIA Patterns

### Accessible Icon Button

```html
<!-- Icon-only button -->
<button type="button" aria-label="Close menu">
    <svg aria-hidden="true" focusable="false">
        <use href="#icon-close"></use>
    </svg>
</button>
```

### Accessible Modal Dialog

```html
<button
    type="button"
    aria-haspopup="dialog"
    onclick="openDialog()"
>
    Open Dialog
</button>

<div
    role="dialog"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-desc"
    aria-modal="true"
    hidden
>
    <h2 id="dialog-title">Confirm Action</h2>
    <p id="dialog-desc">This will permanently delete your account.</p>
    <button type="button">Cancel</button>
    <button type="button">Delete</button>
</div>
```

### Accessible Tabs

```html
<div class="tabs">
    <div role="tablist" aria-label="Product information">
        <button
            role="tab"
            aria-selected="true"
            aria-controls="panel-desc"
            id="tab-desc"
        >
            Description
        </button>
        <button
            role="tab"
            aria-selected="false"
            aria-controls="panel-specs"
            id="tab-specs"
            tabindex="-1"
        >
            Specifications
        </button>
        <button
            role="tab"
            aria-selected="false"
            aria-controls="panel-reviews"
            id="tab-reviews"
            tabindex="-1"
        >
            Reviews
        </button>
    </div>

    <div
        role="tabpanel"
        id="panel-desc"
        aria-labelledby="tab-desc"
    >
        <p>Product description content...</p>
    </div>
    <div
        role="tabpanel"
        id="panel-specs"
        aria-labelledby="tab-specs"
        hidden
    >
        <p>Specifications content...</p>
    </div>
    <div
        role="tabpanel"
        id="panel-reviews"
        aria-labelledby="tab-reviews"
        hidden
    >
        <p>Reviews content...</p>
    </div>
</div>
```

### Accessible Accordion

```html
<div class="accordion">
    <h3>
        <button
            aria-expanded="true"
            aria-controls="sect1-content"
            id="sect1-header"
        >
            Section 1
        </button>
    </h3>
    <div
        id="sect1-content"
        role="region"
        aria-labelledby="sect1-header"
    >
        <p>Section 1 content...</p>
    </div>

    <h3>
        <button
            aria-expanded="false"
            aria-controls="sect2-content"
            id="sect2-header"
        >
            Section 2
        </button>
    </h3>
    <div
        id="sect2-content"
        role="region"
        aria-labelledby="sect2-header"
        hidden
    >
        <p>Section 2 content...</p>
    </div>
</div>
```

## Screen Reader Only Text

Hide visually but keep accessible:

```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

```html
<button>
    <svg aria-hidden="true"><!-- icon --></svg>
    <span class="sr-only">Add to cart</span>
</button>

<a href="/cart">
    Cart
    <span class="sr-only">(3 items)</span>
</a>
```

## ARIA Validation

### Required ARIA Attributes

Some roles require certain attributes:

```html
<!-- slider requires aria-valuenow, aria-valuemin, aria-valuemax -->
<div
    role="slider"
    aria-valuenow="50"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Volume"
    tabindex="0"
>
</div>

<!-- progressbar requires aria-valuenow -->
<div
    role="progressbar"
    aria-valuenow="75"
    aria-valuemin="0"
    aria-valuemax="100"
>
    75%
</div>
```

### Invalid ARIA

```html
<!-- Wrong: conflicting roles -->
<button role="link">...</button>

<!-- Wrong: aria-hidden on focusable element -->
<button aria-hidden="true">...</button>

<!-- Wrong: empty aria-label -->
<button aria-label="">...</button>
```

## Key Takeaways

1. **Use native HTML first** - ARIA is a last resort
2. **aria-label provides accessible names** when text is missing
3. **aria-labelledby references** existing visible text
4. **aria-describedby adds** supplementary information
5. **aria-expanded tracks** collapsible state
6. **aria-live announces** dynamic changes
7. **aria-hidden removes** from accessibility tree
8. **Test with screen readers** to verify ARIA works

In the next lesson, we will explore keyboard navigation.
