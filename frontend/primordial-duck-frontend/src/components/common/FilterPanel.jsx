import React, { useState } from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import './FilterPanel.css';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  onReset,
  loading = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({});

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearch = () => {
    onSearch(localFilters);
  };

  const handleReset = () => {
    const resetFilters = Object.keys(localFilters).reduce((acc, key) => {
      if (key === 'page' || key === 'pageSize') {
        acc[key] = localFilters[key];
      } else {
        acc[key] = '';
      }
      return acc;
    }, {});
    
    setLocalFilters(resetFilters);
    onReset(resetFilters);
  };

  const renderFilterField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            value={localFilters[field.key] || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
            className="filter-input"
          />
        );
      
      case 'select':
        return (
          <select
            value={localFilters[field.key] || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
            className="filter-select"
          >
            <option value="">{field.placeholder}</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            value={localFilters[field.key] || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
            className="filter-input"
            min={field.min}
            max={field.max}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="filter-toggle"
        >
          <Filter size={16} />
          Filtros
          {isExpanded && <span className="filter-count">({Object.values(localFilters).filter(v => v && v !== '').length})</span>}
        </button>
        
        <div className="filter-actions">
          <button 
            onClick={handleReset}
            className="btn-reset"
            disabled={loading}
          >
            <RotateCcw size={16} />
            Limpar
          </button>
          
          <button 
            onClick={handleSearch}
            className="btn-search"
            disabled={loading}
          >
            <Search size={16} />
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="filter-content">
          <div className="filter-grid">
            {filters.fields?.map((field, index) => (
              <div key={index} className="filter-field">
                <label className="filter-label">{field.label}</label>
                {renderFilterField(field)}
              </div>
            ))}
          </div>
          
          {filters.sortOptions && (
            <div className="sort-section">
              <div className="filter-field">
                <label className="filter-label">Ordenar por</label>
                <select
                  value={localFilters.sortBy || ''}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Padrão</option>
                  {filters.sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-field">
                <label className="filter-label">Direção</label>
                <select
                  value={localFilters.sortDescending ? 'desc' : 'asc'}
                  onChange={(e) => handleFilterChange('sortDescending', e.target.value === 'desc')}
                  className="filter-select"
                >
                  <option value="asc">Crescente</option>
                  <option value="desc">Decrescente</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;