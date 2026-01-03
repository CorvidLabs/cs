---
title: Optional Chaining
order: 4
estimatedMinutes: 14
---

# Optional Chaining

Optional chaining is a safe way to access properties, methods, and subscripts on optionals. If any link in the chain is nil, the entire expression returns nil.

## Basic Optional Chaining

Use `?` to safely access optional members:

```swift
public class Person {
    public var residence: Residence?
}

public class Residence {
    public var address: Address?
}

public class Address {
    public var street: String = "Main St"
}

let person = Person()

// Without optional chaining - unsafe
// let street = person.residence!.address!.street  // Crash if nil!

// With optional chaining - safe
let street = person.residence?.address?.street  // nil
```

## Chaining Property Access

```swift
let person = Person()
person.residence = Residence()
person.residence?.address = Address()
person.residence?.address?.street = "Oak Avenue"

// Chain returns String? (not String)
if let street = person.residence?.address?.street {
    print("Street: \(street)")  // Street: Oak Avenue
} else {
    print("No address available")
}
```

## Chaining Method Calls

```swift
public class Person {
    public var residence: Residence?
}

public class Residence {
    public func printDetails() {
        print("Residence details")
    }

    public func getFloorCount() -> Int {
        return 2
    }
}

let person = Person()
person.residence = Residence()

// Calling method through optional chain
person.residence?.printDetails()  // Prints: Residence details

// Method with return value becomes optional
let floors: Int? = person.residence?.getFloorCount()
print(floors)  // Optional(2)
```

## Chaining Subscript Access

```swift
public class Building {
    public var floors: [Floor] = []
}

public class Floor {
    public var rooms: [String: Room] = [:]
}

public class Room {
    public var name: String

    public init(name: String) {
        self.name = name
    }
}

let building = Building()
building.floors.append(Floor())
building.floors[0].rooms["101"] = Room(name: "Conference")

// Chaining through subscripts
let roomName = building.floors.first?.rooms["101"]?.name
print(roomName)  // Optional("Conference")

// Setting through optional chain
building.floors.first?.rooms["102"] = Room(name: "Office")
```

## Chaining with Dictionaries

```swift
var config: [String: [String: Any]]? = [
    "database": [
        "host": "localhost",
        "port": 5432
    ]
]

// Access nested dictionary values
let host = config?["database"]?["host"] as? String
print(host)  // Optional("localhost")

let port = config?["database"]?["port"] as? Int
print(port)  // Optional(5432)

// Nil-coalescing for defaults
let timeout = config?["database"]?["timeout"] as? Int ?? 30
print(timeout)  // 30 (default)
```

## Multiple Levels of Optionality

```swift
public struct User {
    public var profile: Profile?
}

public struct Profile {
    public var settings: Settings?
}

public struct Settings {
    public var theme: String?
}

let user = User(
    profile: Profile(
        settings: Settings(theme: "dark")
    )
)

// Each ? adds optionality, but result is still just Optional
let theme: String? = user.profile?.settings?.theme
print(theme)  // Optional("dark")
```

## Optional Chaining as Alternative to Forced Unwrapping

```swift
public func printStreet(_ person: Person) {
    // Dangerous - crashes if any value is nil
    // print(person.residence!.address!.street)

    // Safe with optional chaining
    if let street = person.residence?.address?.street {
        print("Street: \(street)")
    } else {
        print("Unknown street")
    }
}
```

## Linking Multiple Queries

```swift
public class Company {
    public var employees: [Employee] = []

    public func findEmployee(id: Int) -> Employee? {
        employees.first { $0.id == id }
    }
}

public struct Employee {
    public let id: Int
    public var manager: Employee?
    public var department: Department?
}

public struct Department {
    public var name: String
    public var budget: Double
}

let company = Company()

// Chain method calls and property access
let managerDept = company.findEmployee(id: 1)?.manager?.department?.name
```

## Setting Values Through Optional Chain

If any link is nil, the assignment is ignored:

```swift
public class Person {
    public var residence: Residence?
}

public class Residence {
    public var address: String?
}

var person = Person()

// This does nothing - residence is nil
person.residence?.address = "New Address"
print(person.residence?.address)  // nil

// After setting residence
person.residence = Residence()
person.residence?.address = "123 Main St"
print(person.residence?.address)  // Optional("123 Main St")
```

## Combining with Guard

```swift
public func processUserSettings(_ user: User?) {
    guard let theme = user?.profile?.settings?.theme else {
        print("Using default theme")
        return
    }

    print("Using theme: \(theme)")
}
```

## Combining with Map

```swift
public struct Order {
    public var items: [Item]?
}

public struct Item {
    public var price: Double
}

let order = Order(items: [Item(price: 10), Item(price: 20)])

// Map over optional array
let prices: [Double]? = order.items?.map { $0.price }
print(prices)  // Optional([10.0, 20.0])

// Compute total
let total = order.items?.reduce(0) { $0 + $1.price }
print(total)  // Optional(30.0)
```

## Real-World Example: JSON Navigation

```swift
public struct JSONValue {
    private let value: Any?

    public init(_ value: Any?) {
        self.value = value
    }

    public subscript(key: String) -> JSONValue {
        let dict = value as? [String: Any]
        return JSONValue(dict?[key])
    }

    public subscript(index: Int) -> JSONValue {
        let array = value as? [Any]
        return JSONValue(array?[index])
    }

    public var string: String? { value as? String }
    public var int: Int? { value as? Int }
    public var double: Double? { value as? Double }
    public var bool: Bool? { value as? Bool }
}

let json = JSONValue([
    "user": [
        "name": "Alice",
        "age": 30,
        "emails": ["alice@example.com", "a@work.com"]
    ]
])

let name = json["user"]["name"].string  // Optional("Alice")
let email = json["user"]["emails"][0].string  // Optional("alice@example.com")
```

## Key Takeaways

1. Use `?` to safely access optional members
2. If any link is nil, the entire chain returns nil
3. Property types through chains become optional
4. Method return types through chains become optional
5. Setting through nil chains does nothing (no crash)
6. Combine with `if let`, `guard let`, and `??`
7. Chain subscript access with `?[key]` or `?[index]`
8. Chains flatten nested optionality (still just `T?`)

You've completed the Error Handling module! You now understand how to write robust Swift code that handles errors gracefully.
