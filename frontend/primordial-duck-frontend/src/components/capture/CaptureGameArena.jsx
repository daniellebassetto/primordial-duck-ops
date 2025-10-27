import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Target, Zap } from 'lucide-react';
import CaptureResultModal from './CaptureResultModal.jsx';
import './CaptureGameArena.css';

const CaptureGameArena = ({ selectedDrone, selectedDuck, strategy, onCaptureComplete }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [gameTime, setGameTime] = useState(0);
  const [dronePosition, setDronePosition] = useState({ x: 50, y: 50 });
  const [duckPosition, setDuckPosition] = useState({ x: 400, y: 300 });
  const [projectiles, setProjectiles] = useState([]);
  const [effects, setEffects] = useState([]);
  const [droneHealth, setDroneHealth] = useState(100);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    if (gameState === 'playing') {
      startGameLoop();
    } else {
      stopGameLoop();
    }
    return () => stopGameLoop();
  }, [gameState]);

  const startGameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let lastTime = 0;

    const gameLoop = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      updateGame(deltaTime);
      renderGame(ctx);

      if (gameState === 'playing') {
        animationRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animationRef.current = requestAnimationFrame(gameLoop);
  };

  const stopGameLoop = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const updateGame = (deltaTime) => {
    setGameTime(prev => prev + deltaTime);

    setDuckPosition(prev => {
      const speed = selectedDuck?.superPowers?.some(p => p.name.includes('Velocidade')) ? 2 : 1;
      const newX = prev.x + Math.sin(gameTime * 0.001) * speed;
      const newY = prev.y + Math.cos(gameTime * 0.0015) * speed * 0.5;

      return {
        x: Math.max(50, Math.min(750, newX)),
        y: Math.max(50, Math.min(350, newY))
      };
    });

    setProjectiles(prev => prev.map(p => ({
      ...p,
      x: p.x + p.vx * deltaTime * 0.1,
      y: p.y + p.vy * deltaTime * 0.1,
      life: p.life - deltaTime
    })).filter(p => p.life > 0));

    const distance = Math.sqrt(
      Math.pow(dronePosition.x - duckPosition.x, 2) +
      Math.pow(dronePosition.y - duckPosition.y, 2)
    );

    if (distance < 80) {
      setCaptureProgress(prev => Math.min(100, prev + deltaTime * 0.05));
    }

    if (captureProgress >= 100) {
      setGameState('completed');
      setGameResult({ success: true, message: 'Pato capturado com sucesso!' });
      setShowResultModal(true);
    } else if (droneHealth <= 0) {
      setGameState('completed');
      setGameResult({ success: false, message: 'Drone foi destruído pelo pato!' });
      setShowResultModal(true);
    }
  };

  const renderGame = (ctx) => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 5; i++) {
      const x = (i * 200 + gameTime * 0.01) % canvas.width;
      ctx.beginPath();
      ctx.arc(x, 50 + i * 20, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(duckPosition.x, duckPosition.y);

    if (selectedDuck?.superPowers?.length > 0) {
      ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + Math.sin(gameTime * 0.005) * 0.2})`;
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(30, -5);
    ctx.lineTo(30, 5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-8, -8, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.save();
    ctx.translate(dronePosition.x, dronePosition.y);

    ctx.fillStyle = '#333';
    ctx.fillRect(-15, -10, 30, 20);

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    const rotorSpeed = gameTime * 0.02;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI / 2) + rotorSpeed;
      const x = Math.cos(angle) * 20;
      const y = Math.sin(angle) * 20;
      ctx.beginPath();
      ctx.moveTo(x - 8, y);
      ctx.lineTo(x + 8, y);
      ctx.stroke();
    }

    ctx.restore();

    projectiles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (captureProgress > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(duckPosition.x - 40, duckPosition.y - 50, 80, 10);
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(duckPosition.x - 40, duckPosition.y - 50, (80 * captureProgress) / 100, 10);
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 80);
    ctx.fillStyle = '#FFF';
    ctx.font = '14px Arial';
    ctx.fillText(`Saúde do Drone: ${Math.round(droneHealth)}%`, 20, 30);
    ctx.fillText(`Progresso: ${Math.round(captureProgress)}%`, 20, 50);
    ctx.fillText(`Tempo: ${Math.round(gameTime / 1000)}s`, 20, 70);
  };

  const handleCanvasClick = (e) => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDronePosition({ x, y });

    executeStrategy(x, y);
  };

  const executeStrategy = (targetX, targetY) => {
    if (!strategy) return;

    const newProjectile = {
      x: dronePosition.x,
      y: dronePosition.y,
      vx: (targetX - dronePosition.x) * 0.1,
      vy: (targetY - dronePosition.y) * 0.1,
      size: 5,
      color: '#FF4444',
      life: 2000
    };

    setProjectiles(prev => [...prev, newProjectile]);

    const damage = Math.random() * 10;
    setDroneHealth(prev => Math.max(0, prev - damage));
  };

  const startGame = () => {
    setGameState('playing');
    setGameTime(0);
    setDroneHealth(100);
    setCaptureProgress(0);
    setProjectiles([]);
    setGameResult(null);
  };

  const pauseGame = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setGameState('ready');
    setGameTime(0);
    setDronePosition({ x: 50, y: 50 });
    setDuckPosition({ x: 400, y: 300 });
    setProjectiles([]);
    setDroneHealth(100);
    setCaptureProgress(0);
    setGameResult(null);
    setShowResultModal(false);
  };

  const handleModalClose = () => {
    setShowResultModal(false);
  };

  const handleNewMission = () => {
    setShowResultModal(false);
    if (gameResult?.success) {
      onCaptureComplete(true, gameResult.message);
    } else {
      resetGame();
    }
  };

  if (!selectedDrone || !selectedDuck || !strategy) {
    return (
      <div className="capture-arena-placeholder">
        <Target size={48} />
        <p>Selecione um drone, pato e gere uma estratégia para iniciar a missão</p>
      </div>
    );
  }

  return (
    <div className="capture-game-arena">
      <div className="arena-header">
        <h3>🎮 Arena de Captura</h3>
        <div className="game-controls">
          {gameState === 'ready' && (
            <button className="control-btn start" onClick={startGame}>
              <Play size={16} />
              Iniciar Missão
            </button>
          )}
          {(gameState === 'playing' || gameState === 'paused') && (
            <button className="control-btn pause" onClick={pauseGame}>
              {gameState === 'playing' ? <Pause size={16} /> : <Play size={16} />}
              {gameState === 'playing' ? 'Pausar' : 'Continuar'}
            </button>
          )}
          <button className="control-btn reset" onClick={resetGame}>
            <RotateCcw size={16} />
            Reiniciar
          </button>
        </div>
      </div>

      <div className="arena-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onClick={handleCanvasClick}
          className="game-canvas"
        />

        {gameState === 'ready' && (
          <div className="game-instructions">
            <h4>Instruções da Missão</h4>
            <p><strong>Estratégia:</strong> {strategy.strategy}</p>
            <p><strong>Defesa do Pato:</strong> {strategy.defenseGenerated}</p>
            <p><strong>Objetivo:</strong> Clique para mover o drone e aproxime-se do pato para capturá-lo!</p>
            <p><strong>Chance de Sucesso:</strong> {strategy.successChance}%</p>
          </div>
        )}


      </div>

      <div className="strategy-info">
        <div className="info-card">
          <h4><Plane size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> {selectedDrone.model}</h4>
          <p>Bateria: {selectedDrone.batteryLevel}%</p>
          <p>Combustível: {selectedDrone.fuelLevel}%</p>
          <p>Integridade: {selectedDrone.integrity}%</p>
        </div>

        <div className="info-card">
          <h4><Target size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> {selectedDuck.name}</h4>
          <p>Status: {selectedDuck.hibernationStatus}</p>
          <p>Poderes: {selectedDuck.superPowers?.length || 0}</p>
        </div>
      </div>

      <CaptureResultModal
        isOpen={showResultModal}
        result={gameResult}
        duck={selectedDuck}
        drone={selectedDrone}
        strategy={strategy}
        onClose={handleModalClose}
        onNewMission={handleNewMission}
      />
    </div>
  );
};

export default CaptureGameArena;