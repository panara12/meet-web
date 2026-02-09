import React from 'react'
import {Routes,Route} from 'react-router-dom';

function Seller_router() {
  return (
    <Routes>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path="seller" element={<Seller />} />
        <Route path="salesman" element={<Salesman />} />
        <Route path="packaging" element={<Packaging />} />
        <Route path="product" element={<Product />} />
        <Route path="product/all" element={<AllProductList />} />
        <Route path="payment" element={<Payment />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="addproduct" element={<ProductAddScreen />} />
    </Routes>
  )
}

export default Seller_router