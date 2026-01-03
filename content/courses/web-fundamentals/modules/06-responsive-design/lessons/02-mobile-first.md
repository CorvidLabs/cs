---
title: Mobile-First Design
order: 2
estimatedMinutes: 20
---

# Mobile-First Design

Mobile-first design starts with the smallest screen and progressively enhances for larger devices. It's the recommended approach for modern web development.

## Why Mobile-First?

1. **More users are on mobile** - Over 50% of web traffic is mobile
2. **Forces prioritization** - Limited space means focusing on what matters
3. **Cleaner CSS** - Add features rather than remove them
4. **Better performance** - Mobile devices load only what they need

## The Mobile-First Process

```
1. Design for mobile first
   ┌────────┐
   │ Mobile │  Start here
   └────────┘

2. Add breakpoints as screen grows
   ┌────────┐  ┌─────────────┐  ┌──────────────────────┐
   │ Mobile │  │   Tablet    │  │       Desktop        │
   └────────┘  └─────────────┘  └──────────────────────┘
```

## Mobile-First CSS Structure

```css
/* Base styles - Mobile (default) */
.container {
    padding: 16px;
}

.nav {
    flex-direction: column;
}

.card-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

/* Tablet - 768px and up */
@media (min-width: 768px) {
    .container {
        padding: 24px;
    }

    .nav {
        flex-direction: row;
    }

    .card-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
    }
}

/* Desktop - 1024px and up */
@media (min-width: 1024px) {
    .container {
        padding: 32px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .card-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

## Responsive Navigation Example

### HTML Structure

```html
<nav class="navbar">
    <a href="/" class="logo">Brand</a>
    <button class="menu-toggle" aria-label="Toggle menu">
        Menu
    </button>
    <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

### Mobile-First CSS

```css
/* Mobile: Stacked layout */
.navbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
}

.nav-links {
    display: none;           /* Hidden by default on mobile */
    width: 100%;
    flex-direction: column;
    gap: 8px;
    list-style: none;
    padding: 16px 0 0;
    margin: 0;
}

.nav-links.active {
    display: flex;           /* Show when toggled */
}

.menu-toggle {
    display: block;          /* Visible on mobile */
}

/* Tablet and up: Horizontal layout */
@media (min-width: 768px) {
    .nav-links {
        display: flex;       /* Always visible */
        width: auto;
        flex-direction: row;
        gap: 24px;
        padding: 0;
    }

    .menu-toggle {
        display: none;       /* Hidden on larger screens */
    }
}
```

## Touch-Friendly Design

Mobile users tap, not click:

```css
/* Larger tap targets on mobile */
.button {
    min-height: 44px;      /* Apple's minimum recommendation */
    padding: 12px 24px;
}

/* More spacing between links */
.nav-links a {
    padding: 12px 16px;
    display: block;
}
```

## The Viewport Meta Tag

Every responsive page needs this in the `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Without it, mobile browsers will render the page at desktop width and zoom out, making text tiny and unusable.

## Testing Mobile-First Designs

1. **Start narrow**: Begin testing at 320px wide
2. **Slowly widen**: Drag to find breakpoints where design breaks
3. **Test real devices**: Emulators miss touch and performance issues
4. **Check touch targets**: Ensure buttons are large enough
5. **Test orientation**: Check both portrait and landscape

## Common Breakpoint Strategy

```css
/* Base: Mobile (0 - 767px) */
/* All base styles here */

/* Small tablets and large phones */
@media (min-width: 480px) {
    /* Minor adjustments */
}

/* Tablets */
@media (min-width: 768px) {
    /* Two-column layouts */
}

/* Laptops and small desktops */
@media (min-width: 1024px) {
    /* Three-column layouts */
}

/* Large desktops */
@media (min-width: 1200px) {
    /* Maximum container widths */
}
```

## Key Takeaways

1. Start with mobile styles as your base CSS
2. Use `min-width` media queries to add larger screen styles
3. Progressive enhancement: add features for bigger screens
4. Keep touch targets at least 44px for mobile
5. Test at multiple widths, not just specific devices
6. Always include the viewport meta tag

Next, we'll learn about fluid layouts!
