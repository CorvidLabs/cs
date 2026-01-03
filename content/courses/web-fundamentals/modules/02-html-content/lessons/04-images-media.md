---
title: Images and Media
order: 4
estimatedMinutes: 20
---

# Images and Media

Images make web pages visually engaging and can convey information that words alone cannot. Learning to use images properly includes understanding accessibility, performance, and responsive design.

## The Image Element

The `<img>` element embeds images:

```html
<img src="photo.jpg" alt="A sunset over the ocean">
```

### Required Attributes

| Attribute | Purpose |
|-----------|---------|
| `src` | Path to the image file |
| `alt` | Alternative text for accessibility |

Both attributes are essential. The `alt` attribute is not optional.

### Recommended Attributes

```html
<img
    src="photo.jpg"
    alt="A sunset over the ocean with orange and purple clouds"
    width="800"
    height="600"
    loading="lazy"
>
```

| Attribute | Purpose |
|-----------|---------|
| `width` | Image width in pixels |
| `height` | Image height in pixels |
| `loading` | Controls when the image loads |

Setting `width` and `height` prevents layout shifts as images load.

## Writing Good Alt Text

Alt text serves multiple purposes:
- Screen readers read it aloud
- Shows when images fail to load
- Search engines use it to understand images

### Guidelines for Alt Text

```html
<!-- Describe what the image shows -->
<img src="team.jpg" alt="Five team members standing in the office lobby">

<!-- Be concise but specific -->
<img src="chart.png" alt="Bar chart showing sales increased 25% from Q1 to Q4">

<!-- Include relevant details -->
<img src="product.jpg" alt="Red leather handbag with gold clasp, front view">
```

### When to Use Empty Alt

Use `alt=""` for decorative images that add no information:

```html
<!-- Decorative separator -->
<img src="divider.png" alt="">

<!-- Icon next to text that already explains it -->
<a href="tel:555-1234">
    <img src="phone-icon.svg" alt="">
    Call us: 555-1234
</a>
```

Never omit the `alt` attribute entirely. Use `alt=""` for decorative images.

### Alt Text Examples

| Image Type | Example Alt Text |
|------------|------------------|
| Photo of a person | "Sarah Chen, CEO, speaking at the 2024 conference" |
| Product image | "Blue denim jacket, front view, size medium" |
| Data chart | "Line graph showing website traffic doubling from January to June" |
| Logo | "Acme Corporation" |
| Decorative | "" (empty) |
| Complex diagram | Brief alt + longer description elsewhere |

## Image Formats

Choose the right format for your needs:

| Format | Best For | Features |
|--------|----------|----------|
| JPEG | Photos | Lossy compression, small files |
| PNG | Graphics, transparency | Lossless, supports transparency |
| GIF | Simple animations | Limited colors (256) |
| SVG | Icons, logos | Vector, scales perfectly |
| WebP | Modern alternative | Better compression than JPEG/PNG |
| AVIF | Newest format | Best compression, growing support |

```html
<!-- Photo: use JPEG or WebP -->
<img src="photo.jpg" alt="...">

<!-- Icon: use SVG -->
<img src="icon.svg" alt="...">

<!-- Screenshot: use PNG -->
<img src="screenshot.png" alt="...">
```

## Responsive Images

### The `srcset` Attribute

Provide multiple image sizes for different screen widths:

```html
<img
    src="photo-800.jpg"
    srcset="photo-400.jpg 400w,
            photo-800.jpg 800w,
            photo-1200.jpg 1200w"
    sizes="(max-width: 600px) 100vw,
           (max-width: 1200px) 50vw,
           800px"
    alt="Mountain landscape"
>
```

- `srcset`: List of images with their widths
- `sizes`: How wide the image displays at different viewport sizes
- `src`: Fallback for browsers that dont support srcset

### The Picture Element

Use `<picture>` for art direction or format selection:

```html
<picture>
    <!-- Modern format with fallback -->
    <source srcset="photo.avif" type="image/avif">
    <source srcset="photo.webp" type="image/webp">
    <img src="photo.jpg" alt="Product photo">
</picture>
```

Art direction example (different crops for different screens):

```html
<picture>
    <!-- Wide crop for large screens -->
    <source
        media="(min-width: 1024px)"
        srcset="hero-wide.jpg"
    >
    <!-- Square crop for medium screens -->
    <source
        media="(min-width: 640px)"
        srcset="hero-square.jpg"
    >
    <!-- Tall crop for mobile -->
    <img src="hero-tall.jpg" alt="Hero image showing our product">
</picture>
```

## Figure and Figcaption

Group images with captions:

```html
<figure>
    <img
        src="chart.png"
        alt="Bar chart showing quarterly revenue growth"
    >
    <figcaption>
        Figure 1: Quarterly revenue from 2020 to 2024
    </figcaption>
</figure>
```

Figures can contain multiple images:

```html
<figure>
    <img src="before.jpg" alt="Kitchen before renovation">
    <img src="after.jpg" alt="Kitchen after renovation">
    <figcaption>Kitchen transformation: before and after our remodel</figcaption>
</figure>
```

## Lazy Loading

Defer loading of off-screen images:

```html
<!-- Load immediately (above the fold) -->
<img src="hero.jpg" alt="..." loading="eager">

<!-- Load when approaching viewport -->
<img src="photo.jpg" alt="..." loading="lazy">
```

