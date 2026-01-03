# CS Courses

A comprehensive Computer Science course platform built with Angular and Bun, featuring six learning tracks: **Python**, **JavaScript**, **Swift**, **Rust**, **Web Fundamentals**, and **Algorithms**.

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
│       ├── javascript/
│       ├── swift/
│       ├── rust/
│       ├── web-fundamentals/
│       └── algorithms/
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

### Language Tracks
- **Python**: Fundamentals through data processing and algorithms
- **JavaScript**: DOM manipulation, async patterns, TypeScript, modern frameworks
- **Swift**: iOS/macOS development, SwiftUI, concurrency
- **Rust**: Systems programming, ownership, memory safety

### Supplementary Tracks
- **Web Fundamentals**: HTML, CSS, responsive design, accessibility
- **Algorithms**: Data structures, sorting, searching, dynamic programming

## License

MIT
