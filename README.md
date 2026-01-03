# CS Courses

A comprehensive Computer Science course platform built with Angular and Bun, teaching programming through four language tracks: **Python**, **Swift**, **JavaScript**, and **Rust**.

## Features

- **Interactive Code Execution**: Run Python and JavaScript directly in the browser
- **Syntax Highlighting**: Powered by Shiki with VS Code-quality highlighting
- **Progress Tracking**: Local and server-side progress persistence
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: System-aware theme switching
- **Accessible**: WCAG AA compliant

## Tech Stack

- **Frontend**: Angular 19 (standalone components, signals)
- **Backend**: Bun with `Bun.serve()`
- **Database**: SQLite via `bun:sqlite`
- **Styling**: SCSS with CSS custom properties
- **Code Execution**: Pyodide (Python), sandboxed iframes (JavaScript)
- **Syntax Highlighting**: Shiki

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0 or later
- Node.js 18+ (for Angular CLI)

### Installation

```bash
# Clone the repository
git clone https://github.com/CorvidLabs/cs.git
cd cs

# Install dependencies
bun install
```

### Development

```bash
# Start Angular dev server
bun run start

# Start Bun backend server
bun run server:dev

# Or run both together
bun run dev
```

The application will be available at `http://localhost:4200`.

### Build

```bash
# Production build
bun run build:prod

# Start production server
bun run server
```

## Project Structure

```
cs/
├── content/           # Course content (Markdown + JSON)
│   └── courses/
│       ├── python/
│       ├── swift/
│       ├── javascript/
│       └── rust/
├── server/            # Bun backend
│   ├── index.ts
│   ├── routes/
│   └── db/
├── src/               # Angular frontend
│   ├── app/
│   │   ├── core/      # Services, models
│   │   ├── shared/    # Reusable components
│   │   ├── layout/    # Shell, header, sidebar
│   │   └── features/  # Home, course, profile
│   └── styles.scss
└── package.json
```

## Curriculum

### Foundation (Modules 1-4) - Python
Core concepts taught in Python for accessibility.

### Core (Modules 5-8) - Track-Specific
Same CS concepts, different language implementations.

### Specialization (Modules 9-12) - Deep Domain
- **Python**: Data science, ML, visualization
- **Swift**: iOS/macOS, SwiftUI, concurrency
- **JavaScript**: Web apps, DOM, APIs
- **Rust**: Systems programming, memory safety

### Integration (Modules 13-16) - Capstones
Cross-language projects and final capstones.

## License

MIT
