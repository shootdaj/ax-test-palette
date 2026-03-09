/**
 * Phase 3: Frontend & Deployment scenario tests.
 * Verifies the HTML frontend is served and the Vercel entry point works.
 */
const request = require('supertest');
const app = require('../../src/app');

describe('Frontend Serving', () => {
  it('serves index.html at root path', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('Color Palette Generator');
  });

  it('index.html contains color picker input', async () => {
    const res = await request(app).get('/');
    expect(res.text).toContain('type="color"');
    expect(res.text).toContain('id="colorPicker"');
  });

  it('index.html contains harmony type selector', async () => {
    const res = await request(app).get('/');
    expect(res.text).toContain('id="harmonyType"');
    expect(res.text).toContain('complementary');
    expect(res.text).toContain('analogous');
    expect(res.text).toContain('triadic');
    expect(res.text).toContain('split-complementary');
    expect(res.text).toContain('tetradic');
  });

  it('index.html displays hex, RGB, and HSL values', async () => {
    const res = await request(app).get('/');
    expect(res.text).toContain('HEX');
    expect(res.text).toContain('RGB');
    expect(res.text).toContain('HSL');
  });
});

describe('Vercel Entry Point', () => {
  it('api/index.js exports the Express app', () => {
    const vercelApp = require('../../api/index');
    expect(vercelApp).toBeDefined();
    expect(typeof vercelApp).toBe('function');
  });

  it('exported app responds to health check', async () => {
    const vercelApp = require('../../api/index');
    const res = await request(vercelApp).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Full User Journey: Frontend to API', () => {
  it('user visits frontend, then calls API for palette', async () => {
    // Step 1: Visit the frontend
    const frontendRes = await request(app).get('/');
    expect(frontendRes.status).toBe(200);
    expect(frontendRes.text).toContain('Color Palette Generator');

    // Step 2: Use the API to generate a palette (as the frontend JS would)
    const paletteRes = await request(app).get('/api/palette/complementary?color=%234d96ff');
    expect(paletteRes.status).toBe(200);
    expect(paletteRes.body.type).toBe('complementary');
    expect(paletteRes.body.palette).toHaveLength(2);

    // Step 3: Each palette color should have all display formats
    paletteRes.body.palette.forEach((color) => {
      expect(color.hex).toMatch(/^#[0-9a-f]{6}$/);
      expect(color.rgb).toHaveProperty('r');
      expect(color.rgb).toHaveProperty('g');
      expect(color.rgb).toHaveProperty('b');
      expect(color.hsl).toHaveProperty('h');
      expect(color.hsl).toHaveProperty('s');
      expect(color.hsl).toHaveProperty('l');
    });

    // Step 4: Convert a color to see all formats
    const convertRes = await request(app).get('/api/convert?color=%234d96ff');
    expect(convertRes.status).toBe(200);
    expect(convertRes.body.hex).toBe('#4d96ff');
  });
});
