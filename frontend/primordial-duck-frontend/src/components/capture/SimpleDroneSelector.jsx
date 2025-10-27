import React from 'react';
import { Battery, Fuel, Shield } from 'lucide-react';
import './SimpleDroneSelector.css';

const SimpleDroneSelector = ({ drones, selectedDrone, onDroneSelect }) => {
  return (
    <div className="simple-drone-selector">
      <h3>🚁 Selecionar Drone</h3>
      <select 
        value={selectedDrone?.id || ''} 
        onChange={(e) => {
          const drone = drones.find(d => d.id === parseInt(e.target.value));
          onDroneSelect(drone);
        }}
        className="drone-select"
      >
        <option value="">Escolha um drone de combate</option>
        {drones.map(drone => (
          <option key={drone.id} value={drone.id}>
            {drone.model} - {drone.serialNumber}
          </option>
        ))}
      </select>

      {selectedDrone && (
        <div className="drone-details">
          <h4>{selectedDrone.model}</h4>
          <div className="drone-stats">
            <div className="stat">
              <Battery size={16} />
              <span>Bateria: {selectedDrone.batteryLevel}%</span>
            </div>
            <div className="stat">
              <Fuel size={16} />
              <span>Combustível: {selectedDrone.fuelLevel}%</span>
            </div>
            <div className="stat">
              <Shield size={16} />
              <span>Integridade: {selectedDrone.integrity}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleDroneSelector;