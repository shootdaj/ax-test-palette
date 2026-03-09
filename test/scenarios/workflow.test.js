const request = require('supertest');
const app = require('../../src/app');

describe('Full Color Palette Workflow', () => {
  it('user converts a hex color then generates all palette types', async () => {
    // Step 1: Convert hex to get all formats
    const convertRes = await request(app).get('/api/convert?color=%233a7bd5');
    expect(convertRes.status).toBe(200);
    const { hsl } = convertRes.body;
    expect(hsl).toBeDefined();

    // Step 2: Generate all palette types using the HSL values
    const paletteTypes = [
      'complementary',
      'analogous',
      'triadic',
      'split-complementary',
      'tetradic',
    ];

    for (const type of paletteTypes) {
      const paletteRes = await request(app).get(
        `/api/palette/${type}?h=${hsl.h}&s=${hsl.s}&l=${hsl.l}`
      );
      expect(paletteRes.status).toBe(200);
      expect(paletteRes.body.type).toBe(type);
      expect(paletteRes.body.palette.length).toBeGreaterThanOrEqual(2);

      // Every color in the palette should have all three formats
      paletteRes.body.palette.forEach((color) => {
        expect(color.hex).toMatch(/^#[0-9a-f]{6}$/);
        expect(color.rgb.r).toBeGreaterThanOrEqual(0);
        expect(color.rgb.r).toBeLessThanOrEqual(255);
        expect(color.hsl.h).toBeGreaterThanOrEqual(0);
        expect(color.hsl.h).toBeLessThanOrEqual(360);
      });
    }
  });

  it('user tries invalid inputs and gets helpful error messages', async () => {
    // Invalid hex
    const badHex = await request(app).get('/api/convert?color=not-a-color');
    expect(badHex.status).toBe(400);
    expect(badHex.body.message).toContain('not a valid hex color');

    // Out-of-range RGB
    const badRgb = await request(app).get('/api/convert?r=999&g=0&b=0');
    expect(badRgb.status).toBe(400);
    expect(badRgb.body.message).toContain('between 0 and 255');

    // Out-of-range HSL
    const badHsl = await request(app).get('/api/convert?h=999&s=0&l=0');
    expect(badHsl.status).toBe(400);
    expect(badHsl.body.message).toContain('h (0-360)');

    // No color at all
    const noColor = await request(app).get('/api/palette/complementary');
    expect(noColor.status).toBe(400);
    expect(noColor.body.message).toContain('Provide a color');
  });

  it('user generates a complementary palette from RGB and verifies math', async () => {
    // Pure red -> complementary should be cyan
    const res = await request(app).get('/api/palette/complementary?r=255&g=0&b=0');
    expect(res.status).toBe(200);

    const [base, complement] = res.body.palette;
    expect(base.hex).toBe('#ff0000');
    expect(complement.hex).toBe('#00ffff');

    // Verify the hue difference is exactly 180
    const hueDiff = Math.abs(complement.hsl.h - base.hsl.h);
    expect(hueDiff).toBe(180);
  });

  it('user verifies health check provides server status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(new Date(res.body.timestamp)).toBeInstanceOf(Date);
    expect(res.body.version).toBe('1.0.0');
  });

  it('user converts between all format pairs roundtrip', async () => {
    // Start with a known color
    const original = '#3a7bd5';

    // Hex -> get all formats
    const step1 = await request(app).get(`/api/convert?color=%23${original.slice(1)}`);
    expect(step1.status).toBe(200);
    const { rgb, hsl } = step1.body;

    // RGB -> verify same hex
    const step2 = await request(app).get(`/api/convert?r=${rgb.r}&g=${rgb.g}&b=${rgb.b}`);
    expect(step2.status).toBe(200);
    expect(step2.body.hex).toBe(original);

    // HSL -> verify same hex
    const step3 = await request(app).get(`/api/convert?h=${hsl.h}&s=${hsl.s}&l=${hsl.l}`);
    expect(step3.status).toBe(200);
    expect(step3.body.hex).toBe(original);
  });
});
