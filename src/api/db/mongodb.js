const mongoose = require('mongoose');
require('dotenv').config();

// Use connection URI from environment with fallback
// IMPORTANT: In production, never expose credentials in code.
// They should only come from environment variables.
const uri = process.env.MONGODB_URI2 || 'mongodb://localhost:27017/recipeplan';


// Track connection state
let dbConnection = null;

/**
 * Connect to MongoDB with reconnection logic
 */
const connectDB = async () => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri);
    console.log("Connected to MongoDB!");
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await mongoose.disconnect();
    //console.log("Disconnected from MongoDB!");
  }
};

/**
 * Get database connection
 */
const getDb = () => {
  if (!dbConnection || mongoose.connection.readyState !== 1) {
    throw new Error('No database connection. Call connectDB first!');
  }
  return dbConnection;
};

/**
 * Check connection status
 */
const getConnectionStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return {
    status: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
  };
};

module.exports = { connectDB, getDb, getConnectionStatus };