# Architecture Research

**Domain:** Color Palette Generator API
**Researched:** 2026-03-10
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────┐
│              HTML Frontend (Static)              │
│         (Single page, fetches from API)          │
└────────────────────┬────────────────────────────┘
                     │ HTTP
┌────────────────────┴────────────────────────────┐
│              Express.js API Layer                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Palette  │  │ Convert  │  │  Health   │      │
│  │ Routes   │  │ Routes   │  │  Route    │      │
│  └────┬─────┘  └────┬─────┘  └──────────┘      │
│       │              │                           │
│  ┌────┴──────────────┴─────┐                    │
│  │     Color Utilities     │                    │
│  │  (conversion + harmony) │                    │
│  └─────────────────────────┘                    │
└─────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Palette Routes | Handle palette generation requests | Express router, parse input, call utilities, format response |
| Convert Routes | Handle color format conversion | Express router, parse input, call utilities, format response |
| Color Utilities | Pure functions for color math | Module with conversion and harmony functions |
| HTML Frontend | Visual interface for API | Static HTML served by Express |

## Recommended Project Structure

```
src/
├── app.js              # Express app setup, middleware, route mounting
├── routes/
│   ├── palette.js      # Palette generation endpoints
│   └── convert.js      # Color conversion endpoints
├── utils/
│   ├── color.js        # Color conversion functions (hex/rgb/hsl)
│   └── harmony.js      # Palette harmony algorithms
├── middleware/
│   └── validation.js   # Input validation middleware
└── public/
    └── index.html      # Frontend HTML page
api/
└── index.js            # Vercel serverless entry point
test/
├── unit/
│   ├── color.test.js   # Color conversion unit tests
│   └── harmony.test.js # Harmony algorithm unit tests
├── integration/
│   └── api.test.js     # API endpoint integration tests
└── scenarios/
    └── workflow.test.js # End-to-end workflow tests
```

### Structure Rationale

- **src/utils/:** Pure functions with no Express dependency — easy to test
- **src/routes/:** Thin route handlers that delegate to utils
- **src/middleware/:** Reusable validation logic
- **api/:** Vercel entry point, separate from app logic

## Architectural Patterns

### Pattern 1: Utility-First Architecture

**What:** Core logic lives in pure utility functions, routes are thin wrappers
**When to use:** Stateless APIs with computation-heavy logic
**Trade-offs:** Clean separation, easy testing; slight indirection

### Pattern 2: Vercel Serverless Adapter

**What:** Express app exported as module, Vercel routes all traffic to it
**When to use:** Deploying Express to Vercel
**Trade-offs:** Simple deployment; cold starts possible

## Data Flow

### Request Flow

```
[Client Request]
    ↓
[Express Middleware] → [Validation] → [Route Handler] → [Color Utils]
    ↓                                      ↓
[Error Response] ←─── or ───→ [JSON Response with colors]
```

---
*Architecture research for: Color Palette Generator API*
*Researched: 2026-03-10*
