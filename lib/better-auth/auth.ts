import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

// CREATE A NEW INSTANCE OF OUR AUTH AND DEFINE ITS TYPES
// ENSURES THAT WE ONLY CREATE ONE INSTANCE PREVENTING MULTIPLE CONNECTIONS
// IMPROVES PERFORMANCE AND REDUCES THE RISK OF DATA INTEGRITY ISSUES
let authInstance: ReturnType<typeof betterAuth> | null = null; // SINGLETON INSTANCE

export const getAuth = async () => {
  if (authInstance) return authInstance;

  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection not found!");

  // SETTING UP THE betterAuth so it automatically handles user collection creation in mongodb
  // IT'LL ALSO HANDLE THE SESSIONS COLLECTION
  // IT'LL MANAGE THE ACCOUNTS USING THE OAuth
  authInstance = betterAuth({
    database: mongodbAdapter(db as any), // AUTOMATICALLY UPDATE DATABASE SCHEMA WITH THIS ADAPTER
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    // MANAGE PASSWORD VERIFICATION AND HASHING
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false, // TODO: CHANGE THIS TO TRUE IN PRODUCTION
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true, // AUTO SIGN IN AFTER USING REGISTRATION
    },
    plugins: [nextCookies()],
  });
  return authInstance;
};

export const auth = await getAuth();
