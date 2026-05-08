import React, { useEffect, useState } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [winners, setWinners] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await api.adminLogin(username, password);
      if (data.success) {
        setToken(data.token);
        api.setAdminToken(data.token);
        toast.success('Admin login successful');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Unable to login');
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    const winnersData = await api.getWinners();
    if (winnersData.success) {
      setWinners(winnersData.winners);
    }
    const ticketsData = await api.getTickets();
    if (ticketsData.success) {
      setTickets(ticketsData.tickets);
    }
  };

  const handleClaim = async (redemptionCode) => {
    const response = await api.claimPrize(redemptionCode);
    if (response.success) {
      toast.success('Prize marked as claimed');
      loadAdminData();
    } else {
      toast.error(response.error || 'Failed to claim');
    }
  };

  if (!token) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Admin Panel</h2>
        <p className="text-amber-200 mb-4">Login with cafe staff credentials to manage winners.</p>
        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:border-amber-500"
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:border-amber-500"
            placeholder="Password"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold py-3 rounded-full transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : '🔐 Sign in'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-amber-200">Review winners, tickets, and claim status.</p>
        </div>
        <button
          onClick={() => {
            api.clearAdminToken();
            setToken(null);
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Sign out
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-blue-950/30 rounded-3xl p-5 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Winners</h3>
          {winners.length === 0 ? (
            <p className="text-amber-200/80">No winners recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {winners.map((winner) => (
                <div key={winner.id} className="rounded-2xl bg-white/10 p-4 border border-white/10">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm text-amber-200/90">{winner.ticket_code}</div>
                      <div className="text-white font-semibold">{winner.prize}</div>
                    </div>
                    <button
                      onClick={() => handleClaim(winner.redemption_code)}
                      disabled={winner.claimed}
                      className="bg-amber-500 hover:bg-amber-600 text-blue-900 font-semibold px-3 py-2 rounded-full transition disabled:opacity-50"
                    >
                      {winner.claimed ? 'Claimed' : 'Mark Claimed'}
                    </button>
                  </div>
                  <div className="text-xs text-amber-200/70 mt-2">
                    {winner.numbers_matched} matches • {winner.redemption_code}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-950/30 rounded-3xl p-5 border border-white/10 overflow-auto max-h-[36rem]">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Tickets</h3>
          {tickets.length === 0 ? (
            <p className="text-amber-200/80">No tickets generated yet.</p>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-2xl bg-white/10 p-4 border border-white/10">
                  <div className="flex items-center justify-between gap-2 text-sm text-amber-200">
                    <span>{ticket.ticket_code}</span>
                    <span>{ticket.is_winner ? 'Winner' : 'Entry'}</span>
                  </div>
                  <div className="mt-2 text-xs text-amber-200/70">
                    Created {new Date(ticket.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
