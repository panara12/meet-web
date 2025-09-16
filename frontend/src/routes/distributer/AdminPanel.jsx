import React, { useEffect, useMemo, useState } from "react"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UsersRound,
  Package,
  Receipt,
  Settings as SettingsIcon,
  Menu,
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
import Settings from "./Settings.jsx"

// Single-file Admin Panel (JSX)
// This file consolidates the admin UI into one manageable component with minimal subcomponents.

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
  { id: "settings", label: "Settings", icon: SettingsIcon }
]

function PanelShell({ title, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground p-4 sm:p-6">
        {children}
      </div>
    </div>
  )
}

function Placeholder({ label, description }) {
  return (
    <div className="text-sm text-muted-foreground">
      <p className="mb-2">{description || "This section is customizable."}</p>
      <div className="rounded-md border bg-muted/30 p-4">
        <div className="font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">Build your UI here in this file.</div>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const [active, setActive] = useState("dashboard")

  // simple hash router to preserve selection with refresh
  useEffect(() => {
    const initial = window.location.hash.replace('#','')
    if (initial) setActive(initial)
    const onHash = () => setActive(window.location.hash.replace('#','') || 'dashboard')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (window.location.hash.replace('#','') !== active) {
      window.location.hash = active
    }
  }, [active])

  const activeLabel = useMemo(() => navigationItems.find(n => n.id === active)?.label || 'Dashboard', [active])

  const items = navigationItems
  const render = () => {
    switch (active) {
      case 'dashboard': return <Dashboard />
      case 'clients': return <ClientList />
      case 'sales': return <SalesPanel />
      case 'staff': return <StaffAccount />
      case 'inventory': return <Inventory />
      case 'company': return <Company />
      case 'packaging': return <Packaging />
      case 'billing': return <Billing />
      case 'payments': return <Payments />
      case 'settings': return <Settings />
      default: return <Dashboard />
    }
  }

  return (
    <Layout title={activeLabel} items={items} activeId={active} onSelect={setActive}>
      {render()}
    </Layout>
  )
}


