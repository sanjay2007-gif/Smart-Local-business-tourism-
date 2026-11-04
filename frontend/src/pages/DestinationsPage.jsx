import React, { useState, useEffect } from 'react';
import { Compass, Search, Filter } from 'lucide-react';
import api from '../api/axiosClient';
import DestinationCard from '../components/cards/DestinationCard';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category !== 'all') params.set('category', category);

        const res = await api.get(`/destinations?${params.toString()}`);
        setDestinations(res.data.data);
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [category, search]);

  const categories = [
    { id: 'all', label: 'All Destinations' },
    { id: 'hill_station', label: 'Hill Stations' },
    { id: 'heritage', label: 'Heritage & Culture' },
    { id: 'beach', label: 'Coastal Havens' },
    { id: 'wildlife', label: 'Wildlife Reserves' },
    { id: 'rural', label: 'Rural & Tribal' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">
          Regional Destinations
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Sacred Landscapes & Native Regions
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Discover unique regional ecosystems, UNESCO heritage zones, and biodiversity hotspots supported by local communities.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search state or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                category === c.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[3/4] bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No destinations found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <DestinationCard key={dest._id} destination={dest} />
          ))}
        </div>
      )}

    </div>
  );
};

export default DestinationsPage;