import { api } from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    return response.data.data || response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data.data || response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', {
      email
    });
    return response.data;
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword
    });
    return response.data;
  }
};

export default authService;