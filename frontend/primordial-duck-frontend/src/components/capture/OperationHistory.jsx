import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, ClipboardList, Target, Plane } from 'lucide-react';
import { CaptureStatus, getCaptureStatusName, getCaptureResultName } from '../../enums/index.js';
import './OperationHistory.css';

const OperationHistory = ({ operations }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case CaptureStatus.SUCCESS:
        return <CheckCircle size={16} className="status-success" />;
      case CaptureStatus.FAILED:
        return <XCircle size={16} className="status-failed" />;
      case CaptureStatus.IN_PROGRESS:
        return <Clock size={16} className="status-progress" />;
      case CaptureStatus.ABORTED:
        return <AlertTriangle size={16} className="status-aborted" />;
      default:
        return <Clock size={16} className="status-preparing" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getOperationDuration = (operation) => {
    if (!operation.endTime) return 'Em andamento...';

    const start = new Date(operation.startTime);
    const end = new Date(operation.endTime);
    const duration = Math.round((end - start) / 1000);

    return `${duration}s`;
  };

  return (
    <div className="operation-history">
      {operations.length === 0 ? (
        <div className="no-operations">
          <p>Nenhuma operação registrada ainda</p>
        </div>
      ) : (
        <div className="operations-list">
          {operations.slice(0, 10).map(operation => (
            <div key={operation.id} className={`operation-item ${getCaptureStatusName(operation.status).toLowerCase()}`}>
              <div className="operation-header">
                <div className="operation-status">
                  {getStatusIcon(operation.status)}
                  <span>{getCaptureStatusName(operation.status)}</span>
                </div>
              </div>

              <div className="operation-details">
                <div className="operation-target">
                  <strong><Target size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Alvo:</strong> {operation.primordialDuck?.nickname || `Espécime #${operation.primordialDuck?.id || 'N/A'}`}
                </div>
                <div className="operation-drone">
                  <strong><Plane size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Drone:</strong> {operation.drone?.serialNumber || 'N/A'}
                </div>
              </div>

              <div className="operation-strategy">
                <div className="strategy-text">
                  <strong>Estratégia:</strong> {operation.strategy}
                </div>
                <div className="defense-text">
                  <strong>Defesa:</strong> {operation.defenseGenerated}
                </div>
              </div>

              {operation.captureResult && (
                <div className="operation-result">
                  <strong>Resultado:</strong> {getCaptureResultName(operation.captureResult)}
                </div>
              )}

              <div className="operation-footer">
                <span className="operation-time">
                  {formatDate(operation.startTime)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OperationHistory;