---
title: CSS Variables
order: 1
estimatedMinutes: 18
---

# CSS Variables

CSS Variables (Custom Properties) let you store values and reuse them throughout your stylesheet. They make your CSS more maintainable and enable dynamic styling.

## Defining Variables

Variables are defined with a `--` prefix, typically on the `:root` selector:

```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --text-color: #333;
    --spacing-unit: 8px;
    --border-radius: 4px;
}
```

The `:root` selector targets the document root (`<html>`), making variables available globally.

## Using Variables

Use the `var()` function to access variables:

```css
.button {
    background-color: var(--primary-color);
    color: white;
    padding: calc(var(--spacing-unit) * 2);
    border-radius: var(--border-radius);
}

.card {
    border: 1px solid var(--secondary-color);
    padding: var(--spacing-unit);
}
```

## Fallback Values

Provide a fallback if the variable is undefined:

```css
.element {
    /* Use blue if --accent-color is not defined */
    color: var(--accent-color, blue);

    /* Fallback to another variable */
    background: var(--bg-color, var(--secondary-color));
}
```

## Scope and Inheritance

Variables follow the CSS cascade and are inherited by child elements:

```css
:root {
    --text-color: #333;
}

.dark-section {
    --text-color: #fff;  /* Override for this section */
}

.content {
    color: var(--text-color);  /* Uses inherited value */
}
```

## Component-Scoped Variables

Define variables on components for self-contained styling:

```css
.card {
    --card-padding: 20px;
    --card-bg: white;
    --card-shadow: 0 2px 8px rgba(0,0,0,0.1);

    padding: var(--card-padding);
    background: var(--card-bg);
    box-shadow: var(--card-shadow);
}

.card.dark {
    --card-bg: #333;
    --card-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
```

## Variables with calc()

Combine variables with calculations:

```css
:root {
    --base-size: 16px;
    --scale-ratio: 1.25;
}

h1 {
    font-size: calc(var(--base-size) * var(--scale-ratio) * var(--scale-ratio) * var(--scale-ratio));
}

h2 {
    font-size: calc(var(--base-size) * var(--scale-ratio) * var(--scale-ratio));
}

h3 {
    font-size: calc(var(--base-size) * var(--scale-ratio));
}
```

## Theme Switching

Variables make theme switching simple:

```css
:root {
    --bg-color: #ffffff;
    --text-color: #333333;
    --accent-color: #3498db;
}

:root.dark-theme {
    --bg-color: #1a1a1a;
    --text-color: #f0f0f0;
    --accent-color: #5dade2;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
}

a {
    color: var(--accent-color);
}
```

Toggle with JavaScript:
```javascript
document.documentElement.classList.toggle('dark-theme');
```

## Responsive Variables

Change variable values at different breakpoints:

```css
:root {
    --container-padding: 16px;
    --heading-size: 1.5rem;
}

@media (min-width: 768px) {
    :root {
        --container-padding: 24px;
        --heading-size: 2rem;
    }
}

@media (min-width: 1024px) {
    :root {
        --container-padding: 32px;
        --heading-size: 2.5rem;
    }
}

.container {
    padding: var(--container-padding);
}

h1 {
    font-size: var(--heading-size);
}
```

## Common Variable Patterns

### Color System

```css
:root {
    /* Base colors */
    --color-primary: #3498db;
    --color-secondary: #2ecc71;
    --color-danger: #e74c3c;
    --color-warning: #f39c12;

    /* Variations */
    --color-primary-light: #5dade2;
    --color-primary-dark: #2980b9;

    /* Semantic colors */
    --color-text: #333;
    --color-text-muted: #666;
    --color-background: #fff;
    --color-border: #ddd;
}
```

### Spacing System

```css
:root {
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    --space-xxl: 48px;
}
```

### Typography System

```css
:root {
    --font-family-base: system-ui, sans-serif;
    --font-family-heading: Georgia, serif;
    --font-family-mono: 'Courier New', monospace;

    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;

    --line-height-tight: 1.25;
    --line-height-base: 1.5;
    --line-height-loose: 1.75;
}
```

## Key Takeaways

1. Define variables with `--` prefix, use with `var()`
2. Declare global variables on `:root`
3. Variables are inherited and can be overridden
4. Use fallback values for safety
5. Combine with `calc()` for dynamic calculations
6. Perfect for theming and responsive design

Next, we'll learn about CSS transitions for smooth animations!
