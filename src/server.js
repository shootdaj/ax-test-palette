/**
 * Local development server entry point.
 * Only used for `npm start` — Vercel uses api/index.js instead.
 */

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Color Palette Generator API running at http://localhost:${PORT}`);
});
