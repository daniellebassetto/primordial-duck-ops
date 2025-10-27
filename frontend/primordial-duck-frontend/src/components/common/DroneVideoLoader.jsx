import React, { useState, useMemo } from 'react';
import videoDrone1 from '../../assets/videos/video-drone-1.mp4';
import videoDrone2 from '../../assets/videos/video-drone-2.mp4';
import './DroneVideoLoader.css';

const DroneVideoLoader = ({ droneId, isVisible }) => {
  const [showControls, setShowControls] = useState(false);
  
  const videoSrc = useMemo(() => {
    return Math.random() > 0.5 ? videoDrone1 : videoDrone2;
  }, [droneId]);
  
  const handleVideoEnd = () => {
    setShowControls(true);
  };

  return (
    <div className="drone-video-loader">
      <video 
        autoPlay 
        muted 
        playsInline
        controls={showControls}
        className="drone-video"
        onEnded={handleVideoEnd}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      {isVisible && (
        <div className="loading-overlay">
          <div className="loading-text">
            <span className="drone-icon">🛡️</span>
            <p>Captando dados do drone...</p>
            <p>📡 Sincronizando sensores</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DroneVideoLoader;