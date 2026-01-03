---
title: Form Validation
order: 3
estimatedMinutes: 18
---

# Form Validation

Form validation ensures users provide correct data before submission. HTML5 provides built-in validation that works without JavaScript, improving user experience and reducing server load.

## Why Validate?

1. **Prevent errors** - Catch mistakes before submission
2. **Guide users** - Help them provide correct data
3. **Reduce server load** - Filter invalid requests client-side
4. **Improve security** - First line of defense (but never the only one)

Always validate on the server too. Client-side validation can be bypassed.

## Required Fields

The `required` attribute prevents empty submissions:

```html
<label for="email">Email (required)</label>
<input type="email" id="email" name="email" required>
```

The browser will show an error message if the field is empty on submit.

## Input Type Validation

Many input types have built-in validation:

```html
<!-- Must be valid email format -->
<input type="email" name="email">

<!-- Must be valid URL -->
<input type="url" name="website">

<!-- Must be a number -->
<input type="number" name="age">
```

## Length Constraints

### Text Length

```html
<!-- Minimum 3 characters -->
<input type="text" name="username" minlength="3">

<!-- Maximum 50 characters -->
<input type="text" name="title" maxlength="50">

<!-- Between 8 and 20 characters -->
<input type="password" name="password" minlength="8" maxlength="20">
```

### Textarea Length

```html
<textarea name="bio" minlength="10" maxlength="500"></textarea>
```

## Numeric Constraints

```html
<!-- Minimum value -->
<input type="number" name="age" min="18">

<!-- Maximum value -->
<input type="number" name="quantity" max="100">

<!-- Range -->
<input type="number" name="score" min="0" max="100">

<!-- Step (increments) -->
<input type="number" name="price" min="0" step="0.01">
```

## Pattern Validation

Use regular expressions for custom validation:

```html
<!-- US Phone: (555) 123-4567 -->
<input
    type="tel"
    name="phone"
    pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}"
    title="Format: (555) 123-4567"
>

<!-- US Zip Code: 12345 or 12345-6789 -->
<input
    type="text"
    name="zip"
    pattern="[0-9]{5}(-[0-9]{4})?"
    title="5-digit or 9-digit ZIP code"
>

<!-- Username: letters, numbers, underscore -->
<input
    type="text"
    name="username"
    pattern="[a-zA-Z0-9_]{3,20}"
    title="3-20 characters, letters, numbers, and underscore only"
>
```

The `title` attribute provides a hint shown in the error message.

### Common Patterns

| Pattern | Matches |
|---------|---------|
| `[a-zA-Z]+` | Letters only |
| `[0-9]+` | Numbers only |
| `[a-zA-Z0-9]+` | Alphanumeric |
| `[a-zA-Z ]+` | Letters and spaces |
| `.{3,}` | At least 3 characters |
| `\d{4}` | Exactly 4 digits |

## Validation Attributes Summary

| Attribute | Purpose | Works With |
|-----------|---------|------------|
| `required` | Must not be empty | All inputs |
| `minlength` | Minimum characters | Text inputs, textarea |
| `maxlength` | Maximum characters | Text inputs, textarea |
| `min` | Minimum value | Number, date, range |
| `max` | Maximum value | Number, date, range |
| `step` | Valid increments | Number, date, range |
| `pattern` | Regex pattern | Text inputs |

## Custom Error Messages

### Using Title Attribute

```html
<input
    type="text"
    name="code"
    pattern="[A-Z]{3}[0-9]{3}"
    title="3 uppercase letters followed by 3 digits (e.g., ABC123)"
    required
>
```

### Using aria-describedby

Provide persistent help text:

```html
<label for="password">Password</label>
<input
    type="password"
    id="password"
    name="password"
    minlength="8"
    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
    aria-describedby="password-help"
    required
>
<p id="password-help" class="help-text">
    Must be at least 8 characters with one uppercase, one lowercase, and one number.
</p>
```

## Styling Valid and Invalid States

CSS pseudo-classes target validation states:

```css
/* Valid input */
input:valid {
    border-color: green;
}

/* Invalid input */
input:invalid {
    border-color: red;
}

/* Only show invalid after user interaction */
input:invalid:not(:placeholder-shown) {
    border-color: red;
}

/* Focus states */
input:focus:valid {
    outline-color: green;
}

input:focus:invalid {
    outline-color: red;
}
```

### Better Validation Styling

Avoid showing errors before user types:

```css
/* Hide error styling until form submission attempted */
input:invalid {
    border-color: #ccc;
}

/* Show error styling only after user has interacted */
input:invalid:not(:focus):not(:placeholder-shown) {
    border-color: red;
    background-color: #fff0f0;
}

/* Valid styling after user has typed */
input:valid:not(:placeholder-shown) {
    border-color: green;
}
```

## Disabling Browser Validation

Sometimes you need custom validation:

