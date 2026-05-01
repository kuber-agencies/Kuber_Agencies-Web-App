'use strict';

const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('⚠️  MONGO_URI not set. Skipping DB connection.');
    console.warn('   → Add MONGO_URI in Render: Dashboard → Environment.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () =>
      console.warn('⚠️  MongoDB disconnected. Retrying...')
    );
    mongoose.connection.on('error', (err) =>
      console.error('❌ MongoDB error:', err.message)
    );

  } catch (err) {
    // ⚠️ Log but never crash — HTTP server must keep running
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   → Check MONGO_URI and Atlas IP whitelist (0.0.0.0/0)');
  }
};

module.exports = connectDB;
