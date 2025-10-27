import React, { useState } from 'react';
import FlappyDroneGame from './FlappyDroneGame.jsx';
import AngryDroneGame from './AngryDroneGame.jsx';
import ClickRushGame from './ClickRushGame.jsx';
import CaptureAnimation from './CaptureAnimation.jsx';
import './MiniGameSelector.css';

const MiniGameSelector = ({ selectedDrone, selectedDuck, strategy, onCaptureComplete }) => {
  const [selectedGame, setSelectedGame] = useState('flappy');
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationResult, setAnimationResult] = useState(null);

  if (!selectedDrone || !selectedDuck || !strategy) {
    return (
      <div className="mini-game-selector">
        <h3>🎮 Mini-Jogos de Captura</h3>
        <p>Complete as etapas anteriores para escolher um jogo</p>
      </div>
    );
  }

  const games = [
    { id: 'flappy', name: '🚁 Flappy Drone', desc: 'Voe evitando obstáculos' },
    { id: 'angry', name: '🎯 Angry Drone', desc: 'Mire e atire no pato' },
    { id: 'click', name: '⚡ Click Rush', desc: 'Clique rápido para manter força' }
  ];

  const handleGameComplete = (success, message, result) => {
    setAnimationResult({ success, message, result });
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    onCaptureComplete(animationResult.success, animationResult.message, animationResult.result);
  };

  const renderGame = () => {
    switch (selectedGame) {
      case 'flappy':
        return <FlappyDroneGame strategy={strategy} onComplete={handleGameComplete} />;
      case 'angry':
        return <AngryDroneGame strategy={strategy} onComplete={handleGameComplete} />;
      case 'click':
        return <ClickRushGame strategy={strategy} onComplete={handleGameComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="mini-game-selector">
      <div className="game-selector">
        <h3>🎮 Escolha o Mini-Jogo</h3>
        <div className="game-options">
          {games.map(game => (
            <button
              key={game.id}
              className={`game-option ${selectedGame === game.id ? 'active' : ''}`}
              onClick={() => setSelectedGame(game.id)}
            >
              <span className="game-name">{game.name}</span>
              <span className="game-desc">{game.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="game-container">
        {renderGame()}
      </div>

      <CaptureAnimation
        isVisible={showAnimation}
        success={animationResult?.success}
        onComplete={handleAnimationComplete}
      />
    </div>
  );
};

export default MiniGameSelector;