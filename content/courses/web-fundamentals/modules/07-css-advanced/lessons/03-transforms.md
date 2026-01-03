---
title: CSS Transforms
order: 4
estimatedMinutes: 20
---

# CSS Transforms

CSS transforms allow you to rotate, scale, skew, and translate elements in 2D and 3D space. They are hardware-accelerated, making them ideal for animations and interactive effects.

## Basic Transform Functions

### Translate (Move)

```css
.element {
    transform: translateX(50px);   /* Move right 50px */
    transform: translateY(-20px);  /* Move up 20px */
    transform: translate(50px, -20px); /* Both */
}
```

Percentages are relative to the element's own size:

```css
.center-absolute {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* Centers the element perfectly */
}
```

### Scale (Resize)

```css
.element {
    transform: scaleX(1.5);   /* 150% width */
    transform: scaleY(0.8);   /* 80% height */
    transform: scale(1.5);    /* 150% both */
    transform: scale(1.5, 0.8); /* Different X and Y */
}
```

Scale maintains the element's position in the layout:

```css
.card:hover {
    transform: scale(1.05);
    /* Element grows but doesn't push other elements */
}
```

### Rotate

```css
.element {
    transform: rotate(45deg);   /* Clockwise 45 degrees */
    transform: rotate(-90deg);  /* Counter-clockwise 90 degrees */
    transform: rotate(0.5turn); /* Half turn (180 degrees) */
}
```

### Skew

```css
.element {
    transform: skewX(15deg);    /* Skew horizontally */
    transform: skewY(10deg);    /* Skew vertically */
    transform: skew(15deg, 10deg); /* Both */
}
```

## Combining Transforms

Apply multiple transforms (order matters):

```css
.element {
    transform: translateX(50px) rotate(45deg) scale(1.2);
}
```

The transforms are applied right to left:
1. First scale to 1.2
2. Then rotate 45 degrees
3. Finally translate 50px right

Different order produces different results:

```css
/* Rotate then translate */
.a { transform: rotate(45deg) translateX(100px); }
/* Translates along the rotated axis */

/* Translate then rotate */
.b { transform: translateX(100px) rotate(45deg); }
/* Translates along the original axis, then rotates */
```

## Transform Origin

Change the point around which transforms occur:

```css
.element {
    transform-origin: center;        /* Default */
    transform-origin: top left;
    transform-origin: bottom right;
    transform-origin: 50% 100%;      /* Bottom center */
    transform-origin: 0 0;           /* Top left in pixels */
}
```

### Rotate from Corner

```css
.door {
    transform-origin: left center;
    transition: transform 0.5s;
}

.door:hover {
    transform: rotateY(-90deg);
}
```

### Scale from Top

```css
.dropdown {
    transform-origin: top center;
    transform: scaleY(0);
    transition: transform 0.3s;
}

.dropdown.open {
    transform: scaleY(1);
}
```

## 3D Transforms

### Perspective

Enable 3D space on the parent:

```css
.container {
    perspective: 1000px;
    /* Distance from viewer - smaller = more dramatic */
}

/* Or on the element itself */
.element {
    transform: perspective(1000px) rotateY(45deg);
}
```

### 3D Rotation

```css
.element {
    transform: rotateX(45deg);  /* Rotate around X axis */
    transform: rotateY(45deg);  /* Rotate around Y axis */
    transform: rotateZ(45deg);  /* Same as rotate() */
    transform: rotate3d(1, 1, 0, 45deg); /* Custom axis */
}
```

### 3D Translation

```css
.element {
    transform: translateZ(50px);  /* Towards/away from viewer */
    transform: translate3d(10px, 20px, 50px); /* X, Y, Z */
}
```

### Preserve 3D

Make child elements exist in 3D space:

```css
.container {
    perspective: 1000px;
}

.card {
    transform-style: preserve-3d;
    transition: transform 0.6s;
}

.card:hover {
    transform: rotateY(180deg);
}

.card-front,
.card-back {
    position: absolute;
    backface-visibility: hidden;
}

.card-back {
    transform: rotateY(180deg);
}
```

