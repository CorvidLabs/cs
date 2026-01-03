---
title: Input Types
order: 2
estimatedMinutes: 20
---

# Input Types

HTML5 introduced many specialized input types that provide better user experience, mobile keyboards, and built-in validation. Using the right input type makes forms easier to fill out.

## Text Inputs

### Basic Text

```html
<label for="name">Name</label>
<input type="text" id="name" name="name">
```

### Email

Validates email format and shows email keyboard on mobile:

```html
<label for="email">Email</label>
<input
    type="email"
    id="email"
    name="email"
    placeholder="user@example.com"
>
```

Allow multiple emails:

```html
<input type="email" name="recipients" multiple>
```

### Password

Masks input and prevents autofill issues:

```html
<label for="password">Password</label>
<input
    type="password"
    id="password"
    name="password"
    minlength="8"
    autocomplete="current-password"
>
```

For new passwords:

```html
<input
    type="password"
    name="new-password"
    autocomplete="new-password"
>
```

### URL

Validates URL format:

```html
<label for="website">Website</label>
<input
    type="url"
    id="website"
    name="website"
    placeholder="https://example.com"
>
```

### Telephone

Shows phone keyboard on mobile (no validation, format varies by country):

```html
<label for="phone">Phone</label>
<input
    type="tel"
    id="phone"
    name="phone"
    placeholder="(555) 123-4567"
    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
>
```

### Search

Styled as a search field with clear button:

```html
<label for="search">Search</label>
<input
    type="search"
    id="search"
    name="q"
    placeholder="Search..."
>
```

## Numeric Inputs

### Number

For numeric values with spinner controls:

```html
<label for="quantity">Quantity</label>
<input
    type="number"
    id="quantity"
    name="quantity"
    min="1"
    max="100"
    step="1"
    value="1"
>
```

| Attribute | Purpose |
|-----------|---------|
| `min` | Minimum allowed value |
| `max` | Maximum allowed value |
| `step` | Increment amount |
| `value` | Default value |

For decimals:

```html
<input type="number" step="0.01" min="0" placeholder="0.00">
```

### Range

Slider control for numeric ranges:

```html
<label for="volume">Volume: <output id="volume-output">50</output></label>
<input
    type="range"
    id="volume"
    name="volume"
    min="0"
    max="100"
    value="50"
>
```

With JavaScript to show current value:

```html
<input
    type="range"
    id="brightness"
    min="0"
    max="100"
    value="75"
    oninput="this.nextElementSibling.value = this.value"
>
<output>75</output>
```

## Date and Time Inputs

### Date

Calendar picker for dates:

```html
<label for="birthdate">Birth Date</label>
<input
    type="date"
    id="birthdate"
    name="birthdate"
    min="1900-01-01"
    max="2024-12-31"
>
```

### Time

Time picker:

```html
<label for="appointment">Appointment Time</label>
<input
    type="time"
    id="appointment"
    name="appointment"
    min="09:00"
    max="17:00"
>
```

### DateTime-Local

Combined date and time:

```html
<label for="meeting">Meeting</label>
<input
    type="datetime-local"
    id="meeting"
    name="meeting"
>
```

### Month

Month and year picker:

```html
<label for="expiry">Card Expiry</label>
<input
    type="month"
    id="expiry"
    name="expiry"
>
```

### Week

Week picker:

```html
<label for="week">Select Week</label>
<input
    type="week"
    id="week"
    name="week"
>
```

### Date Input Browser Support

Date/time inputs have varying browser support. Always provide:
- Clear placeholder text
- Alternative input methods for older browsers
- Server-side validation

## Color Input

Color picker:

```html
<label for="color">Choose a color</label>
<input
    type="color"
    id="color"
    name="color"
    value="#3498db"
>
```

## File Input

For file uploads:

```html
<label for="resume">Upload Resume</label>
<input
    type="file"
    id="resume"
    name="resume"
    accept=".pdf,.doc,.docx"
>
```

### Accept Attribute

Limit file types:

```html
<!-- Specific extensions -->
<input type="file" accept=".pdf,.doc,.docx">

<!-- MIME types -->
<input type="file" accept="image/*">
<input type="file" accept="audio/*">
<input type="file" accept="video/*">

<!-- Specific MIME types -->
<input type="file" accept="image/png, image/jpeg">
```

### Multiple Files

```html
<input type="file" name="photos" multiple accept="image/*">
```

### Form Encoding

File uploads require special form encoding:

```html
<form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="document">
    <button type="submit">Upload</button>
</form>
```

## Checkbox and Radio

### Checkbox

For boolean or multiple selections:

```html
<!-- Single checkbox -->
<label>
    <input type="checkbox" name="newsletter" value="yes">
    Subscribe to newsletter
</label>

<!-- Checkbox group -->
<fieldset>
    <legend>Select toppings</legend>
    <label>
        <input type="checkbox" name="toppings" value="cheese" checked>
        Cheese
    </label>
    <label>
        <input type="checkbox" name="toppings" value="pepperoni">
        Pepperoni
    </label>
    <label>
        <input type="checkbox" name="toppings" value="mushrooms">
        Mushrooms
    </label>
</fieldset>
```

### Radio

