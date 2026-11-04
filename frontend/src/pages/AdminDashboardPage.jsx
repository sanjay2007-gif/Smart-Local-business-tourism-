import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Store,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Trash2,
  Search
} from 'lucide-react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'businesses' | 'bookings'
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [businessesList, setBusinessesList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'overview') {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsersList(res.data.data);
      } else if (activeTab === 'businesses') {
        const res = await api.get('/businesses');
        setBusinessesList(res.data.data);
      } else if (activeTab === 'bookings') {
        const res = await api.get('/admin/bookings');
        setBookingsList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerify = async (businessId) => {
    try {
      const res = await api.put(`/admin/businesses/${businessId}/verify`);
      showToast(res.data.message, 'success');
      fetchAdminData();
    } catch (err) {
      showToast('Failed to toggle verification.', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      showToast('User deleted.', 'info');
      fetchAdminData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user.', 'error');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      showToast('User role updated.', 'success');
      fetchAdminData();
    } catch (err) {
      showToast('Failed to change role.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
            Platform Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-0.5">Admin Central Console</h1>
          <p className="text-xs text-slate-300 mt-1">Supervise community members, business verifications, and platform bookings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-3 border-b-2 text-xs font-bold transition ${
            activeTab === 'overview'
              ? 'border-purple-600 text-purple-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview Metrics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 border-b-2 text-xs font-bold transition ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab('businesses')}
          className={`px-5 py-3 border-b-2 text-xs font-bold transition ${
            activeTab === 'businesses'
              ? 'border-purple-600 text-purple-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Verify Businesses
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-3 border-b-2 text-xs font-bold transition ${
            activeTab === 'bookings'
              ? 'border-purple-600 text-purple-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Platform Bookings
        </button>
      </div>

      {/* Tab 1: Overview */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : activeTab === 'overview' && stats ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
              <p className="text-2xl font-extrabold text-slate-900">{stats.users.total}</p>
              <span className="text-[11px] text-emerald-700 font-medium">{stats.users.tourists} Tourists • {stats.users.owners} Hosts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Businesses</span>
              <p className="text-2xl font-extrabold text-slate-900">{stats.businesses.total}</p>
              <span className="text-[11px] text-emerald-700 font-medium">{stats.businesses.verified} Verified</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
              <p className="text-2xl font-extrabold text-slate-900">{stats.bookings.total}</p>
              <span className="text-[11px] text-emerald-700 font-medium">{stats.bookings.confirmed} Confirmed</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gross Platform Value</span>
              <p className="text-2xl font-extrabold text-emerald-700">₹{stats.bookings.totalRevenue?.toLocaleString()}</p>
              <span className="text-[11px] text-slate-400 font-medium">100% to local community</span>
            </div>
          </div>
        </div>
      ) : activeTab === 'users' ? (
        /* Tab 2: Users Management */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {usersList.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50">
                  <td className="p-4 flex items-center gap-2 font-bold text-slate-800">
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                    {u.name}
                  </td>
                  <td className="p-4 text-slate-600">{u.email}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="px-2 py-1 rounded bg-slate-100 border border-slate-200 font-semibold text-xs"
                    >
                      <option value="tourist">tourist</option>
                      <option value="business_owner">business_owner</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="text-slate-400 hover:text-rose-600 transition"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'businesses' ? (
        /* Tab 3: Businesses Moderation */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">Business</th>
                <th className="p-4">Category</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Verification Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {businessesList.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{b.name}</td>
                  <td className="p-4 text-slate-600 capitalize">{b.category.replace('_', ' ')}</td>
                  <td className="p-4 text-slate-600">{b.destination?.name || 'Local'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {b.isVerified ? 'Verified' : 'Pending / Suspended'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleVerify(b._id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        b.isVerified ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {b.isVerified ? 'Revoke Verification' : 'Verify & Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Tab 4: All Bookings Audit */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Tourist</th>
                <th className="p-4">Business</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {bookingsList.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono font-bold text-slate-700">{b.bookingId}</td>
                  <td className="p-4 text-slate-800 font-semibold">{b.tourist?.name}</td>
                  <td className="p-4 text-slate-600">{b.business?.name}</td>
                  <td className="p-4 font-bold text-emerald-700">₹{b.totalAmount?.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;