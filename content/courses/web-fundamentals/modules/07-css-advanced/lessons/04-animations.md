---
title: CSS Animations
order: 3
estimatedMinutes: 20
---

# CSS Animations

CSS keyframe animations allow you to create complex, multi-step animations without JavaScript. They provide more control than transitions and can run automatically, repeat, and reverse.

## Basic Syntax

### Defining Keyframes

```css
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Or with percentages */
@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
```

### Applying Animations

```css
.element {
    animation: fadeIn 0.5s ease-out;
}
```

## Animation Properties

### Full Syntax

```css
.element {
    animation-name: fadeIn;
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-play-state: running;
}

/* Shorthand */
.element {
    animation: fadeIn 0.5s ease-out 0s 1 normal forwards running;
    /* name duration timing delay count direction fill-mode play-state */
}

/* Minimal shorthand */
.element {
    animation: fadeIn 0.5s ease-out;
}
```

## Multi-Step Animations

Use percentages for complex sequences:

```css
@keyframes bounce {
    0% {
        transform: translateY(0);
    }
    25% {
        transform: translateY(-20px);
    }
    50% {
        transform: translateY(0);
    }
    75% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0);
    }
}

.bouncing {
    animation: bounce 1s ease-in-out;
}
```

## Animation Iteration

### Repeat Count

```css
.element {
    animation: pulse 1s infinite;  /* Forever */
    animation: pulse 1s 3;         /* 3 times */
}
```

### Direction

```css
.element {
    animation-direction: normal;           /* Forward only */
    animation-direction: reverse;          /* Backward only */
    animation-direction: alternate;        /* Forward then backward */
    animation-direction: alternate-reverse; /* Backward then forward */
}
```

Example of alternating:

```css
@keyframes swing {
    from { transform: rotate(-10deg); }
    to { transform: rotate(10deg); }
}

.pendulum {
    animation: swing 1s ease-in-out infinite alternate;
    transform-origin: top center;
}
```

## Animation Fill Mode

Control state before and after animation:

```css
.element {
    animation-fill-mode: none;      /* Default: return to initial state */
    animation-fill-mode: forwards;  /* Keep final keyframe state */
    animation-fill-mode: backwards; /* Apply first keyframe during delay */
    animation-fill-mode: both;      /* Apply both forwards and backwards */
}
```

### Fill Mode Example

```css
@keyframes slideIn {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.slide-in {
    animation: slideIn 0.5s ease-out forwards;
    /* Without forwards, element would jump back to translateX(-100%) */
}
```

## Animation Play State

Pause and resume animations:

```css
.element {
    animation: spin 2s linear infinite;
    animation-play-state: running;
}

.element:hover {
    animation-play-state: paused;
}
```

## Common Animation Patterns

### Fade In

```css
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}
```

### Slide In from Left

```css
@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.slide-in-left {
    animation: slideInLeft 0.5s ease-out forwards;
}
```

### Scale In

```css
@keyframes scaleIn {
    from {
        transform: scale(0);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

.scale-in {
    animation: scaleIn 0.3s ease-out forwards;
}
```

### Pulse

```css
@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

.pulse {
    animation: pulse 2s ease-in-out infinite;
}
```

### Spin

```css
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.spinner {
    animation: spin 1s linear infinite;
}
```

### Shake

```css
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake {
    animation: shake 0.5s ease-in-out;
}
```

### Loading Dots

```css
@keyframes bounce {
    0%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
}

.loading-dots span {
    display: inline-block;
    animation: bounce 1.4s ease-in-out infinite;
}

.loading-dots span:nth-child(1) { animation-delay: 0s; }
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }
```

### Typing Effect

```css
@keyframes typing {
    from { width: 0; }
    to { width: 100%; }
}

@keyframes blink {
    0%, 100% { border-color: transparent; }
    50% { border-color: black; }
}

.typewriter {
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid black;
    animation:
        typing 3s steps(30) forwards,
        blink 1s step-end infinite;
}
```

## Multiple Animations

Apply multiple animations to one element:

```css
.element {
    animation:
        fadeIn 0.5s ease-out forwards,
        slideUp 0.5s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(20px); }
    to { transform: translateY(0); }
}
```

## Staggered Animations

Create sequential animations:

```css
.item {
    opacity: 0;
    animation: fadeInUp 0.5s ease-out forwards;
}

.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 100ms; }
.item:nth-child(3) { animation-delay: 200ms; }
.item:nth-child(4) { animation-delay: 300ms; }

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

### Using CSS Variables for Stagger

```css
.item {
    animation: fadeInUp 0.5s ease-out forwards;
    animation-delay: calc(var(--i, 0) * 100ms);
}
```

```html
<div class="item" style="--i: 0">Item 1</div>
<div class="item" style="--i: 1">Item 2</div>
<div class="item" style="--i: 2">Item 3</div>
```

## Performance Tips

### Animate Transform and Opacity

```css
/* Good - GPU accelerated */
@keyframes goodAnimation {
    from { transform: translateX(0); opacity: 0; }
    to { transform: translateX(100px); opacity: 1; }
}

/* Avoid - triggers layout */
@keyframes badAnimation {
    from { left: 0; width: 100px; }
    to { left: 100px; width: 200px; }
}
```

### Use will-change Sparingly

```css
.will-animate {
    will-change: transform, opacity;
}

/* Remove after animation */
.animation-complete {
    will-change: auto;
}
```

## Reduced Motion

Always respect user preferences:

```css
.animated {
    animation: bounce 1s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
    .animated {
        animation: none;
    }

    /* Or provide subtle alternative */
    .animated {
        animation: fadeIn 0.01s forwards;
    }
}
```

## Complete Example

```html
<section class="hero">
    <h1 class="hero-title">Welcome</h1>
    <p class="hero-subtitle">Build beautiful websites</p>
    <button class="cta-button">Get Started</button>
</section>

<div class="features">
    <div class="feature-card">Feature 1</div>
    <div class="feature-card">Feature 2</div>
    <div class="feature-card">Feature 3</div>
</div>
```

```css
/* Keyframe definitions */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes pulse {
    0%, 100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
    }
    50% {
        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    }
}

/* Hero animations */
.hero-title {
    opacity: 0;
    animation: fadeInUp 0.8s ease-out forwards;
}

.hero-subtitle {
    opacity: 0;
    animation: fadeInUp 0.8s ease-out 0.2s forwards;
}

.cta-button {
    opacity: 0;
    animation:
        fadeInUp 0.8s ease-out 0.4s forwards,
        pulse 2s ease-in-out 1.2s infinite;
}

/* Staggered feature cards */
.feature-card {
    opacity: 0;
    animation: scaleIn 0.5s ease-out forwards;
}

.feature-card:nth-child(1) { animation-delay: 0.6s; }
.feature-card:nth-child(2) { animation-delay: 0.8s; }
.feature-card:nth-child(3) { animation-delay: 1s; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .hero-title,
    .hero-subtitle,
    .cta-button,
    .feature-card {
        animation: none;
        opacity: 1;
    }

    .cta-button {
        box-shadow: none;
    }
}
```

## Key Takeaways

1. **@keyframes defines** the animation steps
2. **Use percentages** for multi-step animations
3. **`forwards` keeps** the final state after animation
4. **`alternate` creates** back-and-forth animations
5. **Stagger with delays** for sequential effects
6. **Animate transform/opacity** for best performance
7. **Always respect** `prefers-reduced-motion`

In the next lesson, we will explore CSS transforms for 2D and 3D effects.
