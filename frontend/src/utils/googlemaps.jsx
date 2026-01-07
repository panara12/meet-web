import { useJsApiLoader } from '@react-google-maps/api';

// Google Maps configuration
const GOOGLE_MAPS_CONFIG = {
  id: 'google-map-script',
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  libraries: ['places', 'geometry']
};

// Custom hook to use Google Maps API
export const useGoogleMaps = () => {
  return useJsApiLoader(GOOGLE_MAPS_CONFIG);
};

// Common container styles
export const mapContainerStyles = {
  default: {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
  },
  large: {
    width: '100%',
    height: '600px',
    borderRadius: '0.5rem'
  }
};

// Common map options
export const defaultMapOptions = {
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: true,
  fullscreenControl: true,
};

export const simpleMapOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};