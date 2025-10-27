import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Carregando...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;