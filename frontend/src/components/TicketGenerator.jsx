import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function TicketGenerator() {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateTicket = async () => {
    setLoading(true);
    try {
      const data = await api.generateTicket();
      if (data.success) {
        setTicket(data);
        toast.success('🎫 Ticket generated! Show it at the cafe!');
      } else {
        toast.error('Failed to generate ticket');
      }
    } catch (error) {
      toast.error('Error generating ticket');
    } finally {
      setLoading(false);
    }
  };

  const printTicket = () => {
    window.print();
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Get Your Free Bingo Ticket! 🎫</h2>
        <p className="text-amber-200">Every ticket wins a FREE beverage. Collect more numbers for bigger prizes!</p>
      </div>

      {!ticket ? (
        <div className="text-center">
          <button
            onClick={generateTicket}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold py-3 px-8 rounded-full text-lg transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : '🎲 Get My Free Ticket!'}
          </button>
        </div>
      ) : (
        <div className="print-area">
          <div className="text-center mb-4">
            <div className="text-sm text-amber-300">Ticket #</div>
            <div className="text-xl font-mono font-bold text-white">{ticket.ticketCode}</div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-5 gap-2">
              {ticket.grid.map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`bingo-cell ${cell === 'FREE' ? 'bingo-cell-free' : ''}`}
                  >
                    {cell}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <QRCodeSVG value={ticket.ticketCode} size={100} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={printTicket}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition"
            >
              🖨️ Print / Save
            </button>
            <button
              onClick={() => setTicket(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-full transition"
            >
              🔄 Generate Another
            </button>
          </div>

          <div className="text-center text-xs text-amber-200/70 mt-4">
            💡 Tip: Take a screenshot or print this ticket. Bring it to the cafe!
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
          button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
