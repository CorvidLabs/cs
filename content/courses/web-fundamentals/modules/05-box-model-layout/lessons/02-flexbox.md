---
title: Flexbox
order: 2
estimatedMinutes: 22
---

# Flexbox

Flexbox is a one-dimensional layout system that excels at distributing space and aligning items within a container. It's perfect for navigation bars, card layouts, and centering content.

## Flex Container

Create a flex container by setting `display: flex`:

```css
.container {
    display: flex;
}
```

All direct children become flex items and flow horizontally by default.

```html
<div class="container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
</div>
```

## Flex Direction

Control the main axis direction:

```css
.container {
    display: flex;
    flex-direction: row;            /* Default: left to right */
    flex-direction: row-reverse;    /* Right to left */
    flex-direction: column;         /* Top to bottom */
    flex-direction: column-reverse; /* Bottom to top */
}
```

```
row:             row-reverse:     column:         column-reverse:
┌─┬─┬─┐          ┌─┬─┬─┐          ┌─┐             ┌─┐
│1│2│3│          │3│2│1│          │1│             │3│
└─┴─┴─┘          └─┴─┴─┘          ├─┤             ├─┤
                                  │2│             │2│
                                  ├─┤             ├─┤
                                  │3│             │1│
                                  └─┘             └─┘
```

## Justify Content

Distribute items along the main axis:

```css
.container {
    display: flex;
    justify-content: flex-start;      /* Default: items at start */
    justify-content: flex-end;        /* Items at end */
    justify-content: center;          /* Items centered */
    justify-content: space-between;   /* Even space between items */
    justify-content: space-around;    /* Even space around items */
    justify-content: space-evenly;    /* Equal space everywhere */
}
```

```
flex-start:      flex-end:        center:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│[1][2][3]    │  │    [1][2][3]│  │  [1][2][3]  │
└─────────────┘  └─────────────┘  └─────────────┘

space-between:   space-around:    space-evenly:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│[1]  [2]  [3]│  │ [1] [2] [3] │  │ [1] [2] [3] │
└─────────────┘  └─────────────┘  └─────────────┘
```

## Align Items

Align items along the cross axis:

```css
.container {
    display: flex;
    align-items: stretch;     /* Default: stretch to fill container */
    align-items: flex-start;  /* Align to start of cross axis */
    align-items: flex-end;    /* Align to end of cross axis */
    align-items: center;      /* Center on cross axis */
    align-items: baseline;    /* Align text baselines */
}
```

```
stretch:         flex-start:      flex-end:        center:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│┌──┬──┬──┐   │  │[1][2][3]    │  │             │  │             │
││  │  │  │   │  │             │  │             │  │  [1][2][3]  │
││  │  │  │   │  │             │  │[1][2][3]    │  │             │
│└──┴──┴──┘   │  └─────────────┘  └─────────────┘  └─────────────┘
└─────────────┘
```

## Gap

Add space between flex items:

```css
.container {
    display: flex;
    gap: 1rem;           /* Both row and column gap */
    row-gap: 1rem;       /* Gap between rows (when wrapping) */
    column-gap: 2rem;    /* Gap between columns */
}
```

## Flex Wrap

Allow items to wrap to multiple lines:

```css
.container {
    display: flex;
    flex-wrap: nowrap;       /* Default: single line */
    flex-wrap: wrap;         /* Wrap to new lines */
    flex-wrap: wrap-reverse; /* Wrap in reverse order */
}
```

## Align Content

When items wrap, control spacing between lines:

```css
.container {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;     /* Lines at start */
    align-content: flex-end;       /* Lines at end */
    align-content: center;         /* Lines centered */
    align-content: space-between;  /* Space between lines */
    align-content: space-around;   /* Space around lines */
    align-content: stretch;        /* Stretch to fill */
}
```

## Flex Shorthand

The `flex` property combines grow, shrink, and basis:

```css
.item {
    /* flex: grow shrink basis */
    flex: 0 1 auto;  /* Default */
    flex: 1;         /* Grow to fill available space */
    flex: 0 0 200px; /* Fixed 200px, don't grow or shrink */
}
```

### Flex Grow

How much an item grows relative to siblings:

```css
.item { flex-grow: 0; }     /* Don't grow (default) */
.item { flex-grow: 1; }     /* Grow equally */
.item-double { flex-grow: 2; } /* Grow twice as much */
```

