import { api } from './api.js';

export const captureService = {
  async getAvailableDrones() {
    const response = await api.get('/drones/by-type/2');
    return response.data.data || response.data;
  },

  async getAllDrones() {
    const response = await api.get('/drones/by-type/2');
    return response.data.data || response.data;
  },

  async createDrone(droneData) {
    const response = await api.post('/drones', droneData);
    return response.data.data || response.data;
  },

  async rechargeDrone(droneId) {
    const response = await api.put(`/drones/${droneId}/status`, {
      BatteryLevel: 100,
      FuelLevel: 100,
      Integrity: 100
    });
    return response.data;
  },

  async maintenanceDrone(droneId) {
    const response = await api.put(`/drones/${droneId}/status`, {
      BatteryLevel: 100,
      FuelLevel: 100,
      Integrity: 100
    });
    return response.data;
  },

  async updateDroneStatus(droneId, statusData) {
    const payload = {
      BatteryLevel: statusData.batteryLevel,
      FuelLevel: statusData.fuelLevel,
      Integrity: statusData.integrity
    };
    const response = await api.put(`/drones/${droneId}/status`, payload);
    return response.data;
  },

  async getAll() {
    const response = await api.get('/captureoperations/with-details');
    return response.data.data || response.data;
  },

  async getOperations() {
    const response = await api.get('/captureoperations/with-details');
    return response.data.data || response.data;
  },

  async getOperation(operationId) {
    const response = await api.get(`/captureoperations/${operationId}`);
    return response.data.data || response.data;
  },

  async generateStrategy(requestData) {
    const response = await api.post('/captureoperations/strategy', requestData);
    return response.data.data || response.data;
  },

  async createOperation(operationData) {
    const response = await api.post('/captureoperations', operationData);
    return response.data.data || response.data;
  },

  async startOperation(operationId) {
    const response = await api.post(`/captureoperations/${operationId}/start`);
    return response.data;
  },

  async completeOperation(operationId, resultData) {
    const response = await api.post(`/captureoperations/${operationId}/complete`, resultData);
    return response.data;
  }
};