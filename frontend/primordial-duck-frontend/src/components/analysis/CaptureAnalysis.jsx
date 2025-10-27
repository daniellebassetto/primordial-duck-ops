import React, { useState, useEffect } from 'react';
import { Target, Shield, DollarSign, Beaker, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/analysis.css';

const CaptureAnalysis = ({ duckId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (duckId) {
      fetchAnalysis();
    }
  }, [duckId]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/primordialducks/${duckId}/capture-analysis`);
      setAnalysis(response.data);
    } catch (err) {
      setError('Erro ao carregar análise de captura');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    if (score >= 20) return '#ef4444';
    return '#6b7280';
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'PRIORIDADE MÁXIMA': return '#22c55e';
      case 'PRIORIDADE ALTA': return '#3b82f6';
      case 'PRIORIDADE MODERADA': return '#f59e0b';
      case 'PRIORIDADE BAIXA': return '#ef4444';
      case 'CONSIDERÁVEL': return '#f59e0b';
      case 'NÃO RECOMENDADO': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) return <div className="analysis-loading">Analisando operação de captura...</div>;
  if (error) return <div className="analysis-error">{error}</div>;
  if (!analysis) return null;

  return (
    <div className="capture-analysis">
      <div className="analysis-header">
        <h3>Análise de Captura</h3>
        <div
          className="classification-badge"
          style={{ backgroundColor: getClassificationColor(analysis.classification) }}
        >
          {analysis.classification}
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <DollarSign size={24} />
          </div>
          <div className="metric-content">
            <h4>Custo Operacional</h4>
            <div className="metric-value">{analysis.operationalCost}</div>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{ width: `${analysis.operationalCost}%`, backgroundColor: '#ef4444' }}
              />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Target size={24} />
          </div>
          <div className="metric-content">
            <h4>Poder Militar</h4>
            <div className="metric-value">{analysis.militaryPower}</div>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{ width: `${analysis.militaryPower}%`, backgroundColor: '#f59e0b' }}
              />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Shield size={24} />
          </div>
          <div className="metric-content">
            <h4>Nível de Risco</h4>
            <div className="metric-value">{analysis.riskLevel}</div>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{ width: `${analysis.riskLevel}%`, backgroundColor: '#dc2626' }}
              />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Beaker size={24} />
          </div>
          <div className="metric-content">
            <h4>Valor Científico</h4>
            <div className="metric-value">{analysis.scientificValue}</div>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{ width: `${analysis.scientificValue}%`, backgroundColor: '#22c55e' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overall-score">
        <div className="score-icon">
          <TrendingUp size={32} />
        </div>
        <div className="score-content">
          <h4>Pontuação Geral</h4>
          <div
            className="score-value"
            style={{ color: getScoreColor(analysis.overallScore) }}
          >
            {analysis.overallScore}
          </div>
        </div>
      </div>

      <div className="distance-info">
        <h4>📍 Distância da Base DSIN</h4>
        <div className="distance-value">
          {analysis.distanceFromBase != null ? `${Number(analysis.distanceFromBase).toFixed(1)} km` : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default CaptureAnalysis;