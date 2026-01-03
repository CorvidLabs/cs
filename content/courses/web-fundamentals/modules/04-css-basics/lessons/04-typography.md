---
title: Typography
order: 4
estimatedMinutes: 20
---

# Typography

Typography is the art of arranging text. Good typography makes content readable, establishes hierarchy, and contributes to the overall design. CSS provides extensive control over how text appears.

## Font Families

### System Fonts

Use fonts already installed on users' devices:

```css
body {
    font-family: Arial, Helvetica, sans-serif;
}
```

The browser uses the first available font in the list.

### Font Stacks

Provide fallback options:

```css
/* Sans-serif stack */
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                 Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
}

/* Serif stack */
.article {
    font-family: Georgia, "Times New Roman", Times, serif;
}

/* Monospace stack */
code {
    font-family: "SF Mono", SFMono-Regular, Consolas, "Liberation Mono",
                 Menlo, monospace;
}
```

### Modern System Font Stacks

```css
/* System UI - uses the OS default font */
body {
    font-family: system-ui, sans-serif;
}

/* Transitional serif fonts */
.serif {
    font-family: Charter, "Bitstream Charter", "Sitka Text", Cambria, serif;
}

/* Old-style serif fonts */
.oldstyle {
    font-family: "Iowan Old Style", "Palatino Linotype", Palatino,
                 "Book Antiqua", serif;
}
```

### Web Fonts

Load fonts from services or self-host:

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

