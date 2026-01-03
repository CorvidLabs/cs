---
title: Inheritance
order: 3
estimatedMinutes: 20
---

# Inheritance

Inheritance allows you to create new classes based on existing ones. The new class (child/subclass) inherits attributes and methods from the existing class (parent/superclass), enabling code reuse and hierarchical organization.

## Basic Inheritance

Create a child class by putting the parent class in parentheses:

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(f"{self.name} makes a sound")

    def eat(self):
        print(f"{self.name} is eating")

class Dog(Animal):  # Dog inherits from Animal
    pass

# Dog has all Animal methods
my_dog = Dog("Buddy")
my_dog.speak()  # Buddy makes a sound
my_dog.eat()    # Buddy is eating
```

## Extending the Parent Class

Child classes can add new methods and attributes:

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(f"{self.name} makes a sound")

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)  # Call parent __init__
        self.breed = breed      # Add new attribute

    def fetch(self):            # Add new method
        print(f"{self.name} is fetching the ball!")

my_dog = Dog("Buddy", "Golden Retriever")
my_dog.speak()  # Buddy makes a sound (inherited)
my_dog.fetch()  # Buddy is fetching the ball! (new method)
print(my_dog.breed)  # Golden Retriever
```

## The super() Function

`super()` calls methods from the parent class:

```python
class Vehicle:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model

    def display_info(self):
        print(f"{self.brand} {self.model}")

class Car(Vehicle):
    def __init__(self, brand, model, num_doors):
        super().__init__(brand, model)  # Initialize parent attributes
        self.num_doors = num_doors      # Add child attribute

    def display_info(self):
        super().display_info()          # Call parent method
        print(f"Doors: {self.num_doors}")

car = Car("Toyota", "Camry", 4)
car.display_info()
# Toyota Camry
# Doors: 4
```

## Method Overriding

Child classes can override parent methods:

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(f"{self.name} makes a sound")

class Dog(Animal):
    def speak(self):
        print(f"{self.name} says: Woof!")

class Cat(Animal):
    def speak(self):
        print(f"{self.name} says: Meow!")

class Cow(Animal):
    def speak(self):
        print(f"{self.name} says: Moo!")

# Each animal speaks differently
animals = [Dog("Buddy"), Cat("Whiskers"), Cow("Bessie")]
for animal in animals:
    animal.speak()
# Buddy says: Woof!
# Whiskers says: Meow!
# Bessie says: Moo!
```

## isinstance() and issubclass()

Check inheritance relationships:

```python
class Animal:
    pass

class Dog(Animal):
    pass

class Cat(Animal):
    pass

my_dog = Dog()

# isinstance checks if object is instance of class
print(isinstance(my_dog, Dog))     # True
print(isinstance(my_dog, Animal))  # True (parent class)
print(isinstance(my_dog, Cat))     # False

# issubclass checks class hierarchy
print(issubclass(Dog, Animal))     # True
print(issubclass(Cat, Animal))     # True
print(issubclass(Dog, Cat))        # False
```

## Multiple Inheritance

Python supports inheriting from multiple classes:

```python
class Flyable:
    def fly(self):
        print(f"{self.name} is flying")

class Swimmable:
    def swim(self):
        print(f"{self.name} is swimming")

class Duck(Flyable, Swimmable):
    def __init__(self, name):
        self.name = name

duck = Duck("Donald")
duck.fly()   # Donald is flying
duck.swim()  # Donald is swimming
```

## Method Resolution Order (MRO)

When using multiple inheritance, Python follows a specific order to find methods:

```python
class A:
    def greet(self):
        print("Hello from A")

class B(A):
    def greet(self):
        print("Hello from B")

class C(A):
    def greet(self):
        print("Hello from C")

class D(B, C):
    pass

d = D()
d.greet()  # Hello from B

# View the MRO
print(D.__mro__)
# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)
```

Python searches: D -> B -> C -> A -> object

## Practical Example: Shape Hierarchy

```python
import math

class Shape:
    def __init__(self, color="black"):
        self.color = color

    def area(self):
        raise NotImplementedError("Subclasses must implement area()")

    def perimeter(self):
        raise NotImplementedError("Subclasses must implement perimeter()")

    def describe(self):
        return f"A {self.color} shape"

class Rectangle(Shape):
    def __init__(self, width, height, color="black"):
        super().__init__(color)
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def describe(self):
        return f"A {self.color} rectangle ({self.width}x{self.height})"

class Circle(Shape):
    def __init__(self, radius, color="black"):
        super().__init__(color)
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2

    def perimeter(self):
        return 2 * math.pi * self.radius

    def describe(self):
        return f"A {self.color} circle (radius={self.radius})"

class Square(Rectangle):
    def __init__(self, side, color="black"):
        super().__init__(side, side, color)

    def describe(self):
        return f"A {self.color} square ({self.width}x{self.width})"

# Use polymorphism
shapes = [
    Rectangle(10, 5, "blue"),
    Circle(7, "red"),
    Square(4, "green")
]

for shape in shapes:
    print(shape.describe())
    print(f"  Area: {shape.area():.2f}")
    print(f"  Perimeter: {shape.perimeter():.2f}")
```

## Abstract Base Classes

Use ABC to create classes that can't be instantiated directly:

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    def __init__(self, name):
        self.name = name

    @abstractmethod
    def speak(self):
        """All animals must implement speak()"""
        pass

    def sleep(self):
        print(f"{self.name} is sleeping")

# Can't instantiate abstract class
# animal = Animal("Generic")  # TypeError

class Dog(Animal):
    def speak(self):
        print(f"{self.name} says: Woof!")

class Cat(Animal):
    def speak(self):
        print(f"{self.name} says: Meow!")

dog = Dog("Buddy")
dog.speak()  # Buddy says: Woof!
dog.sleep()  # Buddy is sleeping
```

## Composition vs Inheritance

Sometimes composition (has-a) is better than inheritance (is-a):

```python
# Inheritance: Car IS A Vehicle
class Vehicle:
    def start(self):
        print("Starting...")

class Car(Vehicle):
    pass

# Composition: Car HAS AN Engine
class Engine:
    def start(self):
        print("Engine starting...")

class Car:
    def __init__(self):
        self.engine = Engine()  # Car has an engine

    def start(self):
        self.engine.start()
        print("Car is ready")

car = Car()
car.start()
# Engine starting...
# Car is ready
```

Use inheritance for "is-a" relationships and composition for "has-a" relationships.

## Key Takeaways

1. Inheritance creates child classes from parent classes
2. Use `super()` to call parent methods
3. Child classes can override parent methods
4. `isinstance()` checks if an object is an instance of a class
5. Multiple inheritance is possible but use carefully
6. Abstract base classes define interfaces
7. Prefer composition over inheritance when appropriate

Next, we'll explore special methods that customize class behavior.
