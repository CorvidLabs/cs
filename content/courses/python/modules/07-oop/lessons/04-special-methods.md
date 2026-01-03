---
title: Special Methods
order: 4
estimatedMinutes: 20
---

# Special Methods

Special methods (also called magic methods or dunder methods) let you define how your objects behave with built-in Python operations. They're named with double underscores like `__init__` and `__str__`.

## String Representation

### `__str__` - Human-readable representation

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __str__(self):
        return f"{self.name}, {self.age} years old"

person = Person("Alice", 25)
print(person)        # Alice, 25 years old
print(str(person))   # Alice, 25 years old
```

### `__repr__` - Developer representation

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __repr__(self):
        return f"Person('{self.name}', {self.age})"

    def __str__(self):
        return f"{self.name}, {self.age} years old"

person = Person("Alice", 25)
print(repr(person))  # Person('Alice', 25)
print(str(person))   # Alice, 25 years old

# In the REPL or debugger, __repr__ is used
[person]  # [Person('Alice', 25)]
```

`__repr__` should ideally return a string that could recreate the object.

## Comparison Methods

```python
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def __eq__(self, other):
        if not isinstance(other, Product):
            return NotImplemented
        return self.price == other.price

    def __lt__(self, other):
        if not isinstance(other, Product):
            return NotImplemented
        return self.price < other.price

    def __le__(self, other):
        return self == other or self < other

    def __gt__(self, other):
        if not isinstance(other, Product):
            return NotImplemented
        return self.price > other.price

    def __ge__(self, other):
        return self == other or self > other

p1 = Product("Apple", 1.50)
p2 = Product("Banana", 0.75)
p3 = Product("Cherry", 1.50)

print(p1 == p3)  # True (same price)
print(p1 > p2)   # True
print(p2 < p1)   # True

# Can now sort products
products = [p1, p2, p3]
products.sort()
```

### Using functools.total_ordering

Define just `__eq__` and one comparison method:

```python
from functools import total_ordering

@total_ordering
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def __eq__(self, other):
        if not isinstance(other, Product):
            return NotImplemented
        return self.price == other.price

    def __lt__(self, other):
        if not isinstance(other, Product):
            return NotImplemented
        return self.price < other.price

# __le__, __gt__, __ge__ are automatically provided
```

## Arithmetic Methods

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar):
        return self.__mul__(scalar)

    def __neg__(self):
        return Vector(-self.x, -self.y)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(3, 4)
v2 = Vector(1, 2)

print(v1 + v2)   # Vector(4, 6)
print(v1 - v2)   # Vector(2, 2)
print(v1 * 2)    # Vector(6, 8)
print(3 * v1)    # Vector(9, 12) - uses __rmul__
print(-v1)       # Vector(-3, -4)
```

## Container Methods

Make objects act like containers:

```python
class Playlist:
    def __init__(self, name):
        self.name = name
        self._songs = []

    def add(self, song):
        self._songs.append(song)

    def __len__(self):
        return len(self._songs)

    def __getitem__(self, index):
        return self._songs[index]

    def __setitem__(self, index, value):
        self._songs[index] = value

    def __delitem__(self, index):
        del self._songs[index]

    def __contains__(self, song):
        return song in self._songs

    def __iter__(self):
        return iter(self._songs)

playlist = Playlist("My Favorites")
playlist.add("Song A")
playlist.add("Song B")
playlist.add("Song C")

print(len(playlist))           # 3
print(playlist[0])             # Song A
print("Song B" in playlist)    # True

for song in playlist:
    print(song)

playlist[1] = "Song B (Remix)"
del playlist[2]
```

## Callable Objects

Make objects callable like functions:

```python
class Multiplier:
    def __init__(self, factor):
        self.factor = factor

    def __call__(self, x):
        return x * self.factor

double = Multiplier(2)
triple = Multiplier(3)

print(double(5))   # 10
print(triple(5))   # 15

# Check if callable
print(callable(double))  # True
```

## Context Managers

Use `__enter__` and `__exit__` for the `with` statement:

```python
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None

    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        return False  # Don't suppress exceptions

# Usage
with FileManager("test.txt", "w") as f:
    f.write("Hello, World!")
# File is automatically closed
```

## Attribute Access

Control attribute access:

```python
class ProtectedDict:
    def __init__(self):
        self._data = {}

    def __getattr__(self, name):
        if name in self._data:
            return self._data[name]
        raise AttributeError(f"No attribute '{name}'")

    def __setattr__(self, name, value):
        if name.startswith('_'):
            super().__setattr__(name, value)
        else:
            self._data[name] = value

    def __delattr__(self, name):
        if name in self._data:
            del self._data[name]
        else:
            raise AttributeError(f"No attribute '{name}'")

obj = ProtectedDict()
obj.x = 10
obj.y = 20
print(obj.x)  # 10
del obj.x
```

## Practical Example: Money Class

```python
from functools import total_ordering

@total_ordering
class Money:
    def __init__(self, dollars, cents=0):
        total_cents = dollars * 100 + cents
        self._cents = int(total_cents)

    @property
    def dollars(self):
        return self._cents // 100

    @property
    def cents(self):
        return self._cents % 100

    def __repr__(self):
        return f"Money({self.dollars}, {self.cents})"

    def __str__(self):
        return f"${self.dollars}.{self.cents:02d}"

    def __eq__(self, other):
        if isinstance(other, Money):
            return self._cents == other._cents
        return NotImplemented

    def __lt__(self, other):
        if isinstance(other, Money):
            return self._cents < other._cents
        return NotImplemented

    def __add__(self, other):
        if isinstance(other, Money):
            return Money(0, self._cents + other._cents)
        return NotImplemented

    def __sub__(self, other):
        if isinstance(other, Money):
            return Money(0, self._cents - other._cents)
        return NotImplemented

    def __mul__(self, factor):
        return Money(0, int(self._cents * factor))

    def __rmul__(self, factor):
        return self.__mul__(factor)

    def __bool__(self):
        return self._cents != 0

# Usage
price = Money(19, 99)
tax = Money(1, 60)
total = price + tax

print(f"Price: {price}")   # Price: $19.99
print(f"Tax: {tax}")       # Tax: $1.60
print(f"Total: {total}")   # Total: $21.59

discount = total * 0.1
print(f"10% discount: {discount}")  # 10% discount: $2.15

print(price > tax)         # True
print(sorted([tax, total, price]))  # Sorted by value
```

## Common Special Methods Reference

| Method | Purpose |
|--------|---------|
| `__init__` | Initialize object |
| `__str__` | String for users |
| `__repr__` | String for developers |
| `__eq__`, `__lt__`, etc. | Comparisons |
| `__add__`, `__sub__`, etc. | Arithmetic |
| `__len__` | Length |
| `__getitem__`, `__setitem__` | Indexing |
| `__contains__` | `in` operator |
| `__iter__` | Iteration |
| `__call__` | Make callable |
| `__enter__`, `__exit__` | Context manager |

## Key Takeaways

1. Special methods customize object behavior with Python operations
2. `__str__` is for users, `__repr__` is for developers
3. Comparison methods enable sorting and comparisons
4. Arithmetic methods enable operator overloading
5. Container methods make objects work like lists or dicts
6. `__call__` makes objects callable
7. Context managers handle resource cleanup

You now have a comprehensive understanding of Python's object-oriented features!
