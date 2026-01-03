---
title: Building Components
order: 4
estimatedMinutes: 18
---

# Building Components

Let's build a simple component system from scratch. This will solidify your understanding of how frameworks work under the hood.

## Base Component Class

Start with a foundation that handles rendering and state:

```javascript
class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
        this.element = null;
    }

    setState(newState) {
        // Merge new state with existing state
        this.state = { ...this.state, ...newState };
        // Re-render after state change
        this.update();
    }

    update() {
        const newElement = this.createElement();
        if (this.element && this.element.parentNode) {
            this.element.parentNode.replaceChild(newElement, this.element);
        }
        this.element = newElement;
    }

    createElement() {
        // Create a temporary container
        const temp = document.createElement("div");
        temp.innerHTML = this.render().trim();
        const element = temp.firstElementChild;

        // Attach event listeners
        this.attachEvents(element);

        return element;
    }

    attachEvents(element) {
        // Override in subclass if needed
    }

    mount(container) {
        this.element = this.createElement();
        container.appendChild(this.element);
        this.onMount();
    }

    unmount() {
        if (this.element && this.element.parentNode) {
            this.onUnmount();
            this.element.parentNode.removeChild(this.element);
            this.element = null;
        }
    }

    // Lifecycle hooks - override in subclass
    onMount() {}
    onUnmount() {}

    render() {
        return "<div></div>";
    }
}
```

## Counter Component

A simple component with state:

```javascript
class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: props.initialCount || 0
        };
    }

    increment() {
        this.setState({ count: this.state.count + 1 });
    }

    decrement() {
        this.setState({ count: this.state.count - 1 });
    }

    attachEvents(element) {
        element.querySelector(".increment")
            .addEventListener("click", () => this.increment());
        element.querySelector(".decrement")
            .addEventListener("click", () => this.decrement());
    }

    render() {
        return `
            <div class="counter">
                <button class="decrement">-</button>
                <span class="count">${this.state.count}</span>
                <button class="increment">+</button>
            </div>
        `;
    }
}

// Usage
const counter = new Counter({ initialCount: 5 });
counter.mount(document.getElementById("app"));
```

## Todo List Component

A more complex component with list management:

```javascript
class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            inputValue: ""
        };
    }

    addTodo() {
        const text = this.state.inputValue.trim();
        if (!text) return;

        this.setState({
            todos: [
                ...this.state.todos,
                { id: Date.now(), text, completed: false }
            ],
            inputValue: ""
        });
    }

    toggleTodo(id) {
        this.setState({
            todos: this.state.todos.map(todo =>
                todo.id === id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        });
    }

    deleteTodo(id) {
        this.setState({
            todos: this.state.todos.filter(todo => todo.id !== id)
        });
    }

    attachEvents(element) {
        // Input handling
        const input = element.querySelector(".todo-input");
        input.addEventListener("input", (e) => {
            this.state.inputValue = e.target.value;
        });
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.addTodo();
        });

        // Add button
        element.querySelector(".add-btn")
            .addEventListener("click", () => this.addTodo());

        // Todo item events (event delegation)
        element.querySelector(".todo-list")
            .addEventListener("click", (e) => {
                const todoEl = e.target.closest(".todo-item");
                if (!todoEl) return;

                const id = parseInt(todoEl.dataset.id);

                if (e.target.classList.contains("toggle")) {
                    this.toggleTodo(id);
                } else if (e.target.classList.contains("delete")) {
                    this.deleteTodo(id);
                }
            });
    }

    render() {
        const { todos, inputValue } = this.state;

        return `
            <div class="todo-app">
                <h2>Todo List</h2>
                <div class="todo-input-container">
                    <input
                        type="text"
                        class="todo-input"
                        placeholder="Add a todo..."
                        value="${inputValue}"
                    />
                    <button class="add-btn">Add</button>
                </div>
                <ul class="todo-list">
                    ${todos.map(todo => `
                        <li class="todo-item ${todo.completed ? "completed" : ""}"
                            data-id="${todo.id}">
                            <input
                                type="checkbox"
                                class="toggle"
                                ${todo.completed ? "checked" : ""}
                            />
                            <span class="todo-text">${todo.text}</span>
                            <button class="delete">×</button>
                        </li>
                    `).join("")}
                </ul>
                <div class="todo-footer">
                    ${todos.filter(t => !t.completed).length} items remaining
                </div>
            </div>
        `;
    }
}
```

## Component with Child Components

Components can contain other components:

