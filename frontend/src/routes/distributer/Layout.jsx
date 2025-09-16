import React from "react"
import { Menu } from "lucide-react"

const THEME = {
  primary: "#1E3986",
  primaryText: "#ffffff",
  activeBg: "#ffffff",
  activeText: "#1E3986",
  hoverBg: "rgba(255,255,255,0.12)",
}

export default function Layout({ title, items, activeId, onSelect, children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside
        className={`w-64 shrink-0 ${sidebarOpen ? "block" : "hidden"} sm:block`}
        style={{ backgroundColor: THEME.primary, color: THEME.primaryText }}
      >
        <div className="p-4 border-b border-white/15">
          <div className="text-lg font-semibold truncate">OrderFlow</div>
          <div className="text-xs opacity-80">Admin Panel</div>
        </div>
        <nav className="p-2 space-y-1">
          {items.map((item) => {
            const isActive = activeId === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect?.(item.id)
                  setSidebarOpen(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors"
                style={{
                  backgroundColor: isActive ? THEME.activeBg : "transparent",
                  color: isActive ? THEME.activeText : THEME.primaryText,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = THEME.hoverBg
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <item.icon className="h-4 w-4" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header
          className="p-3 sm:p-4"
          style={{ backgroundColor: THEME.primary, color: THEME.primaryText }}
        >
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="p-2 rounded-md sm:hidden"
              style={{ backgroundColor: "transparent", color: THEME.primaryText }}
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="capitalize text-lg sm:text-xl lg:text-2xl font-medium truncate">
              {title}
            </h1>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}


