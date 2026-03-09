/**
 * Phase 2: API Endpoints & Validation tests.
 * Verifies consistent JSON response structure, error handling, and input format acceptance.
 */
const request = require('supertest');
const app = require('../../src/app');

describe('API-01: Consistent JSON response structure', () => {
  it('palette endpoints all return type, base, and palette fields', async () => {
    const endpoints = [
      '/api/palette/complementary',
      '/api/palette/analogous',
      '/api/palette/triadic',
      '/api/palette/split-complementary',
      '/api/palette/tetradic',
    ];

    for (const endpoint of endpoints) {
      const res = await request(app).get(`${endpoint}?color=%23ff0000`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('type');
      expect(res.body).toHaveProperty('base');
      expect(res.body).toHaveProperty('palette');
      expect(Array.isArray(res.body.palette)).toBe(true);
    }
  });

  it('convert endpoint returns hex, rgb, and hsl fields', async () => {
    const res = await request(app).get('/api/convert?color=%23ff0000');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('hex');
    expect(res.body).toHaveProperty('rgb');
    expect(res.body).toHaveProperty('hsl');
  });

  it('error responses have error and message fields', async () => {
    const res = await request(app).get('/api/convert?color=invalid');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.error).toBe('string');
    expect(typeof res.body.message).toBe('string');
  });
});

describe('API-02: Invalid input returns 400 with descriptive error', () => {
  it('invalid hex on palette endpoint', async () => {
    const res = await request(app).get('/api/palette/complementary?color=xyz');
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('not a valid hex color');
  });

  it('out-of-range RGB on palette endpoint', async () => {
    const res = await request(app).get('/api/palette/triadic?r=-5&g=0&b=0');
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('between 0 and 255');
  });

  it('out-of-range HSL on palette endpoint', async () => {
    const res = await request(app).get('/api/palette/analogous?h=0&s=200&l=50');
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('h (0-360)');
  });

  it('non-numeric RGB values', async () => {
    const res = await request(app).get('/api/convert?r=abc&g=0&b=0');
    expect(res.status).toBe(400);
  });

  it('partial RGB input (missing g)', async () => {
    const res = await request(app).get('/api/convert?r=255&b=0');
    expect(res.status).toBe(400);
  });

  it('partial HSL input (missing l)', async () => {
    const res = await request(app).get('/api/convert?h=0&s=100');
    expect(res.status).toBe(400);
  });
});

describe('API-03: Health check endpoint', () => {
  it('returns 200 with status, timestamp, version', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeTruthy();
    expect(res.body.version).toBe('1.0.0');
  });

  it('timestamp is a valid ISO date', async () => {
    const res = await request(app).get('/api/health');
    const date = new Date(res.body.timestamp);
    expect(date.toString()).not.toBe('Invalid Date');
  });
});

describe('API-04: All palette endpoints accept all color formats', () => {
  const paletteEndpoints = [
    '/api/palette/complementary',
    '/api/palette/analogous',
    '/api/palette/triadic',
    '/api/palette/split-complementary',
    '/api/palette/tetradic',
  ];

  for (const endpoint of paletteEndpoints) {
    const name = endpoint.split('/').pop();

    it(`${name} accepts hex input`, async () => {
      const res = await request(app).get(`${endpoint}?color=%2300ff00`);
      expect(res.status).toBe(200);
      expect(res.body.palette.length).toBeGreaterThanOrEqual(2);
    });

    it(`${name} accepts RGB input`, async () => {
      const res = await request(app).get(`${endpoint}?r=0&g=255&b=0`);
      expect(res.status).toBe(200);
      expect(res.body.palette.length).toBeGreaterThanOrEqual(2);
    });

    it(`${name} accepts HSL input`, async () => {
      const res = await request(app).get(`${endpoint}?h=120&s=100&l=50`);
      expect(res.status).toBe(200);
      expect(res.body.palette.length).toBeGreaterThanOrEqual(2);
    });
  }
});
