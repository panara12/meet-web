import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  UserPlus,
  FileText,
  CreditCard,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/salesman/dashboard" },
  { title: "Add Order", icon: ShoppingCart, path: "/salesman/addorder" },
  { title: "Add Client", icon: UserPlus, path: "/salesman/addclient" },
  { title: "Daily Files", icon: FileText, path: "/salesman/dailyfiles" },
  { title: "Payment Update", icon: CreditCard, path: "/salesman/paymentupdate" },
  // { title: "Settings", icon: Settings, path: "/salesman/settings" },
];

const menuItemsWithoutPayment = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/salesman/dashboard" },
  { title: "Add Order", icon: ShoppingCart, path: "/salesman/addorder" },
  { title: "Add Client", icon: UserPlus, path: "/salesman/addclient" },
  { title: "Daily Files", icon: FileText, path: "/salesman/dailyfiles" },
  // { title: "Settings", icon: Settings, path: "/salesman/settings" },
];

export default function Sidebar({sidebarOpen,setSidebarOpen}) {
  const navigate = useNavigate();
  const location = useLocation();
  const limitsInfo = useSelector((state) => state.app.limits);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1E3986] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center h-16 px-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#1E3986] font-bold text-lg">SM</span>
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">Sales Manager</h2>
              <p className="text-sm text-blue-200">Order Management</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto p-1 rounded-md text-blue-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          {limitsInfo?.wantToUsePayment && menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 mb-1 text-left rounded-lg transition-colors ${
                  isActive
                    ? "bg-white text-[#1E3986]"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.title}</span>
              </button>
            );
          })}
          {!limitsInfo?.wantToUsePayment && menuItemsWithoutPayment.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 mb-1 text-left rounded-lg transition-colors ${
                  isActive
                    ? "bg-white text-[#1E3986]"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
