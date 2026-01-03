---
title: Color and Contrast
order: 4
estimatedMinutes: 18
---

# Color and Contrast

Color contrast is crucial for readability and accessibility. Poor contrast makes content difficult or impossible to read for users with low vision, color blindness, or those viewing in challenging conditions.

## WCAG Contrast Requirements

### Contrast Ratios

WCAG defines minimum contrast ratios:

| Level | Normal Text | Large Text | UI Components |
|-------|-------------|------------|---------------|
| AA | 4.5:1 | 3:1 | 3:1 |
| AAA | 7:1 | 4.5:1 | Not defined |

Large text is defined as:
- 18pt (24px) regular weight, or
- 14pt (18.5px) bold weight

### Calculating Contrast

Contrast ratio compares the luminance of two colors:

```
Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)
```

Where L1 is the lighter color and L2 is the darker color.

Use tools to calculate:
- WebAIM Contrast Checker
- Chrome DevTools
- Figma plugins
- Browser extensions

## Text Contrast

### Sufficient Contrast

```css
/* Good: 7.5:1 ratio */
body {
    color: #333333;
    background-color: #ffffff;
}

/* Good: 4.6:1 ratio (AA pass) */
.muted {
    color: #757575;
    background-color: #ffffff;
}

/* Bad: 2.5:1 ratio (fails) */
.low-contrast {
    color: #999999;
    background-color: #ffffff;
}
```

### Common Contrast Pairs

| Text | Background | Ratio | AA | AAA |
|------|------------|-------|-----|-----|
| #000000 | #ffffff | 21:1 | Pass | Pass |
| #333333 | #ffffff | 12.6:1 | Pass | Pass |
| #595959 | #ffffff | 7:1 | Pass | Pass |
| #757575 | #ffffff | 4.6:1 | Pass | Fail |
| #999999 | #ffffff | 2.9:1 | Fail | Fail |

## UI Component Contrast

All interactive elements need 3:1 contrast against adjacent colors:

```css
/* Button needs 3:1 contrast against background */
.button {
    background-color: #0066cc;  /* Against white page: 6.1:1 */
    color: #ffffff;             /* Against button: 4.9:1 */
    border: none;
}

/* Focus indicators need 3:1 against background */
.button:focus {
    outline: 2px solid #0066cc;  /* Visible against white */
    outline-offset: 2px;
}

/* Form inputs need visible boundaries */
.input {
    border: 2px solid #757575;  /* 4.6:1 against white */
}
```

## Color Independence

Never convey information through color alone:

### Form Validation

```html
<!-- Bad: color only -->
<input class="error">  <!-- Red border only -->

<!-- Good: color + icon + text -->
<input class="error" aria-describedby="error-msg">
<span class="error-icon" aria-hidden="true"></span>
<span id="error-msg">Please enter a valid email</span>
```

```css
.error {
    border-color: #d32f2f;
    border-width: 2px;
}

.error-icon::before {
    content: "!";
    /* Visual indicator beyond color */
}
```

### Charts and Graphs

```html
<!-- Bad: colors differentiate data -->
<div class="chart">
    <div class="bar blue">Sales</div>
    <div class="bar green">Revenue</div>
</div>

<!-- Good: patterns + labels + color -->
<div class="chart">
    <div class="bar striped" style="--color: blue">
        <span class="label">Sales: $50,000</span>
    </div>
    <div class="bar dotted" style="--color: green">
        <span class="label">Revenue: $75,000</span>
    </div>
</div>
```

### Links in Text

```css
/* Bad: color only differentiates links */
a {
    color: blue;
    text-decoration: none;
}

/* Good: color + underline */
a {
    color: #0066cc;
    text-decoration: underline;
}

/* Or underline on hover */
a {
    color: #0066cc;
    text-decoration: none;
    border-bottom: 1px solid currentColor;
}
```

## Color Blindness

### Types of Color Blindness

| Type | Affected Colors | Prevalence |
|------|-----------------|------------|
| Deuteranopia | Red-Green | 6% of males |
| Protanopia | Red-Green | 2% of males |
| Tritanopia | Blue-Yellow | 0.001% |
| Achromatopsia | All colors | Very rare |

### Safe Color Combinations

```css
/* Avoid red/green only distinctions */
.success {
    color: #2e7d32;  /* Green */
}
.error {
    color: #d32f2f;  /* Red */
}

/* Add icons or labels */
.success::before { content: ""; }
.error::before { content: ""; }
```

### Testing for Color Blindness

- Use browser DevTools color blindness simulation
- Chrome: Rendering > Emulate vision deficiencies
- Use Colorblinding browser extension