## Common Transform Patterns

### Button Press Effect

```css
.button {
    transition: transform 0.1s;
}

.button:hover {
    transform: translateY(-2px);
}

.button:active {
    transform: translateY(0);
}
```

### Card Lift

```css
.card {
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
```

### Rotate on Hover

```css
.icon {
    transition: transform 0.3s;
}

.button:hover .icon {
    transform: rotate(90deg);
}
```

### Flip Animation

```css
.flip-card {
    perspective: 1000px;
    width: 200px;
    height: 300px;
}

.flip-card-inner {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s;
}

.flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
}

.flip-card-back {
    transform: rotateY(180deg);
}
```

### Zoom Image

```css
.image-container {
    overflow: hidden;
}

.image-container img {
    transition: transform 0.5s;
}

.image-container:hover img {
    transform: scale(1.1);
}
```

### Parallax Layers

```css
.parallax-container {
    perspective: 1px;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
}

.parallax-layer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.parallax-back {
    transform: translateZ(-2px) scale(3);
}

.parallax-front {
    transform: translateZ(0);
}
```

### Tooltip Arrow

```css
.tooltip::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    border: 8px solid transparent;
    border-bottom-color: #333;
    transform: translateX(-50%);
}
```

## Performance

Transforms are GPU-accelerated:

```css
/* Good performance */
.fast {
    transform: translateX(100px);
    transform: scale(1.5);
    transform: rotate(45deg);
}

/* Poor performance - use transform instead */
.slow {
    left: 100px;     /* Use translateX */
    width: 150%;     /* Use scale */
    margin-left: 50px; /* Use translateX */
}
```

### Hardware Acceleration Hints

```css
.element {
    will-change: transform;
    /* Tells browser to prepare for transform changes */
}

/* Remove after animation */
.element.done {
    will-change: auto;
}
```

## Matrix Transform

All 2D transforms can be expressed as a matrix:

```css
.element {
    transform: matrix(a, b, c, d, tx, ty);
    /* Where:
       a = scaleX
       b = skewY
       c = skewX
       d = scaleY
       tx = translateX
       ty = translateY
    */
}

/* Equivalent transforms */
.a { transform: translate(50px, 100px); }
.b { transform: matrix(1, 0, 0, 1, 50, 100); }
```

## Complete Example

```html
<div class="gallery">
    <div class="gallery-item">
        <img src="photo.jpg" alt="Photo">
        <div class="overlay">
            <h3>Title</h3>
            <p>Description</p>
        </div>
    </div>
</div>

<div class="flip-card">
    <div class="flip-card-inner">
        <div class="flip-card-front">
            <h2>Front</h2>
        </div>
        <div class="flip-card-back">
            <h2>Back</h2>
        </div>
    </div>
</div>
```

```css
/* Gallery with zoom and overlay */
.gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
}

.gallery-item img {
    display: block;
    width: 100%;
    transition: transform 0.5s ease;
}

.gallery-item:hover img {
    transform: scale(1.1);
}

.overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s, transform 0.3s;
}

.gallery-item:hover .overlay {
    opacity: 1;
    transform: translateY(0);
}

/* 3D Flip Card */
.flip-card {
    width: 200px;
    height: 300px;
    perspective: 1000px;
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.flip-card-front {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.flip-card-back {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    transform: rotateY(180deg);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
    .gallery-item img,
    .overlay,
    .flip-card-inner {
        transition: none;
    }

    .gallery-item:hover img {
        transform: none;
    }

    .flip-card:hover .flip-card-inner {
        transform: none;
    }
}
```

## Key Takeaways

1. **translate()** moves elements without affecting layout
2. **scale()** resizes while maintaining position
3. **rotate()** spins around transform-origin
4. **Transform order matters** - applied right to left
5. **perspective** enables 3D effects on children
6. **backface-visibility: hidden** for flip cards
7. **Transforms are GPU-accelerated** for smooth animations
8. **Use translate(-50%, -50%)** for perfect centering

You have completed the Advanced CSS module. Next, we will explore accessibility.
