import mongoose from "mongoose";

// Use a global variable for caching the connection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
) => {
  if (cached.conn) {
    // Return the existing connection
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  if (!cached.promise) {
    // Add options for Mongoose connection
    const options = {
      retryWrites: true, // Explicitly set to true or false
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Initialize the connection promise
    cached.promise = mongoose.connect(MONGODB_URI, options);
  }

  // Wait for the connection to be established
  cached.conn = await cached.promise;
  return cached.conn;
};
