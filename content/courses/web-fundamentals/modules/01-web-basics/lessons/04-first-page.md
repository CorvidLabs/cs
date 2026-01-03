---
title: Creating Your First HTML Page
order: 4
estimatedMinutes: 15
---

# Creating Your First HTML Page

Time to put your knowledge into practice! In this lesson, you'll create a complete HTML page from scratch.

## What You'll Build

We'll create a simple "About Me" page with:
- A heading with your name
- A paragraph about yourself
- A list of hobbies
- A link to your favorite website

## Step 1: Create the File

Create a new file called `index.html`. The `.html` extension tells your computer this is an HTML file.

Why `index.html`? Web servers look for this file by default when you visit a folder. It's the standard name for a homepage.

## Step 2: Add the Document Structure

Start with the basic HTML skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Me</title>
</head>
<body>

</body>
</html>
```

This gives you a valid, empty HTML page.

## Step 3: Add a Heading

Inside the `<body>`, add a main heading with your name:

```html
<body>
    <h1>Jane Doe</h1>
</body>
```

HTML has six heading levels, from `<h1>` (largest) to `<h6>` (smallest):

```html
<h1>Heading 1 - Main title</h1>
<h2>Heading 2 - Section title</h2>
<h3>Heading 3 - Subsection</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6 - Smallest</h6>
```

Use `<h1>` only once per page for the main title. Use others to create a logical outline.

## Step 4: Add a Paragraph

Add a paragraph introducing yourself:

```html
<body>
    <h1>Jane Doe</h1>
    <p>Hi! I'm learning web development. I love creating things and solving problems with code.</p>
</body>
```

The `<p>` element creates a paragraph. Browsers add space above and below paragraphs automatically.

## Step 5: Add a List

Let's add a list of hobbies. HTML has two types of lists:

**Unordered lists** (bullet points):
```html
<ul>
    <li>Reading</li>
    <li>Coding</li>
    <li>Gaming</li>
</ul>
```

**Ordered lists** (numbered):
```html
<ol>
    <li>Wake up</li>
    <li>Code</li>
    <li>Sleep</li>
</ol>
```

Add an unordered list to your page:

```html
<body>
    <h1>Jane Doe</h1>
    <p>Hi! I'm learning web development. I love creating things and solving problems with code.</p>

    <h2>My Hobbies</h2>
    <ul>
        <li>Web Development</li>
        <li>Reading</li>
        <li>Hiking</li>
    </ul>
</body>
```

## Step 6: Add a Link

Links use the `<a>` (anchor) element:

```html
<a href="https://example.com">Click here</a>
```

- `href` is the URL to link to
- The text between tags is what users see and click

Add a link to your favorite website:

```html
<body>
    <h1>Jane Doe</h1>
    <p>Hi! I'm learning web development. I love creating things and solving problems with code.</p>

    <h2>My Hobbies</h2>
    <ul>
        <li>Web Development</li>
        <li>Reading</li>
        <li>Hiking</li>
    </ul>

    <h2>Favorite Website</h2>
    <p>Check out <a href="https://developer.mozilla.org">MDN Web Docs</a> - it's the best resource for learning web development!</p>
</body>
```

### Link Targets

By default, links open in the same tab. To open in a new tab:

```html
<a href="https://example.com" target="_blank">Opens in new tab</a>
```

When opening external links in new tabs, add `rel="noopener noreferrer"` for security:

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Safe external link</a>
```

## The Complete Page

Here's your finished HTML page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Me</title>
</head>
<body>
    <h1>Jane Doe</h1>
    <p>Hi! I'm learning web development. I love creating things and solving problems with code.</p>

    <h2>My Hobbies</h2>
    <ul>
        <li>Web Development</li>
        <li>Reading</li>
        <li>Hiking</li>
    </ul>

    <h2>Favorite Website</h2>
    <p>Check out <a href="https://developer.mozilla.org">MDN Web Docs</a> - it's the best resource for learning web development!</p>
</body>
</html>
```

## Viewing Your Page

To see your page in a browser:

1. **Double-click the file** - Opens in your default browser
2. **Drag and drop** - Drag the file into a browser window
3. **Right-click** - Choose "Open with" and select a browser

You'll see your content rendered as a webpage!

## Adding More Content

Here are more elements you can add:

### Horizontal Rule

A visual separator:

```html
<hr>
```

### Line Break

Force a new line without starting a new paragraph:

```html
<p>Line one<br>Line two</p>
```

### Emphasis

Make text bold or italic:

```html
<p>This is <strong>important</strong> and this is <em>emphasized</em>.</p>
```

- `<strong>` - Strong importance (displayed bold)
- `<em>` - Emphasis (displayed italic)

### Images

Add images with the `<img>` element:

```html
<img src="photo.jpg" alt="A description of the image">
```

- `src` - Path to the image file
- `alt` - Description for accessibility (required!)

## Common Mistakes to Avoid

1. **Forgetting closing tags**
   ```html
   <!-- Wrong -->
   <p>Unclosed paragraph

   <!-- Right -->
   <p>Properly closed paragraph</p>
   ```

2. **Incorrect nesting**
   ```html
   <!-- Wrong -->
   <p><strong>Bold text</p></strong>

   <!-- Right -->
   <p><strong>Bold text</strong></p>
   ```

3. **Missing alt text on images**
   ```html
   <!-- Wrong -->
   <img src="photo.jpg">

   <!-- Right -->
   <img src="photo.jpg" alt="Photo of a sunset">
   ```

4. **Using `<br>` for spacing**
   ```html
   <!-- Wrong - using <br> for layout -->
   <p>Text</p>
   <br><br><br>
   <p>More text</p>

   <!-- Right - use CSS for spacing (you'll learn this later) -->
   <p>Text</p>
   <p>More text</p>
   ```

## Practice Exercises

Try these additions to your page:

1. Add a second paragraph about your goals
2. Create an ordered list of your top 3 favorite movies
3. Add a link to your email using `mailto:your@email.com`
4. Add another heading and section about your skills

## Key Takeaways

1. `index.html` is the standard homepage filename
2. `<h1>` through `<h6>` create headings of different levels
3. `<p>` creates paragraphs
4. `<ul>` and `<ol>` create unordered and ordered lists
5. `<a href="url">` creates links
6. Always close tags in the correct order
7. Use meaningful content and proper structure

Congratulations! You've created your first HTML page. In the next module, we'll explore more HTML elements for building richer content.
