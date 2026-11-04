import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Layers, Navigation } from 'lucide-react';
import api from '../api/axiosClient';
import TourismMap from '../components/map/TourismMap';
import { Link } from 'react-router-dom';

const InteractiveMapPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bizRes, destRes] = await Promise.all([
          api.get('/businesses/map'),
          api.get('/destinations')
        ]);
        setBusinesses(bizRes.data.data);
        setDestinations(destRes.data.data);
      } catch (err) {
        console.error('Failed to load map data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBusinesses = businesses.filter((b) => {
    const matchCat = selectedCategory === 'all' || b.category === selectedCategory;
    const matchDest = selectedDestination === 'all' || b.destination?._id === selectedDestination;
    return matchCat && matchDest;
  });

  const categories = [
    { id: 'all', label: 'All Markers' },
    { id: 'homestay', label: 'Homestays' },
    { id: 'tour_guide', label: 'Guides & Treks' },
    { id: 'artisan', label: 'Artisans' },
    { id: 'restaurant', label: 'Local Dining' },
    { id: 'cultural_activity', label: 'Workshops' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">
            Spatial Discovery
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Interactive Tourism Map
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore verified homestays, trekking paths, and craft studios mapped across regions.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Destination dropdown */}
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl bg-white border border-slate-200 font-semibold text-slate-700 shadow-sm"
          >
            <option value="all">All Regions</option>
            {destinations.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCategory === c.id
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Map Box */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="h-[600px] w-full rounded-2xl bg-slate-200 animate-pulse flex items-center justify-center">
              <span className="text-xs text-slate-500 font-semibold">Loading OpenStreetMap tiles...</span>
            </div>
          ) : (
            <TourismMap
              businesses={filteredBusinesses}
              height="600px"
              zoom={6}
            />
          )}
        </div>

        {/* Quick Pin List Sidebar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm h-[600px] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Visible Pins ({filteredBusinesses.length})
            </h3>
          </div>

          {filteredBusinesses.map((biz) => (
            <Link
              key={biz._id}
              to={`/businesses/${biz._id}`}
              className="block p-3 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition group"
            >
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition truncate">
                {biz.name}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {biz.destination?.name || biz.address}
              </p>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/60 text-[11px]">
                <span className="font-bold text-emerald-800">
                  ₹{biz.pricePerUnit?.toLocaleString()} /{biz.pricingUnit?.replace('per_', '')}
                </span>
                <span className="text-slate-400 capitalize">{biz.category?.replace('_', ' ')}</span>
              </div>
            </Link>
          ))}
        </div>

      </div>

    </div>
  );
};

export default InteractiveMapPage;