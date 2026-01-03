---
title: Text Elements
order: 2
estimatedMinutes: 18
---

# Text Elements

Text is the foundation of web content. HTML provides a rich set of elements for structuring and emphasizing text, each with specific semantic meaning.

## Headings

Headings create a hierarchical structure for your content. There are six levels, from `<h1>` (most important) to `<h6>` (least important):

```html
<h1>Main Page Title</h1>
<h2>Major Section</h2>
<h3>Subsection</h3>
<h4>Sub-subsection</h4>
<h5>Minor heading</h5>
<h6>Smallest heading</h6>
```

### Heading Best Practices

1. **One `<h1>` per page** - This should be your main title
2. **Never skip levels** - Go from h2 to h3, not h2 to h4
3. **Use for structure, not styling** - Dont choose h3 just because it looks the right size

```html
<!-- Wrong: using headings for visual size -->
<h4>This text should be small</h4>

<!-- Right: use CSS for visual styling -->
<p class="small-text">This text should be small</p>
```

## Paragraphs

The `<p>` element defines a paragraph of text:

```html
<p>This is the first paragraph. It contains a complete thought
   or idea that stands on its own.</p>

<p>This is the second paragraph. Browsers automatically add
   space between paragraphs.</p>
```

Paragraphs create **block-level** elements, meaning they start on a new line and take up the full width available.

## Line Breaks

Use `<br>` for line breaks within content where the break is part of the content itself:

```html
<!-- Good use: poetry or addresses -->
<address>
    123 Main Street<br>
    Anytown, ST 12345<br>
    United States
</address>

<!-- Bad use: creating space between paragraphs -->
<p>First paragraph</p>
<br><br>
<p>Second paragraph</p>
```

The `<br>` element is self-closing and should not be used for layout spacing.

## Text Emphasis

### Strong Importance: `<strong>`

Use `<strong>` for text with strong importance:

```html
<p><strong>Warning:</strong> Do not delete this file.</p>
<p>The deadline is <strong>Friday at 5pm</strong>.</p>
```

Screen readers may emphasize `<strong>` text with a different tone.

### Emphasis: `<em>`

Use `<em>` for stressed emphasis that changes the meaning of a sentence:

```html
<p>I <em>love</em> chocolate.</p>  <!-- Emphasis on love -->
<p>I love <em>chocolate</em>.</p>  <!-- Emphasis on chocolate specifically -->
```

### When to Use `<strong>` vs `<em>`

| Use Case | Element | Example |
|----------|---------|---------|
| Important warning or notice | `<strong>` | `<strong>Caution:</strong> Hot surface` |
| Stress that changes meaning | `<em>` | `Are you <em>sure</em>?` |
| Keywords in a document | `<strong>` | `The <strong>DOM</strong> is...` |
| Technical terms first use | `<em>` | `This is called <em>recursion</em>` |

### Bold and Italic: `<b>` and `<i>`

These elements are stylistic, not semantic:

```html
<!-- Use <b> for keywords, product names without added importance -->
<p>Search results for <b>HTML tutorial</b>:</p>

<!-- Use <i> for alternate voice: technical terms, foreign words, thoughts -->
<p>The French word <i lang="fr">bonjour</i> means hello.</p>
<p>She thought, <i>This cant be happening</i>.</p>
```

## Quotations

### Block Quotes

Use `<blockquote>` for extended quotations:

```html
<blockquote cite="https://example.com/source">
    <p>The only way to do great work is to love what you do.</p>
    <footer>- Steve Jobs</footer>
</blockquote>
```

### Inline Quotes

Use `<q>` for short, inline quotations:

```html
<p>As the author noted, <q>simplicity is the ultimate sophistication</q>.</p>
```

Browsers automatically add quotation marks around `<q>` content.

### Citations

Use `<cite>` for the title of a work:

```html
<p>My favorite book is <cite>The Pragmatic Programmer</cite>.</p>

<blockquote>
    <p>Any fool can write code that a computer can understand.</p>
    <footer>- Martin Fowler, <cite>Refactoring</cite></footer>
</blockquote>
```

## Code and Technical Text

### Inline Code

Use `<code>` for inline code snippets:

```html
<p>Use the <code>console.log()</code> function for debugging.</p>
<p>Set the <code>display</code> property to <code>flex</code>.</p>
```

### Preformatted Text

Use `<pre>` for text where whitespace matters:

```html
<pre><code>function greet(name) {
    return "Hello, " + name;
}</code></pre>
```

The `<pre>` element preserves spaces, tabs, and line breaks exactly as written.

### Keyboard Input

