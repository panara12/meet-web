import React, { useState } from "react"
import {Link} from 'react-router-dom'
import {
  Menu,
  LayoutDashboard,
  Users,
  UserCheck,
  UsersRound,
  Package,
  Receipt,
  Settings,
  Warehouse,
  Building2,
  CreditCard,
  X
} from "lucide-react"

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

export default function Distributer_header({ children, activeId = "dashboard", onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuToggle = () => {
    setSidebarOpen(prev => !prev)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }


  const activeLabel = navigationItems.find(item => item.id === activeId)?.label || 'Dashboard'

  return (
    <div className="flex min-h-screen w-full">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-gray-200 flex-shrink-0
        ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex lg:flex-col'}
      `}>
        {/* Sidebar Header */}
        <div className="border-b border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">OF</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-semibold text-sm sm:text-base truncate">OrderFlow</span>
                <span className="text-xs sm:text-sm text-gray-500 truncate">Admin Panel</span>
              </div>
            </div>
            <button 
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
              onClick={handleCloseSidebar}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {navigationItems.map((item) => {
            const isActive = activeId === item.id
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                to={"/distributer/"+item.id}
                className={`
                  w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/95 backdrop-blur p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
              onClick={handleMenuToggle}
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="capitalize text-lg sm:text-xl lg:text-2xl font-medium truncate">
              {activeLabel}
            </h1>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}