import React, { useState, useEffect } from 'react';
import { Target, Plane, Brain, Gamepad2, PartyPopper, Bomb, RotateCcw } from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import { captureService } from '../services/captureService.js';
import { primordialDuckService } from '../services/primordialDuckService.js';
import './CaptureOperationPageSimple.css';

const CaptureOperationPageSimple = () => {
  const [drones, setDrones] = useState([]);
  const [ducks, setDucks] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [selectedDuck, setSelectedDuck] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [gameState, setGameState] = useState('ready');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dronesData, ducksData] = await Promise.all([
        captureService.getAvailableDrones(),
        primordialDuckService.getAvailableForCapture()
      ]);
      setDrones(dronesData || []);
      setDucks(ducksData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateStrategy = async () => {
    if (!selectedDrone || !selectedDuck) return;

    try {
      setLoading(true);
      const strategyData = await captureService.generateStrategy({
        droneId: selectedDrone.id,
        primordialDuckId: selectedDuck.id
      });

      setStrategy({
        strategy: strategyData.strategy,
        defenseGenerated: strategyData.defenseGenerated,
        successChance: strategyData.successChance,
        reasoning: strategyData.reasoning
      });
    } catch (error) {
      console.error('Erro ao gerar estratégia:', error);
      alert('Erro ao gerar estratégia. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const executeCapture = () => {
    if (!strategy) return;

    setGameState('executing');

    setTimeout(() => {
      const success = Math.random() * 100 < strategy.successChance;
      setResult({
        success,
        message: success ? 'Pato capturado com sucesso!' : 'Captura falhou!'
      });
      setGameState('completed');
    }, 3000);
  };

  const resetMission = () => {
    setSelectedDrone(null);
    setSelectedDuck(null);
    setStrategy(null);
    setGameState('ready');
    setResult(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="capture-loading">
          <div className="spinner"></div>
          <p>Carregando sistema de captura...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="capture-page-simple">
        <div className="capture-header">
          <h1><Target size={32} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> 3ª Missão - Captura do Pato Primordial</h1>
          <p>Sistema de captura com mini-jogo interativo</p>
        </div>

        <div className="capture-content">
          {/* Seleção de Drone */}
          <div className="selection-section">
            <h3><Plane size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Selecionar Drone</h3>
            <select
              value={selectedDrone?.id || ''}
              onChange={(e) => {
                const drone = drones.find(d => d.id === parseInt(e.target.value));
                setSelectedDrone(drone);
              }}
            >
              <option value="">Escolha um drone</option>
              {drones.map(drone => (
                <option key={drone.id} value={drone.id}>
                  {drone.model} - {drone.serialNumber}
                </option>
              ))}
            </select>

            {selectedDrone && (
              <div className="drone-info">
                <p><strong>Modelo:</strong> {selectedDrone.model}</p>
                <p><strong>Bateria:</strong> {selectedDrone.batteryLevel}%</p>
                <p><strong>Combustível:</strong> {selectedDrone.fuelLevel}%</p>
                <p><strong>Integridade:</strong> {selectedDrone.integrity}%</p>
              </div>
            )}
          </div>

          {/* Seleção de Pato */}
          <div className="selection-section">
            <h3><Target size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Selecionar Alvo</h3>
            <select
              value={selectedDuck?.id || ''}
              onChange={(e) => {
                const duck = ducks.find(d => d.id === parseInt(e.target.value));
                setSelectedDuck(duck);
              }}
            >
              <option value="">Escolha um pato</option>
              {ducks.filter(d => !d.isCaptured).map(duck => (
                <option key={duck.id} value={duck.id}>
                  {duck.name} - {duck.species}
                </option>
              ))}
            </select>

            {selectedDuck && (
              <div className="duck-info">
                <p><strong>Nome:</strong> {selectedDuck.name}</p>
                <p><strong>Status:</strong> {selectedDuck.hibernationStatusDescription || selectedDuck.hibernationStatus}</p>
                <p><strong>Altura:</strong> {selectedDuck.height}cm</p>
                <p><strong>Peso:</strong> {selectedDuck.weight}g</p>
              </div>
            )}
          </div>

          {/* Estratégia */}
          {selectedDrone && selectedDuck && !strategy && (
            <div className="strategy-section">
              <button className="generate-btn" onClick={generateStrategy}>
                <Brain size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Gerar Estratégia
              </button>
            </div>
          )}

          {strategy && (
            <div className="strategy-display">
              <h3><Brain size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Estratégia Gerada</h3>
              <p><strong>Ataque:</strong> {strategy.strategy}</p>
              <p><strong>Defesa do Alvo:</strong> {strategy.defenseGenerated}</p>
              <p><strong>Chance de Sucesso:</strong> {strategy.successChance}%</p>
              {strategy.reasoning && (
                <p className="strategy-reasoning"><strong>Análise:</strong> {strategy.reasoning}</p>
              )}

              {gameState === 'ready' && (
                <button className="execute-btn" onClick={executeCapture}>
                  <Gamepad2 size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Executar Captura
                </button>
              )}
            </div>
          )}

          {/* Estado do Jogo */}
          {gameState === 'executing' && (
            <div className="game-executing">
              <div className="spinner"></div>
              <p>Executando operação de captura...</p>
              <p>Drone aplicando estratégia: {strategy?.strategy}</p>
            </div>
          )}

          {/* Resultado */}
          {result && (
            <div className={`result-display ${result.success ? 'success' : 'failure'}`}>
              <h3>{result.success ? <><PartyPopper size={24} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Sucesso!</> : <><Bomb size={24} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Falha!</>}</h3>
              <p>{result.message}</p>
              <button className="reset-btn" onClick={resetMission}>
                <RotateCcw size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Nova Missão
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CaptureOperationPageSimple;