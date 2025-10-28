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
      
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
  )
}


