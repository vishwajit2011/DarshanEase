const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Connection already in progress
  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("MONGO_URI environment variable is not defined");
  }

  console.log("Connecting to MongoDB...");

  connectionPromise = mongoose
    .connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    })
    .then((mongooseInstance) => {
      console.log("MongoDB connected successfully");
      console.log(
        `MongoDB database: ${mongooseInstance.connection.name}`
      );

      return mongooseInstance.connection;
    })
    .catch((error) => {
      connectionPromise = null;

      console.error(
        "MongoDB connection failed:",
        error.message
      );

      throw error;
    });

  return connectionPromise;
};

module.exports = connectDB;