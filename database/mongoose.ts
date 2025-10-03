import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// ALLOWS THE MONGOOSE CACHE TO EXIST
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// CREATING THIS CACHE SO THAT HOT RELOAD DURING DEVELOPMENT DOES NOT CREATE A NEW MONGOOSE CONNECTION WHENEVER WE MAKE A NEW REQUEST
let cache = global.mongooseCache;

if (!cache) {
  cache = global.mongooseCache = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async () => {
  if (!MONGODB_URI)
    throw new Error(
      "Please provide a MONGODB_URI in the environment variables",
    );

  // CASE 1: ALREADY CONNECTED → JUST RETURN THE EXISTING CONNECTION
  if (cache.conn) {
    console.info("Using existing database connection");

    return cache.conn;
  }

  // CASE 2: NO CONNECTION YET → CREATE THE PROMISE
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: "stock_market",
      bufferCommands: false,
    });
  }
  try {
    // WAIT FOR PROMISE TO RESOLVE
    cache.conn = await cache.promise;
  } catch (error) {
    // IF CONNECTION FAILED, RESET THE PROMISE SO IT CAN RETRY NEXT TIME
    cache.promise = null;
    console.error("Connection failed, retrying...");
    throw error;
  }
  console.log(`Connected to database ${process.env.NODE_ENV} - ${MONGODB_URI}`);

  return cache.conn;
};
