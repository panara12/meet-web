import React, { useEffect, useState } from "react"
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

// Test with placeholder components
const Dashboard = () => <div className="p-4 bg-white rounded">Dashboard Page</div>
const ClientList = () => <div className="p-4 bg-white rounded">Client List Page</div>
const SalesPanel = () => <div className="p-4 bg-white rounded">Sales Panel Page</div>
const StaffAccount = () => <div className="p-4 bg-white rounded">Staff Account Page</div>
const Inventory = () => <div className="p-4 bg-white rounded">Inventory Page</div>
const Company = () => <div className="p-4 bg-white rounded">Company Page</div>
const Packaging = () => <div className="p-4 bg-white rounded">Packaging Page</div>
const Billing = () => <div className="p-4 bg-white rounded">Billing Page</div>
const Payments = () => <div className="p-4 bg-white rounded">Payments Page</div>
const SettingsPage = () => <div className="p-4 bg-white rounded">Settings Page</div>

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", label: "Client List", icon: Users },
  { id: "sales", label: "Staff Panel", icon: UserCheck },
  { id: "staff", label: "Staff Account", icon: UsersRound },
  { id: "inventory", label: "Inventory", icon: Warehouse },
  { id: "company", label: "Company", icon: Building2 },
  { id: "packaging", label: "Packaging", icon: Package },
  { id: "billing", label: "Billing", icon: Receipt },
  { id: "payments", label: "Payment Confirmations", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings }
]

export default function AdminPanel() {
  const [active, setActive] = useState("dashboard")

  console.log("AdminPanel rendered with active:", active)

  // Initialize from hash on mount
  useEffect(() => {
    console.log("useEffect - Initialize from hash")
    const hash = window.location.hash.slice(1)
    console.log("Hash found:", hash)
    if (hash && navigationItems.some(n => n.id === hash)) {
      console.log("Setting active to:", hash)
      setActive(hash)
    }
  }, [])

  // Update hash when active changes
  useEffect(() => {
    console.log("useEffect - Update hash, active is now:", active)
    window.location.hash = `#${active}`
  }, [active])

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      console.log("Hash changed externally to:", hash)
      if (hash && navigationItems.some(n => n.id === hash)) {
        setActive(hash)
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const activeLabel = navigationItems.find(n => n.id === active)?.label || "Dashboard"

  const renderContent = () => {
    console.log("Rendering content for:", active)
    const componentMap = {
      dashboard: <Dashboard />,
      clients: <ClientList />,
      sales: <SalesPanel />,
      staff: <StaffAccount />,
      inventory: <Inventory />,
      company: <Company />,
      packaging: <Packaging />,
      billing: <Billing />,
      payments: <Payments />,
      settings: <SettingsPage />
    }
    return componentMap[active] || <Dashboard />
  }

  return (
    <Layout 
      title={activeLabel} 
      items={navigationItems} 
      activeId={active} 
      onSelect={(id) => {
        console.log("onSelect callback called with:", id)
        setActive(id)
      }}
    >
      {renderContent()}
    </Layout>
  )
}