# Color Palette Generator API

## What This Is

A Color Palette Generator API built with Express.js that provides endpoints to generate color palettes (complementary, analogous, triadic, split-complementary, tetradic), convert between color formats (hex, RGB, HSL), and includes a simple HTML frontend for interactive use. It is designed for developers who need programmatic color palette generation and designers who want a quick visual tool.

## Core Value

Generate accurate, harmonious color palettes from any input color using standard color theory algorithms — the API must return correct colors for all harmony types.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Generate complementary color palettes from a base color
- [ ] Generate analogous color palettes from a base color
- [ ] Generate triadic color palettes from a base color
- [ ] Generate split-complementary color palettes from a base color
- [ ] Generate tetradic (rectangular) color palettes from a base color
- [ ] Convert colors between hex, RGB, and HSL formats
- [ ] REST API with JSON responses for all palette and conversion endpoints
- [ ] Simple HTML frontend to visually generate and preview palettes
- [ ] Input validation for all color formats
- [ ] Error handling with meaningful error messages

### Out of Scope

- User authentication — this is a stateless utility API
- Database/persistence — no need to save palettes
- Rate limiting — not needed for v1
- WebSocket/real-time features — REST is sufficient
- Mobile app — web frontend only

## Context

- Stateless API: no database, no auth, no sessions
- Color theory math: hue rotation on HSL color wheel for harmonies
- Target deployment: Vercel (serverless)
- Must export `module.exports = app` for Vercel compatibility (no `app.listen` in production)
- Needs a `vercel.json` for routing configuration

## Constraints

- **Tech stack**: Node.js + Express.js — lightweight, well-suited for Vercel
- **No external dependencies for color math**: Implement color conversion and harmony algorithms from scratch (simple math, no need for heavy libraries)
- **Deployment**: Must work on Vercel as a serverless function

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Express.js over Fastify | Simpler setup, better Vercel support, widely understood | — Pending |
| No color library (chroma.js, color, etc.) | Color math is simple enough to implement; avoids dependency bloat | — Pending |
| HSL as internal representation | Easier to compute harmonies (hue rotation) | — Pending |

---
*Last updated: 2026-03-10 after initialization*
