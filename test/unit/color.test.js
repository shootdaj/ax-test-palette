const {
  normalizeHex,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  isValidRgb,
  isValidHsl,
} = require('../../src/utils/color');

describe('normalizeHex', () => {
  it('normalizes 6-char hex with hash', () => {
    expect(normalizeHex('#FF0000')).toBe('#ff0000');
  });

  it('normalizes 3-char hex with hash', () => {
    expect(normalizeHex('#f00')).toBe('#ff0000');
  });

  it('normalizes hex without hash', () => {
    expect(normalizeHex('ff0000')).toBe('#ff0000');
  });

  it('normalizes 3-char hex without hash', () => {
    expect(normalizeHex('f00')).toBe('#ff0000');
  });

  it('returns null for invalid hex', () => {
    expect(normalizeHex('xyz')).toBeNull();
    expect(normalizeHex('#gg0000')).toBeNull();
    expect(normalizeHex('')).toBeNull();
    expect(normalizeHex(null)).toBeNull();
    expect(normalizeHex(123)).toBeNull();
  });

  it('handles whitespace', () => {
    expect(normalizeHex('  #ff0000  ')).toBe('#ff0000');
  });
});

describe('hexToRgb', () => {
  it('converts red', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('converts green', () => {
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('converts blue', () => {
    expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('converts white', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('converts black', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('converts 3-char shorthand', () => {
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('returns null for invalid hex', () => {
    expect(hexToRgb('not-a-color')).toBeNull();
  });
});

describe('rgbToHex', () => {
  it('converts red', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
  });

  it('converts green', () => {
    expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
  });

  it('converts blue', () => {
    expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
  });

  it('converts white', () => {
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
  });

  it('converts black', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
  });

  it('returns null for out-of-range values', () => {
    expect(rgbToHex(256, 0, 0)).toBeNull();
    expect(rgbToHex(-1, 0, 0)).toBeNull();
  });
});

describe('rgbToHsl', () => {
  it('converts pure red', () => {
    const hsl = rgbToHsl(255, 0, 0);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it('converts pure green', () => {
    const hsl = rgbToHsl(0, 255, 0);
    expect(hsl.h).toBe(120);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it('converts pure blue', () => {
    const hsl = rgbToHsl(0, 0, 255);
    expect(hsl.h).toBe(240);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it('converts white', () => {
    const hsl = rgbToHsl(255, 255, 255);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(0);
    expect(hsl.l).toBe(100);
  });

  it('converts black', () => {
    const hsl = rgbToHsl(0, 0, 0);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(0);
    expect(hsl.l).toBe(0);
  });

  it('converts gray (no saturation)', () => {
    const hsl = rgbToHsl(128, 128, 128);
    expect(hsl.s).toBe(0);
  });

  it('returns null for invalid input', () => {
    expect(rgbToHsl(-1, 0, 0)).toBeNull();
  });
});

describe('hslToRgb', () => {
  it('converts pure red', () => {
    expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('converts pure green', () => {
    expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('converts pure blue', () => {
    expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('converts white', () => {
    expect(hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('converts black', () => {
    expect(hslToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('converts gray correctly (saturation 0)', () => {
    const rgb = hslToRgb(180, 0, 50);
    expect(rgb.r).toBe(rgb.g);
    expect(rgb.g).toBe(rgb.b);
  });

  it('returns null for invalid input', () => {
    expect(hslToRgb(-1, 0, 0)).toBeNull();
    expect(hslToRgb(0, -1, 0)).toBeNull();
    expect(hslToRgb(0, 0, -1)).toBeNull();
    expect(hslToRgb(361, 0, 0)).toBeNull();
    expect(hslToRgb(0, 101, 0)).toBeNull();
    expect(hslToRgb(0, 0, 101)).toBeNull();
  });
});

describe('hexToHsl', () => {
  it('converts red', () => {
    const hsl = hexToHsl('#ff0000');
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it('returns null for invalid hex', () => {
    expect(hexToHsl('invalid')).toBeNull();
  });
});

describe('hslToHex', () => {
  it('converts red', () => {
    expect(hslToHex(0, 100, 50)).toBe('#ff0000');
  });

  it('converts green', () => {
    expect(hslToHex(120, 100, 50)).toBe('#00ff00');
  });

  it('returns null for invalid HSL', () => {
    expect(hslToHex(-1, 0, 0)).toBeNull();
  });
});

describe('roundtrip conversions', () => {
  it('hex -> rgb -> hex preserves value', () => {
    const hex = '#3a7bd5';
    const rgb = hexToRgb(hex);
    const result = rgbToHex(rgb.r, rgb.g, rgb.b);
    expect(result).toBe(hex);
  });

  it('hex -> hsl -> hex preserves value', () => {
    const hex = '#ff0000';
    const hsl = hexToHsl(hex);
    const result = hslToHex(hsl.h, hsl.s, hsl.l);
    expect(result).toBe(hex);
  });

  it('rgb -> hsl -> rgb preserves value', () => {
    const r = 255, g = 0, b = 0;
    const hsl = rgbToHsl(r, g, b);
    const result = hslToRgb(hsl.h, hsl.s, hsl.l);
    expect(result).toEqual({ r, g, b });
  });
});

describe('isValidRgb', () => {
  it('accepts valid values', () => {
    expect(isValidRgb(0, 0, 0)).toBe(true);
    expect(isValidRgb(255, 255, 255)).toBe(true);
    expect(isValidRgb(128, 64, 32)).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(isValidRgb(-1, 0, 0)).toBe(false);
    expect(isValidRgb(256, 0, 0)).toBe(false);
    expect(isValidRgb(NaN, 0, 0)).toBe(false);
    expect(isValidRgb('a', 0, 0)).toBe(false);
  });
});

describe('isValidHsl', () => {
  it('accepts valid values', () => {
    expect(isValidHsl(0, 0, 0)).toBe(true);
    expect(isValidHsl(360, 100, 100)).toBe(true);
    expect(isValidHsl(180, 50, 50)).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(isValidHsl(-1, 0, 0)).toBe(false);
    expect(isValidHsl(361, 0, 0)).toBe(false);
    expect(isValidHsl(0, 101, 0)).toBe(false);
    expect(isValidHsl(0, 0, 101)).toBe(false);
  });
});
