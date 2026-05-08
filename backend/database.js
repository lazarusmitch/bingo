import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db;

export async function initializeDatabase() {
  db = await open({
    filename: join(__dirname, 'bingo.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_code TEXT UNIQUE NOT NULL,
      grid_numbers TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_winner BOOLEAN DEFAULT 0,
      prize TEXT,
      redemption_code TEXT,
      claimed BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS draws (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      draw_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      numbers_drawn TEXT NOT NULL,
      game_active BOOLEAN DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS winners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER,
      numbers_matched INTEGER,
      prize TEXT,
      redemption_code TEXT UNIQUE,
      claimed BOOLEAN DEFAULT 0,
      claimed_at DATETIME,
      FOREIGN KEY (ticket_id) REFERENCES tickets(id)
    );

    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);

  const adminExists = await db.get('SELECT 1 FROM admin WHERE username = ?', ['admin']);
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('bingo2026', 10);
    await db.run('INSERT INTO admin (username, password_hash) VALUES (?, ?)', ['admin', hashedPassword]);
  }

  return db;
}

export function getDb() {
  return db;
}
