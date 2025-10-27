import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import './ChaseDuckGame.css';

const ChaseDuckGame = ({ strategy, onComplete }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [drone, setDrone] = useState({ x: 50, y: 175 });
  const [duck, setDuck] = useState({ x: 500, y: 175 });
  const [keys, setKeys] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    if (gameState === 'playing') {
      const gameInterval = setInterval(() => {
        updateGame();
      }, 50);

      const timerInterval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('failed');
            const escaped = Math.random() < 0.5;
            const result = escaped ? 'escaped' : 'failed';
            const message = escaped
              ? 'Tempo esgotado! O pato conseguiu fugir!'
              : 'Tempo esgotado! O pato contra-atacou!';
            onComplete(false, message, result);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
      };
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    draw();
  }, [drone, duck]);

  const updateGame = () => {
    let newDroneX = drone.x;
    let newDroneY = drone.y;

    if (keys['ArrowLeft'] || keys['a'] || keys['A']) newDroneX -= 4;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) newDroneX += 4;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) newDroneY -= 4;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) newDroneY += 4;

    newDroneX = Math.max(15, Math.min(585, newDroneX));
    newDroneY = Math.max(15, Math.min(335, newDroneY));

    setDrone({ x: newDroneX, y: newDroneY });

    setDuck(prev => {
      const dx = newDroneX - prev.x;
      const dy = newDroneY - prev.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const angle = Math.atan2(dy, dx);
        const newX = prev.x - Math.cos(angle) * 2;
        const newY = prev.y - Math.sin(angle) * 2;

        return {
          x: Math.max(20, Math.min(580, newX)),
          y: Math.max(20, Math.min(330, newY))
        };
      } else {
        const randomX = prev.x + (Math.random() - 0.5) * 3;
        const randomY = prev.y + (Math.random() - 0.5) * 3;

        return {
          x: Math.max(20, Math.min(580, randomX)),
          y: Math.max(20, Math.min(330, randomY))
        };
      }
    });

    const distance = Math.sqrt(
      Math.pow(newDroneX - duck.x, 2) + Math.pow(newDroneY - duck.y, 2)
    );

    if (distance < 25 && !captured) {
      setCaptured(true);
      setGameState('success');
      onComplete(true, 'Pato capturado com sucesso!', 'success');
    }
  };

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(30);
    setCaptured(false);
    setDrone({ x: 50, y: 175 });
    setDuck({ x: 500, y: 175 });
  };

  const resetGame = () => {
    setGameState('ready');
    setTimeLeft(30);
    setCaptured(false);
    setDrone({ x: 50, y: 175 });
    setDuck({ x: 500, y: 175 });
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    ctx.fillStyle = '#333';
    ctx.fillRect(drone.x - 15, drone.y - 10, 30, 20);
    ctx.fillStyle = '#666';
    ctx.fillRect(drone.x - 20, drone.y - 5, 10, 10);
    ctx.fillRect(drone.x + 10, drone.y - 5, 10, 10);

    if (gameState === 'playing') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(drone.x, drone.y, 25, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = captured ? '#32CD32' : '#FFD700';
    ctx.beginPath();
    ctx.ellipse(duck.x, duck.y, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.ellipse(duck.x - 25, duck.y - 3, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(`Tempo: ${timeLeft}s`, 10, 25);

    const distance = Math.sqrt(Math.pow(drone.x - duck.x, 2) + Math.pow(drone.y - duck.y, 2));
    ctx.fillText(`Distância: ${Math.round(distance)}px`, 10, 45);
  };

  return (
    <div className="chase-duck-game">
      <div className="game-header">
        <h4>🏃 Chase Duck</h4>
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
        className="game-canvas"
        tabIndex={0}
      />

      <div className="game-info">
        <p><strong>Objetivo:</strong> Persiga e capture o pato em 30 segundos</p>
        <p><strong>Controle:</strong> Setas ou WASD para mover o drone</p>
        <p><strong>Estratégia:</strong> {strategy.strategy}</p>
      </div>
    </div>
  );
};

export default ChaseDuckGame;