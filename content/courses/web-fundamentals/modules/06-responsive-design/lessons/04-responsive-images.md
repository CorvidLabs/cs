---
title: Responsive Images
order: 4
estimatedMinutes: 18
---

# Responsive Images

Images often make up the largest portion of a webpage's file size. Responsive images ensure they look great on all screens while loading efficiently.

## Basic Responsive Images

The simplest approach makes images scale within their container:

```css
img {
    max-width: 100%;
    height: auto;
}
```

This prevents images from:
- Overflowing their containers
- Stretching beyond their natural size
- Breaking on small screens

## The srcset Attribute

Serve different image sizes based on screen density or width:

### Resolution Switching (Screen Density)

```html
<img
    src="image-400.jpg"
    srcset="image-400.jpg 1x,
            image-800.jpg 2x,
            image-1200.jpg 3x"
    alt="Description of image"
>
```

- `1x` - Standard screens
- `2x` - Retina/HiDPI screens
- `3x` - Extra high density screens

### Width-Based Switching

```html
<img
    src="image-800.jpg"
    srcset="image-400.jpg 400w,
            image-800.jpg 800w,
            image-1200.jpg 1200w"
    sizes="(max-width: 600px) 100vw,
           (max-width: 900px) 50vw,
           33vw"
    alt="Description of image"
>
```

- `400w`, `800w`, `1200w` - Actual image widths
- `sizes` - Tells browser how wide the image will display

## The Picture Element

Use `<picture>` for art direction - showing different images at different sizes:

```html
<picture>
    <source media="(min-width: 1024px)" srcset="hero-wide.jpg">
    <source media="(min-width: 768px)" srcset="hero-medium.jpg">
    <img src="hero-mobile.jpg" alt="Hero banner">
</picture>
```

The browser uses the first matching `<source>`, falling back to `<img>`.

### Different Image Formats

Serve modern formats with fallbacks:

```html
<picture>
    <source type="image/avif" srcset="image.avif">
    <source type="image/webp" srcset="image.webp">
    <img src="image.jpg" alt="Description">
</picture>
```

Browsers use the first format they support.

## Lazy Loading

Defer loading of off-screen images:

```html
<img
    src="image.jpg"
    alt="Description"
    loading="lazy"
>
```

Benefits:
- Faster initial page load
- Reduced bandwidth usage
- Better performance metrics

Use `loading="eager"` for above-the-fold images.

## CSS Background Images

Make background images responsive:

```css
.hero {
    background-image: url('hero-mobile.jpg');
    background-size: cover;
    background-position: center;
}

@media (min-width: 768px) {
    .hero {
        background-image: url('hero-tablet.jpg');
    }
}

@media (min-width: 1024px) {
    .hero {
        background-image: url('hero-desktop.jpg');
    }
}
```

### Modern CSS with image-set()

```css
.hero {
    background-image: image-set(
        url('hero.webp') type('image/webp'),
        url('hero.jpg') type('image/jpeg')
    );
}
```

## Object-Fit for Images

Control how images fill their containers:

```css
.thumbnail {
    width: 200px;
    height: 200px;
    object-fit: cover;      /* Crop to fill */
    object-position: center; /* Crop from center */
}
```

Object-fit values:
- `cover` - Fill container, crop excess
- `contain` - Fit within container, may letterbox
- `fill` - Stretch to fill (distorts)
- `none` - Natural size
- `scale-down` - Smaller of none or contain

## Aspect Ratio

Maintain image proportions:

```css
.image-container {
    aspect-ratio: 16 / 9;
    width: 100%;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

## Performance Tips

### 1. Choose the Right Format

| Format | Best For |
|--------|----------|
| JPEG | Photos, complex images |
| PNG | Images with transparency |
| WebP | Modern replacement for JPEG/PNG |
| AVIF | Best compression, newer browsers |
| SVG | Icons, logos, illustrations |

### 2. Optimize Image Files

- Compress images before uploading
- Use appropriate dimensions (don't use 4000px image for 400px display)
- Consider using a CDN with automatic optimization

### 3. Specify Dimensions

Prevent layout shift by setting dimensions:

```html
<img
    src="image.jpg"
    alt="Description"
    width="800"
    height="600"
>
```

Or in CSS:

```css
img {
    aspect-ratio: 4 / 3;
    width: 100%;
    height: auto;
}
```

## Key Takeaways

1. Always use `max-width: 100%` on images
2. Use `srcset` to serve different sizes based on screen
3. Use `<picture>` for art direction and format fallbacks
4. Add `loading="lazy"` to off-screen images
5. Use `object-fit: cover` for consistent image containers
6. Specify dimensions to prevent layout shift
7. Choose the right image format for each use case

You now have the tools to create fully responsive websites!
