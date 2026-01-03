---
title: Semantic HTML
order: 1
estimatedMinutes: 20
---

# Semantic HTML

Semantic HTML means using HTML elements that describe the meaning of content, not just how it looks. This makes your websites more accessible, better for search engines, and easier to maintain.

## Why Semantics Matter

Compare these two approaches to marking up a page header:

```html
<!-- Non-semantic approach -->
<div class="header">
    <div class="logo">My Site</div>
    <div class="nav">
        <div class="nav-item">Home</div>
        <div class="nav-item">About</div>
    </div>
</div>

<!-- Semantic approach -->
<header>
    <h1>My Site</h1>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
</header>
```

The semantic version:
- **Screen readers** can identify the header and navigation
- **Search engines** understand your page structure
- **Developers** immediately know what each section does
- **Browsers** can offer special features (like reader mode)

## Document Structure Elements

HTML5 introduced elements specifically for page structure:

```
┌─────────────────────────────────────────────────────────┐
│                      <header>                            │
│  Logo, site title, main navigation                       │
├─────────────────────────────────────────────────────────┤
│  <nav>                                                   │
│  Main navigation links                                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  <main>                                                  │
│  ┌─────────────────────────┐  ┌───────────────────────┐ │
│  │       <article>          │  │      <aside>          │ │
│  │  Self-contained content  │  │  Related content      │ │
│  │  ┌─────────────────────┐ │  │  Sidebars, ads        │ │
│  │  │     <section>       │ │  │                       │ │
│  │  │  Thematic grouping  │ │  │                       │ │
│  │  └─────────────────────┘ │  │                       │ │
│  └─────────────────────────┘  └───────────────────────┘ │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                      <footer>                            │
│  Copyright, contact info, secondary navigation           │
└─────────────────────────────────────────────────────────┘
```

### `<header>`

The header element represents introductory content. A page can have multiple headers:

```html
<!-- Page header -->
<header>
    <h1>Company Name</h1>
    <nav>...</nav>
</header>

<!-- Article header -->
<article>
    <header>
        <h2>Article Title</h2>
        <p>Published on <time datetime="2024-01-15">January 15, 2024</time></p>
    </header>
    <p>Article content...</p>
</article>
```

### `<nav>`

Use `<nav>` for major navigation blocks:

```html
<nav aria-label="Main">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

Note: Not every group of links needs `<nav>`. Use it for primary navigation, not for every list of links.

### `<main>`

The `<main>` element contains the primary content of the page. There should be only one `<main>` per page:

```html
<body>
    <header>...</header>
    <nav>...</nav>

    <main>
        <h1>Welcome to Our Store</h1>
        <p>Browse our collection of products...</p>
    </main>

    <footer>...</footer>
</body>
```

### `<article>`

An `<article>` is a self-contained piece of content that could be distributed independently:

```html
<article>
    <header>
        <h2>How to Make Perfect Pasta</h2>
        <p>By Chef Maria | 5 min read</p>
    </header>

    <p>The secret to perfect pasta starts with salted water...</p>

    <footer>
        <p>Tags: cooking, Italian, beginner</p>
    </footer>
</article>
```

Good uses for `<article>`:
- Blog posts
- News articles
- Product cards
- User comments
- Forum posts

### `<section>`

A `<section>` groups related content with a heading:

```html
<article>
    <h1>Complete Guide to HTML</h1>

    <section>
        <h2>Introduction</h2>
        <p>HTML stands for HyperText Markup Language...</p>
    </section>

    <section>
        <h2>Basic Syntax</h2>
        <p>HTML uses tags to structure content...</p>
    </section>

    <section>
        <h2>Common Elements</h2>
        <p>Let's explore the most used elements...</p>
    </section>
</article>
```

### `<aside>`

Content tangentially related to the main content:

```html
<main>
    <article>
        <h1>Understanding Climate Change</h1>
        <p>Global temperatures have risen significantly...</p>
    </article>

    <aside>
        <h2>Related Articles</h2>
        <ul>
            <li><a href="/renewable-energy">Renewable Energy Sources</a></li>
            <li><a href="/carbon-footprint">Reducing Your Carbon Footprint</a></li>
        </ul>
    </aside>
</main>
```

### `<footer>`

Contains footer information for its nearest sectioning ancestor:

```html
<footer>
    <nav aria-label="Footer">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
    </nav>
    <p>&copy; 2024 Company Name. All rights reserved.</p>
</footer>
```

## Choosing the Right Element

Ask yourself these questions:

| Question | If Yes, Use |
|----------|-------------|
| Is it the primary content of the page? | `<main>` |
| Could it be republished on another site? | `<article>` |
| Is it a thematic grouping with a heading? | `<section>` |
| Is it related but not essential content? | `<aside>` |
| Is it introductory content? | `<header>` |
| Is it major navigation? | `<nav>` |
| Is it closing information? | `<footer>` |
| None of the above? | `<div>` |

## Common Mistakes

### Using `<section>` as a generic container

```html
<!-- Wrong: section just for styling -->
<section class="blue-background">
    <p>Some content</p>
</section>

<!-- Right: use div for styling purposes -->
<div class="blue-background">
    <p>Some content</p>
</div>
```

### Skipping heading levels

```html
<!-- Wrong: skips h2 -->
<article>
    <h1>Main Title</h1>
    <h3>Subsection</h3>
</article>

<!-- Right: proper hierarchy -->
<article>
    <h1>Main Title</h1>
    <h2>Subsection</h2>
</article>
```

### Using `<nav>` for every link group

```html
<!-- Wrong: nav for simple link list -->
<nav>
    <a href="/twitter">Twitter</a>
    <a href="/facebook">Facebook</a>
</nav>

<!-- Right: nav for main navigation only -->
<ul class="social-links">
    <li><a href="/twitter">Twitter</a></li>
    <li><a href="/facebook">Facebook</a></li>
</ul>
```

## Complete Example

Here is a complete semantic page structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Blog</title>
</head>
<body>
    <header>
        <h1>Tech Blog</h1>
        <nav aria-label="Main">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/articles">Articles</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <header>
                <h2>Understanding Web Accessibility</h2>
                <p>By Jane Smith | <time datetime="2024-03-15">March 15, 2024</time></p>
            </header>

            <section>
                <h3>What is Accessibility?</h3>
                <p>Web accessibility ensures that websites work for everyone...</p>
            </section>

            <section>
                <h3>Why It Matters</h3>
                <p>Over one billion people worldwide have disabilities...</p>
            </section>

            <footer>
                <p>Filed under: Accessibility, Best Practices</p>
            </footer>
        </article>

        <aside>
            <h2>Popular Posts</h2>
            <ul>
                <li><a href="/css-grid">Mastering CSS Grid</a></li>
                <li><a href="/javascript-basics">JavaScript Fundamentals</a></li>
            </ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2024 Tech Blog</p>
        <nav aria-label="Footer">
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
        </nav>
    </footer>
</body>
</html>
```

## Key Takeaways

1. **Semantic elements describe meaning**, not appearance
2. **Use `<main>`** for primary page content (only one per page)
3. **Use `<article>`** for self-contained, redistributable content
4. **Use `<section>`** for thematic groupings with headings
5. **Use `<div>`** when no semantic element fits
6. **Maintain heading hierarchy** (h1 > h2 > h3, never skip levels)
7. **Add `aria-label`** to distinguish multiple `<nav>` elements

Semantic HTML is the foundation of accessible, maintainable websites. In the next lesson, we will explore text elements in detail.
