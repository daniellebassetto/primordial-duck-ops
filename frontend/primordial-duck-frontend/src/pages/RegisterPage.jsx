import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import authService from '../services/authService';
import { User, Mail, Lock, Shield, AlertCircle } from 'lucide-react';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '0'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Códigos de acesso não coincidem');
        return;
      }

      if (formData.password.length < 6) {
        setError('Código de acesso deve ter pelo menos 6 caracteres');
        return;
      }

      const authData = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: parseInt(formData.role)
      });

      register(authData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro no registro:', err);
      setError(err.response?.data?.message || 'Falha no alistamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">
      <div className="auth-logo">
        <img src="/src/assets/images/logo.png" alt="Primordial Duck Operation" />
      </div>
      <div className="auth-container">
        <div className="auth-header">
          <h1>ALISTAMENTO</h1>
          <p>Junte-se à resistência</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                <User size={16} />
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome de guerra"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">
                <Shield size={16} />
                Especialização
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="0">Agente de Campo</option>
                <option value="1">Operador de Drones</option>
                <option value="2">Analista Tático</option>
                <option value="3">Pesquisador</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} />
              Email de Comunicação
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="operador@primordial.ops"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">
                <Lock size={16} />
                Código de Acesso
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <Lock size={16} />
                Confirmar Código
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'PROCESSANDO...' : 'COMPLETAR ALISTAMENTO'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Já possui acesso?</p>
          <Link to="/login" className="auth-link">
            Fazer Login
          </Link>
        </div>

        <Link to="/" className="back-link">
          ← Voltar
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;