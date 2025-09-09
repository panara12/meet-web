import React from 'react'
import {Routes,Route} from 'react-router-dom';
import Dashboard from './sa_dashboard';
// import { AddOrder } from './sa_addOrder';

function Salesman_router() {
  return (
    <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        {/* <Route path='/addorder' element={<AddOrder />} /> */}
    </Routes>
  )
}

export default Salesman_router