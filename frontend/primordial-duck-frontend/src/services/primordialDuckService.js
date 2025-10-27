import { api } from './api.js';

export const primordialDuckService = {
  async getAll() {
    const response = await api.get('/primordialducks');
    return response.data.data || response.data;
  },

  async getById(id) {
    const response = await api.get(`/primordialducks/${id}`);
    return response.data.data || response.data;
  },

  async create(duckData) {
    const response = await api.post('/primordialducks', duckData);
    return response.data.data || response.data;
  },

  async update(id, duckData) {
    const response = await api.put(`/primordialducks/${id}`, duckData);
    return response.data.data || response.data;
  },

  async delete(id) {
    const response = await api.delete(`/primordialducks/${id}`);
    return response.data;
  },

  async search(filters) {
    const response = await api.post('/primordialducks/search', filters);
    return response.data.data || response.data;
  },

  async getAvailableForCapture() {
    const response = await api.get('/primordialducks/available-for-capture');
    return response.data.data || response.data;
  }
};