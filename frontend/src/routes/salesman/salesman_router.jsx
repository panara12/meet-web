import React, { useEffect, useRef } from 'react'
import {Routes,Route} from 'react-router-dom';
import Dashboard from './sa_dashboard';
import AddOrder  from './sa_addOrder';
import AddClient from './sa_addclient';
import DailyFiles from './sa_dailyFiles';
import PaymentUpdate from './sa_payment';
import useGeolocation from '../../hooks/location/useGeolocation';
import { useAddLocation } from '../../hooks/location/useAddLocation';

function Salesman_router() {
  const { mutate: addUserLocation } = useAddLocation();
  const location = useGeolocation();

  const intervalRef = useRef(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    if (!location.latitude || !location.longitude) return;

    // ⛔ Prevent multiple intervals
    if (intervalRef.current) return;

    // ✅ Send once immediately
    addUserLocation({
      latitude: location.latitude,
      longitude: location.longitude
    });

    lastSentRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();

      // ⛔ Extra safety: time-based throttle
      if (now - lastSentRef.current < 300000) return;

      addUserLocation({
        latitude: location.latitude,
        longitude: location.longitude
      });

      lastSentRef.current = now;

    }, 300000); // 5 minutes

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [location.latitude, location.longitude]);

  return (
    <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/addorder' element={<AddOrder />} />
        <Route path='/addclient' element={<AddClient />} />
        <Route path='/addfiles' element={<DailyFiles />} />
        <Route path='/paymentupdate' element={<PaymentUpdate />} />
    </Routes>
  )
}

export default Salesman_router