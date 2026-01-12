import React from "react"
import { Menu, LogOut } from "lucide-react"

const THEME = {
  primary: "#1E3986",
  primaryText: "#ffffff",
  activeBg: "#ffffff",
  activeText: "#1E3986",
  hoverBg: "rgba(255,255,255,0.12)",
}

export default function Layout({ title, items, activeId, onSelect, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-2 left-2 z-50 p-2 rounded-md text-black bg-transparent"
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ backgroundColor: THEME.primary }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white border-opacity-20">
          <h1 className="ml-10 text-xl font-bold" style={{ color: THEME.primaryText }}>
            {title}
          </h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeId

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id)
                  setSidebarOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left"
                style={{
                  backgroundColor: isActive ? THEME.activeBg : 'transparent',
                  color: isActive ? THEME.activeText : THEME.primaryText,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = THEME.hoverBg
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout Button */}
        {onLogout && (
          <div className="p-4 border-t border-white border-opacity-20">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left"
              style={{ color: THEME.primaryText }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = THEME.hoverBg
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </aside>


        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto lg:ml-0">
          {children}
        </main>
    </div>
  )
}