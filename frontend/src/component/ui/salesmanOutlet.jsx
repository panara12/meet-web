import { Outlet } from "react-router-dom";
import Sidebar from "../ui/salesman_sidebar";
import Header from "../headers/salesman_header";
import { useState } from "react";

export default function SalesmanOutlet() {
  
  const [sidebarOpen,setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen">
      {/* Sidebar (fixed width) */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

        {/* Routed Pages */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}
