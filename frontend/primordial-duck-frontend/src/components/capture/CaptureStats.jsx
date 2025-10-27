import React from 'react';
import { Trophy, Target, Zap, TrendingUp } from 'lucide-react';
import './CaptureStats.css';

const CaptureStats = ({ operations, ducks }) => {
  const successfulCaptures = operations.filter(op => op.success).length;
  const totalOperations = operations.length;
  const successRate = totalOperations > 0 ? (successfulCaptures / totalOperations * 100).toFixed(1) : 0;
  const capturedDucks = ducks.filter(duck => duck.isCaptured).length;
  const totalDucks = ducks.length;

  const getRecentOperations = () => {
    return operations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  return (
    <div className="capture-stats">
      <div className="stats-header">
        <h3>📊 Estatísticas de Captura</h3>
        <p>Resumo das operações de captura realizadas</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card success">
          <div className="stat-icon">
            <Trophy size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{successfulCaptures}</span>
            <span className="stat-label">Capturas Bem-Sucedidas</span>
          </div>
        </div>

        <div className="stat-card total">
          <div className="stat-icon">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{totalOperations}</span>
            <span className="stat-label">Total de Operações</span>
          </div>
        </div>

        <div className="stat-card rate">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{successRate}%</span>
            <span className="stat-label">Taxa de Sucesso</span>
          </div>
        </div>

        <div className="stat-card ducks">
          <div className="stat-icon">
            <Zap size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{capturedDucks}/{totalDucks}</span>
            <span className="stat-label">Patos Capturados</span>
          </div>
        </div>
      </div>

      {operations.length > 0 && (
        <div className="recent-operations">
          <h4>🕒 Operações Recentes</h4>
          <div className="operations-list">
            {getRecentOperations().map((operation, index) => (
              <div key={operation.id || index} className={`operation-item ${operation.success ? 'success' : 'failure'}`}>
                <div className="operation-status">
                  {operation.success ? '✅' : '❌'}
                </div>
                <div className="operation-details">
                  <span className="operation-target">
                    {operation.duckName || 'Pato Desconhecido'}
                  </span>
                  <span className="operation-date">
                    {new Date(operation.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="operation-result">
                  {operation.success ? 'Capturado' : 'Falhou'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {operations.length === 0 && (
        <div className="no-operations">
          <Target size={48} />
          <h4>Nenhuma Operação Realizada</h4>
          <p>Inicie sua primeira missão de captura para ver as estatísticas aqui</p>
        </div>
      )}
    </div>
  );
};

export default CaptureStats;