import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalCount, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const renderPaginationInfo = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    return `${start}-${end} de ${totalCount}`;
  };

  if (totalCount === 0) return null;

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        {renderPaginationInfo()}
      </div>
      
      <div className="pagination-controls">
        <button 
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <ChevronsLeft size={16} />
        </button>
        
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <ChevronLeft size={16} />
        </button>
        
        <span className="page-info">
          Página {currentPage} de {totalPages}
        </span>
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          <ChevronRight size={16} />
        </button>
        
        <button 
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      <div className="page-size-selector">
        <label>
          Itens por página:
          <select 
            value={pageSize} 
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default Pagination;