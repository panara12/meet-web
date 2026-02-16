import React from "react"
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UsersRound,
  Package,
  Receipt,
  Settings,
  Warehouse,
  Building2,
  CreditCard
} from "lucide-react"

import Layout from "./Layout"
import Dashboard from "./Dashboard.jsx"
import ClientList from "./ClientList.jsx"
import SalesPanel from "./SalesPanel.jsx"
import StaffAccount from "./StaffAccount.jsx"
import Inventory from "./Inventory.jsx"
import Company from "./Company.jsx"
import Packaging from "./Packaging.jsx"
import Billing from "./Billing.jsx"
import Payments from "./Payments.jsx"
import SettingsPanel from "./Settings.jsx"

import { InventoryProvider } from "./InventoryContext"
import { CompanyProvider } from "./CompanyContext.jsx"
import { StaffProvider } from "./StaffContext"
import { FileManagementProvider } from "./FileManagementContext.jsx"
import { SettingsProvider } from "./SettingsContext.jsx"
import { useLogout } from "../../hooks/auth/useLogOut.jsx"
import { useSelector } from "react-redux"

let navigationItems =[]

function LayoutWrapper({ children,limitsInfo }) {
  const location = useLocation()
  const navigate = useNavigate()
  const {mutate:logout} = useLogout();

  if(limitsInfo?.wantToUsePayment){
      navigationItems =  [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/distributer/dashboard" },
      { id: "clients", label: "Client List", icon: Users, path: "/distributer/clients" },
      { id: "sales", label: "Staff Panel", icon: UserCheck, path: "/distributer/sales" },
      { id: "staff", label: "Staff Account", icon: UsersRound, path: "/distributer/staff" },
      { id: "inventory", label: "Catalogue", icon: Warehouse, path: "/distributer/catalogue" },
      { id: "company", label: "Company", icon: Building2, path: "/distributer/company" },
      { id: "packaging", label: "Packaging", icon: Package, path: "/distributer/packaging" },
      { id: "payments", label: "Payment Confirmations", icon: CreditCard, path: "/distributer/payments" },
      { id: "settings", label: "Settings", icon: Settings, path: "/distributer/settings" }
    ]
  }else{
      navigationItems =  [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/distributer/dashboard" },
      { id: "clients", label: "Client List", icon: Users, path: "/distributer/clients" },
      { id: "sales", label: "Staff Panel", icon: UserCheck, path: "/distributer/sales" },
      { id: "staff", label: "Staff Account", icon: UsersRound, path: "/distributer/staff" },
      { id: "inventory", label: "Catalogue", icon: Warehouse, path: "/distributer/catalogue" },
      { id: "company", label: "Company", icon: Building2, path: "/distributer/company" },
      { id: "packaging", label: "Packaging", icon: Package, path: "/distributer/packaging" },
      { id: "settings", label: "Settings", icon: Settings, path: "/distributer/settings" }
    ]
  }

  // Find active item based on current route
  const activeItem = navigationItems.find(item => 
    location.pathname === item.path
  ) || navigationItems[0]

  const handleSelect = (id) => {
    const item = navigationItems.find(n => n.id === id)
    if (item) {
      navigate(item.path)
    }
  }

  const handleLogout = () => {
    
    logout();
    // console.log("Logout clicked")
    // Clear any stored tokens/data
    localStorage.removeItem('token') // adjust based on your auth implementation
    // Redirect to login page
    window.location.href = '/login' // or use navigate('/login') if login is in the same router
  }

  return (
    <Layout
      title={activeItem.label}
      items={navigationItems}
      activeId={activeItem.id}
      onSelect={handleSelect}
      onLogout={handleLogout}
    >
      {children}
    </Layout>
  )
}

export default function Distributer_router() {
  const limitsInfo = useSelector((state) => state.app.limits);
  return (
    <SettingsProvider>
      <StaffProvider>
        <FileManagementProvider>
          <CompanyProvider>
            <InventoryProvider>
              <LayoutWrapper limitsInfo={limitsInfo}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/clients" element={<ClientList />} />
                  <Route path="/sales" element={<SalesPanel />} />
                  <Route path="/staff" element={<StaffAccount />} />
                  <Route path="/catalogue" element={<Inventory />} />
                  <Route path="/company" element={<Company />} />
                  <Route path="/packaging" element={<Packaging />} />
                  {
                    limitsInfo?.wantToUsePayment &&
                    <Route path="/payments" element={<Payments />} />
                  }
                  <Route path="/settings" element={<SettingsPanel />} />
                  <Route path="*" element={<Navigate to="/distributer/dashboard" replace />} />
                </Routes>
              </LayoutWrapper>
            </InventoryProvider>
          </CompanyProvider>
        </FileManagementProvider>
      </StaffProvider>
    </SettingsProvider>
  )
}