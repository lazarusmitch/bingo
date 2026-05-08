import React, { useState, useEffect } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function DrawInterface() {
  const [draw, setDraw] = useState(null);
  const [lastNumber, setLastNumber] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    loadDraw();
  }, []);

  const loadDraw = async () => {
    const data = await api.getCurrentDraw();
    if (data.success) {
      setDraw(data.draw);
    }
  };

  const handleDrawNumber = async () => {
    if (!adminKey) {
      toast.error('Enter admin key to draw numbers');
      return;
    }
    setDrawing(true);
    try {
      const data = await api.drawNumber(adminKey);
      if (data.success) {
        setLastNumber(data.number);
        setDraw({ ...draw, numbers_drawn: data.numbersDrawn });
        toast.success(`🎲 Number ${data.number} drawn!`);
      } else {
        toast.error(data.error || 'Failed to draw number');
      }
    } catch (error) {
      toast.error('Error drawing number');
    } finally {
      setDrawing(false);
    }
  };

  const handleResetGame = async () => {
    if (!adminKey) {
      toast.error('Enter admin key to reset game');
      return;
    }
    if (confirm('Reset the game? All current tickets will be reset.')) {
      const data = await api.resetGame(adminKey);
      if (data.success) {
        toast.success('Game reset! New game started.');
        loadDraw();
        setLastNumber(null);
      } else {
        toast.error('Failed to reset game');
      }
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">📡 Live Bingo Draw</h2>
        <p className="text-amber-200">Watch numbers as they're drawn!</p>
      </div>

      {lastNumber && (
        <div className="text-center mb-6 animate-bounce">
          <div className="inline-block bg-amber-500 rounded-full p-4">
            <div className="text-5xl font-bold text-blue-900">{lastNumber}</div>
          </div>
          <div className="text-white mt-2">Last Number Drawn!</div>
        </div>
      )}

      {draw && (
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 text-center">Drawn Numbers ({draw.numbers_drawn.length})</h3>
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-2 bg-white/5 rounded-lg">
            {draw.numbers_drawn.length > 0 ? (
              draw.numbers_drawn.map((num, idx) => (
                <div key={idx} className="bg-amber-500 text-blue-900 font-bold rounded-lg p-2 text-center text-sm">
                  {num}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-amber-200/50 py-4">
                No numbers drawn yet. Start the game!
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-white/20 pt-4 mt-4">
        <button
          onClick={() => setIsAdminMode(!isAdminMode)}
          className="text-amber-300 text-sm underline w-full text-center"
        >
          {isAdminMode ? 'Hide Admin Controls' : 'Show Admin Controls (Cafe Staff Only)'}
        </button>

        {isAdminMode && (
          <div className="mt-4 space-y-3">
            <input
              type="password"
              placeholder="Admin Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-amber-500"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDrawNumber}
                disabled={drawing}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold py-2 rounded-full transition disabled:opacity-50"
              >
                {drawing ? 'Drawing...' : '🎲 Draw Next Number'}
              </button>
              <button
                onClick={handleResetGame}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-full transition"
              >
                🔄 Reset Game
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-amber-200/70 mt-6">
        💡 Numbers are drawn live at the cafe. Check your ticket against the drawn numbers to win!
      </div>
    </div>
  );
}
