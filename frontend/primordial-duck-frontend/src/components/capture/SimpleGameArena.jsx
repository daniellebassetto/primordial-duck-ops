import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import './SimpleGameArena.css';

const SimpleGameArena = ({ selectedDrone, selectedDuck, strategy, onCaptureComplete }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [dronePos, setDronePos] = useState({ x: 100, y: 200 });
  const [duckPos, setDuckPos] = useState({ x: 500, y: 200 });
  const [progress, setProgress] = useState(0);
  const [gameTime, setGameTime] = useState(0);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        setGameTime(prev => prev + 100);

        setDuckPos(prev => ({
          x: 500 + Math.sin(gameTime * 0.001) * 100,
          y: 200 + Math.cos(gameTime * 0.0015) * 50
        }));

        const distance = Math.sqrt(
          Math.pow(dronePos.x - duckPos.x, 2) +
          Math.pow(dronePos.y - duckPos.y, 2)
        );

        if (distance < 60) {
          setProgress(prev => {
            const newProgress = prev + 2;
            if (newProgress >= 100) {
              setGameState('completed');
              onCaptureComplete(true, 'Pato capturado!');
              return 100;
            }
            return newProgress;
          });
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [gameState, gameTime, dronePos, duckPos, onCaptureComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#333';
    ctx.fillRect(dronePos.x - 15, dronePos.y - 10, 30, 20);
    ctx.fillStyle = '#666';
    ctx.fillRect(dronePos.x - 20, dronePos.y - 5, 10, 10);
    ctx.fillRect(dronePos.x + 10, dronePos.y - 5, 10, 10);

    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(duckPos.x, duckPos.y, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.moveTo(duckPos.x + 15, duckPos.y);
    ctx.lineTo(duckPos.x + 25, duckPos.y - 5);
    ctx.lineTo(duckPos.x + 25, duckPos.y + 5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(duckPos.x - 5, duckPos.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();

    if (progress > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(duckPos.x - 30, duckPos.y - 40, 60, 8);
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(duckPos.x - 30, duckPos.y - 40, (60 * progress) / 100, 8);
    }
  });

  const handleCanvasClick = (e) => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDronePos({ x, y });
  };

  const startGame = () => {
    setGameState('playing');
    setProgress(0);
    setGameTime(0);
    setDronePos({ x: 100, y: 200 });
  };

  const resetGame = () => {
    setGameState('ready');
    setProgress(0);
    setGameTime(0);
    setDronePos({ x: 100, y: 200 });
    setDuckPos({ x: 500, y: 200 });
  };

  if (!selectedDrone || !selectedDuck || !strategy) {
    return (
      <div className="simple-game-arena">
        <h3>🎮 Arena de Captura</h3>
        <p>Complete as etapas anteriores para iniciar</p>
      </div>
    );
  }

  return (
    <div className="simple-game-arena">
      <div className="arena-header">
        <h3>🎮 Arena de Captura</h3>
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

      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        onClick={handleCanvasClick}
        className="game-canvas"
      />

      <div className="game-info">
        <p><strong>Estratégia:</strong> {strategy.strategy}</p>
        <p><strong>Progresso:</strong> {Math.round(progress)}%</p>
        <p><strong>Instruções:</strong> Clique para mover o drone próximo ao pato</p>
      </div>
    </div>
  );
};

export default SimpleGameArena;