---
title: Form Basics
order: 1
estimatedMinutes: 20
---

# Form Basics

Forms are how users interact with web applications. From login screens to search boxes to checkout pages, forms collect user input and send it to servers for processing.

## The Form Element

Every form starts with the `<form>` element:

```html
<form action="/submit" method="post">
    <!-- Form controls go here -->
</form>
```

### Form Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `action` | URL to send data to | `/api/submit` |
| `method` | HTTP method | `get` or `post` |
| `enctype` | How data is encoded | `multipart/form-data` for files |
| `novalidate` | Disable browser validation | `novalidate` |

### GET vs POST

```html
<!-- GET: Data appears in URL, good for searches -->
<form action="/search" method="get">
    <input type="search" name="q">
    <button type="submit">Search</button>
</form>
<!-- Results in: /search?q=user+query -->

<!-- POST: Data in request body, good for sensitive data -->
<form action="/login" method="post">
    <input type="email" name="email">
    <input type="password" name="password">
    <button type="submit">Log In</button>
</form>
```

Use **GET** for:
- Search forms
- Filter forms
- Any idempotent request (safe to repeat)

Use **POST** for:
- Login forms
- Registration forms
- Any form with sensitive data
- Forms that change server state

## Labels and Inputs

Every form input needs a label:

```html
<form action="/contact" method="post">
    <label for="name">Your Name</label>
    <input type="text" id="name" name="name">

    <label for="email">Email Address</label>
    <input type="email" id="email" name="email">

    <button type="submit">Send Message</button>
</form>
```

### Why Labels Matter

1. **Accessibility**: Screen readers announce the label
2. **Usability**: Clicking the label focuses the input
3. **Mobile**: Larger touch target

### Label Association

Two ways to associate labels with inputs:

```html
<!-- Method 1: for/id pairing (recommended) -->
<label for="username">Username</label>
<input type="text" id="username" name="username">

<!-- Method 2: Wrapping (useful for custom styling) -->
<label>
    Username
    <input type="text" name="username">
</label>
```

The `for` attribute must match the input's `id` exactly.

## Common Form Controls

### Text Input

```html
<label for="fullname">Full Name</label>
<input
    type="text"
    id="fullname"
    name="fullname"
    placeholder="John Doe"
    required
>
```

### Textarea

For multi-line text:

```html
<label for="message">Your Message</label>
<textarea
    id="message"
    name="message"
    rows="5"
    cols="40"
    placeholder="Type your message here..."
></textarea>
```

### Select Dropdown

```html
<label for="country">Country</label>
<select id="country" name="country">
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
    <option value="au">Australia</option>
</select>
```

With option groups:

```html
<label for="car">Choose a car</label>
<select id="car" name="car">
    <optgroup label="Swedish Cars">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
    </optgroup>
    <optgroup label="German Cars">
        <option value="mercedes">Mercedes</option>
        <option value="bmw">BMW</option>
    </optgroup>
</select>
```

### Checkboxes

For multiple selections:

```html
<fieldset>
    <legend>Choose your interests</legend>

    <label>
        <input type="checkbox" name="interests" value="music">
        Music
    </label>

    <label>
        <input type="checkbox" name="interests" value="sports">
        Sports
    </label>

    <label>
        <input type="checkbox" name="interests" value="reading">
        Reading
    </label>
</fieldset>
```

### Radio Buttons

For single selection from multiple options:

```html
<fieldset>
    <legend>Preferred contact method</legend>

    <label>
        <input type="radio" name="contact" value="email" checked>
        Email
    </label>

    <label>
        <input type="radio" name="contact" value="phone">
        Phone
    </label>

    <label>
        <input type="radio" name="contact" value="mail">
        Mail
    </label>
</fieldset>
```

Radio buttons with the same `name` are mutually exclusive.

## Fieldset and Legend

Group related form controls:

```html
<form action="/order" method="post">
    <fieldset>
        <legend>Shipping Address</legend>

        <label for="street">Street Address</label>
        <input type="text" id="street" name="street">

        <label for="city">City</label>
        <input type="text" id="city" name="city">

        <label for="zip">ZIP Code</label>
        <input type="text" id="zip" name="zip">
    </fieldset>

    <fieldset>
        <legend>Payment Information</legend>

        <label for="card">Card Number</label>
        <input type="text" id="card" name="card">

        <label for="expiry">Expiration Date</label>
        <input type="text" id="expiry" name="expiry">
    </fieldset>

    <button type="submit">Place Order</button>
</form>
```

