import React, { useState, useEffect } from 'react';
import { Plane, Target, PartyPopper, Wind } from 'lucide-react';
import './CaptureAnimation.css';

const CaptureAnimation = ({ isVisible, success, onComplete }) => {
  const [phase, setPhase] = useState('approaching');

  useEffect(() => {
    if (isVisible) {
      setPhase('approaching');

      const timer1 = setTimeout(() => setPhase('capturing'), 1000);
      const timer2 = setTimeout(() => setPhase('result'), 2000);
      const timer3 = setTimeout(() => {
        onComplete();
        setPhase('approaching');
      }, 3500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="capture-animation-overlay">
      <div className="animation-container">
        {phase === 'approaching' && (
          <div className="phase approaching">
            <div className="drone-anim"><Plane size={48} /></div>
            <div className="duck-anim"><Target size={48} /></div>
            <div className="text">Drone se aproximando...</div>
          </div>
        )}

        {phase === 'capturing' && (
          <div className="phase capturing">
            <div className="drone-anim capturing"><Plane size={48} /></div>
            <div className="duck-anim capturing"><Target size={48} /></div>
            <div className="capture-effect"></div>
            <div className="text">Executando captura...</div>
          </div>
        )}

        {phase === 'result' && (
          <div className={`phase result ${success ? 'success' : 'failure'}`}>
            <div className="result-icon">
              {success ? <PartyPopper size={64} /> : <Wind size={64} />}
            </div>
            <div className="result-text">
              {success ? 'Pato Capturado!' : 'Pato Escapou!'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptureAnimation;