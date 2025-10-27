import React from 'react';
import { Target, Zap } from 'lucide-react';
import { getHibernationStatusName } from '../../enums/index.js';
import './SimpleDuckSelector.css';

const SimpleDuckSelector = ({ ducks, selectedDuck, onDuckSelect }) => {
  const availableDucks = ducks.filter(duck => !duck.isCaptured);

  return (
    <div className="simple-duck-selector">
      <h3><Target size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Selecionar Alvo</h3>
      <select
        value={selectedDuck?.id || ''}
        onChange={(e) => {
          const duck = availableDucks.find(d => d.id === parseInt(e.target.value));
          onDuckSelect(duck);
        }}
        className="duck-select"
      >
        <option value="">Escolha um Pato Primordial</option>
        {availableDucks.map(duck => (
          <option key={duck.id} value={duck.id}>
            {duck.name} - {duck.species}
          </option>
        ))}
      </select>

      {selectedDuck && (
        <div className="duck-details">
          <h4>{selectedDuck.name}</h4>
          <div className="duck-info">
            <p><strong>Status:</strong> {getHibernationStatusName(selectedDuck.hibernationStatus)}</p>
            <p><strong>Altura:</strong> {selectedDuck.height}cm</p>
            <p><strong>Peso:</strong> {selectedDuck.weight}g</p>
            <p><strong>Mutações:</strong> {selectedDuck.mutationCount}</p>
            {selectedDuck.superPowers && selectedDuck.superPowers.length > 0 && (
              <div className="powers">
                <Zap size={16} />
                <span>Poderes: {selectedDuck.superPowers.length}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleDuckSelector;