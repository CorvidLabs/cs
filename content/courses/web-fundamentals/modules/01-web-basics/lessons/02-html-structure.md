---
title: HTML Document Structure
order: 2
estimatedMinutes: 15
---

# HTML Document Structure

Every HTML document follows the same basic structure. Understanding this skeleton is essential before adding content.

## The Basic HTML Template

Here's the minimal structure every HTML page needs:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <!-- Your content goes here -->
</body>
</html>
```

Let's break down each part.

## The DOCTYPE Declaration

```html
<!DOCTYPE html>
```

This line tells the browser which version of HTML to use. `<!DOCTYPE html>` means HTML5, the modern standard. It must be the very first line of your document.

Without it, browsers enter "quirks mode" and may render your page inconsistently.

## The html Element

```html
<html lang="en">
    <!-- Everything else goes here -->
</html>
```

The `<html>` element is the root container for your entire page. The `lang` attribute specifies the language:

- `lang="en"` - English
- `lang="es"` - Spanish
- `lang="fr"` - French
- `lang="zh"` - Chinese

This helps screen readers pronounce content correctly and improves SEO.

## The head Element

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
```

The `<head>` contains metadata (information about the page) that doesn't appear on screen:

### Essential Meta Tags

```html
<meta charset="UTF-8">
```
Specifies character encoding. UTF-8 supports virtually all languages and symbols.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
Makes your page responsive on mobile devices. Without this, mobile browsers zoom out to fit a "desktop" view.

### The Title Tag

```html
<title>My Awesome Page</title>
```

The `<title>` appears in:
- Browser tabs
- Bookmarks
- Search engine results

Every page needs a unique, descriptive title!

### Other Common Head Elements

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A brief description for search engines">
    <title>Page Title</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico">
</head>
```

## The body Element

```html
<body>
    <h1>Welcome to My Website</h1>
    <p>This is visible content!</p>
</body>
```

The `<body>` contains everything visible on the page: text, images, links, buttons, and more.

## HTML Elements and Tags

HTML uses **tags** to create **elements**:

```html
<tagname>Content goes here</tagname>
└──┬───┘                   └────┬────┘
opening tag               closing tag
```

Most elements have opening and closing tags:

```html
<h1>This is a heading</h1>
<p>This is a paragraph</p>
<a href="https://example.com">This is a link</a>
```

### Self-Closing Elements

Some elements don't have content and don't need closing tags:

```html
<img src="photo.jpg" alt="A description">
<br>
<hr>
<meta charset="UTF-8">
<input type="text">
```

## Nesting Elements

Elements can contain other elements. This is called **nesting**:

```html
<article>
    <h2>Article Title</h2>
    <p>This is a <strong>bold</strong> statement.</p>
</article>
```

Think of it like Russian nesting dolls:

```
article
└── h2
│   └── "Article Title"
└── p
    └── "This is a "
    └── strong
    │   └── "bold"
    └── " statement."
```

### Proper Nesting

Elements must close in the correct order:

```html
<!-- Correct -->
<p>This is <strong>correct</strong> nesting.</p>

<!-- Incorrect - tags overlap -->
<p>This is <strong>incorrect</p> nesting.</strong>
```

## Attributes

Attributes provide additional information about elements:

```html
<a href="https://example.com" target="_blank" class="nav-link">
   Click here
</a>
```

```
<tagname attribute="value" attribute="value">
         └──────────┬──────────────────────┘
              attributes
```

Common attributes include:
- `id` - Unique identifier for the element
- `class` - Category for styling
- `href` - URL for links
- `src` - Source for images
- `alt` - Alternative text for images

## Comments

Comments help you document your code. Browsers ignore them:

```html
<!-- This is a comment -->

<!--
    Multi-line comments
    work like this
-->

<p>This is visible</p> <!-- This comment is at the end -->
```

## Whitespace and Formatting

Browsers collapse multiple spaces and line breaks into a single space:

```html
<p>These     words      have
   lots of     space.</p>
```

Displays as: "These words have lots of space."

Use indentation to show nesting (usually 2 or 4 spaces):

```html
<article>
    <header>
        <h1>Title</h1>
    </header>
    <section>
        <p>Content here.</p>
    </section>
</article>
```

## A Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="My personal portfolio website">
    <title>Jane Doe | Web Developer</title>
</head>
<body>
    <header>
        <h1>Jane Doe</h1>
        <p>Web Developer & Designer</p>
    </header>

    <main>
        <section>
            <h2>About Me</h2>
            <p>I build beautiful, accessible websites.</p>
        </section>
    </main>

    <footer>
        <p>Contact: jane@example.com</p>
    </footer>
</body>
</html>
```

## Key Takeaways

1. Every HTML document needs `<!DOCTYPE html>`, `<html>`, `<head>`, and `<body>`
2. The `<head>` contains metadata; the `<body>` contains visible content
3. Elements are created with opening and closing tags
4. Proper nesting means closing tags in the correct order
5. Attributes provide additional information about elements
6. Comments help document your code without appearing on screen

With this foundation, you're ready to start building real pages. Next, we'll explore browser developer tools!
