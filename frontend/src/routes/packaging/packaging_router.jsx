import React from 'react'
import {Routes,Route, Navigate} from 'react-router-dom';
import Dashboard  from './p_dashboard';
import { OrderList } from './p_orderList';
import {OrderDetails} from './p_orderDetails';

function Packaging_router() {
  return (
    <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/orderslist' element={<OrderList />}></Route>
        <Route path='/orderdetails' element={<OrderDetails />}></Route>
        <Route path='/*' element={<Navigate to="/packaging/dashboard" replace />} />
    </Routes>
  )
}

export default Packaging_router