For single selection from options:

```html
<fieldset>
    <legend>Select size</legend>
    <label>
        <input type="radio" name="size" value="small">
        Small
    </label>
    <label>
        <input type="radio" name="size" value="medium" checked>
        Medium
    </label>
    <label>
        <input type="radio" name="size" value="large">
        Large
    </label>
</fieldset>
```

## Hidden and Button Types

### Hidden

For data that should not be visible:

```html
<input type="hidden" name="user_id" value="12345">
<input type="hidden" name="form_token" value="abc123">
```

### Submit

```html
<input type="submit" value="Send Message">
<!-- Or preferably use button -->
<button type="submit">Send Message</button>
```

### Reset

Clears the form (rarely used):

```html
<input type="reset" value="Clear Form">
<button type="reset">Clear Form</button>
```

### Image

Submit button with an image:

```html
<input
    type="image"
    src="submit-button.png"
    alt="Submit"
    width="100"
    height="40"
>
```

## Datalist

Provide autocomplete suggestions:

```html
<label for="browser">Choose a browser</label>
<input type="text" id="browser" name="browser" list="browsers">
<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
    <option value="Edge">
    <option value="Opera">
</datalist>
```

Works with many input types:

```html
<!-- URL suggestions -->
<input type="url" list="urls">
<datalist id="urls">
    <option value="https://google.com">
    <option value="https://github.com">
</datalist>

<!-- Email suggestions -->
<input type="email" list="emails">
<datalist id="emails">
    <option value="@gmail.com">
    <option value="@outlook.com">
</datalist>
```

## Input Type Reference

| Type | Purpose | Mobile Keyboard |
|------|---------|-----------------|
| `text` | General text | Standard |
| `email` | Email addresses | Email keyboard |
| `password` | Passwords | Standard (masked) |
| `url` | Web addresses | URL keyboard |
| `tel` | Phone numbers | Phone keypad |
| `search` | Search queries | Search keyboard |
| `number` | Numeric values | Number pad |
| `range` | Slider | N/A |
| `date` | Date picker | Date picker |
| `time` | Time picker | Time picker |
| `datetime-local` | Date and time | Combined picker |
| `month` | Month/year | Month picker |
| `week` | Week picker | Week picker |
| `color` | Color picker | Color picker |
| `file` | File upload | File picker |
| `checkbox` | Multiple options | N/A |
| `radio` | Single option | N/A |
| `hidden` | Hidden data | N/A |

## Complete Form Example

```html
<form action="/apply" method="post" enctype="multipart/form-data">
    <h2>Job Application</h2>

    <fieldset>
        <legend>Personal Information</legend>

        <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>

        <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone">
        </div>

        <div class="form-group">
            <label for="website">Portfolio URL</label>
            <input type="url" id="website" name="website">
        </div>

        <div class="form-group">
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob">
        </div>
    </fieldset>

    <fieldset>
        <legend>Position Details</legend>

        <div class="form-group">
            <label for="position">Position</label>
            <input type="text" id="position" name="position" list="positions">
            <datalist id="positions">
                <option value="Software Engineer">
                <option value="Product Designer">
                <option value="Project Manager">
                <option value="Data Analyst">
            </datalist>
        </div>

        <div class="form-group">
            <label for="salary">Salary Expectation</label>
            <input
                type="number"
                id="salary"
                name="salary"
                min="30000"
                max="200000"
                step="1000"
            >
        </div>

        <div class="form-group">
            <label for="start-date">Available Start Date</label>
            <input type="date" id="start-date" name="start_date">
        </div>

        <div class="form-group">
            <label for="experience">Years of Experience: <output>5</output></label>
            <input
                type="range"
                id="experience"
                name="experience"
                min="0"
                max="20"
                value="5"
            >
        </div>
    </fieldset>

    <fieldset>
        <legend>Documents</legend>

        <div class="form-group">
            <label for="resume">Resume (PDF)</label>
            <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf"
                required
            >
        </div>

        <div class="form-group">
            <label for="cover">Cover Letter (optional)</label>
            <input
                type="file"
                id="cover"
                name="cover_letter"
                accept=".pdf,.doc,.docx"
            >
        </div>
    </fieldset>

    <fieldset>
        <legend>Additional Information</legend>

        <p>How did you hear about us?</p>
        <label>
            <input type="radio" name="source" value="job-board">
            Job Board
        </label>
        <label>
            <input type="radio" name="source" value="referral">
            Employee Referral
        </label>
        <label>
            <input type="radio" name="source" value="social">
            Social Media
        </label>
        <label>
            <input type="radio" name="source" value="other">
            Other
        </label>
    </fieldset>

    <button type="submit">Submit Application</button>
</form>
```

## Key Takeaways

1. **Use specific input types** - They provide validation and better UX
2. **Email, URL, tel** - Show appropriate mobile keyboards
3. **Number and range** - For numeric data with constraints
4. **Date/time inputs** - Provide native pickers (with fallbacks)
5. **File inputs need** - `enctype="multipart/form-data"` on the form
6. **Datalist** - Provides autocomplete suggestions for any input
7. **Always test on mobile** - Input types behave differently across devices

In the next lesson, we will explore form validation techniques.
