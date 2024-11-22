import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Settings, FileText, Image, Calendar, LogOut } from 'lucide-react';

export const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname === path + '/';
  };

  const navItems = [
    { path: '/admin/posts', icon: FileText, label: 'Posts' },
    { path: '/admin/events', icon: Calendar, label: 'Events' },
    { path: '/admin/media', icon: Image, label: 'Media' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-[#006297] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl">Admin Dashboard</span>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 hover:text-[#BAD975]"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white h-[calc(100vh-4rem)] shadow-md">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map(({ path, icon: Icon, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center space-x-2 p-2 rounded ${
                      isActive(path)
                        ? 'bg-[#006297] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};