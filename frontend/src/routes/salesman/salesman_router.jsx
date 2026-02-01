import React, { useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './sa_dashboard';
import AddOrder from './sa_addOrder';
import AddClient from './sa_addclient';
import DailyFiles from './sa_dailyFiles';
import PaymentUpdate from './sa_payment';
import { useGeolocation, LocationPermissionGuard } from './../../hooks/location/useGeolocation';
import { useAddLocation } from '../../hooks/location/useAddLocation';

// Main Routes Component
function SalesmanRoutes() {
  const { mutate: addUserLocation } = useAddLocation();
  const { location } = useGeolocation();

  const intervalRef = useRef(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    if (!location.latitude || !location.longitude) return;

    if (intervalRef.current) return;

    // Send immediately
    addUserLocation({
      latitude: location.latitude,
      longitude: location.longitude
    });

    lastSentRef.current = Date.now();

    // Set up 5-minute interval
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      if (now - lastSentRef.current < 300000) return;

      addUserLocation({
        latitude: location.latitude,
        longitude: location.longitude
      });

      lastSentRef.current = now;
    }, 300000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [location.latitude, location.longitude, addUserLocation]);

  return (
    <Routes>
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/addorder' element={<AddOrder />} />
      <Route path='/addclient' element={<AddClient />} />
      <Route path='/dailyfiles' element={<DailyFiles />} />
      <Route path='/paymentupdate' element={<PaymentUpdate />} />
    </Routes>
  );
}

// Wrapped with Permission Guard
function Salesman_router() {
  return (
    <LocationPermissionGuard>
      <SalesmanRoutes />
    </LocationPermissionGuard>
  );
}

export default Salesman_router;