```javascript
class TodoItem extends Component {
    constructor(props) {
        super(props);
    }

    attachEvents(element) {
        element.querySelector(".toggle")
            .addEventListener("click", () => {
                if (this.props.onToggle) {
                    this.props.onToggle(this.props.todo.id);
                }
            });

        element.querySelector(".delete")
            .addEventListener("click", () => {
                if (this.props.onDelete) {
                    this.props.onDelete(this.props.todo.id);
                }
            });
    }

    render() {
        const { todo } = this.props;
        return `
            <li class="todo-item ${todo.completed ? "completed" : ""}">
                <input type="checkbox" class="toggle"
                    ${todo.completed ? "checked" : ""} />
                <span>${todo.text}</span>
                <button class="delete">×</button>
            </li>
        `;
    }
}

class TodoListWithChildren extends Component {
    constructor(props) {
        super(props);
        this.state = { todos: [] };
        this.todoComponents = [];
    }

    addTodo(text) {
        this.setState({
            todos: [
                ...this.state.todos,
                { id: Date.now(), text, completed: false }
            ]
        });
    }

    toggleTodo(id) {
        this.setState({
            todos: this.state.todos.map(todo =>
                todo.id === id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        });
    }

    deleteTodo(id) {
        this.setState({
            todos: this.state.todos.filter(todo => todo.id !== id)
        });
    }

    update() {
        // Clean up existing child components
        this.todoComponents.forEach(c => c.unmount());
        this.todoComponents = [];

        super.update();
    }

    onMount() {
        // Mount child components
        const list = this.element.querySelector(".todo-list");

        this.state.todos.forEach(todo => {
            const item = new TodoItem({
                todo,
                onToggle: (id) => this.toggleTodo(id),
                onDelete: (id) => this.deleteTodo(id)
            });
            item.mount(list);
            this.todoComponents.push(item);
        });
    }

    render() {
        return `
            <div class="todo-app">
                <h2>Todo List</h2>
                <ul class="todo-list"></ul>
            </div>
        `;
    }
}
```

## Component with Async Data

Handling data fetching:

```javascript
class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            error: null
        };
    }

    async onMount() {
        await this.fetchUsers();
    }

    async fetchUsers() {
        try {
            this.setState({ loading: true, error: null });

            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            if (!response.ok) throw new Error("Failed to fetch");

            const users = await response.json();
            this.setState({ users, loading: false });
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }

    render() {
        const { users, loading, error } = this.state;

        if (loading) {
            return `<div class="loading">Loading users...</div>`;
        }

        if (error) {
            return `
                <div class="error">
                    <p>Error: ${error}</p>
                    <button onclick="this.fetchUsers()">Retry</button>
                </div>
            `;
        }

        return `
            <div class="user-list">
                <h2>Users</h2>
                <ul>
                    ${users.map(user => `
                        <li class="user-item">
                            <strong>${user.name}</strong>
                            <span>${user.email}</span>
                        </li>
                    `).join("")}
                </ul>
            </div>
        `;
    }
}
```

## App Component

Compose multiple components into an app:

```javascript
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: "todos"
        };
        this.childComponents = [];
    }

    switchView(view) {
        this.setState({ currentView: view });
    }

    onMount() {
        const content = this.element.querySelector(".content");

        // Mount the appropriate view
        let view;
        switch (this.state.currentView) {
            case "todos":
                view = new TodoList();
                break;
            case "users":
                view = new UserList();
                break;
            case "counter":
                view = new Counter({ initialCount: 0 });
                break;
        }

        if (view) {
            view.mount(content);
            this.childComponents.push(view);
        }
    }

    onUnmount() {
        this.childComponents.forEach(c => c.unmount());
    }

    attachEvents(element) {
        element.querySelectorAll(".nav-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                this.switchView(btn.dataset.view);
            });
        });
    }

    render() {
        const { currentView } = this.state;

        return `
            <div class="app">
                <nav class="navbar">
                    <button class="nav-btn ${currentView === "todos" ? "active" : ""}"
                        data-view="todos">Todos</button>
                    <button class="nav-btn ${currentView === "users" ? "active" : ""}"
                        data-view="users">Users</button>
                    <button class="nav-btn ${currentView === "counter" ? "active" : ""}"
                        data-view="counter">Counter</button>
                </nav>
                <main class="content"></main>
            </div>
        `;
    }
}

// Bootstrap the app
const app = new App();
app.mount(document.getElementById("root"));
```

## Key Takeaways

1. Components encapsulate template, state, and behavior
2. `setState()` triggers re-rendering with updated data
3. Event listeners must be re-attached after rendering
4. Event delegation handles dynamic elements efficiently
5. Child components need proper lifecycle management
6. Async data requires loading and error states
7. Composition allows building complex UIs from simple parts

Congratulations! You've built a component system and understand the foundations of modern JavaScript frameworks.
