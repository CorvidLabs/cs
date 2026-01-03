---
title: Colors and Backgrounds
order: 3
estimatedMinutes: 18
---

# Colors and Backgrounds

Color is fundamental to web design. CSS provides multiple ways to specify colors and create beautiful backgrounds that enhance your designs.

## Color Formats

### Named Colors

CSS includes 147 named colors:

```css
.text {
    color: red;
    color: blue;
    color: coral;
    color: darkslategray;
    color: rebeccapurple;
}
```

### Hexadecimal

Six-digit hex codes representing RGB:

```css
.text {
    color: #ff0000;  /* Red */
    color: #00ff00;  /* Green */
    color: #0000ff;  /* Blue */
    color: #333333;  /* Dark gray */
    color: #ffffff;  /* White */
}
```

Shorthand for repeated digits:

```css
.text {
    color: #f00;  /* Same as #ff0000 */
    color: #333;  /* Same as #333333 */
}
```

With alpha (transparency):

```css
.text {
    color: #ff000080;  /* 50% transparent red */
}
```

### RGB and RGBA

Red, Green, Blue values (0-255):

```css
.text {
    color: rgb(255, 0, 0);      /* Red */
    color: rgb(0, 128, 0);      /* Green */
    color: rgba(0, 0, 255, 0.5); /* 50% transparent blue */
}
```

Modern syntax (preferred):

```css
.text {
    color: rgb(255 0 0);         /* Red */
    color: rgb(255 0 0 / 50%);   /* 50% transparent red */
    color: rgb(255 0 0 / 0.5);   /* Same as above */
}
```

### HSL and HSLA

Hue (0-360), Saturation (0-100%), Lightness (0-100%):

```css
.text {
    color: hsl(0, 100%, 50%);      /* Red */
    color: hsl(120, 100%, 50%);    /* Green */
    color: hsl(240, 100%, 50%);    /* Blue */
    color: hsl(0, 0%, 50%);        /* Gray */
}
```

HSL is often easier for creating color variations:

```css
:root {
    --primary-h: 220;
    --primary-s: 80%;
    --primary-l: 50%;

    --primary: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
    --primary-light: hsl(var(--primary-h), var(--primary-s), 70%);
    --primary-dark: hsl(var(--primary-h), var(--primary-s), 30%);
}
```

Modern syntax:

```css
.text {
    color: hsl(220 80% 50%);       /* Blue */
    color: hsl(220 80% 50% / 50%); /* 50% transparent */
}
```

### Color Format Comparison

| Format | Best For |
|--------|----------|
| Named | Quick prototyping |
| Hex | Most common, wide support |
| RGB | Programmatic color manipulation |
| HSL | Creating color variations, theming |

## Text Color

The `color` property sets text color:

```css
body {
    color: #333;
}

h1 {
    color: #111;
}

a {
    color: #0066cc;
}

.error {
    color: #d32f2f;
}

.success {
    color: #2e7d32;
}
```

## Background Color

The `background-color` property fills the element's background:

```css
body {
    background-color: #ffffff;
}

header {
    background-color: #1a1a2e;
}

.card {
    background-color: #f5f5f5;
}

.highlight {
    background-color: rgba(255, 255, 0, 0.3);
}
```

## Background Images

### Basic Background Image

```css
.hero {
    background-image: url('hero.jpg');
}
```

### Background Repeat

```css
.pattern {
    background-image: url('pattern.png');
    background-repeat: repeat;      /* Default: tiles in both directions */
    background-repeat: repeat-x;    /* Tiles horizontally only */
    background-repeat: repeat-y;    /* Tiles vertically only */
    background-repeat: no-repeat;   /* Shows once */
}
```

### Background Position

```css
.hero {
    background-image: url('hero.jpg');
    background-position: center;           /* Center horizontally and vertically */
    background-position: top right;        /* Top right corner */
    background-position: 50% 25%;          /* 50% from left, 25% from top */
    background-position: 20px 40px;        /* 20px from left, 40px from top */
}
```

### Background Size

```css
.hero {
    background-image: url('hero.jpg');
    background-size: auto;         /* Original size */
    background-size: cover;        /* Cover entire element, may crop */
    background-size: contain;      /* Fit inside element, may leave gaps */
    background-size: 100% 100%;    /* Stretch to fill */
    background-size: 200px 150px;  /* Specific dimensions */
}
```

### Background Attachment

```css
.parallax {
    background-image: url('hero.jpg');
    background-attachment: scroll;  /* Scrolls with content (default) */
    background-attachment: fixed;   /* Stays fixed during scroll */
    background-attachment: local;   /* Scrolls with element's contents */
}
```

### Background Shorthand

Combine all background properties:

