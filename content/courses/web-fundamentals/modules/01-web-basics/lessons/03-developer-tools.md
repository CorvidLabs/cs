---
title: Browser Developer Tools
order: 3
estimatedMinutes: 15
---

# Browser Developer Tools

Every modern browser includes powerful developer tools (DevTools) for inspecting and debugging web pages. Learning to use these tools is essential for web development.

## Opening Developer Tools

Use these keyboard shortcuts to open DevTools:

| Browser | Windows/Linux | Mac |
|---------|---------------|-----|
| Chrome | `F12` or `Ctrl+Shift+I` | `Cmd+Option+I` |
| Firefox | `F12` or `Ctrl+Shift+I` | `Cmd+Option+I` |
| Safari | - | `Cmd+Option+I` (enable in Preferences first) |
| Edge | `F12` or `Ctrl+Shift+I` | `Cmd+Option+I` |

You can also right-click any element and select "Inspect" or "Inspect Element".

## The Elements Panel

The Elements panel shows your page's HTML structure as a tree:

```
┌─────────────────────────────────────────────────────────────┐
│ Elements │ Console │ Sources │ Network │ ... │             │
├─────────────────────────────────────┬───────────────────────┤
│                                     │                       │
│ ▼ <html lang="en">                  │ Styles    Computed    │
│   ▼ <head>...</head>                │                       │
│   ▼ <body>                          │ element {             │
│     ▼ <header>                      │   display: block;     │
│         <h1>Welcome</h1>            │   margin: 0;          │
│       </header>                     │ }                     │
│     ▼ <main>                        │                       │
│         <p>Content here</p>         │ .header {             │
│       </main>                       │   background: blue;   │
│     </body>                         │ }                     │
│   </html>                           │                       │
│                                     │                       │
└─────────────────────────────────────┴───────────────────────┘
         HTML Tree                         Styles Panel
```

### Inspecting Elements

1. Click the "Select Element" tool (arrow icon) or press `Ctrl+Shift+C` (Windows) / `Cmd+Shift+C` (Mac)
2. Hover over elements on the page - they'll be highlighted
3. Click to select an element and see its HTML and styles

### The HTML Tree

- Click the triangle (▶) to expand/collapse elements
- Double-click text to edit it live
- Right-click for options like "Edit as HTML" or "Delete element"

Changes you make are temporary - refresh the page to reset.

### The Styles Panel

On the right side, you'll see CSS styles applied to the selected element:

- **Styles tab**: All CSS rules affecting the element
- **Computed tab**: Final calculated values after all rules apply

You can:
- Check/uncheck boxes to toggle styles
- Click values to edit them live
- Add new properties

## The Console Panel

The Console is where you can:
- See JavaScript errors and warnings
- View messages from `console.log()`
- Run JavaScript commands directly

```
┌─────────────────────────────────────────────────────────────┐
│ Elements │ Console │ Sources │ Network │                   │
├─────────────────────────────────────────────────────────────┤
│ > document.title                                            │
│ < "My Web Page"                                             │
│                                                             │
│ > document.querySelector('h1').textContent                  │
│ < "Welcome"                                                 │
│                                                             │
│ ⚠ Warning: Some warning message                            │
│ ✕ Error: Something went wrong                              │
│                                                             │
│ >_                                                          │
└─────────────────────────────────────────────────────────────┘
```

### Useful Console Commands

```javascript
// Get page title
document.title

// Find an element
document.querySelector('h1')

// Get all paragraphs
document.querySelectorAll('p')

// See element details
console.dir(document.body)
```

## The Network Panel

See all files loaded by the page:

```
┌─────────────────────────────────────────────────────────────┐
│ Elements │ Console │ Sources │ Network │                   │
├─────────────────────────────────────────────────────────────┤
│ Name              Status  Type       Size     Time          │
├─────────────────────────────────────────────────────────────┤
│ index.html        200     document   4.2 KB   45 ms         │
│ styles.css        200     stylesheet 2.1 KB   32 ms         │
│ script.js         200     script     8.5 KB   28 ms         │
│ logo.png          200     image      15 KB    156 ms        │
│ api/users         200     fetch      1.2 KB   234 ms        │
└─────────────────────────────────────────────────────────────┘
```

This helps you:
- See which files are loading
- Identify slow resources
- Debug failed requests (4xx/5xx status codes)
- Inspect request and response details

## Device Mode (Responsive Testing)

Test how your site looks on different devices:

1. Click the device icon or press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
2. Select a device preset or enter custom dimensions
3. The page will resize to simulate that device

```
┌──────────────────────────────────────────┐
│ iPhone 14 Pro ▼  │ 393 x 852  │ 100% ▼   │
├──────────────────────────────────────────┤
│  ┌──────────────────────────────────┐    │
│  │                                  │    │
│  │     Mobile view of your         │    │
│  │     website appears here        │    │
│  │                                  │    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

## Practical DevTools Workflow

### Finding an Element's HTML

1. Right-click the element on the page
2. Select "Inspect"
3. The element is highlighted in the Elements panel
4. View its tag, attributes, and content

### Seeing Why Something Looks Wrong

1. Inspect the problematic element
2. Check the Styles panel for unexpected CSS
3. Look for crossed-out styles (overridden rules)
4. Use Computed tab to see final values

### Experimenting with Changes

1. Inspect an element
2. Edit HTML by double-clicking
3. Add/modify CSS in the Styles panel
4. See changes instantly (no page reload needed)
5. Copy your working code to your actual files

## Common DevTools Tasks

| Task | How to Do It |
|------|--------------|
| Inspect element | Right-click element, select "Inspect" |
| Find element by selector | `Ctrl+F` in Elements panel, type selector |
| Edit text | Double-click text in Elements panel |
| Test CSS changes | Edit values in Styles panel |
| Check mobile view | Click device icon or `Ctrl+Shift+M` |
| See console errors | Open Console panel, look for red text |
| Clear console | Click clear icon or type `clear()` |

## Tips for Beginners

1. **Don't worry about breaking things** - Refresh the page to undo all changes
2. **Right-click is your friend** - Context menus have useful options
3. **Use keyboard shortcuts** - They'll speed up your workflow
4. **Keep the Console open** - It shows errors you need to fix
5. **Dock DevTools to the side** - More room to see both code and preview

## Browser-Specific Features

While DevTools are similar across browsers, each has unique features:

- **Chrome**: Lighthouse for performance audits
- **Firefox**: CSS Grid inspector, Accessibility panel
- **Safari**: Energy impact tracking
- **Edge**: 3D view of page layers

Start with one browser, then explore others as you grow.

## Key Takeaways

1. DevTools are built into every modern browser - learn to use them!
2. The Elements panel shows HTML structure and CSS styles
3. The Console shows errors and lets you run JavaScript
4. The Network panel reveals what files are loading
5. Device mode helps test responsive designs
6. Changes in DevTools are temporary - perfect for experimenting

Now that you can inspect web pages, you're ready to create your own! Next lesson: building your first HTML page.
