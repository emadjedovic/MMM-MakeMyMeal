import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ onLocationSelect }) => {
  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        onLocationSelect(e.latlng);
      },
    });
    return null;
  };

  return (
    /* Sarajevo [43.8486, 18.3564] */
    <MapContainer center={[43.8486, 18.3564]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default Map;
