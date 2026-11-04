const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern mongoose options are set by default
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    console.warn(`[Database Hint] Ensure MongoDB is running locally (mongodb://127.0.0.1:27017) or update MONGO_URI in backend/.env with your free MongoDB Atlas URI.`);
    // In development, keep process alive to allow hot-reloading once DB is started
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
