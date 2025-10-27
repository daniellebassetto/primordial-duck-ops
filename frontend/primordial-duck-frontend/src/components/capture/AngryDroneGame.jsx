import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Target } from 'lucide-react';
import './AngryDroneGame.css';

const AngryDroneGame = ({ strategy, onComplete }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [shots, setShots] = useState(3);
  const [projectile, setProjectile] = useState(null);
  const [duck, setDuck] = useState({ x: 500, y: 250 });
  const [launcher, setLauncher] = useState({ x: 50, y: 300, angle: -30, power: 0 });
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    if (projectile && gameState === 'playing') {
      const interval = setInterval(() => {
        setProjectile(prev => {
          if (!prev) return null;

          const newX = prev.x + prev.vx;
          const newY = prev.y + prev.vy;
          const newVy = prev.vy + 0.5;

          const distance = Math.sqrt(Math.pow(newX - duck.x, 2) + Math.pow(newY - duck.y, 2));
          if (distance < 30) {
            setGameState('success');
            onComplete(true, 'Pato atingido e capturado!', 'success');
            return null;
          }

          if (newX > 600 || newY > 350 || newX < 0) {
            setShots(prev => {
              const newShots = prev - 1;
              if (newShots <= 0) {
                setGameState('failed');
                const escaped = Math.random() < 0.5;
                const result = escaped ? 'escaped' : 'failed';
                const message = escaped
                  ? 'Sem munição! O pato conseguiu fugir!'
                  : 'Sem munição! O pato contra-atacou!';
                onComplete(false, message, result);
              }
              return newShots;
            });
            return null;
          }

          return { x: newX, y: newY, vx: prev.vx, vy: newVy };
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [projectile, gameState, duck]);

  useEffect(() => {
    draw();
  }, [launcher, projectile, duck]);

  const handleMouseDown = (e) => {
    if (gameState === 'playing' && !projectile) {
      setCharging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (gameState === 'playing' && !projectile) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const angle = Math.atan2(mouseY - launcher.y, mouseX - launcher.x) * 180 / Math.PI;
      setLauncher(prev => ({ ...prev, angle }));
    }
  };

  const handleMouseUp = (e) => {
    if (charging && gameState === 'playing' && !projectile) {
      setCharging(false);

      const power = Math.min(launcher.power + 5, 20);
      const radians = launcher.angle * Math.PI / 180;

      setProjectile({
        x: launcher.x + 30,
        y: launcher.y,
        vx: Math.cos(radians) * power,
        vy: Math.sin(radians) * power
      });

      setLauncher(prev => ({ ...prev, power: 0 }));
    }
  };

  useEffect(() => {
    if (charging) {
      const interval = setInterval(() => {
        setLauncher(prev => ({ ...prev, power: Math.min(prev.power + 1, 20) }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [charging]);

  const startGame = () => {
    setGameState('playing');
    setShots(3);
    setProjectile(null);
    setLauncher({ x: 50, y: 300, angle: -30, power: 0 });
  };

  const resetGame = () => {
    setGameState('ready');
    setShots(3);
    setProjectile(null);
    setCharging(false);
    setLauncher({ x: 50, y: 300, angle: -30, power: 0 });
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 320, canvas.width, 30);

    ctx.fillStyle = '#8B4513';
    ctx.fillRect(launcher.x - 10, launcher.y - 10, 20, 20);

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(launcher.x, launcher.y);
    const endX = launcher.x + Math.cos(launcher.angle * Math.PI / 180) * 30;
    const endY = launcher.y + Math.sin(launcher.angle * Math.PI / 180) * 30;
    ctx.lineTo(endX, endY);
    ctx.stroke();

    if (charging) {
      ctx.fillStyle = `rgba(255, 0, 0, ${launcher.power / 20})`;
      ctx.fillRect(launcher.x - 15, launcher.y - 30, launcher.power * 2, 5);
    }

    if (projectile) {
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(duck.x, duck.y, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.moveTo(duck.x + 15, duck.y);
    ctx.lineTo(duck.x + 25, duck.y - 5);
    ctx.lineTo(duck.x + 25, duck.y + 5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(duck.x - 5, duck.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(5, 5, 160, 40);
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Tiros: ${shots}/3`, 20, 28);

    if (charging) {
      const powerPercent = Math.min(launcher.power / 20, 1);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(canvas.width - 110, 5, 100, 30);
      ctx.fillStyle = `rgba(255, ${255 * (1 - powerPercent)}, 0, 0.9)`;
      ctx.fillRect(canvas.width - 105, 10, 90 * powerPercent, 20);
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(powerPercent * 100)}%`, canvas.width - 60, 22);
      ctx.textAlign = 'left';
    }

    if (shots === 3 && !projectile && gameState === 'playing') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 - 30, 200, 60);
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('SEGURE E ARRASTE', canvas.width / 2, canvas.height / 2 - 5);
      ctx.fillStyle = '#FFF';
      ctx.font = '12px Arial';
      ctx.fillText('para mirar e atirar!', canvas.width / 2, canvas.height / 2 + 15);
      ctx.textAlign = 'left';
    }
  };

  return (
    <div className="angry-drone-game">
      <div className="game-header">
        <h4><Target size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Angry Drone</h4>
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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="game-canvas"
      />

      <div className="game-info">
        <p><strong>🎯 Objetivo:</strong> Atinja o pato com o projétil</p>
        <p><strong>🖱️ Controle:</strong> Arraste o mouse para mirar, segure para carregar poder</p>
        <p><strong>⚡ Estratégia:</strong> {strategy.strategy}</p>
        <div className="game-tips">
          <span className="tip">💡 Dica: Quanto mais tempo segurar, mais forte o tiro!</span>
        </div>
      </div>
    </div>
  );
};

export default AngryDroneGame;