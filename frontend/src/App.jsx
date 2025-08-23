import { useState } from 'react'
import {Route,Routes,BrowserRouter} from 'react-router-dom'
import './App.css'
import Home from './routes/Home'
import OutletSetup from './component/Outlet'
import User_tracker from './routes/User_tracker'
import ProductDetail from './routes/ProductDetail'
import Contact from './routes/Contact'
import Login from './routes/Login'
import DashboardLayout from './component/DashboardLayout'
import Dashboard from './routes/Dashboard'
import Seller from './routes/Seller'
import Salesman from './routes/Salesman'
import Packaging from './routes/Packaging'
import Payment from './routes/Payment'
import UserProfile from './routes/UserProfile'
import Product from './routes/Product'
import AllProductList from './routes/AllProductList'
import ProtectedRoute from './component/ProtectedRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route element={<OutletSetup/>}>
            <Route index element={<Home/>}></Route>
            <Route path="/product/:id" element={<ProductDetail/>}></Route>
            <Route path="/contact" element={<Contact/>}></Route>
          </Route>
          
          {/* Dashboard Routes - Temporarily Public (No Auth Required) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="seller" element={<Seller />} />
            <Route path="salesman" element={<Salesman />} />
            <Route path="packaging" element={<Packaging />} />
            <Route path="product" element={<Product />} />
            <Route path="product/all" element={<AllProductList />} />
            <Route path="payment" element={<Payment />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
