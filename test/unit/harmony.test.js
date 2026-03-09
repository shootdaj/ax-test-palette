const {
  normalizeHue,
  complementary,
  analogous,
  triadic,
  splitComplementary,
  tetradic,
} = require('../../src/utils/harmony');

describe('normalizeHue', () => {
  it('keeps values in range', () => {
    expect(normalizeHue(180)).toBe(180);
  });

  it('wraps values above 360', () => {
    expect(normalizeHue(400)).toBe(40);
  });

  it('wraps negative values', () => {
    expect(normalizeHue(-30)).toBe(330);
  });

  it('wraps 360 to 0', () => {
    expect(normalizeHue(360)).toBe(0);
  });
});

describe('complementary', () => {
  it('returns 2 colors', () => {
    const palette = complementary(0, 100, 50);
    expect(palette).toHaveLength(2);
  });

  it('second color is 180 degrees from base', () => {
    const palette = complementary(0, 100, 50);
    expect(palette[0].hsl.h).toBe(0);
    expect(palette[1].hsl.h).toBe(180);
  });

  it('wraps hue past 360', () => {
    const palette = complementary(200, 100, 50);
    expect(palette[1].hsl.h).toBe(20); // 200 + 180 = 380 -> 20
  });

  it('preserves saturation and lightness', () => {
    const palette = complementary(60, 75, 40);
    palette.forEach((c) => {
      expect(c.hsl.s).toBe(75);
      expect(c.hsl.l).toBe(40);
    });
  });

  it('red complement is cyan', () => {
    const palette = complementary(0, 100, 50);
    expect(palette[0].hex).toBe('#ff0000');
    expect(palette[1].hex).toBe('#00ffff');
  });

  it('includes all three color formats', () => {
    const palette = complementary(0, 100, 50);
    palette.forEach((c) => {
      expect(c).toHaveProperty('hex');
      expect(c).toHaveProperty('rgb');
      expect(c).toHaveProperty('hsl');
    });
  });
});

describe('analogous', () => {
  it('returns 3 colors', () => {
    const palette = analogous(60, 100, 50);
    expect(palette).toHaveLength(3);
  });

  it('colors are at -30, 0, +30 degrees', () => {
    const palette = analogous(60, 100, 50);
    expect(palette[0].hsl.h).toBe(30);
    expect(palette[1].hsl.h).toBe(60);
    expect(palette[2].hsl.h).toBe(90);
  });

  it('wraps negative hues', () => {
    const palette = analogous(10, 100, 50);
    expect(palette[0].hsl.h).toBe(340); // 10 - 30 = -20 -> 340
  });
});

describe('triadic', () => {
  it('returns 3 colors', () => {
    const palette = triadic(0, 100, 50);
    expect(palette).toHaveLength(3);
  });

  it('colors are at 0, 120, 240 degrees', () => {
    const palette = triadic(0, 100, 50);
    expect(palette[0].hsl.h).toBe(0);
    expect(palette[1].hsl.h).toBe(120);
    expect(palette[2].hsl.h).toBe(240);
  });

  it('triadic from red gives red, green, blue', () => {
    const palette = triadic(0, 100, 50);
    expect(palette[0].hex).toBe('#ff0000');
    expect(palette[1].hex).toBe('#00ff00');
    expect(palette[2].hex).toBe('#0000ff');
  });
});

describe('splitComplementary', () => {
  it('returns 3 colors', () => {
    const palette = splitComplementary(0, 100, 50);
    expect(palette).toHaveLength(3);
  });

  it('colors are at 0, 150, 210 degrees', () => {
    const palette = splitComplementary(0, 100, 50);
    expect(palette[0].hsl.h).toBe(0);
    expect(palette[1].hsl.h).toBe(150);
    expect(palette[2].hsl.h).toBe(210);
  });
});

describe('tetradic', () => {
  it('returns 4 colors', () => {
    const palette = tetradic(0, 100, 50);
    expect(palette).toHaveLength(4);
  });

  it('colors are at 0, 60, 180, 240 degrees', () => {
    const palette = tetradic(0, 100, 50);
    expect(palette[0].hsl.h).toBe(0);
    expect(palette[1].hsl.h).toBe(60);
    expect(palette[2].hsl.h).toBe(180);
    expect(palette[3].hsl.h).toBe(240);
  });
});