```css
.hero {
    background: #1a1a2e url('hero.jpg') no-repeat center/cover;
    /* color   image           repeat    position/size */
}
```

## Gradients

### Linear Gradient

```css
.gradient {
    /* Top to bottom (default) */
    background: linear-gradient(#ff6b6b, #4ecdc4);

    /* Specify direction */
    background: linear-gradient(to right, #ff6b6b, #4ecdc4);
    background: linear-gradient(to bottom right, #ff6b6b, #4ecdc4);
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);

    /* Multiple color stops */
    background: linear-gradient(
        to right,
        #ff6b6b 0%,
        #feca57 25%,
        #48dbfb 50%,
        #ff9ff3 75%,
        #54a0ff 100%
    );
}
```

### Radial Gradient

```css
.radial {
    /* Circle from center */
    background: radial-gradient(circle, #ff6b6b, #4ecdc4);

    /* Ellipse (default) */
    background: radial-gradient(ellipse, #ff6b6b, #4ecdc4);

    /* Position */
    background: radial-gradient(circle at top left, #ff6b6b, #4ecdc4);

    /* Size keywords */
    background: radial-gradient(circle closest-side, #ff6b6b, #4ecdc4);
}
```

### Conic Gradient

```css
.conic {
    background: conic-gradient(#ff6b6b, #feca57, #48dbfb, #ff6b6b);

    /* Start angle */
    background: conic-gradient(from 45deg, #ff6b6b, #4ecdc4);

    /* Position */
    background: conic-gradient(at 25% 25%, #ff6b6b, #4ecdc4);
}
```

## Multiple Backgrounds

Layer multiple backgrounds:

```css
.layered {
    background:
        linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
        url('hero.jpg') center/cover no-repeat;
}

.complex {
    background:
        url('overlay.png') repeat,
        linear-gradient(to bottom, transparent 50%, #000),
        url('background.jpg') center/cover no-repeat;
}
```

## Opacity and Transparency

### Element Opacity

Affects entire element including content:

```css
.faded {
    opacity: 0.5;  /* 50% transparent */
}
```

### Color Transparency

Affects only the color:

```css
.overlay {
    background-color: rgba(0, 0, 0, 0.7);  /* Only background is transparent */
    color: white;  /* Text is fully opaque */
}
```

## Color Variables (Custom Properties)

Create a consistent color system:

```css
:root {
    /* Primary colors */
    --color-primary: #2563eb;
    --color-primary-light: #60a5fa;
    --color-primary-dark: #1d4ed8;

    /* Neutral colors */
    --color-gray-100: #f3f4f6;
    --color-gray-200: #e5e7eb;
    --color-gray-300: #d1d5db;
    --color-gray-600: #4b5563;
    --color-gray-900: #111827;

    /* Semantic colors */
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-error: #ef4444;

    /* Background and text */
    --color-background: #ffffff;
    --color-text: var(--color-gray-900);
    --color-text-muted: var(--color-gray-600);
}

body {
    background-color: var(--color-background);
    color: var(--color-text);
}

.btn-primary {
    background-color: var(--color-primary);
    color: white;
}

.btn-primary:hover {
    background-color: var(--color-primary-dark);
}
```

## Complete Example

```css
:root {
    --primary: #3b82f6;
    --primary-dark: #1d4ed8;
    --text: #1f2937;
    --text-muted: #6b7280;
    --background: #f9fafb;
    --surface: #ffffff;
}

body {
    background-color: var(--background);
    color: var(--text);
}

.hero {
    background:
        linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.9),
            rgba(139, 92, 246, 0.9)
        ),
        url('hero-bg.jpg') center/cover no-repeat;
    color: white;
    padding: 4rem 2rem;
}

.card {
    background-color: var(--surface);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 1.5rem;
}

.card-header {
    background: linear-gradient(
        to right,
        var(--primary),
        var(--primary-dark)
    );
    color: white;
    margin: -1.5rem -1.5rem 1.5rem;
    padding: 1rem 1.5rem;
    border-radius: 8px 8px 0 0;
}

.btn {
    background-color: var(--primary);
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn:hover {
    background-color: var(--primary-dark);
}

.badge-success {
    background-color: #dcfce7;
    color: #166534;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
}

.badge-error {
    background-color: #fee2e2;
    color: #991b1b;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
}
```

## Key Takeaways

1. **Multiple color formats** - Hex, RGB, HSL each have use cases
2. **HSL is great for theming** - Easy to create variations
3. **Use background shorthand** - Combine properties efficiently
4. **Gradients create depth** - Linear, radial, and conic options
5. **Layer multiple backgrounds** - First listed appears on top
6. **CSS variables** - Create consistent, maintainable color systems
7. **rgba/hsla for overlays** - Transparent backgrounds with opaque text

In the next lesson, we will explore typography in CSS.