```html
<form action="/submit" method="post" novalidate>
    <!-- Custom validation with JavaScript -->
</form>
```

Use `novalidate` when:
- Implementing custom validation UI
- Testing server-side validation
- Using a JavaScript form library

## Accessible Error Messages

### Associate Errors with Inputs

```html
<div class="form-group">
    <label for="email">Email</label>
    <input
        type="email"
        id="email"
        name="email"
        aria-describedby="email-error"
        aria-invalid="true"
        required
    >
    <p id="email-error" class="error" role="alert">
        Please enter a valid email address.
    </p>
</div>
```

### Error Summary

For complex forms, summarize errors at the top:

```html
<div role="alert" aria-labelledby="error-heading">
    <h2 id="error-heading">Please fix the following errors:</h2>
    <ul>
        <li><a href="#email">Email address is required</a></li>
        <li><a href="#password">Password must be at least 8 characters</a></li>
    </ul>
</div>
```

## Complete Validation Example

```html
<form action="/register" method="post">
    <h2>Create Account</h2>

    <div class="form-group">
        <label for="username">
            Username
            <span class="required" aria-hidden="true">*</span>
        </label>
        <input
            type="text"
            id="username"
            name="username"
            minlength="3"
            maxlength="20"
            pattern="[a-zA-Z0-9_]+"
            aria-describedby="username-help"
            required
        >
        <p id="username-help" class="help-text">
            3-20 characters. Letters, numbers, and underscores only.
        </p>
    </div>

    <div class="form-group">
        <label for="email">
            Email
            <span class="required" aria-hidden="true">*</span>
        </label>
        <input
            type="email"
            id="email"
            name="email"
            autocomplete="email"
            required
        >
    </div>

    <div class="form-group">
        <label for="password">
            Password
            <span class="required" aria-hidden="true">*</span>
        </label>
        <input
            type="password"
            id="password"
            name="password"
            minlength="8"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            aria-describedby="password-help"
            autocomplete="new-password"
            required
        >
        <p id="password-help" class="help-text">
            At least 8 characters with uppercase, lowercase, and a number.
        </p>
    </div>

    <div class="form-group">
        <label for="confirm-password">
            Confirm Password
            <span class="required" aria-hidden="true">*</span>
        </label>
        <input
            type="password"
            id="confirm-password"
            name="confirm_password"
            minlength="8"
            autocomplete="new-password"
            required
        >
    </div>

    <div class="form-group">
        <label for="phone">Phone (optional)</label>
        <input
            type="tel"
            id="phone"
            name="phone"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            aria-describedby="phone-help"
        >
        <p id="phone-help" class="help-text">
            Format: 555-123-4567
        </p>
    </div>

    <div class="form-group">
        <label for="age">
            Age
            <span class="required" aria-hidden="true">*</span>
        </label>
        <input
            type="number"
            id="age"
            name="age"
            min="13"
            max="120"
            required
        >
    </div>

    <div class="form-group">
        <label for="website">Website (optional)</label>
        <input
            type="url"
            id="website"
            name="website"
            placeholder="https://example.com"
        >
    </div>

    <fieldset>
        <legend>Communication Preferences</legend>

        <label>
            <input type="checkbox" name="prefs" value="email">
            Email updates
        </label>

        <label>
            <input type="checkbox" name="prefs" value="sms">
            SMS notifications
        </label>
    </fieldset>

    <div class="form-group">
        <label>
            <input type="checkbox" name="terms" required>
            I agree to the <a href="/terms">Terms of Service</a>
            <span class="required" aria-hidden="true">*</span>
        </label>
    </div>

    <p class="form-note">
        <span class="required" aria-hidden="true">*</span> Required fields
    </p>

    <button type="submit">Create Account</button>
</form>
```

## Validation CSS

```css
/* Base form styling */
.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
}

/* Required indicator */
.required {
    color: #d32f2f;
}

/* Help text */
.help-text {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #666;
}

/* Valid state (after user types) */
input:valid:not(:placeholder-shown) {
    border-color: #2e7d32;
}

/* Invalid state (after user types and leaves field) */
input:invalid:not(:focus):not(:placeholder-shown) {
    border-color: #d32f2f;
}

/* Error message styling */
.error {
    color: #d32f2f;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

/* Focus styling */
input:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
}
```

## Key Takeaways

1. **Always validate server-side** - Client validation can be bypassed
2. **Use semantic input types** - `email`, `url`, `number` for built-in validation
3. **Combine validation attributes** - `required`, `minlength`, `pattern`
4. **Provide clear feedback** - Use `title` and `aria-describedby`
5. **Style validation states** - Use `:valid`, `:invalid`, `:focus`
6. **Wait to show errors** - Use `:not(:placeholder-shown)` to avoid premature feedback
7. **Mark required fields** - Both visually and with `required` attribute

In the next lesson, we will learn how to create accessible data tables.
