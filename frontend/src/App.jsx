import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import TicketGenerator from './components/TicketGenerator.jsx';
import DrawInterface from './components/DrawInterface.jsx';
import CheckWinner from './components/CheckWinner.jsx';
import AdminPanel from './components/AdminPanel.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('ticket');
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen py-8 px-4">
      <Toaster position="top-center" />

      <div className="text-center mb-8">
        <div className="inline-block bg-amber-500 text-blue-900 px-6 py-2 rounded-full text-sm font-bold mb-3">
          🎯 EVERYBODY WINS! 🎯
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Bob's Bingo</h1>
        <p className="text-amber-200 text-lg">Every ticket wins a FREE beverage! ✨</p>
      </div>

      <div className="max-w-4xl mx-auto mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="prize-card">
          <div className="text-2xl mb-1">🎓</div>
          <div className="text-xs text-amber-300">4 Numbers</div>
          <div className="font-bold text-sm">3 Years FREE English!</div>
        </div>
        <div className="prize-card">
          <div className="text-2xl mb-1">📚</div>
          <div className="text-xs text-amber-300">3 Numbers</div>
          <div className="font-bold text-sm">1 Year FREE English!</div>
        </div>
        <div className="prize-card">
          <div className="text-2xl mb-1">🍰</div>
          <div className="text-xs text-amber-300">2 Numbers</div>
          <div className="font-bold text-sm">50% OFF Course</div>
        </div>
        <div className="prize-card">
          <div className="text-2xl mb-1">🥤</div>
          <div className="text-xs text-amber-300">1 Number</div>
          <div className="font-bold text-sm">FREE Beverage!</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('ticket')}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === 'ticket'
              ? 'bg-amber-500 text-blue-900'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          🎫 Get Ticket
        </button>
        <button
          onClick={() => setActiveTab('check')}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === 'check'
              ? 'bg-amber-500 text-blue-900'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          🔍 Check Ticket
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === 'live'
              ? 'bg-amber-500 text-blue-900'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          📡 Live Draw
        </button>
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            isAdmin
              ? 'bg-red-500 text-white'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          🔐 {isAdmin ? 'Exit Admin' : 'Admin'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {activeTab === 'ticket' && <TicketGenerator />}
        {activeTab === 'check' && <CheckWinner />}
        {activeTab === 'live' && <DrawInterface />}
        {isAdmin && <AdminPanel />}
      </div>

      <footer className="text-center mt-12 text-amber-200/60 text-sm">
        <p>© 2026 Bob's English Club – Greco/Lazarev Foundation</p>
        <p>Every ticket wins! 🎉 Come play at the cafe!</p>
      </footer>
    </div>
  );
}

export default App;
