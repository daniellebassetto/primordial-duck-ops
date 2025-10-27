import React from 'react';
import Modal from '../Modal';
import './CaptureResultModal.css';

const CaptureResultModal = ({ isOpen, onClose, result, selectedDuck, selectedDrone, droneImpact }) => {
  if (!result) return null;

  const getResultVideo = () => {
    if (result.captureResult === 'success') return '/src/assets/videos/pato-perdendo.mp4';
    if (result.captureResult === 'escaped') return '/src/assets/videos/pato-fugindo.mp4';
    return '/src/assets/videos/pato-vencendo.mp4';
  };

  const getResultTitle = () => {
    if (result.captureResult === 'success') return '🎉 CAPTURA REALIZADA!';
    if (result.captureResult === 'escaped') return '💨 ALVO FUGIU!';
    return '💥 MISSÃO FRACASSADA!';
  };

  const getResultDescription = () => {
    const duckName = selectedDuck?.name || `Espécime #${selectedDuck?.id}`;
    if (result.captureResult === 'success') {
      return `O ${duckName} foi capturado com sucesso! A operação foi um êxito total e o espécime está agora sob custódia para estudos científicos.`;
    }
    if (result.captureResult === 'escaped') {
      return `O ${duckName} conseguiu escapar! Suas habilidades primordiais permitiram que ele fugisse da operação de captura.`;
    }
    return `O ${duckName} derrotou nosso drone! Suas capacidades de combate superaram nossa tecnologia militar.`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getResultTitle()}>
      <div className="capture-result-content">
        <div className="result-video-container">
          <video
            src={getResultVideo()}
            autoPlay
            loop
            muted
            className="result-video"
          />
        </div>

        <div className="result-details">
          <p className="result-description">{getResultDescription()}</p>

          <div className="mission-stats">
            <div className="stat-item">
              <span className="stat-label">Alvo:</span>
              <span className="stat-value">{selectedDuck?.name || `Espécime #${selectedDuck?.id}`}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Localização:</span>
              <span className="stat-value">{selectedDuck?.location?.cityName}, {selectedDuck?.location?.country}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Status:</span>
              <span className={`stat-value ${result.captureResult}`}>
                {result.captureResult === 'success' && 'CAPTURADO'}
                {result.captureResult === 'escaped' && 'FUGITIVO'}
                {result.captureResult === 'failed' && 'LIVRE'}
              </span>
            </div>
          </div>

          {droneImpact && selectedDrone && (
            <div className="drone-impact-section">
              <h4>📊 Impacto no Drone: {selectedDrone.model}</h4>
              <div className="impact-stats">
                <div className="impact-item">
                  <span className="impact-label">⛽ Combustível:</span>
                  <div className="impact-bar-container">
                    <div className="impact-bar">
                      <div
                        className="impact-bar-fill fuel"
                        style={{ width: `${droneImpact.newFuel}%` }}
                      />
                    </div>
                    <span className="impact-value">
                      {droneImpact.oldFuel}% → {droneImpact.newFuel}%
                      <span className="impact-reduction">(-{droneImpact.fuelReduction}%)</span>
                    </span>
                  </div>
                </div>

                <div className="impact-item">
                  <span className="impact-label">🔋 Bateria:</span>
                  <div className="impact-bar-container">
                    <div className="impact-bar">
                      <div
                        className="impact-bar-fill battery"
                        style={{ width: `${droneImpact.newBattery}%` }}
                      />
                    </div>
                    <span className="impact-value">
                      {droneImpact.oldBattery}% → {droneImpact.newBattery}%
                      <span className="impact-reduction">(-{droneImpact.batteryReduction}%)</span>
                    </span>
                  </div>
                </div>

                <div className="impact-item">
                  <span className="impact-label">🛡️ Integridade:</span>
                  <div className="impact-bar-container">
                    <div className="impact-bar">
                      <div
                        className="impact-bar-fill integrity"
                        style={{ width: `${droneImpact.newIntegrity}%` }}
                      />
                    </div>
                    <span className="impact-value">
                      {droneImpact.oldIntegrity}% → {droneImpact.newIntegrity}%
                      <span className="impact-reduction">(-{droneImpact.integrityReduction}%)</span>
                    </span>
                  </div>
                </div>
              </div>
              {(droneImpact.newFuel < 20 || droneImpact.newBattery < 20 || droneImpact.newIntegrity < 30) && (
                <div className="drone-warning">
                  ⚠️ Atenção: O drone necessita de manutenção urgente!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CaptureResultModal;