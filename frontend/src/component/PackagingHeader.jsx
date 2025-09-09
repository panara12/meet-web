import { Package, LogOut } from 'lucide-react';

function PackagingHeader({ title = "Package Manager" }) {
  return (
    <header className="bg-[#1E3986] text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Left section with logo and title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold truncate">
            {title}
          </h1>
        </div>

        {/* Right section with logout button */}
        <div className="flex items-center">
          <button 
            className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-md transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default PackagingHeader