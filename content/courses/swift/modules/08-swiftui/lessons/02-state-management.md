---
title: State Management
order: 2
estimatedMinutes: 15
---

# State Management in SwiftUI

SwiftUI's state management system automatically keeps your UI in sync with your data. When state changes, the view updates automatically.

## @State for Local State

Use `@State` for simple values owned by a view:

```swift
struct CounterView: View {
    @State private var count = 0

    var body: some View {
        VStack {
            Text("Count: \(count)")
                .font(.largeTitle)

            Button("Increment") {
                count += 1
            }
        }
    }
}
```

Key points:
- Always mark `@State` properties as `private`
- SwiftUI manages the storage
- Changes trigger view updates

## Two-Way Binding with $

Use `$` to create a binding:

```swift
struct TextInputView: View {
    @State private var name = ""

    var body: some View {
        VStack {
            TextField("Enter name", text: $name)
                .textFieldStyle(.roundedBorder)

            Text("Hello, \(name)!")
        }
        .padding()
    }
}
```

The `$name` binding allows `TextField` to read and write the value.

## @Binding for Shared State

Pass state to child views with `@Binding`:

```swift
struct ToggleRow: View {
    let title: String
    @Binding var isOn: Bool

    var body: some View {
        HStack {
            Text(title)
            Spacer()
            Toggle("", isOn: $isOn)
        }
    }
}

struct SettingsView: View {
    @State private var notificationsEnabled = true
    @State private var darkModeEnabled = false

    var body: some View {
        VStack {
            ToggleRow(title: "Notifications", isOn: $notificationsEnabled)
            ToggleRow(title: "Dark Mode", isOn: $darkModeEnabled)
        }
        .padding()
    }
}
```

## @StateObject for Reference Types

Use `@StateObject` for observable classes:

```swift
@Observable
class UserSettings {
    var username = ""
    var email = ""
    var isPremium = false
}

struct ProfileView: View {
    @State private var settings = UserSettings()

    var body: some View {
        Form {
            TextField("Username", text: $settings.username)
            TextField("Email", text: $settings.email)
            Toggle("Premium", isOn: $settings.isPremium)
        }
    }
}
```

Note: With the `@Observable` macro (iOS 17+), use `@State` instead of `@StateObject`.

## @Environment for System Values

Access environment values:

```swift
struct AdaptiveView: View {
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.horizontalSizeClass) var sizeClass

    var body: some View {
        Text("Current theme: \(colorScheme == .dark ? "Dark" : "Light")")
    }
}
```

Common environment values:
- `.colorScheme` - light/dark mode
- `.horizontalSizeClass` - compact/regular
- `.dismiss` - dismiss presentation

## Dismiss Action

Dismiss sheets and navigation:

```swift
struct DetailView: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        VStack {
            Text("Detail View")
            Button("Close") {
                dismiss()
            }
        }
    }
}
```

## Computed Properties with State

Derive values from state:

```swift
struct FormView: View {
    @State private var email = ""
    @State private var password = ""

    var isFormValid: Bool {
        !email.isEmpty && password.count >= 8
    }

    var body: some View {
        Form {
            TextField("Email", text: $email)
            SecureField("Password", text: $password)

            Button("Submit") {
                // Submit form
            }
            .disabled(!isFormValid)
        }
    }
}
```

## onChange Modifier

React to state changes:

```swift
struct SearchView: View {
    @State private var searchText = ""

    var body: some View {
        TextField("Search", text: $searchText)
            .onChange(of: searchText) { oldValue, newValue in
                print("Search changed from \(oldValue) to \(newValue)")
                performSearch(newValue)
            }
    }

    func performSearch(_ query: String) {
        // Search logic
    }
}
```

## task Modifier for Async Work

Load data when view appears:

```swift
struct UserProfileView: View {
    @State private var user: User?
    @State private var isLoading = true

    var body: some View {
        Group {
            if isLoading {
                ProgressView()
            } else if let user = user {
                Text("Welcome, \(user.name)")
            }
        }
        .task {
            user = try? await fetchUser()
            isLoading = false
        }
    }
}
```

The `.task` modifier cancels automatically when the view disappears.

## State Flow Summary

| Wrapper | Use Case |
|---------|----------|
| `@State` | Simple values owned by view |
| `@Binding` | Passed from parent view |
| `@Environment` | System-provided values |
| `@Observable` class + `@State` | Complex model objects |

## Key Takeaways

1. `@State` manages local, simple state
2. Use `$` prefix to create bindings
3. `@Binding` passes state to child views
4. `@Environment` accesses system values
5. Use `.onChange` to react to state changes
6. Use `.task` for async data loading

Next, we'll explore view composition and reusable components.