Use `loading="lazy"` for images below the fold to improve initial page load.

## Performance Best Practices

### Specify Dimensions

Always include width and height to prevent layout shift:

```html
<img
    src="photo.jpg"
    alt="..."
    width="800"
    height="600"
>
```

With CSS, you can make images responsive while maintaining aspect ratio:

```css
img {
    max-width: 100%;
    height: auto;
}
```

### Use Modern Formats

```html
<picture>
    <source srcset="image.avif" type="image/avif">
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="...">
</picture>
```

### Optimize Image Files

- Compress images before uploading
- Serve appropriately sized images
- Use CDNs for faster delivery

## Video

Embed video with the `<video>` element:

```html
<video controls width="640" height="360">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    <p>Your browser does not support HTML video.
       <a href="video.mp4">Download the video</a> instead.</p>
</video>
```

### Video Attributes

| Attribute | Purpose |
|-----------|---------|
| `controls` | Show playback controls |
| `autoplay` | Start playing automatically (avoid for UX) |
| `muted` | Start muted (required with autoplay) |
| `loop` | Restart when finished |
| `poster` | Image to show before playing |
| `preload` | How much to load initially |

```html
<video
    controls
    poster="video-thumbnail.jpg"
    preload="metadata"
    width="640"
    height="360"
>
    <source src="video.mp4" type="video/mp4">
</video>
```

### Video Accessibility

Include captions for accessibility:

```html
<video controls>
    <source src="video.mp4" type="video/mp4">
    <track
        kind="captions"
        src="captions-en.vtt"
        srclang="en"
        label="English"
        default
    >
</video>
```

## Audio

Embed audio with the `<audio>` element:

```html
<audio controls>
    <source src="podcast.mp3" type="audio/mpeg">
    <source src="podcast.ogg" type="audio/ogg">
    <p>Your browser does not support audio.
       <a href="podcast.mp3">Download the audio</a>.</p>
</audio>
```

### Audio with Transcript

For accessibility, provide transcripts:

```html
<figure>
    <audio controls>
        <source src="interview.mp3" type="audio/mpeg">
    </audio>
    <figcaption>
        Interview with Dr. Smith about climate change.
        <a href="transcript.html">Read the transcript</a>
    </figcaption>
</figure>
```

## Embedded Content

### iframes

Embed external content like maps or videos:

```html
<iframe
    src="https://www.youtube.com/embed/VIDEO_ID"
    width="560"
    height="315"
    title="Video title for accessibility"
    allowfullscreen
></iframe>
```

Always include a `title` attribute for accessibility.

### Security for iframes

```html
<iframe
    src="https://external-site.com/widget"
    sandbox="allow-scripts allow-same-origin"
    title="Weather widget"
></iframe>
```

The `sandbox` attribute restricts what the embedded content can do.

## Complete Example

```html
<article>
    <h1>Our National Parks Photo Gallery</h1>

    <figure>
        <picture>
            <source
                media="(min-width: 1024px)"
                srcset="yosemite-wide.avif"
                type="image/avif"
            >
            <source
                media="(min-width: 1024px)"
                srcset="yosemite-wide.webp"
                type="image/webp"
            >
            <source
                srcset="yosemite-square.avif"
                type="image/avif"
            >
            <source
                srcset="yosemite-square.webp"
                type="image/webp"
            >
            <img
                src="yosemite-square.jpg"
                alt="Half Dome in Yosemite National Park at sunset, with pink clouds reflecting on the granite face"
                width="800"
                height="600"
                loading="eager"
            >
        </picture>
        <figcaption>Half Dome at sunset, Yosemite National Park</figcaption>
    </figure>

    <section>
        <h2>More Photos</h2>

        <figure>
            <img
                src="yellowstone.jpg"
                alt="Grand Prismatic Spring with steam rising, showing vibrant orange, yellow, and blue colors"
                width="600"
                height="400"
                loading="lazy"
            >
            <figcaption>Grand Prismatic Spring, Yellowstone</figcaption>
        </figure>

        <figure>
            <img
                src="grand-canyon.jpg"
                alt="Panoramic view of the Grand Canyon from the South Rim at midday"
                width="600"
                height="400"
                loading="lazy"
            >
            <figcaption>Grand Canyon from the South Rim</figcaption>
        </figure>
    </section>

    <section>
        <h2>Park Introduction Video</h2>
        <video
            controls
            poster="video-poster.jpg"
            width="640"
            height="360"
        >
            <source src="parks-intro.mp4" type="video/mp4">
            <track
                kind="captions"
                src="parks-captions.vtt"
                srclang="en"
                label="English"
                default
            >
            <p>Your browser does not support video.
               <a href="parks-intro.mp4">Download the video</a>.</p>
        </video>
    </section>
</article>
```

## Key Takeaways

1. **Always include `alt` text** - Use descriptive text or `alt=""` for decorative images
2. **Set width and height** - Prevents layout shift during loading
3. **Use `loading="lazy"`** - For images below the fold
4. **Choose the right format** - JPEG for photos, SVG for icons, WebP for modern browsers
5. **Use `<picture>`** - For art direction and format fallbacks
6. **Use `<figure>` and `<figcaption>`** - For images with captions
7. **Include captions for video** - Use `<track>` for accessibility
8. **Optimize images** - Compress and serve appropriate sizes

You have now completed the HTML Content module. Next, we will explore forms and tables.
