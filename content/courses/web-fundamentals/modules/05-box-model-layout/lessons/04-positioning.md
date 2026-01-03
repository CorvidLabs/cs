---
title: CSS Positioning
order: 4
estimatedMinutes: 22
---

# CSS Positioning

The `position` property controls how elements are placed on the page. Understanding positioning is key to creating complex layouts.

## Position Values

```css
.element {
    position: static;    /* Default */
    position: relative;  /* Offset from normal position */
    position: absolute;  /* Removed from flow, positioned to ancestor */
    position: fixed;     /* Positioned to viewport */
    position: sticky;    /* Hybrid of relative and fixed */
}
```

## static (Default)

Elements flow normally in the document:

```css
.static {
    position: static;
    /* top, right, bottom, left have NO effect */
}
```

## relative

Element stays in normal flow but can be offset:

```css
.relative {
    position: relative;
    top: 20px;    /* Moves down 20px from normal position */
    left: 10px;   /* Moves right 10px from normal position */
}
```

```
Normal position: ┌─────────┐
                 │ element │
                 └─────────┘

With offset:         ┌─────────┐
                     │ element │  (moved down and right)
                     └─────────┘
```

The original space is preserved - other elements don't move.

## absolute

Element is removed from normal flow and positioned relative to its nearest positioned ancestor:

```css
.parent {
    position: relative;  /* Creates positioning context */
}

.absolute-child {
    position: absolute;
    top: 0;
    right: 0;
    /* Positioned to top-right of .parent */
}
```

```
┌──────────────────────────────┐
│ .parent (relative)     ┌───┐│
│                        │ X ││ ← absolute child
│                        └───┘│
│                              │
└──────────────────────────────┘
```

If no positioned ancestor exists, it positions relative to the `<html>` element.

## fixed

Element is positioned relative to the viewport (browser window):

```css
.fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    /* Stays at top of screen when scrolling */
}
```

Fixed elements don't move when the page scrolls.

## sticky

Element acts like `relative` until it reaches a threshold, then acts like `fixed`:

```css
.sticky-nav {
    position: sticky;
    top: 0;  /* Sticks when it reaches top of viewport */
}
```

Common for navigation that sticks after scrolling past a hero section.

## Offset Properties

Position offsets work with relative, absolute, fixed, and sticky:

```css
.positioned {
    position: absolute;
    top: 20px;      /* Distance from top */
    right: 20px;    /* Distance from right */
    bottom: 20px;   /* Distance from bottom */
    left: 20px;     /* Distance from left */
}
```

You can use opposite values to stretch an element:

```css
.fill-parent {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /* Or use: inset: 0; */
}
```

## z-index: Stacking Order

When elements overlap, `z-index` controls which appears on top:

```css
.behind {
    position: relative;
    z-index: 1;
}

.in-front {
    position: relative;
    z-index: 2;  /* Higher number = on top */
}
```

Important:
- Only works on positioned elements (not static)
- Creates stacking contexts
- Higher numbers appear above lower numbers

## Common Patterns

### Centered Overlay

```css
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### Badge on Card

```css
.card {
    position: relative;
}

.badge {
    position: absolute;
    top: -10px;
    right: -10px;
}
```

### Sticky Footer (within section)

```css
.section {
    position: relative;
    min-height: 100vh;
    padding-bottom: 60px;  /* Space for footer */
}

.section-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
}
```

## Position Comparison

| Position | In Document Flow? | Positioned To | Scrolls With Page? |
|----------|------------------|---------------|-------------------|
| static | Yes | N/A | Yes |
| relative | Yes | Self | Yes |
| absolute | No | Positioned ancestor | Yes |
| fixed | No | Viewport | No |
| sticky | Partially | Viewport threshold | Partially |

## Debugging Position Issues

1. **Element not positioning?** Check if ancestor has `position: relative`
2. **z-index not working?** Element must be positioned (not static)
3. **Fixed element too wide?** Add `left: 0; right: 0;` or set width
4. **Sticky not working?** Check for overflow on parent elements

## Key Takeaways

1. `static` is the default - elements flow normally
2. `relative` offsets from normal position, preserving space
3. `absolute` removes from flow and positions to ancestor
4. `fixed` positions to viewport and stays on scroll
5. `sticky` combines relative and fixed behavior
6. Use `z-index` to control stacking order

You now have the foundation for CSS layout. Practice these concepts to build more complex designs!
