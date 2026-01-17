---
title: Input Validation
order: 1
difficulty: easy
estimatedMinutes: 15
---

# Exercise: Input Validation

Build a robust input validation system using Kotlin's error handling features.

## Requirements

1. Validate user registration data (name, email, age, password)
2. Collect all validation errors (not just the first)
3. Use sealed classes for validation results
4. Provide helpful error messages

## Starter Code

```kotlin
data class RegistrationForm(
    val name: String,
    val email: String,
    val age: Int,
    val password: String
)

// Define your validation result sealed class

fun validateForm(form: RegistrationForm): ValidationResult {
    // Your implementation
}

fun main() {
    val validForm = RegistrationForm(
        name = "Alice",
        email = "alice@example.com",
        age = 25,
        password = "SecurePass123!"
    )

    val invalidForm = RegistrationForm(
        name = "",
        email = "not-an-email",
        age = -5,
        password = "123"
    )

    println("Valid form: ${validateForm(validForm)}")
    println("Invalid form: ${validateForm(invalidForm)}")
}
```

## Expected Output

```
Valid form: Valid(form=RegistrationForm(name=Alice, email=alice@example.com, age=25, password=SecurePass123!))
Invalid form: Invalid(errors=[Name cannot be empty, Invalid email format, Age must be positive, Password must be at least 8 characters])
```

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
data class RegistrationForm(
    val name: String,
    val email: String,
    val age: Int,
    val password: String
)

sealed class ValidationResult {
    data class Valid(val form: RegistrationForm) : ValidationResult()
    data class Invalid(val errors: List<String>) : ValidationResult()
}

fun validateForm(form: RegistrationForm): ValidationResult {
    val errors = mutableListOf<String>()

    if (form.name.isBlank()) {
        errors.add("Name cannot be empty")
    }

    if (!form.email.contains("@") || !form.email.contains(".")) {
        errors.add("Invalid email format")
    }

    if (form.age <= 0) {
        errors.add("Age must be positive")
    }

    if (form.password.length < 8) {
        errors.add("Password must be at least 8 characters")
    }

    return if (errors.isEmpty()) {
        ValidationResult.Valid(form)
    } else {
        ValidationResult.Invalid(errors)
    }
}

fun main() {
    val validForm = RegistrationForm(
        name = "Alice",
        email = "alice@example.com",
        age = 25,
        password = "SecurePass123!"
    )

    val invalidForm = RegistrationForm(
        name = "",
        email = "not-an-email",
        age = -5,
        password = "123"
    )

    when (val result = validateForm(validForm)) {
        is ValidationResult.Valid -> println("Valid form: ${result.form}")
        is ValidationResult.Invalid -> println("Errors: ${result.errors}")
    }

    when (val result = validateForm(invalidForm)) {
        is ValidationResult.Valid -> println("Valid form: ${result.form}")
        is ValidationResult.Invalid -> println("Errors: ${result.errors}")
    }
}
```
</details>
