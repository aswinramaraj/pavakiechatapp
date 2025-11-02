const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retries and exponential backoff.
 * This helps avoid the server exiting immediately on transient network errors
 * (useful when deploying to cloud platforms where a DB may be temporarily unreachable).
 */
const connectDB = async (options = {}) => {
  const maxRetries = options.retries || 5;
  let delay = options.initialDelayMs || 2000; // 2s
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // short serverSelectionTimeoutMS so failed attempts happen fast and we can retry
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      attempt += 1;
      console.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`);

      if (attempt >= maxRetries) {
        console.error('Max MongoDB connection attempts reached. Exiting.');
        process.exit(1);
      }

      console.log(`Retrying in ${delay} ms...`);
      // wait before retrying
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2; // exponential backoff
    }
  }
};

module.exports = connectDB;

