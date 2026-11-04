import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Store,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isTourist, isBusinessOwner, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Destinations', path: '/destinations', icon: Compass },
    { name: 'Businesses', path: '/businesses', icon: Store },
    { name: 'Interactive Map', path: '/map', icon: MapPin },
    { name: 'Itinerary Planner', path: '/itinerary-planner', icon: Calendar },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-emerald-soft shadow-md group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-emerald-950 block leading-tight">
                Terra<span className="text-emerald-600">Local</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-700">
                Smart Tourism Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Auth Section */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Role specific quick dashboard link */}
                {isTourist && (
                  <Link
                    to="/dashboard/tourist"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100/70 text-emerald-800 text-xs font-semibold hover:bg-emerald-200 transition"
                  >
                    <User className="w-3.5 h-3.5" />
                    My Bookings
                  </Link>
                )}
                {isBusinessOwner && (
                  <Link
                    to="/dashboard/owner"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold hover:bg-amber-200 transition"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    Business Portal
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/dashboard/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 text-purple-900 text-xs font-semibold hover:bg-purple-200 transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Portal
                  </Link>
                )}

                {/* Profile Pill */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-emerald-300"
                  />
                  <div className="text-left text-xs leading-none">
                    <p className="font-semibold text-slate-800 truncate max-w-[100px]">{user.name}</p>
                    <span className="text-[10px] text-emerald-700 font-medium capitalize">{user.role.replace('_', ' ')}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-4 h-4 text-emerald-600" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-300"
                  />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                {isTourist && (
                  <Link
                    to="/dashboard/tourist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-sm font-semibold"
                  >
                    Tourist Dashboard
                  </Link>
                )}
                {isBusinessOwner && (
                  <Link
                    to="/dashboard/owner"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-100 text-amber-900 text-sm font-semibold"
                  >
                    Business Owner Dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/dashboard/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-100 text-purple-900 text-sm font-semibold"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 py-2 rounded-xl text-rose-600 bg-rose-50 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-sm font-semibold text-white bg-emerald-600 rounded-xl shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;