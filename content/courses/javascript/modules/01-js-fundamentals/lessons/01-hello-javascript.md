---
title: Hello, JavaScript!
order: 1
estimatedMinutes: 12
---

# Your First JavaScript Program

JavaScript is the language of the web. Every modern browser can run JavaScript, making it one of the most accessible programming languages to learn. Let's start with the classic first program.

## The console.log() Function

JavaScript's `console.log()` function outputs messages to the browser's developer console:

```javascript
console.log("Hello, World!");
```

When you run this code, you'll see:

```
Hello, World!
```

## Running JavaScript

There are several ways to run JavaScript:

### 1. Browser Developer Console

1. Open any web browser (Chrome, Firefox, Safari, Edge)
2. Press `F12` or right-click and select "Inspect"
3. Click the "Console" tab
4. Type your JavaScript code and press Enter

### 2. HTML Script Tag

Create an HTML file and include JavaScript:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First JavaScript</title>
</head>
<body>
    <script>
        console.log("Hello from HTML!");
    </script>
</body>
</html>
```

### 3. External JavaScript File

Create a separate `.js` file and link it:

```html
<!-- index.html -->
<script src="script.js"></script>
```

```javascript
// script.js
console.log("Hello from external file!");
```

### 4. Node.js or Bun

For server-side JavaScript, use a runtime like Node.js or Bun:

```bash
# Create a file called hello.js, then run:
bun hello.js
# or
node hello.js
```

## Strings in JavaScript

You can use single quotes, double quotes, or backticks for strings:

```javascript
console.log('Single quotes');
console.log("Double quotes");
console.log(`Backticks (template literals)`);
```

All three produce text output. Template literals (backticks) have special features we'll explore later.

## Multiple console.log() Statements

Each `console.log()` outputs on a new line:

```javascript
console.log("First line");
console.log("Second line");
console.log("Third line");
```

Output:
```
First line
Second line
Third line
```

## Comments

Comments help explain your code and are ignored when running:

```javascript
// This is a single-line comment

console.log("This runs!"); // Comments can go at the end of lines

/*
  This is a multi-line comment.
  It can span multiple lines.
  Useful for longer explanations.
*/
```

## Logging Multiple Values

`console.log()` can accept multiple arguments:

```javascript
console.log("Name:", "Alice");
console.log("Age:", 25);
console.log("Values:", 1, 2, 3, 4, 5);
```

Output:
```
Name: Alice
Age: 25
Values: 1 2 3 4 5
```

## Other Console Methods

The console has additional useful methods:

```javascript
console.log("Regular message");      // Standard output
console.warn("Warning message");     // Yellow warning
console.error("Error message");      // Red error
console.info("Info message");        // Informational
console.table([1, 2, 3]);            // Display as table
```

## Try It Yourself

Experiment with different messages. Try:
- Printing your name
- Printing multiple lines
- Using different quote styles
- Adding comments to explain your code

## Key Takeaways

1. `console.log()` displays output to the browser console
2. JavaScript can run in browsers, HTML files, or server runtimes
3. Strings can use single quotes, double quotes, or backticks
4. Comments use `//` for single lines or `/* */` for multiple lines
5. `console.log()` can accept multiple comma-separated values

You've written your first JavaScript program! In the next lesson, we'll learn how to store and work with data using variables.