## Dark Mode Considerations

### Contrast in Dark Mode

Light text on dark backgrounds can have different contrast needs:

```css
:root {
    --text: #1f2937;
    --bg: #ffffff;
}

@media (prefers-color-scheme: dark) {
    :root {
        --text: #f3f4f6;  /* Light gray, not pure white */
        --bg: #111827;   /* Dark gray, not pure black */
    }
}

/* Pure white on black can cause halation (glowing) */
/* Prefer off-white on dark gray */
```

### Maintaining Contrast

```css
:root {
    --color-primary: #3b82f6;
    --color-text: #1f2937;
    --color-bg: #ffffff;
    --color-text-muted: #6b7280;
}

[data-theme="dark"] {
    --color-primary: #60a5fa;  /* Lighter for dark mode */
    --color-text: #f9fafb;
    --color-bg: #1f2937;
    --color-text-muted: #9ca3af;
}
```

## Focus Indicators

Focus must be visible against all backgrounds:

```css
/* Works on light backgrounds */
*:focus-visible {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
}

/* Double-ring for any background */
*:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px #0066cc;
}
```

## Text on Images

Ensure readability with overlays:

```css
.hero {
    position: relative;
    background-image: url('hero.jpg');
}

/* Semi-transparent overlay */
.hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
}

.hero-text {
    position: relative;
    color: white;
}

/* Or text shadow */
.hero-text {
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}
```

## Testing Tools

### Browser DevTools

Chrome DevTools can:
- Show contrast ratios
- Simulate color blindness
- Highlight contrast issues

### Online Tools

- WebAIM Contrast Checker
- Colour Contrast Analyser
- Who Can Use

### Automated Testing

```javascript
// axe-core checks contrast
axe.run().then(results => {
    const contrastIssues = results.violations.filter(v =>
        v.id === 'color-contrast'
    );
    console.log(contrastIssues);
});
```

## Complete Example

```css
/* Color System with Contrast in Mind */
:root {
    /* Base colors with sufficient contrast */
    --color-text: #1f2937;           /* 12.6:1 on white */
    --color-text-secondary: #4b5563; /* 7.3:1 on white */
    --color-text-muted: #6b7280;     /* 5.0:1 on white */

    --color-bg: #ffffff;
    --color-bg-secondary: #f9fafb;

    /* Brand colors tested for contrast */
    --color-primary: #2563eb;        /* 4.6:1 on white, 4.8:1 with white text */
    --color-primary-hover: #1d4ed8;  /* 6.1:1 on white */

    /* Status colors with sufficient contrast */
    --color-success: #059669;        /* 4.5:1 on white */
    --color-warning: #d97706;        /* 4.5:1 on white */
    --color-error: #dc2626;          /* 5.0:1 on white */

    /* UI colors */
    --color-border: #d1d5db;         /* 2.3:1 on white (OK for non-text) */
    --color-border-strong: #9ca3af;  /* 3.5:1 on white (for required borders) */
}

/* Dark mode adjustments */
[data-theme="dark"] {
    --color-text: #f3f4f6;
    --color-text-secondary: #d1d5db;
    --color-text-muted: #9ca3af;

    --color-bg: #111827;
    --color-bg-secondary: #1f2937;

    --color-primary: #60a5fa;
    --color-primary-hover: #93c5fd;

    --color-border: #374151;
    --color-border-strong: #4b5563;
}

/* Components using the system */
body {
    color: var(--color-text);
    background: var(--color-bg);
}

p {
    color: var(--color-text-secondary);
}

.muted {
    color: var(--color-text-muted);
}

.button {
    background: var(--color-primary);
    color: white;
    border: none;
}

.button:hover {
    background: var(--color-primary-hover);
}

.button:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

/* Links have underline + color */
a {
    color: var(--color-primary);
    text-decoration: underline;
}

/* Form validation with multiple indicators */
.input-error {
    border: 2px solid var(--color-error);
}

.error-message {
    color: var(--color-error);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.error-message::before {
    content: "";
    font-size: 1.25rem;
}
```

## Key Takeaways

1. **4.5:1 minimum** for normal text, 3:1 for large text
2. **3:1 for UI components** and visual boundaries
3. **Never use color alone** to convey information
4. **Test for color blindness** using browser tools
5. **Focus indicators** must be visible on all backgrounds
6. **Dark mode needs different** color values for contrast
7. **Use contrast checking tools** during development
8. **Test with real users** when possible

Congratulations! You have completed the Accessibility module and the Web Fundamentals course.
