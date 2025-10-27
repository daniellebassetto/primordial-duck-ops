import React, { useState, useEffect } from 'react';
import { primordialDuckService } from '../services/api';
import { useApiError } from '../hooks/useApiError';
import ErrorMessage from './ErrorMessage';
import { MapPin, Activity, Zap, Calendar } from 'lucide-react';
import getDuckImage from '../utils/duckImageSelector';
import './PrimordialDuckList.css';

const PrimordialDuckList = () => {
  const [ducks, setDucks] = useState([]);
  const { error, loading, handleApiCall, clearError } = useApiError();

  useEffect(() => {
    loadDucks();
  }, []);

  const loadDucks = async () => {
    try {
      const data = await handleApiCall(() => primordialDuckService.getAll());
      const sortedData = data.sort((a, b) => new Date(b.discoveredAt) - new Date(a.discoveredAt));
      setDucks(sortedData);
    } catch (err) {
      console.error('Erro ao carregar patos:', err);
    }
  };

  const getStatusClass = (status) => {
    const classMap = {
      'Awake': 'status-desperto',
      'InTrance': 'status-transe',
      'DeepHibernation': 'status-hibernacao',
      1: 'status-desperto',
      2: 'status-transe',
      3: 'status-hibernacao'
    };
    return classMap[status] || '';
  };

  const getStatusName = (status) => {
    const statusMap = {
      'Awake': 'Desperto',
      'InTrance': 'Em Transe',
      'DeepHibernation': 'Hibernacao Profunda',
      1: 'Desperto',
      2: 'Em Transe',
      3: 'Hibernacao Profunda'
    };
    return statusMap[status] || 'Desperto';
  };

  const getThreatLevel = (duck) => {
    if ((duck.hibernationStatus === 'Awake' || duck.hibernationStatus === 1) && duck.superPower) return 'CRÍTICO';
    if (duck.hibernationStatus === 'Awake' || duck.hibernationStatus === 1) return 'ALTO';
    if (duck.hibernationStatus === 'InTrance' || duck.hibernationStatus === 2) return 'MÉDIO';
    return 'BAIXO';
  };

  const getThreatClass = (level) => {
    switch (level) {
      case 'CRÍTICO': return 'threat-critical';
      case 'ALTO': return 'threat-high';
      case 'MÉDIO': return 'threat-medium';
      case 'BAIXO': return 'threat-low';
      default: return '';
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Carregando dados dos Patos Primordiais...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <ErrorMessage error={error} onClose={clearError} />
      <button onClick={loadDucks} className="btn btn-secondary">Tentar Novamente</button>
    </div>
  );

  return (
    <div className="duck-list-container">
      <div className="list-header">
        <h2>📋 Patos Primordiais Catalogados</h2>
        <div className="stats">
          <span className="stat-badge">Total: {ducks.length}</span>
          <span className="stat-badge desperto">
            Despertos: {ducks.filter(d => d.hibernationStatus === 'Awake' || d.hibernationStatus === 1).length}
          </span>
          <span className="stat-badge transe">
            Em Transe: {ducks.filter(d => d.hibernationStatus === 'InTrance' || d.hibernationStatus === 2).length}
          </span>
          <span className="stat-badge hibernacao">
            Hibernando: {ducks.filter(d => d.hibernationStatus === 'DeepHibernation' || d.hibernationStatus === 3).length}
          </span>
          <span className="stat-badge capturado">
            Capturados: {ducks.filter(d => d.isCaptured).length}
          </span>
        </div>
      </div>

      {ducks.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum pato primordial catalogado ainda.</p>
          <p>Inicie uma missão de reconhecimento para começar a catalogação.</p>
        </div>
      ) : (
        <div className="duck-grid">
          {ducks.map((duck) => {
            const threatLevel = getThreatLevel(duck);
            return (
              <div key={duck.id} className={`duck-card ${getStatusClass(duck.hibernationStatus)} ${duck.isCaptured ? 'captured' : ''}`}>
                <div className="card-header">
                  <div className="duck-image">
                    <img
                      src={getDuckImage(getStatusName(duck.hibernationStatus), duck.mutationCount)}
                      alt={`Pato ${getStatusName(duck.hibernationStatus)}`}
                      onError={(e) => e.target.src = '/assets/images/patos-primordiais/pato-desperto-1.png'}
                    />
                  </div>
                  <div className="card-title">
                    <h3>{duck.name || `ESPÉCIME #${duck.id.toString().padStart(3, '0')}`}</h3>
                    {duck.isCaptured ? (
                      <span className="capture-badge">
                        CAPTURADO
                      </span>
                    ) : (
                      <span className={`threat-badge ${getThreatClass(threatLevel)}`}>
                        {threatLevel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-content">
                  <div className="info-section">
                    <h4>📡 Dados de Reconhecimento</h4>
                    <p><strong>Drone:</strong> {duck.drone?.serialNumber || 'N/A'} ({duck.drone?.brand || 'N/A'})</p>
                    <p><strong>Dimensões:</strong> {Math.round(duck.heightInCentimeters || 0)}cm × {Math.round(duck.weightInGrams || 0)}g</p>
                  </div>

                  <div className="info-section">
                    <h4><MapPin size={16} /> Localização</h4>
                    <p><strong>Local:</strong> {duck.location?.cityName || 'N/A'}, {duck.location?.country || 'N/A'}</p>
                    <p><strong>Coordenadas:</strong> {duck.location?.latitude}°, {duck.location?.longitude}°</p>
                    <p><strong>Precisão GPS:</strong> {duck.gpsPrecisionInCentimeters}cm</p>
                    {duck.location?.referencePoint && (
                      <p><strong>Referência:</strong> {duck.location.referencePoint}</p>
                    )}
                  </div>

                  <div className="info-section">
                    <h4><Activity size={16} /> Status Biológico</h4>
                    <p><strong>Estado:</strong> <span className={getStatusClass(duck.hibernationStatus)}>{getStatusName(duck.hibernationStatus)}</span></p>
                    {duck.heartRate && (
                      <p><strong>Batimentos:</strong> {duck.heartRate} bpm</p>
                    )}
                    <p><strong>Mutações Detectadas:</strong> {duck.mutationCount}</p>
                  </div>

                  {duck.superPower && (
                    <div className="info-section super-power">
                      <h4><Zap size={16} /> Super Poder Ativo</h4>
                      <p><strong>Habilidade:</strong> {duck.superPower.name}</p>
                      <p><strong>Descrição:</strong> {duck.superPower.description}</p>
                      <div className="classifications">
                        {duck.superPower.classifications?.map((classification, index) => (
                          <span key={index} className="classification-tag">{classification}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="info-section">
                    <h4><Calendar size={16} /> Registro</h4>
                    <p><strong>Descoberto em:</strong> {new Date(duck.discoveredAt).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                    {duck.isCaptured && duck.captureDate && (
                      <p><strong>Capturado em:</strong> {new Date(duck.captureDate).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PrimordialDuckList;