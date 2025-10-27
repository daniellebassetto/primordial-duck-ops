import React, { useState } from 'react';
import { Battery, Fuel, Shield, Zap, Target, AlertTriangle } from 'lucide-react';
import './CombatDroneSelector.css';

const CombatDroneSelector = ({ drones, selectedDrone, onDroneSelect, onRecharge }) => {
  const [hoveredDrone, setHoveredDrone] = useState(null);

  const getStatusColor = (level) => {
    if (level > 70) return '#4CAF50';
    if (level > 30) return '#FF9800';
    return '#F44336';
  };

  const getOperationalStatus = (drone) => {
    if (!drone.isOperational) return { text: 'FORA DE SERVIÇO', color: '#F44336', icon: AlertTriangle };
    if (drone.batteryLevel < 20 || drone.fuelLevel < 20 || drone.integrity < 30) {
      return { text: 'MANUTENÇÃO NECESSÁRIA', color: '#FF9800', icon: AlertTriangle };
    }
    return { text: 'OPERACIONAL', color: '#4CAF50', icon: Target };
  };

  const handleRecharge = async (e, droneId) => {
    e.stopPropagation();
    await onRecharge(droneId);
  };

  if (!drones || drones.length === 0) {
    return (
      <div className="no-combat-drones">
        <AlertTriangle size={48} />
        <h3>Nenhum Drone de Combate Disponível</h3>
        <p>Registre drones de combate para iniciar as operações de captura</p>
      </div>
    );
  }

  return (
    <div className="combat-drone-selector">
      <div className="selector-header">
        <h3>🚁 Drones de Combate</h3>
        <p>Selecione um drone para a missão de captura</p>
      </div>

      <div className="drones-grid">
        {drones.map(drone => {
          const status = getOperationalStatus(drone);
          const isSelected = selectedDrone?.id === drone.id;
          const isHovered = hoveredDrone === drone.id;
          const StatusIcon = status.icon;

          return (
            <div
              key={drone.id}
              className={`drone-card ${isSelected ? 'selected' : ''} ${!drone.isOperational ? 'disabled' : ''}`}
              onClick={() => drone.isOperational && onDroneSelect(drone)}
              onMouseEnter={() => setHoveredDrone(drone.id)}
              onMouseLeave={() => setHoveredDrone(null)}
            >
              <div className="drone-card-header">
                <div className="drone-info">
                  <h4>{drone.model}</h4>
                  <span className="serial-number">{drone.serialNumber}</span>
                </div>
                <div className="status-badge" style={{ backgroundColor: status.color }}>
                  <StatusIcon size={16} />
                  <span>{status.text}</span>
                </div>
              </div>

              <div className="drone-visual">
                <div className={`drone-icon ${isHovered ? 'hover' : ''}`}>
                  🚁
                </div>
                {isSelected && (
                  <div className="selection-indicator">
                    <Target size={24} />
                  </div>
                )}
              </div>

              <div className="drone-stats">
                <div className="stat-row">
                  <div className="stat-item">
                    <Battery size={14} />
                    <span>Bateria</span>
                    <div className="stat-bar">
                      <div 
                        className="stat-fill"
                        style={{ 
                          width: `${drone.batteryLevel}%`,
                          backgroundColor: getStatusColor(drone.batteryLevel)
                        }}
                      />
                    </div>
                    <span className="stat-value">{drone.batteryLevel}%</span>
                  </div>
                </div>

                <div className="stat-row">
                  <div className="stat-item">
                    <Fuel size={14} />
                    <span>Combustível</span>
                    <div className="stat-bar">
                      <div 
                        className="stat-fill"
                        style={{ 
                          width: `${drone.fuelLevel}%`,
                          backgroundColor: getStatusColor(drone.fuelLevel)
                        }}
                      />
                    </div>
                    <span className="stat-value">{drone.fuelLevel}%</span>
                  </div>
                </div>

                <div className="stat-row">
                  <div className="stat-item">
                    <Shield size={14} />
                    <span>Integridade</span>
                    <div className="stat-bar">
                      <div 
                        className="stat-fill"
                        style={{ 
                          width: `${drone.integrity}%`,
                          backgroundColor: getStatusColor(drone.integrity)
                        }}
                      />
                    </div>
                    <span className="stat-value">{drone.integrity}%</span>
                  </div>
                </div>
              </div>

              <div className="drone-actions">
                <button
                  className="recharge-btn"
                  onClick={(e) => handleRecharge(e, drone.id)}
                  disabled={drone.batteryLevel === 100 && drone.fuelLevel === 100 && drone.integrity === 100}
                >
                  <Zap size={14} />
                  Recarregar
                </button>
              </div>

              <div className="last-maintenance">
                Última manutenção: {new Date(drone.lastMaintenance).toLocaleDateString('pt-BR')}
              </div>

              {isSelected && (
                <div className="selected-overlay">
                  <div className="selected-text">SELECIONADO</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CombatDroneSelector;