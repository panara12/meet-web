import React, { useState } from 'react'
import Distributer_header from './headers/distributer_header'
import { Outlet } from 'react-router-dom'
import Header from './headers/salesman_header'

function OutletSetup() {
   const [activePanel, setActivePanel] = useState("dashboard")
  return (
    <>
        <Distributer_header>
          <Outlet />              {/* Page content renders inside sidebar's main area */}
        </Distributer_header>
    </>
  )
}

export default OutletSetup