### When to Use Fieldset

- Group related inputs (address fields, contact info)
- Radio button groups
- Checkbox groups
- Any logical grouping that needs a label

## Buttons

### Button Types

```html
<!-- Submit button: sends form data -->
<button type="submit">Submit Form</button>

<!-- Reset button: clears all form fields (rarely used) -->
<button type="reset">Clear Form</button>

<!-- Generic button: for JavaScript actions -->
<button type="button">Do Something</button>
```

### Button vs Input

Prefer `<button>` over `<input type="submit">`:

```html
<!-- Preferred: more flexible, can contain HTML -->
<button type="submit">
    Submit Form
</button>

<!-- Also valid but less flexible -->
<input type="submit" value="Submit Form">
```

## Input Attributes

### Common Attributes

```html
<input
    type="text"
    id="username"
    name="username"
    placeholder="Enter username"
    required
    minlength="3"
    maxlength="20"
    autocomplete="username"
    autofocus
>
```

| Attribute | Purpose |
|-----------|---------|
| `placeholder` | Hint text (disappears on focus) |
| `required` | Must be filled before submit |
| `disabled` | Cannot be edited or submitted |
| `readonly` | Cannot be edited but is submitted |
| `autofocus` | Focus this input on page load |
| `autocomplete` | Browser autofill hint |

### Autocomplete Values

Help browsers autofill correctly:

```html
<input type="text" name="name" autocomplete="name">
<input type="email" name="email" autocomplete="email">
<input type="tel" name="phone" autocomplete="tel">
<input type="text" name="street" autocomplete="street-address">
<input type="text" name="city" autocomplete="address-level2">
<input type="text" name="zip" autocomplete="postal-code">
<input type="text" name="cc-number" autocomplete="cc-number">
```

## Hidden Inputs

Send data without showing it:

```html
<form action="/update" method="post">
    <input type="hidden" name="user_id" value="12345">
    <input type="hidden" name="csrf_token" value="abc123xyz">

    <label for="status">Update Status</label>
    <select id="status" name="status">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
    </select>

    <button type="submit">Update</button>
</form>
```

## Complete Form Example

```html
<form action="/register" method="post">
    <h2>Create an Account</h2>

    <fieldset>
        <legend>Personal Information</legend>

        <div class="form-group">
            <label for="fullname">Full Name</label>
            <input
                type="text"
                id="fullname"
                name="fullname"
                autocomplete="name"
                required
            >
        </div>

        <div class="form-group">
            <label for="email">Email Address</label>
            <input
                type="email"
                id="email"
                name="email"
                autocomplete="email"
                required
            >
        </div>

        <div class="form-group">
            <label for="phone">Phone Number</label>
            <input
                type="tel"
                id="phone"
                name="phone"
                autocomplete="tel"
            >
        </div>
    </fieldset>

    <fieldset>
        <legend>Account Details</legend>

        <div class="form-group">
            <label for="username">Username</label>
            <input
                type="text"
                id="username"
                name="username"
                autocomplete="username"
                minlength="3"
                maxlength="20"
                required
            >
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                autocomplete="new-password"
                minlength="8"
                required
            >
        </div>
    </fieldset>

    <fieldset>
        <legend>Preferences</legend>

        <div class="form-group">
            <label>
                <input type="checkbox" name="newsletter" value="yes">
                Subscribe to our newsletter
            </label>
        </div>

        <div class="form-group">
            <label>
                <input type="checkbox" name="terms" value="accepted" required>
                I agree to the <a href="/terms">Terms of Service</a>
            </label>
        </div>
    </fieldset>

    <button type="submit">Create Account</button>
</form>
```

## Accessibility Checklist

1. Every input has a label
2. Labels are associated with `for`/`id`
3. Related inputs are grouped with `fieldset`/`legend`
4. Required fields are marked with `required`
5. Error messages are associated with inputs
6. Form can be completed with keyboard only
7. Focus order is logical

## Key Takeaways

1. **Use `<label>` for every input** - Associate with `for`/`id`
2. **Choose GET or POST appropriately** - GET for searches, POST for sensitive data
3. **Group related inputs** - Use `<fieldset>` and `<legend>`
4. **Use `<button>` over `<input type="submit">`** - More flexible
5. **Add autocomplete attributes** - Help browsers autofill
6. **Mark required fields** - Use the `required` attribute
7. **Use appropriate input types** - Email, tel, url, etc.

In the next lesson, we will explore all the different input types available in HTML5.
