import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function User_tracker() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  useEffect(() => {
    const geo = navigator.geolocation;
    geo.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        console.log("lat", position.coords.latitude);
        console.log("lng", position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, []);

  const icon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [30, 30],
  });

  // Don't render the map until we have a position
  if (lat === null || lng === null) {
    return <div>Loading location...</div>;
  }

  const position = [lat, lng];

  return (
    <div>
      <h2>Get User Location</h2>
      <MapContainer center={position} zoom={5} style={{ height: '800px', width: '70%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <Marker position={position} icon={icon}>
          <Popup>Your Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default User_tracker;
