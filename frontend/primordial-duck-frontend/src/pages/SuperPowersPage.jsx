import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import FilterPanel from '../components/common/FilterPanel.jsx';
import Pagination from '../components/common/Pagination.jsx';
import { useToast } from '../components/common/ToastContainer.jsx';
import { superPowerService } from '../services/api';
import { SuperPowerClassification, getClassificationName } from '../enums/index.js';
import './CrudPages.css';

const SuperPowersPage = () => {
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
    name: '',
    description: '',
    classification: null,
    sortBy: '',
    sortDescending: false,
    page: 1,
    pageSize: 9
  });

  const filterConfig = {
    fields: [
      { key: 'name', label: 'Nome', type: 'text', placeholder: 'Buscar por nome...' },
      { key: 'description', label: 'Descrição', type: 'text', placeholder: 'Buscar por descrição...' },
      {
        key: 'classification',
        label: 'Classificação',
        type: 'select',
        placeholder: 'Todas as classificações',
        options: [
          { value: SuperPowerClassification.WARLIKE, label: 'Bélico' },
          { value: SuperPowerClassification.DEFENSIVE, label: 'Defensivo' },
          { value: SuperPowerClassification.ELEMENTAL, label: 'Elemental' },
          { value: SuperPowerClassification.PSYCHIC, label: 'Psíquico' },
          { value: SuperPowerClassification.TECHNOLOGICAL, label: 'Tecnológico' },
          { value: SuperPowerClassification.BIOLOGICAL, label: 'Biológico' },
          { value: SuperPowerClassification.TEMPORAL, label: 'Temporal' },
          { value: SuperPowerClassification.DIMENSIONAL, label: 'Dimensional' }
        ]
      }
    ],
    sortOptions: [
      { value: 'name', label: 'Nome' },
      { value: 'classification', label: 'Classificação' }
    ]
  };





  useEffect(() => {
    const initialFilters = {
      name: '',
      description: '',
      classification: null,
      sortBy: '',
      sortDescending: false,
      page: 1,
      pageSize: 9
    };
    loadData(initialFilters);
  }, []);

  const loadData = async (searchFilters = filters) => {
    try {
      setLoading(true);
      const result = await superPowerService.search(searchFilters);
      setData(result.data);
      setPagination({
        page: result.page,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages
      });
    } catch (error) {
      console.error('Erro ao carregar super poderes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este super poder?')) {
      try {
        await superPowerService.delete(id);
        showSuccess('Super poder excluído com sucesso!');
        loadData();
      } catch (error) {
        console.error('Erro ao excluir super poder:', error);

        let errorMessage = 'Erro ao excluir super poder.';

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
            <h1>Gestão de Super Poderes</h1>
            <p>Catálogo de habilidades especiais</p>
          </div>
          <Link to="/superpowers/new" className="btn btn-primary">
            <Plus size={16} />
            Novo Super Poder
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
              <p>Carregando super poderes...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum super poder encontrado</p>
              <Link to="/superpowers/new" className="btn btn-secondary">
                Cadastrar Primeiro Super Poder
              </Link>
            </div>
          ) : (
            <div className="grid-container">
              {data.map((power) => (
                <div key={power.id} className="grid-card">
                  <div className="card-header">
                    <h3>{power.name}</h3>
                    <div className="card-actions">
                      <Link to={`/superpowers/view/${power.id}`} className="action-btn view" title="Visualizar">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/superpowers/edit/${power.id}`} className="action-btn edit" title="Editar">
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(power.id)}
                        className="action-btn delete"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Descrição:</span>
                    </div>
                    <p className="description">{power.description}</p>
                    <div className="classifications">
                      <span className="classification-tag">
                        {getClassificationName(power.classification)}
                      </span>
                    </div>
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

export default SuperPowersPage;