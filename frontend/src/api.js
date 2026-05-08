import axios from 'axios';

const apiClient = axios.create({ baseURL: '/api' });

export const api = {
  setAdminToken: (token) => {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  clearAdminToken: () => {
    delete apiClient.defaults.headers.common.Authorization;
  },

  generateTicket: async () => {
    const response = await apiClient.post('/tickets/generate');
    return response.data;
  },

  getTicket: async (code) => {
    const response = await apiClient.get(`/tickets/${code}`);
    return response.data;
  },

  checkTicket: async (ticketCode, matchedNumbers) => {
    const response = await apiClient.post('/tickets/check', { ticketCode, matchedNumbers });
    return response.data;
  },

  getCurrentDraw: async () => {
    const response = await apiClient.get('/draws/current');
    return response.data;
  },

  drawNumber: async (adminKey) => {
    const response = await apiClient.post('/draws/draw', { adminKey });
    return response.data;
  },

  resetGame: async (adminKey) => {
    const response = await apiClient.post('/draws/reset', { adminKey });
    return response.data;
  },

  adminLogin: async (username, password) => {
    const response = await apiClient.post('/admin/login', { username, password });
    return response.data;
  },

  getWinners: async () => {
    const response = await apiClient.get('/admin/winners');
    return response.data;
  },

  claimPrize: async (redemptionCode) => {
    const response = await apiClient.post(`/admin/claim/${redemptionCode}`);
    return response.data;
  },

  getTickets: async () => {
    const response = await apiClient.get('/admin/tickets');
    return response.data;
  }
};
