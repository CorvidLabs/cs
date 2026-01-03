---
title: CSS Transitions
order: 2
estimatedMinutes: 18
---

# CSS Transitions

CSS transitions let you animate changes to CSS properties smoothly over time. They create polished, professional interactions without JavaScript.

## Basic Transition Syntax

```css
.element {
    transition: property duration timing-function delay;
}
```

Example:
```css
.button {
    background-color: blue;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: darkblue;
}
```

## Transition Properties

### transition-property

Specify which properties to animate:

```css
.card {
    transition-property: transform, opacity;
}

/* Or animate all changing properties */
.card {
    transition-property: all;
}
```

### transition-duration

How long the animation takes:

```css
.element {
    transition-duration: 0.3s;   /* 300 milliseconds */
    transition-duration: 300ms;  /* Same thing */
    transition-duration: 1s;     /* 1 second */
}
```

### transition-timing-function

The acceleration curve:

```css
.element {
    transition-timing-function: ease;        /* Default: slow-fast-slow */
    transition-timing-function: linear;      /* Constant speed */
    transition-timing-function: ease-in;     /* Start slow */
    transition-timing-function: ease-out;    /* End slow */
    transition-timing-function: ease-in-out; /* Slow at both ends */
}
```

Custom curves with `cubic-bezier()`:
```css
.element {
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### transition-delay

Wait before starting:

```css
.element {
    transition-delay: 0.2s;  /* Wait 200ms before animating */
}
```

## The Shorthand Property

Combine all transition properties:

```css
/* property duration timing-function delay */
.element {
    transition: transform 0.3s ease-out 0.1s;
}

/* Multiple properties */
.element {
    transition: transform 0.3s ease,
                opacity 0.2s ease 0.1s,
                background-color 0.3s ease;
}
```

## What Can Be Transitioned?

Most properties with numeric values can be animated:

| Animatable | Not Animatable |
|------------|----------------|
| opacity | display |
| transform | font-family |
| colors | visibility (sort of) |
| width, height | background-image |
| margin, padding | position |
| border-radius | |
| box-shadow | |
| font-size | |

## Common Transition Patterns

### Button Hover Effects

```css
.button {
    background-color: #3498db;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease,
                transform 0.2s ease;
}

.button:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
}

.button:active {
    transform: translateY(0);
}
```

### Card Lift Effect

```css
.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s ease,
                box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
```

### Fade In/Out

```css
.tooltip {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease,
                visibility 0.2s ease;
}

.trigger:hover .tooltip {
    opacity: 1;
    visibility: visible;
}
```

### Navigation Link Underline

```css
.nav-link {
    position: relative;
    text-decoration: none;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: currentColor;
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 100%;
}
```

### Color Transitions

```css
.link {
    color: #333;
    transition: color 0.2s ease;
}

.link:hover {
    color: #3498db;
}
```

## Performance Tips

### Use GPU-Accelerated Properties

These properties are cheap to animate:
- `transform`
- `opacity`

Avoid animating:
- `width`, `height` (causes layout recalculation)
- `top`, `left` (use `transform` instead)
- `margin`, `padding`

```css
/* Instead of animating left */
.element {
    position: relative;
    left: 0;
    transition: left 0.3s ease;  /* Not recommended */
}

/* Use transform */
.element {
    transform: translateX(0);
    transition: transform 0.3s ease;  /* Better */
}
```

### will-change Hint

Tell the browser to prepare for animation:

```css
.element {
    will-change: transform;  /* Use sparingly */
}
```

## Staggered Transitions

Create sequential animations with delays:

```css
.card:nth-child(1) { transition-delay: 0s; }
.card:nth-child(2) { transition-delay: 0.1s; }
.card:nth-child(3) { transition-delay: 0.2s; }
.card:nth-child(4) { transition-delay: 0.3s; }
```

## Key Takeaways

1. Transitions animate property changes over time
2. Use the shorthand: `transition: property duration timing delay`
3. `ease-out` often feels most natural for UI
4. Prefer `transform` and `opacity` for performance
5. Keep durations short (150-400ms) for UI elements
6. Transitions only work between two defined states

Next, we'll learn about CSS transforms to move, rotate, and scale elements!
