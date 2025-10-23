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
  console.log("Layout rendered with activeId:", activeId);
  const handleClick = (itemId) => {
    console.log("handleClick called with:", itemId)
    console.log("onSelect is:", typeof onSelect)
    if (onSelect) {
      onSelect(itemId)
    } else {
      console.error("onSelect is not a function!")
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside
        className={`fixed sm:relative z-40 w-64 h-screen shrink-0 ${
          sidebarOpen ? "block" : "hidden"
        } sm:block overflow-hidden`}
        style={{ backgroundColor: THEME.primary, color: THEME.primaryText }}
      >
        <div className="p-4 border-b border-white/15">
          <div className="text-lg font-semibold truncate">OrderFlow</div>
          <div className="text-xs opacity-80">Admin Panel</div>
        </div>
        <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {items && items.length > 0 ? (
            items.map((item) => {
              console.log(item)
              const isActive = activeId === item.id
              const IconComponent = item.icon

              return (
                <>
                <div>working</div>
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    console.log("Button clicked:", item.id)
                    handleClick(item.id)
                    setSidebarOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? THEME.activeBg : "transparent",
                    color: isActive ? THEME.activeText : THEME.primaryText,
                    fontWeight: isActive ? "600" : "400",
                  }}
                  
                >
                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate text-sm" onClick={()=>{console.log("cliekcd")}}>{item.label}</span>
                </button>
                </>
              )
            })
          ) : (
            <p className="text-sm p-2">No items</p>
          )}
        </nav>
      </aside>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <header
          className="p-3 sm:p-4 border-b"
          style={{ backgroundColor: THEME.primary, color: THEME.primaryText }}
        >
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="p-2 rounded-md sm:hidden hover:opacity-80 transition-opacity"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="capitalize text-lg sm:text-xl lg:text-2xl font-semibold truncate">
              {title}
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}