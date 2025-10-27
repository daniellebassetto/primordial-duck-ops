import React from 'react';
import { Battery, Fuel, Shield, Wrench, Zap } from 'lucide-react';
import { captureService } from '../../services/captureService.js';
import './DroneStatus.css';

const DroneStatus = ({ drone, isSelected, onSelect, onRecharge }) => {
  const handleRecharge = async (e) => {
    e.stopPropagation();
    try {
      await captureService.rechargeDrone(drone.id);
      onRecharge();
    } catch (error) {
      console.error('Erro ao recarregar drone:', error);
    }
  };

  const handleMaintenance = async (e) => {
    e.stopPropagation();
    try {
      await captureService.maintenanceDrone(drone.id);
      onRecharge();
    } catch (error) {
      console.error('Erro na manutenção do drone:', error);
    }
  };

  const getStatusColor = (level) => {
    if (level > 70) return '#44ff44';
    if (level > 30) return '#ffaa00';
    return '#ff4444';
  };

  const getOperationalStatus = () => {
    if (drone.isOperational) return { text: 'OPERACIONAL', color: '#44ff44' };
    return { text: 'FORA DE SERVIÇO', color: '#ff4444' };
  };

  const status = getOperationalStatus();

  return (
    <div 
      className={`drone-status ${isSelected ? 'selected' : ''} ${!drone.isOperational ? 'disabled' : ''}`}
      onClick={onSelect}
    >
      <div className="drone-header">
        <h3>🚁 {drone.model}</h3>
        <span className="serial">{drone.serialNumber}</span>
        <div className="status-indicator" style={{ color: status.color }}>
          {status.text}
        </div>
      </div>

      <div className="drone-stats">
        <div className="stat-item">
          <Battery size={16} />
          <span>Bateria</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${drone.batteryLevel}%`,
                backgroundColor: getStatusColor(drone.batteryLevel)
              }}
            />
          </div>
          <span className="stat-value">{drone.batteryLevel}%</span>
        </div>

        <div className="stat-item">
          <Fuel size={16} />
          <span>Combustível</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${drone.fuelLevel}%`,
                backgroundColor: getStatusColor(drone.fuelLevel)
              }}
            />
          </div>
          <span className="stat-value">{drone.fuelLevel}%</span>
        </div>

        <div className="stat-item">
          <Shield size={16} />
          <span>Integridade</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${drone.integrity}%`,
                backgroundColor: getStatusColor(drone.integrity)
              }}
            />
          </div>
          <span className="stat-value">{drone.integrity}%</span>
        </div>
      </div>

      <div className="drone-actions">
        <button 
          className="action-btn recharge" 
          onClick={handleRecharge}
          disabled={drone.batteryLevel === 100 && drone.fuelLevel === 100}
        >
          <Zap size={14} />
          Recarregar
        </button>
        <button 
          className="action-btn maintenance" 
          onClick={handleMaintenance}
          disabled={drone.integrity === 100}
        >
          <Wrench size={14} />
          Manutenção
        </button>
      </div>

      <div className="last-maintenance">
        Última manutenção: {new Date(drone.lastMaintenance).toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
};

export default DroneStatus;