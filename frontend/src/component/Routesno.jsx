import React from 'react'
import Header from './header'
import { Outlet } from 'react-router-dom'

function Routesno() {
  return (
    <>
        <Header/>
        <Outlet />
    </>
  )
}

export default Routesno