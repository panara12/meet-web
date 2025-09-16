import React from "react"
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"

import Dashboard from "./Dashboard.jsx"
import ClientList from "./ClientList.jsx"
import SalesPanel from "./SalesPanel.jsx"
import StaffAccount from "./StaffAccount.jsx"
import Inventory from "./Inventory.jsx"
import Company from "./Company.jsx"
import Packaging from "./Packaging.jsx"
import Billing from "./Billing.jsx"
import Payments from "./Payments.jsx"
import Settings from "./Settings.jsx"

export default function Distributer_router() {

  return (
      <Routes>        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/sales" element={<SalesPanel />} />
        <Route path="/staff" element={<StaffAccount />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/company" element={<Company />} />
        <Route path="/packaging" element={<Packaging />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}
