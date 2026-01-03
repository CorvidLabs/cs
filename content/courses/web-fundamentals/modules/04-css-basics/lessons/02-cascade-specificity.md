---
title: Cascade and Specificity
order: 2
estimatedMinutes: 18
---

# Cascade and Specificity

CSS stands for Cascading Style Sheets. The "cascade" determines which styles apply when multiple rules target the same element. Understanding the cascade and specificity is essential for writing predictable CSS.

## The Cascade

When multiple CSS rules could apply to an element, the browser uses these factors (in order) to decide which wins:

1. **Importance** - `!important` declarations
2. **Origin** - User agent, user, or author styles
3. **Specificity** - How specific the selector is
4. **Source Order** - Later rules override earlier ones

## Specificity

Specificity is a weight that determines which rule applies. Think of it as a scoring system with four levels:

```
Inline    IDs    Classes    Types
  1,        0,       0,        0     (inline style)
  0,        1,       0,        0     (#id)
  0,        0,       1,        0     (.class, [attr], :pseudo-class)
  0,        0,       0,        1     (element, ::pseudo-element)
```

### Calculating Specificity

| Selector | Specificity | Score |
|----------|-------------|-------|
| `p` | 0,0,0,1 | 1 |
| `.intro` | 0,0,1,0 | 10 |
| `p.intro` | 0,0,1,1 | 11 |
| `#header` | 0,1,0,0 | 100 |
| `#header .nav` | 0,1,1,0 | 110 |
| `style="..."` | 1,0,0,0 | 1000 |

### Specificity Examples

```css
/* Specificity: 0,0,0,1 */
p {
    color: black;
}

/* Specificity: 0,0,1,0 - wins over p */
.highlight {
    color: yellow;
}

/* Specificity: 0,0,1,1 - wins over .highlight */
p.highlight {
    color: orange;
}

/* Specificity: 0,1,0,0 - wins over p.highlight */
#main {
    color: red;
}
```

### More Examples

```css
/* 0,0,0,2 - two elements */
ul li {
    color: gray;
}

/* 0,0,1,1 - one class, one element */
ul.nav li {
    color: blue;
}

/* 0,0,2,1 - two classes, one element */
ul.nav li.active {
    color: red;
}

/* 0,1,0,1 - one ID, one element */
#sidebar p {
    color: green;
}
```

## Specificity Rules

### Equal Specificity: Source Order Wins

When specificity is equal, the last rule wins:

```css
.btn {
    background: blue;
}

.btn {
    background: red;  /* This wins */
}
```

### IDs Beat Classes

One ID beats any number of classes:

```css
.nav .item .link .text {
    color: blue;  /* 0,0,4,0 */
}

#main-link {
    color: red;   /* 0,1,0,0 - wins! */
}
```

### Classes Beat Elements

One class beats any number of elements:

```css
body div ul li a {
    color: blue;  /* 0,0,0,5 */
}

.link {
    color: red;   /* 0,0,1,0 - wins! */
}
```

## The `!important` Exception

The `!important` declaration overrides normal specificity:

```css
p {
    color: red !important;  /* Wins despite low specificity */
}

#header p.intro {
    color: blue;  /* Would normally win, but doesn't */
}
```

### When `!important` Battles

When multiple `!important` rules conflict, specificity applies again:

```css
p {
    color: red !important;      /* 0,0,0,1 with !important */
}

.intro {
    color: blue !important;     /* 0,0,1,0 with !important - wins */
}
```

### Avoid `!important`

Using `!important` creates maintainability problems:

```css
/* Avoid this cascade of !important */
.btn {
    background: blue !important;
}

.btn-primary {
    background: red !important;  /* Doesn't work! */
}

/* Better: use appropriate specificity */
.btn {
    background: blue;
}

.btn.btn-primary {
    background: red;  /* Works due to higher specificity */
}
```

## Inheritance

Some CSS properties are inherited from parent to child elements:

### Inherited Properties

These properties are inherited by default:

- `color`
- `font-family`, `font-size`, `font-weight`
- `line-height`
- `text-align`
- `visibility`
- `cursor`

