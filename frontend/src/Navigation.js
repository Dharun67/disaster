import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Clock, Menu, X, ChevronDown } from 'lucide-react';
import authService from './services/authService';
import './theme.css';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    const userData = authService.getUser();
    if (userData) {
      setUser(userData);
    }

    const updateSessionTime = () => {
      const timeRemaining = authService.getSessionTimeRemaining();
      setSessionTime(timeRemaining);
    };

    updateSessionTime();
    const interval = setInterval(updateSessionTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const formatSessionTime = (minutes) => {
    if (minutes > 1440) {
      const days = Math.floor(minutes / 1440);
      return `${days}d`;
    }
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h`;
    }
    return `${minutes}m`;
  };

  // Hide navigation on login page
  if (location.pathname === '/login') {
    return null;
  }

  const menuItems = [
    { label: '📊 Dashboard', path: '/dashboard' },
    {
      label: '🗺️ Maps & Routing',
      submenu: [
        { label: 'Smart Routing', path: '/routing' },
        { label: 'Advanced Flood Map', path: '/advanced-map' }
      ]
    },
    {
      label: '📈 Analytics & ML',
      submenu: [
        { label: 'Advanced Analytics', path: '/analytics' },
        { label: 'AI Predictions', path: '/ai-predictions' },
        { label: 'ML Analytics Engine', path: '/ml-analytics' }
      ]
    },
    { label: '🏠 Shelters', path: '/shelters' },
    { label: '⭐ Featured', path: '/featured' },
    { label: '🛍️ Marketplace', path: '/marketplace' },
    { label: '👨💼 Admin', path: '/admin' },
    { label: '🚨 Emergency', path: '/emergency' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="navbar-logo-icon">🌍</span>
          <span>GeoGuard</span>
        </div>

        {/* Desktop Menu */}
        <ul className="navbar-menu hidden md:flex">
          {menuItems.map((item, idx) => (
            <li key={idx} className="relative group">
              {item.submenu ? (
                <>
                  <button className="flex items-center gap-1 text-white px-4 py-6 hover:bg-slate-700/50 transition-colors">
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {/* Dropdown */}
                  <div className="absolute left-0 mt-0 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {item.submenu.map((subitem, sidx) => (
                      <a
                        key={sidx}
                        href={subitem.path}
                        className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-primary transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {subitem.label}
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <a
                  href={item.path}
                  className={`flex items-center gap-1 px-4 py-6 border-b-3 transition-all ${
                    isActive(item.path)
                      ? 'border-primary text-primary bg-slate-700/50'
                      : 'border-transparent text-slate-300 hover:text-primary hover:bg-slate-700/30'
                  }`}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="navbar-right">
          <div className="navbar-user hidden sm:flex">
            <span>👤 {user?.name || 'User'}</span>
          </div>
          
          {sessionTime > 0 && (
            <div className="navbar-session hidden sm:flex" title="Session time remaining">
              <Clock className="w-4 h-4" />
              <span>{formatSessionTime(sessionTime)}</span>
            </div>
          )}

          <button className="navbar-logout" onClick={handleLogout} title="Logout">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setExpandedMenu(expandedMenu === idx ? null : idx)}
                    className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-700 flex items-center justify-between"
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedMenu === idx ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expandedMenu === idx && (
                    <div className="bg-slate-700/50">
                      {item.submenu.map((subitem, sidx) => (
                        <a
                          key={sidx}
                          href={subitem.path}
                          className="block px-8 py-2 text-slate-400 hover:text-primary hover:bg-slate-700 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subitem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={item.path}
                  className={`block px-4 py-3 transition-colors ${
                    isActive(item.path)
                      ? 'bg-slate-700 text-primary'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-primary'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
