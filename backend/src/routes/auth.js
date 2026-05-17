import bcrypt from "bcryptjs";
import express from "express";
import { get, run } from "../db.js";
import { signToken } from "../middleware/auth.js";

export const authRouter = express.Router();

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    createdAt: user.created_at
  };
}

authRouter.post("/register", async (req, res, next) => {
  try {
    const { name, phone, password, role } = req.body;

    if (!name || !phone || !password) {
      res.status(400).json({ message: "Name, phone, and password are required." });
      return;
    }

    if (String(password).length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters." });
      return;
    }

    const validRole = (role === 'buyer') ? 'buyer' : 'farmer';

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await run(
      "INSERT INTO users (name, phone, password_hash, role) VALUES (?, ?, ?, ?)",
      [String(name).trim(), String(phone).trim(), passwordHash, validRole]
    );
    const user = await get("SELECT id, name, phone, role, created_at FROM users WHERE id = ?", [
      result.id
    ]);

    res.status(201).json({ user: sanitizeUser(user), token: signToken(user) });
  } catch (error) {
    if (error.message.includes("UNIQUE")) {
      res.status(409).json({ message: "A user with this phone number already exists." });
      return;
    }
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({ message: "Phone and password are required." });
      return;
    }

    const user = await get("SELECT * FROM users WHERE phone = ?", [String(phone).trim()]);
    const passwordMatches = user
      ? await bcrypt.compare(String(password), user.password_hash)
      : false;

    if (!passwordMatches) {
      res.status(401).json({ message: "Invalid phone or password." });
      return;
    }

    res.json({ user: sanitizeUser(user), token: signToken(user) });
  } catch (error) {
    next(error);
  }
});
