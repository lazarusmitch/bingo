import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const db = await open({
    filename: join(__dirname, 'bingo.db'),
    driver: sqlite3.Database
  });
  const hashedPassword = await bcrypt.hash('admin', 10);
  await db.run('UPDATE admin SET password_hash = ? WHERE username = ?', [hashedPassword, 'admin']);
  console.log('Password updated');
  await db.close();
})();
