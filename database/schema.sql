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

INSERT OR IGNORE INTO admin (username, password_hash)
VALUES ('admin', '$2a$10$VaoYlqsLjyiNZ4CJD3Q.kuGkDUvKdDau4VicZSEt1pW1ObX1Dspya');