Use `<kbd>` for keyboard input:

```html
<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.</p>
<p>Type <kbd>exit</kbd> to close the terminal.</p>
```

### Sample Output

Use `<samp>` for sample computer output:

```html
<p>The console displayed: <samp>Error: File not found</samp></p>
```

### Variables

Use `<var>` for mathematical or programming variables:

```html
<p>The area formula is <var>A</var> = <var>l</var> &times; <var>w</var></p>
```

## Annotations and Edits

### Abbreviations

Use `<abbr>` with a title attribute for abbreviations:

```html
<p>The <abbr title="World Wide Web">WWW</abbr> was invented in 1989.</p>
<p>Learn <abbr title="HyperText Markup Language">HTML</abbr> and
   <abbr title="Cascading Style Sheets">CSS</abbr>.</p>
```

Browsers typically show a dotted underline, and the full text appears on hover.

### Definitions

Use `<dfn>` when defining a term:

```html
<p><dfn>HTML</dfn> is the standard markup language for creating web pages.</p>
```

### Inserted and Deleted Text

Show edits with `<ins>` and `<del>`:

```html
<p>The meeting is on <del>Tuesday</del> <ins>Wednesday</ins>.</p>

<p>Price: <del>$99</del> <ins>$79</ins></p>
```

### Marked/Highlighted Text

Use `<mark>` to highlight text:

```html
<p>Search results for "HTML":</p>
<p>Learn <mark>HTML</mark> basics in this comprehensive guide to <mark>HTML</mark>.</p>
```

## Subscript and Superscript

```html
<!-- Chemical formulas -->
<p>Water is H<sub>2</sub>O</p>
<p>Carbon dioxide is CO<sub>2</sub></p>

<!-- Mathematical expressions -->
<p>The equation is x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup></p>

<!-- Footnotes -->
<p>This is a claim that needs a source<sup><a href="#fn1">1</a></sup>.</p>
```

## Small Print

Use `<small>` for side comments and legal text:

```html
<p>Buy now for only $99!</p>
<p><small>Terms and conditions apply. Offer valid until December 31.</small></p>

<footer>
    <small>&copy; 2024 Company Name. All rights reserved.</small>
</footer>
```

## Time and Dates

Use `<time>` for machine-readable dates and times:

```html
<p>Published on <time datetime="2024-03-15">March 15, 2024</time></p>
<p>The event starts at <time datetime="14:30">2:30 PM</time></p>
<p>Next meeting: <time datetime="2024-03-20T09:00">March 20 at 9 AM</time></p>
```

The `datetime` attribute provides a machine-readable format while the displayed text can be human-friendly.

## Address

Use `<address>` for contact information:

```html
<address>
    Written by <a href="mailto:author@example.com">Jane Smith</a><br>
    123 Main Street<br>
    Anytown, ST 12345
</address>
```

## Complete Example

Here is a complete example using various text elements:

```html
<article>
    <header>
        <h1>Introduction to Web Development</h1>
        <p>Published on <time datetime="2024-03-15">March 15, 2024</time></p>
    </header>

    <section>
        <h2>What is <abbr title="HyperText Markup Language">HTML</abbr>?</h2>
        <p><dfn>HTML</dfn> is the standard markup language for creating
           web pages. It provides the <strong>structure</strong> of a page,
           while <abbr title="Cascading Style Sheets">CSS</abbr> handles
           the <em>presentation</em>.</p>

        <blockquote cite="https://www.w3.org/html/">
            <p>HTML is the language for describing the structure of Web pages.</p>
        </blockquote>
    </section>

    <section>
        <h2>Your First Code</h2>
        <p>Start with the <code>&lt;html&gt;</code> element. Here is a
           complete example:</p>

        <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;title&gt;My Page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Hello World&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

        <p>Save this file and open it in your browser. Press
           <kbd>Ctrl</kbd> + <kbd>O</kbd> to open a file.</p>
    </section>

    <footer>
        <small>Last updated: <time datetime="2024-03-16">March 16, 2024</time></small>
    </footer>
</article>
```

## Key Takeaways

1. **Use headings hierarchically** - One h1, then h2, h3, etc.
2. **`<strong>` indicates importance**, `<em>` indicates emphasis
3. **`<b>` and `<i>` are stylistic**, not semantic
4. **Use `<code>` for code**, `<pre>` for preformatted blocks
5. **`<abbr>` with title** helps users understand abbreviations
6. **`<time>` with datetime** makes dates machine-readable
7. **Choose elements by meaning**, not appearance

In the next lesson, we will explore links and navigation in HTML.