```html
<article>
    <p>This paragraph inherits the article's color.</p>
</article>
```

```css
article {
    color: #333;
    font-family: Georgia, serif;
}

/* The p inherits color and font-family from article */
```

### Non-Inherited Properties

These properties are not inherited:

- `margin`, `padding`
- `border`
- `background`
- `width`, `height`
- `display`
- `position`

### Forcing Inheritance

Use `inherit` to force inheritance:

```css
.child {
    border: inherit;      /* Takes parent's border */
    background: inherit;  /* Takes parent's background */
}
```

### Special Values

```css
.element {
    color: inherit;   /* Use parent's value */
    color: initial;   /* Use browser default */
    color: unset;     /* inherit if inherited property, initial otherwise */
    color: revert;    /* Use user agent stylesheet value */
}
```

## Managing Specificity

### Use Classes, Avoid IDs

```css
/* Avoid: hard to override */
#sidebar .widget .title {
    color: blue;
}

/* Better: easy to override when needed */
.widget-title {
    color: blue;
}

.widget-title-large {
    color: red;
}
```

### Keep Specificity Low and Consistent

```css
/* Consistent low specificity */
.nav { }
.nav-item { }
.nav-link { }
.nav-link-active { }

/* Avoid mixing high and low */
#nav { }
.nav-item { }
#nav .nav-link { }
```

### Use Layers for Organizing Specificity

CSS Cascade Layers help manage specificity:

```css
@layer reset, base, components, utilities;

@layer reset {
    * { margin: 0; padding: 0; }
}

@layer base {
    body { font-family: sans-serif; }
}

@layer components {
    .btn { padding: 0.5rem 1rem; }
}

@layer utilities {
    .mt-1 { margin-top: 0.25rem; }
}
```

Layers are applied in the order declared, regardless of specificity.

## Debugging Specificity

### Browser DevTools

1. Right-click element > Inspect
2. View applied styles in the Styles panel
3. Crossed-out styles are overridden
4. Hover to see specificity

### Common Issues

```css
/* Problem: can't override a style */
#header .nav a {
    color: blue;
}

/* Solution 1: match or exceed specificity */
#header .nav a.active {
    color: red;
}

/* Solution 2: refactor to use lower specificity */
.nav-link {
    color: blue;
}

.nav-link-active {
    color: red;
}
```

## Complete Example

```html
<header id="site-header">
    <nav class="main-nav">
        <ul>
            <li><a href="/" class="nav-link active">Home</a></li>
            <li><a href="/about" class="nav-link">About</a></li>
        </ul>
    </nav>
</header>

<main>
    <article class="post">
        <h1>Article Title</h1>
        <p class="intro">Introduction paragraph.</p>
        <p>Regular paragraph.</p>
    </article>
</main>
```

```css
/* Base styles - low specificity */
body {
    font-family: system-ui, sans-serif;
    color: #333;
    line-height: 1.6;
}

a {
    color: #0066cc;
}

/* Component styles - medium specificity */
.main-nav {
    background: #f5f5f5;
}

.nav-link {
    color: #333;
    text-decoration: none;
    padding: 0.5rem 1rem;
}

.nav-link:hover {
    color: #0066cc;
}

.nav-link.active {
    color: #0066cc;
    font-weight: bold;
}

.post {
    max-width: 800px;
    margin: 0 auto;
}

.post h1 {
    color: #111;
    margin-bottom: 1rem;
}

.post p {
    margin-bottom: 1rem;
}

.post .intro {
    font-size: 1.2rem;
    color: #666;
}

/* Utility classes - apply last */
.text-center {
    text-align: center;
}

.mt-2 {
    margin-top: 0.5rem;
}
```

## Key Takeaways

1. **Specificity determines which rule wins** when multiple rules apply
2. **Specificity order**: inline > ID > class/attribute > element
3. **Equal specificity**: last rule wins
4. **Avoid `!important`** - it creates maintenance problems
5. **Some properties inherit**, others do not
6. **Use classes over IDs** for styling
7. **Keep specificity low and consistent** for maintainable CSS
8. **Use DevTools** to debug specificity issues

In the next lesson, we will explore colors and backgrounds in CSS.
