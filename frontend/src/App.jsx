import {Route,Routes,BrowserRouter} from 'react-router-dom'
import './App.css'
import Login from './routes/auth/Login'
import Distributer_router from './routes/distributer/distributer_router'
import Seller_router from './routes/seller/seller_router'
import Salesman_router from './routes/salesman/salesman_router'
import ProtectedRoute from './routes/ProtectedRoute'
import { LoadingPage } from './mainLoadingTemplate/LoadingPage'
import PasswordReset from './routes/auth/ForgotPasswordPage'
import OTPVerification from './routes/auth/OTPverification'
import ResetPasswordPage from './routes/auth/resetPassword'
import Packaging_router from './routes/packaging/packaging_router'
import Billing_router from './routes/billing/billing_router'
import SalesmanOutlet from './component/ui/salesmanOutlet'
import { useState } from 'react'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/loading" element={<LoadingPage/>}></Route>
          <Route path="/forgotpassword" element={<PasswordReset/>}></Route>
          <Route path="/resetpassword" element={<ResetPasswordPage/>}></Route>
          <Route path="/otpverification" element={<OTPVerification />}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/" element={<Login/>}></Route>
          <Route element={<ProtectedRoute/>}>
              <Route path='/distributer/*' element={<Distributer_router />}></Route>
              <Route path='/seller/*' element={<Seller_router />}></Route>
              <Route path='/billing/*'  element={<Billing_router />}></Route>
              <Route path='/packaging/*' element={<Packaging_router />}></Route>
            <Route element={<SalesmanOutlet />}>
              <Route path='/salesman/*' element={<Salesman_router />}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
