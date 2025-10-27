import React, { useState, useEffect } from 'react';
import { Search, Target, AlertTriangle, DollarSign, Shield, Beaker, TrendingUp, Eye, MapPin, Activity, Zap } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { api } from '../services/api';
import getDuckImage from '../utils/duckImageSelector';
import { getHibernationStatusName, getClassificationName } from '../enums/index.js';
import './CaptureAnalysisPage.css';

const CaptureAnalysisPage = () => {
  const [ducks, setDucks] = useState([]);
  const [selectedDuck, setSelectedDuck] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('overallScore');

  useEffect(() => {
    fetchDucks();
  }, []);

  const fetchDucks = async () => {
    try {
      const response = await api.get('/primordialducks/available-for-capture');
      const ducksData = response.data?.data || response.data || [];

      if (!ducksData || ducksData.length === 0) {
        setDucks([]);
        setLoading(false);
        return;
      }

      const ducksWithAnalysis = await Promise.all(
        ducksData.map(async (duck) => {
          try {
            const analysisResponse = await api.get(`/primordialducks/${duck.id}/capture-analysis`);
            const analysisData = analysisResponse.data?.data || analysisResponse.data;
            return { ...duck, analysis: analysisData };
          } catch (error) {
            return duck;
          }
        })
      );
      setDucks(ducksWithAnalysis);
    } catch (error) {
      console.error('Erro ao carregar patos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDuckSelect = (duck) => {
    setSelectedDuck(duck);
    setAnalysis(duck.analysis);
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'MAXIMUM PRIORITY': return '#22c55e';
      case 'HIGH PRIORITY': return '#3b82f6';
      case 'MODERATE PRIORITY': return '#f59e0b';
      case 'LOW PRIORITY': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (risk) => {
    if (risk >= 80) return '#dc2626';
    if (risk >= 60) return '#ea580c';
    if (risk >= 40) return '#f59e0b';
    return '#22c55e';
  };



  const filteredDucks = ducks
    .filter(duck =>
      duck.id.toString().includes(searchTerm) ||
      duck.location?.cityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      duck.location?.country?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!a.analysis || !b.analysis) return 0;
      switch (sortBy) {
        case 'overallScore':
          return b.analysis.overallScore - a.analysis.overallScore;
        case 'riskLevel':
          return b.analysis.riskLevel - a.analysis.riskLevel;
        case 'scientificValue':
          return b.analysis.scientificValue - a.analysis.scientificValue;
        case 'operationalCost':
          return a.analysis.operationalCost - b.analysis.operationalCost;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <Layout>
        <div className="capture-analysis-loading">
          <Target className="loading-icon" />
          <p>Analisando operações de captura...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="capture-analysis-page">
        <div className="page-header">
          <div className="header-content">
            <Target size={32} className="header-icon" />
            <div>
              <h1>Operação Visão de Captura</h1>
              <p>Sistema de análise estratégica para captura de Patos Primordiais</p>
            </div>
          </div>
        </div>

        <div className="analysis-container">
          <div className="ducks-panel">
            <div className="panel-header">
              <h3>Alvos Identificados</h3>
              <div className="controls">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Buscar alvo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="overallScore">Prioridade</option>
                  <option value="riskLevel">Risco</option>
                  <option value="scientificValue">Valor Científico</option>
                  <option value="operationalCost">Custo</option>
                </select>
              </div>
            </div>

            <div className="ducks-list">
              {filteredDucks.map((duck) => (
                <div
                  key={duck.id}
                  className={`duck-card ${selectedDuck?.id === duck.id ? 'selected' : ''}`}
                  onClick={() => handleDuckSelect(duck)}
                >
                  <div className="duck-image">
                    <img src={getDuckImage(getHibernationStatusName(duck.hibernationStatus), duck.mutationCount)} alt={`Espécime ${duck.id}`} />
                  </div>
                  <div className="duck-info">
                    <h4>Espécime #{duck.id.toString().padStart(3, '0')}</h4>
                    <p className="species">{duck.location?.cityName || 'Local Desconhecido'}</p>
                    {duck.analysis && (
                      <div className="quick-stats">
                        <div
                          className="priority-badge"
                          style={{ backgroundColor: getClassificationColor(duck.analysis.classification) }}
                        >
                          {duck.analysis.classification}
                        </div>
                        <div className="stats-row">
                          <span className="stat">
                            <TrendingUp size={12} />
                            {duck.analysis.overallScore}
                          </span>
                          <span
                            className="stat risk"
                            style={{ color: getRiskColor(duck.analysis.riskLevel) }}
                          >
                            <Shield size={12} />
                            {duck.analysis.riskLevel}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analysis-panel">
            {selectedDuck && analysis ? (
              <div className="detailed-analysis">
                <div className="target-header">
                  <div className="target-image">
                    <img src={getDuckImage(getHibernationStatusName(selectedDuck.hibernationStatus), selectedDuck.mutationCount)} alt={`Espécime ${selectedDuck.id}`} />
                  </div>
                  <div className="target-info">
                    <h2>Espécime #{selectedDuck.id.toString().padStart(3, '0')}</h2>
                    <p className="target-species">{selectedDuck.location?.cityName}, {selectedDuck.location?.country}</p>
                    <div
                      className="classification-badge"
                      style={{ backgroundColor: getClassificationColor(analysis.classification) }}
                    >
                      {analysis.classification}
                    </div>
                  </div>
                </div>

                <div className="metrics-grid">
                  <div className="metric-card cost">
                    <div className="metric-header">
                      <DollarSign size={24} />
                      <h4>Custo Operacional</h4>
                    </div>
                    <div className="metric-value">{analysis.operationalCost}%</div>
                    <div className="metric-bar">
                      <div
                        className="metric-fill"
                        style={{ width: `${analysis.operationalCost}%` }}
                      />
                    </div>
                    <p className="metric-desc">Recursos necessários para transporte e contenção</p>
                  </div>

                  <div className="metric-card military">
                    <div className="metric-header">
                      <Target size={24} />
                      <h4>Poder Militar</h4>
                    </div>
                    <div className="metric-value">{analysis.militaryPower}%</div>
                    <div className="metric-bar">
                      <div
                        className="metric-fill"
                        style={{ width: `${analysis.militaryPower}%` }}
                      />
                    </div>
                    <p className="metric-desc">Força de combate requerida</p>
                  </div>

                  <div className="metric-card risk">
                    <div className="metric-header">
                      <Shield size={24} />
                      <h4>Nível de Risco</h4>
                    </div>
                    <div className="metric-value" style={{ color: getRiskColor(analysis.riskLevel) }}>
                      {analysis.riskLevel}%
                    </div>
                    <div className="metric-bar">
                      <div
                        className="metric-fill risk-fill"
                        style={{
                          width: `${analysis.riskLevel}%`,
                          backgroundColor: getRiskColor(analysis.riskLevel)
                        }}
                      />
                    </div>
                    <p className="metric-desc">Probabilidade de falha da missão</p>
                  </div>

                  <div className="metric-card scientific">
                    <div className="metric-header">
                      <Beaker size={24} />
                      <h4>Valor Científico</h4>
                    </div>
                    <div className="metric-value">{analysis.scientificValue}%</div>
                    <div className="metric-bar">
                      <div
                        className="metric-fill"
                        style={{ width: `${analysis.scientificValue}%` }}
                      />
                    </div>
                    <p className="metric-desc">Potencial de descobertas científicas</p>
                  </div>
                </div>

                <div className="target-details">
                  <div className="detail-section">
                    <h4><MapPin size={16} /> Localização</h4>
                    <p>Lat: {selectedDuck.location?.latitude}, Lng: {selectedDuck.location?.longitude}</p>
                    <p>Precisão: {selectedDuck.gpsPrecisionValue}{selectedDuck.gpsPrecisionUnit === 'Meters' ? 'm' : selectedDuck.gpsPrecisionUnit === 'Yards' ? 'yd' : 'cm'}</p>
                    {analysis.distanceFromBase != null && (
                      <p>Distância da Base DSIN: {Number(analysis.distanceFromBase).toFixed(1)} km</p>
                    )}
                  </div>

                  <div className="detail-section">
                    <h4><Activity size={16} /> Status Biológico</h4>
                    <p>Hibernação: {getHibernationStatusName(selectedDuck.hibernationStatus)}</p>
                    {selectedDuck.heartRate && (
                      <p>Batimentos: {selectedDuck.heartRate} bpm</p>
                    )}
                    <p>Mutações: {selectedDuck.mutationCount}</p>
                  </div>

                  {selectedDuck.superPower && (
                    <div className="detail-section">
                      <h4><Zap size={16} /> Super Poder</h4>
                      <p>{selectedDuck.superPower.name}</p>
                      <p>Classificação: {getClassificationName(selectedDuck.superPower.classification)}</p>
                    </div>
                  )}
                </div>

                {(analysis.riskFactors?.length > 0 || analysis.valueFactors?.length > 0) && (
                  <div className="factors-analysis">
                    {analysis.riskFactors?.length > 0 && (
                      <div className="risk-factors">
                        <h4><AlertTriangle size={16} /> Fatores de Risco</h4>
                        <ul>
                          {analysis.riskFactors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysis.valueFactors?.length > 0 && (
                      <div className="value-factors">
                        <h4><Beaker size={16} /> Fatores de Valor</h4>
                        <ul>
                          {analysis.valueFactors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="overall-assessment">
                  <div className="assessment-header">
                    <TrendingUp size={32} />
                    <div>
                      <h3>Avaliação Geral</h3>
                      <div className="score-value">{analysis.overallScore}</div>
                    </div>
                  </div>
                  <div className="recommendation">
                    {analysis.overallScore >= 80 && (
                      <p className="rec-high">🎯 CAPTURA IMEDIATA RECOMENDADA - Alto valor científico com risco aceitável</p>
                    )}
                    {analysis.overallScore >= 60 && analysis.overallScore < 80 && (
                      <p className="rec-medium">⚠️ CAPTURA PLANEJADA - Preparar recursos adequados antes da operação</p>
                    )}
                    {analysis.overallScore >= 40 && analysis.overallScore < 60 && (
                      <p className="rec-low">🔍 MONITORAMENTO - Aguardar condições mais favoráveis</p>
                    )}
                    {analysis.overallScore < 40 && (
                      <p className="rec-avoid">❌ OPERAÇÃO NÃO RECOMENDADA - Riscos superam benefícios</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <Target size={64} className="no-selection-icon" />
                <h3>Selecione um Alvo</h3>
                <p>Escolha um Pato Primordial da lista para visualizar a análise completa de captura</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CaptureAnalysisPage;