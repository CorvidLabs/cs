---
title: Lists and Navigation
order: 4
estimatedMinutes: 15
---

# Lists and Navigation in SwiftUI

SwiftUI makes it easy to create scrollable lists and multi-screen navigation. Let's explore these essential patterns.

## Basic List

Create scrollable lists:

```swift
struct SimpleList: View {
    let fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"]

    var body: some View {
        List(fruits, id: \.self) { fruit in
            Text(fruit)
        }
    }
}
```

## List with Identifiable Data

Use `Identifiable` for automatic ID handling:

```swift
struct Task: Identifiable {
    let id = UUID()
    let title: String
    let isCompleted: Bool
}

struct TaskListView: View {
    let tasks: [Task]

    var body: some View {
        List(tasks) { task in
            HStack {
                Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                Text(task.title)
            }
        }
    }
}
```

## List Styles

Customize list appearance:

```swift
List {
    Text("Item 1")
    Text("Item 2")
}
.listStyle(.plain)          // No separators or backgrounds
// .listStyle(.inset)       // Inset from edges
// .listStyle(.grouped)     // Grouped sections
// .listStyle(.insetGrouped) // iOS settings style
```

## Sections

Organize content into sections:

```swift
struct ContactsView: View {
    var body: some View {
        List {
            Section("Favorites") {
                Text("Alice")
                Text("Bob")
            }

            Section("All Contacts") {
                Text("Charlie")
                Text("Diana")
                Text("Eve")
            }
        }
    }
}
```

## Swipe Actions

Add swipe gestures to rows:

```swift
struct SwipeableList: View {
    @State private var items = ["Item 1", "Item 2", "Item 3"]

    var body: some View {
        List {
            ForEach(items, id: \.self) { item in
                Text(item)
                    .swipeActions(edge: .trailing) {
                        Button(role: .destructive) {
                            items.removeAll { $0 == item }
                        } label: {
                            Label("Delete", systemImage: "trash")
                        }
                    }
                    .swipeActions(edge: .leading) {
                        Button {
                            // Pin action
                        } label: {
                            Label("Pin", systemImage: "pin")
                        }
                        .tint(.orange)
                    }
            }
        }
    }
}
```

## NavigationStack

Create navigation hierarchies:

```swift
struct MainView: View {
    var body: some View {
        NavigationStack {
            List {
                NavigationLink("Profile") {
                    ProfileDetailView()
                }
                NavigationLink("Settings") {
                    SettingsView()
                }
            }
            .navigationTitle("Home")
        }
    }
}
```

## NavigationLink with Data

Navigate with data:

```swift
struct Recipe: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let ingredients: [String]
}

struct RecipeListView: View {
    let recipes: [Recipe]

    var body: some View {
        NavigationStack {
            List(recipes) { recipe in
                NavigationLink(value: recipe) {
                    Text(recipe.name)
                }
            }
            .navigationTitle("Recipes")
            .navigationDestination(for: Recipe.self) { recipe in
                RecipeDetailView(recipe: recipe)
            }
        }
    }
}

struct RecipeDetailView: View {
    let recipe: Recipe

    var body: some View {
        List(recipe.ingredients, id: \.self) { ingredient in
            Text(ingredient)
        }
        .navigationTitle(recipe.name)
    }
}
```

## Programmatic Navigation

Control navigation from code:

```swift
struct ProgrammaticNavigation: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            VStack {
                Button("Go to Settings") {
                    path.append("settings")
                }

                Button("Go Deep") {
                    path.append("profile")
                    path.append("edit")
                }
            }
            .navigationDestination(for: String.self) { destination in
                Text("Destination: \(destination)")
            }
        }
    }
}
```

## Sheets and Full Screen Covers

Present modal views:

```swift
struct ModalExample: View {
    @State private var showSheet = false
    @State private var showFullScreen = false

    var body: some View {
        VStack(spacing: 20) {
            Button("Show Sheet") {
                showSheet = true
            }

            Button("Show Full Screen") {
                showFullScreen = true
            }
        }
        .sheet(isPresented: $showSheet) {
            SheetContent()
        }
        .fullScreenCover(isPresented: $showFullScreen) {
            FullScreenContent()
        }
    }
}

struct SheetContent: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            Text("Sheet Content")
                .toolbar {
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Done") { dismiss() }
                    }
                }
        }
    }
}
```

## Toolbar

Add toolbar items:

```swift
struct ToolbarExample: View {
    var body: some View {
        NavigationStack {
            Text("Content")
                .navigationTitle("Title")
                .toolbar {
                    ToolbarItem(placement: .primaryAction) {
                        Button("Add", systemImage: "plus") { }
                    }

                    ToolbarItem(placement: .bottomBar) {
                        Button("Share", systemImage: "square.and.arrow.up") { }
                    }
                }
        }
    }
}
```

## Search

Add searchable content:

```swift
struct SearchableList: View {
    @State private var searchText = ""
    let items = ["Apple", "Banana", "Cherry", "Date"]

    var filteredItems: [String] {
        if searchText.isEmpty {
            return items
        }
        return items.filter { $0.localizedCaseInsensitiveContains(searchText) }
    }

    var body: some View {
        NavigationStack {
            List(filteredItems, id: \.self) { item in
                Text(item)
            }
            .navigationTitle("Fruits")
            .searchable(text: $searchText, prompt: "Search fruits")
        }
    }
}
```

## Key Takeaways

1. Use `List` for scrollable content with built-in styling
2. Make data types `Identifiable` for easy list binding
3. Use `Section` to organize list content
4. `NavigationStack` enables multi-screen navigation
5. Use `.sheet` and `.fullScreenCover` for modal presentation
6. Add `.searchable` for built-in search functionality

Congratulations! You've learned the fundamentals of SwiftUI. Practice building complete apps by combining these concepts.