body {
    font-family: 'Inter', sans-serif;
}
```

Or use `@font-face`:

```css
@font-face {
    font-family: 'CustomFont';
    src: url('/fonts/custom.woff2') format('woff2'),
         url('/fonts/custom.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```

## Font Size

### Absolute Units

```css
h1 {
    font-size: 32px;  /* Pixels - fixed size */
    font-size: 24pt;  /* Points - mainly for print */
}
```

### Relative Units

```css
body {
    font-size: 16px;  /* Base size */
}

h1 {
    font-size: 2rem;    /* 32px - relative to root */
    font-size: 2em;     /* 32px - relative to parent */
}

.small {
    font-size: 0.875rem;  /* 14px */
}

.large {
    font-size: 1.25rem;   /* 20px */
}
```

### Responsive Font Sizing

```css
/* Clamp for fluid typography */
h1 {
    font-size: clamp(1.5rem, 5vw, 3rem);
    /* minimum, preferred, maximum */
}

/* Viewport units */
.hero-title {
    font-size: 8vw;
}
```

### Type Scale

Create consistent sizing with a scale:

```css
:root {
    --text-xs: 0.75rem;    /* 12px */
    --text-sm: 0.875rem;   /* 14px */
    --text-base: 1rem;     /* 16px */
    --text-lg: 1.125rem;   /* 18px */
    --text-xl: 1.25rem;    /* 20px */
    --text-2xl: 1.5rem;    /* 24px */
    --text-3xl: 1.875rem;  /* 30px */
    --text-4xl: 2.25rem;   /* 36px */
}

h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
p { font-size: var(--text-base); }
```

## Font Weight

```css
.thin { font-weight: 100; }
.light { font-weight: 300; }
.normal { font-weight: 400; }
.medium { font-weight: 500; }
.semibold { font-weight: 600; }
.bold { font-weight: 700; }
.black { font-weight: 900; }

/* Keywords */
strong { font-weight: bold; }      /* Typically 700 */
.subtle { font-weight: lighter; }  /* Relative to parent */
```

## Font Style

```css
.normal { font-style: normal; }
.italic { font-style: italic; }
em { font-style: italic; }
```

## Line Height

Line height controls vertical spacing between lines:

```css
p {
    line-height: 1.6;      /* Unitless - recommended */
    line-height: 24px;     /* Fixed pixels */
    line-height: 150%;     /* Percentage */
}

h1 {
    line-height: 1.2;      /* Tighter for headings */
}

.compact {
    line-height: 1.4;
}

.relaxed {
    line-height: 1.8;
}
```

Unitless values are preferred because they scale with font size.

## Letter Spacing

Adjust space between characters:

```css
.uppercase {
    text-transform: uppercase;
    letter-spacing: 0.1em;   /* Open up uppercase text */
}

.tight {
    letter-spacing: -0.02em;  /* Tighter tracking */
}

h1 {
    letter-spacing: -0.025em;  /* Slightly tighter for display */
}
```

## Word Spacing

```css
.spaced-words {
    word-spacing: 0.25em;
}
```

## Text Alignment

```css
.left { text-align: left; }
.center { text-align: center; }
.right { text-align: right; }
.justify { text-align: justify; }
```

## Text Decoration

```css
a {
    text-decoration: underline;
    text-decoration-color: currentColor;
    text-decoration-style: solid;
    text-decoration-thickness: 2px;
}

a:hover {
    text-decoration: none;
}

.strike {
    text-decoration: line-through;
}

.overline {
    text-decoration: overline;
}

/* Shorthand */
.fancy {
    text-decoration: underline wavy red 2px;
}
```

### Text Underline Offset

```css
a {
    text-decoration: underline;
    text-underline-offset: 0.25em;
}
```

## Text Transform

```css
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }
.normal-case { text-transform: none; }
```

## Text Indent

```css
p {
    text-indent: 2em;  /* First line indent */
}
```

## White Space and Wrapping

```css
/* White space handling */
.preserve {
    white-space: pre;        /* Preserve all whitespace */
}

.nowrap {
    white-space: nowrap;     /* Prevent wrapping */
}

.prewrap {
    white-space: pre-wrap;   /* Preserve whitespace, allow wrapping */
}

/* Word breaking */
.break-word {
    overflow-wrap: break-word;  /* Break long words */
    word-break: break-word;     /* Break anywhere if needed */
}

/* Hyphenation */
.hyphenate {
    hyphens: auto;
}
```

## Text Overflow

Handle text that doesn't fit:

```css
.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;        /* Show 3 lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
}
```

## Columns

Create multi-column text:

```css
.columns {
    columns: 2;                /* 2 columns */
    columns: 200px;            /* As many 200px columns as fit */
    columns: 3 200px;          /* Up to 3, at least 200px wide */
    column-gap: 2rem;
    column-rule: 1px solid #ddd;
}
```

## Vertical Alignment

Align inline and table-cell elements:

```css
img {
    vertical-align: middle;
}

.superscript {
    vertical-align: super;
    font-size: 0.75em;
}

.subscript {
    vertical-align: sub;
    font-size: 0.75em;
}
```

## Complete Typography System

```css
:root {
    /* Font families */
    --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
                 Roboto, sans-serif;
    --font-serif: Georgia, Cambria, "Times New Roman", Times, serif;
    --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;

    /* Font sizes */
    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.5rem;
    --text-3xl: 1.875rem;
    --text-4xl: 2.25rem;
    --text-5xl: 3rem;

    /* Font weights */
    --font-normal: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;

    /* Line heights */
    --leading-tight: 1.25;
    --leading-normal: 1.5;
    --leading-relaxed: 1.625;
    --leading-loose: 2;

    /* Letter spacing */
    --tracking-tight: -0.025em;
    --tracking-normal: 0;
    --tracking-wide: 0.025em;
}

/* Base styles */
body {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    font-weight: var(--font-normal);
    line-height: var(--leading-relaxed);
    color: #1f2937;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-bold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    margin-bottom: 0.5em;
}

h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
h4 { font-size: var(--text-xl); }
h5 { font-size: var(--text-lg); }
h6 { font-size: var(--text-base); }

/* Paragraphs */
p {
    margin-bottom: 1em;
}

.lead {
    font-size: var(--text-xl);
    line-height: var(--leading-relaxed);
    color: #4b5563;
}

/* Links */
a {
    color: #2563eb;
    text-decoration: underline;
    text-underline-offset: 0.2em;
}

a:hover {
    color: #1d4ed8;
}

/* Code */
code {
    font-family: var(--font-mono);
    font-size: 0.875em;
    background-color: #f3f4f6;
    padding: 0.125em 0.25em;
    border-radius: 0.25rem;
}

pre {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
    background-color: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
}

pre code {
    background: none;
    padding: 0;
}

/* Blockquote */
blockquote {
    font-size: var(--text-lg);
    font-style: italic;
    color: #4b5563;
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    margin: 1.5rem 0;
}

/* Small text */
small, .text-sm {
    font-size: var(--text-sm);
}

.text-xs {
    font-size: var(--text-xs);
}

/* Utilities */
.font-serif { font-family: var(--font-serif); }
.font-mono { font-family: var(--font-mono); }
.font-medium { font-weight: var(--font-medium); }
.font-semibold { font-weight: var(--font-semibold); }
.font-bold { font-weight: var(--font-bold); }
.italic { font-style: italic; }
.uppercase { text-transform: uppercase; letter-spacing: var(--tracking-wide); }
.text-center { text-align: center; }
.text-right { text-align: right; }
```

## Key Takeaways

1. **Use font stacks** - Provide fallback fonts
2. **Prefer rem for font-size** - Scales with user preferences
3. **Use unitless line-height** - Scales properly with font-size
4. **Create a type scale** - Consistent sizing hierarchy
5. **Adjust letter-spacing for uppercase** - Open it up slightly
6. **Use clamp() for fluid typography** - Responsive without media queries
7. **Consider readability** - Line length, contrast, and spacing matter

You have completed the CSS Basics module. Next, we will explore the box model and layout.
