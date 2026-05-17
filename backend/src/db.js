import fs from "node:fs";
import path from "node:path";
import sqlite3 from "sqlite3";
import { config } from "./config.js";

sqlite3.verbose();

const dbPath = path.resolve(config.databasePath);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new sqlite3.Database(dbPath);

export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

export async function migrate() {
  // Check if role column exists in users table
  const usersTableInfo = await all("PRAGMA table_info(users)");
  const hasRoleColumn = usersTableInfo.some(column => column.name === 'role');

  if (usersTableInfo.length === 0) {
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'buyer')),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } else if (!hasRoleColumn) {
    await run("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'buyer'))");
  }

  await run(`
    CREATE TABLE IF NOT EXISTS farms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      boundary_geojson TEXT NOT NULL,
      area_acres REAL NOT NULL,
      ndvi_score REAL,
      tco2e_estimate REAL,
      earnings_estimate_inr REAL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'calculated', 'verified')),
      nft_token_id INTEGER,
      nft_contract_address TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Check if nft columns exist in farms table
  const farmsTableInfo = await all("PRAGMA table_info(farms)");
  if (!farmsTableInfo.some(column => column.name === 'nft_token_id')) {
    await run("ALTER TABLE farms ADD COLUMN nft_token_id INTEGER");
  }
  if (!farmsTableInfo.some(column => column.name === 'nft_contract_address')) {
    await run("ALTER TABLE farms ADD COLUMN nft_contract_address TEXT");
  }

  await run(`
    CREATE TABLE IF NOT EXISTS auctions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farm_id INTEGER NOT NULL,
      seller_id INTEGER NOT NULL,
      blockchain_auction_id INTEGER,
      min_bid_eth REAL NOT NULL,
      end_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')),
      highest_bidder_id INTEGER,
      highest_bid_eth REAL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (highest_bidder_id) REFERENCES users(id)
    )
  `);
}

export function closeDb() {
  return new Promise((resolve, reject) => {
    db.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}
