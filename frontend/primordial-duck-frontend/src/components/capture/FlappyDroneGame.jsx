import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import './FlappyDroneGame.css';

const FlappyDroneGame = ({ strategy, onComplete }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [drone, setDrone] = useState({ x: 100, y: 200, velocity: 0 });
  const [pipes, setPipes] = useState([]);
  const [duck, setDuck] = useState({ x: 300, y: 200 });

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        updateGame();
      }, 50);
      return () => clearInterval(interval);
    }
  }, [gameState, drone, pipes]);

  useEffect(() => {
    draw();
  }, [drone, pipes, duck]);

  const updateGame = () => {
    if (score >= 300) {
      setGameState('success');
      onComplete(true, 'Pato capturado com sucesso! Distância percorrida: 300m', 'success');
      return;
    }

    setDrone(prev => ({
      ...prev,
      y: prev.y + prev.velocity,
      velocity: prev.velocity + 0.8
    }));

    setPipes(prev => {
      let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - 3 }))
        .filter(pipe => pipe.x > -60);

      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < 400) {
        const gap = 120;
        const pipeHeight = Math.random() * 150 + 50;
        newPipes.push({
          x: 600,
          topHeight: pipeHeight,
          bottomY: pipeHeight + gap
        });
      }

      return newPipes;
    });

    if (drone.y < 0 || drone.y > 350) {
      setGameState('failed');
      const escaped = Math.random() < 0.5;
      const result = escaped ? 'escaped' : 'failed';
      const message = escaped
        ? 'Drone colidiu! O pato conseguiu fugir!'
        : 'Drone colidiu! O pato contra-atacou!';
      onComplete(false, message, result);
      return;
    }

    pipes.forEach(pipe => {
      if (drone.x > pipe.x - 20 && drone.x < pipe.x + 40) {
        if (drone.y < pipe.topHeight || drone.y > pipe.bottomY) {
          setGameState('failed');
          const escaped = Math.random() < 0.5;
          const result = escaped ? 'escaped' : 'failed';
          const message = escaped
            ? 'Drone colidiu com obstáculo! O pato conseguiu fugir!'
            : 'Drone colidiu com obstáculo! O pato contra-atacou!';
          onComplete(false, message, result);
          return;
        }
      }
    });

    setScore(prev => prev + 1);
  };

  const jump = () => {
    if (gameState === 'playing') {
      setDrone(prev => ({ ...prev, velocity: -12 }));
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setDrone({ x: 100, y: 200, velocity: 0 });
    setPipes([]);
  };

  const resetGame = () => {
    setGameState('ready');
    setScore(0);
    setDrone({ x: 100, y: 200, velocity: 0 });
    setPipes([]);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 3; i++) {
      const x = (i * 200 + score * 0.5) % (canvas.width + 100);
      ctx.beginPath();
      ctx.arc(x, 50 + i * 30, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    pipes.forEach(pipe => {
      const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + 40, 0);
      pipeGradient.addColorStop(0, '#228B22');
      pipeGradient.addColorStop(0.5, '#32CD32');
      pipeGradient.addColorStop(1, '#228B22');
      ctx.fillStyle = pipeGradient;

      ctx.fillRect(pipe.x, 0, 40, pipe.topHeight);
      ctx.fillRect(pipe.x, pipe.bottomY, 40, canvas.height - pipe.bottomY);

      ctx.strokeStyle = '#006400';
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, 0, 40, pipe.topHeight);
      ctx.strokeRect(pipe.x, pipe.bottomY, 40, canvas.height - pipe.bottomY);
    });

    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(drone.x - 15, drone.y - 8, 30, 16);

    ctx.fillStyle = '#34495E';
    ctx.fillRect(drone.x - 20, drone.y - 4, 12, 8);
    ctx.fillRect(drone.x + 8, drone.y - 4, 12, 8);

    ctx.strokeStyle = '#7F8C8D';
    ctx.lineWidth = 2;
    const rotorSpeed = Date.now() * 0.02;
    for (let i = 0; i < 2; i++) {
      const centerX = i === 0 ? drone.x - 14 : drone.x + 14;
      const centerY = drone.y;
      for (let j = 0; j < 2; j++) {
        const angle = (j * Math.PI) + rotorSpeed;
        ctx.beginPath();
        ctx.moveTo(centerX - Math.cos(angle) * 6, centerY - Math.sin(angle) * 6);
        ctx.lineTo(centerX + Math.cos(angle) * 6, centerY + Math.sin(angle) * 6);
        ctx.stroke();
      }
    }

    const duckBob = Math.sin(Date.now() * 0.005) * 3;
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(duck.x, duck.y + duckBob, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.moveTo(duck.x + 15, duck.y + duckBob);
    ctx.lineTo(duck.x + 25, duck.y + duckBob - 5);
    ctx.lineTo(duck.x + 25, duck.y + duckBob + 5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(duck.x - 5, duck.y + duckBob - 5, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 5, 240, 50);
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Distância: ${score}m / 300m`, 20, 28);

    const progressWidth = 220;
    const progressHeight = 12;
    const progressX = 20;
    const progressY = 38;
    const progress = Math.min(score / 300, 1);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(progressX, progressY, progressWidth, progressHeight);

    const progressGradient = ctx.createLinearGradient(progressX, progressY, progressX + progressWidth, progressY);
    progressGradient.addColorStop(0, '#4CAF50');
    progressGradient.addColorStop(1, '#FFD700');
    ctx.fillStyle = progressGradient;
    ctx.fillRect(progressX, progressY, progressWidth * progress, progressHeight);

    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(progressX, progressY, progressWidth, progressHeight);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(canvas.width - 110, 5, 105, 40);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎯 Objetivo', canvas.width - 57, 18);
    ctx.fillStyle = '#FFF';
    ctx.font = '12px Arial';
    ctx.fillText('300m', canvas.width - 57, 35);
  };

  return (
    <div className="flappy-drone-game">
      <div className="game-header">
        <h4>🚁 Flappy Drone</h4>
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
        height={350}
        onClick={jump}
        className="game-canvas"
      />

      <div className="game-info">
        <p><strong>🎯 Objetivo:</strong> Percorra 300m sem colidir para capturar o pato</p>
        <p><strong>🖱️ Controle:</strong> Clique para fazer o drone subir</p>
        <p><strong>⚡ Estratégia:</strong> {strategy.strategy}</p>
        <div className="game-tips">
          <span className="tip">💡 Dica: Mantenha o drone na altura média para ter mais controle</span>
        </div>
      </div>
    </div>
  );
};

export default FlappyDroneGame;