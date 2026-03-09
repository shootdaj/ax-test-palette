/**
 * Color harmony algorithms.
 * All harmonies are computed by rotating hue on the HSL color wheel.
 * Each function takes HSL input and returns an array of HSL colors (including the base).
 */

const { hslToHex, hslToRgb } = require('./color');

/**
 * Normalize hue to [0, 360) range.
 */
function normalizeHue(h) {
  return ((h % 360) + 360) % 360;
}

/**
 * Create a palette entry with all three color formats.
 * @param {number} h - hue 0-360
 * @param {number} s - saturation 0-100
 * @param {number} l - lightness 0-100
 * @returns {{ hex: string, rgb: object, hsl: object }}
 */
function colorEntry(h, s, l) {
  const hNorm = Math.round(normalizeHue(h) * 10) / 10;
  const sRound = Math.round(s * 10) / 10;
  const lRound = Math.round(l * 10) / 10;
  return {
    hex: hslToHex(hNorm, sRound, lRound),
    rgb: hslToRgb(hNorm, sRound, lRound),
    hsl: { h: hNorm, s: sRound, l: lRound },
  };
}

/**
 * Complementary palette: base + 180-degree opposite.
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {Array<{ hex, rgb, hsl }>}
 */
function complementary(h, s, l) {
  return [
    colorEntry(h, s, l),
    colorEntry(h + 180, s, l),
  ];
}

/**
 * Analogous palette: base + two neighbors at +/-30 degrees.
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {Array<{ hex, rgb, hsl }>}
 */
function analogous(h, s, l) {
  return [
    colorEntry(h - 30, s, l),
    colorEntry(h, s, l),
    colorEntry(h + 30, s, l),
  ];
}

/**
 * Triadic palette: base + two colors at 120-degree intervals.
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {Array<{ hex, rgb, hsl }>}
 */
function triadic(h, s, l) {
  return [
    colorEntry(h, s, l),
    colorEntry(h + 120, s, l),
    colorEntry(h + 240, s, l),
  ];
}

/**
 * Split-complementary palette: base + two colors adjacent to the complement.
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {Array<{ hex, rgb, hsl }>}
 */
function splitComplementary(h, s, l) {
  return [
    colorEntry(h, s, l),
    colorEntry(h + 150, s, l),
    colorEntry(h + 210, s, l),
  ];
}

/**
 * Tetradic (rectangular) palette: base + three colors forming a rectangle on the wheel.
 * Uses 60/180/240 degree offsets.
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {Array<{ hex, rgb, hsl }>}
 */
function tetradic(h, s, l) {
  return [
    colorEntry(h, s, l),
    colorEntry(h + 60, s, l),
    colorEntry(h + 180, s, l),
    colorEntry(h + 240, s, l),
  ];
}

module.exports = {
  normalizeHue,
  complementary,
  analogous,
  triadic,
  splitComplementary,
  tetradic,
};
