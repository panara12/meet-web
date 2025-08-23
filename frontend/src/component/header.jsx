import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const Header = () => {
  const userInfo = useSelector((state) => state.app.userInfo);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Terms & Conditions', href: '/terms' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg relative border-b border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand Name */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#3b82f6] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-xl font-bold text-[#1e293b]">
                Bhavya Marketing
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="text-[#64748b] hover:text-[#3b82f6] transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
            <div>
              <span>Hello, {userInfo?.user_email}</span>
            </div>
          </nav>

          {/* Mobile/Tablet Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleMenu}
              className="text-[#64748b] hover:text-[#3b82f6] transition-colors duration-200 p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Slide Menu */}
      <div 
        className={`md:hidden fixed top-16 left-0 w-full bg-white border-t border-[#e2e8f0] shadow-lg transition-all duration-300 ease-in-out z-40 ${
          isMenuOpen 
            ? 'opacity-100 visible transform translate-y-0' 
            : 'opacity-0 invisible transform -translate-y-4'
        }`}
      >
        <nav className="px-4 py-4 space-y-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="block text-[#64748b] hover:text-[#3b82f6] transition-colors duration-200 font-medium py-2 border-b border-[#e2e8f0] last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;