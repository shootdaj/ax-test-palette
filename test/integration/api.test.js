const request = require('supertest');
const app = require('../../src/app');

describe('Health Check', () => {
  it('GET /api/health returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('version');
  });
});

describe('Convert API', () => {
  it('GET /api/convert?color=#ff0000 returns all formats', async () => {
    const res = await request(app).get('/api/convert?color=%23ff0000');
    expect(res.status).toBe(200);
    expect(res.body.hex).toBe('#ff0000');
    expect(res.body.rgb).toEqual({ r: 255, g: 0, b: 0 });
    expect(res.body.hsl.h).toBe(0);
    expect(res.body.hsl.s).toBe(100);
    expect(res.body.hsl.l).toBe(50);
  });

  it('GET /api/convert?r=0&g=255&b=0 returns all formats', async () => {
    const res = await request(app).get('/api/convert?r=0&g=255&b=0');
    expect(res.status).toBe(200);
    expect(res.body.hex).toBe('#00ff00');
    expect(res.body.rgb).toEqual({ r: 0, g: 255, b: 0 });
    expect(res.body.hsl.h).toBe(120);
  });

  it('GET /api/convert?h=240&s=100&l=50 returns all formats', async () => {
    const res = await request(app).get('/api/convert?h=240&s=100&l=50');
    expect(res.status).toBe(200);
    expect(res.body.hex).toBe('#0000ff');
    expect(res.body.rgb).toEqual({ r: 0, g: 0, b: 255 });
    expect(res.body.hsl).toEqual({ h: 240, s: 100, l: 50 });
  });

  it('returns 400 for invalid hex', async () => {
    const res = await request(app).get('/api/convert?color=not-a-color');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('message');
  });

  it('returns 400 for out-of-range RGB', async () => {
    const res = await request(app).get('/api/convert?r=300&g=0&b=0');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid RGB color');
  });

  it('returns 400 for out-of-range HSL', async () => {
    const res = await request(app).get('/api/convert?h=400&s=0&l=0');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid HSL color');
  });

  it('returns 400 when no color provided', async () => {
    const res = await request(app).get('/api/convert');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('No color provided');
  });
});

describe('Palette API', () => {
  it('GET /api/palette/complementary?color=#ff0000 returns 2 colors', async () => {
    const res = await request(app).get('/api/palette/complementary?color=%23ff0000');
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('complementary');
    expect(res.body.palette).toHaveLength(2);
    expect(res.body.palette[0].hex).toBe('#ff0000');
    expect(res.body.palette[1].hex).toBe('#00ffff');
  });

  it('GET /api/palette/analogous?color=#ff0000 returns 3 colors', async () => {
    const res = await request(app).get('/api/palette/analogous?color=%23ff0000');
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('analogous');
    expect(res.body.palette).toHaveLength(3);
  });

  it('GET /api/palette/triadic?color=#ff0000 returns 3 colors', async () => {
    const res = await request(app).get('/api/palette/triadic?color=%23ff0000');
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('triadic');
    expect(res.body.palette).toHaveLength(3);
  });

  it('GET /api/palette/split-complementary?color=#ff0000 returns 3 colors', async () => {
    const res = await request(app).get('/api/palette/split-complementary?color=%23ff0000');
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('split-complementary');
    expect(res.body.palette).toHaveLength(3);
  });

  it('GET /api/palette/tetradic?color=#ff0000 returns 4 colors', async () => {
    const res = await request(app).get('/api/palette/tetradic?color=%23ff0000');
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('tetradic');
    expect(res.body.palette).toHaveLength(4);
  });

  it('palette endpoints accept RGB input', async () => {
    const res = await request(app).get('/api/palette/complementary?r=255&g=0&b=0');
    expect(res.status).toBe(200);
    expect(res.body.palette).toHaveLength(2);
  });

  it('palette endpoints accept HSL input', async () => {
    const res = await request(app).get('/api/palette/triadic?h=0&s=100&l=50');
    expect(res.status).toBe(200);
    expect(res.body.palette).toHaveLength(3);
  });

  it('palette returns 400 for invalid color', async () => {
    const res = await request(app).get('/api/palette/complementary?color=invalid');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid hex color');
  });

  it('palette returns 400 when no color provided', async () => {
    const res = await request(app).get('/api/palette/complementary');
    expect(res.status).toBe(400);
  });

  it('each palette color has hex, rgb, and hsl properties', async () => {
    const res = await request(app).get('/api/palette/triadic?color=%23ff0000');
    expect(res.status).toBe(200);
    res.body.palette.forEach((color) => {
      expect(color).toHaveProperty('hex');
      expect(color).toHaveProperty('rgb');
      expect(color).toHaveProperty('hsl');
      expect(color.rgb).toHaveProperty('r');
      expect(color.rgb).toHaveProperty('g');
      expect(color.rgb).toHaveProperty('b');
      expect(color.hsl).toHaveProperty('h');
      expect(color.hsl).toHaveProperty('s');
      expect(color.hsl).toHaveProperty('l');
    });
  });
});

describe('404 for unknown API routes', () => {
  it('returns 404 for unknown /api/* route', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not found');
  });
});
