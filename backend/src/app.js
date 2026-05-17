import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { authRouter } from "./routes/auth.js";
import { farmsRouter } from "./routes/farms.js";
import { auctionsRouter } from "./routes/auctions.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.frontendOrigin,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "carbonx-api" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/farms", farmsRouter);
  app.use("/api/auctions", auctionsRouter);

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  });

  return app;
}
