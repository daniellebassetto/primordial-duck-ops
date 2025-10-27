import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import './ClickRushGame.css';

const ClickRushGame = ({ strategy, onComplete }) => {
  const [gameState, setGameState] = useState('ready');
  const [power, setPower] = useState(50);
  const [timeLeft, setTimeLeft] = useState(10);
  const [clicks, setClicks] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      intervalRef.current = setInterval(() => {
        setPower(prev => Math.max(0, prev - 2));
      }, 200);

      return () => {
        clearInterval(timer);
        clearInterval(intervalRef.current);
      };
    }
  }, [gameState]);

  const endGame = () => {
    setGameState('completed');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setPower(currentPower => {
      if (currentPower >= 90 && currentPower <= 100) {
        onComplete(true, 'Pato capturado com sucesso! Força final entre 90-100%!', 'success');
      } else {
        const escaped = Math.random() < 0.5;
        const result = escaped ? 'escaped' : 'failed';
        const message = escaped
          ? 'Força insuficiente! O pato conseguiu fugir!'
          : 'Força insuficiente! O pato contra-atacou!';
        onComplete(false, message, result);
      }
      return currentPower;
    });
  };

  const handleClick = () => {
    if (gameState === 'playing') {
      setPower(prev => Math.min(100, prev + 8));
      setClicks(prev => prev + 1);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setPower(50);
    setTimeLeft(10);
    setClicks(0);
  };

  const resetGame = () => {
    setGameState('ready');
    setPower(50);
    setTimeLeft(10);
    setClicks(0);
  };

  const getPowerColor = () => {
    if (power >= 80) return '#4CAF50';
    if (power >= 50) return '#FF9800';
    return '#f44336';
  };

  return (
    <div className="click-rush-game">
      <div className="game-header">
        <h4>⚡ Click Rush</h4>
        <div className="controls">
          {gameState === 'ready' && (
            <button className="start-btn" onClick={startGame}>
              <Play size={16} />
              Iniciar
            </button>
          )}
          <button className="reset-btn" onClick={resetGame}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="game-area" onClick={handleClick}>
        <div className="power-bar-container">
          <div className="power-label">Força de Captura</div>
          <div className="power-bar">
            <div
              className="power-fill"
              style={{
                width: `${power}%`,
                backgroundColor: getPowerColor()
              }}
            />
          </div>
          <div className="power-text">{power}%</div>
        </div>

        {gameState === 'playing' && (
          <div className="game-hud">
            <div className="hud-item">
              <span>⏱️ Tempo: {timeLeft}s</span>
            </div>
            <div className="hud-item">
              <span>👆 Cliques: {clicks}</span>
            </div>
            <div className="click-indicator">
              {power >= 90 && power <= 100 ? '🎯 ZONA IDEAL!' : power > 100 ? '⚠️ MUITO FORTE!' : '⚡ CLIQUE MAIS!'}
            </div>
          </div>
        )}

        {gameState === 'ready' && (
          <div className="instructions">
            <p>🎯 Clique por 10 segundos e termine com força entre 90-100%!</p>
            <p>⚠️ A força diminui automaticamente, então continue clicando!</p>
          </div>
        )}
      </div>

      <div className="game-info">
        <p><strong>🎯 Objetivo:</strong> Termine com força entre 90-100% quando o tempo acabar</p>
        <p><strong>🖱️ Controle:</strong> Clique rapidamente na área do jogo</p>
        <p><strong>⚡ Estratégia:</strong> {strategy.strategy}</p>
      </div>
    </div>
  );
};

export default ClickRushGame;