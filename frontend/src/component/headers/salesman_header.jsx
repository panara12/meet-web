import { useRef, useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { useLogout } from "../../hooks/auth/useLogOut";
import { useAddLocation } from "../../hooks/location/useAddLocation";
import { useGeolocation } from "../../hooks/location/useGeolocation";
import { useSelector } from "react-redux";

export default function Header({sidebarOpen,setSidebarOpen}) {
  const userInfo = useSelector((state) => state.app.userInfo);
  const {mutate:logout} = useLogout();
  
  const { mutate: addUserLocation,isPending:isAddLocationPending } = useAddLocation({
    onSuccess:()=>{
      logout();
    }
  });
  const { location } = useGeolocation();

  const handleLogout = () => {
    if(userInfo.user_role == "salesman"){
      // Send immediately
      addUserLocation({
          latitude: location.latitude,
          longitude: location.longitude
        });
    }
    logout();
  };

  return (
    <div className="flex bg-gray-50">

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-[#1E3986] border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-white hover:bg-white/10 mr-2"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-white">
                Sales Manager
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
