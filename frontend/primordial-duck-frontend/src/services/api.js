import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (response.data.success) {
        return { ...response, data: response.data.data };
      } else {
        const error = new Error(response.data.message || 'Erro na requisição');
        error.errors = response.data.errors;
        throw error;
      }
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      const msg = 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.';

      try {
        window.dispatchEvent(new CustomEvent('api:network-error', {
          detail: {
            message: msg,
            originalError: error.message
          }
        }));
      } catch (e) {
      }

      const netError = new Error(msg);
      netError.isNetworkError = true;
      throw netError;
    }

    if (error.response?.status === 400 && error.response?.data?.errors) {
      const validationErrors = [];
      const errors = error.response.data.errors;

      Object.keys(errors).forEach(field => {
        const messages = errors[field];
        if (Array.isArray(messages)) {
          messages.forEach(msg => validationErrors.push(msg));
        } else {
          validationErrors.push(messages);
        }
      });

      const apiError = new Error(error.response.data.title || 'Erro de validação');
      apiError.errors = validationErrors;
      apiError.status = error.response.status;
      throw apiError;
    }

    if (error.response?.data && typeof error.response.data === 'object' && 'success' in error.response.data) {
      const apiError = new Error(error.response.data.message || 'Erro na requisição');
      apiError.errors = error.response.data.errors;
      apiError.status = error.response.status;
      throw apiError;
    }

    throw error;
  }
);

export const droneService = {
  getAll: async () => {
    try {
      const response = await api.get('/drones');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar drones:', error.message);
      throw error;
    }
  },

  search: async (filters) => {
    try {
      const response = await api.post('/drones/search', filters);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar drones:', error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/drones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar drone:', error.message);
      throw error;
    }
  },

  create: async (drone) => {
    try {
      const response = await api.post('/drones', drone);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar drone:', error.message);
      throw error;
    }
  },

  update: async (id, drone) => {
    try {
      const response = await api.put(`/drones/${id}`, drone);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar drone:', error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/drones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir drone:', error.message);
      throw error;
    }
  },

  getByType: async (type) => {
    try {
      const response = await api.get(`/drones/by-type/${type}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar drones por tipo:', error.message);
      throw error;
    }
  },

  getCombatDrones: async () => {
    return droneService.getByType(2);
  },

  getIdentificationDrones: async () => {
    return droneService.getByType(1);
  },

  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/drones/${id}/status`, status);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status do drone:', error.message);
      throw error;
    }
  },

  rechargeBattery: async (id) => {
    try {
      const droneResponse = await api.get(`/drones/${id}`);
      const currentDrone = droneResponse.data.data || droneResponse.data;

      const response = await api.put(`/drones/${id}/status`, {
        BatteryLevel: 100,
        FuelLevel: currentDrone.fuelLevel,
        Integrity: currentDrone.integrity
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao recarregar bateria:', error.message);
      throw error;
    }
  },

  refuel: async (id) => {
    try {
      const droneResponse = await api.get(`/drones/${id}`);
      const currentDrone = droneResponse.data.data || droneResponse.data;

      const response = await api.put(`/drones/${id}/status`, {
        BatteryLevel: currentDrone.batteryLevel,
        FuelLevel: 100,
        Integrity: currentDrone.integrity
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao reabastecer:', error.message);
      throw error;
    }
  },

  performMaintenance: async (id) => {
    try {
      const droneResponse = await api.get(`/drones/${id}`);
      const currentDrone = droneResponse.data.data || droneResponse.data;

      const response = await api.put(`/drones/${id}/status`, {
        BatteryLevel: currentDrone.batteryLevel,
        FuelLevel: currentDrone.fuelLevel,
        Integrity: 100
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao realizar manutenção:', error.message);
      throw error;
    }
  },
};

export const superPowerService = {
  getAll: async () => {
    try {
      const response = await api.get('/superpowers');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar super poderes:', error.message);
      throw error;
    }
  },

  search: async (filters) => {
    try {
      const response = await api.post('/superpowers/search', filters);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar super poderes:', error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/superpowers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar super poder:', error.message);
      throw error;
    }
  },

  create: async (superPower) => {
    try {
      const response = await api.post('/superpowers', superPower);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar super poder:', error.message);
      throw error;
    }
  },

  update: async (id, superPower) => {
    try {
      const response = await api.put(`/superpowers/${id}`, superPower);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar super poder:', error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/superpowers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir super poder:', error.message);
      throw error;
    }
  },
};

export const primordialDuckService = {
  getAll: async () => {
    try {
      const response = await api.get('/primordialducks');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar patos primordiais:', error.message);
      throw error;
    }
  },

  search: async (filters) => {
    try {
      const response = await api.post('/primordialducks/search', filters);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar patos primordiais:', error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/primordialducks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pato primordial:', error.message);
      throw error;
    }
  },

  create: async (duck) => {
    try {
      const response = await api.post('/primordialducks', duck);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pato primordial:', error.message);
      throw error;
    }
  },

  update: async (id, duck) => {
    try {
      const response = await api.put(`/primordialducks/${id}`, duck);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar pato primordial:', error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/primordialducks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir pato primordial:', error.message);
      throw error;
    }
  },

  getCaptureAnalysis: async (id) => {
    try {
      const response = await api.get(`/primordialducks/${id}/capture-analysis`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar análise de captura:', error.message);
      throw error;
    }
  },

  getAvailableForCapture: async () => {
    try {
      const response = await api.get('/primordialducks/available-for-capture');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar patos disponíveis para captura:', error.message);
      throw error;
    }
  },
};

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error.message);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Erro no alistamento:', error.message);
      throw error;
    }
  },
};

export const captureService = {
  getAll: async () => {
    try {
      const response = await api.get('/captureoperations');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar operações de captura:', error.message);
      throw error;
    }
  },

  getAvailableDrones: async () => {
    try {
      const response = await api.get('/drones/by-type/2');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar drones disponíveis:', error.message);
      throw error;
    }
  },

  generateStrategy: async (requestData) => {
    try {
      const response = await api.post('/captureoperations/strategy', requestData);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar estratégia:', error.message);
      throw error;
    }
  },

  createOperation: async (operation) => {
    try {
      const response = await api.post('/captureoperations', operation);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar operação:', error.message);
      throw error;
    }
  },

  completeOperation: async (id, payload) => {
    try {
      const response = await api.post(`/captureoperations/${id}/complete`, payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao completar operação:', error.message);
      throw error;
    }
  },

  updateDroneStatus: async (droneId, statusData) => {
    try {
      const response = await api.put(`/drones/${droneId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status do drone:', error.message);
      throw error;
    }
  },
};

export { api };