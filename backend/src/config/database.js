/**
 * Database configuration and connection setup
 * Handles MongoDB connection using Mongoose
 */
const mongoose = require("mongoose");

/**
 * Establishes connection to MongoDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/live-chat";

    const options = {
      // Set max pool size
      maxPoolSize: 10,
      // Set server selection timeout
      serverSelectionTimeoutMS: 5000,
      // Set socket timeout
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

/**
 * Closes database connection
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
