---
title: Actors
order: 3
estimatedMinutes: 15
---

# Actors for Safe Concurrent State

Actors protect mutable state from data races. They ensure only one task accesses their state at a time.

## What is a Data Race?

A data race occurs when multiple tasks access the same mutable state simultaneously:

```swift
// DANGEROUS - data race possible
class Counter {
    var count = 0

    func increment() {
        count += 1  // Read and write not atomic
    }
}
```

If two tasks call `increment()` simultaneously, the count could be wrong.

## Introducing Actors

Actors serialize access to their state:

```swift
actor Counter {
    private var count = 0

    func increment() {
        count += 1  // Safe - only one caller at a time
    }

    func getCount() -> Int {
        count
    }
}
```

## Calling Actor Methods

Actor methods require `await` when called from outside:

```swift
let counter = Counter()

await counter.increment()
let value = await counter.getCount()
print("Count: \(value)")
```

## Actor Isolation

Code inside an actor doesn't need `await` for its own methods:

```swift
actor BankAccount {
    private var balance: Double = 0

    func deposit(_ amount: Double) {
        balance += amount  // No await needed
    }

    func withdraw(_ amount: Double) -> Bool {
        guard balance >= amount else { return false }
        balance -= amount
        return true
    }

    func transfer(to other: BankAccount, amount: Double) async -> Bool {
        guard withdraw(amount) else { return false }
        await other.deposit(amount)  // await needed for other actor
        return true
    }
}
```

## Non-Isolated Methods

Methods that don't access mutable state can be `nonisolated`:

```swift
actor UserService {
    private var cache: [String: User] = [:]

    nonisolated func generateID() -> String {
        UUID().uuidString  // Doesn't access actor state
    }

    func getUser(id: String) -> User? {
        cache[id]
    }
}

// Can call without await
let service = UserService()
let id = service.generateID()  // No await needed
```

## Actor Reentrancy

Actors are reentrant - state can change during `await`:

```swift
actor ImageCache {
    private var cache: [URL: Image] = [:]

    func getImage(for url: URL) async throws -> Image {
        if let cached = cache[url] {
            return cached
        }

        let image = try await downloadImage(url)
        // ^^^ Another call could modify cache here

        cache[url] = image  // Previous cache entry might exist now
        return image
    }
}
```

Always check state after awaits when it matters.

## Global Actors

Mark types or functions to run on a specific actor:

```swift
@globalActor
actor DatabaseActor {
    static let shared = DatabaseActor()
}

@DatabaseActor
class DatabaseManager {
    func query(_ sql: String) -> [Row] {
        // Always runs on DatabaseActor
    }
}
```

## The Main Actor

`@MainActor` ensures code runs on the main thread:

```swift
@MainActor
class ViewController {
    var titleLabel: UILabel?

    func updateTitle(_ text: String) {
        titleLabel?.text = text  // Safe - always on main thread
    }
}
```

## MainActor.run

Run specific code on the main actor:

```swift
func fetchAndDisplay() async throws {
    let data = try await fetchData()

    await MainActor.run {
        updateUI(with: data)
    }
}
```

## Actor-Isolated Properties

Properties can be actor-isolated:

```swift
actor Settings {
    var theme: Theme = .light
    var fontSize: Int = 14

    nonisolated let appVersion = "1.0.0"  // Not isolated
}

let settings = Settings()
print(settings.appVersion)  // No await - nonisolated

let theme = await settings.theme  // await required
```

## Actors vs Classes

| Aspect | Class | Actor |
|--------|-------|-------|
| Reference type | Yes | Yes |
| Inheritance | Yes | No |
| Concurrent access | Unsafe | Safe |
| External access | Direct | Requires await |

## When to Use Actors

Use actors when:
- Multiple tasks access shared mutable state
- You need thread-safe caches
- Managing resources that need serialized access
- Coordinating between concurrent operations

Don't use actors when:
- State is immutable (use structs)
- Only accessed from one task
- Performance is critical and you can guarantee single-threaded access

## Key Takeaways

1. Actors protect mutable state from data races
2. External access to actor methods/properties requires `await`
3. Code inside an actor doesn't need `await` for its own state
4. Use `nonisolated` for methods that don't access mutable state
5. `@MainActor` ensures code runs on the main thread
6. Actors are reentrant - check state after awaits

Next, we'll explore `Sendable` for data race safety.
