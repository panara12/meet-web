import { useState, useEffect } from "react";
import axios from "axios";

const useReverseGeocode = (lat, lng) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchLocation = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.GOOGLE_MAP_API_KEY; // keep it safe in .env
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );

        if (res.data.status === "OK") {
          setLocation(res.data.results[0].formatted_address);
        } else {
          setError("No location found");
        }
      } catch (err) {
        setError("Error fetching location");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [lat, lng]);

  return { location, loading, error };
};

export default useReverseGeocode;
