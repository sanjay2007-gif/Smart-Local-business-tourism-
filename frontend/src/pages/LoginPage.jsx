import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');

      // Role based smart redirect
      if (user.role === 'admin') navigate('/dashboard/admin');
      else if (user.role === 'business_owner') navigate('/dashboard/owner');
      else navigate('/dashboard/tourist');
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid email or password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for demo/student testing
  const quickFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password@123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to TerraLocal
          </h2>
          <p className="text-xs text-slate-500">
            Access your bookings, favorites, or business portal
          </p>
        </div>

        {/* Demo Fast-fill Buttons for Student Testing */}
        <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
            Student Quick-Fill Credentials:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickFill('tourist@example.com')}
              className="py-1 px-2 rounded-lg bg-white text-emerald-900 font-semibold text-[11px] hover:bg-emerald-100 transition shadow-xs border border-emerald-200"
            >
              Tourist
            </button>
            <button
              type="button"
              onClick={() => quickFill('owner@example.com')}
              className="py-1 px-2 rounded-lg bg-white text-emerald-900 font-semibold text-[11px] hover:bg-emerald-100 transition shadow-xs border border-emerald-200"
            >
              Host / Owner
            </button>
            <button
              type="button"
              onClick={() => quickFill('admin@example.com')}
              className="py-1 px-2 rounded-lg bg-white text-emerald-900 font-semibold text-[11px] hover:bg-emerald-100 transition shadow-xs border border-emerald-200"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don&apos;t have an account yet? </span>
          <Link to="/register" className="font-semibold text-emerald-700 hover:underline">
            Register now
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;