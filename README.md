# Bob's Bingo

Full-stack bingo web app for generating tickets, drawing numbers, and checking winners.

## Setup

### Backend

1. Open a terminal in `backend`
2. Run `npm install`
3. Copy `.env.example` to `.env` if needed, or use the provided `.env`
4. Run `npm run dev` to start the server on port `3001`

### Frontend

1. Open a terminal in `frontend`
2. Run `npm install`
3. Run `npm run dev`
4. Open the browser at the URL shown by Vite

## Features

- Generate bingo tickets with a printable QR code
- Live draw interface for cafe staff
- Ticket checking with prizes and redemption codes
- Admin winners list and prize claiming
- Local SQLite database persisted in `backend/bingo.db`

## Project structure

- `backend/` – Express API server
- `frontend/` – React + Vite application
- `database/schema.sql` – database schema definition
