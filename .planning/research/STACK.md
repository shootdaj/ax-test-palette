# Stack Research

**Domain:** Color Palette Generator API
**Researched:** 2026-03-10
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Node.js | 20 LTS | Runtime | Stable LTS, excellent Vercel support |
| Express.js | 4.x | Web framework | Most widely used Node.js framework, first-class Vercel support |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None required | - | Color math is pure arithmetic | Implement from scratch — HSL conversions and hue rotation are simple formulas |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| vitest | Testing framework | Fast, modern, built-in assertions |
| supertest | HTTP testing | Test Express endpoints without running server |
| eslint | Linting | Standard JS/Node linting |

## Installation

```bash
# Core
npm install express

# Dev dependencies
npm install -D vitest supertest eslint
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Express 4.x | Fastify | When you need higher throughput; Express is simpler for Vercel |
| vitest | jest | Legacy projects already using jest; vitest is faster |
| No color lib | chroma.js | If you need perceptual color spaces (CIELAB, etc.) |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| color.js | Unnecessary dependency for simple HSL math | Raw math functions |
| tinycolor2 | Unmaintained, large bundle | Raw math functions |

## Sources

- Express.js official docs
- Vercel Node.js deployment docs
- Color theory math references

---
*Stack research for: Color Palette Generator API*
*Researched: 2026-03-10*
