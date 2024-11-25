import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { Church } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/events', label: 'Events' },
  { path: '/contact', label: 'Contact' },
  {path: '/blog', label: 'Blog'}
];

export function MainNav() {
  return (
    <nav className="bg-[#006297] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <RouterLink to="/" className="flex items-center space-x-2 group">
            <Church className="w-8 h-8 group-hover:text-[#BAD975] transition-colors" />
            <span className="text-xl font-bold group-hover:text-[#BAD975] transition-colors">
              Lifestream
            </span>
          </RouterLink>
          
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
        </div>
      </div>
    </nav>
  );
}