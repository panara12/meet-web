import {Route,Routes,BrowserRouter} from 'react-router-dom'
import './App.css'
import OutletSetup from './component/Outlet'
import Login from './routes/auth/Login'
import Distributer_router from './routes/distributer/distributer_router'
import Seller_router from './routes/seller/seller_router'
import Salesman_router from './routes/salesman/salesman_router'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/" element={<Login/>}></Route>
          <Route element={<ProtectedRoute/>}>
            <Route element={<OutletSetup/>}>
              <Route path='/distributer/*' element={<Distributer_router />}></Route>
              <Route path='/saller/*' element={<Seller_router />}></Route>
              <Route path='/salesman/*' element={<Salesman_router />}></Route>
              {/* <Route path='/billing/*'></Route>
              <Route path='/packaging/*'></Route> */}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
