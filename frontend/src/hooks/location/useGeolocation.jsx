import { useEffect, useState } from "react";

export default function useGeolocation() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {

    const successHandler = (pos) => {
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    };


    navigator.geolocation.getCurrentPosition(
      successHandler
    );
  }, []);

  return location;
}
