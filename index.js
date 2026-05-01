'use strict';

console.log('🚀 Starting server...');

const express = require('express');
const dotenv  = require('dotenv');
const path    = require('path');

// ── Load .env (local dev only; Render injects env vars automatically) ─────────
dotenv.config();

// ── Safe DB import ────────────────────────────────────────────────────────────
let connectDB = null;
try {
  connectDB = require('./config/db');
  console.log('✅ config/db loaded');
} catch (e) {
  console.warn('⚠️  config/db.js not found — running without DB:', e.message);
}

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Kuber Agencies</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 60px; background: #f5f5f5; }
          h1   { color: #2c3e50; }
          p    { color: #7f8c8d; }
          .badge { background: #27ae60; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>Kuber Agencies</h1>
        <p><span class="badge">✅ Server Running</span></p>
        <p>API is live on port ${process.env.PORT || 10000}</p>
      </body>
    </html>
  `);
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ── Admin route ───────────────────────────────────────────────────────────────
app.use('/admin', require('./routes/admin'));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {  // eslint-disable-line no-unused-vars
  console.error('❌ Express error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

// ── START SERVER FIRST — then connect DB ─────────────────────────────────────
const PORT   = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  console.log('══════════════════════════════════════════');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log('══════════════════════════════════════════');

  if (typeof connectDB === 'function') {
    console.log('🔌 Connecting to database...');
    connectDB();
  } else {
    console.warn('⚠️  No DB connection — server running without database.');
  }
});

// ── Crash safety nets ─────────────────────────────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message || err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message || err);
  server.close(() => process.exit(1));
});
