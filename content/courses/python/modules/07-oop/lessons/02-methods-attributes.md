---
title: Methods and Attributes
order: 2
estimatedMinutes: 20
---

# Methods and Attributes

Understanding the different types of methods and attributes is essential for effective object-oriented programming. This lesson explores instance methods, class methods, static methods, and property decorators.

## Instance Methods Review

Instance methods operate on specific instances and have access to `self`:

```python
class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

    def circumference(self):
        return 2 * 3.14159 * self.radius

circle = Circle(5)
print(circle.area())          # 78.53975
print(circle.circumference()) # 31.4159
```

## Class Methods

Class methods operate on the class itself, not instances. Use the `@classmethod` decorator:

```python
class Dog:
    species = "Canis familiaris"
    count = 0

    def __init__(self, name):
        self.name = name
        Dog.count += 1

    @classmethod
    def get_species(cls):
        return cls.species

    @classmethod
    def get_count(cls):
        return cls.count

    @classmethod
    def from_string(cls, dog_string):
        """Alternative constructor from a string like 'Buddy,3'"""
        name, age = dog_string.split(",")
        return cls(name)

# Using class methods
print(Dog.get_species())  # Canis familiaris

dog1 = Dog("Buddy")
dog2 = Dog("Max")
print(Dog.get_count())    # 2

# Alternative constructor
dog3 = Dog.from_string("Rex,5")
print(dog3.name)          # Rex
```

The `cls` parameter refers to the class, similar to how `self` refers to the instance.

## Static Methods

Static methods don't access instance or class state. Use the `@staticmethod` decorator:

```python
class MathUtils:
    @staticmethod
    def add(a, b):
        return a + b

    @staticmethod
    def multiply(a, b):
        return a * b

    @staticmethod
    def is_even(n):
        return n % 2 == 0

# Call without creating an instance
print(MathUtils.add(5, 3))       # 8
print(MathUtils.is_even(4))      # True

# Can also call on an instance (but no reason to)
utils = MathUtils()
print(utils.multiply(4, 5))      # 20
```

Static methods are essentially regular functions that logically belong to a class.

## When to Use Each Type

```python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    # Instance method: needs instance data
    def to_fahrenheit(self):
        return self.celsius * 9/5 + 32

    # Class method: alternative constructor
    @classmethod
    def from_fahrenheit(cls, fahrenheit):
        celsius = (fahrenheit - 32) * 5/9
        return cls(celsius)

    # Static method: utility that doesn't need class/instance
    @staticmethod
    def is_freezing(celsius):
        return celsius <= 0

# Usage
temp = Temperature(25)
print(temp.to_fahrenheit())              # 77.0

temp2 = Temperature.from_fahrenheit(68)
print(temp2.celsius)                      # 20.0

print(Temperature.is_freezing(-5))        # True
```

## Properties

Properties allow you to define methods that are accessed like attributes:

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        """Get the radius"""
        return self._radius

    @radius.setter
    def radius(self, value):
        """Set the radius with validation"""
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

    @property
    def diameter(self):
        """Computed property"""
        return self._radius * 2

    @property
    def area(self):
        """Computed property"""
        return 3.14159 * self._radius ** 2

circle = Circle(5)
print(circle.radius)    # 5 (uses getter)
print(circle.diameter)  # 10
print(circle.area)      # 78.53975

circle.radius = 10      # Uses setter
print(circle.diameter)  # 20

# circle.radius = -5    # Raises ValueError
```

## Private Attributes

Python uses naming conventions to indicate private attributes:

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner            # Public
        self._balance = balance       # Protected (convention)
        self.__pin = "1234"          # Private (name mangling)

    def get_balance(self):
        return self._balance

    def verify_pin(self, pin):
        return pin == self.__pin

account = BankAccount("Alice", 1000)

# Public - accessible
print(account.owner)              # Alice

# Protected - accessible but discouraged
print(account._balance)           # 1000

# Private - name mangled
# print(account.__pin)            # AttributeError
print(account._BankAccount__pin)  # 1234 (can still access)
```

## Data Validation with Setters

Use property setters to validate data:

```python
class Person:
    def __init__(self, name, age):
        self.name = name  # Uses setter
        self.age = age    # Uses setter

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        if not value or not isinstance(value, str):
            raise ValueError("Name must be a non-empty string")
        self._name = value.strip()

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if not isinstance(value, int) or value < 0:
            raise ValueError("Age must be a non-negative integer")
        self._age = value

person = Person("Alice", 25)
print(person.name)  # Alice
print(person.age)   # 25

person.age = 26     # Valid
# person.age = -5   # Raises ValueError
# person.name = ""  # Raises ValueError
```

## Computed Attributes

Properties are great for computed values:

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height

    @property
    def perimeter(self):
        return 2 * (self.width + self.height)

    @property
    def is_square(self):
        return self.width == self.height

rect = Rectangle(10, 5)
print(rect.area)       # 50
print(rect.perimeter)  # 30
print(rect.is_square)  # False

rect.width = 5
print(rect.is_square)  # True
```

## Practical Example: User Account

```python
class UserAccount:
    _user_count = 0

    def __init__(self, username, email):
        self.username = username
        self.email = email
        self._password = None
        self._login_attempts = 0
        UserAccount._user_count += 1

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, value):
        if "@" not in value:
            raise ValueError("Invalid email format")
        self._email = value

    def set_password(self, password):
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        self._password = password

    def login(self, password):
        if self._password is None:
            return False, "Password not set"

        if password == self._password:
            self._login_attempts = 0
            return True, "Login successful"
        else:
            self._login_attempts += 1
            if self._login_attempts >= 3:
                return False, "Account locked"
            return False, "Invalid password"

    @classmethod
    def get_user_count(cls):
        return cls._user_count

    @staticmethod
    def is_valid_username(username):
        return len(username) >= 3 and username.isalnum()

# Usage
if UserAccount.is_valid_username("alice123"):
    user = UserAccount("alice123", "alice@example.com")
    user.set_password("secretpass123")
    print(user.login("secretpass123"))  # (True, 'Login successful')
    print(f"Total users: {UserAccount.get_user_count()}")
```

## Key Takeaways

1. Instance methods use `self` to access instance data
2. Class methods use `cls` to access class data (`@classmethod`)
3. Static methods don't access instance or class data (`@staticmethod`)
4. Properties let methods act like attributes (`@property`)
5. Use `_name` for protected and `__name` for private attributes
6. Property setters enable data validation
7. Class methods are often used as alternative constructors

Next, we'll explore inheritance and how to create class hierarchies.
