/**
 * Vercel serverless entry point.
 * Exports the Express app for Vercel to handle as a serverless function.
 */
const app = require('../src/app');

module.exports = app;
