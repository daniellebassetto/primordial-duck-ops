import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, Menu } from 'lucide-react';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleLabel = (role) => {
    const roles = {
      field_agent: 'Agente de Campo',
      FieldAgent: 'Agente de Campo',
      drone_operator: 'Operador de Drones',
      DroneOperator: 'Operador de Drones',
      analyst: 'Analista Tático',
      Analyst: 'Analista Tático',
      researcher: 'Pesquisador',
      Researcher: 'Pesquisador'
    };
    return roles[role] || 'Agente DSIN';
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <button className="mobile-menu-btn" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
          <h1 className="header-title">
            PRIMORDIAL DUCK OPERATION
          </h1>
          <span className="header-subtitle">Sistema de Controle Tático</span>
        </div>

        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">
                <Shield size={12} />
                {getRoleLabel(user?.role)}
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;