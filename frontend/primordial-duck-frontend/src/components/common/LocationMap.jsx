import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const mapStyle = `
  .leaflet-container {
    cursor: crosshair !important;
  }
  .leaflet-clickable {
    cursor: crosshair !important;
  }
  .geocoding-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    color: white;
    font-weight: bold;
  }
  .geocoding-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = mapStyle;
  document.head.appendChild(styleElement);
}

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationPicker = ({ onLocationSelect, setIsProcessing }) => {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setIsProcessing(true);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt-BR`
        );
        const data = await response.json();

        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || 'Cidade não encontrada';
        const country = data.address?.country || 'País não encontrado';

        onLocationSelect(lat, lng, city, country);
      } catch (error) {
        console.error('Erro na geocodificação:', error);
        onLocationSelect(lat, lng, 'Cidade não encontrada', 'País não encontrado');
      } finally {
        setIsProcessing(false);
      }
    },
  });
  return null;
};

const MapUpdater = ({ latitude, longitude }) => {
  const map = useMapEvents({});

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 10);
    }
  }, [latitude, longitude, map]);

  return null;
};

const LocationMap = ({ latitude, longitude, onLocationChange }) => {
  const center = [latitude || -14.235, longitude || -51.9253];
  const zoom = latitude && longitude ? 10 : 6;
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLocationSelect = (lat, lng, city, country) => {
    onLocationChange(lat, lng, city, country);
  };

  const geocodeAddress = async (city, country) => {
    if (!city || !country) return;

    setIsGeocoding(true);
    try {
      const query = `${city}, ${country}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=pt-BR`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        onLocationChange(lat, lng, city, country, true);
      }
    } catch (error) {
      console.error('Erro na geocodificação:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    if (onLocationChange.geocodeAddress) {
      onLocationChange.geocodeAddress = geocodeAddress;
    }
  }, []);

  return (
    <div className="location-map">
      {(isGeocoding || isProcessing) && (
        <div className="geocoding-overlay">
          <div className="geocoding-spinner"></div>
          <span>{isProcessing ? 'Processando clique...' : 'Localizando no mapa...'}</span>
        </div>
      )}
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={2}
        maxZoom={18}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          noWrap={true}
          bounds={[[-90, -180], [90, 180]]}
        />
        <LocationPicker onLocationSelect={handleLocationSelect} setIsProcessing={setIsProcessing} />
        <MapUpdater latitude={latitude} longitude={longitude} />
        {latitude && longitude && (
          <Marker position={[latitude, longitude]} />
        )}
      </MapContainer>
    </div>
  );
};

LocationMap.geocodeAddress = null;

export default LocationMap;