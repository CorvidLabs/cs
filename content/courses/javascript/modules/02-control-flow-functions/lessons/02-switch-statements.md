---
title: Switch Statements
order: 2
estimatedMinutes: 12
---

# Switch Statements

When you need to compare a value against many specific options, switch statements provide a cleaner alternative to long if...else if chains.

## Basic Switch Syntax

```javascript
const day = "Monday";

switch (day) {
    case "Monday":
        console.log("Start of the work week");
        break;
    case "Tuesday":
        console.log("Second day");
        break;
    case "Wednesday":
        console.log("Midweek");
        break;
    case "Thursday":
        console.log("Almost Friday");
        break;
    case "Friday":
        console.log("TGIF!");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Weekend!");
        break;
    default:
        console.log("Invalid day");
}
```

## How Switch Works

1. The expression in `switch(expression)` is evaluated once
2. JavaScript compares the result with each `case` value using strict equality (`===`)
3. When a match is found, that code block executes
4. `break` exits the switch; without it, execution continues to the next case
5. `default` runs if no case matches (optional)

## The Importance of break

Without `break`, execution "falls through" to subsequent cases:

```javascript
const grade = "B";

// Missing break statements - problematic!
switch (grade) {
    case "A":
        console.log("Excellent");
    case "B":
        console.log("Good");
    case "C":
        console.log("Satisfactory");
    case "D":
        console.log("Needs work");
    default:
        console.log("Unknown grade");
}

// Output when grade is "B":
// Good
// Satisfactory
// Needs work
// Unknown grade
```

## Intentional Fall-Through

Sometimes fall-through is useful:

```javascript
const month = 3;
let season;

switch (month) {
    case 12:
    case 1:
    case 2:
        season = "Winter";
        break;
    case 3:
    case 4:
    case 5:
        season = "Spring";
        break;
    case 6:
    case 7:
    case 8:
        season = "Summer";
        break;
    case 9:
    case 10:
    case 11:
        season = "Fall";
        break;
    default:
        season = "Invalid month";
}

console.log(season);  // "Spring"
```

## Comparing Switch and If-Else

```javascript
const command = "start";

// Using if-else
if (command === "start") {
    console.log("Starting...");
} else if (command === "stop") {
    console.log("Stopping...");
} else if (command === "pause") {
    console.log("Pausing...");
} else if (command === "resume") {
    console.log("Resuming...");
} else {
    console.log("Unknown command");
}

// Using switch - cleaner for many cases
switch (command) {
    case "start":
        console.log("Starting...");
        break;
    case "stop":
        console.log("Stopping...");
        break;
    case "pause":
        console.log("Pausing...");
        break;
    case "resume":
        console.log("Resuming...");
        break;
    default:
        console.log("Unknown command");
}
```

## Switch with Expressions

The switch expression can be any expression:

```javascript
const score = 85;

switch (true) {
    case score >= 90:
        console.log("A");
        break;
    case score >= 80:
        console.log("B");
        break;
    case score >= 70:
        console.log("C");
        break;
    case score >= 60:
        console.log("D");
        break;
    default:
        console.log("F");
}
```

This pattern compares `true` against each case expression result.

## Block Scope in Switch Cases

To declare variables inside cases, use blocks:

```javascript
const action = "create";

switch (action) {
    case "create": {
        const message = "Creating new item";
        console.log(message);
        break;
    }
    case "delete": {
        const message = "Deleting item";
        console.log(message);
        break;
    }
    default: {
        const message = "Unknown action";
        console.log(message);
    }
}
```

Without blocks, you'd get a syntax error for redeclaring `message`.

## Switch vs. Object Lookup

For simple value mappings, objects can be cleaner:

```javascript
const status = "active";

// Using switch
let color;
switch (status) {
    case "active":
        color = "green";
        break;
    case "pending":
        color = "yellow";
        break;
    case "inactive":
        color = "gray";
        break;
    default:
        color = "black";
}

// Using object lookup - often cleaner
const statusColors = {
    active: "green",
    pending: "yellow",
    inactive: "gray"
};

const color2 = statusColors[status] ?? "black";
console.log(color2);  // "green"
```

## When to Use Switch

Use switch when:
- Comparing one value against multiple specific values
- You have more than 3-4 cases
- Cases might need fall-through behavior

Use if-else when:
- You have complex conditions (ranges, multiple variables)
- You only have 2-3 simple conditions
- Conditions involve comparisons other than equality

## Key Takeaways

1. Switch compares a value against multiple cases using strict equality
2. Always use `break` unless you intentionally want fall-through
3. Group cases together for shared behavior
4. `default` handles unmatched cases
5. Use block scope `{ }` when declaring variables inside cases
6. Consider object lookups for simple value mappings

Next, we'll learn about functions - the building blocks for organizing and reusing code.
