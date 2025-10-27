import React, { useState, useEffect } from 'react';
import { Battery, Fuel, Shield, Zap, Target, Settings } from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/combat.css';

const CombatDroneControl = ({ duckId, onClose }) => {
  const [drones, setDrones] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missionStatus, setMissionStatus] = useState(null);

  useEffect(() => {
    loadDrones();
  }, []);

  const loadDrones = async () => {
    try {
      const response = await api.get('/combatdrones');
      setDrones(response.data);
      if (response.data.length > 0) {
        setSelectedDrone(response.data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar drones de combate:', error);
    }
  };

  const generateStrategy = async () => {
    if (!selectedDrone) return;

    setLoading(true);
    try {
      const response = await api.post(`/combatdrones/${selectedDrone.id}/combat-strategy/${duckId}`);
      setStrategy(response.data);
    } catch (error) {
      console.error('Erro ao gerar estratégia:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (level) => {
    if (level > 70) return '#22c55e';
    if (level > 40) return '#f59e0b';
    return '#ef4444';
  };

  const getSuccessColor = (chance) => {
    if (chance > 70) return '#22c55e';
    if (chance > 40) return '#f59e0b';
    return '#ef4444';
  };

  const startMission = () => {
    if (!selectedDrone || !strategy) return;

    setMissionStatus('running');

    const missionTime = Math.random() * 3000 + 2000;

    setTimeout(() => {
      const success = Math.random() * 100 < strategy.successChance;
      setMissionStatus(success ? 'success' : 'failed');

      const batteryDrain = Math.floor(Math.random() * 20) + 10;
      const fuelDrain = Math.floor(Math.random() * 15) + 5;
      const integrityLoss = success ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 15) + 5;

      updateDroneStatus(selectedDrone.id, {
        batteryLevel: Math.max(0, selectedDrone.batteryLevel - batteryDrain),
        fuelLevel: Math.max(0, selectedDrone.fuelLevel - fuelDrain),
        integrity: Math.max(0, selectedDrone.integrity - integrityLoss)
      });

      setTimeout(() => setMissionStatus(null), 3000);
    }, missionTime);
  };

  const adjustStrategy = () => {
    generateStrategy();
  };

  const updateDroneStatus = async (droneId, status) => {
    try {
      await api.put(`/combatdrones/${droneId}/status`, status);
      loadDrones();
    } catch (error) {
      console.error('Erro ao atualizar status do drone:', error);
    }
  };

  return (
    <div className="combat-control">
      <div className="combat-header">
        <h3>Sistema de Controle de Drone de Combate</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="drone-selection">
        <h4>Selecionar Drone</h4>
        <div className="drone-grid">
          {drones.map(drone => (
            <div
              key={drone.id}
              className={`drone-card ${selectedDrone?.id === drone.id ? 'selected' : ''} ${!drone.isOperational ? 'disabled' : ''}`}
              onClick={() => drone.isOperational && setSelectedDrone(drone)}
            >
              <div className="drone-info">
                <h5>{drone.serialNumber}</h5>
                <p>{drone.model}</p>
                <span className={`status ${drone.isOperational ? 'operational' : 'offline'}`}>
                  {drone.isOperational ? 'OPERACIONAL' : 'OFFLINE'}
                </span>
              </div>

              <div className="drone-status">
                <div className="status-item">
                  <Battery size={16} />
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
            </div>
          ))}
        </div>
      </div>

      {selectedDrone && (
        <div className="strategy-section">
          <button
            onClick={generateStrategy}
            disabled={loading || !selectedDrone.isOperational}
            className="btn btn-primary strategy-btn"
          >
            <Target size={16} />
            {loading ? 'Analisando Alvo...' : 'Gerar Estratégia de Combate'}
          </button>

          {strategy && (
            <div className="strategy-display">
              <div className="strategy-header">
                <h4>📋 Plano de Combate Gerado</h4>
                <div
                  className="success-chance"
                  style={{ color: getSuccessColor(strategy.successChance) }}
                >
                  {strategy.successChance}% de Sucesso
                </div>
              </div>

              <div className="strategy-content">
                <div className="strategy-item">
                  <h5>🎯 Ponto Fraco Identificado</h5>
                  <p>{strategy.weakPoint}</p>
                </div>

                <div className="strategy-item">
                  <h5>⚔️ Plano de Ataque</h5>
                  <p>{strategy.attackPlan}</p>
                </div>

                <div className="strategy-item">
                  <h5>🛡️ Sistema de Defesa Aleatório</h5>
                  <p className="defense-system">{strategy.defenseSystem}</p>
                </div>

                <div className="strategy-item">
                  <h5>🔧 Equipamentos Necessários</h5>
                  <ul className="equipment-list">
                    {strategy.requiredEquipment.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="strategy-item">
                  <h5>📝 Táticas Recomendadas</h5>
                  <ul className="tactics-list">
                    {strategy.tactics.map((tactic, index) => (
                      <li key={index}>{tactic}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="combat-actions">
                <button
                  className="btn btn-success"
                  onClick={startMission}
                  disabled={!selectedDrone?.isOperational || missionStatus === 'running'}
                >
                  <Zap size={16} />
                  {missionStatus === 'running' ? 'Missão em Andamento...' : 'Iniciar Missão de Captura'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={adjustStrategy}
                >
                  <Settings size={16} />
                  Ajustar Estratégia
                </button>
              </div>

              {missionStatus && (
                <div className={`mission-status ${missionStatus}`}>
                  {missionStatus === 'running' && '🚁 Drone em rota para o alvo...'}
                  {missionStatus === 'success' && '✅ Missão concluída com sucesso!'}
                  {missionStatus === 'failed' && '❌ Missão falhou. Drone retornando à base.'}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CombatDroneControl;