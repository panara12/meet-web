import React from 'react'
import Header from './DashboardHeader'
import { Outlet } from 'react-router-dom'

function OutletSetup() {
  return (
    <>
        <Header/>
        <Outlet />
    </>
  )
}

export default OutletSetup