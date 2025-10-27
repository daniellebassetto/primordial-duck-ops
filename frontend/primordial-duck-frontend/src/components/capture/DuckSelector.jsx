import React, { useState } from 'react';
import { Target, Zap, Heart, MapPin, CheckCircle, Lock, Eye, Zap as ZapCircle, Moon, HelpCircle } from 'lucide-react';
import Modal from '../Modal';
import { getHibernationStatusName } from '../../enums/index.js';
import './DuckSelector.css';

const DuckSelector = ({ ducks, selectedDuck, onDuckSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDuckSelect = (duck) => {
    onDuckSelect(duck);
    setIsModalOpen(false);
  };
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
    const colors = ['#4CAF50', '#8BC34A', '#FF9800', '#FF5722', '#F44336'];
    return colors[level - 1] || colors[2];
  };

  const getDifficultyText = (level) => {
    const texts = ['Muito Fácil', 'Fácil', 'Médio', 'Difícil', 'Extremo'];
    return texts[level - 1] || 'Médio';
  };

  const getStatusIcon = (status) => {
    const statusName = getHibernationStatusName(status);
    switch (statusName) {
      case 'Desperto': return <Eye size={16} />;
      case 'Em Transe': return <ZapCircle size={16} />;
      case 'Hibernação Profunda': return <Moon size={16} />;
      default: return <HelpCircle size={16} />;
    }
  };

  return (
    <div className="duck-selector">
      <h3><Target size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Alvo</h3>
      <div className="selected-display" onClick={() => setIsModalOpen(true)}>
        {selectedDuck ? (
          <div className="selected-item">
            <div className="item-info">
              <h4>{selectedDuck.name || `Espécime #${selectedDuck.id}`}</h4>
              <span>{selectedDuck.location?.cityName}, {selectedDuck.location?.country}</span>
            </div>
            <button className="change-btn">Alterar</button>
          </div>
        ) : (
          <div className="select-placeholder">
            <span>Clique para selecionar um alvo</span>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Selecionar Alvo"
      >
        {availableDucks.length === 0 ? (
          <div className="no-ducks">
            <Lock size={48} />
            <h4>Nenhum Pato Disponível</h4>
            <p>Todos os patos foram capturados ou não há patos registrados</p>
          </div>
        ) : (
          <div className="ducks-grid">
            {availableDucks.map(duck => {
              const difficulty = getDifficultyLevel(duck);
              const isSelected = selectedDuck?.id === duck.id;

              return (
                <div
                  key={duck.id}
                  className={`duck-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleDuckSelect(duck)}
                >
                  {isSelected && (
                    <div className="selected-badge">
                      <CheckCircle size={20} />
                      ALVO SELECIONADO
                    </div>
                  )}

                  <div className="duck-header">
                    <div className="duck-avatar"><Target size={24} /></div>
                    <div className="duck-info">
                      <h4>{duck.name || `Espécime #${duck.id}`}</h4>
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

                  <div className="duck-info-grid">
                    <div className="duck-status">
                      <div className="status-indicator">
                        <span className="status-icon">{getStatusIcon(duck.hibernationStatus)}</span>
                        <span className="status-text">{getHibernationStatusName(duck.hibernationStatus)}</span>
                      </div>
                    </div>

                    <div className="duck-location">
                      <MapPin size={14} />
                      <span>{duck.location?.cityName}, {duck.location?.country}</span>
                    </div>

                    <div className="duck-specs">
                      {getHibernationStatusName(duck.hibernationStatus) !== 'Desperto' && duck.heartRate && (
                        <div className="heart-rate">
                          <Heart size={14} />
                          <span>{duck.heartRate} BPM</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {duck.superPowers && duck.superPowers.length > 0 && (
                    <div className="super-powers">
                      <Zap size={14} />
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
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DuckSelector;