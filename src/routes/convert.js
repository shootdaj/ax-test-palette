/**
 * Color conversion routes.
 * Endpoints for converting between hex, RGB, and HSL formats.
 */

const { Router } = require('express');
const color = require('../utils/color');

const router = Router();

/**
 * GET /api/convert?color=#ff0000
 * GET /api/convert?r=255&g=0&b=0
 * GET /api/convert?h=0&s=100&l=50
 *
 * Returns the color in all three formats.
 */
router.get('/', (req, res) => {
  const q = req.query;

  // Hex input
  if (q.color) {
    const normalized = color.normalizeHex(q.color);
    if (!normalized) {
      return res.status(400).json({
        error: 'Invalid hex color',
        message: `"${q.color}" is not a valid hex color. Use formats like #ff0000, #f00, ff0000, or f00.`,
      });
    }
    const rgb = color.hexToRgb(normalized);
    const hsl = color.hexToHsl(normalized);
    return res.json({ hex: normalized, rgb, hsl });
  }

  // RGB input
  if (q.r !== undefined || q.g !== undefined || q.b !== undefined) {
    const r = Number(q.r);
    const g = Number(q.g);
    const b = Number(q.b);
    if (!color.isValidRgb(r, g, b)) {
      return res.status(400).json({
        error: 'Invalid RGB color',
        message: `RGB values must be numbers between 0 and 255. Got r=${q.r}, g=${q.g}, b=${q.b}.`,
      });
    }
    const hex = color.rgbToHex(r, g, b);
    const hsl = color.rgbToHsl(r, g, b);
    return res.json({ hex, rgb: { r, g, b }, hsl });
  }

  // HSL input
  if (q.h !== undefined || q.s !== undefined || q.l !== undefined) {
    const h = Number(q.h);
    const s = Number(q.s);
    const l = Number(q.l);
    if (!color.isValidHsl(h, s, l)) {
      return res.status(400).json({
        error: 'Invalid HSL color',
        message: `HSL values must be: h (0-360), s (0-100), l (0-100). Got h=${q.h}, s=${q.s}, l=${q.l}.`,
      });
    }
    const hex = color.hslToHex(h, s, l);
    const rgb = color.hslToRgb(h, s, l);
    return res.json({ hex, rgb, hsl: { h, s, l } });
  }

  return res.status(400).json({
    error: 'No color provided',
    message: 'Provide a color using ?color=#ff0000 (hex), ?r=255&g=0&b=0 (RGB), or ?h=0&s=100&l=50 (HSL).',
  });
});

module.exports = router;
