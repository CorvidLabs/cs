---
title: Switch Statements
order: 2
estimatedMinutes: 15
---

# Switch Statements

Swift's `switch` statement is far more powerful than its counterparts in other languages. It must be exhaustive, supports value binding, and works with any type - not just integers.

## Basic Switch Syntax

A switch statement compares a value against multiple patterns:

```swift
let dayNumber = 3

switch dayNumber {
case 1:
    print("Monday")
case 2:
    print("Tuesday")
case 3:
    print("Wednesday")
case 4:
    print("Thursday")
case 5:
    print("Friday")
case 6:
    print("Saturday")
case 7:
    print("Sunday")
default:
    print("Invalid day")
}
// Prints: Wednesday
```

## No Implicit Fallthrough

Unlike C and many other languages, Swift's switch cases don't fall through by default:

```swift
let number = 1

switch number {
case 1:
    print("One")
    // No need for 'break' - execution stops here automatically
case 2:
    print("Two")
default:
    print("Other")
}
// Prints: One
```

## Exhaustiveness

Switch statements must be exhaustive - they must handle every possible value:

```swift
// Error: Switch must be exhaustive
// let value = true
// switch value {
// case true:
//     print("True")
// }

// Correct: Handle all cases
let value = true
switch value {
case true:
    print("True")
case false:
    print("False")
}
```

For types with many or infinite possibilities, use `default`:

```swift
let character: Character = "a"

switch character {
case "a":
    print("The letter a")
case "z":
    print("The letter z")
default:
    print("Some other character")
}
```

## Compound Cases

Match multiple values in a single case:

```swift
let letter = "e"

switch letter {
case "a", "e", "i", "o", "u":
    print("\(letter) is a vowel")
case "b", "c", "d", "f", "g", "h", "j", "k", "l", "m",
     "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z":
    print("\(letter) is a consonant")
default:
    print("\(letter) is not a letter")
}
// Prints: e is a vowel
```

## Range Matching

Switch cases can match ranges:

```swift
let score = 85

switch score {
case 0..<60:
    print("F - Failing")
case 60..<70:
    print("D - Below Average")
case 70..<80:
    print("C - Average")
case 80..<90:
    print("B - Above Average")
case 90...100:
    print("A - Excellent")
default:
    print("Invalid score")
}
// Prints: B - Above Average
```

```swift
let age = 25

switch age {
case 0..<13:
    print("Child")
case 13..<20:
    print("Teenager")
case 20..<65:
    print("Adult")
case 65...:
    print("Senior")
default:
    print("Invalid age")
}
// Prints: Adult
```

## Switching on Strings

Swift can switch on any type, including strings:

```swift
let command = "start"

switch command {
case "start":
    print("Starting the engine...")
case "stop":
    print("Stopping the engine...")
case "pause":
    print("Pausing...")
case "resume":
    print("Resuming...")
default:
    print("Unknown command: \(command)")
}
```

## Switching on Tuples

Match multiple values simultaneously with tuples:

```swift
let coordinates = (0, 0)

switch coordinates {
case (0, 0):
    print("Origin")
case (_, 0):
    print("On the x-axis")
case (0, _):
    print("On the y-axis")
case (-2...2, -2...2):
    print("Near the origin")
default:
    print("Somewhere else")
}
// Prints: Origin
```

The underscore `_` matches any value.

## Value Binding

Extract values from the matched case:

```swift
let point = (3, 0)

switch point {
case (let x, 0):
    print("On x-axis at x = \(x)")
case (0, let y):
    print("On y-axis at y = \(y)")
case let (x, y):
    print("At point (\(x), \(y))")
}
// Prints: On x-axis at x = 3
```

## Switching on Enums

Enums and switch work perfectly together:

```swift
public enum Direction {
    case north
    case south
    case east
    case west
}

let heading = Direction.north

switch heading {
case .north:
    print("Going north")
case .south:
    print("Going south")
case .east:
    print("Going east")
case .west:
    print("Going west")
}
// Prints: Going north
```

With associated values:

```swift
public enum NetworkResponse {
    case success(data: String)
    case failure(error: String)
    case loading
}

let response = NetworkResponse.success(data: "User data loaded")

switch response {
case .success(let data):
    print("Success: \(data)")
case .failure(let error):
    print("Error: \(error)")
case .loading:
    print("Loading...")
}
// Prints: Success: User data loaded
```

## Fallthrough (When Needed)

If you need C-style fallthrough behavior, use the `fallthrough` keyword:

```swift
let number = 3

switch number {
case 3:
    print("Three")
    fallthrough
case 2:
    print("Two or less")
    fallthrough
case 1:
    print("One or less")
default:
    break
}
// Prints:
// Three
// Two or less
// One or less
```

Note: `fallthrough` skips the condition check for the next case.

## Switch as an Expression

In recent Swift versions, switch can be used as an expression:

```swift
let grade = 85

let letterGrade = switch grade {
case 90...100: "A"
case 80..<90: "B"
case 70..<80: "C"
case 60..<70: "D"
default: "F"
}

print("Grade: \(letterGrade)")  // Prints: Grade: B
```

## Empty Cases with Break

If a case should do nothing, use `break`:

```swift
let input = "ignore"

switch input {
case "ignore":
    break  // Do nothing
case "process":
    print("Processing...")
default:
    print("Unknown input")
}
```

## Key Takeaways

1. Switch statements don't fall through by default - no `break` needed
2. Switch must be exhaustive - use `default` for unhandled cases
3. Compound cases match multiple values: `case 1, 2, 3:`
4. Range matching: `case 0..<10:` or `case 10...20:`
5. Switch works with any type: strings, tuples, enums, etc.
6. Value binding extracts values: `case let (x, y):`
7. Use `fallthrough` only when explicitly needed

In the next lesson, we'll dive deeper into pattern matching.
