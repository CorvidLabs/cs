---
title: Links and Navigation
order: 3
estimatedMinutes: 18
---

# Links and Navigation

Links are the foundation of the web, connecting pages and resources together. The anchor element `<a>` is one of the most important HTML elements you will use.

## Basic Links

The anchor element creates clickable links:

```html
<a href="https://example.com">Visit Example</a>
```

The `href` attribute (hypertext reference) specifies the destination. The text between the tags becomes the clickable link text.

## Types of URLs

### Absolute URLs

Complete addresses including protocol and domain:

```html
<a href="https://www.example.com/page.html">External Link</a>
<a href="https://example.com/images/photo.jpg">Image Link</a>
```

### Relative URLs

Paths relative to the current page:

```html
<!-- Same directory -->
<a href="about.html">About Us</a>

<!-- Subdirectory -->
<a href="pages/contact.html">Contact</a>

<!-- Parent directory -->
<a href="../index.html">Home</a>

<!-- Root of the site -->
<a href="/products/shoes.html">Shoes</a>
```

Understanding relative paths:

```
project/
├── index.html           <- Current page
├── about.html           <- href="about.html"
├── pages/
│   ├── contact.html     <- href="pages/contact.html"
│   └── team.html
└── images/
    └── logo.png
```

### Root-Relative URLs

Start from the website root with a forward slash:

```html
<!-- Always refers to /about.html regardless of current location -->
<a href="/about.html">About</a>
```

## Special Link Types

### Email Links

```html
<a href="mailto:contact@example.com">Email Us</a>

<!-- With subject and body -->
<a href="mailto:support@example.com?subject=Help%20Request&body=I%20need%20help%20with...">
    Get Support
</a>
```

### Phone Links

```html
<a href="tel:+1-555-123-4567">Call Us: (555) 123-4567</a>
```

### Page Sections (Fragment Links)

Jump to a specific section on the same page:

```html
<!-- Link to section -->
<a href="#contact">Jump to Contact Section</a>

<!-- Target section (anywhere on the page) -->
<section id="contact">
    <h2>Contact Us</h2>
    <p>...</p>
</section>
```

### Download Links

```html
<a href="/files/report.pdf" download>Download Report (PDF)</a>

<!-- Specify download filename -->
<a href="/files/doc123.pdf" download="annual-report-2024.pdf">
    Download Annual Report
</a>
```

## Link Attributes

### Opening Links in New Tabs

```html
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
    External Site
</a>
```

When using `target="_blank"`, always include `rel="noopener noreferrer"` for security.

| Attribute | Purpose |
|-----------|---------|
| `target="_blank"` | Opens link in new tab |
| `rel="noopener"` | Prevents new page from accessing `window.opener` |
| `rel="noreferrer"` | Prevents sending referrer information |

### Link Relationships

The `rel` attribute describes the relationship between pages:

```html
<!-- Link to author's page -->
<a href="/about/jane" rel="author">Jane Smith</a>

<!-- Link to help documentation -->
<a href="/help" rel="help">Get Help</a>

<!-- External link -->
<a href="https://example.com" rel="external">Partner Site</a>

<!-- No endorsement -->
<a href="https://advertiser.com" rel="nofollow sponsored">Sponsored Link</a>
```

### Accessible Link Titles

Use `title` for additional context (shown on hover):

```html
<a href="/pricing" title="View our pricing plans and options">Pricing</a>
```

Note: Dont rely solely on `title` for important information as its not accessible to all users.

## Navigation Patterns

### Basic Navigation

```html
<nav aria-label="Main">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

### Current Page Indicator

Use `aria-current` to indicate the current page:

```html
<nav aria-label="Main">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products" aria-current="page">Products</a></li>
        <li><a href="/services">Services</a></li>
    </ul>
</nav>
```

### Breadcrumb Navigation

```html
<nav aria-label="Breadcrumb">
    <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/products/shoes">Shoes</a></li>
        <li><span aria-current="page">Running Shoes</span></li>
    </ol>
</nav>
```

### Skip Navigation Link

Help keyboard users skip repetitive content:

```html
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header>
        <nav><!-- Long navigation menu --></nav>
    </header>

    <main id="main-content">
        <!-- Main content starts here -->
    </main>
