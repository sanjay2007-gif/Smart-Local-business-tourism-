import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Heart,
  User,
  Compass,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BusinessCard from '../components/cards/BusinessCard';

const TouristDashboardPage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'favorites' | 'itineraries' | 'profile'
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile edit state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [interests, setInterests] = useState(user?.interests || []);
  const allInterests = ['trekking', 'heritage', 'culinary', 'handicrafts', 'wellness', 'wildlife', 'cultural_festivals', 'water_sports'];

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'bookings') {
        const res = await api.get('/bookings/my-bookings');
        setBookings(res.data.data);
      } else if (activeTab === 'favorites') {
        const res = await api.get('/reviews/favorites');
        setFavorites(res.data.data);
      } else if (activeTab === 'itineraries') {
        const res = await api.get('/itineraries/my-itineraries');
        setItineraries(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      showToast('Booking cancelled.', 'info');
      fetchDashboardData();
    } catch (err) {
      showToast('Failed to cancel booking.', 'error');
    }
  };

  const handleDeleteItinerary = async (itinId) => {
    if (!window.confirm('Delete this saved itinerary?')) return;
    try {
      await api.delete(`/itineraries/${itinId}`);
      showToast('Itinerary removed.', 'info');
      fetchDashboardData();
    } catch (err) {
      showToast('Failed to delete itinerary.', 'error');
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, phone, interests });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile.', 'error');
    }
  };

  const toggleInterest = (tag) => {
    if (interests.includes(tag)) {
      setInterests(interests.filter((t) => t !== tag));
    } else {
      setInterests([...interests, tag]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-300"
          />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Tourist Account
            </span>
            <h1 className="text-2xl font-bold tracking-tight">{user?.name}</h1>
            <p className="text-xs text-emerald-100/80 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            to="/businesses"
            className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-bold hover:bg-emerald-50 transition"
          >
            Explore Experiences
          </Link>
          <Link
            to="/itinerary-planner"
            className="px-4 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 font-bold text-white transition border border-emerald-500/30"
          >
            Plan Itinerary
          </Link>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold transition ${
            activeTab === 'bookings'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-600" />
          My Reservations
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold transition ${
            activeTab === 'favorites'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4 text-emerald-600" />
          Saved Favorites
        </button>

        <button
          onClick={() => setActiveTab('itineraries')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold transition ${
            activeTab === 'itineraries'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-600" />
          My Saved Itineraries
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold transition ${
            activeTab === 'profile'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4 text-emerald-600" />
          Profile & Interests
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : activeTab === 'bookings' ? (
        /* My Bookings */
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No bookings yet</h3>
              <p className="text-xs text-slate-400 mt-0.5">Explore local homestays and guides to make your first booking</p>
              <Link to="/businesses" className="mt-3 inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">
                Browse Experiences
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div key={b._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {b.bookingId}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-1">{b.business?.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {b.business?.destination?.name || b.business?.address}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : b.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Dates</span>
                      <span className="font-semibold text-slate-800">
                        {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total Paid/Due</span>
                      <span className="font-bold text-emerald-700">₹{b.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>

                  {b.specialRequests && (
                    <p className="text-xs text-slate-500 italic">
                      &quot;{b.specialRequests}&quot;
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Contact Host: {b.business?.contactPhone || 'Via Portal'}</span>
                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'favorites' ? (
        /* Favorites */
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No saved favorites yet</h3>
              <p className="text-xs text-slate-400 mt-0.5">Click the heart on any experience to bookmark it here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((biz) => (
                <BusinessCard
                  key={biz._id}
                  business={biz}
                  isFavoriteInitial={true}
                  onFavoriteToggle={() => fetchDashboardData()}
                />
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'itineraries' ? (
        /* Saved Itineraries */
        <div className="space-y-6">
          {itineraries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No saved itineraries</h3>
              <p className="text-xs text-slate-400 mt-0.5">Use the Itinerary Planner to generate and save trip schedules</p>
              <Link to="/itinerary-planner" className="mt-3 inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">
                Generate Itinerary
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {itineraries.map((itin) => (
                <div key={itin._id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        {itin.destination?.name} • {itin.daysCount} Days
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-0.5">{itin.title}</h3>
                    </div>

                    <button
                      onClick={() => handleDeleteItinerary(itin._id)}
                      className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition"
                      title="Delete itinerary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Day previews */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {itin.days?.map((d) => (
                      <div key={d.dayNumber} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1">
                        <span className="font-bold text-emerald-800">Day {d.dayNumber}: {d.theme}</span>
                        <ul className="text-slate-500 space-y-1 mt-1 text-[11px]">
                          {d.activities?.slice(0, 2).map((act, i) => (
                            <li key={i} className="truncate">• {act.title}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Profile & Interests */
        <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Edit Profile & Travel Passions</h2>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700">
                Your Travel Interests (Used to curate personalized suggestions):
              </label>
              <div className="flex flex-wrap gap-2">
                {allInterests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                      interests.includes(interest)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    #{interest.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default TouristDashboardPage;