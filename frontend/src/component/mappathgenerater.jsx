import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px' // Increased height for better visualization
};

// --- Your API Key from .env ---
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;


function RoadsMapComponent({coordinates}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });
  console.log("Path Points:", coordinates);
  const defaultMapOptions = {
      zoom: 15, // A good default zoom level for a local path
      center: coordinates[0] || { lat: 0, lng: 0 } // Center on the first point, or 0,0 if no points
  };
  const [snappedPath, setSnappedPath] = useState([]);
  const [map, setMap] = useState(null);

  // Function to call the Roads API
  const fetchSnappedPath = useCallback(async () => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API Key is not set.");
      return;
    }

    // Format raw coordinates for the API request
    const pathString = coordinates.map(coord => `${coord.lat},${coord.lng}`).join('|');

    try {
      const response = await fetch(
        `https://roads.googleapis.com/v1/snapToRoads?path=${pathString}&interpolate=true&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (response.ok && data.snappedPoints) {
        const newSnappedPath = data.snappedPoints.map(point => ({
          lat: point.location.latitude,
          lng: point.location.longitude,
        }));
        setSnappedPath(newSnappedPath);
        
      } else {
        console.error("Error snapping path:", data.error?.message || "Unknown error");
        setSnappedPath(coordinates); // Fallback to raw if snapping fails
      }
    } catch (error) {
      console.error("Network error fetching snapped path:", error);
      setSnappedPath(coordinates); // Fallback to raw on network error
    }
  }, []);

  // Fetch snapped path when component mounts
  useEffect(() => {
    fetchSnappedPath();
  }, [fetchSnappedPath]); // Dependency array includes fetchSnappedPath

  // Callback when the map loads
  const onLoad = useCallback(function callback(map) {
    setMap(map);
    // You could fit bounds here if you wanted the map to automatically zoom
    // const bounds = new window.google.maps.LatLngBounds();
    // rawCoordinates.forEach(coord => bounds.extend(coord));
    // map.fitBounds(bounds);
  }, []);

  // Callback when the map unloads
  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultMapOptions.center}
      zoom={defaultMapOptions.zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        fullscreenControl: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false
      }}
    >


      <Polyline
        path={snappedPath.length > 0 ? snappedPath : coordinates}
        options={{
          strokeColor: '#2563eb',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        }}
      />

      {/* Optionally, you can add Markers for the start and end of the path */}
      {coordinates.length > 0 && (
          <>
            <Polyline
                path={[coordinates[0]]}
                options={{
                    icons: [{
                        icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#00AA00', // Green start circle
                            fillOpacity: 1,
                            strokeWeight: 0
                        },
                        offset: '0%'
                    }]
                }}
            />
            <Polyline
                path={[coordinates[coordinates.length - 1]]}
                options={{
                    icons: [{
                        icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#AA0000', // Red end circle
                            fillOpacity: 1,
                            strokeWeight: 0
                        },
                        offset: '0%'
                    }]
                }}
            />
          </>
      )}

    </GoogleMap>
  ) : (
    <div>Loading Maps...</div>
  );
}

export default React.memo(RoadsMapComponent);
