import React, { useState, useEffect } from 'react';
import { Battery, Fuel, Shield, CheckCircle, Wrench } from 'lucide-react';
import Modal from '../Modal';
import { droneService } from '../../services/api';
import './DroneSelector.css';

const DroneSelector = ({ drones, selectedDrone, onDroneSelect, onDroneUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingDroneId, setUpdatingDroneId] = useState(null);
  const [localDrones, setLocalDrones] = useState(drones);
  const [loadingDrones, setLoadingDrones] = useState(false);

  useEffect(() => {
    setLocalDrones(drones);
  }, [drones]);

  useEffect(() => {
    const loadDrones = async () => {
      if (isModalOpen) {
        try {
          setLoadingDrones(true);
          const dronesData = await droneService.getCombatDrones();
          setLocalDrones(dronesData || []);
        } catch (error) {
          console.error('Erro ao carregar drones:', error);
          setLocalDrones(drones);
        } finally {
          setLoadingDrones(false);
        }
      }
    };

    loadDrones();
  }, [isModalOpen, drones]);

  const handleDroneSelect = (drone) => {
    onDroneSelect(drone);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCardClick = (drone, canSelect) => {
    if (canSelect) {
      handleDroneSelect(drone);
    }
  };

  const handleMaintenance = async (droneId, type, e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      setUpdatingDroneId(droneId);

      if (type === 'battery') {
        await droneService.rechargeBattery(droneId);
      } else if (type === 'fuel') {
        await droneService.refuel(droneId);
      } else if (type === 'maintenance') {
        await droneService.performMaintenance(droneId);
      }

      setLocalDrones(prevDrones =>
        prevDrones.map(d => {
          if (d.id === droneId) {
            const updated = { ...d };
            if (type === 'battery') updated.batteryLevel = 100;
            if (type === 'fuel') updated.fuelLevel = 100;
            if (type === 'maintenance') updated.integrity = 100;
            return updated;
          }
          return d;
        })
      );
    } catch (error) {
      console.error('Erro na manutenção:', error);
    } finally {
      setUpdatingDroneId(null);
    }
  };
  const getStatusColor = (level) => {
    if (level >= 80) return '#4CAF50';
    if (level >= 50) return '#FF9800';
    return '#f44336';
  };

  const getOverallStatus = (drone) => {
    const avg = (drone.batteryLevel + drone.fuelLevel + drone.integrity) / 3;
    if (avg >= 80) return { text: 'EXCELENTE', color: '#4CAF50' };
    if (avg >= 60) return { text: 'BOM', color: '#FF9800' };
    return { text: 'CRÍTICO', color: '#f44336' };
  };

  const isDroneSelectable = (drone) => {
    return drone.batteryLevel > 0 && drone.fuelLevel > 0 && drone.integrity > 0;
  };

  return (
    <div className="drone-selector">
      <h3>🚁 Drone de Combate</h3>
      <div className="selected-display" onClick={() => setIsModalOpen(true)}>
        {selectedDrone ? (
          <div className="selected-item">
            <div className="item-info">
              <h4>{selectedDrone.model}</h4>
              <span>{selectedDrone.serialNumber}</span>
            </div>
            <button className="change-btn">Alterar</button>
          </div>
        ) : (
          <div className="select-placeholder">
            <span>Clique para selecionar um drone</span>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Selecionar Drone de Combate"
      >
        {loadingDrones ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
            <p>Carregando drones...</p>
          </div>
        ) : (
          <div className="drones-grid">
            {localDrones.map(drone => {
              const status = getOverallStatus(drone);
              const isSelected = selectedDrone?.id === drone.id;
              const canSelect = isDroneSelectable(drone);

              return (
                <div
                  key={drone.id}
                  className={`drone-card ${isSelected ? 'selected' : ''} ${!canSelect ? 'disabled' : ''}`}
                  onClick={() => handleCardClick(drone, canSelect)}
                  style={{ cursor: canSelect ? 'pointer' : 'not-allowed', opacity: canSelect ? 1 : 0.6 }}
                >
                  {isSelected && (
                    <div className="selected-badge">
                      <CheckCircle size={20} />
                      SELECIONADO
                    </div>
                  )}

                  {!canSelect && (
                    <div className="disabled-badge" style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#f44336',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ⚠️ REQUER REPARO
                    </div>
                  )}

                  <div className="drone-header">
                    <h4>{drone.model}</h4>
                    <span className="serial">{drone.serialNumber}</span>
                    <div className="status-badge" style={{ backgroundColor: status.color }}>
                      {status.text}
                    </div>
                  </div>

                  <div className="drone-specs">
                    <div className="spec-row">
                      <span>Marca:</span>
                      <span>{drone.brand}</span>
                    </div>
                    <div className="spec-row">
                      <span>Fabricante:</span>
                      <span>{drone.manufacturer}</span>
                    </div>
                    <div className="spec-row">
                      <span>Origem:</span>
                      <span>{drone.countryOfOrigin}</span>
                    </div>
                  </div>

                  <div className="drone-status">
                    <div className="status-item">
                      <Battery size={16} />
                      <span>Bateria</span>
                      <div className="status-bar">
                        <div
                          className="status-fill"
                          style={{
                            width: `${drone.batteryLevel}%`,
                            backgroundColor: getStatusColor(drone.batteryLevel)
                          }}
                        />
                      </div>
                      <span>{drone.batteryLevel}%</span>
                    </div>

                    <div className="status-item">
                      <Fuel size={16} />
                      <span>Combustível</span>
                      <div className="status-bar">
                        <div
                          className="status-fill"
                          style={{
                            width: `${drone.fuelLevel}%`,
                            backgroundColor: getStatusColor(drone.fuelLevel)
                          }}
                        />
                      </div>
                      <span>{drone.fuelLevel}%</span>
                    </div>

                    <div className="status-item">
                      <Shield size={16} />
                      <span>Integridade</span>
                      <div className="status-bar">
                        <div
                          className="status-fill"
                          style={{
                            width: `${drone.integrity}%`,
                            backgroundColor: getStatusColor(drone.integrity)
                          }}
                        />
                      </div>
                      <span>{drone.integrity}%</span>
                    </div>
                  </div>

                  <div className="maintenance-actions">
                    <button
                      onClick={(e) => handleMaintenance(drone.id, 'battery', e)}
                      className="maintenance-btn battery"
                      disabled={drone.batteryLevel >= 100 || updatingDroneId === drone.id}
                      title={drone.batteryLevel >= 100 ? "Bateria Cheia" : "Recarregar Bateria"}
                    >
                      <Battery size={14} />
                      {updatingDroneId === drone.id && '⏳'}
                    </button>
                    <button
                      onClick={(e) => handleMaintenance(drone.id, 'fuel', e)}
                      className="maintenance-btn fuel"
                      disabled={drone.fuelLevel >= 100 || updatingDroneId === drone.id}
                      title={drone.fuelLevel >= 100 ? "Tanque Cheio" : "Reabastecer"}
                    >
                      <Fuel size={14} />
                      {updatingDroneId === drone.id && '⏳'}
                    </button>
                    <button
                      onClick={(e) => handleMaintenance(drone.id, 'maintenance', e)}
                      className="maintenance-btn maintenance"
                      disabled={drone.integrity >= 100 || updatingDroneId === drone.id}
                      title={drone.integrity >= 100 ? "Integridade Perfeita" : "Manutenção"}
                    >
                      <Wrench size={14} />
                      {updatingDroneId === drone.id && '⏳'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DroneSelector;