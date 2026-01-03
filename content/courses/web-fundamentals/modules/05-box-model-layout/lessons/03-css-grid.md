---
title: CSS Grid
order: 3
estimatedMinutes: 22
---

# CSS Grid

CSS Grid is a two-dimensional layout system that handles both rows and columns. It's perfect for page layouts, image galleries, and complex component designs.

## Grid Container

Create a grid container:

```css
.container {
    display: grid;
}
```

## Defining Rows and Columns

### Grid Template Columns

```css
.grid {
    display: grid;

    /* Three equal columns */
    grid-template-columns: 1fr 1fr 1fr;

    /* Fixed widths */
    grid-template-columns: 200px 400px 200px;

    /* Mixed */
    grid-template-columns: 200px 1fr 200px;

    /* Repeat */
    grid-template-columns: repeat(3, 1fr);
    grid-template-columns: repeat(4, 200px);
}
```

### Grid Template Rows

```css
.grid {
    display: grid;
    grid-template-rows: 100px auto 50px;
    grid-template-rows: repeat(3, 1fr);
}
```

### The `fr` Unit

The `fr` unit represents a fraction of available space:

```css
.grid {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    /* First and third get 1/4 each, middle gets 2/4 (half) */
}
```

## Gap

Add space between grid cells:

```css
.grid {
    display: grid;
    gap: 1rem;           /* Row and column gap */
    row-gap: 2rem;       /* Just row gap */
    column-gap: 1rem;    /* Just column gap */
}
```

## Placing Items

### Automatic Placement

By default, items fill cells in order:

```css
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}
/* Items flow: 1, 2, 3, then 4, 5, 6, etc. */
```

### Spanning Columns

```css
.item {
    grid-column: span 2;  /* Span 2 columns */
}

/* Or specify start and end */
.item {
    grid-column: 1 / 3;   /* Start at line 1, end at line 3 */
    grid-column: 1 / -1;  /* Span all columns (start to end) */
}
```

### Spanning Rows

```css
.item {
    grid-row: span 2;     /* Span 2 rows */
    grid-row: 1 / 3;      /* Start at line 1, end at line 3 */
}
```

### Grid Area Shorthand

```css
.item {
    /* grid-area: row-start / col-start / row-end / col-end */
    grid-area: 1 / 1 / 3 / 3;  /* 2x2 area in top-left */
}
```

## Named Grid Lines

Name your grid lines for clarity:

```css
.grid {
    display: grid;
    grid-template-columns:
        [sidebar-start] 200px
        [sidebar-end content-start] 1fr
        [content-end];
}

.sidebar {
    grid-column: sidebar-start / sidebar-end;
}

.content {
    grid-column: content-start / content-end;
}
```

## Named Grid Areas

Define layout visually with named areas:

```css
.grid {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header header"
        "sidebar content"
        "footer footer";
    gap: 1rem;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
```

Use `.` for empty cells:

```css
grid-template-areas:
    "header header header"
    "sidebar content ."
    "footer footer footer";
```

## Auto-Fit and Auto-Fill

Create responsive grids without media queries:

### Auto-Fill

```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
}
/* Creates as many 250px+ columns as fit, empty columns remain */
```

### Auto-Fit

```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}
/* Creates as many 250px+ columns as fit, empty columns collapse */
```

The difference: `auto-fit` collapses empty tracks, `auto-fill` keeps them.

## Alignment

### Justify Items (horizontal)

```css
.grid {
    display: grid;
    justify-items: start;    /* Align to start */
    justify-items: end;      /* Align to end */
    justify-items: center;   /* Center horizontally */
    justify-items: stretch;  /* Fill cell width (default) */
}
```

### Align Items (vertical)

```css
.grid {
    display: grid;
    align-items: start;      /* Align to top */
    align-items: end;        /* Align to bottom */
    align-items: center;     /* Center vertically */
    align-items: stretch;    /* Fill cell height (default) */
}
```

### Place Items (shorthand)

```css
.grid {
    place-items: center;  /* Center both ways */
    /* Same as: align-items: center; justify-items: center; */
}
```

### Justify/Align Content

When the grid is smaller than its container:

```css
.grid {
    justify-content: center;       /* Center grid horizontally */
    align-content: center;         /* Center grid vertically */
    place-content: center;         /* Both */

    justify-content: space-between; /* Space between columns */
    align-content: space-between;   /* Space between rows */
}
```

### Individual Item Alignment

```css
.item {
    justify-self: center;  /* Center this item horizontally */
    align-self: end;       /* Align this item to bottom */
    place-self: center;    /* Center both ways */
}
```

## Implicit Grid

When items overflow the defined grid:

