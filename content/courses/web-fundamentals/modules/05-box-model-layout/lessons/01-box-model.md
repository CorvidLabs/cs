---
title: The Box Model
order: 1
estimatedMinutes: 18
---

# The Box Model

Every element in HTML is a rectangular box. The CSS box model describes how these boxes are sized and how they interact with each other. Understanding the box model is essential for controlling layout.

## Box Model Components

Every box has four parts, from inside to outside:

```
┌─────────────────────────────────────────────────────────────┐
│                         MARGIN                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                      BORDER                          │   │
│   │   ┌─────────────────────────────────────────────┐   │   │
│   │   │                  PADDING                     │   │   │
│   │   │   ┌─────────────────────────────────────┐   │   │   │
│   │   │   │                                     │   │   │   │
│   │   │   │              CONTENT                │   │   │   │
│   │   │   │                                     │   │   │   │
│   │   │   └─────────────────────────────────────┘   │   │   │
│   │   │                                             │   │   │
│   │   └─────────────────────────────────────────────┘   │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| Component | Purpose |
|-----------|---------|
| Content | The actual content (text, images) |
| Padding | Space between content and border |
| Border | The edge around the padding |
| Margin | Space outside the border |

## Content Box vs Border Box

### Default: Content Box

By default, `width` and `height` set the content size only:

```css
.box {
    width: 300px;
    padding: 20px;
    border: 5px solid black;
}
/* Total width: 300 + 20 + 20 + 5 + 5 = 350px */
```

This makes calculations difficult.

### Better: Border Box

With `border-box`, `width` and `height` include padding and border:

```css
.box {
    box-sizing: border-box;
    width: 300px;
    padding: 20px;
    border: 5px solid black;
}
/* Total width: 300px (content shrinks to fit) */
```

### Universal Border Box Reset

Apply border-box to all elements:

```css
*, *::before, *::after {
    box-sizing: border-box;
}
```

This should be in every project's CSS reset.

## Padding

Padding creates space inside the element, between content and border:

```css
.card {
    /* All sides */
    padding: 20px;

    /* Vertical | Horizontal */
    padding: 20px 40px;

    /* Top | Horizontal | Bottom */
    padding: 10px 20px 30px;

    /* Top | Right | Bottom | Left (clockwise) */
    padding: 10px 20px 30px 40px;
}

/* Individual sides */
.card {
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 30px;
    padding-left: 40px;
}
```

### Logical Properties

Modern CSS supports writing-mode aware properties:

```css
.card {
    /* Block = vertical in LTR/RTL, horizontal in vertical writing */
    padding-block: 20px;        /* top and bottom */
    padding-block-start: 10px;  /* top in LTR */
    padding-block-end: 30px;    /* bottom in LTR */

    /* Inline = horizontal in LTR/RTL */
    padding-inline: 20px;       /* left and right */
    padding-inline-start: 10px; /* left in LTR, right in RTL */
    padding-inline-end: 30px;   /* right in LTR, left in RTL */
}
```

## Margin

Margin creates space outside the element:

```css
.card {
    /* Same syntax as padding */
    margin: 20px;
    margin: 20px 40px;
    margin: 10px 20px 30px 40px;
}

/* Individual sides */
.card {
    margin-top: 10px;
    margin-right: 20px;
    margin-bottom: 30px;
    margin-left: 40px;
}

/* Logical properties */
.card {
    margin-block: 20px;
    margin-inline: 20px;
}
```

### Auto Margins

Use `auto` for centering:

```css
/* Horizontally center a block element */
.container {
    width: 800px;
    margin-left: auto;
    margin-right: auto;
}

/* Shorthand */
.container {
    width: 800px;
    margin: 0 auto;
}
```

### Margin Collapse

Vertical margins between adjacent elements collapse:

```css
h1 {
    margin-bottom: 20px;
}

p {
    margin-top: 16px;
}

/* The space between h1 and p is 20px, not 36px */
/* The larger margin wins */
```

Margin collapse only happens:
- Vertically (not horizontally)
- Between adjacent block elements
- When there's no border, padding, or content between them

Preventing collapse:

```css
/* Add padding or border */
.container {
    padding: 1px;  /* Prevents collapse with children */
}

