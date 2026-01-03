---
title: Reactivity Patterns
order: 3
estimatedMinutes: 16
---

# Reactivity Patterns

Reactivity is the automatic updating of the UI when data changes. Modern frameworks use various techniques to detect changes and efficiently update the DOM.

## The Reactivity Problem

Without reactivity, you manually update the DOM:

```javascript
// Manual DOM updates - tedious and error-prone
let count = 0;
const counterElement = document.getElementById("counter");

function increment() {
    count++;
    counterElement.textContent = count; // Manual update
}

function decrement() {
    count--;
    counterElement.textContent = count; // Manual update again
}
```

With reactivity, updates happen automatically:

```javascript
// Reactive - UI updates automatically when state changes
const state = reactive({ count: 0 });

// UI automatically reflects state.count changes
function increment() {
    state.count++; // UI updates automatically!
}
```

## Observer Pattern

The foundation of reactivity - objects notify observers when they change:

```javascript
class Observable {
    constructor(value) {
        this._value = value;
        this._observers = [];
    }

    get value() {
        return this._value;
    }

    set value(newValue) {
        if (this._value !== newValue) {
            this._value = newValue;
            this.notify();
        }
    }

    subscribe(observer) {
        this._observers.push(observer);
        return () => {
            this._observers = this._observers.filter(o => o !== observer);
        };
    }

    notify() {
        this._observers.forEach(observer => observer(this._value));
    }
}

// Usage
const count = new Observable(0);

count.subscribe(value => {
    document.getElementById("counter").textContent = value;
});

count.value = 1; // UI updates automatically
count.value = 2; // UI updates automatically
```

## Proxy-Based Reactivity

Modern frameworks use JavaScript Proxies for automatic change detection:

```javascript
function reactive(target) {
    const handlers = {
        get(obj, prop) {
            const value = obj[prop];
            // Track this property access
            track(obj, prop);
            // Make nested objects reactive too
            if (typeof value === "object" && value !== null) {
                return reactive(value);
            }
            return value;
        },

        set(obj, prop, value) {
            const oldValue = obj[prop];
            obj[prop] = value;
            // Trigger updates if value changed
            if (oldValue !== value) {
                trigger(obj, prop);
            }
            return true;
        }
    };

    return new Proxy(target, handlers);
}

// Usage - changes are automatically detected
const state = reactive({
    user: { name: "Alice" },
    count: 0
});

state.count = 1;           // Detected!
state.user.name = "Bob";   // Nested change also detected!
```

## Effect System

Run code automatically when dependencies change:

```javascript
let activeEffect = null;
const targetMap = new WeakMap();

function track(target, key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        let deps = depsMap.get(key);
        if (!deps) {
            depsMap.set(key, (deps = new Set()));
        }
        deps.add(activeEffect);
    }
}

function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    const deps = depsMap.get(key);
    if (deps) {
        deps.forEach(effect => effect());
    }
}

function effect(fn) {
    activeEffect = fn;
    fn(); // Run immediately to collect dependencies
    activeEffect = null;
}

// Usage
const state = reactive({ count: 0 });

effect(() => {
    // This runs automatically when state.count changes
    document.getElementById("counter").textContent = state.count;
});

state.count = 1; // Effect re-runs, DOM updates
state.count = 2; // Effect re-runs again
```

## Computed Properties

Derived values that update automatically:

```javascript
function computed(getter) {
    let cachedValue;
    let dirty = true;

    const runner = effect(() => {
        if (dirty) {
            cachedValue = getter();
            dirty = false;
        }
    });

    return {
        get value() {
            if (dirty) {
                cachedValue = getter();
                dirty = false;
            }
            return cachedValue;
        }
    };
}

// Usage
const state = reactive({
    firstName: "John",
    lastName: "Doe"
});

const fullName = computed(() => {
    return `${state.firstName} ${state.lastName}`;
});

console.log(fullName.value); // "John Doe"

state.firstName = "Jane";
console.log(fullName.value); // "Jane Doe" - automatically updated
```

