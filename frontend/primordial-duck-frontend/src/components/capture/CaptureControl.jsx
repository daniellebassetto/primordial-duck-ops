import React, { useState, useEffect } from 'react';
import { Target, Zap, Play, Square, AlertTriangle, PartyPopper, Bomb } from 'lucide-react';
import { captureService } from '../../services/captureService.js';
import { primordialDuckService } from '../../services/primordialDuckService.js';
import './CaptureControl.css';

const CaptureControl = ({ selectedDrone, onOperationComplete }) => {
  const [ducks, setDucks] = useState([]);
  const [selectedDuck, setSelectedDuck] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDucks();
  }, []);

  const loadDucks = async () => {
    try {
      const ducksData = await primordialDuckService.getAll();
      setDucks(ducksData);
    } catch (error) {
      console.error('Erro ao carregar patos:', error);
    }
  };

  const generateStrategy = async () => {
    if (!selectedDrone || !selectedDuck) return;

    setLoading(true);
    try {
      const strategyData = await captureService.generateStrategy({
        primordialDuckId: selectedDuck.id,
        droneId: selectedDrone.id
      });
      setStrategy(strategyData);
    } catch (error) {
      console.error('Erro ao gerar estratégia:', error);
    } finally {
      setLoading(false);
    }
  };

  const startOperation = async () => {
    if (!selectedDrone || !selectedDuck || !strategy) return;

    setLoading(true);
    try {
      const operation = await captureService.createOperation({
        primordialDuckId: selectedDuck.id,
        droneId: selectedDrone.id
      });

      setCurrentOperation(operation);

      setTimeout(async () => {
        const success = Math.random() < (strategy.successChance / 100);
        const result = success
          ? `Captura bem-sucedida! O pato foi neutralizado pela estratégia: ${strategy.strategy}`
          : `Falha na captura! O pato resistiu usando: ${strategy.defenseGenerated}`;

        await captureService.completeOperation(operation.id, {
          success,
          result
        });

        setCurrentOperation(null);
        setStrategy(null);
        setSelectedDuck(null);
        onOperationComplete();
      }, 5000);

    } catch (error) {
      console.error('Erro ao iniciar operação:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuccessColor = (chance) => {
    if (chance > 70) return '#44ff44';
    if (chance > 40) return '#ffaa00';
    return '#ff4444';
  };

  return (
    <div className="capture-control">
      <h2><Target size={24} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Controle de Captura</h2>

      {!selectedDrone && (
        <div className="no-drone">
          <AlertTriangle size={24} />
          <p>Selecione um drone de combate para começar</p>
        </div>
      )}

      {selectedDrone && selectedDrone.type !== 2 && (
        <div className="drone-offline">
          <AlertTriangle size={24} />
          <p>Selecione um drone de combate</p>
        </div>
      )}

      {selectedDrone && selectedDrone.type === 2 && (
        <>
          <div className="target-selection">
            <h3><Target size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Selecionar Alvo</h3>
            <select
              value={selectedDuck?.id || ''}
              onChange={(e) => {
                const duck = ducks.find(d => d.id === parseInt(e.target.value));
                setSelectedDuck(duck);
                setStrategy(null);
              }}
              className="duck-select"
            >
              <option value="">Escolha um Pato Primordial</option>
              {ducks.map(duck => (
                <option key={duck.id} value={duck.id}>
                  {duck.name} - {duck.species} ({duck.hibernationStatus})
                </option>
              ))}
            </select>
          </div>

          {selectedDuck && (
            <div className="duck-info">
              <h4>📊 Dados do Alvo</h4>
              <div className="duck-stats">
                <span>Altura: {selectedDuck.height}cm</span>
                <span>Peso: {selectedDuck.weight}g</span>
                <span>Status: {selectedDuck.hibernationStatus}</span>
                <span>Mutações: {selectedDuck.mutationCount}</span>
              </div>
            </div>
          )}

          {selectedDuck && !strategy && !currentOperation && (
            <button
              className="strategy-btn"
              onClick={generateStrategy}
              disabled={loading}
            >
              <Zap size={16} />
              {loading ? 'Analisando...' : 'Gerar Estratégia'}
            </button>
          )}

          {strategy && !currentOperation && (
            <div className="strategy-display">
              <h4>🧠 Estratégia Gerada</h4>
              <div className="strategy-content">
                <div className="strategy-item">
                  <strong>Plano de Ataque:</strong>
                  <p>{strategy.strategy}</p>
                </div>
                <div className="strategy-item">
                  <strong>Sistema de Defesa Aleatória:</strong>
                  <p>{strategy.defenseGenerated}</p>
                </div>
                <div className="success-chance">
                  <span>Chance de Sucesso:</span>
                  <div className="chance-bar">
                    <div
                      className="chance-fill"
                      style={{
                        width: `${strategy.successChance}%`,
                        backgroundColor: getSuccessColor(strategy.successChance)
                      }}
                    />
                  </div>
                  <span style={{ color: getSuccessColor(strategy.successChance) }}>
                    {strategy.successChance}%
                  </span>
                </div>
                <div className="reasoning">
                  <small>{strategy.reasoning}</small>
                </div>
              </div>

              <button
                className="execute-btn"
                onClick={startOperation}
                disabled={loading}
              >
                <Play size={16} />
                Executar Operação
              </button>
            </div>
          )}

          {currentOperation && (
            <div className="operation-progress">
              <h4>⚡ Operação em Andamento</h4>
              <div className="progress-animation">
                <div className="pulse-circle"></div>
                <p>Drone executando estratégia...</p>
              </div>
              <div className="operation-details">
                <p><strong>Estratégia:</strong> {currentOperation.strategy}</p>
                <p><strong>Defesa Ativa:</strong> {currentOperation.defenseGenerated}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CaptureControl;