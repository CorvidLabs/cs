---
title: Tables
order: 4
estimatedMinutes: 18
---

# Tables

HTML tables display data in rows and columns. They are perfect for structured data like schedules, statistics, and comparisons. However, tables should never be used for page layout.

## Basic Table Structure

```html
<table>
    <tr>
        <td>Cell 1</td>
        <td>Cell 2</td>
    </tr>
    <tr>
        <td>Cell 3</td>
        <td>Cell 4</td>
    </tr>
</table>
```

| Element | Purpose |
|---------|---------|
| `<table>` | Table container |
| `<tr>` | Table row |
| `<td>` | Table data cell |
| `<th>` | Table header cell |

## Adding Headers

Use `<th>` for header cells:

```html
<table>
    <tr>
        <th>Name</th>
        <th>Age</th>
        <th>City</th>
    </tr>
    <tr>
        <td>Alice</td>
        <td>28</td>
        <td>New York</td>
    </tr>
    <tr>
        <td>Bob</td>
        <td>34</td>
        <td>Los Angeles</td>
    </tr>
</table>
```

Headers are bold and centered by default, and screen readers use them to navigate tables.

## Semantic Table Structure

For accessibility, use `<thead>`, `<tbody>`, and `<tfoot>`:

```html
<table>
    <thead>
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Widget</td>
            <td>$10.00</td>
            <td>5</td>
            <td>$50.00</td>
        </tr>
        <tr>
            <td>Gadget</td>
            <td>$25.00</td>
            <td>2</td>
            <td>$50.00</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th colspan="3">Grand Total</th>
            <td>$100.00</td>
        </tr>
    </tfoot>
</table>
```

| Element | Purpose |
|---------|---------|
| `<thead>` | Header rows |
| `<tbody>` | Body content |
| `<tfoot>` | Footer rows (totals, summaries) |

## Table Caption

Add a caption to describe the table:

```html
<table>
    <caption>Monthly Sales Report for Q1 2024</caption>
    <thead>
        <tr>
            <th>Month</th>
            <th>Sales</th>
            <th>Growth</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>January</td>
            <td>$45,000</td>
            <td>+5%</td>
        </tr>
        <tr>
            <td>February</td>
            <td>$52,000</td>
            <td>+15%</td>
        </tr>
        <tr>
            <td>March</td>
            <td>$61,000</td>
            <td>+17%</td>
        </tr>
    </tbody>
</table>
```

The caption appears above the table and helps all users understand its purpose.

## Spanning Rows and Columns

### Column Span

```html
<table>
    <tr>
        <th colspan="2">Name</th>
        <th>Age</th>
    </tr>
    <tr>
        <td>First</td>
        <td>Last</td>
        <td>Years</td>
    </tr>
    <tr>
        <td>John</td>
        <td>Doe</td>
        <td>30</td>
    </tr>
</table>
```

### Row Span

```html
<table>
    <tr>
        <th>Category</th>
        <th>Item</th>
        <th>Price</th>
    </tr>
    <tr>
        <td rowspan="2">Fruits</td>
        <td>Apples</td>
        <td>$2.00</td>
    </tr>
    <tr>
        <td>Oranges</td>
        <td>$3.00</td>
    </tr>
    <tr>
        <td rowspan="2">Vegetables</td>
        <td>Carrots</td>
        <td>$1.50</td>
    </tr>
    <tr>
        <td>Broccoli</td>
        <td>$2.50</td>
    </tr>
</table>
```

## Header Scope

Use the `scope` attribute to clarify header relationships:

```html
<table>
    <thead>
        <tr>
            <th scope="col">Product</th>
            <th scope="col">Q1</th>
            <th scope="col">Q2</th>
            <th scope="col">Q3</th>
            <th scope="col">Q4</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Widgets</th>
            <td>100</td>
            <td>150</td>
            <td>200</td>
            <td>250</td>
        </tr>
        <tr>
            <th scope="row">Gadgets</th>
            <td>50</td>
            <td>75</td>
            <td>100</td>
            <td>125</td>
        </tr>
    </tbody>
</table>
```

| Scope | Meaning |
|-------|---------|
| `col` | Header for a column |
| `row` | Header for a row |
| `colgroup` | Header for column group |
| `rowgroup` | Header for row group |

## Column Groups

Style or reference groups of columns:

```html
<table>
    <caption>Quarterly Sales by Region</caption>
    <colgroup>
        <col>
        <col span="2" class="highlight">
        <col span="2">
    </colgroup>
    <thead>
        <tr>
            <th>Region</th>
            <th>Q1</th>
            <th>Q2</th>
            <th>Q3</th>
            <th>Q4</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">North</th>
            <td>$10,000</td>
            <td>$12,000</td>
            <td>$15,000</td>
            <td>$18,000</td>
        </tr>
    </tbody>
</table>
```

## Accessible Tables

### Simple Tables

For simple tables, use proper headers:

```html
<table>
    <caption>Employee Directory</caption>
    <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Department</th>
            <th scope="col">Extension</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Jane Smith</td>
            <td>Marketing</td>
            <td>x1234</td>
        </tr>
    </tbody>
</table>
```

### Complex Tables

For complex tables with multiple header levels:

