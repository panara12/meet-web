import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { useGoogleMaps, mapContainerStyles, simpleMapOptions } from '../utils/googlemaps';

function DirectionsMapComponent({ coordinates }) {
  // Use the common Google Maps loader
  const { isLoaded } = useGoogleMaps();
  
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [map, setMap] = useState(null);
  
  // Define origin, destination, and waypoints from coordinates
  const origin = { 
    lat: coordinates[0]?.lat || 38.8950, 
    lng: coordinates[0]?.lng || -77.0366 
  };
  
  const destination = { 
    lat: coordinates[coordinates.length - 1]?.lat || 38.8892, 
    lng: coordinates[coordinates.length - 1]?.lng || -77.0506 
  };
  
  const waypoints = [];
  for (let i = 1; i < coordinates.length - 1; i++) {
    waypoints.push({
      location: { lat: coordinates[i]?.lat, lng: coordinates[i]?.lng },
      stopover: true
    });
  }
  
  // Function to calculate and display the route using Directions API
  const calculateRoute = useCallback(() => {
    if (!isLoaded) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      }
    );
  }, [isLoaded, origin.lat, origin.lng, destination.lat, destination.lng]);

  // Calculate route when component mounts or dependencies change
  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  }, [isLoaded, calculateRoute]);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
    // Fit bounds to the route once it's loaded
    if (directionsResponse && map) {
      const bounds = new window.google.maps.LatLngBounds();
      directionsResponse.routes[0].legs.forEach(leg => {
        leg.steps.forEach(step => {
          step.lat_lngs.forEach(latlng => {
            bounds.extend(latlng);
          });
        });
      });
      map.fitBounds(bounds);
    }
  }, [directionsResponse]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
      <GoogleMap
        mapContainerStyle={mapContainerStyles.large}
        center={origin}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={simpleMapOptions}
      >
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              polylineOptions: {
                strokeColor: '#0000FF',
                strokeOpacity: 0.8,
                strokeWeight: 6,
              },
              suppressMarkers: false,
            }}
          />
        )}
      </GoogleMap>
  );
}

export default React.memo(DirectionsMapComponent);