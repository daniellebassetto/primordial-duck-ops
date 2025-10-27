import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ErrorMessage = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="error-message">
      <div className="error-header">
        <span className="error-icon"><AlertTriangle size={20} /></span>
        <span className="error-title">{error.message}</span>
        {onClose && (
          <button className="error-close" onClick={onClose}>
            <X size={16} />
          </button>
        )}
      </div>

      {error.details && error.details.length > 0 && (
        <div className="error-details">
          <ul>
            {error.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;