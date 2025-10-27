import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Zap, Target } from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import FilterPanel from '../components/common/FilterPanel.jsx';
import Pagination from '../components/common/Pagination.jsx';
import { useToast } from '../components/common/ToastContainer.jsx';
import { primordialDuckService } from '../services/api';
import getDuckImage from '../utils/duckImageSelector';
import assets from '../assets';
import { HibernationStatus, getHibernationStatusName, getHibernationStatusClass, HeightUnit, WeightUnit } from '../enums/index.js';
import './CrudPages.css';

const PrimordialDucksPage = () => {
  const { showSuccess, showError } = useToast();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cityName: '',
    country: '',
    hibernationStatus: null,
    minMutationCount: null,
    maxMutationCount: null,
    superPowerId: null,
    isCaptured: null,
    sortBy: 'discoveredAt',
    sortDescending: true,
    page: 1,
    pageSize: 9
  });


  const filterConfig = {
    fields: [
      { key: 'cityName', label: 'Cidade', type: 'text', placeholder: 'Buscar por cidade...' },
      { key: 'country', label: 'País', type: 'text', placeholder: 'Buscar por país...' },
      {
        key: 'hibernationStatus',
        label: 'Status de Hibernação',
        type: 'select',
        placeholder: 'Todos os status',
        options: [
          { value: HibernationStatus.AWAKE, label: 'Desperto' },
          { value: HibernationStatus.IN_TRANCE, label: 'Em Transe' },
          { value: HibernationStatus.DEEP_HIBERNATION, label: 'Hibernação Profunda' }
        ]
      },
      { key: 'minMutationCount', label: 'Mutações Mín.', type: 'number', placeholder: '0', min: 0, max: 10 },
      { key: 'maxMutationCount', label: 'Mutações Máx.', type: 'number', placeholder: '10', min: 0, max: 10 },
      {
        key: 'isCaptured',
        label: 'Status de Captura',
        type: 'select',
        placeholder: 'Todos',
        options: [
          { value: false, label: 'Não Capturado' },
          { value: true, label: 'Capturado' }
        ]
      }
    ],
    sortOptions: [
      { value: 'hibernationStatus', label: 'Status de Hibernação' },
      { value: 'mutationCount', label: 'Número de Mutações' },
      { value: 'discoveredAt', label: 'Data de Descoberta' }
    ]
  };

  useEffect(() => {
    const initialFilters = {
      cityName: '',
      country: '',
      hibernationStatus: null,
      minMutationCount: null,
      maxMutationCount: null,
      superPowerId: null,
      isCaptured: null,
      sortBy: 'discoveredAt',
      sortDescending: true,
      page: 1,
      pageSize: 9
    };
    loadData(initialFilters);
  }, []);

  const loadData = async (searchFilters = filters) => {
    try {
      setLoading(true);
      const result = await primordialDuckService.search(searchFilters);

      setData(result.data);
      setPagination({
        page: result.page,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages
      });
    } catch (error) {
      console.error('Erro ao carregar patos:', error);
      showError('Erro ao carregar a lista de patos primordiais.');
    } finally {
      setLoading(false);
    }
  };





  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pato primordial?')) {
      try {
        await primordialDuckService.delete(id);
        showSuccess('Pato primordial excluído com sucesso!');
        loadData();
      } catch (error) {
        console.error('Erro ao excluir pato:', error);

        let errorMessage = 'Erro ao excluir pato primordial.';

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
    setFilters(newFilters);
  };

  const handleSearch = (searchFilters) => {
    const filtersWithPagination = { ...searchFilters, page: 1 };
    setFilters(filtersWithPagination);
    loadData(filtersWithPagination);
  };

  const handleReset = (resetFilters) => {
    setFilters(resetFilters);
    loadData(resetFilters);
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    loadData(newFilters);
  };

  const handlePageSizeChange = (newPageSize) => {
    const newFilters = { ...filters, pageSize: newPageSize, page: 1 };
    setFilters(newFilters);
    loadData(newFilters);
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <div className="header-content">
            <h1>Gestão de Patos Primordiais</h1>
            <p>Catálogo de espécimes descobertos</p>
          </div>
          <Link to="/primordialducks/new" className="btn btn-primary">
            <Plus size={16} />
            Catalogar Novo Pato
          </Link>
        </div>

        <FilterPanel
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
              <p>Carregando patos primordiais...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum pato primordial encontrado</p>
              <Link to="/primordialducks/new" className="btn btn-secondary">
                Catalogar Primeiro Pato
              </Link>
            </div>
          ) : (
            <div className="grid-container">
              {data.map((duck) => (
                <div key={duck.id} className="grid-card">
                  <div className="card-header">
                    <div className="duck-image">
                      <img
                        src={getDuckImage(getHibernationStatusName(duck.hibernationStatus), duck.mutationCount)}
                        alt={`Pato ${getHibernationStatusName(duck.hibernationStatus)}`}
                        onError={(e) => e.target.src = assets.images.patos.patoDesperto1}
                      />
                    </div>
                    <div className="card-title">
                      <h3>Espécime #{duck.id.toString().padStart(3, '0')}</h3>
                      <div className="card-actions">
                        <Link to={`/primordialducks/view/${duck.id}`} className="action-btn view" title="Visualizar">
                          <Eye size={16} />
                        </Link>
                        {!duck.isCaptured && (
                          <Link to={`/primordialducks/edit/${duck.id}`} className="action-btn edit" title="Editar">
                            <Edit size={16} />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(duck.id)}
                          className="action-btn delete"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Status:</span>
                      <span className={`value ${getHibernationStatusClass(duck.hibernationStatus)}`}>
                        {getHibernationStatusName(duck.hibernationStatus)}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Localização:</span>
                      <span className="value">
                        {duck.location?.cityName}, {duck.location?.country}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Dimensões:</span>
                      <span className="value">
                        {duck.heightValue ?
                          `${parseFloat(duck.heightValue).toFixed(duck.heightUnit === HeightUnit.FEET ? 2 : 0)}${duck.heightUnit === HeightUnit.FEET ? 'ft' : 'cm'}` :
                          `${Math.round(duck.heightInCentimeters)}cm`
                        } × {duck.weightValue ?
                          `${parseFloat(duck.weightValue).toFixed(duck.weightUnit === WeightUnit.POUNDS ? 2 : 0)}${duck.weightUnit === WeightUnit.POUNDS ? 'lb' : 'g'}` :
                          `${Math.round(duck.weightInGrams)}g`
                        }
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Mutações:</span>
                      <span className="value">{duck.mutationCount}</span>
                    </div>
                    {duck.superPower && (
                      <div className="super-power-tag">
                        <Zap size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> {duck.superPower.name}
                      </div>
                    )}
                    {duck.isCaptured && (
                      <div className="captured-flag">
                        <Target size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> CAPTURADO
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />


      </div>
    </Layout>
  );
};

export default PrimordialDucksPage;