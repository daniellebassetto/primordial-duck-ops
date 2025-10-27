import React, { useState } from 'react';
import { Gamepad2, Zap, Play, Plane, Target, PartyPopper, Wind, Bomb } from 'lucide-react';
import MiniGameSelector from './MiniGameSelector.jsx';
import './CaptureMode.css';

const CaptureMode = ({ selectedDrone, selectedDuck, strategy, onCaptureComplete }) => {
  const [mode, setMode] = useState(null);
  const [autoResult, setAutoResult] = useState(null);

  const executeAutoCapture = () => {
    const random = Math.random() * 100;
    const success = random < strategy.successChance;

    let result, message;
    if (success) {
      result = 'success';
      message = `Pato ${selectedDuck.name || `#${selectedDuck.id}`} capturado com sucesso!`;
    } else {
      const escaped = Math.random() < 0.5;
      result = escaped ? 'escaped' : 'failed';
      message = escaped ? `Pato ${selectedDuck.name || `#${selectedDuck.id}`} conseguiu fugir!` : `Pato ${selectedDuck.name || `#${selectedDuck.id}`} venceu o combate!`;
    }

    setTimeout(() => {
      onCaptureComplete(success, message, result);
    }, 3000);
  };

  if (!selectedDrone || !selectedDuck || !strategy) {
    return (
      <div className="capture-mode-placeholder">
        <Gamepad2 size={48} />
        <p>Complete as etapas anteriores para escolher o modo de captura</p>
      </div>
    );
  }

  if (mode === 'manual') {
    return (
      <MiniGameSelector
        selectedDrone={selectedDrone}
        selectedDuck={selectedDuck}
        strategy={strategy}
        onCaptureComplete={(success, message, result) => {
          onCaptureComplete(success, message, result);
        }}
      />
    );
  }

  return (
    <div className="capture-mode">
      <h3><Target size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Modo de Captura</h3>

      {!mode && !autoResult && (
        <div className="mode-selection">
          <p>Escolha como executar a operação de captura:</p>

          <div className="mode-options">
            <button
              className="mode-btn auto"
              onClick={() => {
                setMode('auto');
                executeAutoCapture();
              }}
            >
              <Zap size={24} />
              <div className="mode-info">
                <h4>Captura Autoguiada</h4>
                <p>Sistema automático baseado na estratégia</p>
                <small>Chance: {strategy.successChance}%</small>
              </div>
            </button>

            <button
              className="mode-btn manual"
              onClick={() => setMode('manual')}
            >
              <Gamepad2 size={24} />
              <div className="mode-info">
                <h4>Captura Manual</h4>
                <p>Controle direto através de mini-jogos</p>
                <small>Sua habilidade determina o resultado</small>
              </div>
            </button>
          </div>
        </div>
      )}

      {mode === 'auto' && !autoResult && (
        <div className="auto-execution">
          <div className="execution-animation">
            <div className="drone-icon"><Plane size={40} /></div>
            <div className="vs-text">VS</div>
            <div className="duck-icon"><Target size={40} /></div>
          </div>
          <h4>Executando Captura Autoguiada</h4>
          <p>Drone aplicando estratégia: {strategy.strategy}</p>
          <p>Defesa ativa: {strategy.defenseGenerated}</p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      )}


    </div>
  );
};

export default CaptureMode;