</body>
```

With CSS to hide it until focused:

```css
.skip-link {
    position: absolute;
    left: -9999px;
}

.skip-link:focus {
    position: static;
    left: auto;
}
```

## Writing Good Link Text

### Avoid Generic Link Text

```html
<!-- Bad: unclear where the link goes -->
<p>To learn more about our services, <a href="/services">click here</a>.</p>
<p>Read our privacy policy <a href="/privacy">here</a>.</p>

<!-- Good: descriptive link text -->
<p><a href="/services">Learn more about our services</a>.</p>
<p>Read our <a href="/privacy">privacy policy</a>.</p>
```

### Links Should Make Sense Out of Context

Screen reader users often navigate by links alone. Each link should describe its destination:

```html
<!-- Bad: makes no sense out of context -->
<a href="/report.pdf">Download</a>
<a href="/signup">Click here</a>

<!-- Good: clear destination -->
<a href="/report.pdf">Download 2024 Annual Report (PDF, 2MB)</a>
<a href="/signup">Create your free account</a>
```

## Image Links

Wrap images in anchor elements:

```html
<a href="/products/shoes">
    <img src="shoes.jpg" alt="Running shoes - View details">
</a>
```

When an image is a link, the `alt` text should describe the link destination, not just the image.

## Button vs Link

Use the right element for the job:

```html
<!-- Links: navigation to another page/section -->
<a href="/checkout">Proceed to Checkout</a>
<a href="#reviews">Read Reviews</a>

<!-- Buttons: actions that don't navigate -->
<button type="button">Add to Cart</button>
<button type="submit">Submit Form</button>
```

| Use Case | Element |
|----------|---------|
| Navigate to a new page | `<a>` |
| Navigate to a section | `<a href="#section">` |
| Submit a form | `<button type="submit">` |
| Toggle a menu | `<button>` |
| Open a modal | `<button>` |
| Delete an item | `<button>` |

## Complete Navigation Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Company Website</title>
</head>
<body>
    <a href="#main" class="skip-link">Skip to main content</a>

    <header>
        <a href="/" aria-label="Company Name - Home">
            <img src="/images/logo.svg" alt="" width="150" height="40">
        </a>

        <nav aria-label="Main">
            <ul>
                <li><a href="/" aria-current="page">Home</a></li>
                <li><a href="/products">Products</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main id="main">
        <nav aria-label="Breadcrumb">
            <ol>
                <li><a href="/">Home</a></li>
                <li><span aria-current="page">Welcome</span></li>
            </ol>
        </nav>

        <h1>Welcome to Our Company</h1>

        <section>
            <h2>Quick Links</h2>
            <ul>
                <li><a href="/getting-started">Getting started guide</a></li>
                <li><a href="/docs/api.pdf" download>Download API documentation (PDF, 1.5MB)</a></li>
                <li>
                    <a href="https://github.com/company/project"
                       target="_blank"
                       rel="noopener noreferrer">
                        View project on GitHub (opens in new tab)
                    </a>
                </li>
            </ul>
        </section>

        <section>
            <h2>Contact</h2>
            <ul>
                <li><a href="mailto:info@company.com">Email us at info@company.com</a></li>
                <li><a href="tel:+15551234567">Call us: (555) 123-4567</a></li>
            </ul>
        </section>
    </main>

    <footer>
        <nav aria-label="Footer">
            <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/accessibility">Accessibility Statement</a></li>
            </ul>
        </nav>

        <p>&copy; 2024 Company Name</p>
    </footer>
</body>
</html>
```

## Key Takeaways

1. **Use descriptive link text** - Avoid "click here" or "read more"
2. **Understand URL types** - Absolute, relative, and root-relative
3. **Use `target="_blank"` with `rel="noopener noreferrer"`** for security
4. **Add `aria-current="page"`** to indicate the current page in navigation
5. **Include skip links** for keyboard accessibility
6. **Links navigate, buttons act** - Choose the right element
7. **Fragment links (#)** jump to sections with matching IDs

In the next lesson, we will explore images and media in HTML.
