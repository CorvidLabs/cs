---
title: SwiftUI Basics
order: 1
estimatedMinutes: 15
---

# Introduction to SwiftUI

SwiftUI is Apple's modern framework for building user interfaces declaratively. Instead of describing *how* to update the UI step by step, you describe *what* the UI should look like for a given state.

## Your First SwiftUI View

Every SwiftUI view conforms to the `View` protocol:

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Hello, SwiftUI!")
    }
}
```

The `body` property returns the view's content. `some View` is an opaque return type that means "some specific type conforming to View."

## Text Views

Display text with the `Text` view:

```swift
struct GreetingView: View {
    var body: some View {
        Text("Welcome to SwiftUI")
            .font(.title)
            .foregroundStyle(.blue)
            .bold()
    }
}
```

Modifiers chain to customize appearance:
- `.font()` - sets the font style
- `.foregroundStyle()` - sets the text color
- `.bold()` - makes text bold

## Images

Display images from assets or SF Symbols:

```swift
struct IconView: View {
    var body: some View {
        Image(systemName: "star.fill")
            .font(.largeTitle)
            .foregroundStyle(.yellow)
    }
}
```

SF Symbols provide thousands of configurable icons.

## Stacks for Layout

Arrange views with stacks:

```swift
struct ProfileView: View {
    var body: some View {
        VStack {
            Image(systemName: "person.circle.fill")
                .font(.system(size: 60))
            Text("John Doe")
                .font(.headline)
            Text("iOS Developer")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
    }
}
```

Stack types:
- `VStack` - vertical arrangement
- `HStack` - horizontal arrangement
- `ZStack` - overlapping layers

## Stack Spacing and Alignment

Customize stack behavior:

```swift
VStack(alignment: .leading, spacing: 16) {
    Text("Title")
    Text("Subtitle")
    Text("Description")
}
```

Alignment options: `.leading`, `.center`, `.trailing` for VStack.

## Buttons

Create interactive buttons:

```swift
struct ButtonView: View {
    var body: some View {
        Button("Tap Me") {
            print("Button tapped!")
        }
        .buttonStyle(.borderedProminent)
    }
}
```

Or with custom content:

```swift
Button(action: {
    print("Custom button tapped!")
}) {
    HStack {
        Image(systemName: "heart.fill")
        Text("Like")
    }
    .padding()
    .background(.pink)
    .foregroundStyle(.white)
    .clipShape(RoundedRectangle(cornerRadius: 10))
}
```

## Spacer and Padding

Control spacing:

```swift
struct SpacedView: View {
    var body: some View {
        VStack {
            Text("Top")
            Spacer()  // Pushes content apart
            Text("Bottom")
        }
        .padding()  // Adds space around edges
    }
}
```

## Common Modifiers

Style views with modifiers:

```swift
Text("Styled Text")
    .padding()                          // Add padding
    .background(.blue)                  // Background color
    .foregroundStyle(.white)            // Text color
    .clipShape(RoundedRectangle(cornerRadius: 8))  // Shape
    .shadow(radius: 4)                  // Add shadow
```

## Frames and Sizing

Control view size:

```swift
Rectangle()
    .fill(.blue)
    .frame(width: 100, height: 100)

Text("Flexible")
    .frame(maxWidth: .infinity)  // Expand to fill width
```

## Previews

Preview your views in Xcode:

```swift
#Preview {
    ContentView()
}

// Or with custom configuration
#Preview("Dark Mode") {
    ContentView()
        .preferredColorScheme(.dark)
}
```

## View Composition

Combine views to build complex UIs:

```swift
struct CardView: View {
    var body: some View {
        VStack(alignment: .leading) {
            Image(systemName: "photo")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(height: 150)

            VStack(alignment: .leading, spacing: 4) {
                Text("Card Title")
                    .font(.headline)
                Text("Card description goes here")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            .padding()
        }
        .background(.white)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .shadow(radius: 4)
    }
}
```

## Key Takeaways

1. SwiftUI uses declarative syntax - describe what, not how
2. Views conform to the `View` protocol with a `body` property
3. Use stacks (`VStack`, `HStack`, `ZStack`) for layout
4. Chain modifiers to customize appearance
5. Use `Spacer` and `padding` to control spacing
6. Compose small views into complex interfaces

Next, we'll learn how to manage state in SwiftUI views.
