---
title: State Management
order: 2
estimatedMinutes: 17
---

# State Management

State is data that changes over time and affects what your application displays. Managing state effectively is one of the most important aspects of building interactive applications.

## What Is State?

State represents the current condition of your application:

```javascript
// UI state
const uiState = {
    isMenuOpen: false,
    activeTab: "profile",
    isLoading: true
};

// Data state
const dataState = {
    users: [],
    currentUser: null,
    posts: []
};

// Form state
const formState = {
    values: { name: "", email: "" },
    errors: {},
    isSubmitting: false
};
```

## Local State

State owned by a single component:

```javascript
class Toggle {
    constructor() {
        this.state = { isOn: false };
    }

    toggle() {
        this.setState({ isOn: !this.state.isOn });
    }

    render() {
        return `
            <button onclick="this.toggle()">
                ${this.state.isOn ? "ON" : "OFF"}
            </button>
        `;
    }
}
```

Use local state for:
- Form input values
- UI toggles (dropdowns, modals)
- Component-specific data

## Lifting State Up

When multiple components need the same state, lift it to their common parent:

```javascript
// Before: Each component has its own state
class TemperatureInput {
    constructor() {
        this.state = { temperature: "" };
    }
}

// After: Parent owns the state
class Calculator {
    constructor() {
        this.state = { temperature: "", scale: "c" };
    }

    handleCelsiusChange(temp) {
        this.setState({ temperature: temp, scale: "c" });
    }

    handleFahrenheitChange(temp) {
        this.setState({ temperature: temp, scale: "f" });
    }

    render() {
        const { temperature, scale } = this.state;
        const celsius = scale === "f" ? toFahrenheit(temperature) : temperature;
        const fahrenheit = scale === "c" ? toCelsius(temperature) : temperature;

        return `
            <TemperatureInput
                scale="c"
                temperature="${celsius}"
                onTemperatureChange="${this.handleCelsiusChange}"
            />
            <TemperatureInput
                scale="f"
                temperature="${fahrenheit}"
                onTemperatureChange="${this.handleFahrenheitChange}"
            />
        `;
    }
}
```

## State Immutability

Never mutate state directly - always create new objects:

```javascript
// BAD - mutating state
this.state.items.push(newItem);
this.state.user.name = "Alice";

// GOOD - creating new state
this.setState({
    items: [...this.state.items, newItem]
});

this.setState({
    user: { ...this.state.user, name: "Alice" }
});
```

Why immutability matters:
- Predictable updates
- Easy change detection
- Undo/redo support
- Debugging (time-travel)

## Centralized State Store

For complex apps, manage state in a central store:

```javascript
class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

// Usage
const store = new Store({
    user: null,
    todos: [],
    theme: "light"
});

// Subscribe to changes
store.subscribe(state => {
    console.log("State changed:", state);
    renderApp(state);
});

// Update state
store.setState({ user: { name: "Alice" } });
```

## Actions and Reducers

Structure state updates with actions and reducers:

```javascript
// Actions describe what happened
const actions = {
    ADD_TODO: "ADD_TODO",
    TOGGLE_TODO: "TOGGLE_TODO",
    DELETE_TODO: "DELETE_TODO"
};

// Action creators
function addTodo(text) {
    return { type: actions.ADD_TODO, payload: { text } };
}

function toggleTodo(id) {
    return { type: actions.TOGGLE_TODO, payload: { id } };
}

// Reducer handles state transitions
function todoReducer(state, action) {
    switch (action.type) {
        case actions.ADD_TODO:
            return {
                ...state,
                todos: [
                    ...state.todos,
                    {
                        id: Date.now(),
                        text: action.payload.text,
                        completed: false
                    }
                ]
            };

        case actions.TOGGLE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            };

        case actions.DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter(
                    todo => todo.id !== action.payload.id
                )
            };

        default:
            return state;
    }
}
```

## Store with Reducers

```javascript
class Store {
    constructor(reducer, initialState) {
        this.reducer = reducer;
        this.state = initialState;
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    dispatch(action) {
        this.state = this.reducer(this.state, action);
        this.listeners.forEach(listener => listener(this.state));
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}

// Usage
const store = new Store(todoReducer, { todos: [] });

store.subscribe(state => {
    console.log("Todos:", state.todos);
});

store.dispatch(addTodo("Learn state management"));
store.dispatch(addTodo("Build an app"));
store.dispatch(toggleTodo(store.getState().todos[0].id));
```

## Derived State

Compute values from state rather than storing them:

```javascript
class TodoList {
    constructor() {
        this.state = {
            todos: [],
            filter: "all" // "all", "active", "completed"
        };
    }

    // Derived state - computed from existing state
    get filteredTodos() {
        switch (this.state.filter) {
            case "active":
                return this.state.todos.filter(t => !t.completed);
            case "completed":
                return this.state.todos.filter(t => t.completed);
            default:
                return this.state.todos;
        }
    }

    get completedCount() {
        return this.state.todos.filter(t => t.completed).length;
    }

    get remainingCount() {
        return this.state.todos.filter(t => !t.completed).length;
    }
}
```

## Async State

Handle loading states for async operations:

```javascript
class UserList {
    constructor() {
        this.state = {
            users: [],
            loading: false,
            error: null
        };
    }

    async fetchUsers() {
        this.setState({ loading: true, error: null });

        try {
            const response = await fetch("/api/users");
            if (!response.ok) throw new Error("Failed to fetch");
            const users = await response.json();
            this.setState({ users, loading: false });
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }

    render() {
        const { users, loading, error } = this.state;

        if (loading) return `<Spinner />`;
        if (error) return `<Error message="${error}" />`;

        return `
            <ul>
                ${users.map(user => `<li>${user.name}</li>`).join("")}
            </ul>
        `;
    }
}
```

## State Persistence

Save state to survive page reloads:

```javascript
class PersistentStore {
    constructor(key, initialState) {
        this.key = key;
        this.state = this.load() || initialState;
        this.listeners = [];
    }

    load() {
        try {
            const saved = localStorage.getItem(this.key);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    }

    save() {
        localStorage.setItem(this.key, JSON.stringify(this.state));
    }

    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.save();
        this.notify();
    }

    // ... rest of store implementation
}
```

## Key Takeaways

1. State is data that changes and affects the UI
2. Local state belongs to a single component
3. Lift state up when multiple components need it
4. Never mutate state directly - use immutable updates
5. Centralized stores help manage complex state
6. Actions describe changes, reducers apply them
7. Derive computed values instead of storing them
8. Handle loading, success, and error states for async operations

Next, we'll explore reactivity patterns.
