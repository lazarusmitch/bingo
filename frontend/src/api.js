import axios from 'axios';

const API_BASE = '/api';

export const api = {
  generateTicket: async () => {
    const response = await axios.post(`${API_BASE}/tickets/generate`);
    return response.data;
  },

  getTicket: async (code) => {
    const response = await axios.get(`${API_BASE}/tickets/${code}`);
    return response.data;
  },

  checkTicket: async (ticketCode, matchedNumbers) => {
    const response = await axios.post(`${API_BASE}/tickets/check`, { ticketCode, matchedNumbers });
    return response.data;
  },

  getCurrentDraw: async () => {
    const response = await axios.get(`${API_BASE}/draws/current`);
    return response.data;
  },

  drawNumber: async (adminKey) => {
    const response = await axios.post(`${API_BASE}/draws/draw`, { adminKey });
    return response.data;
  },

  resetGame: async (adminKey) => {
    const response = await axios.post(`${API_BASE}/draws/reset`, { adminKey });
    return response.data;
  },

  adminLogin: async (username, password) => {
    const response = await axios.post(`${API_BASE}/admin/login`, { username, password });
    return response.data;
  },

  getWinners: async () => {
    const response = await axios.get(`${API_BASE}/admin/winners`);
    return response.data;
  },

  claimPrize: async (redemptionCode) => {
    const response = await axios.post(`${API_BASE}/admin/claim/${redemptionCode}`);
    return response.data;
  },

  getTickets: async () => {
    const response = await axios.get(`${API_BASE}/admin/tickets`);
    return response.data;
  }
};
