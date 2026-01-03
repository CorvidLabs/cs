---
title: Keyboard Navigation
order: 3
estimatedMinutes: 20
---

# Keyboard Navigation

Many users navigate websites using only a keyboard. This includes people with motor impairments, power users, and those using screen readers. Keyboard accessibility is fundamental to an inclusive web.

## Why Keyboard Access Matters

Users who rely on keyboards include:
- People with motor impairments who can't use a mouse
- Blind users navigating with screen readers
- Power users who prefer keyboard shortcuts
- Users with temporary injuries
- Users without pointing devices

## Essential Keyboard Interactions

### Navigation Keys

| Key | Action |
|-----|--------|
| Tab | Move to next focusable element |
| Shift + Tab | Move to previous focusable element |
| Enter | Activate links and buttons |
| Space | Activate buttons, toggle checkboxes |
| Arrow keys | Navigate within widgets |
| Escape | Close dialogs, cancel actions |

### Focusable Elements

These elements are focusable by default:
- Links (`<a href>`)
- Buttons (`<button>`)
- Form inputs (`<input>`, `<select>`, `<textarea>`)
- Elements with `tabindex="0"`

## Focus Management

### Visible Focus Indicator

Never remove focus outlines without providing an alternative:

```css
/* Bad: removes focus entirely */
*:focus {
    outline: none;
}

/* Good: custom focus style */
*:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
}

/* Better: use :focus-visible for keyboard only */
*:focus {
    outline: none;
}

*:focus-visible {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
}
```

### Focus Visible vs Focus

```css
/* :focus - all focus sources (click, tab, programmatic) */
button:focus {
    outline: 2px solid blue;
}

/* :focus-visible - keyboard focus only */
button:focus-visible {
    outline: 2px solid blue;
}

/* :focus:not(:focus-visible) - click focus only */
button:focus:not(:focus-visible) {
    outline: none;
}
```

## Tab Order

### Natural Tab Order

Elements are focused in DOM order. Use semantic HTML:

```html
<!-- Good: logical order -->
<header>
    <a href="/">Logo</a>
    <nav>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    </nav>
</header>
<main>
    <h1>Welcome</h1>
    <button>Get Started</button>
</main>
```

### Tabindex

Control tab order and focusability:

```html
<!-- tabindex="0": add to tab order -->
<div tabindex="0" role="button">Custom button</div>

<!-- tabindex="-1": focusable programmatically, not via tab -->
<div tabindex="-1" id="modal">Modal content</div>

<!-- tabindex > 0: avoid! Changes natural order -->
<button tabindex="2">Second</button>
<button tabindex="1">First</button>
```

### Tabindex Values

| Value | Behavior |
|-------|----------|
| Not specified | Default behavior (focusable if interactive) |
| `0` | Add to natural tab order |
| `-1` | Focusable via JavaScript only |
| `> 0` | Avoid - creates confusing order |

## Skip Links

Allow users to bypass repetitive navigation:

```html
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#footer" class="skip-link">Skip to footer</a>

    <header>
        <nav><!-- Long navigation --></nav>
    </header>

    <main id="main-content">
        <!-- Main content -->
    </main>

    <footer id="footer">
        <!-- Footer -->
    </footer>
</body>
```

```css
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px 16px;
    z-index: 100;
    transition: top 0.3s;
}

.skip-link:focus {
    top: 0;
}
```

## Focus Trapping

Keep focus within modals and dialogs:

```html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <h2 id="dialog-title">Confirm Action</h2>
    <p>Are you sure you want to proceed?</p>
    <button id="cancel-btn">Cancel</button>
    <button id="confirm-btn">Confirm</button>
</div>
```

```javascript
function trapFocus(dialog) {
    const focusableElements = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    dialog.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }

        if (e.key === 'Escape') {
            closeDialog();
        }
    });

    // Focus first element when opening
    firstElement.focus();
}
```

## Keyboard Patterns

### Button Behavior

```html
<button type="button" onclick="handleClick()">
    Click Me
</button>
```

Buttons respond to:
- Enter key
- Space key

### Link Behavior

```html
<a href="/page">Go to Page</a>
```

