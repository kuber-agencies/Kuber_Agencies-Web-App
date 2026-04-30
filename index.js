const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load .env file (local dev only — Render injects env vars automatically)
dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Kuber Agencies API is running ✅' });
});

// Health check — Render pings this to confirm the app is alive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Add your route files below:
// app.use('/api/users',   require('./routes/users'));
// app.use('/api/orders',  require('./routes/orders'));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ─── START SERVER FIRST ───────────────────────────────────────────────────────
// CRITICAL: app.listen() runs BEFORE DB connect.
// This ensures Render detects an open port immediately.
// If DB connect runs first and fails, Render sees no port → shuts down the app.

const PORT = process.env.PORT || 10000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

  // ── Connect to MongoDB AFTER server is up ──────────────────────────────────
  // Non-blocking: DB failure will log an error but will NOT crash the server.
  connectDB();
});

// ─── Unhandled Rejection Safety Net ──────────────────────────────────────────
// Catches any promise that rejects without a .catch() — prevents silent crashes.
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  // Gracefully close server, then exit so Render can restart it
  server.close(() => process.exit(1));
});

// Catches synchronous exceptions that bubble all the way up
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  server.close(() => process.exit(1));
});
