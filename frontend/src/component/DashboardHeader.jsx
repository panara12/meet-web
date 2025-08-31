import React, { useState } from 'react';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(false);
    navigate('/distributer/profile');
  };

  const navItems = [
    { name: 'Home', path: 'distributer/dashboard' },
    { name: 'Seller', path: 'distributer/seller' },
    { name: 'Salesman', path: 'distributer/salesman' },
    { name: 'Packaging', path: 'distributer/packaging' },
    { name: 'Product', path: 'distributer/product' },
    { name: 'Payment', path: 'distributer/payment' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand Name - Left Side */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-[#3b82f6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h1 className="text-xl font-bold text-[#1e293b]">
              Meet Dashboard
            </h1>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-[#64748b] hover:text-[#3b82f6] transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-[#f1f5f9]"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Profile - Right Side */}
          <div className="flex items-center space-x-4">
            {/* Desktop Profile */}
            <div className="hidden md:flex items-center space-x-3 relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 text-[#64748b] hover:text-[#3b82f6] transition-colors duration-200 p-2 rounded-md hover:bg-[#f1f5f9]"
              >
                <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">Demo User</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#e2e8f0] z-50">
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-[#64748b] hover:text-[#3b82f6] hover:bg-[#f1f5f9] transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-[#64748b] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout (Disabled)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile/Tablet Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-[#64748b] hover:text-[#3b82f6] transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Slide Menu */}
      <div
        className={`lg:hidden fixed top-16 left-0 w-full bg-white border-t border-[#e2e8f0] shadow-lg transition-all duration-300 ease-in-out z-40 ${
          isMenuOpen
            ? 'opacity-100 visible transform translate-y-0'
            : 'opacity-0 invisible transform -translate-y-4'
        }`}
      >
        <nav className="px-4 py-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="block text-[#64748b] hover:text-[#3b82f6] transition-colors duration-200 font-medium py-2 border-b border-[#e2e8f0] last:border-b-0"
            >
              {item.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-[#e2e8f0]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-[#64748b]">Demo User</span>
            </div>
            <button
              onClick={() => {
                handleProfileClick();
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full text-left text-[#64748b] hover:text-[#3b82f6] transition-colors duration-200 py-2 border-b border-[#e2e8f0]"
            >
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
            <button
              className="flex items-center space-x-2 w-full text-left text-[#64748b] hover:text-[#ef4444] transition-colors duration-200 py-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout (Disabled)</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default DashboardHeader;
