import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

router.get('/current', async (req, res) => {
  try {
    const db = getDb();
    let currentDraw = await db.get(
      'SELECT * FROM draws WHERE game_active = 1 ORDER BY id DESC LIMIT 1'
    );

    if (!currentDraw) {
      await db.run('INSERT INTO draws (numbers_drawn, game_active) VALUES (?, ?)', [JSON.stringify([]), 1]);
      currentDraw = await db.get('SELECT * FROM draws WHERE game_active = 1 ORDER BY id DESC LIMIT 1');
    }

    res.json({
      success: true,
      draw: {
        ...currentDraw,
        numbers_drawn: JSON.parse(currentDraw.numbers_drawn)
      }
    });
  } catch (error) {
    console.error('Error fetching draw:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch draw' });
  }
});

router.post('/draw', async (req, res) => {
  try {
    const { adminKey } = req.body;
    if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'bingo2026') {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const db = getDb();
    const currentDraw = await db.get('SELECT * FROM draws WHERE game_active = 1 ORDER BY id DESC LIMIT 1');
    let numbersDrawn = currentDraw ? JSON.parse(currentDraw.numbers_drawn) : [];

    if (numbersDrawn.length >= 75) {
      return res.status(400).json({ success: false, error: 'All numbers have been drawn' });
    }

    let newNumber;
    do {
      newNumber = Math.floor(Math.random() * 75) + 1;
    } while (numbersDrawn.includes(newNumber));

    numbersDrawn.push(newNumber);

    await db.run('UPDATE draws SET numbers_drawn = ? WHERE id = ?', [JSON.stringify(numbersDrawn), currentDraw.id]);

    res.json({
      success: true,
      number: newNumber,
      numbersDrawn
    });
  } catch (error) {
    console.error('Error drawing number:', error);
    res.status(500).json({ success: false, error: 'Failed to draw number' });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const { adminKey } = req.body;
    if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'bingo2026') {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const db = getDb();
    await db.run('UPDATE draws SET game_active = 0 WHERE game_active = 1');
    await db.run('INSERT INTO draws (numbers_drawn, game_active) VALUES (?, ?)', [JSON.stringify([]), 1]);
    await db.run('UPDATE tickets SET is_winner = 0, prize = NULL, redemption_code = NULL WHERE claimed = 0');

    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting game:', error);
    res.status(500).json({ success: false, error: 'Failed to reset game' });
  }
});

export default router;
