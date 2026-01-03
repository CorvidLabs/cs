---
title: View Composition
order: 3
estimatedMinutes: 15
---

# View Composition in SwiftUI

SwiftUI encourages building complex interfaces by composing small, reusable views. This makes code more maintainable and easier to test.

## Extracting Subviews

Break large views into smaller components:

```swift
// Before: One large view
struct ProfileView: View {
    var body: some View {
        VStack {
            Image(systemName: "person.circle.fill")
                .font(.system(size: 80))
                .foregroundStyle(.blue)
            Text("John Doe")
                .font(.title)
            Text("iOS Developer")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
    }
}

// After: Composed views
struct ProfileView: View {
    var body: some View {
        VStack {
            ProfileImage()
            ProfileInfo(name: "John Doe", title: "iOS Developer")
        }
    }
}

struct ProfileImage: View {
    var body: some View {
        Image(systemName: "person.circle.fill")
            .font(.system(size: 80))
            .foregroundStyle(.blue)
    }
}

struct ProfileInfo: View {
    let name: String
    let title: String

    var body: some View {
        VStack {
            Text(name)
                .font(.title)
            Text(title)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
    }
}
```

## Passing Data to Subviews

Use properties to configure reusable views:

```swift
struct Badge: View {
    let text: String
    let color: Color

    var body: some View {
        Text(text)
            .font(.caption)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color)
            .foregroundStyle(.white)
            .clipShape(Capsule())
    }
}

// Usage
HStack {
    Badge(text: "New", color: .blue)
    Badge(text: "Sale", color: .red)
    Badge(text: "Popular", color: .green)
}
```

## ViewBuilder for Custom Containers

Create views that accept content:

```swift
struct Card<Content: View>: View {
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading) {
            content
        }
        .padding()
        .background(.white)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .shadow(radius: 4)
    }
}

// Usage
Card {
    Text("Card Title")
        .font(.headline)
    Text("Card content goes here")
        .foregroundStyle(.secondary)
}
```

## View Extensions for Reusable Modifiers

Package common modifier combinations:

```swift
extension View {
    func cardStyle() -> some View {
        self
            .padding()
            .background(.white)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .shadow(radius: 4)
    }

    func primaryButton() -> some View {
        self
            .padding()
            .frame(maxWidth: .infinity)
            .background(.blue)
            .foregroundStyle(.white)
            .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}

// Usage
VStack {
    Text("Content")
}
.cardStyle()

Button("Submit") { }
    .primaryButton()
```

## Conditional Views

Show views conditionally:

```swift
struct StatusView: View {
    let isOnline: Bool

    var body: some View {
        HStack {
            Circle()
                .fill(isOnline ? .green : .gray)
                .frame(width: 10, height: 10)
            Text(isOnline ? "Online" : "Offline")
        }
    }
}

struct ConditionalContent: View {
    @State private var showDetails = false

    var body: some View {
        VStack {
            Button("Toggle Details") {
                showDetails.toggle()
            }

            if showDetails {
                Text("Here are the details...")
            }
        }
    }
}
```

## Group for Multiple Views

Return multiple views without a container:

```swift
struct InfoRows: View {
    var body: some View {
        Group {
            InfoRow(label: "Name", value: "John")
            InfoRow(label: "Email", value: "john@example.com")
            InfoRow(label: "Phone", value: "555-1234")
        }
    }
}
```

## ForEach for Dynamic Content

Generate views from collections:

```swift
struct TagList: View {
    let tags: [String]

    var body: some View {
        HStack {
            ForEach(tags, id: \.self) { tag in
                Badge(text: tag, color: .blue)
            }
        }
    }
}

// With identifiable data
struct User: Identifiable {
    let id: UUID
    let name: String
}

struct UserList: View {
    let users: [User]

    var body: some View {
        VStack {
            ForEach(users) { user in
                Text(user.name)
            }
        }
    }
}
```

## Custom View Modifiers

Create reusable modifiers:

```swift
struct RoundedBorder: ViewModifier {
    let color: Color
    let width: CGFloat

    func body(content: Content) -> some View {
        content
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(color, lineWidth: width)
            )
    }
}

extension View {
    func roundedBorder(color: Color = .gray, width: CGFloat = 1) -> some View {
        modifier(RoundedBorder(color: color, width: width))
    }
}

// Usage
TextField("Email", text: $email)
    .padding()
    .roundedBorder(color: .blue, width: 2)
```

## Preference Keys for Child-to-Parent Communication

Pass data from child to parent:

```swift
struct SizePreferenceKey: PreferenceKey {
    static var defaultValue: CGSize = .zero
    static func reduce(value: inout CGSize, nextValue: () -> CGSize) {
        value = nextValue()
    }
}

struct MeasuredView: View {
    @State private var childSize: CGSize = .zero

    var body: some View {
        VStack {
            Text("Child size: \(Int(childSize.width)) x \(Int(childSize.height))")

            Text("Measured Text")
                .background(
                    GeometryReader { geometry in
                        Color.clear.preference(
                            key: SizePreferenceKey.self,
                            value: geometry.size
                        )
                    }
                )
        }
        .onPreferenceChange(SizePreferenceKey.self) { size in
            childSize = size
        }
    }
}
```

## Key Takeaways

1. Extract subviews to improve readability
2. Use properties to make views configurable
3. Create custom containers with `@ViewBuilder`
4. Package modifiers in view extensions
5. Use `ForEach` for dynamic content
6. Create custom `ViewModifier` for reusable styling

Next, we'll explore lists and navigation in SwiftUI.
