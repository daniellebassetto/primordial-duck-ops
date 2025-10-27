import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    return response.data.data || response.data;
  },

  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data.data || response.data;
  },

  forgotPassword: async (email) => {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email
    });
    return response.data;
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/auth/change-password`, {
      currentPassword,
      newPassword,
      confirmPassword
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export default authService;