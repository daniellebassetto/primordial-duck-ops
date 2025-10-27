import React, { useState, useEffect } from 'react';
import { Target, Brain, AlertCircle, ClipboardList, Clock } from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import DroneSelector from '../components/capture/DroneSelector.jsx';
import DuckSelector from '../components/capture/DuckSelector.jsx';
import CaptureMode from '../components/capture/CaptureMode.jsx';
import CaptureResultModal from '../components/capture/CaptureResultModal.jsx';
import OperationHistory from '../components/capture/OperationHistory.jsx';
import Modal from '../components/Modal.jsx';
import { primordialDuckService, captureService } from '../services/api.js';
import './CaptureOperationPage.css';

const CaptureOperationPage = () => {
  const [drones, setDrones] = useState([]);
  const [ducks, setDucks] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [selectedDuck, setSelectedDuck] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [gameState, setGameState] = useState('ready');
  const [result, setResult] = useState(null);
  const [droneImpact, setDroneImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [operations, setOperations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  const handleCaptureComplete = async (success, message, captureResult = null) => {
    try {
      const operation = {
        primordialDuckId: selectedDuck.id,
        droneId: selectedDrone.id,
        isAutoGuided: true
      };

      const createdOperation = await captureService.createOperation(operation);
      const captureResultEnum = captureResult === 'success' ? 1 : (captureResult === 'escaped' ? 2 : 3);
      const completePayload = {
        CaptureResult: captureResultEnum,
        Result: message
      };
      await captureService.completeOperation(createdOperation.id, completePayload);
      await updateDroneResourcesAfterMission(selectedDrone, selectedDuck, captureResult);
    } catch (error) {
      console.error('Erro ao salvar operação:', error);
    }

    setResult({ success, message, captureResult });
    setShowResultModal(true);

    if (captureResult === 'success') {
      await loadData();
    }
  };

  const updateDroneResourcesAfterMission = async (drone, duck, result) => {
    try {
      let fuelReduction = 0;
      let batteryReduction = 0;
      let integrityReduction = 0;

      switch (duck.hibernationStatus) {
        case 'Hibernação Profunda':
          fuelReduction = 10;
          batteryReduction = 10;
          integrityReduction = 5;
          break;
        case 'Hibernação Leve':
          fuelReduction = 20;
          batteryReduction = 20;
          integrityReduction = 15;
          break;
        case 'Desperto':
          fuelReduction = 35;
          batteryReduction = 35;
          integrityReduction = 30;
          break;
        default:
          fuelReduction = 15;
          batteryReduction = 15;
          integrityReduction = 10;
      }

      if (result === 'failed') {
        integrityReduction += 15;
        batteryReduction += 10;
      }

      if (result === 'escaped') {
        fuelReduction += 10;
        batteryReduction += 5;
      }

      const newFuelLevel = Math.max(0, drone.fuelLevel - fuelReduction);
      const newBatteryLevel = Math.max(0, drone.batteryLevel - batteryReduction);
      const newIntegrity = Math.max(0, drone.integrity - integrityReduction);

      setDroneImpact({
        fuelReduction,
        batteryReduction,
        integrityReduction,
        oldFuel: drone.fuelLevel,
        oldBattery: drone.batteryLevel,
        oldIntegrity: drone.integrity,
        newFuel: newFuelLevel,
        newBattery: newBatteryLevel,
        newIntegrity: newIntegrity
      });

      const response = await captureService.updateDroneStatus(drone.id, {
        fuelLevel: newFuelLevel,
        batteryLevel: newBatteryLevel,
        integrity: newIntegrity
      });
    } catch (error) {
      console.error('ERRO ao atualizar recursos do drone:', error);
      console.error('Detalhes do erro:', error.response?.data || error.message);
    }
  };

  const resetMission = () => {
    setSelectedDrone(null);
    setSelectedDuck(null);
    setStrategy(null);
    setGameState('ready');
    setResult(null);
    setDroneImpact(null);
    setShowResultModal(false);
  };

  const loadOperationHistory = async () => {
    try {
      setLoadingHistory(true);
      const operationsData = await captureService.getAll();
      setOperations(operationsData || []);
      setShowHistoryModal(true);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="capture-loading">
          <div className="loading-spinner"></div>
          <p>Carregando sistema de captura...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="capture-operation-page">
        <div className="capture-header">
          <div className="header-content">
            <div>
              <h1><Target size={32} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> 3ª Missão - Captura do Pato Primordial</h1>
              <p>Sistema de captura com mini-jogo interativo</p>
            </div>
            <button
              className="history-btn"
              onClick={loadOperationHistory}
              disabled={loadingHistory}
            >
              {loadingHistory ? <Clock size={16} /> : <ClipboardList size={16} />} Histórico
            </button>
          </div>
        </div>

        <div className="capture-grid">
          <div className="capture-selectors">
            <DroneSelector
              drones={drones}
              selectedDrone={selectedDrone}
              onDroneSelect={setSelectedDrone}
              onDroneUpdate={loadData}
            />

            <DuckSelector
              ducks={ducks}
              selectedDuck={selectedDuck}
              onDuckSelect={setSelectedDuck}
            />
          </div>

          {selectedDrone && selectedDuck && !strategy && (
            <div className="strategy-section">
              <button className="generate-btn" onClick={generateStrategy}>
                <Brain size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Gerar Estratégia Tática
              </button>
            </div>
          )}

          {strategy && (
            <div className="strategy-display">
              <h3><Brain size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Estratégia Gerada</h3>
              <div className="strategy-content">
                <p><strong>Ataque:</strong> {strategy.strategy}</p>
                <p><strong>Defesa do Alvo:</strong> {strategy.defenseGenerated}</p>
                <p><strong>Chance de Sucesso:</strong> {strategy.successChance}%</p>
                {strategy.reasoning && (
                  <p className="strategy-reasoning"><strong>Análise:</strong> {strategy.reasoning}</p>
                )}
              </div>
            </div>
          )}

          {strategy && !result && (
            <CaptureMode
              selectedDrone={selectedDrone}
              selectedDuck={selectedDuck}
              strategy={strategy}
              onCaptureComplete={handleCaptureComplete}
            />
          )}


        </div>

        <CaptureResultModal
          isOpen={showResultModal}
          onClose={() => {
            setShowResultModal(false);
            resetMission();
          }}
          result={result}
          selectedDuck={selectedDuck}
          selectedDrone={selectedDrone}
          droneImpact={droneImpact}
        />

        <Modal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          title="Histórico de Operações"
        >
          <OperationHistory operations={operations} />
        </Modal>
      </div>
    </Layout>
  );
};

export default CaptureOperationPage;