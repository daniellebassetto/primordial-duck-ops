import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import authService from '../services/authService';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import assets from '../assets';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const authData = await authService.login(formData.email, formData.password);
      login(authData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);
      if (err.errors && Array.isArray(err.errors)) {
        setErrors(err.errors);
      } else if (err.message) {
        setErrors([err.message]);
      } else if (err.response?.data?.message) {
        setErrors([err.response.data.message]);
      } else {
        setErrors(['Falha na autenticação. Verifique suas credenciais.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-logo">
        <img src={assets.images.logo} alt="Primordial Duck Operation" />
      </div>
      <div className="auth-container login-container">
        <div className="auth-header">
          <h1>ACESSO RESTRITO</h1>
          <p>Apenas pessoal autorizado</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.length > 0 && (
            <div className="error-message">
              <AlertCircle size={16} />
              <div>
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} />
              Email de Operador
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

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'AUTENTICANDO...' : 'ACESSAR SISTEMA'}
          </button>

          <div className="forgot-password-link">
            <Link to="/forgot-password" className="auth-link">
              Esqueceu sua senha?
            </Link>
          </div>
        </form>

        <div className="auth-footer">
          <p>Não possui acesso?</p>
          <Link to="/register" className="auth-link">
            Solicitar Alistamento
          </Link>
        </div>

        <Link to="/" className="back-link">
          ← Voltar
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;