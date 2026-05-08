import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../database.js';

const router = express.Router();

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBingoGrid() {
  const grid = [];
  const numbers = new Set();

  while (numbers.size < 24) {
    numbers.add(randomNumber(1, 75));
  }

  const numberArray = Array.from(numbers);
  for (let i = 0; i < 5; i++) {
    const row = [];
    for (let j = 0; j < 5; j++) {
      if (i === 2 && j === 2) {
        row.push('FREE');
      } else {
        const value = numberArray.pop();
        row.push(value);
      }
    }
    grid.push(row);
  }

  return grid;
}

router.post('/generate', async (req, res) => {
  try {
    const db = getDb();
    const ticketCode = `BINGO-${uuidv4().slice(0, 8).toUpperCase()}`;
    const grid = generateBingoGrid();

    await db.run(
      'INSERT INTO tickets (ticket_code, grid_numbers) VALUES (?, ?)',
      [ticketCode, JSON.stringify(grid)]
    );

    res.json({
      success: true,
      ticketCode,
      grid
    });
  } catch (error) {
    console.error('Error generating ticket:', error);
    res.status(500).json({ success: false, error: 'Failed to generate ticket' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const db = getDb();
    const ticket = await db.get('SELECT * FROM tickets WHERE ticket_code = ?', [req.params.code]);

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    res.json({
      success: true,
      ticket: {
        ...ticket,
        grid_numbers: JSON.parse(ticket.grid_numbers)
      }
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch ticket' });
  }
});

router.post('/check', async (req, res) => {
  try {
    const { ticketCode, matchedNumbers } = req.body;
    const db = getDb();

    const ticket = await db.get('SELECT * FROM tickets WHERE ticket_code = ?', [ticketCode]);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    if (ticket.is_winner) {
      return res.json({
        success: true,
        isWinner: true,
        prize: ticket.prize,
        redemptionCode: ticket.redemption_code
      });
    }

    let prize = null;
    if (matchedNumbers >= 4) prize = '3 years FREE English classes! 🎓✨';
    else if (matchedNumbers === 3) prize = '1 year FREE English classes! 📚🌟';
    else if (matchedNumbers === 2) prize = '50% discount on any 3-month course OR 10% off all cafe purchases for a month! 🍰☕';
    else if (matchedNumbers === 1) prize = 'FREE Beverage! 🥤🎉';
    else prize = 'Consolation: Free cookie on your next visit! 🍪😊';

    const isWinner = matchedNumbers >= 1;
    let redemptionCode = null;

    if (isWinner) {
      redemptionCode = `REDEEM-${uuidv4().slice(0, 8).toUpperCase()}`;
      await db.run(
        `UPDATE tickets SET is_winner = ?, prize = ?, redemption_code = ? WHERE ticket_code = ?`,
        [1, prize, redemptionCode, ticketCode]
      );

      await db.run(
        `INSERT INTO winners (ticket_id, numbers_matched, prize, redemption_code) VALUES (?, ?, ?, ?)`,
        [ticket.id, matchedNumbers, prize, redemptionCode]
      );
    }

    res.json({
      success: true,
      isWinner,
      prize,
      redemptionCode
    });
  } catch (error) {
    console.error('Error checking ticket:', error);
    res.status(500).json({ success: false, error: 'Failed to check ticket' });
  }
});

export default router;