## Virtual DOM

Instead of directly manipulating the DOM, work with a virtual representation:

```javascript
// Virtual DOM node
function h(tag, props, ...children) {
    return {
        tag,
        props: props || {},
        children: children.flat()
    };
}

// Create virtual DOM tree
const vdom = h("div", { class: "container" },
    h("h1", null, "Hello"),
    h("p", null, "World")
);

// Render to real DOM
function render(vnode) {
    if (typeof vnode === "string") {
        return document.createTextNode(vnode);
    }

    const element = document.createElement(vnode.tag);

    for (const [key, value] of Object.entries(vnode.props)) {
        if (key.startsWith("on")) {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    }

    for (const child of vnode.children) {
        element.appendChild(render(child));
    }

    return element;
}
```

## Diffing Algorithm

Compare old and new virtual DOM to minimize real DOM updates:

```javascript
function diff(oldVNode, newVNode, parent, index = 0) {
    const oldChild = parent.childNodes[index];

    // New node added
    if (!oldVNode) {
        parent.appendChild(render(newVNode));
        return;
    }

    // Node removed
    if (!newVNode) {
        parent.removeChild(oldChild);
        return;
    }

    // Node replaced
    if (changed(oldVNode, newVNode)) {
        parent.replaceChild(render(newVNode), oldChild);
        return;
    }

    // Same node type - update props and recurse on children
    if (newVNode.tag) {
        updateProps(oldChild, oldVNode.props, newVNode.props);

        const oldChildren = oldVNode.children || [];
        const newChildren = newVNode.children || [];
        const maxLength = Math.max(oldChildren.length, newChildren.length);

        for (let i = 0; i < maxLength; i++) {
            diff(oldChildren[i], newChildren[i], oldChild, i);
        }
    }
}

function changed(node1, node2) {
    return typeof node1 !== typeof node2 ||
           (typeof node1 === "string" && node1 !== node2) ||
           node1.tag !== node2.tag;
}
```

## Batching Updates

Combine multiple state changes into a single update:

```javascript
class BatchedUpdater {
    constructor() {
        this.pending = false;
        this.updates = [];
    }

    queueUpdate(update) {
        this.updates.push(update);

        if (!this.pending) {
            this.pending = true;
            // Batch all updates until next microtask
            queueMicrotask(() => this.flush());
        }
    }

    flush() {
        // Apply all queued updates at once
        this.updates.forEach(update => update());
        this.updates = [];
        this.pending = false;
        // Single DOM update
        this.render();
    }

    render() {
        console.log("Rendering once after all updates");
    }
}

// Usage
const updater = new BatchedUpdater();

// These three updates result in only one render
updater.queueUpdate(() => state.a = 1);
updater.queueUpdate(() => state.b = 2);
updater.queueUpdate(() => state.c = 3);
// Renders once!
```

## Simple Reactive Component

Putting it all together:

```javascript
class ReactiveComponent {
    constructor() {
        this.state = reactive(this.data());
        this.element = null;

        // Re-render when state changes
        effect(() => {
            this.update();
        });
    }

    data() {
        return {};
    }

    update() {
        const newElement = this.createElement();
        if (this.element && this.element.parentNode) {
            this.element.parentNode.replaceChild(newElement, this.element);
        }
        this.element = newElement;
    }

    createElement() {
        const div = document.createElement("div");
        div.innerHTML = this.render();
        return div.firstElementChild;
    }

    render() {
        return "<div></div>";
    }

    mount(container) {
        this.element = this.createElement();
        container.appendChild(this.element);
    }
}
```

## Key Takeaways

1. Reactivity automatically updates UI when data changes
2. Observer pattern: objects notify subscribers of changes
3. Proxies enable transparent change detection
4. Effects run automatically when their dependencies change
5. Computed properties derive values and cache results
6. Virtual DOM enables efficient diffing and patching
7. Batching combines multiple updates into one render
8. Modern frameworks combine these patterns for optimal performance

Next, we'll build our own simple component system.
