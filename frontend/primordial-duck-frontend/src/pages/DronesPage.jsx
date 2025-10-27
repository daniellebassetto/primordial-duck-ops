import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Battery, Fuel, Wrench } from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import FilterPanel from '../components/common/FilterPanel.jsx';
import Pagination from '../components/common/Pagination.jsx';
import { useToast } from '../components/common/ToastContainer.jsx';
import { droneService } from '../services/api';
import './CrudPages.css';

const DronesPage = () => {
  const { showSuccess, showError } = useToast();
  const [identificationData, setIdentificationData] = useState([]);
  const [combatData, setCombatData] = useState([]);

  const [identificationPagination, setIdentificationPagination] = useState({
    page: 1,
    pageSize: 9,
    totalCount: 0,
    totalPages: 0
  });

  const [combatPagination, setCombatPagination] = useState({
    page: 1,
    pageSize: 9,
    totalCount: 0,
    totalPages: 0
  });

  const [loading, setLoading] = useState(true);

  const [identificationFilters, setIdentificationFilters] = useState({
    serialNumber: '',
    brand: '',
    manufacturer: '',
    countryOfOrigin: '',
    sortBy: '',
    sortDescending: false
  });

  const [combatFilters, setCombatFilters] = useState({
    serialNumber: '',
    brand: '',
    manufacturer: '',
    countryOfOrigin: '',
    sortBy: '',
    sortDescending: false
  });

  const [activeTab, setActiveTab] = useState('identification');

  const filterConfig = {
    fields: [
      { key: 'serialNumber', label: 'Número de Série', type: 'text', placeholder: 'Buscar por série...' },
      { key: 'brand', label: 'Marca', type: 'text', placeholder: 'Buscar por marca...' },
      { key: 'manufacturer', label: 'Fabricante', type: 'text', placeholder: 'Buscar por fabricante...' },
      { key: 'countryOfOrigin', label: 'País de Origem', type: 'text', placeholder: 'Buscar por país...' }
    ],
    sortOptions: [
      { value: 'serialNumber', label: 'Número de Série' },
      { value: 'brand', label: 'Marca' },
      { value: 'manufacturer', label: 'Fabricante' }
    ]
  };



  useEffect(() => {
    loadIdentificationData();
    loadCombatData();
  }, []);

  useEffect(() => {
    if (activeTab === 'identification' && identificationData.length === 0) {
      loadIdentificationData();
    } else if (activeTab === 'combat' && combatData.length === 0) {
      loadCombatData();
    }
  }, [activeTab]);

  const loadIdentificationData = async (searchFilters = {}) => {
    try {
      setLoading(true);
      const filterParams = {
        ...identificationFilters,
        ...searchFilters,
        type: 1,
        page: searchFilters.page !== undefined ? searchFilters.page : identificationPagination.page,
        pageSize: searchFilters.pageSize !== undefined ? searchFilters.pageSize : identificationPagination.pageSize
      };

      const result = await droneService.search(filterParams);

      setIdentificationData(result.data);
      setIdentificationPagination({
        page: result.page,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages
      });
    } catch (error) {
      console.error('[IDENTIFICAÇÃO] Erro ao carregar:', error);
      setIdentificationData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCombatData = async (searchFilters = {}) => {
    try {
      setLoading(true);
      const filterParams = {
        ...combatFilters,
        ...searchFilters,
        type: 2,
        page: searchFilters.page !== undefined ? searchFilters.page : combatPagination.page,
        pageSize: searchFilters.pageSize !== undefined ? searchFilters.pageSize : combatPagination.pageSize
      };

      const result = await droneService.search(filterParams);

      setCombatData(result.data);
      setCombatPagination({
        page: result.page,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages
      });
    } catch (error) {
      console.error('[COMBATE] Erro ao carregar:', error);
      setCombatData([]);
    } finally {
      setLoading(false);
    }
  }; const loadData = () => {
    if (activeTab === 'identification') {
      loadIdentificationData();
    } else {
      loadCombatData();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este drone?')) {
      try {
        await droneService.delete(id);
        showSuccess('Drone excluído com sucesso!');
        loadData();
      } catch (error) {
        console.error('Erro ao excluir drone:', error);

        let errorMessage = 'Erro ao excluir drone.';

        if (error.response?.data) {
          const apiError = error.response.data;

          if (typeof apiError === 'string') {
            errorMessage = apiError;
          } else if (apiError.message) {
            errorMessage = apiError.message;
          } else if (apiError.title) {
            errorMessage = apiError.title;
          } else if (apiError.errors) {
            const errors = Object.values(apiError.errors).flat();
            errorMessage = errors.join('. ');
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        showError(errorMessage, 7000);
      }
    }
  };

  const handleFiltersChange = (newFilters) => {
    if (activeTab === 'identification') {
      setIdentificationFilters(newFilters);
    } else {
      setCombatFilters(newFilters);
    }
  };

  const handleSearch = (searchFilters) => {
    if (activeTab === 'identification') {
      setIdentificationFilters(searchFilters);
      loadIdentificationData({ ...searchFilters, page: 1 });
    } else {
      setCombatFilters(searchFilters);
      loadCombatData({ ...searchFilters, page: 1 });
    }
  };

  const handleReset = (resetFilters) => {
    if (activeTab === 'identification') {
      setIdentificationFilters(resetFilters);
      loadIdentificationData({ ...resetFilters, page: 1 });
    } else {
      setCombatFilters(resetFilters);
      loadCombatData({ ...resetFilters, page: 1 });
    }
  };

  const handlePageChange = (newPage) => {
    if (activeTab === 'identification') {
      loadIdentificationData({ page: newPage });
    } else {
      loadCombatData({ page: newPage });
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    if (activeTab === 'identification') {
      loadIdentificationData({ pageSize: newPageSize, page: 1 });
    } else {
      loadCombatData({ pageSize: newPageSize, page: 1 });
    }
  };

  const handleRechargeBattery = async (id) => {
    try {
      await droneService.rechargeBattery(id);
      loadData();
    } catch (error) {
      console.error('Erro ao recarregar bateria:', error);
    }
  };

  const handleRefuel = async (id) => {
    try {
      await droneService.refuel(id);
      loadData();
    } catch (error) {
      console.error('Erro ao reabastecer:', error);
    }
  };

  const handleMaintenance = async (id) => {
    try {
      await droneService.performMaintenance(id);
      loadData();
    } catch (error) {
      console.error('Erro ao realizar manutenção:', error);
    }
  };

  const getStatusColor = (level) => {
    if (level >= 70) return '#4CAF50';
    if (level >= 30) return '#FFA500';
    return '#ff4444';
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <div className="header-content">
            <h1>Gestão de Drones</h1>
            <p>Controle da frota operacional</p>
          </div>
          <Link to="/drones/new" className="btn btn-primary">
            <Plus size={16} />
            Novo Drone
          </Link>
        </div>

        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'identification' ? 'active' : ''}`}
            onClick={() => setActiveTab('identification')}
          >
            Drones de Identificação
          </button>
          <button
            className={`tab-btn ${activeTab === 'combat' ? 'active' : ''}`}
            onClick={() => setActiveTab('combat')}
          >
            Drones de Combate
          </button>
        </div>

        <FilterPanel
          key={activeTab}
          filters={filterConfig}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />

        <div className="data-grid">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando drones...</p>
            </div>
          ) : (
            <>
              {activeTab === 'identification' && (
                identificationData.length === 0 ? (
                  <div className="empty-state">
                    <p>Nenhum drone de identificação encontrado</p>
                    <Link to="/drones/new" className="btn btn-secondary">
                      Cadastrar Primeiro Drone
                    </Link>
                  </div>
                ) : (
                  <div className="grid-container">
                    {identificationData.map((drone) => (
                      <div key={drone.id} className="grid-card">
                        <div className="card-header">
                          <h3>{drone.serialNumber}</h3>
                          <div className="card-actions">
                            <Link to={`/drones/view/${drone.id}`} className="action-btn view" title="Visualizar">
                              <Eye size={16} />
                            </Link>
                            <Link to={`/drones/edit/${drone.id}`} className="action-btn edit" title="Editar">
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(drone.id)}
                              className="action-btn delete"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="card-content">
                          <div className="info-row">
                            <span className="label">Marca:</span>
                            <span className="value">{drone.brand}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Fabricante:</span>
                            <span className="value">{drone.manufacturer}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">País:</span>
                            <span className="value">{drone.countryOfOrigin}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Tipo:</span>
                            <span className="value type-badge identification">
                              Identificação
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'combat' && (
                combatData.length === 0 ? (
                  <div className="empty-state">
                    <p>Nenhum drone de combate encontrado</p>
                    <Link to="/drones/new" className="btn btn-secondary">
                      Cadastrar Primeiro Drone
                    </Link>
                  </div>
                ) : (
                  <div className="grid-container">
                    {combatData.map((drone) => (
                      <div key={drone.id} className="grid-card">
                        <div className="card-header">
                          <h3>{drone.serialNumber}</h3>
                          <div className="card-actions">
                            <Link to={`/drones/view/${drone.id}`} className="action-btn view" title="Visualizar">
                              <Eye size={16} />
                            </Link>
                            <Link to={`/drones/edit/${drone.id}`} className="action-btn edit" title="Editar">
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(drone.id)}
                              className="action-btn delete"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="card-content">
                          <div className="info-row">
                            <span className="label">Marca:</span>
                            <span className="value">{drone.brand}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Fabricante:</span>
                            <span className="value">{drone.manufacturer}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">País:</span>
                            <span className="value">{drone.countryOfOrigin}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Tipo:</span>
                            <span className="value type-badge combat">
                              Combate
                            </span>
                          </div>

                          <div className="drone-status">
                            <div className="status-item">
                              <Battery size={14} />
                              <span>Bateria: {drone.batteryLevel || 0}%</span>
                              <div className="status-bar">
                                <div
                                  className="status-fill"
                                  style={{
                                    width: `${drone.batteryLevel || 0}%`,
                                    backgroundColor: getStatusColor(drone.batteryLevel || 0)
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="status-item">
                              <Fuel size={14} />
                              <span>Combustível: {drone.fuelLevel || 0}%</span>
                              <div className="status-bar">
                                <div
                                  className="status-fill"
                                  style={{
                                    width: `${drone.fuelLevel || 0}%`,
                                    backgroundColor: getStatusColor(drone.fuelLevel || 0)
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="status-item">
                              <Wrench size={14} />
                              <span>Integridade: {drone.integrity || 0}%</span>
                              <div className="status-bar">
                                <div
                                  className="status-fill"
                                  style={{
                                    width: `${drone.integrity || 0}%`,
                                    backgroundColor: getStatusColor(drone.integrity || 0)
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="maintenance-actions">
                            <button
                              onClick={() => handleRechargeBattery(drone.id)}
                              className="maintenance-btn battery"
                              title={drone.batteryLevel >= 100 ? "Bateria Cheia" : "Recarregar Bateria"}
                              disabled={drone.batteryLevel >= 100}
                            >
                              <Battery size={14} />
                            </button>
                            <button
                              onClick={() => handleRefuel(drone.id)}
                              className="maintenance-btn fuel"
                              title={drone.fuelLevel >= 100 ? "Tanque Cheio" : "Reabastecer"}
                              disabled={drone.fuelLevel >= 100}
                            >
                              <Fuel size={14} />
                            </button>
                            <button
                              onClick={() => handleMaintenance(drone.id)}
                              className="maintenance-btn maintenance"
                              title={(drone.batteryLevel >= 100 && drone.fuelLevel >= 100 && drone.integrity >= 100) ? "Tudo OK" : "Manutenção Completa"}
                              disabled={drone.batteryLevel >= 100 && drone.fuelLevel >= 100 && drone.integrity >= 100}
                            >
                              <Wrench size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>        <Pagination
          currentPage={activeTab === 'identification' ? identificationPagination.page : combatPagination.page}
          totalPages={activeTab === 'identification' ? identificationPagination.totalPages : combatPagination.totalPages}
          totalCount={activeTab === 'identification' ? identificationPagination.totalCount : combatPagination.totalCount}
          pageSize={activeTab === 'identification' ? identificationPagination.pageSize : combatPagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </Layout>
  );
};

export default DronesPage;