/* Use flexbox or grid (they don't collapse) */
.container {
    display: flex;
    flex-direction: column;
}
```

## Border

Borders have three properties: width, style, and color:

```css
.box {
    /* Shorthand */
    border: 2px solid #333;

    /* Individual properties */
    border-width: 2px;
    border-style: solid;
    border-color: #333;
}
```

### Border Styles

```css
.solid { border-style: solid; }
.dashed { border-style: dashed; }
.dotted { border-style: dotted; }
.double { border-style: double; }
.groove { border-style: groove; }
.ridge { border-style: ridge; }
.inset { border-style: inset; }
.outset { border-style: outset; }
.none { border-style: none; }
```

### Individual Borders

```css
.box {
    border-top: 3px solid red;
    border-right: 2px dashed blue;
    border-bottom: 1px dotted green;
    border-left: 4px double orange;
}
```

### Border Radius

Round the corners:

```css
.box {
    /* All corners */
    border-radius: 8px;

    /* Elliptical corners */
    border-radius: 20px / 10px;

    /* Individual corners */
    border-top-left-radius: 10px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 20px;

    /* Shorthand: top-left, top-right, bottom-right, bottom-left */
    border-radius: 10px 20px 10px 20px;

    /* Circle (on a square element) */
    border-radius: 50%;
}
```

## Width and Height

### Fixed Dimensions

```css
.box {
    width: 300px;
    height: 200px;
}
```

### Percentage Dimensions

```css
.box {
    width: 50%;      /* 50% of parent's width */
    height: 50%;     /* 50% of parent's height (if parent has explicit height) */
}
```

### Min and Max Constraints

```css
.box {
    width: 100%;
    max-width: 800px;   /* Never wider than 800px */
    min-width: 300px;   /* Never narrower than 300px */

    height: auto;
    min-height: 200px;  /* At least 200px tall */
    max-height: 500px;  /* Never taller than 500px */
}
```

### Common Responsive Pattern

```css
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

img {
    max-width: 100%;
    height: auto;
}
```

## Display Property

The `display` property changes how elements behave:

### Block Elements

Take full width, stack vertically:

```css
div, p, h1, section {
    display: block;
}
```

### Inline Elements

Flow with text, can't have width/height:

```css
span, a, strong {
    display: inline;
}
```

### Inline-Block

Inline flow but accepts width/height:

```css
.badge {
    display: inline-block;
    padding: 0.25em 0.5em;
    width: 100px;  /* Works! */
}
```

### None

Removes element from layout:

```css
.hidden {
    display: none;  /* Element is not rendered */
}
```

## Overflow

Control what happens when content exceeds its container:

```css
.box {
    width: 200px;
    height: 100px;

    overflow: visible;  /* Default: content overflows */
    overflow: hidden;   /* Content is clipped */
    overflow: scroll;   /* Always show scrollbars */
    overflow: auto;     /* Scrollbars only when needed */
}

/* Separate horizontal/vertical */
.box {
    overflow-x: auto;
    overflow-y: hidden;
}
```

## Outline

Similar to border but doesn't affect layout:

```css
.focused {
    outline: 2px solid blue;
    outline-offset: 2px;  /* Space between element and outline */
}

/* Never remove focus outline without replacement */
button:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
}
```

## Complete Example

```css
/* Reset */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* Container */
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Card component */
.card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.card-header {
    border-bottom: 1px solid #e5e7eb;
    margin: -1.5rem -1.5rem 1.5rem;
    padding: 1rem 1.5rem;
}

.card-title {
    margin: 0;
}

.card-body {
    margin-bottom: 1rem;
}

.card-footer {
    border-top: 1px solid #e5e7eb;
    margin: 1.5rem -1.5rem -1.5rem;
    padding: 1rem 1.5rem;
}

/* Button */
.btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    border: 2px solid transparent;
    border-radius: 4px;
    background: #3b82f6;
    color: white;
}

.btn:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

/* Image */
.responsive-img {
    display: block;
    max-width: 100%;
    height: auto;
}

/* Badge */
.badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    background: #e5e7eb;
    font-size: 0.75rem;
}

/* Scrollable container */
.scroll-container {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    padding: 1rem;
}
```

## Key Takeaways

1. **Use `box-sizing: border-box`** - Makes width/height include padding and border
2. **Padding is inside**, margin is outside the border
3. **Vertical margins collapse** - The larger margin wins
4. **Use `auto` margins** for horizontal centering
5. **`max-width` with percentage width** - Responsive but constrained
6. **Use `overflow: auto`** for scrollable containers
7. **Never remove focus outlines** without a replacement

In the next lesson, we will explore Flexbox for one-dimensional layouts.
