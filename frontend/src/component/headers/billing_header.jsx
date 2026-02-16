import React, { useState } from 'react';
import { LogOut, User, Building2 } from 'lucide-react';

// ImageWithFallback component replacement
function ImageWithFallback({ src, alt, className }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`${className} flex items-center justify-center bg-white/10`}>
        <Building2 className="w-5 h-5 text-white/80" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

// Button component replacement
function Button({ children, variant = 'default', size = 'default', className = '', onClick, ...props }) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-white text-slate-900 hover:bg-white/90',
    outline: 'border border-current bg-transparent hover:bg-current/10'
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-sm'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

// LogoutDialog component replacement
function LogoutDialog({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // console.log('Logging out...');
    setIsOpen(false);
  };

  return (
    <>
      {React.cloneElement(children, { onClick: () => setIsOpen(true) })}
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 w-full max-w-md">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Confirm Logout</h2>
              <p className="text-sm text-gray-600 mt-1">
                Are you sure you want to log out of the system?
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Your original Header code with color changes
function Header() {
  // Use empty string for companyLogo since figma asset isn't available
  const companyLogo = "";

  return (
    <header className="bg-[#1E3986] text-white px-4 py-3 flex items-center justify-between border-b border-[#2A4A9A]">
      <div className="flex items-center gap-3 min-w-0">
        <ImageWithFallback 
          src={companyLogo}
          alt="Company Logo"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain bg-white p-1 flex-shrink-0"
        />
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-medium truncate">Billing Department</h1>
          <p className="text-xs sm:text-sm opacity-80 truncate">Order Management System</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden lg:flex items-center gap-2 text-sm opacity-80">
          <User className="w-4 h-4" />
          <span>Billing Staff</span>
        </div>
        <LogoutDialog>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Logout</span>
          </Button>
        </LogoutDialog>
      </div>
    </header>
  )
}

export default Header