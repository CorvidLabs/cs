---
title: Classes and Objects
order: 1
estimatedMinutes: 20
---

# Classes and Objects

Object-oriented programming (OOP) is a programming paradigm that organizes code around objects rather than functions. Objects combine data (attributes) and behavior (methods) into reusable components.

## What is a Class?

A class is a blueprint for creating objects. It defines what attributes and methods objects of that type will have.

Think of a class like an architectural blueprint:
- The blueprint describes the structure
- Individual houses built from it are objects
- Each house has the same structure but different details

## Creating a Simple Class

```python
class Dog:
    pass

# Create objects (instances) of the class
my_dog = Dog()
your_dog = Dog()

print(type(my_dog))  # <class '__main__.Dog'>
```

## The `__init__` Method

The `__init__` method initializes new objects. It runs automatically when you create an instance:

```python
class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed

# Create a dog with specific attributes
my_dog = Dog("Buddy", "Golden Retriever")
print(my_dog.name)   # Buddy
print(my_dog.breed)  # Golden Retriever
```

## Understanding `self`

`self` refers to the specific instance being created or used. It's how the object accesses its own attributes and methods.

```python
class Dog:
    def __init__(self, name):
        self.name = name  # self.name belongs to THIS specific dog

dog1 = Dog("Buddy")
dog2 = Dog("Max")

print(dog1.name)  # Buddy
print(dog2.name)  # Max
```

Each dog has its own `name` attribute.

## Instance Attributes

Attributes are variables that belong to an object:

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.email = None  # Can set defaults

person = Person("Alice", 25)
print(person.name)   # Alice
print(person.age)    # 25
print(person.email)  # None

# Attributes can be modified
person.age = 26
person.email = "alice@example.com"
print(person.age)    # 26
print(person.email)  # alice@example.com
```

## Class vs Instance Attributes

Class attributes are shared by all instances:

```python
class Dog:
    species = "Canis familiaris"  # Class attribute

    def __init__(self, name):
        self.name = name  # Instance attribute

dog1 = Dog("Buddy")
dog2 = Dog("Max")

# Both share the class attribute
print(dog1.species)  # Canis familiaris
print(dog2.species)  # Canis familiaris

# Each has its own instance attribute
print(dog1.name)     # Buddy
print(dog2.name)     # Max
```

## Adding Methods

Methods are functions that belong to a class:

```python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        print(f"{self.name} says: Woof!")

    def get_human_age(self):
        return self.age * 7

my_dog = Dog("Buddy", 3)
my_dog.bark()                      # Buddy says: Woof!
print(my_dog.get_human_age())      # 21
```

## Methods with Parameters

Methods can take additional parameters:

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            print(f"Deposited ${amount}. New balance: ${self.balance}")
        else:
            print("Deposit amount must be positive")

    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds")
        elif amount > 0:
            self.balance -= amount
            print(f"Withdrew ${amount}. New balance: ${self.balance}")
        else:
            print("Withdrawal amount must be positive")

account = BankAccount("Alice", 100)
account.deposit(50)     # Deposited $50. New balance: $150
account.withdraw(30)    # Withdrew $30. New balance: $120
account.withdraw(200)   # Insufficient funds
```

## Multiple Objects

Each object maintains its own state:

```python
class Counter:
    def __init__(self):
        self.count = 0

    def increment(self):
        self.count += 1

    def get_count(self):
        return self.count

counter1 = Counter()
counter2 = Counter()

counter1.increment()
counter1.increment()
counter2.increment()

print(counter1.get_count())  # 2
print(counter2.get_count())  # 1
```

## Practical Example: Student Class

```python
class Student:
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.courses = []
        self.grades = {}

    def enroll(self, course):
        if course not in self.courses:
            self.courses.append(course)
            print(f"{self.name} enrolled in {course}")
        else:
            print(f"{self.name} is already enrolled in {course}")

    def add_grade(self, course, grade):
        if course in self.courses:
            self.grades[course] = grade
            print(f"Grade recorded: {course} = {grade}")
        else:
            print(f"Not enrolled in {course}")

    def get_gpa(self):
        if not self.grades:
            return 0.0
        return sum(self.grades.values()) / len(self.grades)

# Use the Student class
student = Student("Alice", "S12345")
student.enroll("Math 101")
student.enroll("Physics 101")
student.add_grade("Math 101", 95)
student.add_grade("Physics 101", 88)
print(f"GPA: {student.get_gpa()}")  # GPA: 91.5
```

## Naming Conventions

Follow Python conventions for classes:

```python
# Class names: PascalCase
class BankAccount:
    pass

class HttpRequest:
    pass

# Method and attribute names: snake_case
class User:
    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
```

## Key Takeaways

1. Classes are blueprints for creating objects
2. `__init__` initializes new objects
3. `self` refers to the current instance
4. Instance attributes belong to specific objects
5. Class attributes are shared by all instances
6. Methods are functions that belong to a class
7. Each object maintains its own state

Next, we'll explore methods and attributes in more depth.
