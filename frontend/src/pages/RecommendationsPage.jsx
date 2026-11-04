import React, { useState, useEffect } from 'react';
import { Sparkles, Navigation, MapPin, Tag } from 'lucide-react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BusinessCard from '../components/cards/BusinessCard';

const RecommendationsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('personalized'); // 'personalized' | 'nearby'
  const [personalizedItems, setPersonalizedItems] = useState([]);
  const [nearbyItems, setNearbyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interest tags
  const allInterests = ['trekking', 'heritage', 'culinary', 'handicrafts', 'wellness', 'wildlife', 'cultural_festivals', 'water_sports'];
  const [selectedInterests, setSelectedInterests] = useState(user?.interests || ['heritage', 'culinary', 'trekking']);

  // Geo state
  const [geoCoords, setGeoCoords] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // Fetch personalized recommendations
  const fetchPersonalized = async (interests) => {
    try {
      setLoading(true);
      const res = await api.get(`/recommendations/personalized?interests=${interests.join(',')}`);
      setPersonalizedItems(res.data.data);
    } catch (err) {
      console.error('Failed to load personalized suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'personalized') {
      fetchPersonalized(selectedInterests);
    }
  }, [activeTab]);

  const toggleInterest = (tag) => {
    let updated;
    if (selectedInterests.includes(tag)) {
      if (selectedInterests.length <= 1) return; // Keep at least one
      updated = selectedInterests.filter(t => t !== tag);
    } else {
      updated = [...selectedInterests, tag];
    }
    setSelectedInterests(updated);
    fetchPersonalized(updated);
  };

  // Browser Geolocation discovery
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeoCoords({ lat: latitude, lng: longitude });
        try {
          const res = await api.get(`/recommendations/nearby?lat=${latitude}&lng=${longitude}&radiusKm=1000`);
          setNearbyItems(res.data.data);
          showToast(`Found ${res.data.data.length} local experiences nearest to your location!`, 'success');
        } catch (err) {
          showToast('Failed to retrieve nearby businesses.', 'error');
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        // Fallback to Munnar or Karnataka coordinates if user denies browser prompt
        showToast('Location permission denied or unavailable. Using regional coordinates for demo.', 'info');
        fetchNearbyFallback(10.0889, 77.0595);
      }
    );
  };

  const fetchNearbyFallback = async (lat, lng) => {
    setGeoLoading(true);
    try {
      const res = await api.get(`/recommendations/nearby?lat=${lat}&lng=${lng}&radiusKm=1000`);
      setNearbyItems(res.data.data);
      setGeoCoords({ lat, lng });
    } catch (e) {
      console.error(e);
    } finally {
      setGeoLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">
          Intelligent Tourism Discovery
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Smart Travel Recommendations
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Powered by interest matching and Haversine geospatial proximity calculation to connect you with unforgettable local experiences.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('personalized')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-bold transition ${
            activeTab === 'personalized'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Personalized by Interests
        </button>

        <button
          onClick={() => {
            setActiveTab('nearby');
            if (nearbyItems.length === 0) handleUseLocation();
          }}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-bold transition ${
            activeTab === 'nearby'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Navigation className="w-4 h-4 text-emerald-600" />
          Location-Based Discovery (GPS)
        </button>
      </div>

      {/* Tab 1: Personalized View */}
      {activeTab === 'personalized' && (
        <div className="space-y-6">
          
          {/* Interest Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Select Your Travel Passions to Tailor Recommendations:
            </h3>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                      active
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    #{interest.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Top recommendations matching {selectedInterests.join(', ')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalizedItems.map((biz) => (
                  <div key={biz._id} className="relative">
                    {biz.recommendationReason && (
                      <div className="mb-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{biz.recommendationReason}</span>
                      </div>
                    )}
                    <BusinessCard business={biz} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Location-Based View */}
      {activeTab === 'nearby' && (
        <div className="space-y-6">
          
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-emerald-950">
                Spatial Proximity Search (Haversine Algorithm)
              </h3>
              <p className="text-xs text-emerald-800/80">
                Calculates true spherical surface distance from your GPS coordinates to all registered local hosts.
              </p>
            </div>

            <button
              onClick={handleUseLocation}
              disabled={geoLoading}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Navigation className="w-4 h-4" />
              {geoLoading ? 'Detecting GPS...' : 'Refresh My Location'}
            </button>
          </div>

          {geoCoords && (
            <div className="text-xs text-slate-500 font-medium">
              Reference Coordinates: {geoCoords.lat.toFixed(4)}° N, {geoCoords.lng.toFixed(4)}° E
            </div>
          )}

          {geoLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : nearbyItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Click &quot;Refresh My Location&quot; to calculate nearest local businesses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyItems.map((biz) => (
                <div key={biz._id} className="relative">
                  <div className="mb-2 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold flex items-center justify-between">
                    <span>{biz.distanceKm} km away</span>
                    <span className="text-[10px] text-teal-600 font-normal">Haversine Calculated</span>
                  </div>
                  <BusinessCard business={biz} />
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default RecommendationsPage;