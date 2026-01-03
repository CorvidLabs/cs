---
title: Packages and pip
order: 4
estimatedMinutes: 20
---

# Packages and pip

While Python's standard library is extensive, the real power comes from the vast ecosystem of third-party packages. pip is Python's package installer.

## What is pip?

pip (Pip Installs Packages) is the standard package manager for Python. It downloads and installs packages from PyPI (Python Package Index) - a repository of over 400,000 packages.

Check your pip version:

```bash
pip --version
# or
pip3 --version
```

## Installing Packages

### Basic Installation

```bash
pip install requests
```

### Install Specific Version

```bash
pip install requests==2.28.0
```

### Install Minimum Version

```bash
pip install "requests>=2.25.0"
```

### Install Multiple Packages

```bash
pip install requests flask pandas
```

### Upgrade a Package

```bash
pip install --upgrade requests
```

### Uninstall a Package

```bash
pip uninstall requests
```

## Viewing Installed Packages

### List All Packages

```bash
pip list
```

Output:
```
Package    Version
---------- -------
requests   2.28.0
flask      2.2.3
pandas     1.5.3
```

### Package Details

```bash
pip show requests
```

Output:
```
Name: requests
Version: 2.28.0
Summary: Python HTTP for Humans.
Home-page: https://requests.readthedocs.io
Author: Kenneth Reitz
...
Requires: charset-normalizer, idna, urllib3, certifi
```

### Check for Outdated Packages

```bash
pip list --outdated
```

## Virtual Environments

Virtual environments isolate project dependencies. Each project can have its own package versions without conflicts.

### Why Use Virtual Environments?

- **Isolation**: Project A needs requests 2.25, Project B needs 2.28
- **Reproducibility**: Know exactly which versions your project uses
- **Clean system**: Keep your global Python clean

### Creating a Virtual Environment

```bash
# Create environment in 'venv' folder
python -m venv venv

# Or with a specific name
python -m venv myproject_env
```

### Activating the Environment

```bash
# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

Your prompt changes to show the active environment:
```
(venv) $ python --version
```

### Deactivating

```bash
deactivate
```

### Typical Workflow

```bash
# 1. Create project folder
mkdir my_project
cd my_project

# 2. Create virtual environment
python -m venv venv

# 3. Activate it
source venv/bin/activate  # macOS/Linux

# 4. Install packages
pip install requests flask

# 5. Work on your project
# ...

# 6. When done
deactivate
```

## requirements.txt

This file lists your project's dependencies. It's essential for sharing and deploying projects.

### Generate requirements.txt

```bash
pip freeze > requirements.txt
```

Creates:
```
certifi==2023.5.7
charset-normalizer==3.1.0
flask==2.3.2
idna==3.4
requests==2.31.0
urllib3==2.0.3
```

### Install from requirements.txt

```bash
pip install -r requirements.txt
```

### Manual requirements.txt

You can create it manually with flexible versioning:

```
# requirements.txt

# Exact versions
requests==2.28.0

# Minimum version
flask>=2.0.0

# Compatible release (2.0.x)
django~=4.0

# Version range
pandas>=1.3.0,<2.0.0

# Latest version
numpy
```

### Development Dependencies

Create separate files:

```
# requirements.txt - Production
requests>=2.28.0
flask>=2.0.0

# requirements-dev.txt - Development
-r requirements.txt  # Include production deps
pytest>=7.0.0
black>=23.0.0
```

Install development dependencies:
```bash
pip install -r requirements-dev.txt
```

## Popular Packages by Category

### Web Development

```bash
pip install flask         # Lightweight web framework
pip install django        # Full-featured web framework
pip install fastapi       # Modern async API framework
pip install requests      # HTTP client
pip install beautifulsoup4  # HTML parsing
```

### Data Science

```bash
pip install numpy         # Numerical computing
pip install pandas        # Data manipulation
pip install matplotlib    # Plotting
pip install scikit-learn  # Machine learning
pip install jupyter       # Interactive notebooks
```

### Automation

```bash
pip install selenium      # Browser automation
pip install schedule      # Job scheduling
pip install paramiko      # SSH connections
pip install python-dotenv # Environment variables
```

### Development Tools

```bash
pip install pytest        # Testing framework
pip install black         # Code formatter
pip install mypy          # Type checking
pip install pylint        # Linting
```

## Using Installed Packages

### requests - HTTP Made Simple

```python
import requests

# GET request
response = requests.get("https://api.github.com")
print(response.status_code)  # 200
print(response.json())       # Parse JSON response

# POST request with data
response = requests.post(
    "https://httpbin.org/post",
    json={"name": "Alice", "age": 25}
)

# Headers and parameters
response = requests.get(
    "https://api.example.com/search",
    params={"q": "python"},
    headers={"Authorization": "Bearer token123"}
)
```

### python-dotenv - Environment Variables

Create `.env` file:
```
DATABASE_URL=postgresql://localhost/mydb
API_KEY=secret123
DEBUG=true
```

Load in Python:
```python
from dotenv import load_dotenv
import os

load_dotenv()  # Load .env file

database_url = os.getenv("DATABASE_URL")
api_key = os.getenv("API_KEY")
debug = os.getenv("DEBUG", "false").lower() == "true"
```

### pytest - Testing

```python
# test_calculator.py
from calculator import add, subtract

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0

def test_subtract():
    assert subtract(5, 3) == 2
    assert subtract(0, 5) == -5
```

Run tests:
```bash
pytest
```

## Best Practices

### 1. Always Use Virtual Environments

```bash
# Every project gets its own venv
python -m venv venv
source venv/bin/activate
```

### 2. Pin Versions for Production

```
# requirements.txt for production
requests==2.28.0  # Exact version
flask==2.3.2
```

### 3. Keep requirements.txt Updated

```bash
# After installing new packages
pip freeze > requirements.txt
```

### 4. Don't Commit venv

Add to `.gitignore`:
```
venv/
.env
__pycache__/
```

### 5. Document Setup Instructions

README.md:
```markdown
## Setup

1. Create virtual environment:
   python -m venv venv

2. Activate it:
   source venv/bin/activate

3. Install dependencies:
   pip install -r requirements.txt
```

## Troubleshooting

### Permission Errors

```bash
# Use --user flag (not recommended, use venv instead)
pip install --user package_name

# Or fix with sudo (Linux/macOS) - also not recommended
sudo pip install package_name
```

### Package Not Found

```bash
# Check spelling
pip search package_name  # Note: search is disabled on PyPI

# Check PyPI website
# https://pypi.org/search/
```

### Conflicting Dependencies

```bash
# Show what would be installed
pip install --dry-run package_name

# Force reinstall
pip install --force-reinstall package_name
```

## Try It Yourself

1. Create a virtual environment for a new project
2. Install `requests` and fetch data from a public API
3. Generate a `requirements.txt` for your project
4. Install from requirements.txt in a fresh environment

## Key Takeaways

1. pip installs packages from PyPI
2. Virtual environments isolate project dependencies
3. `requirements.txt` captures dependencies for reproducibility
4. Always use virtual environments for projects
5. Pin versions for production, use ranges for development
6. Don't commit `venv/` or `.env` to version control

You've completed the Modules and Packages module! You can now organize code into modules, use the standard library, and leverage the vast Python ecosystem.
