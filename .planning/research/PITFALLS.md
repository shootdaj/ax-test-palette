# Pitfalls Research

**Domain:** Color Palette Generator API
**Researched:** 2026-03-10
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Incorrect HSL-to-RGB Conversion

**What goes wrong:**
Colors look wrong because the HSL-to-RGB conversion formula has edge cases (e.g., when saturation is 0, hue is undefined).

**Why it happens:**
The HSL-to-RGB algorithm has conditional branches that are easy to get wrong.

**How to avoid:**
Use well-tested conversion formulas. Test with known color values (pure red, green, blue, white, black, grays).

**Warning signs:**
Gray colors having a color tint, or pure colors being slightly off.

**Phase to address:** Phase 1 (Core color utilities)

---

### Pitfall 2: Hue Wrapping Errors

**What goes wrong:**
Hue values go above 360 or below 0 and produce invalid colors.

**Why it happens:**
Hue rotation for harmonies (e.g., adding 120 degrees for triadic) can push hue past 360.

**How to avoid:**
Always normalize hue to [0, 360) range using modulo: `((hue % 360) + 360) % 360`.

**Warning signs:**
Palette colors being identical to the input or producing NaN values.

**Phase to address:** Phase 1 (Harmony algorithms)

---

### Pitfall 3: Hex Parsing Edge Cases

**What goes wrong:**
3-character hex codes (#RGB), missing hash prefix, or uppercase/lowercase inconsistency cause parsing failures.

**Why it happens:**
Hex colors come in multiple formats (#RGB, #RRGGBB, with/without hash).

**How to avoid:**
Normalize all hex input: strip hash, expand 3-char to 6-char, lowercase.

**Warning signs:**
API returning errors for valid colors like `#fff` or `FFF`.

**Phase to address:** Phase 1 (Input validation)

---

### Pitfall 4: Vercel Deployment - app.listen() Conflict

**What goes wrong:**
App tries to call `app.listen()` on Vercel, which conflicts with serverless model.

**Why it happens:**
Express apps typically call `app.listen()` for local dev, but Vercel handles the server.

**How to avoid:**
Export the app (`module.exports = app`) and only call `app.listen()` when not on Vercel (check `process.env.VERCEL` or use a separate entry point).

**Warning signs:**
Deployment succeeds but app crashes or times out.

**Phase to address:** Phase 3 (Frontend + deployment prep)

## "Looks Done But Isn't" Checklist

- [ ] **Color conversion:** Test roundtrip (hex→rgb→hsl→hex produces same color)
- [ ] **Palette generation:** Verify complementary of red is cyan, not some other color
- [ ] **Input validation:** Try empty string, null, "not-a-color", negative RGB values
- [ ] **Vercel config:** Ensure vercel.json routes all API calls correctly

---
*Pitfalls research for: Color Palette Generator API*
*Researched: 2026-03-10*
