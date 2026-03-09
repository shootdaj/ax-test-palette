/**
 * Express app setup.
 * This file creates and configures the app but does NOT call app.listen().
 * For local dev, use server.js. For Vercel, the app is exported via api/index.js.
 */

const express = require('express');
const path = require('path');
const paletteRoutes = require('./routes/palette');
const convertRoutes = require('./routes/convert');

const app = express();

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/palette', paletteRoutes);
app.use('/api/convert', convertRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Catch-all for unknown API routes (Express 5 syntax)
app.all('/api/{*path}', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Endpoint ${req.originalUrl} does not exist. See /api/health for available endpoints.`,
  });
});

module.exports = app;
