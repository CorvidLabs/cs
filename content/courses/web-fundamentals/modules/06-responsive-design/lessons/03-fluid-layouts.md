---
title: Fluid Layouts
order: 3
estimatedMinutes: 22
---

# Fluid Layouts

Fluid layouts use relative units instead of fixed pixels, allowing your design to adapt smoothly to any screen size.

## The Problem with Fixed Widths

```css
/* Fixed - breaks on small screens */
.container {
    width: 960px;
}
```

On a 320px mobile screen, users must scroll horizontally - a terrible experience.

## Fluid Solution

```css
/* Fluid - adapts to screen */
.container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
}
```

## Relative Units

Choose the right unit for the job:

| Unit | Relative To | Use For |
|------|-------------|---------|
| `%` | Parent element | Widths, layouts |
| `em` | Parent font size | Component spacing |
| `rem` | Root font size | Global spacing, fonts |
| `vw` | Viewport width | Full-width elements |
| `vh` | Viewport height | Full-height sections |

### Examples

```css
/* Percentage - container takes 80% of parent */
.container {
    width: 80%;
}

/* rem - consistent spacing regardless of nesting */
.section {
    padding: 2rem;
}

/* vw - text that scales with viewport */
.hero-title {
    font-size: 5vw;
}

/* vh - full-screen hero section */
.hero {
    height: 100vh;
}
```

## Flexible Grids with Percentages

Create a three-column layout that adapts:

```css
.row {
    display: flex;
    gap: 2%;
}

.column {
    flex: 1;
}

.column-third {
    width: 32%;
}

.column-two-thirds {
    width: 66%;
}
```

## The max-width Pattern

Combine fluid and maximum widths for the best of both:

```css
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}
```

This container:
- Is full-width on small screens
- Stops growing at 1200px
- Stays centered on large screens
- Has breathing room with padding

## Fluid Typography

### Using rem for Consistency

```css
html {
    font-size: 16px;  /* Base size */
}

h1 {
    font-size: 2.5rem;  /* 40px */
}

h2 {
    font-size: 2rem;    /* 32px */
}

p {
    font-size: 1rem;    /* 16px */
}
```

### Using clamp() for Smooth Scaling

Modern CSS can smoothly scale between minimum and maximum values:

```css
h1 {
    /* min: 1.5rem, preferred: 4vw, max: 3rem */
    font-size: clamp(1.5rem, 4vw, 3rem);
}

.container {
    /* min: 320px, preferred: 90%, max: 1200px */
    width: clamp(320px, 90%, 1200px);
}
```

## Flexible Spacing

Use relative units for consistent spacing:

```css
.section {
    padding: 5% 10%;  /* Scales with container */
}

.card {
    margin-bottom: 2rem;  /* Consistent regardless of context */
}

.button {
    padding: 0.75em 1.5em;  /* Scales with button font size */
}
```

## Aspect Ratio Boxes

Maintain proportions as size changes:

```css
/* Modern approach */
.video-container {
    aspect-ratio: 16 / 9;
    width: 100%;
}

/* Legacy approach (for older browsers) */
.video-container-legacy {
    position: relative;
    width: 100%;
    padding-top: 56.25%;  /* 9/16 = 0.5625 */
}

.video-container-legacy iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
```

## Fluid vs Fixed: When to Use Each

| Use Fluid | Use Fixed |
|-----------|-----------|
| Main layout containers | Icons, logos |
| Image wrappers | Border widths |
| Card grids | Small decorative elements |
| Typography | Minimum touch targets |
| Spacing between sections | Maximum line lengths |

## Common Fluid Layout Patterns

### Full-Bleed with Centered Content

```css
.full-bleed {
    width: 100%;
    padding: 60px 20px;
}

.full-bleed .content {
    max-width: 800px;
    margin: 0 auto;
}
```

### Sidebar Layout

```css
.layout {
    display: flex;
    gap: 2rem;
}

.sidebar {
    flex: 0 0 250px;  /* Fixed sidebar */
}

.main {
    flex: 1;  /* Fluid main content */
    min-width: 0;  /* Prevent overflow */
}
```

### Card Grid

```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}
```

## Key Takeaways

1. Use percentages for widths that should adapt
2. Use rem for consistent typography and spacing
3. Use max-width to prevent overly wide content
4. clamp() provides smooth scaling between min and max
5. Combine fluid widths with fixed constraints
6. Think in proportions, not pixels

Next, we'll learn about responsive images!