```html
<table>
    <caption>Sales Data 2024</caption>
    <thead>
        <tr>
            <th rowspan="2" scope="col">Product</th>
            <th colspan="2" scope="colgroup">Q1</th>
            <th colspan="2" scope="colgroup">Q2</th>
        </tr>
        <tr>
            <th scope="col">Units</th>
            <th scope="col">Revenue</th>
            <th scope="col">Units</th>
            <th scope="col">Revenue</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Widget A</th>
            <td>100</td>
            <td>$1,000</td>
            <td>150</td>
            <td>$1,500</td>
        </tr>
    </tbody>
</table>
```

## Responsive Tables

Tables can be challenging on mobile. Here are some approaches:

### Horizontal Scroll

```html
<div class="table-wrapper">
    <table>
        <!-- Wide table content -->
    </table>
</div>
```

```css
.table-wrapper {
    overflow-x: auto;
}

table {
    min-width: 600px;
}
```

### Stacked Layout

Transform to stacked layout on mobile:

```css
@media (max-width: 600px) {
    table, thead, tbody, th, td, tr {
        display: block;
    }

    thead tr {
        position: absolute;
        top: -9999px;
        left: -9999px;
    }

    tr {
        margin-bottom: 1rem;
        border: 1px solid #ccc;
    }

    td {
        position: relative;
        padding-left: 50%;
    }

    td::before {
        content: attr(data-label);
        position: absolute;
        left: 0.5rem;
        font-weight: bold;
    }
}
```

```html
<tr>
    <td data-label="Name">John Doe</td>
    <td data-label="Age">30</td>
    <td data-label="City">New York</td>
</tr>
```

## Styling Tables

### Basic Table Styles

```css
table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f5f5f5;
    font-weight: bold;
}

/* Zebra striping */
tbody tr:nth-child(even) {
    background-color: #fafafa;
}

/* Hover effect */
tbody tr:hover {
    background-color: #f0f0f0;
}

/* Caption styling */
caption {
    padding: 1rem;
    font-size: 1.25rem;
    font-weight: bold;
    text-align: left;
}
```

## Complete Table Example

```html
<table>
    <caption>
        2024 Conference Schedule
        <span class="caption-note">All times in Pacific Time</span>
    </caption>

    <thead>
        <tr>
            <th scope="col">Time</th>
            <th scope="col">Session</th>
            <th scope="col">Speaker</th>
            <th scope="col">Room</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <th scope="row">9:00 AM</th>
            <td>Registration & Breakfast</td>
            <td>-</td>
            <td>Lobby</td>
        </tr>
        <tr>
            <th scope="row">10:00 AM</th>
            <td>Opening Keynote: The Future of Web</td>
            <td>Dr. Sarah Chen</td>
            <td>Main Hall</td>
        </tr>
        <tr>
            <th scope="row">11:30 AM</th>
            <td>CSS Grid Deep Dive</td>
            <td>Marcus Johnson</td>
            <td>Room A</td>
        </tr>
        <tr>
            <th scope="row">11:30 AM</th>
            <td>Accessibility Best Practices</td>
            <td>Emily Watson</td>
            <td>Room B</td>
        </tr>
        <tr>
            <th scope="row">12:30 PM</th>
            <td colspan="3">Lunch Break</td>
        </tr>
        <tr>
            <th scope="row">2:00 PM</th>
            <td>JavaScript Performance</td>
            <td>Alex Rivera</td>
            <td>Room A</td>
        </tr>
        <tr>
            <th scope="row">2:00 PM</th>
            <td>Responsive Design Workshop</td>
            <td>Jordan Lee</td>
            <td>Room B</td>
        </tr>
        <tr>
            <th scope="row">4:00 PM</th>
            <td>Closing Remarks</td>
            <td>Conference Team</td>
            <td>Main Hall</td>
        </tr>
    </tbody>

    <tfoot>
        <tr>
            <td colspan="4">
                <a href="/schedule.pdf">Download full schedule (PDF)</a>
            </td>
        </tr>
    </tfoot>
</table>
```

## When Not to Use Tables

Tables are for tabular data only:

```html
<!-- Wrong: layout with tables -->
<table>
    <tr>
        <td>Logo</td>
        <td>Navigation</td>
    </tr>
    <tr>
        <td>Sidebar</td>
        <td>Content</td>
    </tr>
</table>

<!-- Right: CSS layout -->
<header>
    <div class="logo">Logo</div>
    <nav>Navigation</nav>
</header>
<main>
    <aside>Sidebar</aside>
    <article>Content</article>
</main>
```

Use CSS Grid or Flexbox for page layout.

## Key Takeaways

1. **Use tables for tabular data only** - Never for layout
2. **Include `<caption>`** - Describes the tables purpose
3. **Use `<thead>`, `<tbody>`, `<tfoot>`** - For semantic structure
4. **Use `<th>` with `scope`** - Clarifies header relationships
5. **Add `colspan` and `rowspan`** - For spanning cells
6. **Style with CSS** - Use `border-collapse` and padding
7. **Consider mobile** - Use horizontal scroll or stacked layouts

You have now completed the HTML Forms and Tables module. Next, we will start learning CSS.
