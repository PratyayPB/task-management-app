import dotenv from "dotenv";

dotenv.config();

function getAllowedOrigins() {
  const origins = process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || "";

  return origins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  allowedOrigins: getAllowedOrigins(),
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  clerkSignInUrl: process.env.CLERK_SIGN_IN_URL || "/sign-in",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
};

export function validateEnv(options = {}) {
  const { requireClerk = true, requireDatabase = true } = options;
  const missing = [];

  if (requireDatabase && !env.mongoUri) {
    missing.push("MONGODB_URI");
  }

  if (requireClerk) {
    if (!env.clerkPublishableKey) {
      missing.push("CLERK_PUBLISHABLE_KEY");
    }

    if (!env.clerkSecretKey) {
      missing.push("CLERK_SECRET_KEY");
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}
