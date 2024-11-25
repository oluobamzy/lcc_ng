
import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { Church, Menu, X } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/admin/login', label: 'Portal' },
  { path: '/events', label: 'Events' },
  { path: '/contact', label: 'Contact' },
  { path: '/blog', label: 'Blog' },
];

export function MainNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#006297] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <RouterLink to="/" className="flex items-center space-x-2 group">
            <Church className="w-8 h-8 group-hover:text-[#BAD975] transition-colors" />
            <span className="text-xl font-bold group-hover:text-[#BAD975] transition-colors">
              Lifestream
            </span>
          </RouterLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label }) => (
              <RouterLink
                key={path}
                to={path}
                className={({ isActive }) => `
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${isActive 
                    ? 'text-[#BAD975] bg-white/10' 
                    : 'hover:text-[#BAD975] hover:bg-white/5'
                  }
                `}
              >
                {label}
              </RouterLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex flex-col space-y-3 mt-4">
            {navItems.map(({ path, label }) => (
              <RouterLink
                key={path}
                to={path}
                className={({ isActive }) => `
                  block px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${isActive 
                    ? 'text-[#BAD975] bg-white/10' 
                    : 'hover:text-[#BAD975] hover:bg-white/5'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
              >
                {label}
              </RouterLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
