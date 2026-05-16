import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "carbonx-dev-secret",
  databasePath: process.env.DATABASE_PATH || "./data/carbonx.sqlite",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  ndviProvider: process.env.NDVI_PROVIDER || "mock",
  sentinelHub: {
    clientId: process.env.SENTINEL_HUB_CLIENT_ID || "",
    clientSecret: process.env.SENTINEL_HUB_CLIENT_SECRET || ""
  }
};
