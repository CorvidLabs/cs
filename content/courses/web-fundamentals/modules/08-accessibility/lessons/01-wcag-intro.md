---
title: Introduction to WCAG
order: 1
estimatedMinutes: 20
---

# Introduction to WCAG

Web Content Accessibility Guidelines (WCAG) are the international standard for web accessibility. Following these guidelines ensures your websites work for people with disabilities and improves usability for everyone.

## Why Accessibility Matters

### Who Benefits

Accessibility helps people with:

- **Visual impairments** - Blindness, low vision, color blindness
- **Hearing impairments** - Deafness, hard of hearing
- **Motor impairments** - Limited fine motor control, paralysis
- **Cognitive impairments** - Learning disabilities, attention disorders

But accessibility also helps:
- Users on mobile devices
- People in bright sunlight or noisy environments
- Older users
- Users with slow internet connections
- Search engines (SEO)

### Legal Requirements

Many countries require accessible websites:
- ADA (Americans with Disabilities Act) - USA
- Equality Act 2010 - UK
- EN 301 549 - European Union
- AODA - Canada (Ontario)

## WCAG Principles: POUR

WCAG is organized around four principles:

### 1. Perceivable

Information must be presentable in ways users can perceive:

```html
<!-- Provide text alternatives for images -->
<img src="chart.png" alt="Sales increased 25% from Q1 to Q4">

<!-- Provide captions for video -->
<video>
    <source src="video.mp4" type="video/mp4">
    <track kind="captions" src="captions.vtt" srclang="en">
</video>

<!-- Ensure sufficient color contrast -->
<style>
/* Minimum 4.5:1 for normal text, 3:1 for large text */
.text { color: #333; background: #fff; }
</style>
```

### 2. Operable

Users must be able to operate the interface:

```html
<!-- Make all functionality keyboard accessible -->
<button onclick="submitForm()">Submit</button>

<!-- Provide enough time to read content -->
<div role="alert" aria-live="polite">
    Form submitted successfully
</div>

<!-- Don't cause seizures (no flashing content) -->
```

### 3. Understandable

Information and operation must be understandable:

```html
<!-- Specify the page language -->
<html lang="en">

<!-- Labels clearly describe form inputs -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Error messages are helpful -->
<p class="error">Please enter a valid email address (example: user@domain.com)</p>
```

### 4. Robust

Content must work with current and future technologies:

```html
<!-- Use valid, semantic HTML -->
<nav aria-label="Main">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
    </ul>
</nav>

<!-- Include ARIA when needed for complex widgets -->
<div role="tablist">
    <button role="tab" aria-selected="true">Tab 1</button>
    <button role="tab" aria-selected="false">Tab 2</button>
</div>
```

## Conformance Levels

WCAG has three levels of conformance:

| Level | Description | Target |
|-------|-------------|--------|
| A | Minimum accessibility | Essential barriers removed |
| AA | Mid-range accessibility | Most barriers removed |
| AAA | Highest accessibility | Maximum accessibility |

**Level AA is the standard target** for most websites and legal requirements.

## Key Success Criteria

### Level A (Essential)

1. **Non-text Content** - Images have alt text
2. **Info and Relationships** - Structure is programmatically determinable
3. **Keyboard** - All functionality is keyboard accessible
4. **No Keyboard Trap** - Users can navigate away from all elements
5. **Page Titled** - Pages have descriptive titles
6. **Focus Order** - Focus follows logical sequence
7. **Link Purpose** - Link text describes destination

### Level AA (Standard)

1. **Color Contrast** - 4.5:1 for normal text, 3:1 for large text
2. **Resize Text** - Text can scale to 200% without loss of function
3. **Images of Text** - Real text used instead of images of text
4. **Multiple Ways** - More than one way to find pages
5. **Headings and Labels** - Descriptive headings and labels
6. **Focus Visible** - Keyboard focus is visible
7. **Language** - Page language is programmatically determinable

## Testing for Accessibility

### Automated Testing

Use tools like:

- **axe DevTools** - Browser extension
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Built into Chrome DevTools
- **pa11y** - Command line tool

```javascript
// Example with axe-core
axe.run(document, function(err, results) {
    console.log(results.violations);
});
```

### Manual Testing

Automated tools catch about 30% of issues. Also test:

1. **Keyboard navigation** - Tab through the page
2. **Screen reader** - Use VoiceOver, NVDA, or JAWS
3. **Zoom** - Scale to 200%
4. **Color contrast** - Use contrast checkers
5. **No mouse** - Complete tasks with keyboard only

### Testing Checklist

```
[ ] Can I navigate with Tab/Shift+Tab?
[ ] Is focus always visible?
[ ] Do all images have alt text?
[ ] Are form inputs labeled?
[ ] Is color contrast sufficient?
[ ] Do headings follow hierarchy (h1, h2, h3)?
[ ] Are error messages clear?
[ ] Does it work at 200% zoom?
[ ] Is the page language set?
[ ] Do links describe their destination?
```

## Quick Wins

### Semantic HTML

```html
<!-- Use semantic elements -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<article>...</article>
<footer>...</footer>

<!-- Use proper heading hierarchy -->
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

### Alt Text

```html
<!-- Describe the image content -->
<img src="team.jpg" alt="Five team members smiling in the office">

<!-- Empty alt for decorative images -->
<img src="decorative-line.png" alt="">
```

### Form Labels

```html
<label for="name">Full Name</label>
<input type="text" id="name" name="name">
```

### Focus Styles

```css
/* Never remove focus outlines without replacement */
button:focus,
a:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
}
```

### Skip Links

```html
<a href="#main-content" class="skip-link">
    Skip to main content
</a>
```

## Common Mistakes

### Missing Alt Text

```html
<!-- Wrong -->
<img src="logo.png">

<!-- Right -->
<img src="logo.png" alt="Company Name">
```

### Click Here Links

```html
<!-- Wrong -->
<a href="/report.pdf">Click here</a> to download the report.

<!-- Right -->
<a href="/report.pdf">Download the annual report (PDF)</a>
```

### Removing Focus Outlines

```css
/* Wrong - removes keyboard accessibility */
*:focus {
    outline: none;
}

/* Right - custom but visible focus */
*:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
}
```

### Low Color Contrast

```css
/* Wrong - light gray on white */
.text {
    color: #aaa;
    background: #fff;
}

/* Right - sufficient contrast */
.text {
    color: #595959;
    background: #fff;
}
```

## Accessibility Statement

Consider adding an accessibility statement to your site:

```html
<h1>Accessibility Statement</h1>
<p>We are committed to ensuring our website is accessible to all users.</p>

<h2>Conformance Status</h2>
<p>This website conforms to WCAG 2.1 Level AA.</p>

<h2>Feedback</h2>
<p>If you encounter accessibility barriers, please contact us:</p>
<p>Email: <a href="mailto:accessibility@example.com">accessibility@example.com</a></p>
```

## Key Takeaways

1. **WCAG has four principles** - Perceivable, Operable, Understandable, Robust
2. **Target Level AA** - It's the legal standard and good practice
3. **Use semantic HTML** - It provides accessibility for free
4. **Test with keyboard** - If you can't use it without a mouse, it's not accessible
5. **Automated testing catches ~30%** - Manual testing is essential
6. **Accessibility benefits everyone** - Better UX for all users

In the next lesson, we will explore ARIA attributes.
