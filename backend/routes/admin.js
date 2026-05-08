import express from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../database.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = getDb();

    const admin = await db.get('SELECT * FROM admin WHERE username = ?', [username]);
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    res.json({ success: true, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

router.get('/winners', async (req, res) => {
  try {
    const db = getDb();
    const winners = await db.all(
      `SELECT w.*, t.ticket_code
       FROM winners w
       JOIN tickets t ON w.ticket_id = t.id
       ORDER BY w.id DESC`
    );
    res.json({ success: true, winners });
  } catch (error) {
    console.error('Error fetching winners:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch winners' });
  }
});

router.post('/claim/:redemptionCode', async (req, res) => {
  try {
    const { redemptionCode } = req.params;
    const db = getDb();

    await db.run(
      `UPDATE winners SET claimed = 1, claimed_at = CURRENT_TIMESTAMP WHERE redemption_code = ?`,
      [redemptionCode]
    );
    await db.run(
      `UPDATE tickets SET claimed = 1 WHERE redemption_code = ?`,
      [redemptionCode]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error claiming prize:', error);
    res.status(500).json({ success: false, error: 'Failed to claim prize' });
  }
});

router.get('/tickets', async (req, res) => {
  try {
    const db = getDb();
    const tickets = await db.all('SELECT * FROM tickets ORDER BY id DESC LIMIT 100');
    res.json({ success: true, tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tickets' });
  }
});

export default router;
