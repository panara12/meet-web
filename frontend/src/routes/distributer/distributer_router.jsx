import React from 'react'
import {Routes,Route} from 'react-router-dom';
import Dashboard from './d_Dashboard';
import Seller from './d_Seller';
import Salesman from './salesman/d_SalesmanDashboard';
import Packaging from './d_Packaging';
import Product from './d_Product';
import AllProductList from './d_AllProductList';
import Payment from './d_Payment';
import UserProfile from './d_UserProfile';
import ProductAddScreen from './d_addproduct';
import AddSalesmanPage from './salesman/d_add_salesman';

function Distributer_router() {
  return (
    <Routes>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path="seller" element={<Seller />} />
        <Route path="salesman" element={<Salesman />} />
        <Route path="salesman/addsalesman" element={<AddSalesmanPage />} />
        <Route path="packaging" element={<Packaging />} />
        <Route path="product" element={<Product />} />
        <Route path="product/all" element={<AllProductList />} />
        <Route path="payment" element={<Payment />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="addproduct" element={<ProductAddScreen />} />
    </Routes>
  )
}

export default Distributer_router