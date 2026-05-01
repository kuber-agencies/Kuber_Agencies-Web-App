'use strict';

const mongoose = require('mongoose');

/**
 * connectDB
 * ---------
 * Connects to MongoDB using the MONGO_URI environment variable.
 *
 * Rules that keep this safe for Render:
 *   1. If MONGO_URI is missing → logs a warning, returns early (no crash).
 *   2. If mongoose.connect() throws → logs the error, returns (no crash).
 *   3. Never calls process.exit() — the HTTP server must keep running.
 */
const connectDB = async () => {

  // ── Guard: missing env var ─────────────────────────────────────────────────
  if (!process.env.MONGO_URI) {
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.warn('⚠️  MONGO_URI is not set.');
    console.warn('   → Add it in Render: Dashboard → Environment.');
    console.warn('   → Locally: add it to your .env file.');
    console.warn('   The server will run WITHOUT a DB connection.');
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return;
  }

  // ── Attempt connection ─────────────────────────────────────────────────────
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅  MongoDB connected → ${conn.connection.host}`);

    // ── Connection-level event listeners ──────────────────────────────────
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect…');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅  MongoDB reconnected.');
    });

    mongoose.connection.on('error', (err) => {
      // Log but never crash the process
      console.error('❌  MongoDB runtime error:', err.message);
    });

  } catch (err) {
    // ── Connection failed ──────────────────────────────────────────────────
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌  MongoDB connection FAILED:', err.message);
    console.error('   Common causes:');
    console.error('   • Wrong MONGO_URI (typo in username/password/cluster)');
    console.error('   • IP not whitelisted in MongoDB Atlas (use 0.0.0.0/0)');
    console.error('   • Network issue on Render side');
    console.error('   The HTTP server will keep running.');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    // Intentionally NO process.exit() here
  }
};

module.exports = connectDB;
