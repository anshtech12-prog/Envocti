import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut, Menu, X, User as UserIcon, Globe } from 'lucide-react';
import Logo from '../common/Logo';
import api from '../../services/api';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);

  // Close notifications dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/notifications');
      if (res.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const markRead = async (id) => {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error('Error marking notification read:', err.message);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await api.put('/notifications/read-all');
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all notifications read:', err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'collector') return '/collector';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {isAuthenticated && toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="mr-2 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-emerald-400">
              <Logo className="h-6 w-6" />
              <span>Envocti</span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/awareness" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
              Awareness
            </Link>
            <Link to="/ewaste-map" className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              <Globe className="h-3.5 w-3.5" />
              Global Map
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
                  Dashboard
                </Link>
                
                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown panel */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl ring-1 ring-black/5">
                      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
                        <span className="text-xs font-semibold text-slate-300">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-[10px] font-medium text-emerald-400 hover:text-emerald-300"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto py-1">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-xs text-slate-500">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => !n.isRead && markRead(n._id)}
                              className={`flex flex-col gap-0.5 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                                n.isRead ? 'hover:bg-slate-800/40' : 'bg-slate-800/20 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-medium ${n.isRead ? 'text-slate-300' : 'text-emerald-400'}`}>
                                  {n.title}
                                </span>
                                {!n.isRead && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-2">{n.message}</p>
                              <span className="text-[9px] text-slate-500">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Display */}
                <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                    <span className="text-[10px] font-medium text-slate-500 capitalize">{user.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link
              to="/awareness"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Awareness
            </Link>
            <Link
              to="/ewaste-map"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
            >
              <Globe className="h-3.5 w-3.5" />
              Global Map
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Dashboard
                </Link>
                <div className="border-t border-slate-850 my-2 pt-2">
                  <div className="px-3 py-1 flex flex-col mb-2">
                    <span className="text-xs font-semibold text-slate-300">{user.name}</span>
                    <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 border-t border-slate-850 mt-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-center text-sm font-medium text-slate-300 hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-emerald-500 py-2 text-center text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
