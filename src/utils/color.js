/**
 * Color conversion utilities.
 * All functions are pure — no side effects, no dependencies.
 *
 * Internal representation:
 * - hex: string like "#rrggbb" (always 6-char, lowercase, with hash)
 * - rgb: { r: 0-255, g: 0-255, b: 0-255 }
 * - hsl: { h: 0-360, s: 0-100, l: 0-100 }
 */

/**
 * Normalize a hex string to #rrggbb format (lowercase, 6-char, with hash).
 * Accepts: "#RGB", "#RRGGBB", "RGB", "RRGGBB" (case-insensitive).
 * Returns null if invalid.
 */
function normalizeHex(hex) {
  if (typeof hex !== 'string') return null;
  let h = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(h)) return null;
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  return '#' + h.toLowerCase();
}

/**
 * Convert hex to RGB.
 * @param {string} hex - e.g. "#ff0000", "#f00", "ff0000"
 * @returns {{ r: number, g: number, b: number } | null}
 */
function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return { r, g, b };
}

/**
 * Convert RGB to hex.
 * @param {number} r - 0-255
 * @param {number} g - 0-255
 * @param {number} b - 0-255
 * @returns {string | null} e.g. "#ff0000"
 */
function rgbToHex(r, g, b) {
  if (!isValidRgb(r, g, b)) return null;
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  const toHex = (n) => n.toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

/**
 * Convert RGB to HSL.
 * @param {number} r - 0-255
 * @param {number} g - 0-255
 * @param {number} b - 0-255
 * @returns {{ h: number, s: number, l: number } | null}
 */
function rgbToHsl(r, g, b) {
  if (!isValidRgb(r, g, b)) return null;

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60;
    } else if (max === gNorm) {
      h = ((bNorm - rNorm) / delta + 2) * 60;
    } else {
      h = ((rNorm - gNorm) / delta + 4) * 60;
    }
  }

  return {
    h: Math.round(h * 10) / 10,
    s: Math.round(s * 1000) / 10,
    l: Math.round(l * 1000) / 10,
  };
}

/**
 * Convert HSL to RGB.
 * @param {number} h - 0-360
 * @param {number} s - 0-100
 * @param {number} l - 0-100
 * @returns {{ r: number, g: number, b: number } | null}
 */
function hslToRgb(h, s, l) {
  if (!isValidHsl(h, s, l)) return null;

  const hNorm = ((h % 360) + 360) % 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r1, g1, b1;

  if (hNorm < 60) {
    [r1, g1, b1] = [c, x, 0];
  } else if (hNorm < 120) {
    [r1, g1, b1] = [x, c, 0];
  } else if (hNorm < 180) {
    [r1, g1, b1] = [0, c, x];
  } else if (hNorm < 240) {
    [r1, g1, b1] = [0, x, c];
  } else if (hNorm < 300) {
    [r1, g1, b1] = [x, 0, c];
  } else {
    [r1, g1, b1] = [c, 0, x];
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

/**
 * Convert hex to HSL.
 * @param {string} hex
 * @returns {{ h: number, s: number, l: number } | null}
 */
function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

/**
 * Convert HSL to hex.
 * @param {number} h - 0-360
 * @param {number} s - 0-100
 * @param {number} l - 0-100
 * @returns {string | null}
 */
function hslToHex(h, s, l) {
  const rgb = hslToRgb(h, s, l);
  if (!rgb) return null;
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Validate RGB values.
 */
function isValidRgb(r, g, b) {
  return (
    typeof r === 'number' &&
    typeof g === 'number' &&
    typeof b === 'number' &&
    !isNaN(r) && !isNaN(g) && !isNaN(b) &&
    r >= 0 && r <= 255 &&
    g >= 0 && g <= 255 &&
    b >= 0 && b <= 255
  );
}

/**
 * Validate HSL values.
 */
function isValidHsl(h, s, l) {
  return (
    typeof h === 'number' &&
    typeof s === 'number' &&
    typeof l === 'number' &&
    !isNaN(h) && !isNaN(s) && !isNaN(l) &&
    h >= 0 && h <= 360 &&
    s >= 0 && s <= 100 &&
    l >= 0 && l <= 100
  );
}

module.exports = {
  normalizeHex,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  isValidRgb,
  isValidHsl,
};
