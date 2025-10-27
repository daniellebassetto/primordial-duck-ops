import React, { useState } from 'react';
import { Brain, Zap, Shield, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import './StrategyGenerator.css';

const StrategyGenerator = ({ selectedDrone, selectedDuck, onStrategyGenerated }) => {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateStrategy = async () => {
    if (!selectedDrone || !selectedDuck) return;

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newStrategy = createStrategy(selectedDrone, selectedDuck);
      setStrategy(newStrategy);
      onStrategyGenerated(newStrategy);
    } catch (err) {
      setError('Erro ao gerar estratégia. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const createStrategy = (drone, duck) => {
    const strategies = [];
    const defenses = [];
    let baseSuccessChance = 50;

    if (duck.height > 100) {
      strategies.push("Ataque aéreo com projéteis de rede magnética");
      baseSuccessChance += 10;
    } else {
      strategies.push("Aproximação stealth com captura por sucção");
      baseSuccessChance += 15;
    }

    switch (duck.hibernationStatus) {
      case 'Hibernação Profunda':
        strategies.push("Aproveitar estado dormiente para captura silenciosa");
        baseSuccessChance += 25;
        break;
      case 'Em Transe':
        strategies.push("Usar frequências sonoras para manter o transe");
        baseSuccessChance += 15;
        break;
      case 'Desperto':
        strategies.push("Táticas de distração com hologramas");
        baseSuccessChance -= 10;
        break;
    }

    if (duck.superPowers && duck.superPowers.length > 0) {
      duck.superPowers.forEach(power => {
        if (power.name.includes('Teleporte')) {
          defenses.push("Ativar campo de contenção dimensional");
          baseSuccessChance -= 15;
        } else if (power.name.includes('Velocidade')) {
          defenses.push("Implantar rede de captura em múltiplos pontos");
          baseSuccessChance -= 10;
        } else if (power.name.includes('Força')) {
          defenses.push("Usar escudo de energia reforçado");
          baseSuccessChance -= 12;
        } else if (power.name.includes('Invisibilidade')) {
          defenses.push("Ativar sensores térmicos e de movimento");
          baseSuccessChance -= 8;
        } else {
          defenses.push("Contramedida genérica anti-poder");
          baseSuccessChance -= 5;
        }
      });
    }

    const randomDefenses = [
      "Convocar um exército de patos de borracha para confundir o alvo",
      "Ativar chuva de brigadeiros para distrair com chocolate",
      "Teleportar crianças de festa infantil para o local",
      "Criar hologramas de patos gigantes dançando",
      "Invocar uma tempestade de penas douradas",
      "Ativar campo de gravidade reversa",
      "Materializar um lago artificial instantâneo",
      "Convocar um coro de patos cantando ópera"
    ];

    if (defenses.length === 0) {
      defenses.push(randomDefenses[Math.floor(Math.random() * randomDefenses.length)]);
    }

    if (drone.batteryLevel < 50) baseSuccessChance -= 10;
    if (drone.fuelLevel < 50) baseSuccessChance -= 10;
    if (drone.integrity < 70) baseSuccessChance -= 15;

    const finalSuccessChance = Math.max(10, Math.min(90, baseSuccessChance));

    return {
      strategy: strategies.join(" + "),
      defenseGenerated: defenses.join(" + "),
      successChance: finalSuccessChance,
      reasoning: generateReasoning(drone, duck, finalSuccessChance),
      riskLevel: getRiskLevel(finalSuccessChance),
      estimatedDuration: Math.floor(Math.random() * 300) + 120,
      resourceCost: calculateResourceCost(drone, duck)
    };
  };

  const generateReasoning = (drone, duck, successChance) => {
    const factors = [];

    if (duck.hibernationStatus === 'Hibernação Profunda') {
      factors.push("alvo em estado vulnerável");
    } else if (duck.hibernationStatus === 'Desperto') {
      factors.push("alvo em estado de alerta máximo");
    }

    if (duck.superPowers && duck.superPowers.length > 2) {
      factors.push("múltiplos super poderes detectados");
    }

    if (drone.integrity < 70) {
      factors.push("integridade do drone comprometida");
    }

    if (successChance > 70) {
      return `Alta probabilidade de sucesso devido a: ${factors.join(", ")}`;
    } else if (successChance > 40) {
      return `Chance moderada considerando: ${factors.join(", ")}`;
    } else {
      return `Operação de alto risco devido a: ${factors.join(", ")}`;
    }
  };

  const getRiskLevel = (successChance) => {
    if (successChance > 70) return { level: 'Baixo', color: '#4CAF50' };
    if (successChance > 40) return { level: 'Médio', color: '#FF9800' };
    return { level: 'Alto', color: '#F44336' };
  };

  const calculateResourceCost = (drone, duck) => {
    let cost = 100;

    if (duck.superPowers) cost += duck.superPowers.length * 50;
    if (duck.hibernationStatus === 'Desperto') cost += 100;
    if (duck.mutationCount > 5) cost += duck.mutationCount * 20;

    return cost;
  };

  const getSuccessColor = (chance) => {
    if (chance > 70) return '#4CAF50';
    if (chance > 40) return '#FF9800';
    return '#F44336';
  };

  if (!selectedDrone || !selectedDuck) {
    return (
      <div className="strategy-placeholder">
        <Brain size={48} />
        <p>Selecione um drone e um pato para gerar estratégia</p>
      </div>
    );
  }

  return (
    <div className="strategy-generator">
      <div className="generator-header">
        <h3>🧠 Gerador de Estratégias</h3>
        <p>Análise tática para captura do Pato Primordial</p>
      </div>

      {!strategy && !loading && (
        <div className="generate-section">
          <div className="mission-brief">
            <h4>📋 Briefing da Missão</h4>
            <div className="brief-grid">
              <div className="brief-item">
                <strong>Drone:</strong> {selectedDrone.model}
                <small>Status: {selectedDrone.batteryLevel}% | {selectedDrone.fuelLevel}% | {selectedDrone.integrity}%</small>
              </div>
              <div className="brief-item">
                <strong>Alvo:</strong> {selectedDuck.name}
                <small>{selectedDuck.species} - {selectedDuck.hibernationStatus}</small>
              </div>
            </div>
          </div>

          <button
            className="generate-btn"
            onClick={generateStrategy}
            disabled={loading}
          >
            <Brain size={20} />
            Gerar Estratégia Tática
          </button>
        </div>
      )}

      {loading && (
        <div className="strategy-loading">
          <div className="loading-animation">
            <Brain size={32} />
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <p>Analisando características do alvo...</p>
          <p>Calculando probabilidades de sucesso...</p>
          <p>Gerando contramedidas defensivas...</p>
        </div>
      )}

      {error && (
        <div className="strategy-error">
          <AlertTriangle size={24} />
          <p>{error}</p>
          <button className="retry-btn" onClick={generateStrategy}>
            Tentar Novamente
          </button>
        </div>
      )}

      {strategy && (
        <div className="strategy-display">
          <div className="strategy-header">
            <h4>⚡ Estratégia Gerada</h4>
            <div className="risk-indicator" style={{ backgroundColor: strategy.riskLevel.color }}>
              Risco: {strategy.riskLevel.level}
            </div>
          </div>

          <div className="strategy-content">
            <div className="strategy-section">
              <div className="section-header">
                <Target size={18} />
                <h5>Plano de Ataque</h5>
              </div>
              <p className="strategy-text">{strategy.strategy}</p>
            </div>

            <div className="strategy-section">
              <div className="section-header">
                <Shield size={18} />
                <h5>Sistema de Defesa Aleatória</h5>
              </div>
              <p className="defense-text">{strategy.defenseGenerated}</p>
            </div>

            <div className="strategy-metrics">
              <div className="metric-item">
                <TrendingUp size={16} />
                <span>Chance de Sucesso</span>
                <div className="success-bar">
                  <div
                    className="success-fill"
                    style={{
                      width: `${strategy.successChance}%`,
                      backgroundColor: getSuccessColor(strategy.successChance)
                    }}
                  />
                </div>
                <span
                  className="success-percentage"
                  style={{ color: getSuccessColor(strategy.successChance) }}
                >
                  {strategy.successChance}%
                </span>
              </div>

              <div className="metric-grid">
                <div className="metric-card">
                  <span className="metric-label">Duração Estimada</span>
                  <span className="metric-value">{Math.floor(strategy.estimatedDuration / 60)}:{(strategy.estimatedDuration % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="metric-card">
                  <span className="metric-label">Custo de Recursos</span>
                  <span className="metric-value">{strategy.resourceCost} UC</span>
                </div>
              </div>
            </div>

            <div className="strategy-reasoning">
              <h6>📊 Análise Tática</h6>
              <p>{strategy.reasoning}</p>
            </div>
          </div>

          <button
            className="new-strategy-btn"
            onClick={generateStrategy}
            disabled={loading}
          >
            <Zap size={16} />
            Gerar Nova Estratégia
          </button>
        </div>
      )}
    </div>
  );
};

export default StrategyGenerator;