---
title: How the Web Works
order: 1
estimatedMinutes: 15
---

# How the Web Works

Before writing code, it helps to understand how websites actually reach your screen. The web is built on a simple but powerful idea: computers talking to each other.

## The Client-Server Model

The web works through a conversation between two types of computers:

```
┌─────────────┐                        ┌─────────────┐
│   CLIENT    │  ──── Request ────▶    │   SERVER    │
│  (Browser)  │                        │  (Website)  │
│             │  ◀──── Response ────   │             │
└─────────────┘                        └─────────────┘
```

- **Client**: Your web browser (Chrome, Firefox, Safari, Edge)
- **Server**: A computer that stores and serves website files

When you visit a website, your browser asks the server for files, and the server sends them back.

## What Happens When You Visit a Website?

Let's trace what happens when you type `www.example.com` in your browser:

```
1. You type URL           ─▶  Browser parses the address
                               │
2. DNS Lookup             ─▶  Domain name converts to IP address
                               │ (example.com → 93.184.216.34)
                               │
3. HTTP Request           ─▶  Browser sends request to server
                               │
4. Server Processes       ─▶  Server finds requested files
                               │
5. HTTP Response          ─▶  Server sends HTML, CSS, JS back
                               │
6. Browser Renders        ─▶  Browser displays the page
```

## URLs Explained

A URL (Uniform Resource Locator) is like a street address for web content:

```
https://www.example.com:443/products/shoes?color=blue#reviews
└──┬──┘ └───────┬───────┘└┬┘ └─────┬────┘ └────┬────┘ └──┬───┘
protocol     domain     port    path        query     fragment
```

- **Protocol**: `https://` - How to communicate (secure connection)
- **Domain**: `www.example.com` - Which server to contact
- **Port**: `:443` - Which "door" to use (usually hidden)
- **Path**: `/products/shoes` - Which file or page to get
- **Query**: `?color=blue` - Extra parameters
- **Fragment**: `#reviews` - Jump to a section on the page

## HTTP: The Language of the Web

HTTP (HyperText Transfer Protocol) is how browsers and servers communicate. Every request includes:

### HTTP Methods (What You Want to Do)

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve data | Loading a webpage |
| POST | Send data | Submitting a form |
| PUT | Update data | Editing a profile |
| DELETE | Remove data | Deleting an account |

### HTTP Status Codes (What Happened)

Servers respond with status codes:

| Code | Meaning | What It Means |
|------|---------|---------------|
| 200 | OK | Success! Here's the content |
| 301 | Moved Permanently | Page has a new address |
| 404 | Not Found | Page doesn't exist |
| 500 | Server Error | Something broke on the server |

## The Three Languages of the Web

Every webpage is built from three technologies:

```
┌────────────────────────────────────────────────────────┐
│                      WEB PAGE                          │
├──────────────────┬──────────────────┬─────────────────┤
│       HTML       │       CSS        │    JavaScript   │
│    Structure     │      Style       │    Behavior     │
│   (skeleton)     │   (appearance)   │  (interaction)  │
├──────────────────┼──────────────────┼─────────────────┤
│    Headings      │    Colors        │   Click events  │
│    Paragraphs    │    Fonts         │   Animations    │
│    Images        │    Layout        │   Form checks   │
│    Links         │    Spacing       │   Data loading  │
└──────────────────┴──────────────────┴─────────────────┘
```

In this course, we'll focus on HTML and CSS. JavaScript comes later!

## How Browsers Render Pages

When your browser receives HTML, it goes through several steps:

```
HTML → Parse → DOM Tree → Style Calculation → Layout → Paint → Display
```

1. **Parse**: Read the HTML and build a tree structure (DOM)
2. **Style**: Apply CSS rules to each element
3. **Layout**: Calculate where everything goes on screen
4. **Paint**: Draw the pixels
5. **Display**: Show the final result

## HTTPS: Security Matters

Notice that most sites use `https://` instead of `http://`. The 's' stands for 'secure':

- **HTTP**: Data sent as plain text (anyone can read it)
- **HTTPS**: Data is encrypted (only you and the server can read it)

Always use HTTPS when entering passwords or personal information!

## Key Takeaways

1. The web is built on clients (browsers) requesting files from servers
2. URLs are addresses that tell the browser where to find content
3. HTTP is the protocol browsers and servers use to communicate
4. Webpages are built with HTML (structure), CSS (style), and JavaScript (behavior)
5. HTTPS encrypts data for security

Understanding these fundamentals will help you debug issues and write better code. Next, we'll dive into HTML structure!
