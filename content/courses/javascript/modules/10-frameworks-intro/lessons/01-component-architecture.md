---
title: Component-Based Architecture
order: 1
estimatedMinutes: 16
---

# Component-Based Architecture

Modern web frameworks like React, Vue, and Angular are built on the concept of components - self-contained, reusable pieces of UI. Understanding this architecture is fundamental to modern web development.

## What Is a Component?

A component is a self-contained unit that combines:
- **Template/Structure** - The HTML markup
- **Logic** - JavaScript behavior
- **Styles** - CSS styling (optional)

```javascript
// Conceptual component structure
const Button = {
    template: `<button class="btn">Click me</button>`,
    styles: `.btn { background: blue; color: white; }`,
    logic: {
        onClick() {
            console.log("Button clicked!");
        }
    }
};
```

## Why Components?

### 1. Reusability

Write once, use everywhere:

```javascript
// Without components - repetitive HTML
<button class="btn primary" onclick="handleClick1()">Save</button>
<button class="btn primary" onclick="handleClick2()">Submit</button>
<button class="btn primary" onclick="handleClick3()">Send</button>

// With components - reusable
<Button onClick={handleClick1}>Save</Button>
<Button onClick={handleClick2}>Submit</Button>
<Button onClick={handleClick3}>Send</Button>
```

### 2. Encapsulation

Components hide their internal complexity:

```javascript
// Complex date picker - internal details hidden
<DatePicker
    value={selectedDate}
    onChange={handleDateChange}
    minDate="2024-01-01"
/>

// User doesn't need to know about:
// - Calendar rendering
// - Month/year navigation
// - Date validation
// - Keyboard accessibility
```

### 3. Composition

Build complex UIs from simple pieces:

```javascript
// Small, focused components
<App>
    <Header>
        <Logo />
        <Navigation />
        <UserMenu />
    </Header>
    <Main>
        <Sidebar />
        <Content>
            <ArticleList />
        </Content>
    </Main>
    <Footer />
</App>
```

## Component Anatomy

### Props (Properties)

Data passed into a component from its parent:

```javascript
// Parent passes props
<UserCard name="Alice" age={25} role="admin" />

// Component receives and uses props
function UserCard(props) {
    return `
        <div class="user-card">
            <h2>${props.name}</h2>
            <p>Age: ${props.age}</p>
            <span class="badge">${props.role}</span>
        </div>
    `;
}
```

Props flow **down** - from parent to child.

### State

Internal data that can change over time:

```javascript
class Counter {
    constructor() {
        this.state = { count: 0 };
    }

    increment() {
        this.state.count += 1;
        this.render();
    }

    render() {
        return `<span>${this.state.count}</span>`;
    }
}
```

State is **owned** by the component and can change.

### Events

How components communicate upward:

```javascript
// Child emits event
<Button onClick={() => onItemDeleted(item.id)}>Delete</Button>

// Parent handles event
function handleItemDeleted(itemId) {
    setItems(items.filter(i => i.id !== itemId));
}
```

Events flow **up** - from child to parent.

## Component Patterns

### Container vs Presentational

**Presentational** components focus on how things look:

```javascript
// Presentational - no logic, just display
function UserAvatar({ imageUrl, name, size }) {
    return `
        <img
            src="${imageUrl}"
            alt="${name}"
            class="avatar avatar-${size}"
        />
    `;
}
```

**Container** components handle logic and data:

```javascript
// Container - fetches data, handles state
class UserProfile {
    constructor(userId) {
        this.state = { user: null, loading: true };
        this.fetchUser(userId);
    }

    async fetchUser(userId) {
        const user = await api.getUser(userId);
        this.state = { user, loading: false };
        this.render();
    }

    render() {
        if (this.state.loading) return `<Spinner />`;
        return `<UserAvatar ...${this.state.user} />`;
    }
}
```

### Compound Components

Components that work together:

```javascript
// Compound components share implicit state
<Tabs defaultTab="profile">
    <TabList>
        <Tab id="profile">Profile</Tab>
        <Tab id="settings">Settings</Tab>
        <Tab id="notifications">Notifications</Tab>
    </TabList>
    <TabPanels>
        <TabPanel id="profile">Profile content...</TabPanel>
        <TabPanel id="settings">Settings content...</TabPanel>
        <TabPanel id="notifications">Notifications...</TabPanel>
    </TabPanels>
</Tabs>
```

### Higher-Order Components

Functions that wrap components to add functionality:

```javascript
// HOC that adds loading state
function withLoading(Component) {
    return function WithLoadingComponent({ isLoading, ...props }) {
        if (isLoading) {
            return `<Spinner />`;
        }
        return Component(props);
    };
}

// Usage
const UserListWithLoading = withLoading(UserList);
```

## Component Lifecycle

Components go through phases:

```javascript
class Component {
    // 1. Creation
    constructor(props) {
        this.props = props;
        this.state = {};
    }

    // 2. Mounting - added to DOM
    onMount() {
        // Set up subscriptions, fetch data
        console.log("Component mounted");
    }

    // 3. Updating - props or state changed
    onUpdate(prevProps, prevState) {
        // React to changes
        console.log("Component updated");
    }

    // 4. Unmounting - removed from DOM
    onUnmount() {
        // Clean up subscriptions, timers
        console.log("Component unmounted");
    }

    render() {
        return `<div>...</div>`;
    }
}
```

## Simple Component Implementation

Here's a basic component class:

```javascript
class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
        this.element = null;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.update();
    }

    update() {
        const newElement = this.createDomElement();
        if (this.element && this.element.parentNode) {
            this.element.parentNode.replaceChild(newElement, this.element);
        }
        this.element = newElement;
    }

    createDomElement() {
        const template = document.createElement("template");
        template.innerHTML = this.render().trim();
        return template.content.firstChild;
    }

    mount(container) {
        this.element = this.createDomElement();
        container.appendChild(this.element);
        this.onMount();
    }

    onMount() {}

    render() {
        return "<div></div>";
    }
}
```

## Component Tree

Components form a tree structure:

```
App
├── Header
│   ├── Logo
│   └── NavMenu
│       ├── NavItem
│       ├── NavItem
│       └── NavItem
├── Main
│   ├── Sidebar
│   └── Content
│       └── ArticleList
│           ├── Article
│           └── Article
└── Footer
```

Data flows down through props, events bubble up.

## Key Takeaways

1. Components are self-contained, reusable UI units
2. Props pass data down from parent to child
3. State is internal data that can change
4. Events communicate upward from child to parent
5. Component lifecycle: create → mount → update → unmount
6. Composition allows building complex UIs from simple parts
7. Separation of concerns: presentational vs container components

Next, we'll explore state management patterns.