```css
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* Only 3 columns defined, but... */

    grid-auto-rows: 150px;  /* Implicit rows are 150px */
    grid-auto-columns: 1fr; /* Implicit columns are 1fr */
    grid-auto-flow: row;    /* Fill by row (default) */
    grid-auto-flow: column; /* Fill by column */
    grid-auto-flow: dense;  /* Fill gaps when possible */
}
```

## Sizing Keywords

### minmax()

```css
.grid {
    grid-template-columns: minmax(200px, 1fr) minmax(400px, 2fr);
    grid-template-rows: minmax(100px, auto);
}
```

### fit-content()

```css
.grid {
    grid-template-columns: fit-content(200px) 1fr;
    /* First column is content width, up to 200px max */
}
```

### min-content and max-content

```css
.grid {
    grid-template-columns: min-content 1fr max-content;
    /* min-content: smallest size without overflow */
    /* max-content: natural size, no wrapping */
}
```

## Common Layouts

### Basic Page Layout

```css
.page {
    display: grid;
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    min-height: 100vh;
}

header { grid-area: header; }
aside { grid-area: sidebar; }
main { grid-area: main; }
footer { grid-area: footer; }
```

### Holy Grail Layout

```css
.holy-grail {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header header header"
        "nav content aside"
        "footer footer footer";
    min-height: 100vh;
}
```

### Responsive Card Grid

```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}
```

### Image Gallery

```css
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-auto-rows: 200px;
    gap: 0.5rem;
}

.gallery-item.wide {
    grid-column: span 2;
}

.gallery-item.tall {
    grid-row: span 2;
}
```

### Dashboard Layout

```css
.dashboard {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(100px, auto);
    gap: 1rem;
}

.widget-large {
    grid-column: span 2;
    grid-row: span 2;
}

.widget-wide {
    grid-column: span 2;
}
```

## Complete Example

```html
<div class="layout">
    <header class="header">Header</header>
    <nav class="nav">Navigation</nav>
    <main class="main">
        <h1>Dashboard</h1>
        <div class="widgets">
            <div class="widget large">Main Widget</div>
            <div class="widget">Widget 2</div>
            <div class="widget">Widget 3</div>
            <div class="widget wide">Wide Widget</div>
            <div class="widget">Widget 5</div>
        </div>
    </main>
    <aside class="sidebar">Sidebar</aside>
    <footer class="footer">Footer</footer>
</div>
```

```css
.layout {
    display: grid;
    grid-template-columns: 200px 1fr 250px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header header header"
        "nav main sidebar"
        "footer footer footer";
    min-height: 100vh;
    gap: 1rem;
}

.header {
    grid-area: header;
    background: #1a1a2e;
    color: white;
    padding: 1rem;
}

.nav {
    grid-area: nav;
    background: #f5f5f5;
    padding: 1rem;
}

.main {
    grid-area: main;
    padding: 1rem;
}

.sidebar {
    grid-area: sidebar;
    background: #f5f5f5;
    padding: 1rem;
}

.footer {
    grid-area: footer;
    background: #1a1a2e;
    color: white;
    padding: 1rem;
    text-align: center;
}

/* Dashboard widgets */
.widgets {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(150px, auto);
    gap: 1rem;
    margin-top: 1rem;
}

.widget {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
}

.widget.large {
    grid-column: span 2;
    grid-row: span 2;
}

.widget.wide {
    grid-column: span 2;
}

/* Responsive */
@media (max-width: 768px) {
    .layout {
        grid-template-columns: 1fr;
        grid-template-areas:
            "header"
            "nav"
            "main"
            "sidebar"
            "footer";
    }

    .widgets {
        grid-template-columns: 1fr;
    }

    .widget.large,
    .widget.wide {
        grid-column: span 1;
        grid-row: span 1;
    }
}
```

## Grid vs Flexbox

| Use Case | Recommended |
|----------|-------------|
| One-dimensional layout (row OR column) | Flexbox |
| Two-dimensional layout (rows AND columns) | Grid |
| Content-driven sizing | Flexbox |
| Layout-driven sizing | Grid |
| Navigation bars | Flexbox |
| Page layouts | Grid |
| Card alignment | Both work |
| Unknown number of items | Flexbox |

## Key Takeaways

1. **`display: grid`** creates a grid container
2. **`grid-template-columns/rows`** define the grid structure
3. **`fr` unit** distributes available space proportionally
4. **`gap`** adds space between cells
5. **`grid-template-areas`** creates visual, named layouts
6. **`auto-fit` and `minmax()`** create responsive grids
7. **`grid-column/row: span`** makes items span multiple cells
8. **Grid for 2D layouts**, Flexbox for 1D layouts

In the next lesson, we will explore CSS positioning.
