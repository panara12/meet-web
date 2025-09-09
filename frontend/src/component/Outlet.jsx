import React from 'react'
import PackagingHeader from './PackagingHeader'
import { Outlet } from 'react-router-dom'
import Header from './headers/salesman_header'

function OutletSetup() {
  return (
    <>
        <PackagingHeader/>
        <Outlet />
    </>
  )
}

export default OutletSetup