import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function signToken(user) {
  return jwt.sign({ sub: user.id, phone: user.phone }, config.jwtSecret, {
    expiresIn: "24h"
  });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = { id: Number(payload.sub), phone: payload.phone };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}
