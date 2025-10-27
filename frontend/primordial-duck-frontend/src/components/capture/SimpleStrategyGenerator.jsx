import React, { useState } from 'react';
import { Brain, Zap } from 'lucide-react';
import './SimpleStrategyGenerator.css';

const SimpleStrategyGenerator = ({ selectedDrone, selectedDuck, onStrategyGenerated }) => {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateStrategy = async () => {
    if (!selectedDrone || !selectedDuck) return;

    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const strategies = [
      "Ataque aéreo com rede magnética",
      "Aproximação stealth com captura por sucção",
      "Uso de frequências sonoras para controle"
    ];

    const defenses = [
      "Chuva de brigadeiros para distração",
      "Hologramas de patos dançantes",
      "Campo de gravidade reversa"
    ];

    let successChance = 50;
    if (selectedDuck.hibernationStatus === 'Hibernação Profunda') successChance += 20;
    if (selectedDuck.hibernationStatus === 'Desperto') successChance -= 15;
    if (selectedDuck.superPowers?.length > 0) successChance -= selectedDuck.superPowers.length * 5;
    if (selectedDrone.batteryLevel < 50) successChance -= 10;

    successChance = Math.max(10, Math.min(90, successChance));

    const newStrategy = {
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
      defenseGenerated: defenses[Math.floor(Math.random() * defenses.length)],
      successChance
    };

    setStrategy(newStrategy);
    setLoading(false);
    onStrategyGenerated(newStrategy);
  };

  if (!selectedDrone || !selectedDuck) {
    return (
      <div className="simple-strategy-generator">
        <h3>🧠 Estratégia</h3>
        <p>Selecione um drone e um pato para gerar estratégia</p>
      </div>
    );
  }

  return (
    <div className="simple-strategy-generator">
      <h3>🧠 Estratégia</h3>

      {!strategy && !loading && (
        <button className="generate-btn" onClick={generateStrategy}>
          <Brain size={16} />
          Gerar Estratégia
        </button>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analisando...</p>
        </div>
      )}

      {strategy && (
        <div className="strategy-result">
          <div className="strategy-item">
            <strong>Ataque:</strong>
            <p>{strategy.strategy}</p>
          </div>
          <div className="strategy-item">
            <strong>Defesa:</strong>
            <p>{strategy.defenseGenerated}</p>
          </div>
          <div className="success-chance">
            <strong>Chance: {strategy.successChance}%</strong>
          </div>
          <button className="new-strategy-btn" onClick={generateStrategy}>
            <Zap size={16} />
            Nova Estratégia
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleStrategyGenerator;