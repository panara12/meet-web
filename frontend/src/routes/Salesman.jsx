import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

function LiveLocationMap() {
  const [showMap, setShowMap] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    if (showMap && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          alert("Unable to retrieve your location.");
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [showMap]);

  return (
    <div className="relative flex justify-center items-center w-full h-[500px]">
      {!showMap ? (
        // Blurred background with button
        <div className="w-full h-full relative">
          {/* Blurred background */}
          <div className="absolute inset-0 bg-gray-200 backdrop-blur-md"></div>

          {/* Button stays clear, above blur */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              onClick={() => setShowMap(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition"
            >
              Get Live Location
            </button>
          </div>
        </div>
      ) : (
        <LoadScript googleMapsApiKey={import.meta.env.GOOGLE_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition || { lat: 20.5937, lng: 78.9629 }}
            zoom={currentPosition ? 15 : 5}
          >
            {currentPosition && <Marker position={currentPosition} />}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
}

export default LiveLocationMap;
