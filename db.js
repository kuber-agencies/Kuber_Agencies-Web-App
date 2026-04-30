const mongoose = require('mongoose');

const connectDB = async () => {
  // Guard: warn clearly if MONGO_URI is missing instead of throwing a cryptic error
  if (!process.env.MONGO_URI) {
    console.warn('⚠️  MONGO_URI not set — skipping database connection.');
    console.warn('   Set MONGO_URI in Render → Environment Variables.');
    return; // Exit gracefully — server keeps running without DB
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // Log the error clearly but DO NOT call process.exit() here.
    // The server is already listening — crashing here would take it down
    // and Render would show "Application exited early" again.
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   The server will keep running. Fix MONGO_URI and redeploy.');
  }
};

module.exports = connectDB;
