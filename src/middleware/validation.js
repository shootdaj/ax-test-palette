/**
 * Input validation middleware for color API.
 * Parses and normalizes color input from query params or request body.
 */

const { normalizeHex, hexToHsl, rgbToHsl, isValidRgb, isValidHsl } = require('../utils/color');

/**
 * Parse color input from request.
 * Supports three input modes:
 * 1. ?color=#ff0000 (hex)
 * 2. ?r=255&g=0&b=0 (RGB)
 * 3. ?h=0&s=100&l=50 (HSL)
 *
 * Returns the color as HSL (internal representation) or sends 400 error.
 */
function parseColorInput(req, res, next) {
  const q = req.query;

  // Try hex input
  if (q.color) {
    const normalized = normalizeHex(q.color);
    if (!normalized) {
      return res.status(400).json({
        error: 'Invalid hex color',
        message: `"${q.color}" is not a valid hex color. Use formats like #ff0000, #f00, ff0000, or f00.`,
      });
    }
    const hsl = hexToHsl(normalized);
    req.colorInput = { hex: normalized, hsl };
    return next();
  }

  // Try RGB input
  if (q.r !== undefined || q.g !== undefined || q.b !== undefined) {
    const r = Number(q.r);
    const g = Number(q.g);
    const b = Number(q.b);
    if (!isValidRgb(r, g, b)) {
      return res.status(400).json({
        error: 'Invalid RGB color',
        message: `RGB values must be numbers between 0 and 255. Got r=${q.r}, g=${q.g}, b=${q.b}.`,
      });
    }
    const hsl = rgbToHsl(r, g, b);
    req.colorInput = { rgb: { r, g, b }, hsl };
    return next();
  }

  // Try HSL input
  if (q.h !== undefined || q.s !== undefined || q.l !== undefined) {
    const h = Number(q.h);
    const s = Number(q.s);
    const l = Number(q.l);
    if (!isValidHsl(h, s, l)) {
      return res.status(400).json({
        error: 'Invalid HSL color',
        message: `HSL values must be: h (0-360), s (0-100), l (0-100). Got h=${q.h}, s=${q.s}, l=${q.l}.`,
      });
    }
    req.colorInput = { hsl: { h, s, l } };
    return next();
  }

  return res.status(400).json({
    error: 'No color provided',
    message: 'Provide a color using ?color=#ff0000 (hex), ?r=255&g=0&b=0 (RGB), or ?h=0&s=100&l=50 (HSL).',
  });
}

module.exports = { parseColorInput };
