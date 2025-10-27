import React, { useState } from 'react';
import { Target, Zap, Eye, Heart, MapPin, Moon, HelpCircle } from 'lucide-react';
import { getHibernationStatusName } from '../../enums/index.js';
import './TargetDuckSelector.css';

const TargetDuckSelector = ({ ducks, selectedDuck, onDuckSelect }) => {
  const [hoveredDuck, setHoveredDuck] = useState(null);

  const availableDucks = ducks.filter(duck => !duck.isCaptured);

  const getDifficultyLevel = (duck) => {
    let difficulty = 1;

    const statusName = getHibernationStatusName(duck.hibernationStatus);
    if (statusName === 'Desperto') difficulty += 2;
    else if (statusName === 'Em Transe') difficulty += 1;

    difficulty += Math.floor(duck.mutationCount / 3);

    difficulty += (duck.superPowers?.length || 0);

    if (duck.height > 150) difficulty += 1;
    if (duck.weight > 5000) difficulty += 1;

    return Math.min(5, Math.max(1, difficulty));
  };

  const getDifficultyColor = (level) => {
    const colors = {
      1: '#4CAF50',
      2: '#8BC34A',
      3: '#FF9800',
      4: '#FF5722',
      5: '#F44336'
    };
    return colors[level] || colors[3];
  };

  const getDifficultyText = (level) => {
    const texts = {
      1: 'Muito Fácil',
      2: 'Fácil',
      3: 'Médio',
      4: 'Difícil',
      5: 'Extremo'
    };
    return texts[level] || 'Médio';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Desperto': return <Eye size={16} />;
      case 'Em Transe': return <Zap size={16} />;
      case 'Hibernação Profunda': return <Moon size={16} />;
      default: return <HelpCircle size={16} />;
    }
  };

  if (!availableDucks || availableDucks.length === 0) {
    return (
      <div className="no-target-ducks">
        <Target size={48} />
        <h3>Nenhum Pato Disponível</h3>
        <p>Todos os Patos Primordiais já foram capturados ou não há patos registrados</p>
      </div>
    );
  }

  return (
    <div className="target-duck-selector">
      <div className="selector-header">
        <h3><Target size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Alvos Disponíveis</h3>
        <p>Selecione um Pato Primordial para capturar</p>
      </div>

      <div className="ducks-grid">
        {availableDucks.map(duck => {
          const difficulty = getDifficultyLevel(duck);
          const isSelected = selectedDuck?.id === duck.id;
          const isHovered = hoveredDuck === duck.id;

          return (
            <div
              key={duck.id}
              className={`duck-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onDuckSelect(duck)}
              onMouseEnter={() => setHoveredDuck(duck.id)}
              onMouseLeave={() => setHoveredDuck(null)}
            >
              <div className="duck-card-header">
                <div className="duck-info">
                  <h4>{duck.name}</h4>
                  <span className="species">{duck.species}</span>
                </div>
                <div
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(difficulty) }}
                >
                  <span>Nível {difficulty}</span>
                  <small>{getDifficultyText(difficulty)}</small>
                </div>
              </div>

              <div className="duck-visual">
                <div className={`duck-avatar ${isHovered ? 'hover' : ''}`}>
                  <Target size={40} />
                </div>
                <div className="status-indicator">
                  <span className="status-icon">{getStatusIcon(duck.hibernationStatus)}</span>
                  <span className="status-text">{getHibernationStatusName(duck.hibernationStatus)}</span>
                </div>
                {isSelected && (
                  <div className="selection-crosshair">
                    <Target size={24} />
                  </div>
                )}
              </div>

              <div className="duck-stats">
                <div className="stat-group">
                  <div className="stat-item">
                    <span className="stat-label">Altura:</span>
                    <span className="stat-value">{duck.height}cm</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Peso:</span>
                    <span className="stat-value">{duck.weight}g</span>
                  </div>
                </div>

                <div className="stat-group">
                  <div className="stat-item">
                    <span className="stat-label">Mutações:</span>
                    <span className="stat-value">{duck.mutationCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Poderes:</span>
                    <span className="stat-value">{duck.superPowers?.length || 0}</span>
                  </div>
                </div>

                {getHibernationStatusName(duck.hibernationStatus) !== 'Desperto' && (
                  <div className="stat-group">
                    <div className="stat-item">
                      <Heart size={14} />
                      <span className="stat-label">BPM:</span>
                      <span className="stat-value">{duck.heartRate}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="duck-location">
                <MapPin size={14} />
                <span>
                  {duck.location?.latitude?.toFixed(4)}, {duck.location?.longitude?.toFixed(4)}
                </span>
                <small>Precisão: {duck.location?.precision}m</small>
              </div>

              {duck.superPowers && duck.superPowers.length > 0 && (
                <div className="super-powers">
                  <Zap size={14} />
                  <span>Poderes:</span>
                  <div className="powers-list">
                    {duck.superPowers.slice(0, 2).map((power, index) => (
                      <span key={index} className="power-tag">
                        {power.name}
                      </span>
                    ))}
                    {duck.superPowers.length > 2 && (
                      <span className="power-tag more">
                        +{duck.superPowers.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {isSelected && (
                <div className="selected-overlay">
                  <div className="selected-text">ALVO SELECIONADO</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TargetDuckSelector;