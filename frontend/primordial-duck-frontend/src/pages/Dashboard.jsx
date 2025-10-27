import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Drone, Zap, Bird, Plus, TrendingUp, Activity, Shield, Map, BarChart3, Rocket } from 'lucide-react';
import { droneService, superPowerService, primordialDuckService } from '../services/api';
import getDuckImage from '../utils/duckImageSelector';
import './Dashboard.css';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Dashboard = () => {
  const [stats, setStats] = useState({
    drones: 0,
    superPowers: 0,
    primordialDucks: 0,
    activeDucks: 0,
    capturedDucks: 0,
    mutatedDucks: 0,
    dangerousDucks: 0,
    countries: 0
  });
  const [ducks, setDucks] = useState([]);
  const [chartData, setChartData] = useState({
    hibernationStatus: {},
    mutationCount: {},
    countries: {},
    captureRate: {},
    powerDistribution: {},
    weeklyDiscoveries: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dronesData, superPowersData, ducksData] = await Promise.all([
        droneService.getAll(),
        superPowerService.getAll(),
        primordialDuckService.getAll()
      ]);

      setStats({
        drones: dronesData.length,
        superPowers: superPowersData.length,
        primordialDucks: ducksData.length,
        activeDucks: ducksData.filter(d => d.hibernationStatus === 'Awake' || d.hibernationStatus === 1).length,
        capturedDucks: ducksData.filter(d => d.isCaptured).length,
        mutatedDucks: ducksData.filter(d => d.mutationCount > 0).length,
        dangerousDucks: ducksData.filter(d => (d.hibernationStatus === 'Awake' || d.hibernationStatus === 1) && d.superPower).length,
        countries: new Set(ducksData.map(d => d.location?.country).filter(Boolean)).size
      });

      setDucks(ducksData);
      processChartData(ducksData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (ducksData) => {
    const hibernationStatus = {};
    const mutationCount = {};
    const countries = {};
    const captureRate = { 'Capturados': 0, 'Livres': 0 };
    const powerDistribution = { 'Com Poder': 0, 'Sem Poder': 0 };
    const weeklyDiscoveries = {};

    ducksData.forEach(duck => {
      const status = getStatusName(duck.hibernationStatus);
      hibernationStatus[status] = (hibernationStatus[status] || 0) + 1;

      const mutations = duck.mutationCount || 0;
      const mutationKey = mutations === 0 ? 'Nenhuma' : mutations === 1 ? '1 Mutação' : `${mutations} Mutações`;
      mutationCount[mutationKey] = (mutationCount[mutationKey] || 0) + 1;

      const country = duck.location?.country || 'Desconhecido';
      countries[country] = (countries[country] || 0) + 1;

      if (duck.isCaptured) {
        captureRate['Capturados']++;
      } else {
        captureRate['Livres']++;
      }

      if (duck.superPower) {
        powerDistribution['Com Poder']++;
      } else {
        powerDistribution['Sem Poder']++;
      }

      const discoveryDate = new Date(duck.discoveredAt);
      const today = new Date();
      const daysDiff = Math.floor((today - discoveryDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 7) {
        const dayName = discoveryDate.toLocaleDateString('pt-BR', { weekday: 'short' });
        weeklyDiscoveries[dayName] = (weeklyDiscoveries[dayName] || 0) + 1;
      }
    });

    setChartData({
      hibernationStatus,
      mutationCount,
      countries: Object.fromEntries(Object.entries(countries).slice(0, 5)),
      captureRate,
      powerDistribution,
      weeklyDiscoveries
    });
  };

  const getStatusName = (status) => {
    const statusMap = {
      0: 'Desperto', 1: 'Desperto',
      2: 'Em Transe', 3: 'Hibernação Profunda',
      'Awake': 'Desperto',
      'InTrance': 'Em Transe',
      'DeepHibernation': 'Hibernação Profunda'
    };
    return statusMap[status] || 'Desperto';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'Desperto': '#ff4444',
      'Em Transe': '#ffaa00',
      'Hibernação Profunda': '#44ff44'
    };
    return colorMap[status] || '#666';
  };

  const createDuckIcon = (duck) => {
    const status = getStatusName(duck.hibernationStatus);
    const color = duck.isCaptured ? '#27ae60' : getStatusColor(status);
    const symbol = duck.isCaptured ? '✓' : '';

    return L.divIcon({
      html: `<div style="background: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${symbol}</div>`,
      className: 'duck-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const renderChart = (data, title, colorKey = null) => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="chart-container">
          <h3>{title}</h3>
          <div className="chart-empty">
            <p>Nenhum dado disponível</p>
          </div>
        </div>
      );
    }

    const values = Object.values(data);
    const maxValue = Math.max(...values);

    if (maxValue === 0) {
      return (
        <div className="chart-container">
          <h3>{title}</h3>
          <div className="chart-empty">
            <p>Nenhum dado disponível</p>
          </div>
        </div>
      );
    }

    const getBarColor = (key) => {
      if (colorKey === 'status') return getStatusColor(key);
      if (colorKey === 'capture') return key === 'Capturados' ? '#27ae60' : '#ff4444';
      if (colorKey === 'power') return key === 'Com Poder' ? '#ffaa00' : '#6b7c5c';
      return '#4a5a3a';
    };

    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="chart-bars">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="chart-bar-item">
              <div className="chart-bar-label">{key}</div>
              <div className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{
                    width: `${(value / maxValue) * 100}%`,
                    backgroundColor: getBarColor(key)
                  }}
                ></div>
                <span className="chart-bar-value">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const statCards = [
    {
      title: 'Drones Ativos',
      value: stats.drones,
      icon: Drone,
      color: '#00d4ff',
      link: '/drones'
    },
    {
      title: 'Super Poderes',
      value: stats.superPowers,
      icon: Zap,
      color: '#ffaa00',
      link: '/superpowers'
    },
    {
      title: 'Patos Catalogados',
      value: stats.primordialDucks,
      icon: Bird,
      color: '#44ff44',
      link: '/primordialducks'
    },
    {
      title: 'Patos Despertos',
      value: stats.activeDucks,
      icon: Activity,
      color: '#ff4444',
      link: '/primordialducks'
    },
    {
      title: 'Patos Capturados',
      value: stats.capturedDucks,
      icon: Shield,
      color: '#27ae60',
      link: '/primordialducks'
    },
    {
      title: 'Países com Registros',
      value: stats.countries,
      icon: Map,
      color: '#d4610a',
      link: '/primordialducks'
    },
    {
      title: 'Com Mutações',
      value: stats.mutatedDucks,
      icon: TrendingUp,
      color: '#8b3a3a',
      link: '/primordialducks'
    },
    {
      title: 'Ameaça Crítica',
      value: stats.dangerousDucks,
      icon: Activity,
      color: '#ff0000',
      link: '/primordialducks'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dados operacionais...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Centro de Comando</h1>
        <p>Monitoramento global da Operação Patos Primordiais</p>
      </div>


      <div className="quick-actions-section">
        <h2><Rocket size={24} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Ações Rápidas</h2>
        <div className="actions-grid">
          <Link to="/primordialducks/new" className="action-card">
            <Bird size={32} color="#44ff44" />
            <div>
              <h3>Catalogar Pato</h3>
              <p>Registrar nova descoberta</p>
            </div>
            <Plus size={16} />
          </Link>
          <Link to="/drones/new" className="action-card">
            <Drone size={32} color="#00d4ff" />
            <div>
              <h3>Novo Drone</h3>
              <p>Adicionar à frota</p>
            </div>
            <Plus size={16} />
          </Link>
          <Link to="/superpowers/new" className="action-card">
            <Zap size={32} color="#ffaa00" />
            <div>
              <h3>Super Poder</h3>
              <p>Documentar habilidade</p>
            </div>
            <Plus size={16} />
          </Link>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="map-section">
          <div className="section-header">
            <Map size={20} />
            <h2>Mapa Global de Patos Primordiais</h2>
          </div>
          <div className="map-container">
            {ducks.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                <p>Nenhum pato catalogado ainda</p>
              </div>
            ) : (
              <MapContainer
                center={[0, 0]}
                zoom={2}
                minZoom={2}
                maxZoom={18}
                maxBounds={[[-90, -180], [90, 180]]}
                maxBoundsViscosity={1.0}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  noWrap={true}
                  bounds={[[-90, -180], [90, 180]]}
                />
                {ducks.map((duck) => {
                  if (!duck.location?.latitude || !duck.location?.longitude) {
                    return null;
                  }

                  return (
                    <Marker
                      key={duck.id}
                      position={[duck.location.latitude, duck.location.longitude]}
                      icon={createDuckIcon(duck)}
                    >
                      <Popup>
                        <div className="duck-popup">
                          <img
                            src={getDuckImage(getStatusName(duck.hibernationStatus), duck.mutationCount || 0)}
                            alt="Pato"
                            style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                          <div>
                            <h4>{duck.name || `Espécime #${duck.id.toString().padStart(3, '0')}`}</h4>
                            <p><strong>Status:</strong> {duck.isCaptured ? 'CAPTURADO' : getStatusName(duck.hibernationStatus)}</p>
                            <p><strong>Local:</strong> {duck.location.cityName}, {duck.location.country}</p>
                            <p><strong>Mutações:</strong> {duck.mutationCount}</p>
                            {duck.superPower && <p><strong>Poder:</strong> {duck.superPower.name}</p>}
                            {duck.isCaptured && duck.captureDate && (
                              <p><strong>Capturado:</strong> {new Date(duck.captureDate).toLocaleDateString('pt-BR')}</p>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
          </div>
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ff4444' }}></div>
              <span>Desperto</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ffaa00' }}></div>
              <span>Em Transe</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#44ff44' }}></div>
              <span>Hibernação Profunda</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#27ae60' }}></div>
              <span>Capturado ✓</span>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="section-header">
            <BarChart3 size={20} />
            <h2>Análise Estatística</h2>
          </div>
          <div className="charts-grid">
            {renderChart(chartData.hibernationStatus, 'Status de Hibernação', 'status')}
            {renderChart(chartData.captureRate, 'Taxa de Captura', 'capture')}
            {renderChart(chartData.powerDistribution, 'Distribuição de Poderes', 'power')}
          </div>
        </div>

        <div className="charts-section">
          <div className="section-header">
            <TrendingUp size={20} />
            <h2>Tendências e Distribuições</h2>
          </div>
          <div className="charts-grid">
            {renderChart(chartData.mutationCount, 'Distribuição de Mutações')}
            {renderChart(chartData.countries, 'Top 5 Países')}
            {Object.keys(chartData.weeklyDiscoveries).length > 0 && renderChart(chartData.weeklyDiscoveries, 'Descobertas (7 dias)')}
          </div>
        </div>
      </div>

      <div className="stats-grid">{statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Link key={index} to={stat.link} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <Icon size={24} />
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
            <TrendingUp className="stat-trend" />
          </Link>
        );
      })}
      </div>
    </div>
  );
};

export default Dashboard;