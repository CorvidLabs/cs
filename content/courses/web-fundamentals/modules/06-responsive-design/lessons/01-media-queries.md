---
title: Media Queries
order: 1
estimatedMinutes: 18
---

# Media Queries

Media queries let you apply CSS rules based on device characteristics like screen width, height, and orientation. They are the foundation of responsive design.

## Basic Syntax

```css
@media (condition) {
    /* CSS rules applied when condition is true */
}
```

### Width-Based Queries

```css
/* Minimum width - applies at 768px and above */
@media (min-width: 768px) {
    .container {
        width: 750px;
    }
}

/* Maximum width - applies at 767px and below */
@media (max-width: 767px) {
    .sidebar {
        display: none;
    }
}
```

### Range Queries

Target a specific range using `and`:

```css
/* Between 768px and 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
    .container {
        width: 90%;
    }
}
```

Modern CSS also supports range syntax:

```css
/* Modern range syntax (newer browsers) */
@media (768px <= width < 1024px) {
    .container {
        width: 90%;
    }
}
```

## Media Types

Target specific device types:

```css
/* Only screens (not print) */
@media screen and (min-width: 768px) {
    /* ... */
}

/* Print styles */
@media print {
    .no-print {
        display: none;
    }
}
```

## Orientation Queries

Detect device orientation:

```css
/* Portrait mode (height > width) */
@media (orientation: portrait) {
    .gallery {
        grid-template-columns: 1fr;
    }
}

/* Landscape mode (width > height) */
@media (orientation: landscape) {
    .gallery {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

## Combining Conditions

Use `and`, `or` (comma), and `not`:

```css
/* AND - both conditions must be true */
@media (min-width: 768px) and (orientation: landscape) {
    /* ... */
}

/* OR - either condition can be true */
@media (max-width: 480px), (orientation: portrait) {
    /* ... */
}

/* NOT - inverts the query */
@media not print {
    /* Applies to everything except print */
}
```

## Common Breakpoints

Breakpoints are the screen widths where your layout changes:

```css
/* Mobile phones */
@media (min-width: 480px) { }

/* Tablets */
@media (min-width: 768px) { }

/* Laptops */
@media (min-width: 1024px) { }

/* Desktops */
@media (min-width: 1200px) { }

/* Large screens */
@media (min-width: 1440px) { }
```

These are guidelines, not rules. Choose breakpoints based on where your design breaks, not specific devices.

## Common Responsive Patterns

### Show/Hide Elements

```css
.mobile-only {
    display: block;
}

.desktop-only {
    display: none;
}

@media (min-width: 768px) {
    .mobile-only {
        display: none;
    }

    .desktop-only {
        display: block;
    }
}
```

### Responsive Typography

```css
html {
    font-size: 14px;
}

@media (min-width: 768px) {
    html {
        font-size: 16px;
    }
}

@media (min-width: 1200px) {
    html {
        font-size: 18px;
    }
}
```

## Debugging Media Queries

1. **Browser DevTools**: Toggle device mode to test different widths
2. **Visual indicator**: Add a temporary element showing current breakpoint

```css
/* Debug helper - remove in production */
body::before {
    content: "Mobile";
    position: fixed;
    top: 0;
    left: 0;
    background: red;
    color: white;
    padding: 5px;
    z-index: 9999;
}

@media (min-width: 768px) {
    body::before { content: "Tablet"; background: orange; }
}

@media (min-width: 1024px) {
    body::before { content: "Desktop"; background: green; }
}
```

## Key Takeaways

1. Use `min-width` for mobile-first (recommended)
2. Use `max-width` for desktop-first
3. Combine conditions with `and`, commas (or), and `not`
4. Choose breakpoints based on where your design breaks
5. Keep media queries organized and consistent
6. Test thoroughly at all breakpoints

Next, we'll learn about mobile-first design strategy!
