import React from 'react'
import {Routes,Route} from 'react-router-dom';
import Dashboard from './sa_dashboard';
import AddOrder  from './sa_addOrder';
import AddClient from './sa_addclient';
import DailyFiles from './sa_dailyFiles';
import PaymentUpdate from './sa_payment';

function Salesman_router() {
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