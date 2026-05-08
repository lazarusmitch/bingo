import React, { useState } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function CheckWinner() {
  const [ticketCode, setTicketCode] = useState('');
  const [matchedNumbers, setMatchedNumbers] = useState(0);
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleCheck = async () => {
    if (!ticketCode) {
      toast.error('Please enter your ticket code');
      return;
    }

    setChecking(true);
    try {
      const data = await api.checkTicket(ticketCode.trim().toUpperCase(), Number(matchedNumbers));
      if (data.success) {
        setResult(data);
        toast.success('Ticket checked successfully');
      } else {
        toast.error(data.error || 'Unable to check ticket');
      }
    } catch (error) {
      toast.error('Error checking ticket');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Check Your Winning Ticket</h2>
        <p className="text-amber-200">Enter your ticket code and the number of matching numbers.</p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Ticket Code (e.g. BINGO-1234ABCD)"
          value={ticketCode}
          onChange={(e) => setTicketCode(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:border-amber-500"
        />

        <label className="block text-sm text-amber-200">
          Numbers matched with the draw
          <input
            type="number"
            min="0"
            max="5"
            value={matchedNumbers}
            onChange={(e) => setMatchedNumbers(e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:border-amber-500"
          />
        </label>

        <button
          onClick={handleCheck}
          disabled={checking}
          className="w-full bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold py-3 rounded-full transition disabled:opacity-50"
        >
          {checking ? 'Checking...' : '🔎 Check Ticket'}
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-blue-950/30 border border-amber-400/30 rounded-3xl p-5">
          <h3 className="text-xl font-bold text-white mb-2">
            {result.isWinner ? '🎉 Winner!' : 'Nice Try!'}
          </h3>
          <p className="text-amber-200 mb-3">{result.prize}</p>
          {result.isWinner && result.redemptionCode && (
            <div className="rounded-2xl bg-white/10 p-4 text-left text-sm text-amber-50">
              <div className="font-semibold text-white">Redemption Code</div>
              <div className="mt-1 font-mono">{result.redemptionCode}</div>
            </div>
          )}
          {!result.isWinner && (
            <div className="text-amber-200 text-sm mt-2">Bring the ticket to the cafe for your guaranteed beverage prize.</div>
          )}
        </div>
      )}
    </div>
  );
}
