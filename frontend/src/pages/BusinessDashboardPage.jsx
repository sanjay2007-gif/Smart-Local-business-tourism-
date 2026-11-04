import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Store,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Trash2,
  X,
  TrendingUp,
  Users
} from 'lucide-react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const BusinessDashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'listings'
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Listing Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('homestay');
  const [destinationId, setDestinationId] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(10.0889);
  const [lng, setLng] = useState(77.0595);
  const [pricePerUnit, setPricePerUnit] = useState(1500);
  const [pricingUnit, setPricingUnit] = useState('per_night');
  const [imageUrl, setImageUrl] = useState('');
  const [amenities, setAmenities] = useState('WiFi, Breakfast, Mountain View');
  const [tags, setTags] = useState('wellness, trekking');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [listRes, bookRes, destRes] = await Promise.all([
        api.get('/businesses/owner/my-listings'),
        api.get('/bookings/owner-bookings'),
        api.get('/destinations')
      ]);
      setListings(listRes.data.data);
      setBookings(bookRes.data.data);
      setDestinations(destRes.data.data);
      if (destRes.data.data.length > 0) {
        setDestinationId(destRes.data.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load owner data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      showToast(`Booking marked as ${status}.`, 'success');
      fetchInitialData();
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/businesses/${listingId}`);
      showToast('Listing removed.', 'info');
      fetchInitialData();
    } catch (err) {
      showToast('Failed to delete listing.', 'error');
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/businesses', {
        name,
        category,
        destination: destinationId,
        description,
        address,
        location: { lat: Number(lat), lng: Number(lng) },
        pricePerUnit: Number(pricePerUnit),
        pricingUnit,
        images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
        amenities: amenities.split(',').map((s) => s.trim()).filter(Boolean),
        tags: tags.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
        contactPhone
      });

      showToast('New local business listed successfully!', 'success');
      setModalOpen(false);
      setName('');
      setDescription('');
      fetchInitialData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create listing.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Metrics
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Local Business Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-0.5">{user?.name}</h1>
          <p className="text-xs text-emerald-200/80 mt-1">Manage listings, guest bookings, and fair earnings</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Business Listing
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Listings</span>
          <p className="text-2xl font-extrabold text-slate-900">{listings.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Bookings Received</span>
          <p className="text-2xl font-extrabold text-slate-900">{bookings.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Confirmed Revenue</span>
          <p className="text-2xl font-extrabold text-emerald-700">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
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
          Guest Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold transition ${
            activeTab === 'listings'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store className="w-4 h-4 text-emerald-600" />
          My Listings ({listings.length})
        </button>
      </div>

      {/* Tab 1: Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No guest bookings yet</h3>
              <p className="text-xs text-slate-400 mt-0.5">Incoming reservations from tourists will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {b.bookingId}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
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

                    <h4 className="font-bold text-sm text-slate-900">{b.business?.name}</h4>
                    <p className="text-xs text-slate-500">
                      Tourist: <strong className="text-slate-800">{b.tourist?.name}</strong> • Phone: {b.contactPhone || b.tourist?.phone || 'Not provided'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Dates: {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()} ({b.guestsCount} {b.guestsCount === 1 ? 'Guest' : 'Guests'})
                    </p>
                    {b.specialRequests && (
                      <p className="text-[11px] text-slate-500 italic">Special Request: &quot;{b.specialRequests}&quot;</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="text-right sm:pr-4 sm:border-r border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Amount</span>
                      <span className="text-lg font-extrabold text-emerald-700">₹{b.totalAmount?.toLocaleString()}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {b.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(b._id, 'confirmed')}
                            className="px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                          >
                            Accept & Confirm
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(b._id, 'cancelled')}
                            className="px-3 py-1.5 rounded-xl font-bold text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(b._id, 'completed')}
                          className="px-3 py-1.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((biz) => (
              <div key={biz._id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={biz.images && biz.images.length > 0 ? biz.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}
                      alt={biz.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">
                      {biz.category.replace('_', ' ')}
                    </span>
                    <span className="font-bold text-slate-800">₹{biz.pricePerUnit?.toLocaleString()}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{biz.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{biz.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${biz.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {biz.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                  <button
                    onClick={() => handleDeleteListing(biz._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Listing Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Add Listing</span>
                <h2 className="text-xl font-bold text-slate-900">Register Local Tourism Experience</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business / Experience Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardamom Hillside Homestay"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  >
                    <option value="homestay">Homestay / Stay</option>
                    <option value="tour_guide">Tour Guide & Treks</option>
                    <option value="artisan">Artisan Studio</option>
                    <option value="restaurant">Local Dining</option>
                    <option value="cultural_activity">Cultural Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Region</label>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  >
                    {destinations.map((d) => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pricing Unit</label>
                  <select
                    value={pricingUnit}
                    onChange={(e) => setPricingUnit(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  >
                    <option value="per_night">Per Night</option>
                    <option value="per_person">Per Person</option>
                    <option value="per_tour">Per Tour</option>
                    <option value="per_item">Per Item</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street, Landmark, Town, State"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Host Story</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe your authentic local experience, accommodation details, or guided itinerary..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Photo Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amenities (comma-separated)</label>
                  <input
                    type="text"
                    value={amenities}
                    onChange={(e) => setAmenities(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md disabled:opacity-50"
              >
                {submitting ? 'Submitting Listing...' : 'Publish Experience Listing'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BusinessDashboardPage;