### Flex Shrink

How much an item shrinks when space is limited:

```css
.item { flex-shrink: 1; }   /* Shrink equally (default) */
.item { flex-shrink: 0; }   /* Don't shrink */
.item { flex-shrink: 2; }   /* Shrink twice as fast */
```

### Flex Basis

The initial size before growing/shrinking:

```css
.item { flex-basis: auto; }  /* Use width/height or content size */
.item { flex-basis: 200px; } /* Start at 200px */
.item { flex-basis: 25%; }   /* Start at 25% of container */
.item { flex-basis: 0; }     /* Ignore content size when distributing */
```

### Common Flex Patterns

```css
/* Equal width items */
.item {
    flex: 1;
}

/* Fixed sidebar, flexible content */
.sidebar {
    flex: 0 0 250px;
}
.content {
    flex: 1;
}

/* Items don't shrink below content */
.item {
    flex: 1 0 auto;
}
```

## Align Self

Override alignment for individual items:

```css
.container {
    display: flex;
    align-items: center;
}

.item-top {
    align-self: flex-start;
}

.item-bottom {
    align-self: flex-end;
}
```

## Order

Change visual order without changing HTML:

```css
.item { order: 0; }      /* Default */
.item-first { order: -1; } /* Move to start */
.item-last { order: 1; }   /* Move to end */
```

## Centering with Flexbox

The classic centering solution:

```css
/* Center horizontally and vertically */
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
```

## Common Layouts

### Navigation Bar

```html
<nav class="navbar">
    <a href="/" class="logo">Logo</a>
    <ul class="nav-links">
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
    <button class="cta-button">Get Started</button>
</nav>
```

```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
}
```

### Card Grid

```css
.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
}

.card {
    flex: 1 1 300px;  /* Grow, shrink, min 300px */
    max-width: 400px;
}
```

### Sidebar Layout

```css
.layout {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    flex: 0 0 250px;
    background: #f5f5f5;
}

.main-content {
    flex: 1;
    padding: 2rem;
}
```

### Footer at Bottom

```css
body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

main {
    flex: 1;  /* Grow to push footer down */
}

footer {
    flex-shrink: 0;
}
```

### Media Object

```css
.media {
    display: flex;
    gap: 1rem;
}

.media-image {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
}

.media-body {
    flex: 1;
}
```

## Complete Example

```html
<div class="page">
    <header class="header">
        <a href="/" class="logo">Brand</a>
        <nav class="nav">
            <a href="/products">Products</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
        <button class="btn">Sign Up</button>
    </header>

    <main class="main">
        <aside class="sidebar">
            <nav class="sidebar-nav">
                <a href="#">Dashboard</a>
                <a href="#">Settings</a>
                <a href="#">Profile</a>
            </nav>
        </aside>

        <section class="content">
            <h1>Welcome</h1>
            <div class="cards">
                <article class="card">Card 1</article>
                <article class="card">Card 2</article>
                <article class="card">Card 3</article>
            </div>
        </section>
    </main>

    <footer class="footer">
        <p>&copy; 2024 Brand</p>
    </footer>
</div>
```

```css
/* Page layout */
.page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* Header */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #1a1a2e;
    color: white;
}

.nav {
    display: flex;
    gap: 2rem;
}

.nav a {
    color: white;
    text-decoration: none;
}

/* Main content */
.main {
    display: flex;
    flex: 1;
}

.sidebar {
    flex: 0 0 200px;
    background: #f5f5f5;
    padding: 1rem;
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.content {
    flex: 1;
    padding: 2rem;
}

/* Cards */
.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
}

.card {
    flex: 1 1 250px;
    padding: 1.5rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
}

/* Footer */
.footer {
    padding: 1rem 2rem;
    background: #1a1a2e;
    color: white;
    text-align: center;
}
```

## Key Takeaways

1. **`display: flex`** creates a flex container
2. **`justify-content`** distributes items along the main axis
3. **`align-items`** aligns items along the cross axis
4. **`flex-direction`** changes the main axis direction
5. **`flex-wrap`** allows items to wrap to new lines
6. **`gap`** adds space between items without margins
7. **`flex: 1`** makes items grow to fill available space
8. **Use Flexbox for** navigation, cards, centering, and one-dimensional layouts

In the next lesson, we will explore CSS Grid for two-dimensional layouts.
