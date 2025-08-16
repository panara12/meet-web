import { useState } from 'react'
import {Route,Routes,BrowserRouter} from 'react-router-dom'
import './App.css'
import Home from './routes/Home'
import Routesno from './component/Routesno'
import User_tracker from './routes/User_tracker'
import ProductDetail from './routes/ProductDetail'
import Contact from './routes/Contact'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Routesno/>}>
            <Route index element={<Home/>}></Route>
            <Route path="/product/:id" element={<ProductDetail/>}></Route>
            <Route path="/contact" element={<Contact/>}></Route>
          </Route>        
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