Links respond to:
- Enter key (Space doesn't work on links)

### Custom Button

If you must use a non-button element:

```html
<span
    role="button"
    tabindex="0"
    onclick="handleClick()"
    onkeydown="handleKeydown(event)"
>
    Custom Button
</span>
```

```javascript
function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
    }
}
```

### Tab Pattern

```html
<div role="tablist" aria-label="Tabs">
    <button role="tab" aria-selected="true" id="tab1">Tab 1</button>
    <button role="tab" aria-selected="false" id="tab2" tabindex="-1">Tab 2</button>
    <button role="tab" aria-selected="false" id="tab3" tabindex="-1">Tab 3</button>
</div>
```

Arrow keys move between tabs:

```javascript
tablist.addEventListener('keydown', (e) => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const currentIndex = tabs.indexOf(document.activeElement);

    let newIndex;
    if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
        newIndex = 0;
    } else if (e.key === 'End') {
        newIndex = tabs.length - 1;
    }

    if (newIndex !== undefined) {
        e.preventDefault();
        tabs[newIndex].focus();
        selectTab(tabs[newIndex]);
    }
});
```

### Menu Pattern

```html
<button
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="menu"
>
    Menu
</button>
<ul role="menu" id="menu" hidden>
    <li role="menuitem" tabindex="-1">Option 1</li>
    <li role="menuitem" tabindex="-1">Option 2</li>
    <li role="menuitem" tabindex="-1">Option 3</li>
</ul>
```

```javascript
// Arrow keys navigate menu items
// Enter/Space activates
// Escape closes menu
// First letter jumps to matching item
```

## Preventing Focus Issues

### Inert Content

Hide content from focus when covered by modals:

```html
<main id="main" inert>
    <!-- Content behind modal is inert -->
</main>
<div role="dialog" aria-modal="true">
    <!-- Modal content -->
</div>
```

Or use JavaScript:

```javascript
function openModal() {
    document.getElementById('main').setAttribute('inert', '');
}

function closeModal() {
    document.getElementById('main').removeAttribute('inert');
}
```

### Hidden Content

Ensure hidden content is not focusable:

```css
/* These properly hide from focus */
.hidden {
    display: none;
}

.invisible {
    visibility: hidden;
}

/* These do NOT hide from focus */
.transparent {
    opacity: 0;  /* Still focusable! */
}

.off-screen {
    position: absolute;
    left: -9999px;  /* Still focusable! */
}
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Keyboard Accessible Page</title>
    <style>
        .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: #333;
            color: white;
            padding: 0.5rem 1rem;
            z-index: 1000;
        }

        .skip-link:focus {
            top: 0;
        }

        *:focus-visible {
            outline: 2px solid #0066cc;
            outline-offset: 2px;
        }

        .dialog-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .dialog {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            max-width: 400px;
        }
    </style>
</head>
<body>
    <a href="#main" class="skip-link">Skip to main content</a>

    <header>
        <nav aria-label="Main">
            <ul>
                <li><a href="/" aria-current="page">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main id="main">
        <h1>Welcome</h1>

        <button
            type="button"
            id="open-dialog"
            aria-haspopup="dialog"
        >
            Open Dialog
        </button>
    </main>

    <div
        class="dialog-overlay"
        id="dialog-overlay"
        hidden
    >
        <div
            role="dialog"
            aria-labelledby="dialog-title"
            aria-modal="true"
            class="dialog"
            id="dialog"
        >
            <h2 id="dialog-title">Confirm Action</h2>
            <p>Are you sure you want to continue?</p>
            <button type="button" id="confirm">Confirm</button>
            <button type="button" id="cancel">Cancel</button>
        </div>
    </div>

    <script>
        const openBtn = document.getElementById('open-dialog');
        const overlay = document.getElementById('dialog-overlay');
        const dialog = document.getElementById('dialog');
        const confirmBtn = document.getElementById('confirm');
        const cancelBtn = document.getElementById('cancel');

        function openDialog() {
            overlay.hidden = false;
            confirmBtn.focus();
            document.querySelector('main').setAttribute('inert', '');
            trapFocus(dialog);
        }

        function closeDialog() {
            overlay.hidden = true;
            document.querySelector('main').removeAttribute('inert');
            openBtn.focus();
        }

        function trapFocus(element) {
            const focusable = element.querySelectorAll('button');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
                if (e.key === 'Escape') {
                    closeDialog();
                }
            });
        }

        openBtn.addEventListener('click', openDialog);
        confirmBtn.addEventListener('click', closeDialog);
        cancelBtn.addEventListener('click', closeDialog);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeDialog();
        });
    </script>
</body>
</html>
```

## Key Takeaways

1. **All functionality must work with keyboard**
2. **Never remove focus outlines** without replacement
3. **Use `:focus-visible`** for keyboard-only focus styles
4. **Provide skip links** to bypass navigation
5. **Trap focus in modals** and dialogs
6. **Use `inert`** to disable background content
7. **Follow established patterns** for tabs, menus, etc.
8. **Test by unplugging your mouse**

In the next lesson, we will explore color contrast and visual accessibility.
