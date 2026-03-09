/**
 * Palette generation routes.
 * All endpoints accept color input via query params (hex, RGB, or HSL)
 * and return a palette as an array of color objects.
 */

const { Router } = require('express');
const { parseColorInput } = require('../middleware/validation');
const harmony = require('../utils/harmony');

const router = Router();

// All palette routes use the color input parser
router.use(parseColorInput);

/**
 * GET /api/palette/complementary?color=#ff0000
 */
router.get('/complementary', (req, res) => {
  const { h, s, l } = req.colorInput.hsl;
  const palette = harmony.complementary(h, s, l);
  res.json({ type: 'complementary', base: req.colorInput, palette });
});

/**
 * GET /api/palette/analogous?color=#ff0000
 */
router.get('/analogous', (req, res) => {
  const { h, s, l } = req.colorInput.hsl;
  const palette = harmony.analogous(h, s, l);
  res.json({ type: 'analogous', base: req.colorInput, palette });
});

/**
 * GET /api/palette/triadic?color=#ff0000
 */
router.get('/triadic', (req, res) => {
  const { h, s, l } = req.colorInput.hsl;
  const palette = harmony.triadic(h, s, l);
  res.json({ type: 'triadic', base: req.colorInput, palette });
});

/**
 * GET /api/palette/split-complementary?color=#ff0000
 */
router.get('/split-complementary', (req, res) => {
  const { h, s, l } = req.colorInput.hsl;
  const palette = harmony.splitComplementary(h, s, l);
  res.json({ type: 'split-complementary', base: req.colorInput, palette });
});

/**
 * GET /api/palette/tetradic?color=#ff0000
 */
router.get('/tetradic', (req, res) => {
  const { h, s, l } = req.colorInput.hsl;
  const palette = harmony.tetradic(h, s, l);
  res.json({ type: 'tetradic', base: req.colorInput, palette });
});

module.exports = router;
