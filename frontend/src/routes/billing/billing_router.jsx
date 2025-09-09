import React from 'react'
import {Routes,Route} from 'react-router-dom';
import Dashboard from './b_dashboard';

function Billing_router() {
  return (
    <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  )
}

export default Billing_router