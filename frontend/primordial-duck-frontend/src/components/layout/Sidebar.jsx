import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Drone, Zap, Bird, Target, Crosshair, Brain, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Sidebar.css';

const Sidebar = ({ isExpanded: controlledExpanded, setIsExpanded: setControlledExpanded }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [localExpanded, setLocalExpanded] = useState(true);

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : localExpanded;
  const setIsExpanded = setControlledExpanded || setLocalExpanded;

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', color: '#6b7c5c' },
    { path: '/drones', icon: Drone, label: 'Drones', color: '#00d4ff' },
    { path: '/superpowers', icon: Zap, label: 'Super Poderes', color: '#ffaa00' },
    { path: '/primordialducks', icon: Bird, label: 'Patos Primordiais', color: '#44ff44' },
    { path: '/capture-analysis', icon: Target, label: 'Análise de Captura', color: '#d4610a' },
    { path: '/capture-logic', icon: Brain, label: 'Lógica de Captura', color: '#4a5a3a' },
    { path: '/capture-operation', icon: Crosshair, label: 'Missão de Captura', color: '#8b3a3a' },
    { path: '/settings', icon: Settings, label: 'Configurações', color: '#9b59b6' },
  ];

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Overlay para mobile - clica fora para fechar */}
      {isExpanded && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Botão toggle fixo para mobile quando fechada */}
      <button className="sidebar-toggle sidebar-toggle-mobile" onClick={toggleSidebar} aria-label="Abrir Menu">
        <Menu size={20} />
      </button>

      <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {/* Botão toggle dentro da sidebar (desktop sempre, mobile quando aberta) */}
        <button className="sidebar-toggle sidebar-toggle-desktop" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          {isExpanded ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="sidebar-header">
          <h2>PDO</h2>
          {isExpanded && <span>Primordial Duck Operation</span>}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{ '--accent-color': item.color }}
                title={!isExpanded ? item.label : ''}
              >
                <Icon size={20} />
                {isExpanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button" title={!isExpanded ? 'Logout' : ''}>
            <LogOut size={18} />
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;